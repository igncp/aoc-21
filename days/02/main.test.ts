import { firstPart, secondPart } from "./main"

test("First part", async () => {
  expect(await firstPart()).toEqual(1_947_824)
})

test("Second part", async () => {
  expect(await secondPart()).toEqual(1_813_062_561)
})
