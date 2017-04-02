import * as color from 'demo/colors'

const PLANE_X = 15000
const PLANE_Y = 15000
const PLANE_SEGMENTS_X = 64
const PLANE_SEGMENTS_Y = 64

const planeGeo = new THREE.PlaneGeometry(PLANE_X, PLANE_Y, PLANE_SEGMENTS_X, PLANE_SEGMENTS_Y)
const planeMat = new THREE.MeshPhongMaterial({
  color: color.paper,
  shading: THREE.FlatShading,
  shininess: 0,
})

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

planeGeo.vertices.forEach((vertice, index) => {
  const x = Math.floor(index / (PLANE_SEGMENTS_Y + 1))
  const y = index % (PLANE_SEGMENTS_X + 1)

  vertice.setZ(getYCoordinate(x, y))
})

planeGeo.rotateX(-Math.PI / 2)

export const mesh = new THREE.Mesh(planeGeo, planeMat)
