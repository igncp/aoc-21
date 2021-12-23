import { firstPart, secondPart } from "./main"

test("First part", async () => {
  expect(await firstPart()).toEqual(5685)
})

test("Second part", async () => {
  expect(await secondPart()).toEqual(21_070)
})
