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

const arrow_scale = 0.3
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
const b=0.7071068
const eps = 1e-6; // to prevent z-fighting
const N = [
    new THREE.Vector3(0.5, 0, 0),
    new THREE.Vector3(-0.5, 0, 0),
    new THREE.Vector3(0.5, 1, 0),
    new THREE.Vector3(-0.5, 1, 0), // 3
    new THREE.Vector3(0.5, -1, 0),
    new THREE.Vector3(-0.5, -1, 0),
    new THREE.Vector3(0, 0.5, b), // 6
    new THREE.Vector3(0, 0.5, -b),
    new THREE.Vector3(0, -0.5, b),
    new THREE.Vector3(0, -0.5, -b)];

for (const node of N) {
    add_node(node, g)
}

// ----------------- edges
/*
add_edge(N[0], N[1], g);
add_edge(N[2], N[3], g);
add_edge(N[4], N[5], g);
add_edge(N[0], N[2], g);
add_edge(N[0], N[4], g);
add_edge(N[1], N[3], g);
add_edge(N[1], N[5], g);

add_edge(N[0], N[6], g);
add_edge(N[0], N[7], g);
add_edge(N[0], N[8], g);
add_edge(N[0], N[9], g);

add_edge(N[1], N[6], g);
add_edge(N[1], N[7], g);
add_edge(N[1], N[8], g);
add_edge(N[1], N[9], g);

add_edge(N[2], N[6], g);
add_edge(N[3], N[6], g);
add_edge(N[2], N[7], g);
add_edge(N[3], N[7], g);

add_edge(N[4], N[8], g);
add_edge(N[5], N[8], g);
add_edge(N[4], N[9], g);
add_edge(N[5], N[9], g);

add_edge(N[6], N[8], g);
add_edge(N[7], N[9], g);
*/

// ----------------- arrows

add_arrow_pair(N[0], N[1], g, -2.0 * b);
add_arrow_pair(N[2], N[3], g, 1.0);
add_arrow_pair(N[4], N[5], g, 1.0);
add_arrow_pair(N[0], N[2], g, 1.0);
add_arrow_pair(N[0], N[4], g, 1.0);
add_arrow_pair(N[1], N[3], g, 1.0);
add_arrow_pair(N[1], N[5], g, 1.0);

add_arrow_pair(N[0], N[6], g, 1.0);
add_arrow_pair(N[0], N[7], g, 1.0);
add_arrow_pair(N[0], N[8], g, 1.0);
add_arrow_pair(N[0], N[9], g, 1.0);

add_arrow_pair(N[1], N[6], g, 1.0);
add_arrow_pair(N[1], N[7], g, 1.0);
add_arrow_pair(N[1], N[8], g, 1.0);
add_arrow_pair(N[1], N[9], g, 1.0);

add_arrow_pair(N[2], N[6], g, -1.0);
add_arrow_pair(N[3], N[6], g, -1.0);
add_arrow_pair(N[2], N[7], g, -1.0);
add_arrow_pair(N[3], N[7], g, -1.0);

add_arrow_pair(N[4], N[8], g, -1.0);
add_arrow_pair(N[5], N[8], g, -1.0);
add_arrow_pair(N[4], N[9], g, -1.0);
add_arrow_pair(N[5], N[9], g, -1.0);

add_arrow_pair(N[6], N[8], g, -2.0 * b);
add_arrow_pair(N[7], N[9], g, -2.0 * b);



g.rotation.x = Math.PI / -2;
build = () => g;
