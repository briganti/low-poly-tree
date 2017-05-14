import * as color from 'demo/colors'
import { plusOrMinus } from 'demo/utils'

export default {
  trunk: {
    getMaterial() {
      const trunkColor = `rgb(
        ${color.getRandomIntervalValue(56, 15)},
        ${color.getRandomIntervalValue(47, 15)},
        ${color.getRandomIntervalValue(36, 15)})`
      return new THREE.MeshPhongMaterial({
        color: trunkColor,
        shading: THREE.FlatShading,
        shininess: 0,
      })
    },
    getStages: () => Math.round(9 - (2 * Math.random())),
    getAngle: () => plusOrMinus() * 0.1,
    getWidth(trunkStage) {
      return (0.66 ** (trunkStage - 1)) * 6
    },
    getHeight(trunkStage) {
      return ((0.8 ** (trunkStage - 1)) + (Math.random() * 0.2)) * (trunkStage === 1 ? 40 : 30)
    },
  },
  branches: {
    getNumberPerTrunkStage: () => 0,
    getNumberPerBranchStage: () => 0,
  },
  leaves: {
    getMaterial() {
      // const color = `rgb(
      //   ${color.getRandomIntervalValue(28, 10)},
      //   ${color.getRandomIntervalValue(73, 10)},
      //   ${color.getRandomIntervalValue(22, 10)})`;
      return new THREE.MeshPhongMaterial({
        color: new THREE.Color(0x41601d),
        shading: THREE.FlatShading,
        shininess: 0,
      })
    },
    getAngle() {
      return {
        x: plusOrMinus() * 0.1,
        y: (Math.random() * Math.PI),
        z: plusOrMinus() * 0.1,
      }
    },
    getWidth(trunkStage) {
      return (9 - trunkStage) * (4 + (Math.random() * 0.5))
    },
    getHeight(trunkStage) {
      return ((0.7 ** trunkStage) + 0.8) * 8
    },
  },
}
