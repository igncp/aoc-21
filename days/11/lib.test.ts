import { OctopusPond } from "./lib"

const sampleExercise1 = `
11111
19991
19191
19991
11111
`

const sampleExercise2 = `
5483143223
2745854711
5264556173
6141336146
6357385478
4167524645
2176841721
6882881134
4846848554
5283751526
`

describe("getFlashesCountAfterSteps", () => {
  it.each([
    [sampleExercise1, 1, 9],
    [sampleExercise1, 2, 9],
    [sampleExercise2, 100, 1656],
  ])("returns the expected value", (...[mapStr, steps, flashes]) => {
    const pond = new OctopusPond(mapStr)

    expect(pond.getFlashesCountAfterSteps(steps)).toEqual(flashes)
  })
})

describe("getStepsWhenAllFlash", () => {
  it("returns the expected value", () => {
    const pond = new OctopusPond(sampleExercise2)

    expect(pond.getStepsWhenAllFlash()).toEqual(195)
  })
})
