export const paper = `rgb(${200}, ${200}, ${200})`

export function getRandomIntervalValue(value, interval) {
  return value + Math.round((Math.random() - 0.5) * interval)
}
