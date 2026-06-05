// Headshot portrait pixel maps — 24 cols × 30 rows, transparent background.
// Extracted via pixel_extract.py from reference images, then translated to
// the shared palette character system.
//
// New palette entries added here (all others reuse the global palette):
Object.assign(palette, {
  // ── face ──────────────────────────────────────────────────────────────────
  n: "#F2C07A", // skin
  N: "#C8905A", // skin shadow / nose
  h: "#1A0804", // dark hair (also hoodie — same hue, near-black)
  e: "#C8C8C8", // silver earring
  // ── accessories ───────────────────────────────────────────────────────────
  X: "#E67814", // penguin orange feet / beak
  // W already in palette (#F8F8F8 white) — penguin belly
  Q: "#3CA028", // t-rex green body
  U: "#A0D250", // t-rex belly / light green
  R: "#8C140A", // t-rex dark red mouth
  // K already in palette (#000000) — t-rex black outline
  V: "#DC3296", // sunglasses magenta visor
  // A already in palette (will be added below) — cat ear pink
  // L already in palette (will be added below) — cat eye yellow
  A: "#D04080", // cat inner ear / nose pink
  L: "#E8C000", // cat eye yellow
  l: "#101010", // cat fur / near-black (also used as hoodie in cat portrait)
  I: "#C02080", // bubblegum dark outline
  O: "#F0A0D2", // bubblegum light highlight
  P: "#E040AA", // bubblegum pink
});

// ─── Plain (slate-blue bg → transparent) ─────────────────────────────────────
const hsPlain = [
  "........................", //  0
  "........................", //  1
  "........................", //  2
  "...........hhh..........", //  3
  "..........hhhhh.........", //  4
  ".........hhhhhhh........", //  5
  "........hhhhhhhhh.......", //  6
  "......hhhnnnnnnhhh......", //  7
  ".....hhhhnnnnnnnnhhh....", //  8
  ".....hhhhnnnnnnnnhhh....", //  9
  ".....hhhhnnnnnnnnhhh....", // 10
  ".....hhhhnhhhhnhhhhh....", // 11  eyebrows
  ".....hhhhnhhhhnhhhhh....", // 12  eyes top
  ".....hhhhnhhhhnhhhhh....", // 13  eyes bottom
  ".....hhhenhnnnnnnhhh....", // 14  earring
  ".....hhhenhhhNnnnnhh....", // 15  earring + nose shadow
  ".....hhhhnnnnhnnnhhh....", // 16  nostril
  ".....hhhhnnnnnnnnhhh....", // 17
  ".....hhhhnhhhhnnhhhh....", // 18  mouth (3 dark pixels)
  ".....hhhhnnnnnnnnhhh....", // 19
  ".....hhhhnnnnnnnnhhh....", // 20
  ".....hhhhnnnnnnnnhhh....", // 21
  ".....hhhhnnnnnnnnhhh....", // 22
  "...hhhhhhhhnnnnhhhhhh...", // 23  neck
  "...hhhhhhhhnnnnhhhhhh...", // 24
  "...hhhhhhhhhhhhhhhhhh...", // 25  lower hair / hoodie transition
  "...hhhhhhhhhhhhhhhhhh...", // 26
  "...hhhhhhhhhhhhhhhhhh...", // 27
  "...hhhhhhhhhhhhhhhhhh...", // 28
  "...hhhhhhhhhhhhhhhhhh...", // 29
];

// ─── Penguin (mauve bg → transparent) ────────────────────────────────────────
const hsPenguin = [
  "........................", //  0
  "........................", //  1
  "........................", //  2
  "...........hhh..........", //  3
  "..........hhhhh.........", //  4
  ".........hhhhhhh........", //  5
  "........hhhhhhhhh.......", //  6
  "......hhhnnnnnnhhh......", //  7
  ".....hhhhnnnnnnnnhhh....", //  8
  ".....hhhhnnnnnnnnhhh....", //  9
  ".....hhhhnnnnnnnnhhh....", // 10
  ".....hhhhnhhhhnhhhhh....", // 11
  ".....hhhhnhhhhnhhhhh....", // 12
  ".....hhhhnhhhhnhhhhh....", // 13
  ".....hhhenhnnnnnnhhh....", // 14
  ".....hhhenhhhNnnnnhh....", // 15
  ".....hhhhnnnnhnnnhhh....", // 16
  ".....hhhhnnnnnnnnhhh....", // 17
  ".....hhhhnhhhhnnhhhh....", // 18
  ".....hhhhnnnnnnnnhhh....", // 19
  ".....hhhhnnnnnnnnhhh....", // 20
  ".....hhhhnnnnnnnnhhh....", // 21
  ".....hhhhnnnnnnnnhhh....", // 22
  "...hhhhhhhhnnnnhhhhhh...", // 23
  ".hWhWhhhhhhhnnhhhhhhh...", // 24  penguin head (W=white, h=black body)
  ".hWWWXhhhhhhhhhhhhhhhh..", // 25  penguin body + orange beak area
  ".hWWhhhhhhhhhhhhhhhhhh..", // 26
  ".hWWhhhhhhhhhhhhhhhhhh..", // 27
  ".hXhXhhhhhhhhhhhhhhhhh..", // 28  orange feet
  "...hhhhhhhhhhhhhhhhhh...", // 29
];

// ─── T-Rex (slate-blue bg → transparent) ─────────────────────────────────────
const hsTrex = [
  "........................", //  0
  "................KKKKKh..", //  1  t-rex head outline
  "................QQQWKQh.", //  2  t-rex face: green + white tooth
  "...........KQQQQQQQQQh..", //  3  t-rex body
  "..........KKQQUUQQRRRKh.", //  4  belly + red mouth
  ".........KKQQQUUUUWRWR..", //  5  detail
  "........KKKQQQUUUUUUQQh.", //  6  lower body
  "......hhhnnnnKKKKKKKKK..", //  7  hair appears, t-rex feet/bottom
  ".....hhhhnnnnnnnnhhh....", //  8
  ".....hhhhnnnnnnnnhhh....", //  9
  ".....hhhhnnnnnnnnhhh....", // 10
  ".....hhhhnhhhhnhhhhh....", // 11
  ".....hhhhnhhhhnhhhhh....", // 12
  ".....hhhhnhhhhnhhhhh....", // 13
  ".....hhhenhnnnnnnhhh....", // 14
  ".....hhhenhhhNnnnnhh....", // 15
  ".....hhhhnnnnhnnnhhh....", // 16
  ".....hhhhnnnnnnnnhhh....", // 17
  ".....hhhhnhhhhnnhhhh....", // 18
  ".....hhhhnnnnnnnnhhh....", // 19
  ".....hhhhnnnnnnnnhhh....", // 20
  ".....hhhhnnnnnnnnhhh....", // 21
  ".....hhhhnnnnnnnnhhh....", // 22
  "...hhhhhhhhnnnnhhhhhh...", // 23
  "...hhhhhhhhnnnnhhhhhh...", // 24
  "...hhhhhhhhhhhhhhhhhh...", // 25
  "...hhhhhhhhhhhhhhhhhh...", // 26
  "...hhhhhhhhhhhhhhhhhh...", // 27
  "...hhhhhhhhhhhhhhhhhh...", // 28
  "...hhhhhhhhhhhhhhhhhh...", // 29
];

// ─── Sunglasses (mauve bg → transparent) ─────────────────────────────────────
const hsSunglasses = [
  "........................", //  0
  "........................", //  1
  "........................", //  2
  "...........hhh..........", //  3
  "..........hhhhh.........", //  4
  ".........hhhhhhh........", //  5
  "........hhhhhhhhh.......", //  6
  "......hhhnnnnnnhhh......", //  7
  ".....hhhhnnnnnnnnhhh....", //  8
  ".....hhhhnnnnnnnnhhh....", //  9
  ".....hhhhnnnnnnnnhhh....", // 10
  ".....hhhhhhhhhhhhhhh....", // 11  visor top bar (all dark)
  ".....hhhhVVVVVVVVVhh....", // 12  visor magenta fill
  ".....hhhhVVVVVVVVVhh....", // 13
  ".....hhhehhhhhhhhhhhh...", // 14  visor bottom / earring
  ".....hhhhnhhhNnnnnhh....", // 15
  ".....hhhhnnnnhnnnhhh....", // 16
  ".....hhhhnnnnnnnnhhh....", // 17
  ".....hhhhnhhhhnnhhhh....", // 18
  ".....hhhhnnnnnnnnhhh....", // 19
  ".....hhhhnnnnnnnnhhh....", // 20
  ".....hhhhnnnnnnnnhhh....", // 21
  ".....hhhhnnnnnnnnhhh....", // 22
  "...hhhhhhhhnnnnhhhhhh...", // 23
  "...hhhhhhhhnnnnhhhhhh...", // 24
  "...hhhhhhhhhhhhhhhhhh...", // 25
  "...hhhhhhhhhhhhhhhhhh...", // 26
  "...hhhhhhhhhhhhhhhhhh...", // 27
  "...hhhhhhhhhhhhhhhhhh...", // 28
  "...hhhhhhhhhhhhhhhhhh...", // 29
];

// ─── Black Cat (brown bg → transparent) ──────────────────────────────────────
const hsCat = [
  "..........lA....Al......", //  0  cat ear tips (A=pink inner, l=black outer)
  "..........llllllll......", //  1  cat head base
  "..........lLLllLLl......", //  2  cat eyes (L=yellow)
  "........lllllAlllll.....", //  3  cat nose (A=pink)
  "........lllllllllll.....", //  4  cat head body
  "........lllllllllll.....", //  5
  "........lllllllllll.....", //  6
  "......llllnnnnnnlll.....", //  7  hair region (l merges with dark hair)
  ".....lllllnnnnnnnnlll...", //  8
  ".....lllllnnnnnnnnlll...", //  9
  ".....lllllnnnnnnnnlll...", // 10
  ".....lllllnlllnlllll....", // 11  eyebrows
  ".....lllllnlllnlllll....", // 12  eyes
  ".....lllllnlllnlllll....", // 13
  ".....lllelnnnnnnnlll....", // 14  earring
  ".....lllelnnnNnnnnll....", // 15
  ".....llllnnnnnnnnnll....", // 16  (using l for nose pixel, same dark color)
  ".....llllnnnnnnnnlll....", // 17
  ".....llllnnlllnnnlll....", // 18  mouth
  ".....llllnnnnnnnnlll....", // 19
  ".....llllnnnnnnnnlll....", // 20
  ".....llllnnnnnnnnlll....", // 21
  ".....llllnnnnnnnnlll....", // 22
  "...lllllllllnnlllllll...", // 23  neck
  "...lllllllllnnlllllll...", // 24
  "...llllllllllllllllll...", // 25
  "...llllllllllllllllll...", // 26
  "...llllllllllllllllll...", // 27
  "...llllllllllllllllll...", // 28
  "...llllllllllllllllll...", // 29
];

// ─── Bubblegum (gold bg → transparent) ───────────────────────────────────────
const hsBubblegum = [
  "........................", //  0
  "........................", //  1
  "........................", //  2
  "...........hhh..........", //  3
  "..........hhhhh.........", //  4
  ".........hhhhhhh........", //  5
  "........hhhhhhhhh.......", //  6
  "......hhhnnnnnnhhh......", //  7
  ".....hhhhnnnnnnnnhhh....", //  8
  ".....hhhhnnnnnnnnhhh....", //  9
  ".....hhhhnnnnnnnnhhh....", // 10
  ".....hhhhnhhhhnhhhhh....", // 11
  ".....hhhhnhhhhnhhhhh....", // 12
  ".....hhhhnhhhhnhhhhh....", // 13
  ".....hhhenhnnnnnnhhh....", // 14
  ".....hhhenhhhNnnnnhh....", // 15
  ".....hhhhnnnnhnnnhhh....", // 16
  ".....hhhhnnnnnnnnIIIIII.", // 17  bubble starts (I=dark outline)
  ".....hhhhnhhhhnnIOOPPI..", // 18  bubble body (O=highlight, P=pink)
  ".....hhhhnnnnnnniOOPPI..", // 19
  ".....hhhhnnnnnnniPPPPI..", // 20
  ".....hhhhnnnnnnniPPPPI..", // 21
  ".....hhhhnnnnnnniIIIII..", // 22  bubble bottom
  "...hhhhhhhhnnnnhhhhhh...", // 23
  "...hhhhhhhhnnnnhhhhhh...", // 24
  "...hhhhhhhhhhhhhhhhhh...", // 25
  "...hhhhhhhhhhhhhhhhhh...", // 26
  "...hhhhhhhhhhhhhhhhhh...", // 27
  "...hhhhhhhhhhhhhhhhhh...", // 28
  "...hhhhhhhhhhhhhhhhhh...", // 29
];

// ─── Registry ─────────────────────────────────────────────────────────────────
const headshots = [
  { name: "Plain",      map: hsPlain },
  { name: "Penguin",    map: hsPenguin },
  { name: "T-Rex",      map: hsTrex },
  { name: "Sunglasses", map: hsSunglasses },
  { name: "Black Cat",  map: hsCat },
  { name: "Bubblegum",  map: hsBubblegum },
];
