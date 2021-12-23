import { VentsMap } from "./lib"

const samples = `
0,9 -> 5,9
8,0 -> 0,8
9,4 -> 3,4
2,2 -> 2,1
7,0 -> 7,4
6,4 -> 2,0
0,9 -> 2,9
3,4 -> 1,4
0,0 -> 8,8
5,5 -> 8,2
`

describe("getOverlappingPoints", () => {
  it("returns the expected value when onlyStraightLines", async () => {
    const ventsMap = VentsMap.fromString(samples)
    const points = await ventsMap.getOverlappingPoints({
      onlyStraightLines: true,
    })

    expect(points.length).toEqual(5)
  })

  it("returns the expected value when not onlyStraightLines", async () => {
    const ventsMap = VentsMap.fromString(samples)
    const points = await ventsMap.getOverlappingPoints({
      onlyStraightLines: false,
    })

    expect(points.length).toEqual(12)
  })

  it("fails on unexpected line: not diagonal 45deg, horizontal or vertical", async () => {
    const ventsMap = VentsMap.fromString(`
0,9 -> 5,9
0,0 -> 1,2
`)
    const promise = ventsMap.getOverlappingPoints({
      onlyStraightLines: false,
    })

    return expect(promise).rejects.toEqual(new Error("Unexpected lines"))
  })
})
