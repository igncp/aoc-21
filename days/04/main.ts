import fs from "fs"

import { Bingo } from "./lib"

const getWinningResultIndex = async (
  getIndex: (arrLength: number) => number
) => {
  const gameString = fs.readFileSync(`${__dirname}/input.txt`, "utf-8")
  const game = Bingo.fromFixedString(gameString)

  const winningResults = await game.getGameResults()
  const resultIndex = getIndex(winningResults.length)

  return winningResults[resultIndex].score
}

const firstPart = () => {
  return getWinningResultIndex(() => {
    return 0
  })
}

const secondPart = () => {
  return getWinningResultIndex((resultsLength) => {
    return resultsLength - 1
  })
}

export { firstPart, secondPart }
