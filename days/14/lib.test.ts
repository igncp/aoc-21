import { Polymer } from "./lib"

const exerciseSample = `
NNCB

CH -> B
HH -> N
CB -> H
NH -> C
HB -> C
HC -> B
HN -> C
NN -> C
BH -> H
NC -> B
NB -> B
BN -> B
BB -> N
BC -> B
CC -> N
CN -> C
`

const strWithDuplicate = `
NNCB

CH -> A
CH -> B
`

describe("Polymer", () => {
  it("throws when duplicate rule", () => {
    expect(() => new Polymer(strWithDuplicate)).toThrow()
  })
})

describe("getChain", () => {
  it("returns the expected value", () => {
    const polymer = new Polymer(exerciseSample)

    expect(polymer.getChain()).toEqual("NNCB")

    polymer.growNSteps(1)

    expect(polymer.getChain()).toEqual("NCNBCHB")
  })
})

describe("getChainLettersDiff", () => {
  it("returns the expected value for 10", () => {
    const polymer = new Polymer(exerciseSample)

    polymer.growNSteps(10)

    expect(polymer.getChainLettersDiff()).toEqual(1588)
  })
})

describe("getChainLettersDiffWithoutOrder", () => {
  it("returns the expected value for 10", () => {
    const polymer = new Polymer(exerciseSample)

    polymer.growNStepsWithoutOrder(10)

    expect(polymer.getChainLettersDiffWithoutOrder()).toEqual(1588)
  })

  it("returns the expected value for 40", () => {
    const polymer = new Polymer(exerciseSample)

    polymer.growNStepsWithoutOrder(40)

    expect(polymer.getChainLettersDiffWithoutOrder()).toEqual(2_188_189_693_529)
  })
})
