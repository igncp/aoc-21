import { Observable, map, of, takeWhile } from "rxjs"

const sideSize = 5

class BingoBoard {
  private rows: number[][] = []
  private columns: number[][] = []
  private lastNumber = -1

  private readonly id: number

  public constructor({ id, lines }: { id: BingoBoard["id"]; lines: string[] }) {
    this.id = id
    lines.forEach((...[line, rowIndex]) => {
      const numbers = line
        .split(" ")
        .filter((v) => !!v)
        .map(Number)

      numbers.forEach((...[numberItem, columnIndex]) => {
        this.rows[rowIndex] = this.rows[rowIndex] || []
        this.rows[rowIndex].push(numberItem)

        this.columns[columnIndex] = this.columns[columnIndex] || []
        this.columns[columnIndex].push(numberItem)
      })
    })
  }

  public getId() {
    return this.id
  }

  public markNumber(numberItem: number) {
    this.lastNumber = numberItem
    this.rows = this.rows.map((row) =>
      row.filter((cell) => cell !== numberItem)
    )
    this.columns = this.columns.map((column) =>
      column.filter((cell) => cell !== numberItem)
    )
  }

  public hasBingo() {
    return (
      this.rows.some((row) => row.length === 0) ||
      this.columns.some((column) => column.length === 0)
    )
  }

  public getScore() {
    const unmarkedSum = this.columns.reduce((...[total, column]) => {
      return (
        total +
        column.reduce((...[total2, cell]) => {
          return total2 + cell
        }, 0)
      )
    }, 0)

    return unmarkedSum * this.lastNumber
  }
}

type GameResult = {
  boardIndex: number
  numberIndex: number
  score: number
  winningNumber: number
}

class Bingo {
  private readonly numbersInput$: Observable<{
    numberIndex: number
    numberValue: number
  }>

  private readonly boardsPlaying: BingoBoard[]
  private readonly boardsFinished: BingoBoard[] = []
  private readonly gameResults: GameResult[] = []

  private constructor(opts: {
    boards: BingoBoard[]
    numbersInput$: Observable<number>
  }) {
    this.numbersInput$ = opts.numbersInput$.pipe(
      map((...[numberValue, numberIndex]) => ({
        numberIndex,
        numberValue,
      }))
    )
    this.boardsPlaying = opts.boards
  }

  public static fromFixedString(game: string) {
    const [numbers, ...restLines] = game.trim().split("\n")
    const boards = restLines
      .filter((line) => !!line.trim())
      .reduce<string[][]>((...[acc, line]) => {
        const { [acc.length - 1]: lastBoard } = acc

        if (!(lastBoard as unknown) || lastBoard.length === sideSize) {
          const newBoard = [line]

          acc.push(newBoard)
        } else {
          lastBoard.push(line)
        }

        return acc
      }, [])
      .map(
        (...[boardLines, boardIndex]) =>
          new BingoBoard({
            id: boardIndex,
            lines: boardLines,
          })
      )

    return new Bingo({
      boards,
      numbersInput$: of(
        ...numbers
          .split(",")
          .filter((v) => !!v)
          .map(Number)
      ),
    })
  }

  public getGameResults(): Promise<GameResult[]> {
    return new Promise((resolve) => {
      this.numbersInput$
        .pipe(takeWhile(() => this.boardsPlaying.length !== 0))
        .subscribe(({ numberIndex, numberValue }) => {
          this.boardsPlaying.forEach((board) => {
            board.markNumber(numberValue)
          })

          const winningBoards = this.boardsPlaying.filter((board) =>
            board.hasBingo()
          )

          winningBoards.forEach((winningBoard) => {
            const boardIndex = this.boardsPlaying.findIndex(
              (board) => board === winningBoard
            )

            this.boardsPlaying.splice(boardIndex, 1)
            this.boardsFinished.push(winningBoard)

            const gameResult: GameResult = {
              boardIndex: winningBoard.getId(),
              numberIndex,
              score: winningBoard.getScore(),
              winningNumber: numberValue,
            }

            this.gameResults.push(gameResult)
          })

          if (this.boardsPlaying.length === 0) {
            resolve(this.gameResults)
          }
        })
    })
  }
}

export { Bingo }
