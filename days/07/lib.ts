type FuelCost = {
  fuel: number
  position: number
}

const getSortedCrabsFromStr = (crabsStr: string) => {
  return crabsStr
    .trim()
    .split(",")
    .map(Number)
    .sort((...[crabA, crabB]) => crabA - crabB)
}

const getOptimalFuelCost = (fuelCosts: FuelCost[]) => {
  fuelCosts.sort((...[fuelCostA, fuelCostB]) => fuelCostA.fuel - fuelCostB.fuel)

  return fuelCosts[0]
}

const getSimplePositionForAlignment = (crabsStr: string) => {
  const crabs = getSortedCrabsFromStr(crabsStr)
  const totalSum = crabs.reduce((...[acc, crab]) => acc + crab, 0)

  const boundMin = crabs[0]
  const { [crabs.length - 1]: boundMax } = crabs

  const fuelCosts: FuelCost[] = []

  for (let position = boundMin; position <= boundMax; position += 1) {
    const crabsIndex = crabs.findIndex((c) => c >= position)
    const crabsToTheRight = crabs.length - crabsIndex
    const crabsToTheLeft = crabsIndex
    const lastSumObj = fuelCosts[fuelCosts.length - 1] || {
      fuel: totalSum - (crabs[0] - 1) * crabs.length,
      position: position - 1,
    }

    const newSumObj = {
      fuel: lastSumObj.fuel - crabsToTheRight + crabsToTheLeft,
      position,
    }

    fuelCosts.push(newSumObj)
  }

  return getOptimalFuelCost(fuelCosts)
}

const getBestPositionForAlignment = (crabsStr: string) => {
  const crabs = getSortedCrabsFromStr(crabsStr)
  const boundMin = crabs[0]
  const { [crabs.length - 1]: boundMax } = crabs

  const precalculatedSums = Array.from({ length: boundMax + 1 }).reduce<
    number[]
  >((...[sumsArr, , itemIndex]) => {
    const previousSum = sumsArr[sumsArr.length - 1] || 0

    sumsArr.push(previousSum + itemIndex)

    return sumsArr
  }, [])

  const distancesToCrabs = crabs.map((c) => c - boundMin)

  const fuelCosts: FuelCost[] = []

  for (let position = boundMin; position <= boundMax; position += 1) {
    const { [fuelCosts.length - 1]: lastSumObj } = fuelCosts

    const newSumObj = (() => {
      // The first case
      if (!lastSumObj as unknown) {
        return {
          fuel: crabs.reduce((...[total, crab]) => {
            const toAdd = precalculatedSums[crab - boundMin] || 0

            return total + toAdd
          }, 0),
          position,
        }
      }

      const extraFuel = distancesToCrabs.reduce((...[total, crabDistance]) => {
        if (crabDistance < 0) {
          return total - crabDistance
        }

        return total - (crabDistance + 1)
      }, 0)

      return {
        fuel: lastSumObj.fuel + extraFuel,
        position,
      }
    })()

    fuelCosts.push(newSumObj)

    distancesToCrabs.forEach((...[, distanceIndex]) => {
      distancesToCrabs[distanceIndex] -= 1
    })
  }

  return getOptimalFuelCost(fuelCosts)
}

export { getSimplePositionForAlignment, getBestPositionForAlignment }
