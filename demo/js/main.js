import * as ground from 'demo/ground'
import * as sky from 'demo/sky'
import * as treeGenerator from 'src/main'
import Stats from 'demo/stats.min'
import domready from 'domready'
import treeFirParams from 'demo/trees/fir'
import treeOakParams from 'demo/trees/oak'

const OrbitControls = require('three-orbit-controls')(THREE)

const stats = new Stats()
let camera
let renderer
let scene

function addCameraControls() {
  // Add camera
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000)
  camera.position.set(660, 3600, 120)
  camera.lookAt(new THREE.Vector3())
  // Controls
  const controls = new OrbitControls(camera)
  controls.addEventListener('change', render)
  controls.enableZoom = false
}

function addSky() {
  // Sky light
  sky.hemiLight.position.set(0, 500, 0)
  scene.add(sky.hemiLight)
  // Fog
  scene.fog.color.copy(new THREE.Color(0xffffff))
  // Mesh
  scene.add(sky.mesh)
}

function addGround() {
  // Mesh
  const plane = ground.mesh
  plane.receiveShadow = true
  scene.add(plane)

  return plane
}

function addLights() {
  // Ambient
  const ambientLight = new THREE.AmbientLight(0x606060)
  scene.add(ambientLight)
  // Directional
  const light = new THREE.DirectionalLight(0xffffff, 1, 100)
  light.position.set(-4000, 1200, -1600)
  light.castShadow = true
  light.shadow = new THREE.LightShadow(
    new THREE.OrthographicCamera(2000, -2000, 1500, -1000, 2000, 7000),
  )
  // Fix issue with shadow rendering
  // https://github.com/mrdoob/three.js/issues/8692
  light.shadow.bias = -0.001
  light.shadow.mapSize.width = 4096
  light.shadow.mapSize.height = 4096
  scene.add(light)

  const helper = new THREE.CameraHelper(light.shadow.camera)
  scene.add(helper)
}

function render() {
  stats.begin()
  renderer.render(scene, camera)
  stats.end()
  // requestAnimationFrame(render)
}

domready(() => {
  stats.showPanel(0) // 0: fps, 1: ms, 2: mb, 3+: custom
  document.body.appendChild(stats.dom)

  scene = new THREE.Scene()

  scene.fog = new THREE.Fog(0xffffff, 4500, 6500)
  scene.fog.color.setHSL(0.6, 0, 1)

  // Add sky
  addSky()
  // Add ground
  const plane = addGround()
  plane.receiveShadow = true
  plane.castShadow = true

  // Lighting
  addLights()

  // Add trees
  treeGenerator.forest(scene, 100, treeOakParams, ground.getYCoordinate, plane)
  treeGenerator.forest(scene, 200, treeFirParams, ground.getYCoordinate, plane)

  // Add camera/Controls
  addCameraControls()

  renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
  renderer.setSize(800, 600)

  document.body.appendChild(renderer.domElement)

  render()
})
