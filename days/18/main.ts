import fs from "fs"

import { SnailfishNumber } from "./lib"

const firstPart = () => {
  const setupStr = fs.readFileSync(`${__dirname}/input.txt`, "utf-8")
  const finalNumber = SnailfishNumber.sumAll(setupStr)

  return finalNumber.getMagnitude()
}

const secondPart = () => {
  const setupStr = fs.readFileSync(`${__dirname}/input.txt`, "utf-8")

  return SnailfishNumber.getHighestMagnitude(setupStr)
}

export { firstPart, secondPart }
