import Graph from "node-dijkstra"

class Point {
  public x: number
  public y: number

  public constructor(...[x, y]: [number, number]) {
    this.x = x
    this.y = y
  }

  public static fromString(str: string) {
    const [x, y] = str.split(",").map((itemValue) => parseInt(itemValue, 10))

    return new Point(x, y)
  }

  public toString() {
    return `${this.x},${this.y}`
  }
}

class ChitonMap {
  private costsNode = new Graph()
  private costsArr: number[][]

  public constructor(mapStr: string) {
    this.costsArr = mapStr
      .trim()
      .split("\n")
      .map((line) => line.trim().split("").map(Number))

    this.populateCosts()
  }

  public expandCostsArr() {
    const newCostsArr: number[][] = []

    const multiple = 5
    const { length: maxX } = this.costsArr[0]
    const {
      costsArr: { length: maxY },
    } = this

    for (let y = 0; y < maxY * multiple; y += 1) {
      const newLine = []
      const toAddY = Math.floor(y / maxY)

      for (let x = 0; x < maxX * multiple; x += 1) {
        const toAddX = Math.floor(x / maxX)
        const {
          costsArr: {
            [y % maxY]: { [x % maxX]: originalValue },
          },
        } = this

        // From 9 it should go directly to 1 without passin through 0
        const newValue = (originalValue + toAddX + toAddY) % 9 || 9

        newLine.push(newValue)
      }

      newCostsArr.push(newLine)
    }

    this.costsArr = newCostsArr
    this.populateCosts()
  }

  public getCostsStr() {
    return this.costsArr.map((line) => line.join("")).join("\n")
  }

  public getLowestRisk() {
    const finishNode = new Point(
      this.costsArr[0].length - 1,
      this.costsArr.length - 1
    ).toString()
    const startNode = new Point(0, 0).toString()

    const shortestPath = this.costsNode.path(startNode, finishNode) as string[]

    return (
      shortestPath.reduce((...[total, nodeStr]) => {
        const point = Point.fromString(nodeStr)

        return total + this.costsArr[point.y][point.x]
      }, 0) - this.costsArr[0][0] // Remove the starting point
    )
  }

  private getAdjacentPoints(point: Point): Point[] {
    return ([] as Point[])
      .concat(point.x === 0 ? [] : [new Point(point.x - 1, point.y)])
      .concat(point.y === 0 ? [] : [new Point(point.x, point.y - 1)])
      .concat(
        point.x === this.costsArr[0].length - 1
          ? []
          : [new Point(point.x + 1, point.y)]
      )
      .concat(
        point.y === this.costsArr.length - 1
          ? []
          : [new Point(point.x, point.y + 1)]
      )
  }

  private populateCosts() {
    this.costsNode = new Graph()

    this.costsArr.forEach((...[costsLine, y]) => {
      costsLine.forEach((...[, x]) => {
        const pointCosts: Record<string, number> = {}
        const point = new Point(x, y)

        this.getAdjacentPoints(point).forEach((...[adjancetPoint]) => {
          pointCosts[adjancetPoint.toString()] =
            this.costsArr[adjancetPoint.y][adjancetPoint.x]
        })

        this.costsNode.addNode(point.toString(), pointCosts)
      })
    })
  }
}

export { ChitonMap }
