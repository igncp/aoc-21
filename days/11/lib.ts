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

class OctopusPond {
  private readonly octopusesMap: number[][]

  public constructor(mapStr: string) {
    this.octopusesMap = mapStr
      .split("\n")
      .filter((v) => !!v)
      .map((row) => row.split("").map((c) => parseInt(c, 10)))
  }

  public getFlashesCountAfterSteps(stepsNum: number) {
    const { octopusesMap } = this
    let flashes = 0

    for (let stepIndex = 0; stepIndex < stepsNum; stepIndex += 1) {
      const flashesToProcess = new Set<string>()
      const processedFlashes = new Set<string>()

      octopusesMap.forEach((...[row, rowIndex]) => {
        row.forEach((...[, columnIndex]) => {
          octopusesMap[rowIndex][columnIndex] += 1

          if (octopusesMap[rowIndex][columnIndex] === 10) {
            const point = new Point({ x: columnIndex, y: rowIndex })

            flashesToProcess.add(point.getId())
            octopusesMap[rowIndex][columnIndex] = 0
          }
        })
      })

      while (flashesToProcess.size) {
        const processedFlash = Array.from(flashesToProcess).pop()!
        const processedPoint = Point.fromId(processedFlash)

        flashesToProcess.delete(processedFlash)
        processedFlashes.add(processedFlash)

        this.getAdjancentPoints(processedPoint).forEach((point) => {
          if (
            !processedFlashes.has(point.getId()) &&
            !flashesToProcess.has(point.getId())
          ) {
            octopusesMap[point.y][point.x] += 1
          }

          if (octopusesMap[point.y][point.x] === 10) {
            octopusesMap[point.y][point.x] = 0

            const pointId = point.getId()

            if (!processedFlashes.has(pointId)) {
              flashesToProcess.add(pointId)
            }
          }
        })
      }

      flashes += processedFlashes.size
    }

    return flashes
  }

  public getStepsWhenAllFlash() {
    let steps = 0
    const cellsLength = this.octopusesMap.length * this.octopusesMap[0].length

    while (true) {
      steps += 1

      const flashesCount = this.getFlashesCountAfterSteps(1)

      if (flashesCount === cellsLength) {
        return steps
      }
    }
  }

  private getAdjancentPoints(point: Point): Point[] {
    const { octopusesMap: rows } = this

    return ([] as Point[])
      .concat(
        point.x === 0 || point.y === 0
          ? []
          : [new Point({ x: point.x - 1, y: point.y - 1 })]
      )
      .concat(
        point.x === 0 || point.y === rows.length - 1
          ? []
          : [new Point({ x: point.x - 1, y: point.y + 1 })]
      )
      .concat(
        point.x === rows.length - 1 || point.y === 0
          ? []
          : [new Point({ x: point.x + 1, y: point.y - 1 })]
      )
      .concat(
        point.x === rows.length - 1 || point.y === rows.length - 1
          ? []
          : [new Point({ x: point.x + 1, y: point.y + 1 })]
      )
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
}

export { OctopusPond }
