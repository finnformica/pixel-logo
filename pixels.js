// Palette extracted from the source PNG (sampled cell centers).
const palette = {
  ".": null, // transparent
  K: "#000000", // black outline
  W: "#F8F8F8", // white
  c: "#A8E0F8", // light cyan       (Bub head)
  B: "#0068E8", // dark blue        (Bub body shadow)
  p: "#F870B0", // pink             (Bub mouth/feet)
  r: "#E80058", // red              (eye / red flower)
  o: "#F87060", // coral / salmon   (Pink flower body, accents)
  g: "#48D848", // green            (Green dragon body, leaves)
  t: "#82ACDD", // light blue       (Blue dragon body)
  C: "#214C89", // dark blue        (Blue dragon shadow)

  // Logo-variant palette extensions (used by logos.html).
  G: "#1F8A3A", // dark green       (Sprout)
  f: "#FFB347", // light orange     (Forge)
  F: "#C2410C", // dark orange      (Forge)
  m: "#D8A3E8", // light lilac      (Pulse)
  M: "#6B2D8C", // dark purple      (Pulse)
  s: "#D0D0D0", // light grey       (Mono)
  S: "#404040", // dark grey        (Mono / hoodie)
  y: "#FFE066", // sunny yellow     (Spark / wizard hat band)
  Y: "#B8860B", // dark gold        (Spark)
};

const bub = [
  ".....KKKKKK.......",
  "....KccccccKKK....",
  "...KccccccccccK...",
  "..KccccccccccccK..",
  "..KccccccccccccK..",
  "..KcKcKccccccccK..",
  "..KcKcKccccKKcKK..",
  "..KcKcKcccKccKccK.",
  "..KccccccKcKKcKKcK",
  "...KKKKKKKcKKcKKcK",
  "..KKKKKKKKKccKccK.",
  ".KBBBBBBBBBKKBKK..",
  ".KBBBBBBBBBBBBBK..",
  "KppppBBBBBBBBBBK..",
  ".KppppBBBBBBBBK...",
  "..KppppKKpppKK....",
  "...KKKKppppppK....",
  ".......KKKKKK.....",
];

const ghost = [
  "......KKKK.........",
  "....KKWWWWKK.......",
  "...KWWWWWWWWK......",
  "..KWWWWWWrrrWK.....",
  "..KWWWWWrrorrWK....",
  ".KWWWWWWroWorrWK...",
  ".KWWWWWWroWorrWK...",
  ".KWWWWWWWrorrrWK...",
  ".KWWKWWKWWrrrWWWK..",
  ".KWKKKKKWWWWWWWWK..",
  "..KKKKKKKWKWWKWWK..",
  "...KKKKKKKKWWKWWK..",
  "..KWKWKKKKKKKWWWWK.",
  "...KWWWKWWKWWWWWWWK",
  "...KWWWWWWWWWWWWWWK",
  "..KWWWWKKWWWWKKKKK.",
  "...KKKK..KKKK......",
  "...................",
];

const greenDragon = [
  "........K.........",
  ".......KoK........",
  ".....KKoooKKKK....",
  "....KgggggooooK...",
  "...KgggggggooK....",
  "..KgWgWWggggKKK...",
  "..KWKgKWWgggoooK..",
  "..KWKgKWWggggoK...",
  ".KgWKgKWWggggKK...",
  ".KgWKgKWWggggooK..",
  ".KggWgWWgggggoK...",
  "..KggggggggogKK...",
  "..KgggggggooogK.K.",
  "..KKWWWWggooogKKgK",
  "..KWWWWWWggoogoogK",
  ".KKWWWWWooggggggK.",
  "KoooWWWooooggggK..",
  ".KKKKKKKKKKKKKKK..",
];

const pinkFlower = [
  "..........KK......",
  "......KKKKWWK.....",
  ".....KoooWWWK.....",
  "....KooooWWooK....",
  "..KKoooWWoooooKK..",
  ".KooooWWWoooooooK.",
  "KogoooWWoooooooooK",
  "KgggooooooooooogoK",
  "KgggoooooooooogggK",
  "KogooooKooKooogggK",
  ".KooooooooooooogK.",
  "..KKoooKooKoooKK..",
  "..KooooKooKooooK..",
  ".KgggooKooKooooK..",
  ".KgggoooooooooggK.",
  ".KgggoKooooKogggK.",
  "..KggoKKKKKKoggK..",
  "...KKK......KKK...",
];

const whiteFlower = [
  "........KKKKKK....",
  ".....KKKWWWWWWK...",
  "....KWWWWWWWWWWK..",
  "...KWWWWWWWWWKK...",
  "...KWWWWWWWWWK....",
  "..KWWKKKWWWWWWK...",
  "..KWKrKrKWWWWWK...",
  "..KWrWrWrKWWWWK...",
  ".KKWrrrrrKWKWK....",
  "KWWKKrKrWWWWKK....",
  ".KWWWWKWWWWWWWK...",
  ".KWWWKWWWWWWWWK...",
  "..KWWKWWWWWWWWWKK.",
  "..KWWWKKWWWWWWWKWK",
  "..KKWWWWWoooWWWWWK",
  "..KoooWWWooooWWWK.",
  ".KoooooWWWoooWKK..",
  "..KKKKKKKKKKKK....",
];

const blueDragon = [
  "........K.........",
  ".......KCK........",
  ".....KKCCCKKKK....",
  "....KtttttCCCCK...",
  "...KtttttttCCK....",
  "..KtWtWWttttKKK...",
  "..KWKtKWWtttCCCK..",
  "..KWKtKWWttttCK...",
  ".KtWKtKWWttttKK...",
  ".KtWKtKWWttttCCK..",
  ".KttWtWWtttttCK...",
  "..KttttttttCtKK...",
  "..KtttttttCCCtK.K.",
  "..KKWWWWttCCCtKKtK",
  "..KWWWWWWttCCtCCtK",
  ".KKWWWWWCCttttttK.",
  "KCCCWWWCCCCttttK..",
  ".KKKKKKKKKKKKKKK..",
];

const characters = [
  { name: "Bub", map: bub },
  { name: "Ghost", map: ghost },
  { name: "GreenDragon", map: greenDragon },
  { name: "PinkFlower", map: pinkFlower },
  { name: "WhiteFlower", map: whiteFlower },
  { name: "BlueDragon", map: blueDragon },
];

// Recolor a sprite by remapping characters. e.g. recolor(blueDragon, {t:"f", C:"F"})
function recolor(map, mapping) {
  return map.map((row) =>
    row
      .split("")
      .map((ch) => mapping[ch] ?? ch)
      .join(""),
  );
}

// === PROP VARIANTS — blue dragon with different accessories. ===
// Wizard hat: sits low on the head and sweeps back to the left.
const propWizard = [
  "..............K...",
  ".............KMK..",
  "............KMMK..",
  "...........KMMMK..",
  "..........KMyyMK..",
  ".........KMMMMMK..",
  "........KMMMMMK...",
  ".......KMMMMMMK...",
  "......KMMMMMMMKK..",
  ".....KKCCKKKKKKKK.",
  "....KtttttCCCCK...",
  "...KtttttttCCK....",
  "..KtWtWWttttKKK...",
  "..KWKtKWWtttCCCK..",
  "..KWKtKWWttttCK...",
  ".KtWKtKWWttttKK...",
  ".KtWKtKWWttttCCK..",
  ".KttWtWWtttttCK...",
  "..KttttttttCtKK...",
  "..KtttttttCCCtK.K.",
  "..KKWWWWttCCCtKKtK",
  "..KWWWWWWttCCtCCtK",
  ".KKWWWWWCCttttttK.",
  "KCCCWWWCCCCttttK..",
  ".KKKKKKKKKKKKKKK..",
];

// Sunglasses: rounded Ray-Ban-style lenses sitting over the eyes,
// connected by a 1-pixel bridge, with one arm going around the back/left side.
const propGlasses = [
  "........K.........",
  ".......KCK........",
  ".....KKCCCKKKK....",
  "....KtttttCCCCK...",
  "...KtttttttCCK....",
  ".KKKtttKKKttKKK...",
  "KKKKKtKKKKKKKKKK..",
  "KKKKKKKKKKKttCK...",
  "KKKKKtKKKKKttKK...",
  ".KKKKtKKKKtttCCK..",
  ".KttWtWWtttttCK...",
  "..KttttttttCtKK...",
  "..KtttttttCCCtK.K.",
  "..KKWWWWttCCCtKKtK",
  "..KWWWWWWttCCtCCtK",
  ".KKWWWWWCCttttttK.",
  "KCCCWWWCCCCttttK..",
  ".KKKKKKKKKKKKKKK..",
];

const propHoodie = [
  "........KKKKKK....",
  ".....KKKSSSSSSK...",
  "....KSSSSSSSSSSK..",
  "...KSSSSSSSSSKK...",
  "...KSSSSSSSSSK....",
  "..KSSKKKSSSSSSK...",
  "..KSKtKtKSSSSSK...",
  "..KStWtWtKSSSSK...",
  ".KKStttttKSKSK....",
  "KSSKKtKtSSSSKK....",
  ".KSSSSKSSSSSSSK...",
  ".KSSSKSSSSSSSSK...",
  "..KSSKSSSSSSSSSKK.",
  "..KSSSKKSSSSSSSKSK",
  "..KKSSSSStttSSSSSK",
  "..KtttSSSttttSSSK.",
  ".KtttttSSStttSKK..",
  "..KKKKKKKKKKKK....",
];

const PIXEL = 14; // size of each pixel in screen px

function renderCanvas(map, scale = PIXEL) {
  const w = map[0].length,
    h = map.length;
  const cv = document.createElement("canvas");
  cv.width = w * scale;
  cv.height = h * scale;
  const ctx = cv.getContext("2d");
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const ch = map[y][x];
      const color = palette[ch];
      if (!color) continue;
      ctx.fillStyle = color;
      ctx.fillRect(x * scale, y * scale, scale, scale);
    }
  }
  return cv;
}

function renderSVG(map, scale = PIXEL) {
  const w = map[0].length,
    h = map.length;
  const SVG_NS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(SVG_NS, "svg");
  svg.setAttribute("width", w * scale);
  svg.setAttribute("height", h * scale);
  svg.setAttribute("viewBox", `0 0 ${w} ${h}`);
  svg.setAttribute("shape-rendering", "crispEdges");
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const ch = map[y][x];
      const color = palette[ch];
      if (!color) continue;
      const r = document.createElementNS(SVG_NS, "rect");
      r.setAttribute("x", x);
      r.setAttribute("y", y);
      r.setAttribute("width", 1);
      r.setAttribute("height", 1);
      r.setAttribute("fill", color);
      svg.appendChild(r);
    }
  }
  return svg;
}
