import { firstPart, secondPart } from "./main"

test("First part", async () => {
  expect(await firstPart()).toEqual(7085)
})

test("First part", async () => {
  expect(await secondPart()).toEqual(20_271)
})
