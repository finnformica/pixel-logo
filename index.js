const canvasGrid = document.getElementById("canvasGrid");
const svgGrid = document.getElementById("svgGrid");

characters.forEach(({ name, map }) => {
  const c1 = document.createElement("div");
  c1.className = "cell";
  c1.appendChild(renderCanvas(map));
  attachDownloadButton(c1, map, name);
  canvasGrid.appendChild(c1);

  const c2 = document.createElement("div");
  c2.className = "cell";
  c2.appendChild(renderSVG(map));
  attachDownloadButton(c2, map, name);
  svgGrid.appendChild(c2);
});
