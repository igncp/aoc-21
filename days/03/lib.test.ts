import { DiagnosticReport } from "./lib"

const exerciseSample = `
00100
11110
10110
10111
10101
01111
00111
11100
10000
11001
00010
01010
`
const powerConsumptionExercise = 198
const lifeSupportExercise = 230

const sampleExtra01 = `
10
`
const powerConsumptionExtra01 = 2 // epsilon: 10, gamma: 01: 2 * 1
const lifeSupportExtra01 = 4 // oxygen: 10, co2: 10: 2 * 2

const sampleExtra02 = `
00
01
11
`
const powerConsumptionExtra02 = 2 // epsilon: 01, gamma: 10: 1 * 2
const lifeSupportExtra02 = 3 // oxygen: 01, co2: 11: 1 * 3

describe("Diagnostic.getPowerConsumption", () => {
  it.each([
    [exerciseSample, powerConsumptionExercise],
    [sampleExtra01, powerConsumptionExtra01],
    [sampleExtra02, powerConsumptionExtra02],
  ])(
    "returns the expected value for %#",
    async (...[sample, expectedPowerConsumption]) => {
      const diagnostic = new DiagnosticReport()

      await diagnostic.consumeAllInput(sample)

      expect(diagnostic.getPowerConsumption()).toEqual(expectedPowerConsumption)
    }
  )
})

describe("Diagnostic.getLifeSupportRating", () => {
  it.each([
    [exerciseSample, lifeSupportExercise],
    [sampleExtra01, lifeSupportExtra01],
    [sampleExtra02, lifeSupportExtra02],
  ])(
    "returns the expected value for %#",
    async (...[sample, expectedPowerConsumption]) => {
      const diagnostic = new DiagnosticReport()

      await diagnostic.consumeAllInput(sample)

      expect(diagnostic.getLifeSupportRating()).toEqual(
        expectedPowerConsumption
      )
    }
  )

  it("returns -1 on incorrect inputs", async () => {
    const diagnostic = new DiagnosticReport()
    const sample = ["10", "10"].join("\n")

    await diagnostic.consumeAllInput(sample)

    expect(diagnostic.getLifeSupportRating()).toEqual(-1)
  })
})
