// Headshot portrait pixel maps — 32×32 square, transparent background (`.`).
// Extends the global `palette` with headshot-specific colours.

Object.assign(palette, {
  n: "#F2C07A", // skin
  N: "#C8905A", // skin shadow
  h: "#1A0804", // dark hair
  j: "#141414", // hoodie
  e: "#BEBEBE", // silver earring
  P: "#E040AA", // pink bubblegum light
  I: "#C02080", // pink bubblegum dark
  l: "#101010", // cat fur (near-black)
  L: "#E8C000", // cat eye yellow
  A: "#D04080", // cat inner ear / nose pink
  // reuses from main palette:
  //   K(black) W(white) f(orange)  → penguin
  //   g(green) G(dark green) Y(dark gold)  → t-rex; a(teeth white) added below
  //   m(lilac) M(dark purple)  → sunglasses visor
  a: "#F8F8D0", // t-rex teeth / white highlight
  q: "#2A7020", // t-rex mid-green
});

// ─── Row builder — logs error if result isn't exactly 32 chars ────────────────
const _R = (...parts) => {
  const s = parts.join("");
  if (s.length !== 32) console.error(`row ${s.length}≠32: "${s}"`);
  return s;
};
const _rep = (n, c) => (n > 0 ? c.repeat(n) : "");
const _bg  = (n) => _rep(n, ".");
const _sk  = (n) => _rep(n, "n");
const _hr  = (n) => _rep(n, "h");
const _jj  = (n) => _rep(n, "j");

// ─── Column layout for all face rows (5 + 4 + 1 + 12 + 1 + 5 + 4 = 32) ──────
// cols  0– 4 : left bg / earring
// cols  5– 8 : left hair (4)
// col   9    : left face outline K
// cols 10–21 : face interior (12)
// col  22    : right face outline K
// cols 23–27 : right hair (5)
// cols 28–31 : right bg (4)
const _face = (interior, earring = false) =>
  _R(_bg(4), earring ? "e" : ".", _hr(4), "K", interior, "K", _hr(5), _bg(4));

// Interior templates — all exactly 12 chars
const _SK  = _sk(12);                          // plain skin
const _BR  = "KK" + _sk(7) + "KKn";           // eyebrow / eye band
const _NSH = _sk(5) + "N" + _sk(6);           // nose shadow
const _NOS = _sk(5) + "K" + _sk(6);           // nostril
const _MTH = _sk(4) + "KKKKKK" + _sk(2);      // mouth bar
const _CHN = _rep(10, "N") + _sk(2);           // chin shadow
const _CHO = "KK" + _sk(8) + "KK";            // chin outline
const _VT  = _rep(12, "K");                    // visor top (solid black)
const _VM  = "K" + _rep(10, "m") + "K";       // visor mid (light purple)
const _VB  = "K" + _rep(10, "M") + "K";       // visor bottom (dark purple)

// ─── Shared rows used by every portrait ───────────────────────────────────────
// row  0– 1 : transparent
// row  2– 4 : hair crown
// row  5–22 : face (via _face())
// row 23    : neck
// row 24    : lower hair
// row 25–31 : hoodie (widening)

const _ROW0  = _bg(32);
const _ROW2  = _R(_bg(9),  _hr(14), _bg(9));   // 9+14+9  = 32
const _ROW3  = _R(_bg(7),  _hr(18), _bg(7));   // 7+18+7  = 32
const _ROW4  = _R(_bg(5),  _hr(22), _bg(5));   // 5+22+5  = 32
const _NECK  = _R(_bg(5), _hr(7), "K", _sk(6), "K", _hr(9), _bg(3)); // 5+7+1+6+1+9+3=32
const _LHAIR = _R(_bg(5), _hr(22), _bg(5));    // 5+22+5  = 32
const _H25   = _R(_bg(4), _jj(24), _bg(4));    // 4+24+4  = 32
const _H26   = _R(_bg(3), _jj(26), _bg(3));    // 3+26+3  = 32
const _H27   = _R(_bg(2), _jj(28), _bg(2));    // 2+28+2  = 32
const _H28   = _R(_bg(1), _jj(30), _bg(1));    // 1+30+1  = 32
const _H29   = _jj(32);                         // 32
const _HBOT  = [_NECK, _LHAIR, _H25, _H26, _H27, _H28, _H29, _H29]; // rows 23-30
// one more row for 31:  total = 5(crown)+18(face)+8(bottom)+1 = 32
const _HBOT2 = [..._HBOT, _H29]; // rows 23–31 = 9 rows

// ─── Standard face block (rows 5–22, 18 rows) ─────────────────────────────────
const _FACE_ROWS = [
  _face(_SK),              //  5
  _face(_SK),              //  6
  _face(_SK),              //  7
  _face(_SK),              //  8
  _face(_SK),              //  9
  _face(_SK),              // 10
  _face(_BR, true),        // 11  eyebrows + earring
  _face(_BR, true),        // 12  eyes top
  _face(_BR),              // 13  eyes bottom
  _face(_SK),              // 14
  _face(_SK),              // 15
  _face(_NSH),             // 16  nose shadow
  _face(_NOS),             // 17  nostril
  _face(_SK),              // 18
  _face(_SK),              // 19
  _face(_MTH),             // 20  mouth
  _face(_CHN),             // 21  chin shadow
  _face(_CHO),             // 22  chin outline
];

// Helper: replace tail of a 32-char row.
// replaces chars from `start` to end with `tail`; total must stay 32.
const _tail = (row, start, tail) => {
  const s = row.slice(0, start) + tail;
  if (s.length !== 32) console.error(`_tail ${s.length}≠32`);
  return s;
};

// ─── Plain ────────────────────────────────────────────────────────────────────
const hsPlain = [
  _ROW0, _ROW0,            // 0-1
  _ROW2, _ROW3, _ROW4,    // 2-4
  ..._FACE_ROWS,           // 5-22
  ..._HBOT2,               // 23-31
];

// ─── Sunglasses ───────────────────────────────────────────────────────────────
const hsSunglasses = [
  _ROW0, _ROW0,
  _ROW2, _ROW3, _ROW4,
  _face(_SK), _face(_SK), _face(_SK), _face(_SK), _face(_SK), _face(_SK), // 5-10
  _face(_VT, true),  // 11 visor top
  _face(_VM, true),  // 12 visor fill
  _face(_VM),        // 13
  _face(_VB),        // 14 visor bottom
  _face(_SK),        // 15
  _face(_NSH),       // 16
  _face(_NOS),       // 17
  _face(_SK),        // 18
  _face(_SK),        // 19
  _face(_MTH),       // 20
  _face(_CHN),       // 21
  _face(_CHO),       // 22
  ..._HBOT2,
];

// ─── Penguin on left shoulder ─────────────────────────────────────────────────
// Penguin overlays lower-left of hoodie (rows 25-29, cols 0-4)
// Penguin is 5 wide × 5 tall: head(KKK), face(KWlK), body(KWlK), feet(KffK), base(KKK)
const _PEN = [
  _R("KKK",  _jj(25), _bg(4)),  // 25: 3+25+4=32 — penguin head
  _R("KWlK", _jj(24), _bg(4)),  // 26: 4+24+4=32 — penguin face
  _R("KWlK", _jj(24), _bg(4)),  // 27
  _R("KffK", _jj(24), _bg(4)),  // 28: orange feet
  _R("KKK.", _jj(24), _bg(4)),  // 29: 4+24+4=32
];

const hsPenguin = [
  _ROW0, _ROW0,
  _ROW2, _ROW3, _ROW4,
  ..._FACE_ROWS,
  _NECK, _LHAIR,  // 23-24
  ..._PEN,         // 25-29
  _H29,            // 30
  _H29,            // 31
];

// ─── T-Rex on top of head (rows 0–4 replaced) ─────────────────────────────────
// T-rex is roughly 14 wide, centered around col 16, drawn above hair
const _TREX_CROWN = [
  _R(_bg(13), "KKggggqgKK", _bg(9)),    // 0: 13+10+9=32
  _R(_bg(12), "KKgqgggggKK", _bg(9)),   // 1: 12+11+9=32
  _R(_bg(11), "KgWgggqqgKKa", _bg(9)),  // 2: 11+12+9=32
  _R(_bg(10), "KGGGGqqgqKK", _bg(11)),  // 3: 10+11+11=32
  _R(_bg(9),  "KGGGgggKKKK", _bg(12)),  // 4: 9+11+12=32
];

const hsTrex = [
  ..._TREX_CROWN,
  ..._FACE_ROWS,
  ..._HBOT2,
];

// ─── Black cat on top of head (rows 0–4 replaced) ─────────────────────────────
// Cat head is 12 wide (cols 7-18), ears poke up at rows 0-1
const _CAT_CROWN = [
  _R(_bg(9),  "ll", _bg(6), "ll", _bg(13)), // 0: 9+2+6+2+13=32 — ear tips
  _R(_bg(8),  "lAl", _bg(4), "lAl", _bg(14)),// 1: 8+3+4+3+14=32 — inner ears
  _R(_bg(7),  _rep(12, "l"), _bg(13)),        // 2: 7+12+13=32 — cat head
  _R(_bg(7),  "lL" + _rep(8,"l") + "Ll", _bg(13)), // 3: 7+12+13=32 — cat eyes
  _R(_bg(7),  _rep(5,"l") + "A" + _rep(6,"l"), _bg(13)), // 4: 7+12+13=32 — cat nose
];

const hsCat = [
  ..._CAT_CROWN,
  ..._FACE_ROWS,
  ..._HBOT2,
];

// ─── Bubblegum (bubble exits right of mouth at rows 20–24) ────────────────────
// Standard face through row 19, then replace tail of rows 20-24 with bubble pixels.
// cols 20-31 (12 chars) are replaced per row.
//   row 20 mouth: "....hhhhh...." becomes "nIPPPPPPPP.." on right
//   row 21 chin:                          "NIPPPPPPPP.."
//   row 22 chout:                         "KKIPPPPhhh.."
//   row 23 neck:                          "KhhhIPhhhhh."  (replaces from col 20)
//   row 24 lhair:                         "PPhhh."         (replaces from col 26)

const _bm20 = _tail(_face(_MTH, true), 20, "nIPPPPPPPP.."); // 20+12=32
const _bm21 = _tail(_face(_CHN, true), 20, "NIPPPPPPPP.."); // 20+12=32
const _bm22 = _tail(_face(_CHO),       20, "KKIPPPPhhh.."); // 20+12=32
const _bm23 = _tail(_NECK,             20, "KhhhIPhhhhh."); // 20+12=32
const _bm24 = _tail(_LHAIR,            26, "PPhhh.");        // 26+6=32

const hsBubblegum = [
  _ROW0, _ROW0,
  _ROW2, _ROW3, _ROW4,
  _face(_SK), _face(_SK), _face(_SK), _face(_SK), _face(_SK), _face(_SK), // 5-10
  _face(_BR, true), _face(_BR, true), _face(_BR),  // 11-13 eyes/brows
  _face(_SK), _face(_SK),                           // 14-15
  _face(_NSH), _face(_NOS),                         // 16-17 nose
  _face(_SK), _face(_SK),                           // 18-19
  _bm20, _bm21, _bm22,                              // 20-22 mouth + bubble
  _bm23, _bm24,                                     // 23-24 neck/hair + bubble
  _H25, _H26, _H27, _H28, _H29, _H29, _H29,        // 25-31
];

// ─── Registry ─────────────────────────────────────────────────────────────────
const headshots = [
  { name: "Penguin",    map: hsPenguin },
  { name: "T-Rex",      map: hsTrex },
  { name: "Sunglasses", map: hsSunglasses },
  { name: "Plain",      map: hsPlain },
  { name: "Black Cat",  map: hsCat },
  { name: "Bubblegum",  map: hsBubblegum },
];
