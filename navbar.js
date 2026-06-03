// Builds the shared navbar (links + download presets button) on every page.
// Depends on pixels.js (blueDragon/propHoodie), download.js (sprite blob helpers),
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
  btn.title = "Download logo presets (zip of 8 files at 64x / large padding)";
  btn.textContent = "DOWNLOAD PRESETS";
  nav.appendChild(btn);

  document.body.insertBefore(nav, document.body.firstChild);
  return btn;
}

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

buildNavbar().addEventListener("click", async () => {
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
});
