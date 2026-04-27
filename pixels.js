// Palette extracted from the source PNG (sampled cell centers).
const palette = {
  ".": null,        // transparent
  K: "#000000",     // black outline
  W: "#F8F8F8",     // white
  c: "#A8E0F8",     // light cyan       (Bub head)
  B: "#0068E8",     // dark blue        (Bub body shadow)
  p: "#F870B0",     // pink             (Bub mouth/feet)
  r: "#E80058",     // red              (eye / red flower)
  o: "#F87060",     // coral / salmon   (Pink flower body, accents)
  g: "#48D848",     // green            (Green dragon body, leaves)
  t: "#82ACDD",     // light blue       (Blue dragon body)
  C: "#214C89",     // dark blue        (Blue dragon shadow)

  // Logo-variant palette extensions (used by logos.html).
  G: "#1F8A3A",     // dark green       (Sprout)
  f: "#FFB347",     // light orange     (Forge)
  F: "#C2410C",     // dark orange      (Forge)
  m: "#D8A3E8",     // light lilac      (Pulse)
  M: "#6B2D8C",     // dark purple      (Pulse)
  s: "#D0D0D0",     // light grey       (Mono)
  S: "#404040",     // dark grey        (Mono)
  y: "#FFE066",     // sunny yellow     (Spark)
  Y: "#B8860B",     // dark gold        (Spark)
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
  "....KK....KK.......",
  "...K........K......",
  "..K......rrr.K.....",
  "..K.....rrorr.K....",
  ".K......ro.orr.K...",
  ".K......ro.orr.K...",
  ".K.......rorrr.K...",
  ".K..K..K..rrr...K..",
  ".K.KKKKK........K..",
  "..KKKKKKK.K..K..K..",
  "...KKKKKKKK..K..K..",
  "..K.K.KKKKKKK....K.",
  "...K...K..K.......K",
  "...K..............K",
  "..K....KK....KKKKK.",
  "...KKKK..KKKK......",
  "...................",
];

const greenDragon = [
  ".........K........",
  "........KoK.......",
  "....KKKKoooKK.....",
  "...KoooogggggK....",
  "....KoogggggggK...",
  "...KKKgggg..g.gK..",
  "..Koooggg..KgK.K..",
  "...Kogggg..KgK.K..",
  "...KKgggg..KgK.gK.",
  "..Koogggg..KgK.gK.",
  "...Koggggg..g.ggK.",
  "...KKgoggKKK.KKK..",
  ".K.KgooogggggggK..",
  "KgKKgooogg....KK..",
  "Kgoogoogg......K..",
  ".Kggggggoo.....KK.",
  "..Kggggoooo...oooK",
  "..KKKKKKKKKKKKKKK.",
];

const pinkFlower = [
  "..........KK......",
  "......KKKK..K.....",
  ".....Kooo...K.....",
  "....Koooo..ooK....",
  "..KKooo..oooooKK..",
  ".Koooo...oooooooK.",
  "Kogooo..oooooooooK",
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
  ".....KKK......K...",
  "....K..........K..",
  "...K.........KK...",
  "...K.........K....",
  "..K..KKK......K...",
  "..K.KrKrK.....K...",
  "..K.r.r.rK....K...",
  ".KK.rrrrrK.K.K....",
  "K..KKrKr....KK....",
  ".K....K.......K...",
  ".K...K........K...",
  "..K..K.........KK.",
  "..K...KK.......K.K",
  "..KK.....ooo.....K",
  "..Kooo...oooo...K.",
  ".Kooooo...ooo.KK..",
  "..KKKKKKKKKKKK....",
];

const blueDragon = [
  ".........K........",
  "........KCK.......",
  "....KKKKCCCKK.....",
  "...KCCCCtttttK....",
  "....KCCtttttttK...",
  "...KKKtttt..t.tK..",
  "..KCCCttt..KtK.K..",
  "...KCtttt..KtK.K..",
  "...KKtttt..KtK.tK.",
  "..KCCtttt..KtK.tK.",
  "...KCttttt..t.ttK.",
  "...KKtCttKKK.KKK..",
  ".K.KtCCCtttttttK..",
  "KtKKtCCCtt....KK..",
  "KtCCtCCtt......K..",
  ".KttttttCC.....KK.",
  "..KttttCCCC...CCCK",
  "..KKKKKKKKKKKKKKK.",
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
  return map.map(row =>
    row.split("").map(ch => mapping[ch] ?? ch).join("")
  );
}

const PIXEL = 14; // size of each pixel in screen px

function renderCanvas(map, scale = PIXEL) {
  const w = map[0].length, h = map.length;
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
  const w = map[0].length, h = map.length;
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
