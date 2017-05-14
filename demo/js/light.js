
const ambientIntensity = {
  '0'   : 0.05,
  '0.15' : 0.05,
  '0.3' : 0.5,
  '0.4' : 0.7,
  '0.7' : 0.7,
  '0.85' : 0.05,
  '1'   : 0.05,
}

export function getAmbientIntensity(step) {
  const intensityKeys = Object.keys(ambientIntensity).sort()

  const beginKey = intensityKeys.reduce((a, b) => b < step ? b : a)
  const endKey = intensityKeys.find((a) => a > beginKey) || 0

  const stepRatio = (step - beginKey) / (endKey - beginKey)

  return ambientIntensity[beginKey] + stepRatio * (ambientIntensity[endKey] - ambientIntensity[beginKey])
}

export const ambientLight = new THREE.AmbientLight(0x606060)

// Directional
export const directionnalLight = new THREE.DirectionalLight(0xffffff, 1)
directionnalLight.position.set(-4000, 1200, -1600)
directionnalLight.castShadow = true
directionnalLight.shadow = new THREE.LightShadow(
  new THREE.OrthographicCamera(3500, -3500, 1500, -2000, 1000, 8000),
)
// Fix issue with shadow rendering
// https://github.com/mrdoob/three.js/issues/8692
directionnalLight.shadow.bias = -0.001
directionnalLight.shadow.mapSize.width = 4096
directionnalLight.shadow.mapSize.height = 4096

export function render(step) {  
  ambientLight.intensity = getAmbientIntensity(step) 

  directionnalLight.position.set(
    4000 * Math.cos(step * 2 * Math.PI),
    (getAmbientIntensity(step) * 4800 - 1200),
    4000 * Math.sin(step * 2 * Math.PI)
  )
  directionnalLight.intensity = getAmbientIntensity(step)
}