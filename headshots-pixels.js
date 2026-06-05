// Headshot portrait pixel maps — 32×32 square, transparent background.
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
  "................................",
  "................................",
  "................................",
  "................................",
  "...............hhh..............",
  "..............hhhhh.............",
  ".............hhhhhhh............",
  "............hhhhhhhhh...........",
  "..........hhhnnnnnnhhh..........",
  ".........hhhhnnnnnnnnhhh........",
  ".........hhhhnnnnnnnnhhh........",
  ".........hhhhnnnnnnnnhhh........",
  ".........hhhhnhhhhnhhhhh........",
  ".........hhhhnhhhhnhhhhh........",
  ".........hhhhnhhhhnhhhhh........",
  ".........hhhenhnnnnnnhhh........",
  ".........hhhenhhhNnnnnhh........",
  ".........hhhhnnnnhnnnhhh........",
  ".........hhhhnnnnnnnnhhh........",
  ".........hhhhnhhhhnnhhhh........",
  ".........hhhhnnnnnnnnhhh........",
  ".........hhhhnnnnnnnnhhh........",
  ".........hhhhnnnnnnnnhhh........",
  ".........hhhhnnnnnnnnhhh........",
  ".......hhhhhhhhnnnnhhhhhh.......",
  ".......hhhhhhhhnnnnhhhhhh.......",
  ".......hhhhhhhhhhhhhhhhhh.......",
  ".......hhhhhhhhhhhhhhhhhh.......",
  ".......hhhhhhhhhhhhhhhhhh.......",
  ".......hhhhhhhhhhhhhhhhhh.......",
  ".......hhhhhhhhhhhhhhhhhh.......",
  "................................",
];

// ─── Penguin (mauve bg → transparent) ────────────────────────────────────────
const hsPenguin = [
  "................................",
  "................................",
  "................................",
  "................................",
  "...............hhh..............",
  "..............hhhhh.............",
  ".............hhhhhhh............",
  "............hhhhhhhhh...........",
  "..........hhhnnnnnnhhh..........",
  ".........hhhhnnnnnnnnhhh........",
  ".........hhhhnnnnnnnnhhh........",
  ".........hhhhnnnnnnnnhhh........",
  ".........hhhhnhhhhnhhhhh........",
  ".........hhhhnhhhhnhhhhh........",
  ".........hhhhnhhhhnhhhhh........",
  ".........hhhenhnnnnnnhhh........",
  ".........hhhenhhhNnnnnhh........",
  ".........hhhhnnnnhnnnhhh........",
  ".........hhhhnnnnnnnnhhh........",
  ".........hhhhnhhhhnnhhhh........",
  ".........hhhhnnnnnnnnhhh........",
  ".........hhhhnnnnnnnnhhh........",
  ".........hhhhnnnnnnnnhhh........",
  ".........hhhhnnnnnnnnhhh........",
  ".......hhhhhhhhnnnnhhhhhh.......",
  ".....hWhWhhhhhhhnnhhhhhhh.......",
  ".....hWWWXhhhhhhhhhhhhhhhh......",
  ".....hWWhhhhhhhhhhhhhhhhhh......",
  ".....hWWhhhhhhhhhhhhhhhhhh......",
  ".....hXhXhhhhhhhhhhhhhhhhh......",
  ".......hhhhhhhhhhhhhhhhhh.......",
  "................................",
];

// ─── T-Rex (slate-blue bg → transparent) ─────────────────────────────────────
const hsTrex = [
  "................................",
  "................................",
  "....................KKKKKh......",
  "....................QQQWKQh.....",
  "...............KQQQQQQQQQh......",
  "..............KKQQUUQQRRRKh.....",
  ".............KKQQQUUUUWRWR......",
  "............KKKQQQUUUUUUQQh.....",
  "..........hhhnnnnKKKKKKKKK......",
  ".........hhhhnnnnnnnnhhh........",
  ".........hhhhnnnnnnnnhhh........",
  ".........hhhhnnnnnnnnhhh........",
  ".........hhhhnhhhhnhhhhh........",
  ".........hhhhnhhhhnhhhhh........",
  ".........hhhhnhhhhnhhhhh........",
  ".........hhhenhnnnnnnhhh........",
  ".........hhhenhhhNnnnnhh........",
  ".........hhhhnnnnhnnnhhh........",
  ".........hhhhnnnnnnnnhhh........",
  ".........hhhhnhhhhnnhhhh........",
  ".........hhhhnnnnnnnnhhh........",
  ".........hhhhnnnnnnnnhhh........",
  ".........hhhhnnnnnnnnhhh........",
  ".........hhhhnnnnnnnnhhh........",
  ".......hhhhhhhhnnnnhhhhhh.......",
  ".......hhhhhhhhnnnnhhhhhh.......",
  ".......hhhhhhhhhhhhhhhhhh.......",
  ".......hhhhhhhhhhhhhhhhhh.......",
  ".......hhhhhhhhhhhhhhhhhh.......",
  ".......hhhhhhhhhhhhhhhhhh.......",
  ".......hhhhhhhhhhhhhhhhhh.......",
  "................................",
];

// ─── Sunglasses (mauve bg → transparent) ─────────────────────────────────────
const hsSunglasses = [
  "................................",
  "................................",
  "................................",
  "................................",
  "...............hhh..............",
  "..............hhhhh.............",
  ".............hhhhhhh............",
  "............hhhhhhhhh...........",
  "..........hhhnnnnnnhhh..........",
  ".........hhhhnnnnnnnnhhh........",
  ".........hhhhnnnnnnnnhhh........",
  ".........hhhhnnnnnnnnhhh........",
  ".........hhhhhhhhhhhhhhh........",
  ".........hhhhVVVVVVVVVhh........",
  ".........hhhhVVVVVVVVVhh........",
  ".........hhhehhhhhhhhhhhh.......",
  ".........hhhhnhhhNnnnnhh........",
  ".........hhhhnnnnhnnnhhh........",
  ".........hhhhnnnnnnnnhhh........",
  ".........hhhhnhhhhnnhhhh........",
  ".........hhhhnnnnnnnnhhh........",
  ".........hhhhnnnnnnnnhhh........",
  ".........hhhhnnnnnnnnhhh........",
  ".........hhhhnnnnnnnnhhh........",
  ".......hhhhhhhhnnnnhhhhhh.......",
  ".......hhhhhhhhnnnnhhhhhh.......",
  ".......hhhhhhhhhhhhhhhhhh.......",
  ".......hhhhhhhhhhhhhhhhhh.......",
  ".......hhhhhhhhhhhhhhhhhh.......",
  ".......hhhhhhhhhhhhhhhhhh.......",
  ".......hhhhhhhhhhhhhhhhhh.......",
  "................................",
];

// ─── Black Cat (brown bg → transparent) ──────────────────────────────────────
const hsCat = [
  "................................",
  "..............lA....Al..........",
  "..............llllllll..........",
  "..............lLLllLLl..........",
  "............lllllAlllll.........",
  "............lllllllllll.........",
  "............lllllllllll.........",
  "............lllllllllll.........",
  "..........llllnnnnnnlll.........",
  ".........lllllnnnnnnnnlll.......",
  ".........lllllnnnnnnnnlll.......",
  ".........lllllnnnnnnnnlll.......",
  ".........lllllnlllnlllll........",
  ".........lllllnlllnlllll........",
  ".........lllllnlllnlllll........",
  ".........lllelnnnnnnnlll........",
  ".........lllelnnnNnnnnll........",
  ".........llllnnnnnnnnnll........",
  ".........llllnnnnnnnnlll........",
  ".........llllnnlllnnnlll........",
  ".........llllnnnnnnnnlll........",
  ".........llllnnnnnnnnlll........",
  ".........llllnnnnnnnnlll........",
  ".........llllnnnnnnnnlll........",
  ".......lllllllllnnlllllll.......",
  ".......lllllllllnnlllllll.......",
  ".......llllllllllllllllll.......",
  ".......llllllllllllllllll.......",
  ".......llllllllllllllllll.......",
  ".......llllllllllllllllll.......",
  ".......llllllllllllllllll.......",
  "................................",
];

// ─── Bubblegum (gold bg → transparent) ───────────────────────────────────────
const hsBubblegum = [
  "................................",
  "................................",
  "................................",
  "................................",
  "...............hhh..............",
  "..............hhhhh.............",
  ".............hhhhhhh............",
  "............hhhhhhhhh...........",
  "..........hhhnnnnnnhhh..........",
  ".........hhhhnnnnnnnnhhh........",
  ".........hhhhnnnnnnnnhhh........",
  ".........hhhhnnnnnnnnhhh........",
  ".........hhhhnhhhhnhhhhh........",
  ".........hhhhnhhhhnhhhhh........",
  ".........hhhhnhhhhnhhhhh........",
  ".........hhhenhnnnnnnhhh........",
  ".........hhhenhhhNnnnnhh........",
  ".........hhhhnnnnhnnnhhh........",
  ".........hhhhnnnnnnnnIIIIII.....",
  ".........hhhhnhhhhnnIOOPPI......",
  ".........hhhhnnnnnnniOOPPI......",
  ".........hhhhnnnnnnniPPPPI......",
  ".........hhhhnnnnnnniPPPPI......",
  ".........hhhhnnnnnnniIIIII......",
  ".......hhhhhhhhnnnnhhhhhh.......",
  ".......hhhhhhhhnnnnhhhhhh.......",
  ".......hhhhhhhhhhhhhhhhhh.......",
  ".......hhhhhhhhhhhhhhhhhh.......",
  ".......hhhhhhhhhhhhhhhhhh.......",
  ".......hhhhhhhhhhhhhhhhhh.......",
  ".......hhhhhhhhhhhhhhhhhh.......",
  "................................",
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
