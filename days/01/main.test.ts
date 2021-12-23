import { firstPart, secondPart } from "./main"

test("First part", async () => {
  expect(await firstPart()).toEqual(1754)
})

test("Second part", async () => {
  expect(await secondPart()).toEqual(1789)
})
