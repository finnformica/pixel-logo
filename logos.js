// Each variant remaps the blue-dragon sprite chars (t = light, C = dark)
// into a new palette pair already defined in pixels.js.
const variants = [
  {
    name: "Personal (reference)",
    desc: "Your existing blue dragon — included for comparison.",
    map: blueDragon,
    swatches: ["t", "C"],
  },
  {
    name: "Sprout",
    desc: "Greens. Reads as growth, fresh, dev-coded. Approachable for smaller clients.",
    map: recolor(blueDragon, { t: "g", C: "G" }),
    swatches: ["g", "G"],
  },
  {
    name: "Forge",
    desc: "Warm orange. Confident, energetic, creative-leaning. Stands out against blue tech-stack defaults.",
    map: recolor(blueDragon, { t: "f", C: "F" }),
    swatches: ["f", "F"],
  },
  {
    name: "Pulse",
    desc: "Lilac and deep purple. Modern, design-forward — leans more agency / brand-led work than pure dev.",
    map: recolor(blueDragon, { t: "m", C: "M" }),
    swatches: ["m", "M"],
  },
  {
    name: "Mono",
    desc: "Greyscale. Minimalist, professional, never clashes with a client's brand colours.",
    map: recolor(blueDragon, { t: "s", C: "S" }),
    swatches: ["s", "S"],
  },
  {
    name: "Spark",
    desc: "Yellow-gold. Optimistic and high-contrast. Memorable as a thumbnail.",
    map: recolor(blueDragon, { t: "y", C: "Y" }),
    swatches: ["y", "Y"],
  },
];

const props = [
  {
    name: "Wizard",
    desc: "Pointy hat sitting low on the head, swept back. Magical, playful, creative-coding energy.",
    map: propWizard,
  },
  {
    name: "Sunglasses",
    desc: "Chunky black shades. Cool, confident, design-led — reads at any size.",
    map: propGlasses,
  },
  {
    name: "Hoodie",
    desc: "Full dark-grey hoodie, ghost-inspired drape. Heads-down builder, code-ninja vibe.",
    map: propHoodie,
  },
];

function buildCard({ name, desc, map, swatches }) {
  const card = document.createElement("div");
  card.className = "logo-card";

  attachDownloadButton(card, map, name);

  const sprite = document.createElement("div");
  sprite.className = "sprite";
  sprite.appendChild(renderSVG(map, 10));
  card.appendChild(sprite);

  const label = document.createElement("div");
  label.className = "label";
  label.textContent = name;
  card.appendChild(label);

  if (swatches) {
    const sw = document.createElement("div");
    sw.className = "swatches";
    swatches.forEach((key) => {
      const s = document.createElement("span");
      s.style.background = palette[key];
      sw.appendChild(s);
    });
    card.appendChild(sw);
  }

  const d = document.createElement("div");
  d.className = "desc";
  d.textContent = desc;
  card.appendChild(d);
  return card;
}

const logoGrid = document.getElementById("logoGrid");
variants.forEach((v) => logoGrid.appendChild(buildCard(v)));

const propGrid = document.getElementById("propGrid");
props.forEach((p) => propGrid.appendChild(buildCard(p)));
