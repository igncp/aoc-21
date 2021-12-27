import { firstPart, secondPart } from "./main"

test("First part", () => {
  expect(firstPart()).toEqual(5920)
})

test("Second part", () => {
  expect(secondPart()).toEqual(155_477)
})
