import { SnailfishNumber } from "./lib"

const sampleList = `
[[[0,[5,8]],[[1,7],[9,6]]],[[4,[1,2]],[[1,4],2]]]
[[[5,[2,8]],4],[5,[[9,9],0]]]
[6,[[[6,2],[5,6]],[[7,6],[4,7]]]]
[[[6,[0,7]],[0,9]],[4,[9,[9,0]]]]
[[[7,[6,4]],[3,[1,3]]],[[[5,5],1],9]]
[[6,[[7,3],[3,2]]],[[[3,8],[5,7]],4]]
[[[[5,4],[7,7]],8],[[8,3],8]]
[[9,3],[[9,9],[6,[4,9]]]]
[[2,[[7,7],7]],[[5,8],[[9,3],[0,2]]]]
[[[[5,2],5],[8,[3,7]]],[[5,[7,5]],[4,4]]]
`

test("SnailfishNumber.add", () => {
  const snailfishNumber = new SnailfishNumber(
    "[[[[4,3],4],4],[7,[[8,4],9]]]"
  ).add(new SnailfishNumber("[1,1]"))

  expect(snailfishNumber.toString()).toBe(
    "[[[[[4,3],4],4],[7,[[8,4],9]]],[1,1]]"
  )
})

describe("SnailfishNumber.explode", () => {
  test.each([
    ["[[[[[9,8],1],2],3],4]", "[[[[0,9],2],3],4]"],
    ["[7,[6,[5,[4,[3,2]]]]]", "[7,[6,[5,[7,0]]]]"],
    ["[[6,[5,[4,[3,2]]]],1]", "[[6,[5,[7,0]]],3]"],
    [
      "[[3,[2,[1,[7,3]]]],[6,[5,[4,[3,2]]]]]",
      "[[3,[2,[8,0]]],[9,[5,[4,[3,2]]]]]",
    ],
    ["[[3,[2,[8,0]]],[9,[5,[4,[3,2]]]]]", "[[3,[2,[8,0]]],[9,[5,[7,0]]]]"],
  ])("first examples: %s", (...[initialSnail, expectedSnail]) => {
    const snailfishNumber = new SnailfishNumber(initialSnail)

    snailfishNumber.explode()

    expect(snailfishNumber.toString()).toBe(expectedSnail)
  })
})

describe("SnailfishNumber.split", () => {
  test.each([
    ["[[1,1],10]", "[[1,1],[5,5]]"],
    ["[[1,1],11]", "[[1,1],[5,6]]"],
  ])("first examples: %s", (...[initialSnail, expectedSnail]) => {
    const snailfishNumber = new SnailfishNumber(initialSnail)

    snailfishNumber.split()

    expect(snailfishNumber.toString()).toBe(expectedSnail)
  })
})

describe("SnailfishNumber.reduce", () => {
  test.each([
    ["[[[[0,7],4],[7,[[8,4],9]]],[1,1]]", 1],
    ["[[[[0,7],4],[15,[0,13]]],[1,1]]", 2],
    ["[[[[0,7],4],[[7,8],[0,13]]],[1,1]]", 3],
    ["[[[[0,7],4],[[7,8],[0,[6,7]]]],[1,1]]", 4],
    ["[[[[0,7],4],[[7,8],[6,0]]],[8,1]]", -1],
  ])("it finishes in the expected state: %s", (...[finalState, steps]) => {
    const initialState = "[[[[[4,3],4],4],[7,[[8,4],9]]],[1,1]]"
    const snailfishNumber = new SnailfishNumber(initialState)

    snailfishNumber.reduce(steps)

    expect(snailfishNumber.toString()).toBe(finalState)
  })

  test("it finishes in the expected state for other example", () => {
    const initialState = "[[[[[1,1],[2,2]],[3,3]],[4,4]],[5,5]]"
    const snailfishNumber = new SnailfishNumber(initialState)

    snailfishNumber.reduce()

    expect(snailfishNumber.toString()).toBe("[[[[3,0],[5,3]],[4,4]],[5,5]]")
  })
})

describe("SnailfishNumber.sumAll", () => {
  it.each([
    [
      `
    [1,1]
    [2,2]
    [3,3]
    [4,4]`,
      "[[[[1,1],[2,2]],[3,3]],[4,4]]",
    ],
    [
      `
    [1,1]
    [2,2]
    [3,3]
    [4,4]
    [5,5]`,
      "[[[[3,0],[5,3]],[4,4]],[5,5]]",
    ],
    [
      `
    [1,1]
    [2,2]
    [3,3]
    [4,4]
    [5,5]
    [6,6]`,
      "[[[[5,0],[7,4]],[5,5]],[6,6]]",
    ],
    [
      `
[[[0,[4,5]],[0,0]],[[[4,5],[2,6]],[9,5]]]
[7,[[[3,7],[4,3]],[[6,3],[8,8]]]]
[[2,[[0,8],[3,4]]],[[[6,7],1],[7,[1,6]]]]
[[[[2,4],7],[6,[0,5]]],[[[6,8],[2,8]],[[2,1],[4,5]]]]
[7,[5,[[3,8],[1,4]]]]
[[2,[2,2]],[8,[8,1]]]
[2,9]
[1,[[[9,3],9],[[9,0],[0,7]]]]
[[[5,[7,4]],7],1]
[[[[4,2],2],6],[8,7]]
    `,
      "[[[[8,7],[7,7]],[[8,6],[7,7]]],[[[0,7],[6,6]],[8,7]]]",
    ],
    [
      sampleList,
      "[[[[6,6],[7,6]],[[7,7],[7,0]]],[[[7,7],[7,7]],[[7,8],[9,9]]]]",
    ],
  ])("returns the expected number", (...[listStr, expectedResult]) => {
    const resultNum = SnailfishNumber.sumAll(listStr)

    expect(resultNum.toString()).toEqual(expectedResult)
  })
})

describe("SnailfishNumber.getMagnitude", () => {
  it.each([
    ["[[1,2],[[3,4],5]]", 143],
    ["[[[[0,7],4],[[7,8],[6,0]]],[8,1]]", 1384],
    ["[[[[1,1],[2,2]],[3,3]],[4,4]]", 445],
    ["[[[[3,0],[5,3]],[4,4]],[5,5]]", 791],
    ["[[[[5,0],[7,4]],[5,5]],[6,6]]", 1137],
    ["[[[[8,7],[7,7]],[[8,6],[7,7]]],[[[0,7],[6,6]],[8,7]]]", 3488],
    ["[[[[6,6],[7,6]],[[7,7],[7,0]]],[[[7,7],[7,7]],[[7,8],[9,9]]]]", 4140],
    ["[[[[7,8],[6,6]],[[6,0],[7,7]]],[[[7,8],[8,8]],[[7,9],[0,6]]]]", 3993],
  ])("gets the expected result for %s", (...[numberStr, expectedMagnitude]) => {
    const snailfish = new SnailfishNumber(numberStr)
    const magnitude = snailfish.getMagnitude()

    expect(magnitude).toEqual(expectedMagnitude)
  })
})

describe("SnailfishNumber.getHighestMagnitude", () => {
  it("returns the expected value", () => {
    const maxMagnitude = SnailfishNumber.getHighestMagnitude(sampleList)

    expect(maxMagnitude).toEqual(3993)
  })
})
