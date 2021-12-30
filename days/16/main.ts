import fs from "fs"

import { BITSProtocol } from "./lib"

const firstPart = async () => {
  const setupStr = fs.createReadStream(`${__dirname}/input.txt`, "utf-8")
  const bitsProtocol = new BITSProtocol(setupStr)

  await bitsProtocol.decodeAllPackets()

  return bitsProtocol.getRecursiveVersionSum()
}

const secondPart = async () => {
  const setupStr = fs.createReadStream(`${__dirname}/input.txt`, "utf-8")
  const bitsProtocol = new BITSProtocol(setupStr)

  await bitsProtocol.decodeAllPackets()

  return bitsProtocol.evaluatePackets()
}

export { firstPart, secondPart }
