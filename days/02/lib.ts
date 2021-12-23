import { Observable, from, last, map, mergeMap, of } from "rxjs"
import { Readable } from "stream"

enum ActionType {
  Down = "down",
  Forward = "forward",
  Up = "up",
}

type Movement = [ActionType, number]

const transformInputLines = (lines: string): Movement[] =>
  lines
    .split("\n")
    .filter((v) => !!v)
    .map((line) => {
      const [action, valueStr] = line.split(" ")

      return [action, Number(valueStr)] as [ActionType, number]
    })

abstract class SubmarineBase {
  protected readonly position = {
    aim: 0,
    depth: 0,
    horizontal: 0,
  }

  public getPositionMultiplied() {
    return this.position.horizontal * this.position.depth
  }

  public completeMove(rawInput: Readable | string) {
    const movementsInput = (
      typeof rawInput === "string" ? of(rawInput) : from(rawInput)
    ).pipe(
      mergeMap((str: Buffer | string) => {
        return transformInputLines(str.toString())
      })
    )

    return new Promise((resolve) => {
      this.performMove(movementsInput).pipe(last()).subscribe(resolve)
    })
  }

  protected abstract performMove(
    movementsInput: Observable<Movement>
  ): Observable<void>
}

class WrongSubmarine extends SubmarineBase {
  protected performMove(
    movementsInput: Observable<Movement>
  ): Observable<void> {
    return movementsInput.pipe(
      map(([action, actionValue]) => {
        switch (action) {
          case ActionType.Up:
            this.position.depth -= actionValue
            break
          case ActionType.Down:
            this.position.depth += actionValue
            break
          case ActionType.Forward:
            this.position.horizontal += actionValue
            break
        }
      })
    )
  }
}

class CorrectSubmarine extends SubmarineBase {
  protected performMove(
    movementsInput: Observable<Movement>
  ): Observable<void> {
    return movementsInput.pipe(
      map(([action, actionValue]) => {
        switch (action) {
          case ActionType.Up:
            this.position.aim -= actionValue
            break
          case ActionType.Down:
            this.position.aim += actionValue
            break
          case ActionType.Forward:
            this.position.horizontal += actionValue
            this.position.depth += this.position.aim * actionValue
            break
        }
      })
    )
  }
}

export { CorrectSubmarine, WrongSubmarine }
