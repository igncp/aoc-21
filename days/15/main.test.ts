import { firstPart, secondPart } from "./main"

test("First part", () => {
  expect(firstPart()).toEqual(390)
})

test("Second part", () => {
  expect(secondPart()).toEqual(2814)
})
