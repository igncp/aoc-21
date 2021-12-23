import fs from "fs"

import { LanternfishPopulation } from "./lib"

const firstPart = () => {
  const initialState = fs.readFileSync(`${__dirname}/input.txt`, "utf-8")
  const population = new LanternfishPopulation(initialState)

  return population.getTotalAfter(80)
}

const secondPart = () => {
  const initialState = fs.readFileSync(`${__dirname}/input.txt`, "utf-8")
  const population = new LanternfishPopulation(initialState)

  return population.getTotalAfter(256)
}

export { firstPart, secondPart }
