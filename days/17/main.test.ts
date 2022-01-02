import { firstPart, secondPart } from "./main"

test("First part", () => {
  expect(firstPart()).toEqual(4005)
})

test("Second part", () => {
  expect(secondPart()).toEqual(2953)
})
