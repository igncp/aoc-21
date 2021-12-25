import {
  calculateMiddleAutocompleteScore,
  calculateTotalErrorScore,
} from "./lib"

const exerciseSample = `
[({(<(())[]>[[{[]{<()<>>
[(()[<>])]({[<{<<[]>>(
{([(<{}[<>[]}>{[]{[(<()>
(((({<>}<{<{<>}{[]{[]{}
[[<[([]))<([[{}[[()]]]
[{[{({}]{}}([{[{{{}}([]
{<[[]]>}<{[{[{[]{()[[[]
[<(<(<(<{}))><([]([]()
<{([([[(<>()){}]>(<<{{
<{([{{}}[<[[[<>{}]]]>[]]
`

describe("calculateTotalErrorScore", () => {
  it("returns the expected value", async () => {
    expect(await calculateTotalErrorScore(exerciseSample)).toBe(26_397)
  })
})

describe("calculateMiddleAutocompleteScore", () => {
  it("returns the expected value", async () => {
    expect(await calculateMiddleAutocompleteScore(exerciseSample)).toBe(28_8957)
  })
})
