type Point = [number, number, number]
type OverlappingPoint = { pointA: Point; pointB: Point }

class ScannerReport {
  private readonly distances: Map<string, number>
  private readonly points: Point[]

  public constructor() {
    this.distances = new Map()
    this.points = []
  }

  public addPoint(point: Point): void {
    this.points.push(point)
  }

  public getPoints() {
    return this.points.slice()
  }

  public setDistances() {
    const { points } = this

    for (let pointAIdx = 0; pointAIdx < points.length; pointAIdx += 1) {
      const { [pointAIdx]: pointA } = points

      for (
        let pointBIdx = pointAIdx + 1;
        pointBIdx < points.length;
        pointBIdx += 1
      ) {
        const { [pointBIdx]: pointB } = points

        this.distances.set(
          `${pointAIdx},${pointBIdx}`,
          Math.abs(pointA[0] - pointB[0]) +
            Math.abs(pointA[1] - pointB[1]) +
            Math.abs(pointA[2] - pointB[2])
        )
      }
    }
  }

  public getPointDistances(pointAIndex: number) {
    const { distances } = this

    return this.points
      .map((...[, pointBIndex]) => {
        if (pointAIndex === pointBIndex) {
          return 0
        }

        const sortedIndexes =
          pointAIndex < pointBIndex
            ? [pointAIndex, pointBIndex]
            : [pointBIndex, pointAIndex]

        return distances.get(`${sortedIndexes[0]},${sortedIndexes[1]}`)
      })
      .filter((distance) => distance !== 0)
  }
}

class ScannersReport {
  private readonly reports: ScannerReport[]

  public constructor(reportString: string) {
    const parsedReports: ScannerReport[] = []

    reportString.split("\n").forEach((line) => {
      if (!line.trim()) {
        return
      }

      if (line.startsWith("---")) {
        const scannerReport: ScannerReport = new ScannerReport()

        parsedReports.push(scannerReport)

        return
      }

      const { [parsedReports.length - 1]: lastReport } = parsedReports

      if (!lastReport as unknown) {
        throw new Error("Invalid report string")
      }

      const point = line
        .split(",")
        .map((pointCoord) => parseInt(pointCoord, 10)) as Point

      lastReport.addPoint(point)
    })

    parsedReports.forEach((report) => {
      report.setDistances()
    })

    this.reports = parsedReports
  }

  public getOverlappingPoints(reportsIndexPairs: [number, number]) {
    const [reportA, reportB] = [
      this.reports[reportsIndexPairs[0]],
      this.reports[reportsIndexPairs[1]],
    ]

    const overlappingPoints: OverlappingPoint[] = []

    reportA.getPoints().forEach((...[pointA, pointIndexA]) => {
      const distancesA = reportA.getPointDistances(pointIndexA)

      reportB.getPoints().forEach((...[pointB, pointIndexB]) => {
        const distancesB = reportB.getPointDistances(pointIndexB)

        const commonDistances = distancesA.reduce<number>(
          (...[acc, distanceA]) => {
            return acc + (distancesB.includes(distanceA) ? 1 : 0)
          },
          0
        )

        // At least 12 points need to overlap between two scanners
        if (commonDistances >= 11) {
          overlappingPoints.push({ pointA, pointB })
        }
      })
    })

    return overlappingPoints
  }

  public getBeaconsNumber() {
    const { reports } = this
    const reportsMatches: Array<{
      from: number
      points: OverlappingPoint[]
      to: number
    }> = []

    const matchedReports: number[] = [0]
    let matchedReportsPointer = -1

    while (true) {
      matchedReportsPointer += 1

      const { [matchedReportsPointer]: currentReportIndex } = matchedReports

      reports.forEach((...[, reportIndex]) => {
        if (
          reportIndex === currentReportIndex ||
          matchedReports.includes(reportIndex)
        ) {
          return
        }

        const overlappingPoints = this.getOverlappingPoints([
          currentReportIndex,
          reportIndex,
        ])

        if (overlappingPoints.length > 11) {
          matchedReports.push(reportIndex)
          reportsMatches.push({
            from: currentReportIndex,
            points: overlappingPoints,
            to: reportIndex,
          })
        }
      })

      if (
        matchedReports.length === reports.length ||
        matchedReportsPointer === reports.length // this case would be an error
      ) {
        break
      }
    }

    if (matchedReports.length < reports.length) {
      throw new Error("Invalid report string")
    }

    return reportsMatches.reduce((...[total, reportMatch]) => {
      // TODO: transform points and filter out the ones already counted
      const { length: newPoints } = reports[reportMatch.to].getPoints()

      return total + newPoints
    }, reports[0].getPoints().length)
  }

  public toJSON(): ScannerReport[] {
    return this.reports
  }
}

export { ScannersReport }
