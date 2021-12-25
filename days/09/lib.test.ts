import { HeightMap } from "./lib"

const sampleHeightMap = `
2199943210
3987894921
9856789892
8767896789
9899965678
`

describe("getTotalRiskLevel", () => {
  it("returns the expected value", () => {
    const heightmap = new HeightMap(sampleHeightMap)

    expect(heightmap.getTotalRiskLevel()).toEqual(15)
  })
})

describe("getBasins", () => {
  it("returns the expected value", () => {
    const heightmap = new HeightMap(sampleHeightMap)

    const basins = heightmap.getBasins()

    const resultNum = basins
      .slice(0, 3)
      .reduce((...[total, basin]) => total * basin.size, 1)

    expect(resultNum).toEqual(1134)
  })
})
