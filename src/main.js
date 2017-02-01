import * as THREE from 'three';

const PLANE_SEGMENTS_X = 128;
const PLANE_SEGMENTS_Z = 128;

const RADIUS_SEGMENTS = 5;

function getRandomColorComponent(value, interval) {
  return value + Math.round((Math.random() - 0.5) * interval);
}

const DEFAULT_TREE_PARAMS = {
  trunk: {
    getMaterial() {
      const color = `rgb(
        ${getRandomColorComponent(99, 15)},
        ${getRandomColorComponent(77, 15)},
        ${getRandomColorComponent(54, 15)})`;
      return new THREE.MeshPhongMaterial({
        color,
        shading: THREE.FlatShading,
      });
    },
    getStages: () => 4,
    getAngle: () => 0.1 * (Math.random() * 2 - 1),
    getWidth(trunkStage) {
      return Math.pow(0.66, trunkStage - 1) * 10;
    },
    getHeight(trunkStage) {
      return (Math.pow(0.8, trunkStage - 1) + (Math.random() * 0.2)) * 35;
    },
  },
  branches: {
    getNumberPerTrunkStage: (trunkStage) => Math.round(3 + Math.random()),
    getNumberPerBranchStage: (trunkStage, branchStage) => Math.round(2.2 + Math.random()),
    getStages: (trunkStage) => Math.min(3 - trunkStage, trunkStage) + 1,
    getAngle: () => Math.PI / 4 * (Math.random() * 2 - 1),
    getWidth(trunkStage, branchStage) {
      return Math.pow(0.66, trunkStage + branchStage) * 10;
    },
    getHeight(branchStage) {
      return (Math.pow(0.8, branchStage) + (Math.random() * 0.2)) * 35;
    },
  },
  leaves: {
    getMaterial() {
      const color = `rgb(
        ${getRandomColorComponent(117, 25)},
        ${getRandomColorComponent(145, 25)},
        ${getRandomColorComponent(47, 25)})`;
      return new THREE.MeshPhongMaterial({
        color,
        shading: THREE.FlatShading,
      });
    },
    getAngle: () => (Math.random() * Math.PI),
    getWidth: (trunkStage) => 10 + (4 - trunkStage) * (3 + 0.5 * Math.random()),
    getHeight: (trunkStage) => 6 + (4 - trunkStage) * (2 + 0.5 * Math.random()),
  },
};

let meshesTrees;
let meshesLeafs;

function createTrunkMesh(prevMesh, params) {
  // Create basic trunk
  const geometry = new THREE.CylinderGeometry(1, 1, 1, RADIUS_SEGMENTS);
  // Move Y origin to base
  geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0.5, 0));

  // Adding noise to vertex
  for (const vertice of geometry.vertices) {
    vertice.x -= (vertice.x / 1.5) * vertice.y * (0.6 + 0.4 * Math.random());
    vertice.z -= (vertice.z / 1.5) * vertice.y * (0.6 + 0.4 * Math.random());
  }

  // Delete bottom face
  geometry.faces.splice(- RADIUS_SEGMENTS);

  const mesh = new THREE.Mesh(geometry);

  // Scaling
  mesh.scale.x = params.width;
  mesh.scale.y = params.height;
  mesh.scale.z = params.width;

  if (prevMesh) {
    // Positioning
    mesh.position.x = prevMesh.position.x - prevMesh.scale.y * Math.sin(prevMesh.rotation.z);
    mesh.position.y = prevMesh.position.y + prevMesh.scale.y * (Math.cos(prevMesh.rotation.x) * Math.cos(prevMesh.rotation.z));
    mesh.position.z = prevMesh.position.z + prevMesh.scale.y * (Math.sin(prevMesh.rotation.x) * Math.cos(prevMesh.rotation.z));

    // Rotation
    mesh.rotation.x = params.angle;
    mesh.rotation.y = params.angle;
    mesh.rotation.z = params.angle;
  }

  return mesh;
}

function createBranchMesh(prevMesh, params) {
  // Create basic trunk
  const geometry = new THREE.CylinderGeometry(1, 1, 1, RADIUS_SEGMENTS);
  // Move Y origin to base
  geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0.5, 0));

  // Adding noise to vertex
  for (const vertice of geometry.vertices) {
    vertice.x -= (vertice.x / 1.5) * vertice.y * (0.6 + 0.4 * Math.random());
    vertice.z -= (vertice.z / 1.5) * vertice.y * (0.6 + 0.4 * Math.random());
  }

  // Delete bottom face
  geometry.faces.splice(- RADIUS_SEGMENTS);

  const mesh = new THREE.Mesh(geometry);

  // Scaling
  mesh.scale.x = params.width;
  mesh.scale.y = params.height;
  mesh.scale.z = params.width;

  // Positioning
  mesh.position.x = prevMesh.position.x - prevMesh.scale.y * Math.sin(prevMesh.rotation.z);
  mesh.position.y = prevMesh.position.y + prevMesh.scale.y * (Math.cos(prevMesh.rotation.x) * Math.cos(prevMesh.rotation.z));
  mesh.position.z = prevMesh.position.z + prevMesh.scale.y * (Math.sin(prevMesh.rotation.x) * Math.cos(prevMesh.rotation.z));

  // Rotation
  mesh.rotation.x = params.angleX + prevMesh.rotation.x;
  mesh.rotation.z = params.angleZ + prevMesh.rotation.z;

  return mesh;
}

function createLeaves(trunkStage, prevMesh = null, options, params) {
  let geometry;

  if (params.type === 'cone') {
    geometry = new THREE.ConeGeometry(1, 1, 5);
  } else {
    geometry = new THREE.SphereGeometry(1, 5, 4);
  }

  const mesh = new THREE.Mesh(geometry);

  // Moving vertex
  // for (const vertice of geometry.vertices) {
  //   vertice.x = vertice.x * (0.8 + 0.3 * Math.random());
  //   vertice.y = vertice.y * (0.8 + 0.3 * Math.random());
  //   vertice.z = vertice.z * (0.8 + 0.3 * Math.random());
  // }

  // Positioning
  if (prevMesh) {
    mesh.position.x = prevMesh.position.x - prevMesh.scale.y * Math.sin(prevMesh.rotation.z);
    mesh.position.y = prevMesh.position.y + prevMesh.scale.y * (Math.cos(prevMesh.rotation.x) * Math.cos(prevMesh.rotation.z));
    mesh.position.z = prevMesh.position.z + prevMesh.scale.y * (Math.sin(prevMesh.rotation.x) * Math.cos(prevMesh.rotation.z));
  }

  // Scaling
  mesh.scale.x = params.width;
  mesh.scale.y = params.height;
  mesh.scale.z = params.width;

  // Rotation
  mesh.rotation.x = params.angle;
  mesh.rotation.z = params.angle;

  return mesh;
}

function createBranch(trunkStage, branchStage, prevMesh, options) {
  let branchEnded = true;

  const branchMesh = createBranchMesh(prevMesh, {
    width: options.branches.getWidth(trunkStage, branchStage),
    height: options.branches.getHeight(branchStage),
    angleX: options.branches.getAngle(),
    angleZ: options.branches.getAngle(),
  });
  meshesTrees.push(branchMesh);

  const nbBranches = options.branches.getNumberPerBranchStage(trunkStage, branchStage);
  for (let j = 0; j < nbBranches; j++) {
    if (branchStage < options.branches.getStages(trunkStage)) {
      createBranch(trunkStage, branchStage + 1, branchMesh, options);
      branchEnded = false;
    }
  }

  if (branchEnded) {
    meshesLeafs.push(createLeaves(trunkStage, branchMesh, options, {
      type: options.leaves.type,
      width: options.leaves.getWidth(trunkStage),
      height: options.leaves.getHeight(trunkStage),
      angle: options.leaves.getAngle(),
    }));
  }
}

function createTrunk(currentStage, maxStage, prevMesh = null, options) {
  const trunkMesh = createTrunkMesh(prevMesh, {
    width: options.trunk.getWidth(currentStage),
    height: options.trunk.getHeight(currentStage),
    angle: options.trunk.getAngle(),
  });
  meshesTrees.push(trunkMesh);

  const nbBranches = options.branches.getNumberPerTrunkStage(currentStage);
  if (nbBranches > 0) {
    for (let j = 0; j < nbBranches; j++) {
      createBranch(currentStage, 1, trunkMesh, options);
    }
  } else {
    meshesLeafs.push(createLeaves(currentStage, trunkMesh, options, {
      type: options.leaves.type,
      width: options.leaves.getWidth(currentStage),
      height: options.leaves.getHeight(currentStage),
      angle: options.leaves.getAngle(),
    }));
  }

  if (currentStage < maxStage) {
    createTrunk(currentStage + 1, maxStage, trunkMesh, options);
  }
}

function createTree(i = 0, prevMesh = null, options) {
  const maxTrunkStage = options.trunk.getStages();

  createTrunk(1, maxTrunkStage, null, options);
}

function addMeshes(scene, meshes, x, y, z, scale) {
  meshes.position.set(x, y, z);
  meshes.scale.set(scale, scale, scale);

  // Shadow
  meshes.receiveShadow = true;
  meshes.castShadow = true;

  scene.add(meshes);
}

export function forest(scene, num, options, getYCoordinate) {
  const treeParam = Object.assign({}, DEFAULT_TREE_PARAMS, options);
  console.log(options)
  const startTime = new Date();
  for (let i = 0; i < num; i++) {
    meshesTrees = [];
    meshesLeafs = [];
    const singleTreesGeometry = new THREE.Geometry();
    const singleLeavesGeometry = new THREE.Geometry();
    createTree(0, null, treeParam);

    for (const mesh of meshesTrees) {
      mesh.updateMatrix();
      singleTreesGeometry.merge(mesh.geometry, mesh.matrix);
    }

    for (const mesh of meshesLeafs) {
      mesh.updateMatrix();
      singleLeavesGeometry.merge(mesh.geometry, mesh.matrix);
    }

    // Positioning
    const x = (Math.random() * 2 - 1) * 1500;
    const z = (Math.random() * 2 - 1) * 1500;
    const xOnPlane = Math.round((x + 7500) / 15000 * PLANE_SEGMENTS_X);
    const zOnPlane = Math.round((z + 7500) / 15000 * PLANE_SEGMENTS_Z);
    const y = getYCoordinate(xOnPlane, zOnPlane) - 0.2;
    const scale = Math.random() * 0.4 + 0.7;

    const meshTrees = new THREE.Mesh(singleTreesGeometry, treeParam.trunk.getMaterial());
    addMeshes(scene, meshTrees, x, y, z, scale);

    const meshLeafs = new THREE.Mesh(singleLeavesGeometry, treeParam.leaves.getMaterial());
    addMeshes(scene, meshLeafs, x, y, z, scale);
  }
  console.log('Generated in', (new Date() - startTime) / 1000, 's');
}
