import { Bingo } from "./lib"

const exerciseSample = `
7,4,9,5,11,17,23,2,0,14,21,24,10,16,13,6,15,25,12,22,18,20,8,19,3,26,1

22 13 17 11  0
 8  2 23  4 24
21  9 14 16  7
 6 10  3 18  5
 1 12 20 15 19

 3 15  0  2 22
 9 18 13 17  5
19  8  7 25 23
20 11 10 24  4
14 21 16 12  6

14 21 17 24  4
10 16 15  9 19
18  8 23 26 20
22 11 13  6  5
 2  0 12  3  7
`

describe("Bingo.getGameResults", () => {
  it("returns the expected value for the first one", async () => {
    const bingo = Bingo.fromFixedString(exerciseSample)
    const winningResults = await bingo.getGameResults()

    expect(winningResults[0]).toEqual({
      boardIndex: 2,
      numberIndex: 11,
      score: 4512,
      winningNumber: 24,
    })
  })

  it("returns the expected value for the last one", async () => {
    const bingo = Bingo.fromFixedString(exerciseSample)
    const winningResults = await bingo.getGameResults()

    expect(winningResults[winningResults.length - 1]).toEqual({
      boardIndex: 1,
      numberIndex: 14,
      score: 1924,
      winningNumber: 13,
    })
  })
})
