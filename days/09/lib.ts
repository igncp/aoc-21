class Point {
  public x: number
  public y: number

  public constructor({ x, y }: { x: number; y: number }) {
    this.x = x
    this.y = y
  }

  public static fromId(id: string): Point {
    const [x, y] = id.split(",").map(Number)

    return new Point({ x, y })
  }

  public getId(): string {
    return `${this.x},${this.y}`
  }
}

class HeightMap {
  private readonly rows: number[][]

  public constructor(heightmap: string) {
    this.rows = heightmap
      .split("\n")
      .filter((v) => !!v)
      .map((line) => line.split("").map(Number))
  }

  public getTotalRiskLevel() {
    const { rows } = this
    const lowPoints = this.getLowPoints()

    return lowPoints.reduce((...[total, lowPoint]) => {
      return total + rows[lowPoint.y][lowPoint.x] + 1
    }, 0)
  }

  public getBasins() {
    const lowPoints = this.getLowPoints()

    return lowPoints
      .map((lowPoint) => {
        const basinPoints = new Set<string>()
        const pointsToAdd = new Set<string>()

        basinPoints.add(lowPoint.getId())

        const isPointFromBasin = ({
          point,
          sourcePoint,
        }: {
          point: Point
          sourcePoint: Point
        }) => {
          const pointValue = this.getPointValue(point)
          const sourcePointValue = this.getPointValue(sourcePoint)

          return (
            !basinPoints.has(point.getId()) &&
            pointValue > sourcePointValue &&
            pointValue !== 9
          )
        }

        this.getSurroundingCells(lowPoint).forEach((point) => {
          if (isPointFromBasin({ point, sourcePoint: lowPoint })) {
            pointsToAdd.add(point.getId())
          }
        })

        while (pointsToAdd.size > 0) {
          const pointToCheckId = Array.from(pointsToAdd).pop() as string
          const pointToAdd = Point.fromId(pointToCheckId)

          basinPoints.add(pointToCheckId)
          pointsToAdd.delete(pointToCheckId)

          this.getSurroundingCells(pointToAdd).forEach((surroundingPoint) => {
            if (
              isPointFromBasin({
                point: surroundingPoint,
                sourcePoint: pointToAdd,
              })
            ) {
              pointsToAdd.add(surroundingPoint.getId())
            }
          })
        }

        return { size: basinPoints.size }
      })
      .sort((...[basinA, basinB]) => basinB.size - basinA.size)
  }

  private getPointValue(point: Point) {
    return this.rows[point.y][point.x]
  }

  private getSurroundingCells(point: Point): Point[] {
    const { rows } = this

    return ([] as Point[])
      .concat(point.x === 0 ? [] : [new Point({ x: point.x - 1, y: point.y })])
      .concat(point.y === 0 ? [] : [new Point({ x: point.x, y: point.y - 1 })])
      .concat(
        point.x === rows[0].length - 1
          ? []
          : [new Point({ x: point.x + 1, y: point.y })]
      )
      .concat(
        point.y === rows.length - 1
          ? []
          : [new Point({ x: point.x, y: point.y + 1 })]
      )
  }

  private getLowPoints(): Point[] {
    const { rows } = this

    return rows.reduce<Point[]>((...[total, row, rowIndex]) => {
      return total.concat(
        row.reduce<Point[]>((...[total2, cell, columnIndex]) => {
          const surroundingCellsValues = this.getSurroundingCells(
            new Point({
              x: columnIndex,
              y: rowIndex,
            })
          ).map((point) => this.getPointValue(point))

          const isLowPoint = surroundingCellsValues.every(
            (surroundingCell) => surroundingCell > cell
          )

          return total2.concat(
            isLowPoint ? [new Point({ x: columnIndex, y: rowIndex })] : []
          )
        }, [])
      )
    }, [])
  }
}

export { HeightMap }
