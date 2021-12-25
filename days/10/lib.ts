import { from, map, mergeMap, of, reduce } from "rxjs"
import { Readable } from "stream"

const wrongCharScores = {
  ")": 3,
  ">": 25137,
  "]": 57,
  "}": 1197,
}

const autocompletePoints = {
  ")": 1,
  ">": 4,
  "]": 2,
  "}": 3,
}

const openingToClosing = {
  "(": ")",
  "<": ">",
  "[": "]",
  "{": "}",
}

const buildInput = (rawInput: Readable | string) => {
  const input$ = typeof rawInput === "string" ? of(rawInput) : from(rawInput)

  return input$.pipe(
    mergeMap((str: Buffer | string) => {
      return str
        .toString()
        .split("\n")
        .filter((v) => !!v)
    })
  )
}

const readLine = map((line: string) => {
  const expectedClosing = []

  for (let position = 0; position < line.length; position += 1) {
    const { [position]: char } = line

    if (openingToClosing[char as keyof typeof openingToClosing]) {
      expectedClosing.push(
        openingToClosing[char as keyof typeof openingToClosing]
      )

      continue
    }

    const lastExpectingChar = expectedClosing.pop()

    if (lastExpectingChar !== char) {
      return {
        expectedClosing: [],
        wrongChar: char,
      }
    }
  }

  return {
    expectedClosing: expectedClosing.reverse(),
    wrongChar: "",
  }
})

const calculateTotalErrorScore = (rawInput: Readable | string) => {
  return new Promise((resolve) => {
    buildInput(rawInput)
      .pipe(
        readLine,
        reduce((...[total, { wrongChar }]) => {
          if (!wrongChar) {
            return total
          }

          return (
            total + wrongCharScores[wrongChar as keyof typeof wrongCharScores]
          )
        }, 0)
      )
      .subscribe(resolve)
  })
}

const calculateMiddleAutocompleteScore = (rawInput: Readable | string) => {
  return new Promise((resolve) => {
    buildInput(rawInput)
      .pipe(
        readLine,
        reduce((...[linesResults, parsingResult]) => {
          // Only incomplete lines (not wrong or correct) are used for calculating the score
          if (
            parsingResult.wrongChar ||
            !parsingResult.expectedClosing.length
          ) {
            return linesResults
          }

          const newResult = parsingResult.expectedClosing.reduce(
            (...[total, char]) => {
              return (
                total * 5 +
                autocompletePoints[char as keyof typeof autocompletePoints]
              )
            },
            0
          )

          return linesResults.concat([newResult])
        }, [] as number[])
      )
      .subscribe((linesResults) => {
        const { [Math.floor(linesResults.length / 2)]: middleResult } =
          linesResults.sort(
            (...[lineResultA, lineResultB]) => lineResultB - lineResultA
          )

        resolve(middleResult)
      })
  })
}

export { calculateTotalErrorScore, calculateMiddleAutocompleteScore }
