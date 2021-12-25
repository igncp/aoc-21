import fs from "fs"

import {
  calculateMiddleAutocompleteScore,
  calculateTotalErrorScore,
} from "./lib"

const firstPart = () => {
  const stream = fs.createReadStream(`${__dirname}/input.txt`, "utf-8")

  return calculateTotalErrorScore(stream)
}

const secondPart = () => {
  const stream = fs.createReadStream(`${__dirname}/input.txt`, "utf-8")

  return calculateMiddleAutocompleteScore(stream)
}

export { firstPart, secondPart }
