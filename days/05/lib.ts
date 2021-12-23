import { Readable } from "node:stream"
import { Observable, from, last, map, mergeMap, of } from "rxjs"

type Point = { x: number; y: number }
type Vent = Point[]

const transformInputLines = (ventsLines: string) => {
  return ventsLines
    .split("\n")
    .filter((v) => !!v)
    .map((ventLine) => {
      return ventLine.split("->").map((pointStr) => {
        const [x, y] = pointStr.split(",").map(Number)

        return { x, y }
      })
    })
}

const getAllPointsBetweenTwo = ({
  fromPoint,
  onlyStraightLines,
  toPoint,
}: {
  fromPoint: Point
  onlyStraightLines: boolean
  toPoint: Point
}): Point[] => {
  const buildPoints = () => {
    const diffX = toPoint.x - fromPoint.x
    const diffY = toPoint.y - fromPoint.y

    return Array.from({
      length: 1 + (Math.abs(diffX) || Math.abs(diffY)),
    }).map((...[, pointIndex]) => {
      return {
        x:
          fromPoint.x +
          pointIndex * (diffX > 0 ? 1 : -1) * (diffX === 0 ? 0 : 1),
        y:
          fromPoint.y +
          pointIndex * (diffY > 0 ? 1 : -1) * (diffY === 0 ? 0 : 1),
      }
    })
  }

  if (fromPoint.x === toPoint.x || fromPoint.y === toPoint.y) {
    return buildPoints()
  }

  if (onlyStraightLines) {
    return []
  }

  const diffX = Math.abs(fromPoint.x - toPoint.x)

  if (diffX !== Math.abs(fromPoint.y - toPoint.y)) {
    throw new Error("Unexpected lines")
  }

  return buildPoints()
}

class VentsMap {
  private readonly input$: Observable<Vent>
  private readonly ventsMap: { [point: string]: number } = {}

  private constructor(input$: VentsMap["input$"]) {
    this.input$ = input$
  }

  public static fromString(rawInput: Readable | string) {
    const input$ = (
      typeof rawInput === "string" ? of(rawInput) : from(rawInput)
    ).pipe(
      mergeMap((str: Buffer | string) => {
        return transformInputLines(str.toString())
      })
    )

    return new VentsMap(input$)
  }

  public getOverlappingPoints(opts: {
    onlyStraightLines: boolean
  }): Promise<string[]> {
    return new Promise((...[resolve, reject]) => {
      this.input$
        .pipe(
          map(([fromPoint, toPoint]) => {
            const pointsBetween = getAllPointsBetweenTwo({
              fromPoint,
              onlyStraightLines: opts.onlyStraightLines,
              toPoint,
            })

            pointsBetween.forEach((point) => {
              this.ventsMap[`${point.x},${point.y}`] =
                (this.ventsMap[`${point.x},${point.y}`] || 0) + 1
            })
          }),
          last()
        )
        .subscribe({
          error: reject,
          next: () => {
            const overlappingPoints = Object.keys(this.ventsMap).filter(
              (pointId) => {
                return this.ventsMap[pointId] > 1
              }
            )

            resolve(overlappingPoints)
          },
        })
    })
  }
}

export { VentsMap }
