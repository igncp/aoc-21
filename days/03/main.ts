import fs from "fs"

import { DiagnosticReport } from "./lib"

const prepareDiagnosticReport = async () => {
  const readStream = fs.createReadStream(`${__dirname}/input.txt`)
  const diagnostic = new DiagnosticReport()

  await diagnostic.consumeAllInput(readStream)

  return diagnostic
}

const firstPart = async () => {
  const diagnostic = await prepareDiagnosticReport()

  return diagnostic.getPowerConsumption()
}

const secondPart = async () => {
  const diagnostic = await prepareDiagnosticReport()

  return diagnostic.getLifeSupportRating()
}

export { firstPart, secondPart }
