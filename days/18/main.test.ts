import { firstPart, secondPart } from "./main"

test("First part", () => {
  expect(firstPart()).toEqual(4641)
})

test("Second part", () => {
  expect(secondPart()).toEqual(4624)
})
