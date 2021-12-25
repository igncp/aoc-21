import { firstPart, secondPart } from "./main"

test("First part", () => {
  expect(firstPart()).toEqual(530)
})

test("Second part", () => {
  expect(secondPart()).toEqual(1_019_494)
})
