import * as color from 'demo/colors'
import ImprovedNoise from 'demo/improve_noise'

const PLANE_X = 15000
const PLANE_Y = 15000
const PLANE_SEGMENTS_X = 256
const PLANE_SEGMENTS_Y = 256

const planeGeo = new THREE.PlaneBufferGeometry(PLANE_X, PLANE_Y, PLANE_SEGMENTS_X - 1, PLANE_SEGMENTS_Y - 1)
const planeMat = new THREE.MeshPhongMaterial({
  color: color.paper,
  shading: THREE.FlatShading,
  shininess: 0,
})

function generateHeight(width, height) {
  const size = width * height
  const data = new Uint8Array(size)
  const perlin = new ImprovedNoise()
  let quality = 1
  const z = Math.random() * 100

  for (let j = 0; j < 4; j++) {
    for (let i = 0; i < size; i++) {
      const x = i % width
      const y = ~~(i / width)
      data[i] += Math.abs(perlin.noise(x / quality, y / quality, z) * quality * 1.75)
    }
    quality *= 5
  }
  return data
}

const height = generateHeight(PLANE_SEGMENTS_X, PLANE_SEGMENTS_Y)

function noise() {
  const plusOrMinus = (Math.random() * 2) - 1
  const scale = 30

  return plusOrMinus * scale
}

export function getYCoordinate(x, y) {
  const xOnPlaneSegmentX = x / PLANE_SEGMENTS_X
  const yOnPlaneSegmentY = y / PLANE_SEGMENTS_Y

  return (
    Math.cos(yOnPlaneSegmentY * 16) *
    Math.cos(xOnPlaneSegmentX * 8) *
    (1 - xOnPlaneSegmentX) * xOnPlaneSegmentX *
    (1 - yOnPlaneSegmentY) * yOnPlaneSegmentY *
    8000
  ) + noise()
}

// planeGeo.vertices.forEach((vertice, index) => {
//   const x = Math.floor(index / (PLANE_SEGMENTS_Y + 1))
//   const y = index % (PLANE_SEGMENTS_X + 1)

//   vertice.setZ(getYCoordinate(x, y))
// })

planeGeo.rotateX(-Math.PI / 2)

const vertices = planeGeo.attributes.position.array
for (let i = 0, j = 0, l = vertices.length; i < l; i++, j += 3) {
  vertices[j + 1] = height[i] * 8
}

export const mesh = new THREE.Mesh(planeGeo, planeMat)
