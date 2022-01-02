import { _test, findHighestPoint, getAllValidVelocitiesNum } from "./lib"

const { calculateTrajectory, extractAreaInfo } = _test!

const exampleStr = "target area: x=20..30, y=-10..-5"

describe("calculateTrajectory", () => {
  it("produces the expected points", () => {
    expect(
      calculateTrajectory({
        bounds: {
          maxX: 30,
          maxY: -5,
          minX: 20,
          minY: -10,
        },
        velocity: { x: 7, y: 2 },
      })
    ).toEqual([
      { x: 7, y: 2 },
      { x: 13, y: 3 },
      { x: 18, y: 3 },
      { x: 22, y: 2 },
      { x: 25, y: 0 },
      { x: 27, y: -3 },
      { x: 28, y: -7 },
      { x: 28, y: -12 },
    ])
  })
})

describe("extractAreaInfo", () => {
  it("returns the expected values", () => {
    const infoResult = extractAreaInfo(exampleStr)

    expect(infoResult).toEqual({
      bounds: {
        maxX: 30,
        maxY: -5,
        minX: 20,
        minY: -10,
      },
    })
  })
})

describe("findHighestPoint", () => {
  it("returns the expected valeu", () => {
    const highestPoint = findHighestPoint(exampleStr)

    expect(highestPoint.y).toEqual(45)
  })
})

describe("getAllValidVelocities", () => {
  it("returns the expected value", () => {
    expect(
      getAllValidVelocitiesNum("target area: x=20..30, y=-10..-5")
    ).toEqual(112)
  })
})
