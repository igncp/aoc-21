import fs from "fs"

import { CorrectSubmarine, WrongSubmarine } from "./lib"

const getValue = async (
  Klass: typeof CorrectSubmarine | typeof WrongSubmarine
) => {
  const readStream = fs.createReadStream(`${__dirname}/input.txt`)
  const submarine = new Klass()

  await submarine.completeMove(readStream)

  return submarine.getPositionMultiplied()
}

const firstPart = () => {
  return getValue(WrongSubmarine)
}

const secondPart = () => {
  return getValue(CorrectSubmarine)
}

export { firstPart, secondPart }
