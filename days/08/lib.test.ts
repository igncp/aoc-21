import { _test, getDigitsNumbers, getSumOfOutputs } from "./lib"

const { ReadEntry } = _test!

const exerciseSample = `
be cfbegad cbdgef fgaecd cgeb fdcge agebfd fecdb fabcd edb | fdgacbe cefdb cefbgd gcbe
edbfga begcd cbg gc gcadebf fbgde acbgfd abcde gfcbed gfec | fcgedb cgb dgebacf gc
fgaebd cg bdaec gdafb agbcfd gdcbef bgcad gfac gcb cdgabef | cg cg fdcagb cbg
fbegcd cbd adcefb dageb afcb bc aefdc ecdab fgdeca fcdbega | efabcd cedba gadfec cb
aecbfdg fbg gf bafeg dbefa fcge gcbea fcaegb dgceab fcbdga | gecf egdcabf bgf bfgea
fgeab ca afcebg bdacfeg cfaedg gcfdb baec bfadeg bafgc acf | gebdcfa ecba ca fadegcb
dbcfg fgd bdegcaf fgec aegbdf ecdfab fbedc dacgb gdcebf gf | cefg dcbef fcge gbcadfe
bdfegc cbegaf gecbf dfcage bdacg ed bedf ced adcbefg gebcd | ed bcgafe cdgba cbgef
egadfb cdbfeg cegd fecab cgb gbdefca cg fgcdab egfdb bfceg | gbdfcae bgc cg cgb
gcafb gcf dcaebfg ecagb gf abcdeg gaef cafbge fdbac fegbdc | fgae cfgab fg bagce
`

describe("getDigitsNumbers", () => {
  it("returns the expected value", async () => {
    expect(await getDigitsNumbers(exerciseSample)).toEqual(26)
  })
})

describe("getDigitsNumbers", () => {
  it("returns the expected value", async () => {
    expect(await getSumOfOutputs(exerciseSample)).toEqual(61229)
  })
})

describe("ReadEntry.resolveDigitNumber", () => {
  it("returns the expected value", () => {
    const exerciseSampleLine =
      "acedgfb cdfbe gcdfa fbcad dab cefabd cdfgeb eafb cagedb ab | cdfeb fcadb cdfeb cdbaf"

    const entry = new ReadEntry(exerciseSampleLine)

    expect(entry.resolveDigitNumber()).toEqual(5353)
  })
})
