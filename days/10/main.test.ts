import { firstPart, secondPart } from "./main"

test("First part", async () => {
  expect(await firstPart()).toEqual(367_227)
})

test("Second part", async () => {
  expect(await secondPart()).toEqual(3_583_341_858)
})
