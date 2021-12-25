import { firstPart, secondPart } from "./main"

test("First part", () => {
  expect(firstPart()).toEqual(351_901)
})

test("Second part", () => {
  expect(secondPart()).toEqual(101_079_875)
})
