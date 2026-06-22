const g = new THREE.Group();
//const mesh = new THREE.Mesh(new THREE.OctahedronGeometry(2.2, 0), new THREE.MeshPhongMaterial({ color: 0x63d3ff, shininess: 90, transparent: true, opacity: 0.95 }));

function add_node(v, g) {
    g.add(makeSphere(v, 0xff0000, 0.06));
}

function lineFromPoints(points, color) {
  return new THREE.Line(
    new THREE.BufferGeometry().setFromPoints(points),
    new THREE.LineBasicMaterial({ color })
  );
}

const n = 300;
function add_edge(v1, v2, g) {
    const l = []
    for (let i = 0; i <= n; i++) {
      // v = v2 - (v2 - v1) * (i / n);
      v = new THREE.Vector3()
        .copy(v2)
        .sub(v1)
        .multiplyScalar(-1*i/n)
        .add(v2);
      l.push(v);
    }
    g.add(lineFromPoints(l, 0xffffff));
}

const arrow_scale = 0.4
function add_arrow(v1, v2, g, s = 1.0) {
    if (s >= 0) { // push
        const direction = new THREE.Vector3().copy(v2).sub(v1);    
        const arrow = new THREE.ArrowHelper(direction, v1, s * arrow_scale, 0xffff00, 0.2, 0.1);
        g.add(arrow)
    } else { // pull
        const direction = new THREE.Vector3().copy(v1).sub(v2);    
        // presumed: |v1-v2|=1
        const from = new THREE.Vector3()
        .copy(v2)
        .sub(v1)
        .multiplyScalar(-s * arrow_scale)
        .add(v1);
        const arrow = new THREE.ArrowHelper(direction, from, -s * arrow_scale, 0xff00ff, 0.2, 0.1);
        g.add(arrow)
    }
}

function add_arrow_pair(v1, v2, g, s = 1.0) {
    add_arrow(v1, v2, g, s)
    add_arrow(v2, v1, g, s)
}


// ----------------- nodes
const a=0.8660254
const eps = 1e-6; // to prevent z-fighting
const N = [
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(0, 1, 0),
    new THREE.Vector3(a, 0.5, 0),
    new THREE.Vector3(a, -0.5, 0),    
    new THREE.Vector3(0, -1, 0),
    new THREE.Vector3(-a, -0.5, 0),   
    new THREE.Vector3(-a, 0.5, 0)]

for (const node of N) {
    add_node(node, g)
}

// ----------------- edges

/* for (let i = 1; i <= 6; i++) {
    add_edge(N[0], N[i], g);
    add_edge(N[i], N[(i % 6) + 1], g);
}*/

// ----------------- arrows

//const arrow = new THREE.ArrowHelper(direction=N[2], N[1], 0.4, 0xffff00, 0.2, 0.1);
//g.add(arrow)
for (let i = 1; i <= 6; i++) {
    add_arrow_pair(N[0], N[i], g, 1.0);
    add_arrow_pair(N[i], N[(i % 6) + 1], g, -1.0);
}

build = () => g;
