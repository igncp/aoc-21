import fs from "fs"

import { OceanScanner } from "./lib"

const getIncreases = (groupedMeasurements: number) => {
  const readStream = fs.createReadStream(`${__dirname}/input.txt`)

  const oceanScanner = OceanScanner.fromReadableStream(readStream)

  return oceanScanner.getFinalDepthIncreases({
    groupedMeasurements,
  })
}

const firstPart = () => {
  return getIncreases(1)
}

const secondPart = () => {
  return getIncreases(3)
}

export { firstPart, secondPart }
