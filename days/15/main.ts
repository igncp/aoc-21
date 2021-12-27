import fs from "fs"

import { ChitonMap } from "./lib"

const firstPart = () => {
  const setupStr = fs.readFileSync(`${__dirname}/input.txt`, "utf-8")
  const chitonMap = new ChitonMap(setupStr)

  return chitonMap.getLowestRisk()
}

const secondPart = () => {
  const setupStr = fs.readFileSync(`${__dirname}/input.txt`, "utf-8")
  const chitonMap = new ChitonMap(setupStr)

  chitonMap.expandCostsArr()

  return chitonMap.getLowestRisk()
}

export { firstPart, secondPart }
