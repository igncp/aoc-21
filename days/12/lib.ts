type Links = Record<string, string[] | undefined>

const startNode = "start"
const endNode = "end"
const isSmallCave = (node: string) => /[a-z]/.test(node[0])

const getPathsNumber = ({
  graphStr,
  smallCavesMaxVisits,
}: {
  graphStr: string
  smallCavesMaxVisits: number
}) => {
  const links = graphStr
    .split("\n")
    .filter((v) => !!v)
    .reduce<Links>((...[linksObj, linkStr]) => {
      const [from, to] = linkStr.split("-")

      linksObj[from] = (linksObj[from] ?? []).concat(to)
      linksObj[to] = (linksObj[to] ?? []).concat(from)

      return linksObj
    }, {})

  const paths = new Set()
  const onGoingPaths = [[startNode]]

  while (onGoingPaths.length) {
    const path = onGoingPaths.pop()!
    const { [path.length - 1]: lastNode } = path
    const smallCavesMap: { [key: string]: number | undefined } = {}

    for (let position = 0; position < path.length; position += 1) {
      if (isSmallCave(path[position])) {
        smallCavesMap[path[position]] = (smallCavesMap[path[position]] ?? 0) + 1
      }
    }

    const hasMaxedVisits = !!Object.keys(smallCavesMap).find((smallCave) => {
      return smallCavesMap[smallCave]! >= smallCavesMaxVisits
    })

    const nextNodes = links[lastNode]!.filter((possibleNextNode) => {
      if (possibleNextNode === startNode) {
        return false
      }

      return (
        possibleNextNode === endNode ||
        !smallCavesMap[possibleNextNode] ||
        !isSmallCave(possibleNextNode) ||
        !hasMaxedVisits
      )
    })

    nextNodes.forEach((nextNode) => {
      const newPath = path.concat([nextNode])

      if (nextNode === endNode) {
        paths.add(newPath.join(","))

        return
      }

      onGoingPaths.push(newPath)
    })
  }

  return paths.size
}

export { getPathsNumber }
