import { CorrectSubmarine, WrongSubmarine } from "./lib"

const sampleExercise = `
forward 5
down 5
forward 8
up 3
down 8
forward 2
`

const sampleExtra01 = `
down 1
forward 5
`

const EXPECTED_RESULT_EXERCISE_1 = 150
const EXPECTED_RESULT_EXERCISE_2 = 900

describe("WrongSubmarine.getPositionMultiplied", () => {
  it.each([
    [sampleExtra01, 5],
    [sampleExercise, EXPECTED_RESULT_EXERCISE_1],
  ])(
    "returns the expected multiplication: %#",
    async (...[sample, expectedResult]) => {
      const submarine = new WrongSubmarine()

      await submarine.completeMove(sample)

      expect(submarine.getPositionMultiplied()).toEqual(expectedResult)
    }
  )
})

describe("CorrectSubmarine.getPositionMultiplied", () => {
  it.each([
    [sampleExtra01, 25],
    [sampleExercise, EXPECTED_RESULT_EXERCISE_2],
  ])(
    "returns the expected multiplication: %#",
    async (...[sample, expectedResult]) => {
      const submarine = new CorrectSubmarine()

      await submarine.completeMove(sample)

      expect(submarine.getPositionMultiplied()).toEqual(expectedResult)
    }
  )
})
