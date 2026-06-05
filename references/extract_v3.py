#!/usr/bin/env python3
"""
extract_v3.py — Mode-sampling + flood-fill headshot extraction.

Pipeline per portrait:
  1. Mode-sample each 24×art_h cell from original JPEG pixels on a sparse
     grid (step=3).  Bin with 8 per channel (>>5, width 32) to absorb JPEG
     ±16 noise, take the mode-bin's median → actual source pixel colour, no
     blending.
  2. Flood-fill background from border cells outward.  Propagation stops when
     a candidate's colour is > FLOOD_THRESH from bg_raw.  Hair forms a natural
     barrier so interior face cells are never reached, regardless of how close
     skin colour is to the background.
  3. Quantise ONLY the content (non-background) cells with CONTENT_QUANT=25
     to merge nearby skin/hair variants.  No risk of skin collapsing into bg
     because bg cells are excluded from this step.
  4. Global cross-portrait merge at MERGE_DIST=20 → shared palette.
  5. Output headshots-pixels.js + preview PNGs.

Requirements: Pillow  (pip install Pillow)
"""

import math
import statistics
from collections import Counter, deque
from pathlib import Path
from PIL import Image, ImageDraw

REF_DIR = Path(__file__).parent
OUT_JS  = REF_DIR.parent / "headshots-pixels.js"
PREVIEW = Path("/tmp/headshot_preview")

# (img_no, left, top, right, bottom, art_cols, art_rows, display_name, js_var_suffix)
SPECS = [
    # (img_no, l, t, r, b, art_w, art_h, display_name, js_var_suffix)
    # art_h > TARGET_H → first TARGET_H rows kept (top accessories preserved, bottom trimmed).
    (3,  37,   35, 1132, 1550, 24, 34, "Plain",      "Plain"),      # r=1132 (white space starts at ~1135)
    (1,   0,   43, 1093, 1549, 24, 33, "Bubblegum",  "Bubblegum"),  # full content bounds
    (2,  40,   10, 1000, 1304, 24, 33, "Black Cat",  "Cat"),         # t=10 to include cat ears
    (4, 140,  110, 1040, 1257, 24, 33, "Sunglasses", "Sunglasses"), # true portrait bounds within 3-up collage
    (5,  24,   21,  928, 1210, 24, 32, "T-Rex",      "Trex"),        # exact content bounds from scan
    (6,  39,   23, 1122, 1408, 24, 33, "Penguin",    "Penguin"),    # r=1122 (white space starts at ~1130)
]

SAMPLE_STEP   = 3    # sparse-sample every Nth pixel within each cell region
BIN_SHIFT     = 5    # >>5 → 8 bins/channel, width 32 (absorbs JPEG ±16 noise)
FLOOD_THRESH  = 22   # flood-fill stops when dist(cell, bg_raw) > this
CONTENT_QUANT = 25   # merge nearby content colours after flood-fill separation
MERGE_DIST    = 20   # global cross-portrait merge radius
TARGET_W      = 32
TARGET_H      = 32

CHAR_POOL = (
    "abcdefghijklmnopqrstuvwxyz"
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    "0123456789@#$%^&*-+=~"
)

BG = None   # sentinel for background cells in the merged grid


# ── helpers ──────────────────────────────────────────────────────────────────

def rgb_dist(a, b):
    return math.sqrt(sum((x - y) ** 2 for x, y in zip(a, b)))

def rgb_hex(rgb):
    return "#{:02X}{:02X}{:02X}".format(*rgb)


# ── mode sampling ─────────────────────────────────────────────────────────────

def mode_sample_grid(img_no, l, t, r, b, art_w, art_h):
    """
    For each target cell sample original JPEG pixels on a sparse grid, bin
    them to absorb JPEG noise, take the mode-bin median.
    """
    img = Image.open(REF_DIR / f"{img_no}.jpeg").convert("RGB")
    px  = img.load()
    iw, ih = img.size
    cw = (r - l) / art_w
    ch = (b - t) / art_h

    grid = []
    for row in range(art_h):
        r_row = []
        for col in range(art_w):
            x0 = int(l + col * cw);       y0 = int(t + row * ch)
            x1 = max(x0 + 1, int(l + (col + 1) * cw))
            y1 = max(y0 + 1, int(t + (row + 1) * ch))

            bin_count = Counter()
            bin_pix   = {}
            sy = y0
            while sy < y1:
                sx = x0
                while sx < x1:
                    p   = px[min(sx, iw - 1), min(sy, ih - 1)]
                    key = (p[0] >> BIN_SHIFT, p[1] >> BIN_SHIFT, p[2] >> BIN_SHIFT)
                    bin_count[key] += 1
                    bin_pix.setdefault(key, []).append(p)
                    sx += SAMPLE_STEP
                sy += SAMPLE_STEP

            mode_key = bin_count.most_common(1)[0][0]
            mp = bin_pix[mode_key]
            r_row.append((
                int(statistics.median(p[0] for p in mp)),
                int(statistics.median(p[1] for p in mp)),
                int(statistics.median(p[2] for p in mp)),
            ))
        grid.append(r_row)
    return grid


# ── background detection ──────────────────────────────────────────────────────

def border_median(grid):
    """Median colour of all outer-border cells."""
    rows, cols = len(grid), len(grid[0])
    border = []
    for c in range(cols):
        border += [grid[0][c], grid[-1][c]]
    for r in range(rows):
        border += [grid[r][0], grid[r][-1]]
    return (int(statistics.median(c[0] for c in border)),
            int(statistics.median(c[1] for c in border)),
            int(statistics.median(c[2] for c in border)))


def flood_fill_bg(grid, bg_raw, thresh):
    """
    BFS flood fill from border cells outward.  Only border cells whose colour
    is within thresh of bg_raw are seeded — this prevents earrings or other
    non-bg coloured edge cells from being wrongly classified as background.
    A neighbour is background if its colour distance from bg_raw < thresh.
    Returns 2-D bool mask.
    """
    rows, cols = len(grid), len(grid[0])
    is_bg = [[False] * cols for _ in range(rows)]
    q = deque()

    border = set()
    for c in range(cols):
        border.add((0, c)); border.add((rows - 1, c))
    for r in range(rows):
        border.add((r, 0)); border.add((r, cols - 1))

    for (r, c) in border:
        if rgb_dist(grid[r][c], bg_raw) < thresh and not is_bg[r][c]:
            is_bg[r][c] = True; q.append((r, c))

    while q:
        r, c = q.popleft()
        for dr, dc in ((-1, 0), (1, 0), (0, -1), (0, 1)):
            nr, nc = r + dr, c + dc
            if 0 <= nr < rows and 0 <= nc < cols and not is_bg[nr][nc]:
                if rgb_dist(grid[nr][nc], bg_raw) < thresh:
                    is_bg[nr][nc] = True
                    q.append((nr, nc))
    return is_bg


# ── content quantisation ──────────────────────────────────────────────────────

def snap_to_palette(color, palette):
    return min(palette, key=lambda p: rgb_dist(color, p))


def build_palette(colors, threshold):
    """Cluster a list of colours into a compact palette."""
    palette = []
    for color in colors:
        best_d = min((rgb_dist(color, p) for p in palette), default=float("inf"))
        if best_d >= threshold:
            palette.append(color)
    return palette


# ── extraction ───────────────────────────────────────────────────────────────

def extract(img_no, l, t, r, b, art_w, art_h):
    raw_grid = mode_sample_grid(img_no, l, t, r, b, art_w, art_h)
    bg_raw   = border_median(raw_grid)
    is_bg    = flood_fill_bg(raw_grid, bg_raw, FLOOD_THRESH)

    # Build content palette (excluding background cells)
    content_colors = [raw_grid[r][c]
                      for r in range(art_h) for c in range(art_w)
                      if not is_bg[r][c]]
    palette = build_palette(content_colors, CONTENT_QUANT)

    # Snap each content cell; background cells → BG sentinel
    merged = []
    for r in range(art_h):
        row = []
        for c in range(art_w):
            if is_bg[r][c]:
                row.append(BG)
            else:
                row.append(snap_to_palette(raw_grid[r][c], palette))
        merged.append(row)

    used = list(dict.fromkeys(c for row in merged for c in row if c is not BG))
    return merged, used, bg_raw


# ── global palette ────────────────────────────────────────────────────────────

def add_global(color, global_pal):
    best_i, best_d = None, float("inf")
    for i, p in enumerate(global_pal):
        d = rgb_dist(color, p)
        if d < best_d:
            best_d, best_i = d, i
    if best_d < MERGE_DIST:
        return best_i
    global_pal.append(color)
    return len(global_pal) - 1


# ── main ─────────────────────────────────────────────────────────────────────

def main():
    PREVIEW.mkdir(parents=True, exist_ok=True)

    # ── extract all portraits ────────────────────────────────────────────────
    portraits = {}
    for img_no, l, t, r, b, art_w, art_h, name, var in SPECS:
        grid, palette, bg_raw = extract(img_no, l, t, r, b, art_w, art_h)
        portraits[name] = dict(
            var=var, grid=grid, palette=palette,
            bg_raw=bg_raw, art_w=art_w, art_h=art_h,
        )
        bg_cells = sum(1 for row in grid for c in row if c is BG)
        total    = art_w * art_h
        print(f"  {name}: {art_w}×{art_h}  {len(palette)} content colours  "
              f"bg={rgb_hex(bg_raw)}  bg_cells={bg_cells}/{total}")

    # ── global palette ───────────────────────────────────────────────────────
    global_pal = []
    for data in portraits.values():
        data["c2g"] = {c: add_global(c, global_pal) for c in data["palette"]}

    print(f"\n  Global palette: {len(global_pal)} entries")
    g_chars = {i: CHAR_POOL[i % len(CHAR_POOL)] for i in range(len(global_pal))}

    # ── preview PNGs ─────────────────────────────────────────────────────────
    SCALE = 14
    for name, data in portraits.items():
        rows, cols = data["art_h"], data["art_w"]
        im   = Image.new("RGB", (cols * SCALE, rows * SCALE), (200, 200, 200))
        draw = ImageDraw.Draw(im)
        for r, row in enumerate(data["grid"]):
            for c, color in enumerate(row):
                fill = (190, 190, 190) if color is BG else color
                x0, y0 = c * SCALE, r * SCALE
                draw.rectangle([x0, y0, x0 + SCALE - 1, y0 + SCALE - 1], fill=fill)
        im.save(str(PREVIEW / f"{name.replace(' ', '_')}.png"))
    print(f"  Previews → {PREVIEW}/")

    # ── render 32×32 character maps ──────────────────────────────────────────
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
        lines.append(f'  {g_chars[i]}: "{rgb_hex(color)}",')
    lines.append("});\n")

    for name, comment in COMMENTS.items():
        data  = portraits[name]
        var   = data["var"]
        art_h = data["art_h"]
        art_w = data["art_w"]

        if art_h <= TARGET_H:
            pad_top   = (TARGET_H - art_h) // 2
            pad_bot   = TARGET_H - art_h - pad_top
            row_range = range(art_h)
        else:
            # Trim from the bottom to preserve accessories at the top.
            row_range = range(TARGET_H)
            pad_top = pad_bot = 0

        pad_l   = (TARGET_W - art_w) // 2
        pad_r   = TARGET_W - art_w - pad_l
        dot_row = '"' + "." * TARGET_W + '",'

        lines.append(comment)
        lines.append(f"const hs{var} = [")
        for _ in range(pad_top):
            lines.append(f"  {dot_row}")
        for ri in row_range:
            cells = []
            for color in data["grid"][ri]:
                if color is BG:
                    cells.append(".")
                else:
                    cells.append(g_chars[data["c2g"][color]])
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
    print(f"\n  Wrote {OUT_JS}")


if __name__ == "__main__":
    main()
