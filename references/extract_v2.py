#!/usr/bin/env python3
"""
extract_v2.py — Improved headshot pixel map extraction.

Improvements vs pixel_extract.py:
  - 5×5 median sampling per cell  (robust against JPEG boundary noise)
  - Quantisation threshold=50     (snaps through JPEG gradient artefacts)
  - Per-portrait crop bounds corrected against reference images
  - Global palette deduplication across all 6 portraits
  - Background detection uses raw-color distance (BG_THRESH), not quantized
    index equality — prevents a close bg/skin pair from masking the face
  - Writes headshots-pixels.js directly
  - Saves per-portrait preview PNGs to /tmp/headshot_preview/
"""

import math
import statistics
from collections import Counter
from pathlib import Path
from PIL import Image, ImageDraw

REF_DIR  = Path(__file__).parent
OUT_JS   = REF_DIR.parent / "headshots-pixels.js"
PREVIEW  = Path("/tmp/headshot_preview")

# (img_no, left, top, right, bottom, art_cols, art_rows, display_name, js_var_suffix)
SPECS = [
    (3,  37,   35, 1142, 1487, 24, 32, "Plain",      "Plain"),
    (1,   0,   43, 1091, 1546, 24, 33, "Bubblegum",  "Bubblegum"),
    (2,  45,   40,  990, 1304, 24, 32, "Black Cat",  "Cat"),
    (4, 120,  110,  910, 1097, 24, 30, "Sunglasses", "Sunglasses"),
    (5,  24,   40,  928, 1210, 24, 32, "T-Rex",      "Trex"),
    (6,  39,   23, 1115, 1397, 24, 29, "Penguin",    "Penguin"),
]

QUANT_THRESH = 50   # cluster radius for palette quantisation
BG_THRESH    = 18   # raw-color radius for transparent-cell detection
HALF         = 2    # 5×5 median block = center ± 2
TARGET_W     = 32
TARGET_H     = 32

CHAR_POOL = (
    "abcdefghijklmnopqrstuvwxyz"
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    "0123456789@#$%^&*-+=~"
)


# ── helpers ──────────────────────────────────────────────────────────────────

def rgb_dist(a, b):
    return math.sqrt(sum((x - y) ** 2 for x, y in zip(a, b)))


def median_sample(px, cx, cy, iw, ih):
    rs, gs, bs = [], [], []
    for dy in range(-HALF, HALF + 1):
        for dx in range(-HALF, HALF + 1):
            x = min(max(cx + dx, 0), iw - 1)
            y = min(max(cy + dy, 0), ih - 1)
            r, g, b = px[x, y]
            rs.append(r); gs.append(g); bs.append(b)
    return (int(statistics.median(rs)),
            int(statistics.median(gs)),
            int(statistics.median(bs)))


def rgb_hex(rgb):
    return "#{:02X}{:02X}{:02X}".format(*rgb)


def quantize(grid, threshold):
    palette, idx_grid = [], []
    for row in grid:
        irow = []
        for color in row:
            best_i, best_d = None, float("inf")
            for i, p in enumerate(palette):
                d = rgb_dist(color, p)
                if d < best_d:
                    best_d, best_i = d, i
            if best_d < threshold:
                irow.append(best_i)
            else:
                palette.append(color)
                irow.append(len(palette) - 1)
        idx_grid.append(irow)
    return palette, idx_grid


def detect_bg_raw(grid):
    """Median raw color of the outer border cells — used for transparent masking."""
    border = []
    rows, cols = len(grid), len(grid[0])
    for c in range(cols):
        border.append(grid[0][c])
        border.append(grid[-1][c])
    for r in range(rows):
        border.append(grid[r][0])
        border.append(grid[r][-1])
    rs = [c[0] for c in border]
    gs = [c[1] for c in border]
    bs = [c[2] for c in border]
    return (int(statistics.median(rs)),
            int(statistics.median(gs)),
            int(statistics.median(bs)))


# ── extraction ───────────────────────────────────────────────────────────────

def extract_portrait(img_no, l, t, r, b, art_w, art_h):
    img = Image.open(REF_DIR / f"{img_no}.jpeg").convert("RGB")
    iw, ih = img.size
    px = img.load()
    cw = (r - l) / art_w
    ch = (b - t) / art_h
    grid = []
    for row in range(art_h):
        crow = []
        for col in range(art_w):
            cx = int(l + (col + 0.5) * cw)
            cy = int(t + (row + 0.5) * ch)
            crow.append(median_sample(px, cx, cy, iw, ih))
        grid.append(crow)
    return grid


# ── main ─────────────────────────────────────────────────────────────────────

def main():
    PREVIEW.mkdir(parents=True, exist_ok=True)

    # ── per-portrait extraction + quantisation ───────────────────────────────
    portraits = {}
    for img_no, l, t, r, b, art_w, art_h, name, var in SPECS:
        grid = extract_portrait(img_no, l, t, r, b, art_w, art_h)
        pal, idx_grid = quantize(grid, QUANT_THRESH)
        bg_raw = detect_bg_raw(grid)
        portraits[name] = dict(
            var=var, raw_grid=grid, palette=pal, idx_grid=idx_grid,
            bg_raw=bg_raw, art_w=art_w, art_h=art_h,
        )
        print(f"  {name}: {art_w}×{art_h}  {len(pal)} colors  bg={rgb_hex(bg_raw)}")

    # ── build global palette ─────────────────────────────────────────────────
    global_pal = []

    def add_global(color):
        best_i, best_d = None, float("inf")
        for i, p in enumerate(global_pal):
            d = rgb_dist(color, p)
            if d < best_d:
                best_d, best_i = d, i
        if best_d < QUANT_THRESH:
            return best_i
        global_pal.append(color)
        return len(global_pal) - 1

    for data in portraits.values():
        data["l2g"] = {i: add_global(c) for i, c in enumerate(data["palette"])}

    print(f"\n  Global palette: {len(global_pal)} entries")
    g_chars = {i: CHAR_POOL[i % len(CHAR_POOL)] for i in range(len(global_pal))}

    # ── save preview PNGs (raw extracted colors) ─────────────────────────────
    SCALE = 14
    for name, data in portraits.items():
        rows, cols = data["art_h"], data["art_w"]
        bg = data["bg_raw"]
        img = Image.new("RGB", (cols * SCALE, rows * SCALE), (200, 200, 200))
        draw = ImageDraw.Draw(img)
        for r, row in enumerate(data["raw_grid"]):
            for c, color in enumerate(row):
                # darken bg cells slightly to show the mask boundary
                draw_color = (190, 190, 190) if rgb_dist(color, bg) < BG_THRESH else color
                x0, y0 = c * SCALE, r * SCALE
                draw.rectangle([x0, y0, x0 + SCALE - 1, y0 + SCALE - 1], fill=draw_color)
        out = PREVIEW / f"{name.replace(' ', '_')}.png"
        img.save(str(out))
    print(f"  Previews → {PREVIEW}/\n")

    # ── render 32×32 character maps ──────────────────────────────────────────
    # Collect which global palette entries are ever used as a bg color
    bg_globals = set()
    for data in portraits.values():
        bg = data["bg_raw"]
        for i, color in enumerate(global_pal):
            if rgb_dist(color, bg) < BG_THRESH * 2:
                bg_globals.add(i)

    COMMENTS = {
        "Plain":      "// ─── Plain (slate-blue bg) ────────────────────────────────",
        "Bubblegum":  "// ─── Bubblegum (gold bg) ──────────────────────────────────",
        "Black Cat":  "// ─── Black Cat (brown bg) ─────────────────────────────────",
        "Sunglasses": "// ─── Sunglasses (mauve bg) ────────────────────────────────",
        "T-Rex":      "// ─── T-Rex (slate-blue bg) ────────────────────────────────",
        "Penguin":    "// ─── Penguin (mauve bg) ────────────────────────────────────",
    }

    lines = []
    lines.append("// Headshot portrait pixel maps — 32×32 square, transparent background.")
    lines.append("// Extracted from reference images via Python.")
    lines.append("Object.assign(palette, {")
    for i, color in enumerate(global_pal):
        ch = g_chars[i]
        suffix = " // portrait bg colour (transparent as '.' in its own portrait)" if i in bg_globals else ""
        lines.append(f'  {ch}: "{rgb_hex(color)}",{suffix}')
    lines.append("});\n")

    for name, comment in COMMENTS.items():
        data = portraits[name]
        bg    = data["bg_raw"]
        var   = data["var"]
        art_h = data["art_h"]
        art_w = data["art_w"]

        # vertical fit into TARGET_H
        if art_h <= TARGET_H:
            pad_top = (TARGET_H - art_h) // 2
            pad_bot = TARGET_H - art_h - pad_top
            row_range = range(art_h)
        else:
            drop = art_h - TARGET_H
            skip = drop // 2
            row_range = range(skip, skip + TARGET_H)
            pad_top = pad_bot = 0

        pad_l = (TARGET_W - art_w) // 2
        pad_r = TARGET_W - art_w - pad_l
        dot_row = '"' + "." * TARGET_W + '",'

        lines.append(comment)
        lines.append(f"const hs{var} = [")
        for _ in range(pad_top):
            lines.append(f"  {dot_row}")
        for ri in row_range:
            cells = []
            for col_i, raw_color in enumerate(data["raw_grid"][ri]):
                if rgb_dist(raw_color, bg) < BG_THRESH:
                    cells.append(".")
                else:
                    li = data["idx_grid"][ri][col_i]
                    gi = data["l2g"][li]
                    cells.append(g_chars[gi])
            lines.append(f'  "{"." * pad_l}{"".join(cells)}{"." * pad_r}",')
        for _ in range(pad_bot):
            lines.append(f"  {dot_row}")
        lines.append("];\n")

    lines.append("const headshots = [")
    lines.append('  { name: "Plain",      map: hsPlain },')
    lines.append('  { name: "Penguin",    map: hsPenguin },')
    lines.append('  { name: "T-Rex",      map: hsTrex },')
    lines.append('  { name: "Sunglasses", map: hsSunglasses },')
    lines.append('  { name: "Black Cat",  map: hsCat },')
    lines.append('  { name: "Bubblegum",  map: hsBubblegum },')
    lines.append("];")

    OUT_JS.write_text("\n".join(lines) + "\n")
    print(f"  Wrote {OUT_JS}")


if __name__ == "__main__":
    main()
