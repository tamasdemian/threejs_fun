const g = new THREE.Group();
const mesh = new THREE.Mesh(new THREE.IcosahedronGeometry(2.2, 0), new THREE.MeshPhongMaterial({ color: 0x63d3ff, shininess: 90, transparent: true, opacity: 0.95 }));
g.add(mesh);
g.add(new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(2.2, 0)), new THREE.LineBasicMaterial({ color: 0xe9fbff })));
build = () => g;
