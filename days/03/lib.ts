import { Readable } from "node:stream"
import { Observable, from, last, map, mergeMap, of } from "rxjs"

const transformInputLines = (str: string) => {
  return str.split("\n").filter((v) => !!v)
}

type DiagnosticLine = string

class ReportCollector {
  private readonly state = {
    bitsDiffs: [] as number[],
    numsList: [] as string[],
  }

  public getNumsList() {
    return this.state.numsList.slice()
  }

  public getBitsDiffs() {
    return this.state.bitsDiffs.slice()
  }

  public getEpsilonRate() {
    const binaryNum = this.state.bitsDiffs
      .map((diff) => (diff > 0 ? 1 : 0))
      .join("")

    return parseInt(binaryNum, 2)
  }

  public getGammaRate() {
    const binaryNum = this.state.bitsDiffs
      .map((diff) => (diff < 0 ? 1 : 0))
      .join("")

    return parseInt(binaryNum, 2)
  }

  public addLine(line: string) {
    const {
      state: { bitsDiffs, numsList },
    } = this

    numsList.push(line)
    line.split("").forEach((...[bit, bitIndex]) => {
      const sum = bit === "1" ? 1 : -1

      bitsDiffs[bitIndex] = bitsDiffs[bitIndex] || 0
      bitsDiffs[bitIndex] += sum
    })
  }
}

class DiagnosticReport {
  private readonly report = new ReportCollector()

  public consumeAllInput(rawInput: Readable | string) {
    const input$ = (
      typeof rawInput === "string" ? of(rawInput) : from(rawInput)
    ).pipe(
      mergeMap((str: Buffer | string) => {
        return transformInputLines(str.toString())
      })
    )

    return new Promise((resolve) => {
      this.consumeInput(input$).pipe(last()).subscribe(resolve)
    })
  }

  public getPowerConsumption() {
    const epsilonRate = this.report.getEpsilonRate()
    const gammaRate = this.report.getGammaRate()

    return epsilonRate * gammaRate
  }

  public getLifeSupportRating() {
    try {
      const oxygenGeneratorRating = this.getOxygenGeneratorRating()
      const co2ScrubbrerRating = this.getCO2ScrubbrerRating()

      return oxygenGeneratorRating * co2ScrubbrerRating
    } catch {
      return -1
    }
  }

  private extractNumByFilteringCommon(
    conditionFn: (bitDiff: number) => "0" | "1"
  ) {
    let { report } = this

    let loopCounter = 0
    let bitPosition = 0

    while (report.getNumsList().length !== 1) {
      const numsList = report.getNumsList()
      const bitsDiffs = report.getBitsDiffs()

      const newNumsList = numsList.filter((numItem) => {
        const { [bitPosition]: bit } = numItem

        return bit === conditionFn(bitsDiffs[bitPosition])
      })

      report = new ReportCollector()

      newNumsList.forEach((line) => {
        report.addLine(line)
      })

      bitPosition += 1
      loopCounter += 1

      if (loopCounter > 100_000) {
        throw new Error("Infinite loop detected")
      }
    }

    const binaryNum = report.getNumsList()[0]

    return parseInt(binaryNum, 2)
  }

  private getOxygenGeneratorRating() {
    return this.extractNumByFilteringCommon((bitDiff) => {
      return bitDiff >= 0 ? "1" : "0"
    })
  }

  private getCO2ScrubbrerRating() {
    return this.extractNumByFilteringCommon((bitDiff) => {
      return bitDiff >= 0 ? "0" : "1"
    })
  }

  private consumeInput(input$: Observable<DiagnosticLine>) {
    return input$.pipe(
      map((line: DiagnosticLine) => {
        this.report.addLine(line)
      })
    )
  }
}

export { DiagnosticReport }
