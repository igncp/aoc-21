class Polymer {
  private chain: string
  private chainCouples: Record<string, number>
  private chainLetters: Record<string, number>
  private readonly rulesMap: Record<string, string[] | undefined>

  public constructor(polymerStr: string) {
    const [initialChain, growRules] = polymerStr.split("\n\n")

    this.chainLetters = {}
    this.chainCouples = {}
    this.chain = initialChain.trim()

    initialChain
      .trim()
      .split("")
      .forEach((...[chainLetter, chainLetterIndex, chainArr]) => {
        this.chainLetters[chainLetter] =
          (this.chainLetters[chainLetter] || 0) + 1

        const couple = chainLetter + (chainArr[chainLetterIndex + 1] || "")

        if (couple.length !== 2) {
          return
        }

        this.chainCouples[couple] = (this.chainCouples[couple] || 0) + 1
      })

    this.rulesMap = growRules
      .split("\n")
      .filter((v) => !!v)
      .reduce<Polymer["rulesMap"]>((...[rulesMap, rule]) => {
        const [left, right] = rule.split(" -> ")

        if (rulesMap[left]) {
          throw new Error(`Duplicate rule: ${left}`)
        }

        const [coupleLeft, coupleRight] = left.split("")

        rulesMap[left] = [right, coupleLeft + right, right + coupleRight]

        return rulesMap
      }, {})
  }

  public growNStepsWithoutOrder(steps: number) {
    this.chain = ""

    const { rulesMap } = this

    for (let step = 0; step < steps; step += 1) {
      const newChainCouples = { ...this.chainCouples }
      const newChainLetters = { ...this.chainLetters }

      Object.keys(newChainCouples).forEach((couple) => {
        const {
          chainCouples: { [couple]: couplesNum },
        } = this

        if (rulesMap[couple]) {
          const [letter, coupleA, coupleB] = rulesMap[couple]!

          newChainCouples[coupleA] = newChainCouples[coupleA] || 0
          newChainCouples[coupleB] = newChainCouples[coupleB] || 0
          newChainLetters[letter] = newChainLetters[letter] || 0

          newChainCouples[coupleA] += couplesNum
          newChainCouples[coupleB] += couplesNum
          newChainCouples[couple] -= couplesNum
          newChainLetters[letter] += couplesNum
        }
      })

      this.chainLetters = newChainLetters
      this.chainCouples = newChainCouples
    }
  }

  public getChainLettersDiffWithoutOrder() {
    const sumsArr = Object.entries(this.chainLetters)
      .map(([letter, count]) => ({
        count,
        letter,
      }))
      .sort((...[sumA, sumB]) => sumA.count - sumB.count)

    return sumsArr[sumsArr.length - 1].count - sumsArr[0].count
  }

  public growNSteps(steps: number) {
    for (let step = 0; step < steps; step += 1) {
      let { chain: newChain } = this

      for (let chainIndex = 0; chainIndex < newChain.length; chainIndex += 1) {
        const couple = newChain[chainIndex] + (newChain[chainIndex + 1] || "")

        const {
          rulesMap: { [couple]: newItem },
        } = this

        if (newItem) {
          newChain =
            newChain.slice(0, chainIndex + 1) +
            newItem[0] +
            newChain.slice(chainIndex + 1)
          chainIndex += 1
        }
      }

      this.chain = newChain
    }
  }

  public getChainLettersDiff() {
    const sumsObj = this.chain
      .split("")
      .reduce<Record<string, number>>((...[chainSum, letter]) => {
        chainSum[letter] = (chainSum[letter] || 0) + 1

        return chainSum
      }, {})
    const sumsArr = Object.entries(sumsObj)
      .map(([letter, count]) => ({
        count,
        letter,
      }))
      .sort((...[sumA, sumB]) => sumA.count - sumB.count)

    return sumsArr[sumsArr.length - 1].count - sumsArr[0].count
  }

  public getChain() {
    return this.chain
  }
}

export { Polymer }
