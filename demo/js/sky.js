const skyColor = (new THREE.Color()).setHSL(0.6, 1, 0.6)
const groundColor = (new THREE.Color()).setHSL(0.095, 1, 0.75)

export const hemiLight = new THREE.HemisphereLight(skyColor, groundColor, 0)

const vertexShader = document.getElementById('vertexShader').textContent
const fragmentShader = document.getElementById('fragmentShader').textContent

const uniforms = {
  topColor: { value: skyColor },
  bottomColor: { value: new THREE.Color(0xffffff) },
  offset: { value: 33 },
  exponent: { value: 0.6 },
}

const skyGeo = new THREE.SphereBufferGeometry(4000, 32, 15)
const skyMat = new THREE.ShaderMaterial({
  vertexShader,
  fragmentShader,
  uniforms,
  side: THREE.BackSide,
})

export const mesh = new THREE.Mesh(skyGeo, skyMat)
