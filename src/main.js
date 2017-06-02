// @flow
import 'three/examples/js/geometries/ConvexGeometry.js'

// const PLANE_SEGMENTS_X = 128;
// const PLANE_SEGMENTS_Z = 128;

const RADIUS_SEGMENTS = 5

let meshesTrees
let meshesLeafs

function createTrunkMesh(prevMesh, params) {
  // Create basic trunk
  const geometry = new THREE.CylinderGeometry(1, 1, 1, RADIUS_SEGMENTS)
  // Move Y origin to base
  geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0.5, 0))

  // Adding noise to vertex
  for (const vertice of geometry.vertices) {
    vertice.x -= vertice.x / 1.5 * vertice.y * (0.6 + 0.4 * Math.random())
    vertice.z -= vertice.z / 1.5 * vertice.y * (0.6 + 0.4 * Math.random())
  }

  // Delete bottom face
  geometry.faces.splice(-RADIUS_SEGMENTS)

  const mesh = new THREE.Mesh(geometry)

  // Scaling
  mesh.scale.x = params.width
  mesh.scale.y = params.height
  mesh.scale.z = params.width

  if (prevMesh) {
    // Positioning
    mesh.position.x =
      prevMesh.position.x - prevMesh.scale.y * Math.sin(prevMesh.rotation.z)
    mesh.position.y =
      prevMesh.position.y +
      prevMesh.scale.y *
        (Math.cos(prevMesh.rotation.x) * Math.cos(prevMesh.rotation.z))
    mesh.position.z =
      prevMesh.position.z +
      prevMesh.scale.y *
        (Math.sin(prevMesh.rotation.x) * Math.cos(prevMesh.rotation.z))

    // Rotation
    mesh.rotation.x = params.angle
    mesh.rotation.y = params.angle
    mesh.rotation.z = params.angle
  }

  return mesh
}

function createBranchMesh(prevMesh, params) {
  // Create basic trunk
  const geometry = new THREE.CylinderGeometry(1, 1, 1, RADIUS_SEGMENTS)
  // Move Y origin to base
  geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0.5, 0))

  // Adding noise to vertex
  for (const vertice of geometry.vertices) {
    vertice.x -= vertice.x / 1.5 * vertice.y * (0.6 + 0.4 * Math.random())
    vertice.z -= vertice.z / 1.5 * vertice.y * (0.6 + 0.4 * Math.random())
  }

  // Delete bottom face
  geometry.faces.splice(-RADIUS_SEGMENTS)

  const mesh = new THREE.Mesh(geometry)

  // Scaling
  mesh.scale.x = params.width
  mesh.scale.y = params.height
  mesh.scale.z = params.width

  // Positioning
  mesh.position.x =
    prevMesh.position.x - prevMesh.scale.y * Math.sin(prevMesh.rotation.z)
  mesh.position.y =
    prevMesh.position.y +
    prevMesh.scale.y *
      (Math.cos(prevMesh.rotation.x) * Math.cos(prevMesh.rotation.z))
  mesh.position.z =
    prevMesh.position.z +
    prevMesh.scale.y *
      (Math.sin(prevMesh.rotation.x) * Math.cos(prevMesh.rotation.z))

  // Rotation
  mesh.rotation.x = params.angleX + prevMesh.rotation.x
  mesh.rotation.z = params.angleZ + prevMesh.rotation.z

  return mesh
}

function createLeaves(trunkStage, prevMesh = null, options, params) {
  let pointsGeometry

  if (params.type === 'cone') {
    pointsGeometry = new THREE.ConeGeometry(1, 1, 5)
  } else {
    pointsGeometry = new THREE.SphereGeometry(1, 5, 4)
  }

  // Moving vertex
  // const points = []
  for (const vertice of pointsGeometry.vertices) {
    // points.push(new THREE.Vector3(
    //   vertice.x * (0.8 + 0.3 * Math.random()),
    //   vertice.y * (0.8 + 0.3 * Math.random()),
    //   vertice.z * (0.8 + 0.3 * Math.random())
    // ))
    vertice.x = vertice.x * (0.8 + 0.3 * Math.random())
    vertice.y = vertice.y * (0.8 + 0.3 * Math.random())
    vertice.z = vertice.z * (0.8 + 0.3 * Math.random())
  }

  const geometry = new THREE.ConvexGeometry(pointsGeometry.vertices)
  geometry.uvsNeedUpdate = true

  const mesh = new THREE.Mesh(geometry)

  // Positioning
  if (prevMesh) {
    mesh.position.x =
      prevMesh.position.x - prevMesh.scale.y * Math.sin(prevMesh.rotation.z)
    mesh.position.y =
      prevMesh.position.y +
      prevMesh.scale.y *
        (Math.cos(prevMesh.rotation.x) * Math.cos(prevMesh.rotation.z))
    mesh.position.z =
      prevMesh.position.z +
      prevMesh.scale.y *
        (Math.sin(prevMesh.rotation.x) * Math.cos(prevMesh.rotation.z))
  }

  // Scaling
  mesh.scale.x = params.width
  mesh.scale.y = params.height
  mesh.scale.z = params.width

  // Rotation
  // if (params.angle) {
  //   mesh.rotation.x = params.angle.x || 0;
  //   mesh.rotation.y = params.angle.y || 0;
  //   mesh.rotation.z = params.angle.z || 0;
  // }

  return mesh
}

function createBranch(trunkStage, branchStage, prevMesh, options) {
  let branchEnded = true

  const branchMesh = createBranchMesh(prevMesh, {
    width: options.branches.getWidth(trunkStage, branchStage),
    height: options.branches.getHeight(branchStage),
    angleX: options.branches.getAngle(),
    angleZ: options.branches.getAngle(),
  })
  meshesTrees.push(branchMesh)

  const nbBranches = options.branches.getNumberPerBranchStage(
    trunkStage,
    branchStage
  )
  for (let j = 0; j < nbBranches; j++) {
    if (branchStage < options.branches.getStages(trunkStage)) {
      createBranch(trunkStage, branchStage + 1, branchMesh, options)
      branchEnded = false
    }
  }

  if (branchEnded) {
    meshesLeafs.push(
      createLeaves(trunkStage, branchMesh, options, {
        type: options.leaves.type,
        width: options.leaves.getWidth(trunkStage),
        height: options.leaves.getHeight(trunkStage),
        angle: options.leaves.getAngle(),
      })
    )
  }
}

function createTrunk(currentStage, maxStage, prevMesh = null, options) {
  const trunkMesh = createTrunkMesh(prevMesh, {
    width: options.trunk.getWidth(currentStage),
    height: options.trunk.getHeight(currentStage),
    angle: options.trunk.getAngle(),
  })
  meshesTrees.push(trunkMesh)

  const nbBranches = options.branches.getNumberPerTrunkStage(currentStage)
  if (nbBranches > 0) {
    for (let j = 0; j < nbBranches; j++) {
      createBranch(currentStage, 1, trunkMesh, options)
    }
  } else {
    meshesLeafs.push(
      createLeaves(currentStage, trunkMesh, options, {
        type: options.leaves.type,
        width: options.leaves.getWidth(currentStage),
        height: options.leaves.getHeight(currentStage),
        angle: options.leaves.getAngle(),
      })
    )
  }

  if (currentStage < maxStage) {
    createTrunk(currentStage + 1, maxStage, trunkMesh, options)
  }
}

function createTree(i = 0, prevMesh = null, options) {
  const maxTrunkStage = options.trunk.getStages()

  createTrunk(1, maxTrunkStage, null, options)
}

function addMeshes(scene, meshes, x, y, z, scale) {
  meshes.position.set(x, y, z)
  meshes.scale.set(scale, scale, scale)

  // Shadow
  meshes.receiveShadow = true
  meshes.castShadow = true

  return meshes
}

export function forest(
  scene: Object,
  num: number,
  options: Object,
  getYCoordinate: Function,
  plane: Object
) {
  const treeParam = Object.assign({}, options)
  console.log(options)
  const startTime = new Date()
  const caster = new THREE.Raycaster()
  let meshes

  // plane.geometry.verticesNeedUpdate = true;
  // plane.geometry.computeFaceNormals();

  for (let i = 0; i < num; i++) {
    meshesTrees = []
    meshesLeafs = []
    const singleTreesGeometry = new THREE.Geometry()
    const singleLeavesGeometry = new THREE.Geometry()
    createTree(0, null, treeParam)

    for (const mesh of meshesTrees) {
      mesh.updateMatrix()
      singleTreesGeometry.merge(mesh.geometry, mesh.matrix)
    }

    for (const mesh of meshesLeafs) {
      mesh.updateMatrix()
      singleLeavesGeometry.merge(mesh.geometry, mesh.matrix)
    }

    // Positioning
    const x = (Math.random() * 2 - 1) * 3000
    const z = (Math.random() * 2 - 1) * 3000
    // const xOnPlane = Math.round((x + 7500) / 15000 * PLANE_SEGMENTS_X);
    // const zOnPlane = Math.round((z + 7500) / 15000 * PLANE_SEGMENTS_Z);
    let y = 1000 // getYCoordinate(xOnPlane, zOnPlane) - 0.2 +20;
    const scale = Math.random() * 0.4 + 0.7

    // Debug
    // var lineMaterial = new THREE.LineBasicMaterial({ color: 0x0000ff });

    // var geometry2 = new THREE.Geometry();
    // geometry2.vertices.push(
    //   new THREE.Vector3(x, y, z),
    //   new THREE.Vector3(x, y - 200, z)
    // );

    // var line = new THREE.Line(geometry2, lineMaterial);
    // scene.add(line);

    // Raycaster
    const meshTrees = new THREE.Mesh(
      singleTreesGeometry,
      treeParam.trunk.getMaterial()
    )
    caster.set(
      new THREE.Vector3(x, y, z),
      new THREE.Vector3(0, -1, 0).normalize()
    )
    const intersects = caster.intersectObject(plane)

    if (intersects.length) {
      y -= intersects[0].distance
    }

    // let dot
    // let dotGeometry
    // const dotMaterial = new THREE.PointsMaterial( { size: 5, color: 0x880000, sizeAttenuation: false } );
    // intersects.forEach(function(intersect) {
    //   console.log(intersect)
    //   dotGeometry = new THREE.Geometry();
    //   dotGeometry.vertices.push(intersect.point);
    //   dot = new THREE.Points( dotGeometry, dotMaterial );
    //   scene.add( dot );
    // })

    meshes = addMeshes(scene, meshTrees, x, y, z, scale)
    scene.add(meshes)

    const meshLeafs = new THREE.Mesh(
      singleLeavesGeometry,
      treeParam.leaves.getMaterial()
    )
    meshes = addMeshes(scene, meshLeafs, x, y, z, scale)
    scene.add(meshes)
  }
  console.log('Generated in', (new Date() - startTime) / 1000, 's')
}
