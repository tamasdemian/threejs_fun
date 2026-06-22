const g = new THREE.Group();

const xmin = -2.71828, xmax = 2.71828, ymin = -2.0, ymax = 2.0;
const xSeg = 60, ySeg = 60;

function realPow(x, y) {
  // avoid singular explosion near 0 for negative exponents
  const ax = Math.max(Math.abs(x), 1e-3);

  let z = Math.abs(Math.pow(ax, y));

  // clamp to keep geometry visible
  return THREE.MathUtils.clamp(z, -1, 8);
}

function zToColor(z, zMin, zMax) {
  const t = THREE.MathUtils.clamp((z - zMin) / (zMax - zMin || 1), 0, 1);
  const c = new THREE.Color();
  c.setHSL((1 - t) * 0.75, 1.0, 0.55);
  return c;
}

const grid = [];
const zs = [];

for (let iy = 0; iy <= ySeg; iy++) {
  const y = ymin + (ymax - ymin) * (iy / ySeg);
  const row = [];

  for (let ix = 0; ix <= xSeg; ix++) {
    const x = xmin + (xmax - xmin) * (ix / xSeg);
    const z = realPow(x, y);

    row.push(new THREE.Vector3(x, y, z));
    if (Number.isFinite(z)) zs.push(z);
  }

  grid.push(row);
}

const zMin = Math.min(...zs);
const zMax = 4.0;

const positions = [];
const colors = [];

for (let iy = 0; iy < ySeg; iy++) {
  for (let ix = 0; ix < xSeg; ix++) {

    const p00 = grid[iy][ix];
    const p10 = grid[iy][ix + 1];
    const p01 = grid[iy + 1][ix];
    const p11 = grid[iy + 1][ix + 1];

    const tris = [[p00, p10, p11], [p00, p11, p01]];

    tris.forEach(tri => {
      const zAvg = (tri[0].z + tri[1].z + tri[2].z) / 3;
      const col = zToColor(zAvg, zMin, zMax);

      tri.forEach(p => {
        positions.push(p.x, p.y, p.z);
        colors.push(col.r, col.g, col.b);
      });
    });
  }
}

const geom = new THREE.BufferGeometry();
geom.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
geom.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

const mesh = new THREE.Mesh(
  geom,
  new THREE.MeshPhongMaterial({
    vertexColors: true,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.95
  })
);

g.add(mesh);

g.add(
  new THREE.LineSegments(
    new THREE.EdgesGeometry(geom),
    new THREE.LineBasicMaterial({ color: 0x050608, transparent: true, opacity: 0.22 })
  )
);

function lineFromPoints(points, color) {
  return new THREE.Line(
    new THREE.BufferGeometry().setFromPoints(points),
    new THREE.LineBasicMaterial({ color })
  );
}




// --------------------------------------------------------------------auxiliary lines
const n = 300;
const eps = 1e-6; // to prevent z-fighting

const xmi = xmin - 0.6, xma = xmax + 0.6, ymi = ymin - 0.6, yma = ymax + 0.6;
const l1 = []; // -----------------------------------------------------line: (x=0,z=0)
for (let i = 0; i <= n; i++) {
  const y = ymi + (yma - ymi) * (i / n);
  l1.push(new THREE.Vector3(eps, y, 0));
}
g.add(lineFromPoints(l1, 0xffffff));

const l2 = []; // -----------------------------------------------------line: (x=1,z=1)
for (let i = 0; i <= n; i++) {
  const y = ymi + (yma - ymi) * (i / n);
  l2.push(new THREE.Vector3(1, y, 1));
}
g.add(lineFromPoints(l2, 0xffcc00));

const l3 = []; // -----------------------------------------------------line: (x=z,y=1)
for (let i = 0; i <= n; i++) {
  const x = xmi + (xma - xmi) * (i / n);
  l3.push(new THREE.Vector3(x, 1, x));
}
g.add(lineFromPoints(l3, 0x00ffcc));

const l4 = []; // -----------------------------------------------------line: (y=0,z=1)
for (let i = 0; i <= n; i++) {
  const x = xmi + (xma - xmi) * (i / n);
  l4.push(new THREE.Vector3(x, 0, 1));
}
g.add(lineFromPoints(l4, 0xff66cc));

const l5 = []; // -----------------------------------------------------line: (x=-1,z=1)
for (let i = 0; i <= n; i++) {
  const y = ymi + (yma - ymi) * (i / n);
  l5.push(new THREE.Vector3(-1, y, 1));
}
g.add(lineFromPoints(l5, 0xffcc00));

const l6 = []; // -----------------------------------------------------line: (x=-z,y=1)
for (let i = 0; i <= n; i++) {
  const x = xmi + (xma - xmi) * (i / n);
  l6.push(new THREE.Vector3(x, 1, -x));
}
g.add(lineFromPoints(l6, 0x00ffcc));

const l7 = []; // -----------------------------------------------------line: (x=0,y=0)
for (let i = 0; i <= n; i++) {
  const z = xmi + (xma - xmi) * (i / n);
  l7.push(new THREE.Vector3(0, 0, z));
}
g.add(lineFromPoints(l7, 0x00ffcc));


// -------------------------------------------------------------------intersections of lines
g.add(makeSphere(new THREE.Vector3(eps, 0, 0), 0xffffff, 0.06)); // origin
g.add(makeSphere(new THREE.Vector3(0, 0, 1), 0x0000ff, 0.06));
g.add(makeSphere(new THREE.Vector3(0, 1, 0), 0x0000ff, 0.06));
g.add(makeSphere(new THREE.Vector3(1, 0, 1), 0x00ff00, 0.06));
g.add(makeSphere(new THREE.Vector3(-1, 0, 1), 0x00ff00, 0.06));
g.add(makeSphere(new THREE.Vector3(1, 1, 1), 0xff0000, 0.06));
g.add(makeSphere(new THREE.Vector3(-1, 1, 1), 0xff0000, 0.06));

g.rotation.x = Math.PI / -2;
//g.rotation.z = 0.4;

build = () => g;
