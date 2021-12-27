import { Origami } from "./lib"

const exerciceSample = `
6,10
0,14
9,10
0,3
10,4
4,11
6,0
6,12
4,1
0,13
10,12
3,4
3,0
8,4
1,10
2,14
8,10
9,0

fold along y=7
fold along x=5
`

describe("Origami.getVisibleDots", () => {
  it.each([
    [1, 17],
    [2, 16],
  ])("returns the expected value", (...[foldsNumber, expectedNum]) => {
    const origami = new Origami(exerciceSample)

    origami.foldNTimes(foldsNumber)

    expect(origami.getVisibleDots()).toEqual(expectedNum)
  })
})

describe("Origami.paintMap", () => {
  it("returns the expected value", () => {
    const origami = new Origami(exerciceSample)

    origami.performAllFolds()

    expect(origami.paintMap()).toEqual(
      `
.......
.#####.
.#...#.
.#...#.
.#...#.
.#####.
.......`.trim()
    )
  })
})
