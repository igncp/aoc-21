import { Readable } from "stream"

import { OceanScanner } from "./lib"

const sampleExercise = `
199
200
208
210
200
207
240
269
260
263
`

const EXERCISE_EXPECTED_1 = 7
const EXERCISE_EXPECTED_2 = 5

const sampleExtra01 = `
0
1
10
0
1
`

describe("getFinalDepthIncreases", () => {
  it.each([
    [1, sampleExercise, EXERCISE_EXPECTED_1],
    [1, sampleExtra01, 3],
    [3, sampleExtra01, 0],
    [3, sampleExercise, EXERCISE_EXPECTED_2],
  ] as const)(
    "returns the expected values for the samples: %# with groupedMeasurements: %s",
    async (...[groupedMeasurements, sample, expectedResult]) => {
      const oceanScanner = OceanScanner.fromString(sample)
      const finalIncreases = await oceanScanner.getFinalDepthIncreases({
        groupedMeasurements,
      })

      expect(finalIncreases).toBe(expectedResult)
    }
  )

  it("supports getting the result from a readable stream", async () => {
    const readable = Readable.from([sampleExercise])
    const oceanScanner = OceanScanner.fromReadableStream(readable)
    const finalIncreases = await oceanScanner.getFinalDepthIncreases({
      groupedMeasurements: 1,
    })

    expect(finalIncreases).toBe(EXERCISE_EXPECTED_1)
  })
})
