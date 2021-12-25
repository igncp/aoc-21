import fs from "fs"

import { getDigitsNumbers, getSumOfOutputs } from "./lib"

const firstPart = () => {
  const stream = fs.createReadStream(`${__dirname}/input.txt`)

  return getDigitsNumbers(stream)
}

const secondPart = () => {
  const stream = fs.createReadStream(`${__dirname}/input.txt`)

  return getSumOfOutputs(stream)
}

export { firstPart, secondPart }
