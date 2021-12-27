import { firstPart, secondPart } from "./main"

test("First part", () => {
  expect(firstPart()).toEqual(3587)
})

test("Second part", () => {
  expect(secondPart()).toEqual(3_906_445_077_999)
})
