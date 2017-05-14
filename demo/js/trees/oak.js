import * as color from 'demo/colors'

function getRandomColorComponent(value, interval) {
  return value + Math.round((Math.random() - 0.5) * interval)
}

export default {
  trunk: {
    getMaterial() {
      const color = `rgb(
        ${getRandomColorComponent(99, 15)},
        ${getRandomColorComponent(77, 15)},
        ${getRandomColorComponent(54, 15)})`
      return new THREE.MeshPhongMaterial({
        color,
        shading: THREE.FlatShading,
        shininess: 0,
      })
    },
    getStages: () => 4,
    getAngle: () => 0.1 * (Math.random() * 2 - 1),
    getWidth(trunkStage) {
      return Math.pow(0.66, trunkStage - 1) * 10
    },
    getHeight(trunkStage) {
      return (Math.pow(0.8, trunkStage - 1) + (Math.random() * 0.2)) * 35
    },
  },
  branches: {
    getNumberPerTrunkStage: (trunkStage) => Math.round(3 + Math.random()),
    getNumberPerBranchStage: (trunkStage, branchStage) => Math.round(2.2 + Math.random()),
    getStages: (trunkStage) => Math.min(3 - trunkStage, trunkStage) + 1,
    getAngle: () => Math.PI / 4 * (Math.random() * 2 - 1),
    getWidth(trunkStage, branchStage) {
      return Math.pow(0.66, trunkStage + branchStage) * 10
    },
    getHeight(branchStage) {
      return (Math.pow(0.8, branchStage) + (Math.random() * 0.2)) * 35
    },
  },
  leaves: {
    getMaterial() {
      // const color = `rgb(
      //   ${getRandomColorComponent(117, 25)},
      //   ${getRandomColorComponent(145, 25)},
      //   ${getRandomColorComponent(47, 25)})`;
      return new THREE.MeshPhongMaterial({
        color: new THREE.Color(0x86ba3b),
        shading: THREE.FlatShading,
        shininess: 0,
      })
    },
    getAngle() {
      return {
        x: (Math.random() * Math.PI),
        z: (Math.random() * Math.PI),
      }
    },
    getWidth: (trunkStage) => 10 + (4 - trunkStage) * (3 + 0.5 * Math.random()),
    getHeight: (trunkStage) => 6 + (4 - trunkStage) * (2 + 0.5 * Math.random()),
  },
}
