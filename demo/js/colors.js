// @flow
function hex(x) {
  x = x.toString(16)
  return x.length == 1 ? '0' + x : x
}

function hex2a(hexx) {
  var hex = hexx.toString() //force conversion
  var str = ''
  for (var i = 0; i < hex.length; i += 2) {
    str += String.fromCharCode(parseInt(hex.substr(i, 2), 16))
  }
  return str
}

export const paper = `rgb(${200}, ${200}, ${200})`

export function getRandomIntervalValue(value: number, interval: number) {
  return value + Math.round((Math.random() - 0.5) * interval)
}

export function getGetGradientColorForRatio(
  hex1: number,
  hex2: number,
  ratio: number
) {
  const color1 = hex1.toString(16)
  const color2 = hex2.toString(16)

  const r = Math.floor(
    parseInt(color2.substring(0, 2), 16) * ratio +
      parseInt(color1.substring(0, 2), 16) * (1 - ratio)
  )
  const g = Math.floor(
    parseInt(color2.substring(2, 4), 16) * ratio +
      parseInt(color1.substring(2, 4), 16) * (1 - ratio)
  )
  const b = Math.floor(
    parseInt(color2.substring(4, 6), 16) * ratio +
      parseInt(color1.substring(4, 6), 16) * (1 - ratio)
  )

  return parseInt(hex(r) + hex(g) + hex(b), 16)
}
