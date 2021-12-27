import fs from "fs"

import { Polymer } from "./lib"

const firstPart = () => {
  const setupStr = fs.readFileSync(`${__dirname}/input.txt`, "utf-8")
  const polymer = new Polymer(setupStr)

  polymer.growNSteps(10)

  return polymer.getChainLettersDiff()
}

const secondPart = () => {
  const setupStr = fs.readFileSync(`${__dirname}/input.txt`, "utf-8")
  const polymer = new Polymer(setupStr)

  polymer.growNStepsWithoutOrder(40)

  return polymer.getChainLettersDiffWithoutOrder()
}

export { firstPart, secondPart }
