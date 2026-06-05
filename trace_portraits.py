#!/usr/bin/env python3
"""
trace_portraits.py — Generate six 24×30 pixel-art portrait PNGs and run pixel_extract.py on each.
"""

import os
import subprocess
from pathlib import Path
from PIL import Image

# ---------------------------------------------------------------------------
# Output directory
# ---------------------------------------------------------------------------
OUT_DIR = Path("/tmp/portraits")
OUT_DIR.mkdir(parents=True, exist_ok=True)

EXTRACT_SCRIPT = "/home/user/pixel-logo/pixel_extract.py"

# ---------------------------------------------------------------------------
# Shared palette
# ---------------------------------------------------------------------------
bg_plain    = (107, 143, 173)
bg_mauve    = (155, 126, 166)
bg_brown    = (160, 112,  80)
bg_gold     = (212, 168,  67)
hair_dark   = ( 26,   8,   4)
hair_mid    = ( 61,  30,  10)
skin        = (242, 192, 122)
skin_shadow = (200, 144,  90)
black       = (  0,   0,   0)
earring     = (200, 200, 200)
hoodie      = ( 20,  20,  20)

W, H = 24, 30


# ---------------------------------------------------------------------------
# Helper: create blank grid filled with a background colour
# ---------------------------------------------------------------------------
def make_grid(bg):
    return [[bg] * W for _ in range(H)]


def set_px(grid, r, c, color):
    if 0 <= r < H and 0 <= c < W:
        grid[r][c] = color


def fill_rect(grid, r0, r1, c0, c1, color):
    """Fill rows r0..r1 (inclusive) and cols c0..c1 (inclusive)."""
    for r in range(r0, r1 + 1):
        for c in range(c0, c1 + 1):
            set_px(grid, r, c, color)


def save_png(grid, name):
    path = OUT_DIR / f"{name}.png"
    img = Image.new("RGB", (W, H))
    pixels = []
    for row in grid:
        pixels.extend(row)
    img.putdata(pixels)
    img.save(str(path))
    print(f"Saved: {path}")
    return str(path)


# ---------------------------------------------------------------------------
# Base portrait painter (plain face — no accessories)
# Takes a background colour and returns a fully-painted grid.
# ---------------------------------------------------------------------------
def paint_base(bg):
    g = make_grid(bg)

    # --- Hair crown rows 3-6 (hair_dark at cols 8-16) ---
    for r in range(3, 7):
        span_start = max(8, 8 + (6 - r))      # slightly widen lower rows
        span_end   = min(16, 16 - (6 - r))
        fill_rect(g, r, r, span_start, span_end, hair_dark)

    # --- Row 7: wider hair, face begins ---
    fill_rect(g, 7, 7, 6, 17, hair_dark)
    fill_rect(g, 7, 7, 9, 14, skin)          # face peek

    # --- Rows 8-22: face + flanking hair ---
    for r in range(8, 23):
        # Left hair flank
        if r <= 20:
            fill_rect(g, r, r, 5,  8, hair_dark)
        else:
            fill_rect(g, r, r, 5,  9, hair_dark)
        # Right hair flank
        if r <= 20:
            fill_rect(g, r, r, 17, 19, hair_dark)
        else:
            fill_rect(g, r, r, 16, 19, hair_dark)
        # Face (skin)
        fill_rect(g, r, r, 9, 16, skin)

    # --- Eyebrows: row 11 ---
    for c in (10, 11):
        set_px(g, 11, c, black)
    for c in (14, 15):
        set_px(g, 11, c, black)

    # --- Eyes: rows 12-13 ---
    for r in (12, 13):
        set_px(g, r, 10, black)
        set_px(g, r, 11, black)
        set_px(g, r, 14, black)
        set_px(g, r, 15, black)

    # --- Nose shadow + nose ---
    set_px(g, 15, 12, skin_shadow)
    set_px(g, 16, 12, black)

    # --- Mouth: row 18 cols 11-13 ---
    for c in (11, 12, 13):
        set_px(g, 18, c, black)

    # --- Earring (left ear side): rows 14-15 col 8 ---
    set_px(g, 14, 8, earring)
    set_px(g, 15, 8, earring)

    # --- Hoodie: rows 23-29, wide spread ---
    for r in range(23, 30):
        fill_rect(g, r, r, 3, 20, hoodie)
    # Neck/chin skin above hoodie
    fill_rect(g, 22, 22, 10, 14, skin)
    fill_rect(g, 23, 24, 10, 13, skin)

    # --- Hair at sides continuing into hoodie rows ---
    for r in range(23, 28):
        fill_rect(g, r, r, 3,  6, hair_dark)
        fill_rect(g, r, r, 18, 20, hair_dark)

    return g


# ---------------------------------------------------------------------------
# Portrait 1: plain  (slate blue bg)
# ---------------------------------------------------------------------------
def portrait_plain():
    return paint_base(bg_plain)


# ---------------------------------------------------------------------------
# Portrait 2: penguin  (mauve bg)  — small penguin rows 24-28, cols 1-5
# ---------------------------------------------------------------------------
penguin_black  = (10,  10,  10)
penguin_white  = (240, 240, 240)
penguin_orange = (230, 120,  20)

def portrait_penguin():
    g = paint_base(bg_mauve)
    # Body (black) rows 24-28, cols 1-5
    fill_rect(g, 24, 28, 1, 5, penguin_black)
    # White belly rows 25-27, cols 2-4
    fill_rect(g, 25, 27, 2, 4, penguin_white)
    # Beak row 25, col 5
    set_px(g, 25, 5, penguin_orange)
    # Feet row 28, cols 2 & 4
    set_px(g, 28, 2, penguin_orange)
    set_px(g, 28, 4, penguin_orange)
    # Eyes row 24, cols 2 & 4 — leave black body, add white dot
    set_px(g, 24, 2, penguin_white)
    set_px(g, 24, 4, penguin_white)
    return g


# ---------------------------------------------------------------------------
# Portrait 3: t-rex  (slate blue bg)  — green T-rex rows 1-7, cols 10-21
# ---------------------------------------------------------------------------
trex_green  = ( 60, 160,  40)
trex_belly  = (160, 210,  80)
trex_mouth  = (140,  20,  10)
trex_teeth  = (240, 240, 240)
trex_outline= (  0,   0,   0)

def portrait_trex():
    g = paint_base(bg_plain)
    # Rough T-rex silhouette painted over the top region

    # Body rows 3-7, cols 12-21
    fill_rect(g, 3, 7, 12, 21, trex_green)
    # Belly (lighter) rows 4-6, cols 14-19
    fill_rect(g, 4, 6, 14, 19, trex_belly)
    # Head rows 1-4, cols 16-21
    fill_rect(g, 1, 4, 16, 21, trex_green)
    # Outline/head top
    for c in range(16, 22):
        set_px(g, 1, c, trex_outline)
    # Eye row 2, col 20
    set_px(g, 2, 20, trex_outline)
    set_px(g, 2, 19, trex_teeth)   # white sclera
    # Mouth / jaw rows 4-5, cols 18-21
    fill_rect(g, 4, 5, 18, 21, trex_mouth)
    # Teeth row 5, cols 18-21 alternating
    for c in (18, 20):
        set_px(g, 5, c, trex_teeth)
    # Tiny arms rows 5-6, cols 11-13
    fill_rect(g, 5, 6, 11, 13, trex_green)
    # Outline bottom of body
    for c in range(12, 22):
        set_px(g, 7, c, trex_outline)
    return g


# ---------------------------------------------------------------------------
# Portrait 4: sunglasses  (mauve bg)
# ---------------------------------------------------------------------------
visor_fill    = (220,  50, 150)  # magenta/pink
visor_outline = (  0,   0,   0)

def portrait_sunglasses():
    g = paint_base(bg_mauve)
    # Replace eyebrow/eye rows 11-14 over face width cols 9-18 with visor
    # Top outline row 11
    fill_rect(g, 11, 11, 9, 18, visor_outline)
    # Fill rows 12-13
    fill_rect(g, 12, 13, 9, 18, visor_fill)
    # Bottom outline row 14
    fill_rect(g, 14, 14, 9, 18, visor_outline)
    # Keep earring visible
    set_px(g, 14, 8, earring)
    set_px(g, 15, 8, earring)
    return g


# ---------------------------------------------------------------------------
# Portrait 5: black cat  (brown bg)  — cat rows 0-6, cols 8-18
# ---------------------------------------------------------------------------
cat_black  = ( 15,  15,  15)
cat_yellow = (230, 200,  20)
cat_pink   = (230, 100, 140)

def portrait_cat():
    g = paint_base(bg_brown)
    # Cat body rows 3-6, cols 8-18
    fill_rect(g, 3, 6, 8, 18, cat_black)
    # Cat head rows 1-4, cols 10-17
    fill_rect(g, 1, 4, 10, 17, cat_black)
    # Ears: left rows 0-1, cols 10-11; right rows 0-1, cols 16-17
    fill_rect(g, 0, 1, 10, 11, cat_black)
    fill_rect(g, 0, 1, 16, 17, cat_black)
    # Inner ear pink: row 0, col 10 and col 17
    set_px(g, 0, 10, cat_pink)
    set_px(g, 0, 17, cat_pink)
    # Eyes: row 2, cols 11-12 and cols 15-16
    for c in (11, 12):
        set_px(g, 2, c, cat_yellow)
    for c in (15, 16):
        set_px(g, 2, c, cat_yellow)
    # Nose: row 3, col 13
    set_px(g, 3, 13, cat_pink)
    # Outline bottom of cat body
    for c in range(8, 19):
        set_px(g, 6, c, cat_black)
    return g


# ---------------------------------------------------------------------------
# Portrait 6: bubblegum  (gold bg)
# ---------------------------------------------------------------------------
bubble_bright  = (224,  64, 170)
bubble_outline = (192,  32, 128)
bubble_hi      = (240, 160, 210)

def portrait_bubblegum():
    g = paint_base(bg_gold)
    # Bubble rows 17-22, cols 16-21
    fill_rect(g, 17, 22, 16, 21, bubble_bright)
    # Outline (border of rect)
    for c in range(16, 22):
        set_px(g, 17, c, bubble_outline)
        set_px(g, 22, c, bubble_outline)
    for r in range(17, 23):
        set_px(g, r, 16, bubble_outline)
        set_px(g, r, 21, bubble_outline)
    # Highlight (top-left interior)
    fill_rect(g, 18, 19, 17, 18, bubble_hi)
    return g


# ---------------------------------------------------------------------------
# Build, save and extract all portraits
# ---------------------------------------------------------------------------
portraits = [
    ("plain",       portrait_plain()),
    ("penguin",     portrait_penguin()),
    ("trex",        portrait_trex()),
    ("sunglasses",  portrait_sunglasses()),
    ("cat",         portrait_cat()),
    ("bubblegum",   portrait_bubblegum()),
]

saved = []
for name, grid in portraits:
    path = save_png(grid, name)
    saved.append((name, path))

print()
print("=" * 60)
print("Running pixel_extract.py on each portrait…")
print("=" * 60)

for name, path in saved:
    print(f"\n{'─' * 60}")
    print(f"# Portrait: {name}")
    print(f"{'─' * 60}")
    subprocess.run(
        ["python3", EXTRACT_SCRIPT, path, "--name", name, "--grid", "24x30"],
        capture_output=False,
    )
