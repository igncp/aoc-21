import fs from "fs"

import { OctopusPond } from "./lib"

const firstPart = () => {
  const mapStr = fs.readFileSync(`${__dirname}/input.txt`, "utf-8")
  const pond = new OctopusPond(mapStr)

  return pond.getFlashesCountAfterSteps(100)
}

const secondPart = () => {
  const mapStr = fs.readFileSync(`${__dirname}/input.txt`, "utf-8")
  const pond = new OctopusPond(mapStr)

  return pond.getStepsWhenAllFlash()
}

export { firstPart, secondPart }
