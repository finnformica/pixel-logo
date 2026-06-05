#!/usr/bin/env python3
"""
pixel_extract.py — Extract a pixel-art character map from an upscaled portrait image.

Usage:
    python pixel_extract.py <image_path> [--name MySprite] [--grid NxM]

Outputs JavaScript-ready character map + detected palette to stdout.

Requirements: Pillow  (pip install Pillow)
"""

import argparse
import sys
from pathlib import Path
from collections import Counter
import math


def detect_pixel_size(img):
    """
    Estimate how many screen-pixels wide each art-pixel is by finding the
    most-common run length of identical pixel columns (then rows).
    """
    import numpy as np
    arr = img.convert("RGB")
    w, h = arr.size
    pixels = list(arr.getdata())
    grid = [pixels[r * w:(r + 1) * w] for r in range(h)]

    def run_lengths(seq):
        runs = []
        if not seq:
            return runs
        cur, cnt = seq[0], 1
        for v in seq[1:]:
            if v == cur:
                cnt += 1
            else:
                runs.append(cnt)
                cur, cnt = v, 1
        runs.append(cnt)
        return runs

    # Sample several rows / cols and collect run lengths
    col_runs = []
    for r in range(0, h, max(1, h // 20)):
        col_runs.extend(run_lengths(grid[r]))

    row_runs = []
    for c in range(0, w, max(1, w // 20)):
        col_data = [grid[r][c] for r in range(h)]
        row_runs.extend(run_lengths(col_data))

    # The pixel size is the most common run length (ignore 1-pixel antialiasing runs)
    def most_common_ge2(runs):
        c = Counter(r for r in runs if r >= 2)
        if not c:
            return 1
        return c.most_common(1)[0][0]

    px_w = most_common_ge2(col_runs)
    px_h = most_common_ge2(row_runs)
    return px_w, px_h


def sample_grid(img, px_w, px_h):
    """
    Sample the colour at the centre of each art-pixel cell.
    Returns a 2-D list of (R,G,B) tuples.
    """
    w, h = img.size
    rgb = img.convert("RGB")

    cols = w // px_w
    rows = h // px_h

    grid = []
    for row in range(rows):
        r_center = row * px_h + px_h // 2
        row_data = []
        for col in range(cols):
            c_center = col * px_w + px_w // 2
            row_data.append(rgb.getpixel((c_center, r_center)))
        grid.append(row_data)
    return grid


def color_distance(a, b):
    return math.sqrt(sum((x - y) ** 2 for x, y in zip(a, b)))


def quantize_palette(grid, threshold=30):
    """
    Cluster sampled colours into a compact palette.
    Returns: (palette list of (R,G,B), grid of palette indices)
    """
    palette = []
    idx_grid = []

    for row in grid:
        idx_row = []
        for color in row:
            # find closest existing palette entry
            best_idx = None
            best_dist = float("inf")
            for i, p in enumerate(palette):
                d = color_distance(color, p)
                if d < best_dist:
                    best_dist = d
                    best_idx = i
            if best_dist < threshold:
                idx_row.append(best_idx)
            else:
                palette.append(color)
                idx_row.append(len(palette) - 1)
        idx_grid.append(idx_row)

    return palette, idx_grid


# Character assignment pool (avoid confusing look-alikes)
CHAR_POOL = (
    "abcdefghijklmnopqrstuvwxyz"
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    "0123456789"
    "@#$%^&*-+=~"
)


def assign_chars(palette, bg_color=None, bg_threshold=40):
    """
    Assign a single character to each palette entry.
    The background colour (most common, or explicitly supplied) gets '.'.
    """
    char_map = {}
    pool_idx = 0

    for i, color in enumerate(palette):
        is_bg = False
        if bg_color is not None:
            is_bg = color_distance(color, bg_color) < bg_threshold

        if is_bg:
            char_map[i] = "."
        else:
            char_map[i] = CHAR_POOL[pool_idx % len(CHAR_POOL)]
            pool_idx += 1

    return char_map


def rgb_to_hex(rgb):
    return "#{:02X}{:02X}{:02X}".format(*rgb)


def detect_background(grid, palette, idx_grid):
    """Detect background as the most-common colour in the border cells."""
    border = []
    rows = len(idx_grid)
    cols = len(idx_grid[0]) if rows else 0
    for c in range(cols):
        border.append(idx_grid[0][c])
        border.append(idx_grid[-1][c])
    for r in range(rows):
        border.append(idx_grid[r][0])
        border.append(idx_grid[r][-1])
    if not border:
        return None
    bg_idx = Counter(border).most_common(1)[0][0]
    return palette[bg_idx]


def main():
    parser = argparse.ArgumentParser(description="Extract pixel-art map from image")
    parser.add_argument("image", help="Path to image file")
    parser.add_argument("--name", default="sprite", help="Variable name for output")
    parser.add_argument("--grid", default=None,
                        help="Force art-pixel size, e.g. 24x24 means 24×24 art pixels "
                             "(auto-detected if omitted)")
    parser.add_argument("--threshold", type=int, default=30,
                        help="Colour-cluster threshold (default 30)")
    parser.add_argument("--no-bg", action="store_true",
                        help="Don't treat any colour as background/transparent")
    args = parser.parse_args()

    try:
        from PIL import Image
    except ImportError:
        sys.exit("Pillow not installed. Run: pip install Pillow")

    path = Path(args.image)
    if not path.exists():
        sys.exit(f"File not found: {path}")

    img = Image.open(path)
    w, h = img.size
    print(f"# Image: {path.name}  ({w}×{h} px)", file=sys.stderr)

    if args.grid:
        # --grid gives the art resolution, e.g. 24x24
        # derive px_w/px_h from that
        art_w, art_h = map(int, args.grid.lower().split("x"))
        px_w = w // art_w
        px_h = h // art_h
        print(f"# Forced art grid: {art_w}×{art_h}  (cell {px_w}×{px_h} px)", file=sys.stderr)
    else:
        px_w, px_h = detect_pixel_size(img)
        art_w = w // px_w
        art_h = h // px_h
        print(f"# Detected cell size: {px_w}×{px_h} px  →  art grid {art_w}×{art_h}", file=sys.stderr)

    grid = sample_grid(img, px_w, px_h)
    palette, idx_grid = quantize_palette(grid, threshold=args.threshold)

    if args.no_bg:
        bg_color = None
    else:
        bg_color = detect_background(grid, palette, idx_grid)
        if bg_color:
            print(f"# Detected background: {rgb_to_hex(bg_color)}", file=sys.stderr)

    char_map = assign_chars(palette, bg_color)

    # Build rows
    rows_out = []
    for row in idx_grid:
        rows_out.append("".join(char_map[idx] for idx in row))

    # Print palette JS
    print(f"\n// Palette for {args.name}")
    print("Object.assign(palette, {")
    for i, color in enumerate(palette):
        ch = char_map[i]
        hex_c = rgb_to_hex(color)
        if ch == ".":
            print(f'  // ".": null,  // background {hex_c}')
        else:
            print(f'  {ch}: "{hex_c}",')
    print("});\n")

    # Print sprite JS
    print(f"const {args.name} = [")
    for row_str in rows_out:
        print(f'  "{row_str}",')
    print("];\n")

    # Summary
    used_chars = sorted(set(c for row in rows_out for c in row if c != "."))
    print(f"// {len(rows_out)} rows × {len(rows_out[0]) if rows_out else 0} cols", file=sys.stderr)
    print(f"// {len(palette)} colours  ({len(used_chars)} non-bg)", file=sys.stderr)


if __name__ == "__main__":
    main()
