const g = new THREE.Group();

// quantum numbers: outermost valence electron in ground state. 
// (Aufbau principle refined by Madelung rule + Hund's rule)
atoms = [
  {"Z": 1, "symbol": "H", "name": "Hydrogen", "ground_state": "1s1",
   "outer_electron": {"n": 1, "l": 0, "ml": 0, "ms": 0.5}},

  {"Z": 2, "symbol": "He", "name": "Helium", "ground_state": "1s2",
   "outer_electron": {"n": 1, "l": 0, "ml": 0, "ms": -0.5}},

  {"Z": 3, "symbol": "Li", "name": "Lithium", "ground_state": "1s2 2s1",
   "outer_electron": {"n": 2, "l": 0, "ml": 0, "ms": 0.5}},

  {"Z": 4, "symbol": "Be", "name": "Beryllium", "ground_state": "1s2 2s2",
   "outer_electron": {"n": 2, "l": 0, "ml": 0, "ms": -0.5}},

  {"Z": 5, "symbol": "B", "name": "Boron", "ground_state": "1s2 2s2 2p1",
   "outer_electron": {"n": 2, "l": 1, "ml": -1, "ms": 0.5}},

  {"Z": 6, "symbol": "C", "name": "Carbon", "ground_state": "1s2 2s2 2p2",
   "outer_electron": {"n": 2, "l": 1, "ml": 0, "ms": 0.5}},

  {"Z": 7, "symbol": "N", "name": "Nitrogen", "ground_state": "1s2 2s2 2p3",
   "outer_electron": {"n": 2, "l": 1, "ml": 1, "ms": 0.5}},

  {"Z": 8, "symbol": "O", "name": "Oxygen", "ground_state": "1s2 2s2 2p4",
   "outer_electron": {"n": 2, "l": 1, "ml": -1, "ms": -0.5}},

  {"Z": 9, "symbol": "F", "name": "Fluorine", "ground_state": "1s2 2s2 2p5",
   "outer_electron": {"n": 2, "l": 1, "ml": 0, "ms": -0.5}},

  {"Z": 10, "symbol": "Ne", "name": "Neon", "ground_state": "1s2 2s2 2p6",
   "outer_electron": {"n": 2, "l": 1, "ml": 1, "ms": -0.5}},

  {"Z": 11, "symbol": "Na", "name": "Sodium", "ground_state": "1s2 2s2 2p6 3s1",
   "outer_electron": {"n": 3, "l": 0, "ml": 0, "ms": 0.5}},

  {"Z": 12, "symbol": "Mg", "name": "Magnesium", "ground_state": "1s2 2s2 2p6 3s2",
   "outer_electron": {"n": 3, "l": 0, "ml": 0, "ms": -0.5}},

  {"Z": 13, "symbol": "Al", "name": "Aluminium", "ground_state": "1s2 2s2 2p6 3s2 3p1",
   "outer_electron": {"n": 3, "l": 1, "ml": -1, "ms": 0.5}},

  {"Z": 14, "symbol": "Si", "name": "Silicon", "ground_state": "1s2 2s2 2p6 3s2 3p2",
   "outer_electron": {"n": 3, "l": 1, "ml": 0, "ms": 0.5}},

  {"Z": 15, "symbol": "P", "name": "Phosphorus", "ground_state": "1s2 2s2 2p6 3s2 3p3",
   "outer_electron": {"n": 3, "l": 1, "ml": 1, "ms": 0.5}},

  {"Z": 16, "symbol": "S", "name": "Sulfur", "ground_state": "1s2 2s2 2p6 3s2 3p4",
   "outer_electron": {"n": 3, "l": 1, "ml": -1, "ms": -0.5}},

  {"Z": 17, "symbol": "Cl", "name": "Chlorine", "ground_state": "1s2 2s2 2p6 3s2 3p5",
   "outer_electron": {"n": 3, "l": 1, "ml": 0, "ms": -0.5}},

  {"Z": 18, "symbol": "Ar", "name": "Argon", "ground_state": "1s2 2s2 2p6 3s2 3p6",
   "outer_electron": {"n": 3, "l": 1, "ml": 1, "ms": -0.5}},

  {"Z": 19, "symbol": "K", "name": "Potassium", "ground_state": "1s2 2s2 2p6 3s2 3p6 4s1",
   "outer_electron": {"n": 4, "l": 0, "ml": 0, "ms": 0.5}},

  {"Z": 20, "symbol": "Ca", "name": "Calcium", "ground_state": "1s2 2s2 2p6 3s2 3p6 4s2",
   "outer_electron": {"n": 4, "l": 0, "ml": 0, "ms": -0.5}}
];

console.log("buzi");
console.log(atoms);

function calculateAtomicNumber(n, l, ml, ms) {
  const innerElectrons = (n * (n - 1) * (2 * n - 1)) / 3;
  const subshellElectrons = 2 * l * l;
  const fullMlLevelsBefore = ml + l;
  const electronsInFullMl = fullMlLevelsBefore * 2;
  const electronInCurrentMl = (ms > 0) ? 1 : 0;
  const electronsInCurrentSubshell = electronsInFullMl + electronInCurrentMl;
  const Z = innerElectrons + subshellElectrons + electronsInCurrentSubshell + 1;
  return Z;
};

//const Z_example = calculateAtomicNumber(3, 1, 0, 0.5);

function col(l) {
    if(l == 0) return 0xffccbb; // s-block
    if(l == 1) return 0xfdff8c; // p-block
    if(l == 2) return 0xd9eff5; // d-block
    if(l == 3) return 0xaaffad; // f-block
    if(l >= 4) return 0xff0000; // don't touch it!
};

/*
for (let n = 1; n < 9; n++) {
    for (let l = 0; l < n; l++) {
        for (let ml = -l; ml <= l; ml++) {
            for (let i = 0; i < 2; i++) {
                ms = i - 0.5;
                Z = calculateAtomicNumber(n,l,ml,ms);
                x = ms > 0 ? l + 0.5 : -1 * (l + 0.5);
                if(Z < 118){
                    g.add(makeSphere(new THREE.Vector3(x, n - 3, ml), col(l), 0.16));
                    if (Z < 21){                    
                        atom = atoms[Z - 1];
                        consistent = (atom['Z'] == Z) && (atom['outer_electron'] == {"n": n, "l": l, "ml": ml, "ms": ms});
                        if(not consistent){
                            console.log(atom, Z, {"n": n, "l": l, "ml": ml, "ms": ms})
                        }
                    }
                }
            }
        }
    }
}
*/

function getElectronData(Z) {
    if (Z < 1 || Z > 118) throw new Error("Z must be between 1 and 118");

    // 1. Generate Madelung Order (n + l rule)
    // Order: 1s, 2s, 2p, 3s, 3p, 4s, 3d, 4p, 5s, 4d, 5p, 6s, 4f, 5d, 6p, 7s, 5f, 6d, 7p
    const orbitals = [];
    for (let n = 1; n <= 7; n++) {
        for (let l = 0; l < n; l++) {
            // Limit l based on known blocks (s,p,d,f) for standard periodic table
            if (l > 3) continue; 
            orbitals.push({ n, l, sum: n + l });
        }
    }

    // Sort by (n+l), then by n
    orbitals.sort((a, b) => {
        if (a.sum !== b.sum) return a.sum - b.sum;
        return a.n - b.n;
    });

    // Map l to letter
    const lMap = { 0: 's', 1: 'p', 2: 'd', 3: 'f' };
    // Max electrons per subshell: 2(2l + 1)
    const getCapacity = (l) => 2 * (2 * l + 1);

    let electronsRemaining = Z;
    let lastElectronQNs = null;
    let configParts = [];

    // 2. Fill Orbitals
    for (let orb of orbitals) {
        if (electronsRemaining <= 0) break;

        const capacity = getCapacity(orb.l);
        const count = Math.min(electronsRemaining, capacity);
        
        // Add to configuration string (e.g., "2p6")
        configParts.push(`${orb.n}${lMap[orb.l]}${count}`);

        // If this orbital contains the very last electron, determine its QNs
        if (electronsRemaining <= capacity && lastElectronQNs === null) {
            lastElectronQNs = determineLastElectronQNs(orb.n, orb.l, count);
        }

        electronsRemaining -= count;
    }

    return {
        configuration: configParts.join(" "),
        lastElectron: lastElectronQNs
    };
}

function determineLastElectronQNs(n, l, count) {
    const mlValues = [];
    // Generate ml values from -l to +l
    for (let i = -l; i <= l; i++) mlValues.push(i);

    // Hund's Rule: Fill each ml with spin +1/2 first, then -1/2
    // Total slots = 2 * (2l + 1)
    const totalSlots = mlValues.length * 2;
    
    // We need the quantum numbers for the 'count'th electron in this subshell
    // Index is count - 1 (0-based)
    const index = count - 1;

    // First half are spin up (+0.5), second half are spin down (-0.5)
    const isSpinUp = index < mlValues.length;
    const ms = isSpinUp ? 0.5 : -0.5;
    
    // Determine ml
    // If spin up: index maps directly to mlValues
    // If spin down: index maps to mlValues after skipping the first half
    const mlIndex = isSpinUp ? index : index - mlValues.length;
    const ml = mlValues[mlIndex];

    return {
        n: n,
        l: l,
        ml: ml,
        ms: ms,
        orbitalLabel: `${n}${{0:'s',1:'p',2:'d',3:'f'}[l]}`
    };
}


/*
const Z = 15; // Phosphorus
const result = getElectronData(Z);
console.log(`Element Z=${Z}`);
console.log(`Configuration: ${result.configuration}`);
console.log(`Last Electron QNs: n=${result.lastElectron.n}, l=${result.lastElectron.l}, ml=${result.lastElectron.ml}, ms=${result.lastElectron.ms}`);
*/

for (let Z = 1; Z < 119; Z++) {
    const {n, l, ml, ms, orbitalLabel} = getElectronData(Z).lastElectron;
    x = ms > 0 ? l + 0.5 : -1 * (l + 0.5);
    g.add(makeSphere(new THREE.Vector3(x, n - 3, ml), col(l), 0.16));
} 



//g.rotation.x = Math.PI / -2;
g.rotation.z = Math.PI;

build = () => g;
