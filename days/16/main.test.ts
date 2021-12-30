import { firstPart, secondPart } from "./main"

test("First part", async () => {
  expect(await firstPart()).toEqual(1014)
})

test("Second part", async () => {
  expect(await secondPart()).toEqual(1_922_490_999_789)
})
