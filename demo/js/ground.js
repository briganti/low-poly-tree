
const PLANE_SEGMENTS_X = 128;
const PLANE_SEGMENTS_Z = 128;

const planeGeo = new THREE.PlaneGeometry(1, 1, PLANE_SEGMENTS_X, PLANE_SEGMENTS_Z);
const planeMat = new THREE.MeshPhongMaterial({
  color: 0x3c4c12,
  shading: THREE.FlatShading,
  side: THREE.DoubleSide,
});

let index = 0;
for (let z = 0; z <= PLANE_SEGMENTS_Z; z++) {
  for (let x = 0; x <= PLANE_SEGMENTS_X; x++) {
    planeGeo.vertices[index].z = getYCoordinate(x, z);
    index++;
  }
}

export const mesh = new THREE.Mesh(planeGeo, planeMat);

export function getYCoordinate(x, z) {
  return Math.cos(z / PLANE_SEGMENTS_Z * 16) *
    Math.cos(x / PLANE_SEGMENTS_X * 8) *
    2000 *
    (1 - x / PLANE_SEGMENTS_X) *
    (x / PLANE_SEGMENTS_X) *
    (1 - z / PLANE_SEGMENTS_Z) *
    (z / PLANE_SEGMENTS_Z);
}