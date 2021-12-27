import fs from "fs"

import { Origami } from "./lib"

const firstPart = () => {
  const setupStr = fs.readFileSync(`${__dirname}/input.txt`, "utf-8")
  const origami = new Origami(setupStr)

  origami.foldNTimes(1)

  return origami.getVisibleDots()
}

const secondPart = () => {
  const setupStr = fs.readFileSync(`${__dirname}/input.txt`, "utf-8")
  const origami = new Origami(setupStr)

  origami.performAllFolds()

  return origami.paintMap()
}

export { firstPart, secondPart }
