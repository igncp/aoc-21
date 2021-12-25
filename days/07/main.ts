import fs from "fs"

import {
  getBestPositionForAlignment,
  getSimplePositionForAlignment,
} from "./lib"

const firstPart = () => {
  const crabsDescription = fs.readFileSync(`${__dirname}/input.txt`, "utf-8")

  return getSimplePositionForAlignment(crabsDescription).fuel
}

const secondPart = () => {
  const crabsDescription = fs.readFileSync(`${__dirname}/input.txt`, "utf-8")

  return getBestPositionForAlignment(crabsDescription).fuel
}

export { firstPart, secondPart }
