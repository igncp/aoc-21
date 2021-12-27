import fs from "fs"

import { getPathsNumber } from "./lib"

const firstPart = () => {
  const graphStr = fs.readFileSync(`${__dirname}/input.txt`, "utf-8")

  return getPathsNumber({
    graphStr,
    smallCavesMaxVisits: 1,
  })
}

const secondPart = () => {
  const graphStr = fs.readFileSync(`${__dirname}/input.txt`, "utf-8")

  return getPathsNumber({
    graphStr,
    smallCavesMaxVisits: 2,
  })
}

export { firstPart, secondPart }
