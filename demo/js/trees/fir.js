function getRandomColorComponent(value, interval) {
  return value + Math.round((Math.random() - 0.5) * interval);
}

export default {
  trunk: {
    getMaterial() {
      const color = `rgb(
        ${getRandomColorComponent(56, 15)},
        ${getRandomColorComponent(47, 15)},
        ${getRandomColorComponent(36, 15)})`;
      return new THREE.MeshPhongMaterial({
        color,
        shading: THREE.FlatShading,
      });
    },
    getStages: () => Math.round(4 - 2 * Math.random()),
    getAngle: () => 0.1 * (Math.random() * 2 - 1),
    getWidth(trunkStage) {
      return Math.pow(0.66, trunkStage - 1) * 6;
    },
    getHeight(trunkStage) {
      return (Math.pow(0.8, trunkStage - 1) + (Math.random() * 0.2)) * 45;
    },
  },
  branches: {
    getNumberPerTrunkStage: () => 0,
    getNumberPerBranchStage: () => 0,
  },
  leaves: {
    type: 'cone',
    getMaterial() {
      const color = `rgb(
        ${getRandomColorComponent(28, 10)},
        ${getRandomColorComponent(73, 10)},
        ${getRandomColorComponent(22, 10)})`;
      return new THREE.MeshPhongMaterial({
        color,
        shading: THREE.FlatShading,
      });
    },
    getAngle: () => 0,
    getWidth: (trunkStage) => 10 + (10 - trunkStage * 2) * (5 + 0.5 * Math.random()),
    getHeight: (trunkStage) => (Math.pow(0.2, trunkStage - 1) + 1) * 45,
  },
};
