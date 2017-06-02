// flow
import * as color from 'demo/colors'

const nightGradient = [0x1e3c72, 0x2a5298]
const morningGradient = [0x20e2d7, 0xf9fea5]
const dayGradient = [0x66a6ff, 0x89f7fe]

const skyTimeGradients = {
  '0': nightGradient,
  '0.15': nightGradient,
  '0.3': morningGradient,
  '0.4': dayGradient,
  '0.7': dayGradient,
  '0.85': nightGradient,
  '1': nightGradient,
}

const skyColor = new THREE.Color().setHSL(0.6, 1, 0.6)
const groundColor = new THREE.Color().setHSL(0.095, 1, 0.75)

export const hemiLight = new THREE.HemisphereLight(skyColor, groundColor, 0)

const vertexShader = document.getElementById('vertexShader').textContent
const fragmentShader = document.getElementById('fragmentShader').textContent

const uniforms = {
  topColor: { value: new THREE.Color(nightGradient[0]) },
  bottomColor: { value: new THREE.Color(nightGradient[1]) },
  offset: { value: 33 },
  exponent: { value: 0.6 },
}

const skyGeo = new THREE.SphereBufferGeometry(450000, 32, 15)
const skyMat = new THREE.ShaderMaterial({
  vertexShader,
  fragmentShader,
  uniforms,
  side: THREE.BackSide,
})

export const mesh = new THREE.Mesh(skyGeo, skyMat)

function getSkyGradientRange(step: number) {
  const skyTimeGradientsKeys = Object.keys(skyTimeGradients)
    .sort()
    .map(a => parseInt(a))

  const bestKey = skyTimeGradientsKeys.reduce((a, b) => {
    return b < step ? b : a
  })
  const followingKey =
    skyTimeGradientsKeys.find(a => a > bestKey) || skyTimeGradientsKeys[1]

  return { from: bestKey, to: followingKey }
}

export function render(step: number) {
  const gradients = getSkyGradientRange(step)
  const stepRatio = (step - gradients.from) / (gradients.to - gradients.from)

  uniforms.topColor.value = new THREE.Color(
    color.getGetGradientColorForRatio(
      skyTimeGradients[gradients.from][0],
      skyTimeGradients[gradients.to][0],
      stepRatio
    )
  )

  uniforms.bottomColor.value = new THREE.Color(
    color.getGetGradientColorForRatio(
      skyTimeGradients[gradients.from][1],
      skyTimeGradients[gradients.to][1],
      stepRatio
    )
  )
}
