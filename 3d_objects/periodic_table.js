const g = new THREE.Group();

/*
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

*/

function col(l) {
    if(l == 0) return 0xffccbb; // s-block
    if(l == 1) return 0xfdff8c; // p-block
    if(l == 2) return 0xd9eff5; // d-block
    if(l == 3) return 0xaaffad; // f-block
    if(l >= 4) return 0xff0000; // g-block hypothethic
};

// based on Madelung rule and Hund's rule
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


fetch("./data/atoms.json")
  .then(res => res.json())
  .then(data => {
        for (let Z = 1; Z <= 118; Z++) {
            const {n, l, ml, ms, orbitalLabel} = getElectronData(Z).lastElectron;
            x = ms > 0 ? l + 0.5 : -1 * (l + 0.5);
            z = ms > 0 ? -ml : ml
            d = data[Z-1]
            g.add(makeSphere(new THREE.Vector3(x, n - 3, z), col(l), 0.16, d.symbol + " " + (Z)));
        } 
  });


//g.rotation.x = Math.PI / -2;
g.rotation.z = Math.PI;

build = () => g;
