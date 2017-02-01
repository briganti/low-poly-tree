var scene, camera, renderer;
var geometry, material, mesh, meshesLeafs, meshesTrees;
var planeY = [];

var defaultTreeOptions = {
  leafStage : 4,
  matTrunk  : MATERIAL_TRUNK_1, 
  matLeaf   : MATERIAL_LEAFS_1,
  nbStages  : 4,
  getBranchAngle : function() {
    return Math.PI - 2
  },
  getNumberBranches : function(i) {
    return Math.round(Math.random() + 0.49) + 1
  },
  getBranchWidth : function (i, prevWidth) {
    return prevWidth ? prevWidth / 1.5 * 0.6 : 10
  },
  getBranchHeight: function(i, prevHeight) {
    return prevHeight ? prevHeight * (0.2 * Math.random() + 0.7) : 35
  },
  getLeafAngle : function() {
    return 0
  },
  getLeafWidth: function(i, prevWidth) {
    return 15 + (10 * Math.random())
  },
  getLeafHeight: function(i, prevHeight) {
    return 5 + (10 * Math.random())
  },
}

var PLANE_SEGMENTS_X = 128
var PLANE_SEGMENTS_Z = 128

var MATERIAL_LEAFS_1 = new THREE.MeshPhongMaterial({ color: 0x4a721e, shading: THREE.FlatShading });
var MATERIAL_LEAFS_2 = new THREE.MeshPhongMaterial({ color: 0x75912f, shading: THREE.FlatShading });
var MATERIAL_LEAFS_3 = new THREE.MeshPhongMaterial({ color: 0x30512d, shading: THREE.FlatShading });
var MATERIAL_LEAFS_4 = new THREE.MeshPhongMaterial({ color: 0x62844b, shading: THREE.FlatShading });
var MATERIAL_PLANE = new THREE.MeshPhongMaterial({ color: 0x3c4c12, shading: THREE.FlatShading, side: THREE.DoubleSide });
var MATERIAL_TRUNK_1 = new THREE.MeshPhongMaterial({ color: 0x5b3716, shading: THREE.FlatShading });
var MATERIAL_TRUNK_2 = new THREE.MeshPhongMaterial({ color: 0x634d36, shading: THREE.FlatShading });
var MATERIAL_TRUNK_3 = new THREE.MeshPhongMaterial({ color: 0x332416, shading: THREE.FlatShading });
var MATERIAL_TRUNK_4 = new THREE.MeshPhongMaterial({ color: 0x726f67, shading: THREE.FlatShading });
var MATERIAL_ROCK = new THREE.MeshPhongMaterial({ color: 0x666666, shading: THREE.FlatShading });

var RADIUS_SEGMENTS = 5

init();

function init() {
    scene = new THREE.Scene();
    // scene.background = new THREE.Color( 0x84aff4 );
    scene.fog = new THREE.Fog( 0xffffff, 1, 5000 );
    scene.fog.color.setHSL( 0.6, 0, 1 );

    var hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.6 );
    hemiLight.color.setHSL( 0.6, 1, 0.6 );
    hemiLight.groundColor.setHSL( 0.095, 1, 0.75 );
    hemiLight.position.set( 0, 500, 0 );
    scene.add( hemiLight );

    var vertexShader = document.getElementById( 'vertexShader' ).textContent;
    var fragmentShader = document.getElementById( 'fragmentShader' ).textContent;
    var uniforms = {
      topColor:    { value: new THREE.Color( 0x0077ff ) },
      bottomColor: { value: new THREE.Color( 0xffffff ) },
      offset:      { value: 33 },
      exponent:    { value: 0.6 }
    };
    uniforms.topColor.value.copy( hemiLight.color );

    scene.fog.color.copy( uniforms.bottomColor.value );

    var skyGeo = new THREE.SphereGeometry( 4000, 32, 15 );
    var skyMat = new THREE.ShaderMaterial( { vertexShader: vertexShader, fragmentShader: fragmentShader, uniforms: uniforms, side: THREE.BackSide } );

    var sky = new THREE.Mesh( skyGeo, skyMat );
    scene.add( sky )


    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
    camera.position.z = 500;
    camera.position.y = 380;

    geometry = new THREE.PlaneGeometry( 1, 1, PLANE_SEGMENTS_X, PLANE_SEGMENTS_Z);
    geometry.applyMatrix(new THREE.Matrix4().makeTranslation( 0, 0.5, 0 ));
    var index = 0;
    for(var z = 0; z <= PLANE_SEGMENTS_Z; z++) {
        planeY[z] = []
        for(var x = 0; x <= PLANE_SEGMENTS_X; x++) {
            planeY[z][x] = Math.cos(z / PLANE_SEGMENTS_Z * 16) * Math.cos(x / PLANE_SEGMENTS_X * 8) * 120 * (1 - z /PLANE_SEGMENTS_Z) //* (1 + x/96) ;
            geometry.vertices[index].z = planeY[z][x];
            index++;
        }
    }
    var plane = new THREE.Mesh( geometry, MATERIAL_PLANE );
    plane.scale.x = 4000
    plane.scale.y = 1600
    plane.rotation.x = -Math.PI / 2
    plane.receiveShadow = true;

    scene.add( plane );

    var optPine = {
      leafStage : 4,
      matTrunk  : MATERIAL_TRUNK_1, 
      matLeaf   : MATERIAL_LEAFS_1,
      nbStages  : 4,
    }
    createForest(200, optPine)

    optOak = {
      leafStage : 3,
      matTrunk  : MATERIAL_TRUNK_2, 
      matLeaf   : MATERIAL_LEAFS_2,
      nbStages  : 4,
      getBranchAngle : function() {
        return Math.PI - 2
      },
      getNumberBranches : function(i) {
        return Math.round(Math.random() + 0.1) + 2
      },
      getBranchWidth : function (i, prevWidth) {
        return prevWidth ? prevWidth / 1.5 * 0.6 : 10
      },
      getBranchHeight: function(i, prevHeight) {
        return prevHeight ? prevHeight * (0.2 * Math.random() + 0.7) : 30
      },
      getLeafAngle : function() {
        return 0
      },
      getLeafWidth: function(i, prevWidth) {
        return 15 + (10 * Math.random())
      },
      getLeafHeight: function(i, prevHeight) {
        return 5 + (10 * Math.random())
      },
    }
    createForest(200, optOak)

    optDark = {
      leafStage : 1,
      leafType  : 'cone',
      matTrunk  : MATERIAL_TRUNK_3, 
      matLeaf   : MATERIAL_LEAFS_3,
      nbStages  : 2,
      getBranchAngle : function() {
        return 0
      },
      getNumberBranches : function() {
        return 1
      },
      getBranchWidth : function (i, prevWidth) {
        return prevWidth ? prevWidth / 1.5 * 0.6 : 10
      },
      getBranchHeight: function(i, prevHeight) {
        return prevHeight ? prevHeight * (0.2 * Math.random() + 0.7) : 60
      },
      getLeafAngle : function() {
        return Math.PI - 3.1
      },
      getLeafWidth: function(i, prevWidth) {
        return prevWidth * 2.5 * (1 + 0.2 * Math.random())
      },
      getLeafHeight: function(i, prevHeight) {
        return prevHeight + 4 + 6 * Math.random()
      },
    }
    createForest(120, optDark)

    optBouleau = {
      leafStage : 1,
      matTrunk  : MATERIAL_TRUNK_4, 
      matLeaf   : MATERIAL_LEAFS_4,
      nbStages  : 3,
      getBranchAngle : function() {
        return 0.1
      },
      getNumberBranches : function() {
        return 1
      },
      getBranchWidth : function (i, prevWidth) {
        return prevWidth ? prevWidth / 1.5 * 0.6 : 8
      },
      getBranchHeight: function(i, prevHeight) {
        return prevHeight ? prevHeight * (0.2 * Math.random() + 0.7) : 40
      },
      getLeafAngle : function() {
        return Math.PI - 3.1
      },
      getLeafWidth: function(i, prevWidth) {
        return 15 + (10 * Math.random())
      },
      getLeafHeight: function(i, prevHeight) {
        return prevHeight - 4 - 6 * Math.random()
      },
    }
    createForest(40, optBouleau)
    // createBushes(60, MATERIAL_TRUNK_3, MATERIAL_ROCK)

    var light = new THREE.AmbientLight( 0x606040 ); // soft white light
    scene.add( light ); 

    var light = new THREE.SpotLight( 0xffffff, 1, 0, Math.PI / 2 );
    light.position.set( -1000, 1500, 1000 );
    light.target.position.set( 0, 0, 0 );
    light.castShadow = true;
    light.shadow = new THREE.LightShadow( new THREE.PerspectiveCamera( 120, 1, 1400, 3000 ) );
    light.shadow.bias = 0.0001;
    light.shadow.mapSize.width = 2048;
    light.shadow.mapSize.height = 2048;
    scene.add( light );

    renderer = new THREE.WebGLRenderer();
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setSize( window.innerWidth, window.innerHeight );

    document.body.appendChild( renderer.domElement );

    renderer.render( scene, camera );
}

function addMeshes(meshes, x, y, z, scale) {
  meshes.position.set(x, y, z)
  meshes.scale.set(scale, scale, scale)

  // Shadow
  meshes.receiveShadow = true;
  meshes.castShadow = true;

  scene.add(meshes);
}

function createBushes(num, matTrunk, matLeaf) {
  for (let i = 1; i < num; i++) {
    var singleLeavesGeometry = new THREE.Geometry();
    meshesLeafs = []
    createTree(4)

    for (let i in meshesLeafs) {
      meshesLeafs[i].updateMatrix();
      singleLeavesGeometry.merge(meshesLeafs[i].geometry, meshesLeafs[i].matrix);
    }

    // Positioning
    var x = (Math.random() * 2 - 1) * 2000
    var z = Math.random() * -1600
    var xOnPlane = Math.round((x + 2000)/4000 * PLANE_SEGMENTS_X)
    var zOnPlane = PLANE_SEGMENTS_Z - Math.round(z/-1600 * PLANE_SEGMENTS_Z)
    var y = planeY[zOnPlane][xOnPlane]
    var scale = Math.random() * 0.4 + 0.7

    var meshLeafs = new THREE.Mesh(singleLeavesGeometry, matLeaf);
    addMeshes(meshLeafs, x, y, z, scale)
  }
}

function createForest(num, options) {
  options = Object.assign( {}, defaultTreeOptions, options)
  for (let i = 1; i < num; i++) {
    var singleTreesGeometry = new THREE.Geometry();
    var singleLeavesGeometry = new THREE.Geometry();
    meshesTrees = []
    meshesLeafs = []
    createTree(0, null, options)

    for (let i in meshesTrees) {
      meshesTrees[i].updateMatrix();
      singleTreesGeometry.merge(meshesTrees[i].geometry, meshesTrees[i].matrix);
    }

    for (let i in meshesLeafs) {
      meshesLeafs[i].updateMatrix();
      singleLeavesGeometry.merge(meshesLeafs[i].geometry, meshesLeafs[i].matrix);
    }

    // Positioning
    var x = (Math.random() * 2 - 1) * 2000
    var z = Math.random() * -1600
    var xOnPlane = Math.round((x + 2000)/4000 * PLANE_SEGMENTS_X)
    var zOnPlane = PLANE_SEGMENTS_Z - Math.round(z/-1600 * PLANE_SEGMENTS_Z)
    var y = planeY[zOnPlane][xOnPlane]
    var scale = Math.random() * 0.4 + 0.7

    var meshTrees = new THREE.Mesh(singleTreesGeometry, options.matTrunk);
    addMeshes(meshTrees, x, y, z, scale)

    var meshLeafs = new THREE.Mesh(singleLeavesGeometry, options.matLeaf);
    addMeshes(meshLeafs, x, y, z, scale)
  }
}

function createTree(i = 0, prevMesh = null, options) {
  var mesh;

  if (i < options.nbStages) {
    mesh = createTrunk(i, prevMesh, options)
    meshesTrees.push(mesh)
  
    var nbBanches = options.getNumberBranches && options.getNumberBranches(i) || 1
    for (var j = 0; j < nbBanches; j++ ) {
      createTree(i + 1, mesh, options)
    }
  }
  
  if (i >= options.leafStage) {
    meshesLeafs.push( createLeafs(i, prevMesh, options))
  }
}

function createTrunk(i, prevMesh, options) {
  // Create basic trunk
  geometry = new THREE.CylinderGeometry(1, 1, 1, RADIUS_SEGMENTS);
  // Move Y origin to base
  geometry.applyMatrix(new THREE.Matrix4().makeTranslation( 0, 0.5, 0 ));

  // Adding noise to vertex
  for (var i in geometry.vertices) {
    geometry.vertices[i].x -= (geometry.vertices[i].x / 1.5) * geometry.vertices[i].y * (0.6 + 0.4 * Math.random())
    geometry.vertices[i].z -= (geometry.vertices[i].z / 1.5) * geometry.vertices[i].y * (0.6 + 0.4 * Math.random())
  }
  
  // Delete bottom face
  geometry.faces.splice(- RADIUS_SEGMENTS)
  
  mesh = new THREE.Mesh(geometry);

  if (prevMesh) {
    // Positioning
    mesh.position.x = prevMesh.position.x - prevMesh.scale.y * Math.sin(prevMesh.rotation.z)
    mesh.position.y = prevMesh.position.y + prevMesh.scale.y * (Math.cos(prevMesh.rotation.x) * Math.cos(prevMesh.rotation.z)) //prevMesh.scale.y * (1 - Math.PI Math.abs(prevMesh.rotation.z)) // - (100 / 1.5 * 0.6) / 2;
    mesh.position.z = prevMesh.position.z + prevMesh.scale.y * (Math.sin(prevMesh.rotation.x) * Math.cos(prevMesh.rotation.z))

    // Scaling
    mesh.scale.x = options.getBranchWidth(i, prevMesh.scale.x)
    mesh.scale.y = options.getBranchHeight(i, prevMesh.scale.y)
    mesh.scale.z = options.getBranchWidth(i, prevMesh.scale.z)

    // Rotation
    mesh.rotation.x = options.getBranchAngle() * (Math.random() * 2 - 1)
    mesh.rotation.z = options.getBranchAngle() * (Math.random() * 2 - 1)
  } 
  else {
    // Scaling
    mesh.scale.x = options.getBranchWidth(i)
    mesh.scale.y = options.getBranchHeight(i)
    mesh.scale.z = options.getBranchWidth(i)
  }

  return mesh;
}

function createLeafs(i, prevMesh = null, options) {
  if(options.leafType === 'cone') {
    geometry = new THREE.ConeGeometry(1, 1, 5);
  }
  else {
    geometry = new THREE.SphereGeometry(1 , 5, 3);
  }

  mesh = new THREE.Mesh(geometry);

  // Moving vertex
  for (var i in geometry.vertices) {
    geometry.vertices[i].x = geometry.vertices[i].x * (0.8 + 0.3 * Math.random()) // * (1 * Math.random() + 0.2)
    geometry.vertices[i].y = geometry.vertices[i].y * (0.8 + 0.3 * Math.random()) // * (0.1 * Math.random() + 0.2)
    geometry.vertices[i].z = geometry.vertices[i].z * (0.8 + 0.3 * Math.random())
  }

  // Positioning
  if (prevMesh) {
    mesh.position.x = prevMesh.position.x - prevMesh.scale.y * Math.sin(prevMesh.rotation.z)
    mesh.position.y = prevMesh.position.y + prevMesh.scale.y * (Math.cos(prevMesh.rotation.x) * Math.cos(prevMesh.rotation.z)) //prevMesh.scale.y * (1 - Math.PI Math.abs(prevMesh.rotation.z)) // - (100 / 1.5 * 0.6) / 2;
    mesh.position.z = prevMesh.position.z + prevMesh.scale.y * (Math.sin(prevMesh.rotation.x) * Math.cos(prevMesh.rotation.z))
  }

  // Scaling
  mesh.scale.x = options.getLeafWidth(0, prevMesh.scale.x) //15 + (10 * Math.random())
  mesh.scale.y = options.getLeafHeight(0, prevMesh.scale.y) //5 + (10 * Math.random())
  mesh.scale.z = options.getLeafWidth(0, prevMesh.scale.z) //15 + (10 * Math.random())

  // Rotation
  mesh.rotation.x = options.getLeafAngle() * (Math.random() * 2 - 1)
  mesh.rotation.z = options.getLeafAngle() * (Math.random() * 2 - 1)

  return mesh;
}