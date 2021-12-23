import fs from "fs"

import { VentsMap } from "./lib"

const getPointsLength = async (onlyStraightLines: boolean) => {
  const readStream = fs.createReadStream(`${__dirname}/input.txt`)
  const ventsMap = VentsMap.fromString(readStream)

  const points = await ventsMap.getOverlappingPoints({
    onlyStraightLines,
  })

  return points.length
}

const firstPart = () => {
  return getPointsLength(true)
}

const secondPart = () => {
  return getPointsLength(false)
}

export { firstPart, secondPart }
