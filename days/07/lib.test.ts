import {
  getBestPositionForAlignment,
  getSimplePositionForAlignment,
} from "./lib"

const example = "16,1,2,0,4,2,7,1,2,14"

describe("getSimplePositionForAlignment", () => {
  it("returns the expected value for the sample", () => {
    const alignmentResult = getSimplePositionForAlignment(example)

    expect(alignmentResult).toEqual({
      fuel: 37,
      position: 2,
    })
  })
})

describe("getBestPositionForAlignment", () => {
  it("returns the expected value for the sample", () => {
    const alignmentResult = getBestPositionForAlignment(example)

    expect(alignmentResult).toEqual({
      fuel: 168,
      position: 5,
    })
  })
})
