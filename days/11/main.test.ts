import { firstPart, secondPart } from "./main"

test("First part", () => {
  expect(firstPart()).toEqual(1773)
})

test("Second part", () => {
  expect(secondPart()).toEqual(494)
})
