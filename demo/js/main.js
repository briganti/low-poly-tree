import * as THREE from 'three';
import * as ground from './ground.js';
import * as sky from './sky.js';
import * as treeGenerator from '../../src/main.js';
import Stats from './stats.min.js';
import domready from 'domready';
import treeFirParams from './trees/fir.js';

const OrbitControls = require('three-orbit-controls')(THREE);
const stats = new Stats();
let camera;
let renderer;
let scene;

function addCameraControls() {
  // Add camera
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
  camera.position.set(0, 600, 120);
  camera.lookAt(new THREE.Vector3());
  // Controls
  const orbit = new OrbitControls(camera);
  orbit.enableZoom = false;
}

function addSky() {
  // Sky light
  sky.hemiLight.position.set(0, 500, 0);
  scene.add(sky.hemiLight);
  // Fog
  scene.fog.color.copy(new THREE.Color(0xffffff));
  // Mesh
  scene.add(sky.mesh);
}

function addGround() {
  // Mesh
  const plane = ground.mesh;
  plane.scale.x = 15000;
  plane.scale.y = 15000;
  plane.rotation.x = -Math.PI / 2;
  plane.receiveShadow = true;
  scene.add(plane);
}

function addLights() {
  // Ambient
  const ambientLight = new THREE.AmbientLight(0x606040);
  scene.add(ambientLight);
  // Directional
  const light = new THREE.DirectionalLight(0xffffff);
  light.position.set(-1600, 2000, -1600);
  light.castShadow = true;
  light.shadow = new THREE.LightShadow(new THREE.PerspectiveCamera(120, 1, 1, 10000));
  light.shadow.bias = 0.0001;
  light.shadow.mapSize.width = 2048;
  light.shadow.mapSize.height = 2048;
  scene.add(light);
}

function render() {
  stats.begin();
  renderer.render(scene, camera);
  stats.end();
  requestAnimationFrame(render);
}

domready(() => {
  stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
  document.body.appendChild(stats.dom);

  scene = new THREE.Scene();

  scene.fog = new THREE.Fog(0xffffff, 1500, 4000);
  scene.fog.color.setHSL(0.6, 0, 1);

  // Add sky
  addSky();
  // Add ground
  addGround();
  // Lighting
  addLights();

  // Add trees
  treeGenerator.forest(scene, 150, {}, ground.getYCoordinate);
  treeGenerator.forest(scene, 150, treeFirParams, ground.getYCoordinate);

  // Add camera/Controls
  addCameraControls();

  renderer = new THREE.WebGLRenderer();
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.setSize(800, 600);

  document.body.appendChild(renderer.domElement);

  render();
});
