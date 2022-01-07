import { SnailfishNumber } from "./lib"

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
  ])("first examples: %s", (...[initialSnail, expectedSnail]) => {
    const snailfishNumber = new SnailfishNumber(initialSnail)

    snailfishNumber.explode()

    expect(snailfishNumber.toString()).toBe(expectedSnail)
  })
})
