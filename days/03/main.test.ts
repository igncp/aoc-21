import { firstPart, secondPart } from "./main"

test("First part", async () => {
  expect(await firstPart()).toEqual(4_001_724)
})

test("Second part", async () => {
  expect(await secondPart()).toEqual(587_895)
})
