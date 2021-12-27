enum FoldType {
  Horizontal = "horizontal",
  Vertical = "vertical",
}

class Origami {
  private readonly points: Set<string>
  private readonly folds: Array<{ axis: FoldType; position: number }>

  public constructor(setupStr: string) {
    const [initialPointsStr, foldsStr] = setupStr.split("\n\n")
    const pointsArr = initialPointsStr.split("\n").filter((v) => !!v)

    this.points = new Set(pointsArr)

    this.folds = foldsStr
      .split("\n")
      .filter((v) => !!v)
      .map((line) => {
        const [axis, numStr] = line.replace("fold along ", "").split("=")

        return {
          axis: axis === "y" ? FoldType.Horizontal : FoldType.Vertical,
          position: Number(numStr),
        }
      })
  }

  public performAllFolds() {
    this.foldNTimes(this.folds.length)
  }

  public foldNTimes(foldsNumber: number) {
    const { folds, points } = this

    for (let foldIndex = 0; foldIndex < foldsNumber; foldIndex += 1) {
      const fold = folds.shift()!

      if (fold.axis === FoldType.Horizontal) {
        Array.from(points).forEach((pointStr) => {
          const point = pointStr.split(",").map(Number)

          if (point[1] > fold.position) {
            point[1] -= (point[1] - fold.position) * 2
            points.delete(pointStr)
            points.add(point.join(","))
          }
        })
      } else {
        Array.from(points).forEach((pointStr) => {
          const point = pointStr.split(",").map(Number)

          if (point[0] > fold.position) {
            point[0] -= (point[0] - fold.position) * 2
            points.delete(pointStr)
            points.add(point.join(","))
          }
        })
      }
    }
  }

  public getVisibleDots() {
    return this.points.size
  }

  public paintMap() {
    const { points } = this

    const minMax = Array.from(this.points).reduce(
      (...[acc, pointStr]) => {
        const point = pointStr.split(",").map(Number)

        acc[0][0] = Math.min(acc[0][0], point[0])
        acc[0][1] = Math.min(acc[0][1], point[1])
        acc[1][0] = Math.max(acc[1][0], point[0])
        acc[1][1] = Math.max(acc[1][1], point[1])

        return acc
      },
      [
        [0, 0],
        [0, 0],
      ]
    )

    const lines = []

    for (let y = minMax[0][1] - 1; y <= minMax[1][1] + 1; y += 1) {
      const line = []

      for (let x = minMax[0][0] - 1; x <= minMax[1][0] + 1; x += 1) {
        const point = [x, y].join(",")

        if (points.has(point)) {
          line.push("#")
        } else {
          line.push(".")
        }
      }

      lines.push(line.join(""))
    }

    return lines.join("\n")
  }
}

export { Origami }
