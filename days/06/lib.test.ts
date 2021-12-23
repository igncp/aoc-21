import { LanternfishPopulation } from "./lib"

const exerciseInitial = "3,4,3,1,2"
const exercise18 = `6,0,6,4,5,6,0,1,1,2,6,0,1,1,1,2,2,3,3,4,6,7,8,8,8,8`
const { length: exercise18Total } = exercise18.split(",")
const exercise256Total = 26_984_457_539

describe("LanternfishPopulation.getStateAfter", () => {
  it("returs the expected state for 18", () => {
    const population = new LanternfishPopulation(exerciseInitial)
    const state18 = population.getStateAfter(18)

    expect(state18).toEqual(exercise18)
  })
})

describe("LanternfishPopulation.getTotalAfter", () => {
  it("returns the expected value for 18", () => {
    const population = new LanternfishPopulation(exerciseInitial)
    const state256Total = population.getTotalAfter(18)

    expect(state256Total).toEqual(exercise18Total)
  })

  it("returns the expected value for 256", () => {
    const population = new LanternfishPopulation(exerciseInitial)
    const state256Total = population.getTotalAfter(256)

    expect(state256Total).toEqual(exercise256Total)
  })
})
