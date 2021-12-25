import { Readable } from "node:stream"
import { from, last, map, mergeMap, of } from "rxjs"

/* eslint-disable id-denylist */
enum Segment {
  a = "a",
  b = "b",
  c = "c",
  d = "d",
  e = "e",
  f = "f",
  g = "g",
}

/* eslint-enable id-denylist */

const correctDigits = {
  0: [Segment.a, Segment.b, Segment.c, Segment.e, Segment.f, Segment.g],
  1: [Segment.c, Segment.f],
  2: [Segment.a, Segment.c, Segment.d, Segment.e, Segment.g],
  3: [Segment.a, Segment.c, Segment.d, Segment.e, Segment.g],
  4: [Segment.b, Segment.c, Segment.d, Segment.f],
  5: [Segment.a, Segment.b, Segment.d, Segment.f, Segment.g],
  6: [Segment.a, Segment.b, Segment.d, Segment.e, Segment.f, Segment.g],
  7: [Segment.a, Segment.c, Segment.f],
  8: [
    Segment.a,
    Segment.b,
    Segment.c,
    Segment.d,
    Segment.e,
    Segment.f,
    Segment.g,
  ],
  9: [Segment.a, Segment.b, Segment.c, Segment.d, Segment.f, Segment.g],
}

const correctDigitsSegmentsNum = Object.keys(correctDigits).reduce<{
  [key: string]: number
}>((...[accObj, key]) => {
  accObj[key] =
    correctDigits[key as unknown as keyof typeof correctDigits].length

  return accObj
}, {})

const uniqueNumbersTuples = Object.keys(correctDigitsSegmentsNum)
  .reduce<Array<[string, number]>>((...[numbersArr, key]) => {
    return numbersArr.concat([[key, correctDigitsSegmentsNum[key]]])
  }, [])
  .filter((...[[key, segmentsNum], , allTuples]) => {
    return !allTuples.find(
      (otherTuple) => otherTuple[0] !== key && otherTuple[1] === segmentsNum
    )
  })

const uniqueDigitsCharsNum = uniqueNumbersTuples.map(
  (...[[, segmentsNum]]) => segmentsNum
)

class ReadEntry {
  private readonly digits: string[]
  private readonly signalPatterns: string[][]

  public constructor(line: string) {
    const [patterns, digits] = line.split("|")

    this.digits = digits.split(" ")
    this.signalPatterns = patterns
      .split(" ")
      .filter((c) => !!c)
      .map((pattern) => pattern.split("").sort())
  }

  public numberOfUniqueDigits() {
    return this.digits.reduce((...[total, digit]) => {
      return total + (uniqueDigitsCharsNum.includes(digit.length) ? 1 : 0)
    }, 0)
  }

  public resolveDigitNumber() {
    const getPatternOfLength = (length: number) =>
      this.signalPatterns.find((pattern) => pattern.length === length)
    const getPatternsOfLength = (length: number) =>
      this.signalPatterns.filter((pattern) => pattern.length === length)

    const pattern1 = getPatternOfLength(2)!
    const pattern7 = getPatternOfLength(3)!
    const pattern4 = getPatternOfLength(4)!
    const pattern8 = getPatternOfLength(7)!

    const patternsWith5 = getPatternsOfLength(5)
    const patternsWith6 = getPatternsOfLength(6)

    // compare 1 and 7 to get: segment A
    const segmentA = pattern7.find(
      (pattern7Segment) => !pattern1.includes(pattern7Segment)
    )!

    // 2, 3, 5 (5 segments) -> shares 2 with 1 = 3
    const pattern3 = patternsWith5.find((pattern) =>
      pattern1.every((pattern1Segment) => pattern.includes(pattern1Segment))
    )!

    // remove all segments from 4 in 3, remove segment A = segment g
    const segmentG = pattern3.find(
      (pattern3Segment) =>
        !pattern4.includes(pattern3Segment) && pattern3Segment !== segmentA
    )!

    // the segment in 4 but not in 3 -> segment B
    const segmentB = pattern4.find(
      (pattern4Segment) => !pattern3.includes(pattern4Segment)
    )!

    const pattern5 = patternsWith5.find(
      (pattern) => pattern.includes(segmentB) && pattern !== pattern3
    )!

    const pattern2 = patternsWith5.find(
      (pattern) => pattern !== pattern3 && pattern !== pattern5
    )

    // has all from 4 + segment A + segment G -> 9
    const pattern9 = patternsWith6.find(
      (pattern) =>
        pattern4.every((pattern4Segment) =>
          pattern.includes(pattern4Segment)
        ) &&
        pattern.includes(segmentA) &&
        pattern.includes(segmentG)
    )

    // compare 0 and 6, the one that has both of 1 -> 0 (and also gives 6)
    const pattern0 = patternsWith6.find((pattern) => {
      return (
        pattern !== pattern9 &&
        pattern1.every((pattern1Segment) => pattern.includes(pattern1Segment))
      )
    })

    const pattern6 = patternsWith6.find((pattern) => {
      return pattern !== pattern9 && pattern !== pattern0
    })

    const patternToDigit = {
      [pattern1.join("")]: 1,
      [pattern2!.join("")]: 2,
      [pattern3.join("")]: 3,
      [pattern4.join("")]: 4,
      [pattern5.join("")]: 5,
      [pattern6!.join("")]: 6,
      [pattern7.join("")]: 7,
      [pattern8.join("")]: 8,
      [pattern9!.join("")]: 9,
      [pattern0!.join("")]: 0,
    }

    const numberStr = this.digits
      .map((patternStr) => patternStr.split("").sort().join(""))
      .map((patternStr) => patternToDigit[patternStr])
      .join("")

    return Number(numberStr)
  }
}

const transformStrToEntry = (rawInput: Readable | string) => {
  return (typeof rawInput === "string" ? of(rawInput) : from(rawInput)).pipe(
    mergeMap((str: Buffer | string) => {
      return str
        .toString()
        .split("\n")
        .filter((c) => !!c)
        .map((line) => {
          return new ReadEntry(line)
        })
    })
  )
}

const getDigitsNumbers = (str: Readable | string) => {
  return new Promise((resolve) => {
    let total = 0

    transformStrToEntry(str)
      .pipe(
        map((readEntry) => {
          total += readEntry.numberOfUniqueDigits()
        }),
        last()
      )
      .subscribe(() => {
        resolve(total)
      })
  })
}

const getSumOfOutputs = (str: Readable | string) => {
  return new Promise((resolve) => {
    let total = 0

    transformStrToEntry(str)
      .pipe(
        map((readEntry) => {
          total += readEntry.resolveDigitNumber()
        }),
        last()
      )
      .subscribe(() => {
        resolve(total)
      })
  })
}

/* istanbul ignore next */
const _test = process.env.NODE_ENV === "test" ? { ReadEntry } : null

export { getDigitsNumbers, getSumOfOutputs, _test }
