import * as ground from 'demo/ground'
import * as light from 'demo/light'
import * as sky from 'demo/sky'
import * as sun from 'demo/sun'
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

let clock = 0

function addCameraControls() {
  // Add camera
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 2000000)
  camera.position.set(660, 3600, 120)
  camera.lookAt(new THREE.Vector3())
  // Controls
  const controls = new OrbitControls(camera)
  controls.addEventListener('change', render)
  controls.enableZoom = false
}

function addSky() {
  // Sun mesh
  scene.add(sun.mesh)
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
  scene.add(light.ambientLight)  
  scene.add(light.directionnalLight)

  // Helper camera
  const helper = new THREE.CameraHelper(light.directionnalLight.shadow.camera)
  scene.add(helper)
}

function render() {
  const step = (clock / 60) % 1

  stats.begin()

  sky.render(step)
  light.render(step)
  sun.render(step)
  
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
  renderer.setSize(1200, 600)

  document.body.appendChild(renderer.domElement)

  // Controls
  const domClock = document.createElement('span')
  domClock.innerHTML = clock
  document.body.appendChild(domClock)

  const domPrevClockButton = document.createElement('input')
  domPrevClockButton.type = 'button'
  domPrevClockButton.value = 'prev'
  domPrevClockButton.addEventListener('click', () => { 
    clock--
    domClock.innerHTML = clock
    render()
  })
  document.body.appendChild(domPrevClockButton)

  const domNextClockButton = document.createElement('input')
  domNextClockButton.type = 'button'
  domNextClockButton.value = 'next'
  domNextClockButton.addEventListener('click', () => { 
    clock++
    domClock.innerHTML = clock
    render()
  })
  document.body.appendChild(domNextClockButton)

  render()
})
