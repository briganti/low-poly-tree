export const mesh = new THREE.Mesh(
  new THREE.SphereBufferGeometry(1000, 8, 6),
  new THREE.MeshBasicMaterial({ color: 0xffffff })
)

mesh.visible = true
mesh.receiveShadow = false
mesh.castShadow = false

export function render(step) {
  mesh.position.set(
    40000 * Math.cos(step * 2 * Math.PI),
    -40000 * Math.cos(step * 2 * Math.PI),
    40000 * Math.sin(step * 2 * Math.PI)
  )
}
