import fs from "fs"

import { findHighestPoint, getAllValidVelocitiesNum } from "./lib"

const firstPart = () => {
  const setupStr = fs.readFileSync(`${__dirname}/input.txt`, "utf-8")

  return findHighestPoint(setupStr).y
}

const secondPart = () => {
  const setupStr = fs.readFileSync(`${__dirname}/input.txt`, "utf-8")

  return getAllValidVelocitiesNum(setupStr)
}

export { firstPart, secondPart }
