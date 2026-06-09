// Builds the shared navbar (links + download button) on every page.
// Depends on pixels.js (blueDragon/propHoodie/characters), download.js (sprite blob helpers),
// and JSZip loaded via CDN.

function buildNavbar() {
  const nav = document.createElement("nav");
  nav.className = "topbar";

  const isLogos    = location.pathname.endsWith("logos.html");
  const isHeadshot = location.pathname.endsWith("headshot.html");

  const links = [
    { href: "index.html",    label: "CHARACTERS", active: !isLogos && !isHeadshot },
    { href: "logos.html",    label: "LOGO IDEAS",  active: isLogos },
    { href: "headshot.html", label: "HEADSHOTS",   active: isHeadshot },
  ];
  for (const { href, label, active } of links) {
    const a = document.createElement("a");
    a.href = href;
    a.textContent = label;
    if (active) a.className = "active";
    nav.appendChild(a);
  }

  const btn = document.createElement("button");
  btn.id = "downloadPresets";
  btn.className = "nav-download";
  btn.type = "button";
  btn.title = isLogos
    ? "Download logo presets (zip of 8 files at 64x / large padding)"
    : "Download all headshots as a zip";
  btn.textContent = "Download";
  nav.appendChild(btn);

  document.body.insertBefore(nav, document.body.firstChild);
  return btn;
}

// === Logo presets (logos.html only) ===

const _presetSets = [
  { base: "finnformica", map: blueDragon, offset: -1 },
  { base: "formic-software", map: propHoodie, offset: -1 },
];
const _presets = _presetSets.flatMap(({ base, map, offset }) => [
  { name: `${base}-no-bg`, map, offset, format: "svg", withBackground: false },
  {
    name: `${base}-white-bg`,
    map,
    offset,
    format: "svg",
    withBackground: true,
  },
  { name: `${base}-no-bg`, map, offset, format: "png", withBackground: false },
  {
    name: `${base}-white-bg`,
    map,
    offset,
    format: "png",
    withBackground: true,
  },
]);

async function downloadLogoPresets() {
  const Zip = /** @type {any} */ (globalThis).JSZip;
  const zip = new Zip();
  const folder = zip.folder("logos");
  for (const p of _presets) {
    const blob =
      p.format === "svg"
        ? spriteToSVGBlob(p.map, 64, p.withBackground, 6, p.offset)
        : await spriteToPNGBlob(p.map, 64, p.withBackground, 6, p.offset);
    folder.file(`${p.name}.${p.format}`, blob);
  }
  const out = await zip.generateAsync({ type: "blob" });
  const url = URL.createObjectURL(out);
  const a = document.createElement("a");
  a.href = url;
  a.download = "logos.zip";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

// === Headshots bulk download (index.html only) ===

function ensureHeadshotsModal() {
  let dlg = document.getElementById("headshotsModal");
  if (dlg) return dlg;

  dlg = document.createElement("dialog");
  dlg.id = "headshotsModal";
  dlg.className = "download-modal";
  dlg.innerHTML = `
    <form method="dialog">
      <h3>Download Headshots</h3>
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
          <option value="6">Large (6px)</option>
        </select>
      </label>
      <label>
        <span>Vertical offset</span>
        <select name="offset">
          <option value="-3">−3px (up)</option>
          <option value="-2">−2px (up)</option>
          <option value="-1">−1px (up)</option>
          <option value="0" selected>0</option>
          <option value="1">+1px (down)</option>
          <option value="2">+2px (down)</option>
          <option value="3">+3px (down)</option>
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

  dlg.addEventListener("close", async () => {
    if (dlg.returnValue !== "download") return;
    const fd = new FormData(dlg.querySelector("form"));
    const opts = {
      format: fd.get("format"),
      scale: parseInt(fd.get("scale"), 10),
      padding: parseInt(fd.get("padding"), 10),
      offset: parseInt(fd.get("offset"), 10),
      withBackground: fd.get("bg") === "on",
    };

    const Zip = /** @type {any} */ (globalThis).JSZip;
    const zip = new Zip();
    const folder = zip.folder("headshots");
    for (const { name, map } of characters) {
      const blob =
        opts.format === "svg"
          ? spriteToSVGBlob(map, opts.scale, opts.withBackground, opts.padding, opts.offset)
          : await spriteToPNGBlob(map, opts.scale, opts.withBackground, opts.padding, opts.offset);
      folder.file(`${slugify(name)}.${opts.format}`, blob);
    }
    const out = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(out);
    const a = document.createElement("a");
    a.href = url;
    a.download = "headshots.zip";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  });

  return dlg;
}

// === Headshots page bulk download (headshot.html only) ===
// Reads the current bg colour + transparency state directly from the page controls,
// then zips all headshots using the same renderHeadshot function as the per-card buttons.

async function downloadHeadshotsFromPage() {
  const bgInput  = document.getElementById("bgColour");
  const clearBtn = document.getElementById("clearBg");
  // clearBtn reads "Transparent" when bg is active, "Use Colour" when transparent
  const usingBg = clearBtn && clearBtn.textContent.trim() === "Transparent";
  const bg = usingBg && bgInput ? bgInput.value : null;

  const Zip = /** @type {any} */ (globalThis).JSZip;
  const zip = new Zip();
  const folder = zip.folder("headshots");
  for (const { name, map } of headshots) {
    const cv = renderHeadshot(map, bg, 64);
    const blob = await new Promise((resolve) => cv.toBlob(resolve, "image/png"));
    folder.file(`headshot-${name.toLowerCase().replace(/\s+/g, "-")}.png`, blob);
  }
  const out = await zip.generateAsync({ type: "blob" });
  const url = URL.createObjectURL(out);
  const a = document.createElement("a");
  a.href = url;
  a.download = "headshots.zip";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

// === Wire up navbar button ===

const _isLogos    = location.pathname.endsWith("logos.html");
const _isHeadshot = location.pathname.endsWith("headshot.html");

buildNavbar().addEventListener("click", () => {
  if (_isLogos) {
    downloadLogoPresets();
  } else if (_isHeadshot) {
    downloadHeadshotsFromPage();
  } else {
    ensureHeadshotsModal().showModal();
  }
});
