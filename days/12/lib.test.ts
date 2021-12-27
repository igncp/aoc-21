import { getPathsNumber } from "./lib"

const exerciseSample1 = `
start-A
start-b
A-c
A-b
b-d
A-end
b-end
`

const exerciseSample2 = `
dc-end
HN-start
start-kj
dc-start
dc-HN
LN-dc
HN-end
kj-sa
kj-HN
kj-dc
`

const exerciseSample3 = `
fs-end
he-DX
fs-he
start-DX
pj-DX
end-zg
zg-sl
zg-pj
pj-he
RW-he
fs-DX
pj-RW
zg-RW
start-pj
he-WI
zg-he
pj-fs
start-RW
`

describe("getPathsNumber", () => {
  it.each([
    [exerciseSample1, 10],
    [exerciseSample2, 19],
    [exerciseSample3, 226],
  ])(
    "returns the expected value for %# when smallCavesMaxVisits: 1",
    (...[graphStr, expectedNum]) => {
      const pathsNumber = getPathsNumber({
        graphStr,
        smallCavesMaxVisits: 1,
      })

      expect(pathsNumber).toEqual(expectedNum)
    }
  )

  it.each([
    [exerciseSample1, 36],
    [exerciseSample2, 103],
    [exerciseSample3, 3509],
  ])(
    "returns the expected value for %# when smallCavesMaxVisits: 2",
    (...[graphStr, expectedNum]) => {
      const pathsNumber = getPathsNumber({
        graphStr,
        smallCavesMaxVisits: 2,
      })

      expect(pathsNumber).toEqual(expectedNum)
    }
  )
})
