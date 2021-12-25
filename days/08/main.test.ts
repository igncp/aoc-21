import { firstPart, secondPart } from "./main"

test("First part", async () => {
  expect(await firstPart()).toEqual(272)
})

test("Second part", async () => {
  expect(await secondPart()).toEqual(1_007_675)
})
