import { firstPart, secondPart } from "./main"

test("First part", () => {
  expect(firstPart()).toEqual(376_194)
})

test("Second part", () => {
  expect(secondPart()).toEqual(1_693_022_481_538)
})
