import {
  Observable,
  from,
  last,
  map,
  mergeMap,
  of,
  pairwise,
  reduce,
  scan,
} from "rxjs"
import { Readable } from "stream"

const transformInputLines = (lines: string) =>
  lines
    .split("\n")
    .filter((v) => !!v.trim())
    .map((v) => Number(v))

const getSumOfArr = (numsArray: number[]) =>
  numsArray.reduce((...[numA, numB]) => numA + numB, 0)

type IncreasesOpts = {
  groupedMeasurements: number
}

export class OceanScanner {
  private readonly input$: Observable<number>

  private constructor(input: Observable<number>) {
    this.input$ = input
  }

  public static fromString(str: string) {
    const input = of(...transformInputLines(str))

    return new OceanScanner(input)
  }

  public static fromReadableStream(stream: Readable) {
    const input = from(stream).pipe(
      mergeMap((str: Buffer | string) => {
        return transformInputLines(str.toString())
      })
    )

    return new OceanScanner(input)
  }

  public scanDepthIncreases({ groupedMeasurements }: IncreasesOpts) {
    return this.input$.pipe(
      scan((...[group, newValue]) => {
        const newGroup = [newValue, ...group]

        if (newGroup.length > groupedMeasurements) {
          newGroup.pop()
        }

        return newGroup
      }, [] as number[]),
      pairwise(),
      map(([previousValue, currentValue]) => {
        // Only compare sums when both lists are full
        if (
          previousValue.length !== currentValue.length ||
          previousValue.length < groupedMeasurements
        ) {
          return 0
        }

        return getSumOfArr(currentValue) > getSumOfArr(previousValue) ? 1 : 0
      }),
      reduce((...[total, sum]) => total + sum, 0)
    )
  }

  public getFinalDepthIncreases(opts: IncreasesOpts): Promise<number> {
    return new Promise((resolve) => {
      this.scanDepthIncreases(opts).pipe(last()).subscribe(resolve)
    })
  }
}
