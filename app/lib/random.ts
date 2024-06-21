import words from '../../words'

import { convertHslValuesToHexString, getRandomHslValues } from './color'

function getRandomFrom(array: any[]) {
  const randomIndex = Math.floor(Math.random() * array.length)
  return array[randomIndex]
}

function getRandomTagName() {
  let name = getRandomFrom(words)
  const secondWord = Math.round(Math.random())
  if (secondWord) name += ` ${getRandomFrom(words)}`
  return name
}

function getRandomTagValue() {
  let value
  const type = ['string', 'number', null].at(Math.floor(Math.random() * 3))
  if (type === 'number') {
    let digitCount = Math.ceil(Math.random() * 3)
    do {
      if (!value) {
        value = Math.ceil(Math.random() * 9).toString()
      } else {
        value += Math.floor(Math.random() * 10).toString()
      }
    } while (digitCount--)
  } else if (type === 'string') {
    value = getRandomTagName()
  } else {
    value = null
  }
  return value
}

export function getRandomTag({ values } = { values: true }) {
  const name = getRandomTagName()
  const value = values ? getRandomTagValue() : null
  const color = convertHslValuesToHexString(getRandomHslValues())
  const id = `${name}: ${value}, color: ${color}`
  return { id, name, value, color }
}
