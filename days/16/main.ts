import fs from "fs"

import { BITSProtocol } from "./lib"

const firstPart = () => {
  const setupStr = fs.readFileSync(`${__dirname}/input.txt`, "utf-8")
  const bitsProtocol = new BITSProtocol(setupStr)

  bitsProtocol.decodeAllPackets()

  const packetsResult = bitsProtocol.getPackets()

  return BITSProtocol.getRecursiveVersionSum(packetsResult)
}

export { firstPart }
