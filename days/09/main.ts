import fs from "fs"

import { HeightMap } from "./lib"

const firstPart = () => {
  const text = fs.readFileSync(`${__dirname}/input.txt`, "utf-8")
  const heightmap = new HeightMap(text)

  return heightmap.getTotalRiskLevel()
}

const secondPart = () => {
  const text = fs.readFileSync(`${__dirname}/input.txt`, "utf-8")
  const heightmap = new HeightMap(text)

  const basins = heightmap.getBasins()

  return basins.slice(0, 3).reduce((...[total, basin]) => total * basin.size, 1)
}

export { firstPart, secondPart }
