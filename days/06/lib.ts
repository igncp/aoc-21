const DAYS_CYCLE_OLD_LANTERNFISH = 7
const DAYS_CYCLE_NEW_LANTERNFISH = 9

const maxDays = Math.max(DAYS_CYCLE_NEW_LANTERNFISH, DAYS_CYCLE_OLD_LANTERNFISH)

class LanternfishPopulation {
  private readonly orderedState: number[]

  // Array of 'maxDays' number of items. The index is the number of days left.
  // The items are rotated to the left each day, and the items in 0 are moved
  // to the DAYS_CYCLE_OLD_LANTERNFISH day plus to the
  // DAYS_CYCLE_NEW_LANTERNFISH day
  private readonly unorderedState: number[]

  public constructor(initialState: string) {
    this.orderedState = initialState
      .split(",")
      .filter((v) => !!v)
      .map(Number)

    this.unorderedState = this.orderedState.reduce(
      (...[acc, daysRemaining]) => {
        acc[daysRemaining] += 1

        return acc
      },
      Array.from({
        length: maxDays,
      }).map(() => 0)
    )
  }

  public getStateAfter(days: number) {
    Array.from({ length: days }).forEach(() => {
      const newLanternfish: number[] = []

      this.orderedState.forEach((...[, stateIndex]) => {
        this.orderedState[stateIndex] -= 1

        if (this.orderedState[stateIndex] < 0) {
          newLanternfish.push(8)
          this.orderedState[stateIndex] = 6
        }
      })

      this.orderedState.push(...newLanternfish)
    })

    return this.orderedState.join(",")
  }

  public getTotalAfter(days: number) {
    Array.from({ length: days }).forEach(() => {
      const newUnorderedState: number[] = []

      this.unorderedState.forEach((...[, stateOppositeIndex]) => {
        const daysIndex = maxDays - stateOppositeIndex - 1

        newUnorderedState[daysIndex] = this.unorderedState[daysIndex + 1] || 0
      })
      ;[DAYS_CYCLE_NEW_LANTERNFISH, DAYS_CYCLE_OLD_LANTERNFISH].forEach(
        (cycleDays) => {
          newUnorderedState[cycleDays - 1] += this.unorderedState[0]
        }
      )

      newUnorderedState.forEach((...[daysValue, daysIndex]) => {
        this.unorderedState[daysIndex] = daysValue
      })
    })

    return this.unorderedState.reduce((...[acc, lanternfishNum]) => {
      return acc + lanternfishNum
    }, 0)
  }
}

export { LanternfishPopulation }
