const SCALE = 12; // 12px per pixel → 384×384 canvas display (32×32 art grid)
const grid  = document.getElementById("hsGrid");

let bgColour = document.getElementById("bgColour").value; // current bg (null = transparent)
let useBg    = true;

// Render a headshot canvas with optional solid background colour.
// `scale` defaults to the display scale; pass a larger value for high-res exports.
function renderHeadshot(map, bg, scale = SCALE) {
  const w = map[0].length;
  const h = map.length;
  const cv = document.createElement("canvas");
  cv.width  = w * scale;
  cv.height = h * scale;
  const ctx = cv.getContext("2d");
  if (bg) {
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, cv.width, cv.height);
  }
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const ch    = map[y][x];
      const color = palette[ch];
      if (!color) continue;
      ctx.fillStyle = color;
      ctx.fillRect(x * scale, y * scale, scale, scale);
    }
  }
  return cv;
}

// Rebuild all canvases with the current bg setting.
function redrawAll() {
  const bg = useBg ? bgColour : null;
  document.querySelectorAll(".hs-canvas").forEach((cv) => {
    const name = cv.dataset.name;
    const hs   = headshots.find((h) => h.name === name);
    if (!hs) return;
    const fresh = renderHeadshot(hs.map, bg);
    cv.width  = fresh.width;
    cv.height = fresh.height;
    cv.getContext("2d").drawImage(fresh, 0, 0);
  });
}

// Build the grid.
headshots.forEach(({ name, map }) => {
  const card = document.createElement("div");
  card.className = "hs-card";

  const cv = renderHeadshot(map, useBg ? bgColour : null);
  cv.className  = "hs-canvas";
  cv.dataset.name = name;
  card.appendChild(cv);

  const label = document.createElement("div");
  label.className = "hs-label";
  label.textContent = name;
  card.appendChild(label);

  // Download button
  const btn = document.createElement("button");
  btn.className = "download-btn";
  btn.title = `Download ${name}`;
  btn.textContent = "↓";
  btn.addEventListener("click", async () => {
    const bg   = useBg ? bgColour : null;
    const blob = await new Promise((resolve) => {
      const c = renderHeadshot(map, bg, 64);
      c.toBlob(resolve, "image/png");
    });
    const url = URL.createObjectURL(blob);
    const a   = document.createElement("a");
    a.href     = url;
    a.download = `headshot-${name.toLowerCase().replace(/\s+/g, "-")}.png`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  });
  card.appendChild(btn);

  grid.appendChild(card);
});

// Colour picker
document.getElementById("bgColour").addEventListener("input", (e) => {
  bgColour = e.target.value;
  useBg    = true;
  redrawAll();
});

// Transparent button
document.getElementById("clearBg").addEventListener("click", () => {
  useBg = !useBg;
  if (useBg) {
    // restore colour bg — show checkerboard if none set
    redrawAll();
    document.getElementById("clearBg").textContent = "Transparent";
  } else {
    redrawAll();
    document.getElementById("clearBg").textContent = "Use Colour";
  }
});
