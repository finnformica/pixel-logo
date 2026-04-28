// Download UI for sprites: hover-revealed button + modal with format/scale/bg options.
// Depends on `renderCanvas` and `renderSVG` from pixels.js.

function spriteToPNGBlob(map, scale, withBackground, padding) {
  const sprite = renderCanvas(map, scale);
  const pad = padding * scale;
  const out = document.createElement("canvas");
  out.width = sprite.width + pad * 2;
  out.height = sprite.height + pad * 2;
  const ctx = out.getContext("2d");
  if (withBackground) {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, out.width, out.height);
  }
  ctx.drawImage(sprite, pad, pad);
  return new Promise((resolve) => out.toBlob(resolve, "image/png"));
}

function spriteToSVGBlob(map, scale, withBackground, padding) {
  const SVG_NS = "http://www.w3.org/2000/svg";
  const w = map[0].length;
  const h = map.length;
  const totalW = w + padding * 2;
  const totalH = h + padding * 2;

  const svg = document.createElementNS(SVG_NS, "svg");
  svg.setAttribute("xmlns", SVG_NS);
  svg.setAttribute("width", totalW * scale);
  svg.setAttribute("height", totalH * scale);
  svg.setAttribute("viewBox", `0 0 ${totalW} ${totalH}`);
  svg.setAttribute("shape-rendering", "crispEdges");

  if (withBackground) {
    const bg = document.createElementNS(SVG_NS, "rect");
    bg.setAttribute("x", 0);
    bg.setAttribute("y", 0);
    bg.setAttribute("width", totalW);
    bg.setAttribute("height", totalH);
    bg.setAttribute("fill", "#ffffff");
    svg.appendChild(bg);
  }

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const ch = map[y][x];
      const color = palette[ch];
      if (!color) continue;
      const r = document.createElementNS(SVG_NS, "rect");
      r.setAttribute("x", x + padding);
      r.setAttribute("y", y + padding);
      r.setAttribute("width", 1);
      r.setAttribute("height", 1);
      r.setAttribute("fill", color);
      svg.appendChild(r);
    }
  }

  const xml = new XMLSerializer().serializeToString(svg);
  return new Blob([xml], { type: "image/svg+xml" });
}

function slugify(name) {
  return name
    .replace(/[^a-z0-9-]+/gi, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();
}

async function downloadSprite(
  map,
  name,
  { format, scale, withBackground, padding },
) {
  const blob =
    format === "svg"
      ? spriteToSVGBlob(map, scale, withBackground, padding)
      : await spriteToPNGBlob(map, scale, withBackground, padding);
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${slugify(name)}.${format}`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

let _downloadTarget = null;

function ensureDownloadModal() {
  let dlg = document.getElementById("downloadModal");
  if (dlg) return dlg;

  dlg = document.createElement("dialog");
  dlg.id = "downloadModal";
  dlg.className = "download-modal";
  dlg.innerHTML = `
    <form method="dialog">
      <h3>Download <span class="dl-name"></span></h3>
      <label>
        <span>Format</span>
        <select name="format">
          <option value="png">PNG</option>
          <option value="svg">SVG</option>
        </select>
      </label>
      <label>
        <span>Scale</span>
        <select name="scale">
          <option value="1">1× (raw pixels)</option>
          <option value="8">8×</option>
          <option value="14">14× (display size)</option>
          <option value="32">32×</option>
          <option value="64" selected>64×</option>
        </select>
      </label>
      <label>
        <span>Padding</span>
        <select name="padding">
          <option value="0">None</option>
          <option value="2">Small (2px)</option>
          <option value="4" selected>Medium (4px)</option>
          <option value="8">Large (8px)</option>
        </select>
      </label>
      <label class="checkbox">
        <input type="checkbox" name="bg" />
        <span>White background</span>
      </label>
      <div class="actions">
        <button type="submit" value="cancel">Cancel</button>
        <button type="submit" value="download" class="primary">Download</button>
      </div>
    </form>
  `;
  document.body.appendChild(dlg);

  dlg.addEventListener("close", () => {
    if (dlg.returnValue !== "download" || !_downloadTarget) return;
    const fd = new FormData(dlg.querySelector("form"));
    downloadSprite(_downloadTarget.map, _downloadTarget.name, {
      format: fd.get("format"),
      scale: parseInt(fd.get("scale"), 10),
      padding: parseInt(fd.get("padding"), 10),
      withBackground: fd.get("bg") === "on",
    });
  });

  return dlg;
}

function attachDownloadButton(container, map, name) {
  const dlg = ensureDownloadModal();
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "download-btn";
  btn.title = `Download ${name}`;
  btn.setAttribute("aria-label", `Download ${name}`);
  btn.innerHTML = `<svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="square" stroke-linejoin="miter"><path d="M8 2v8M5 7.5 8 10.5 11 7.5M3 13h10"/></svg>`;
  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    _downloadTarget = { map, name };
    dlg.querySelector(".dl-name").textContent = name;
    dlg.showModal();
  });
  container.appendChild(btn);
}
