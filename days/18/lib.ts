type RecursiveArray<T> = Array<RecursiveArray<T>> | T
type RecursiveNumArray = RecursiveArray<number>

type BaseNode = {
  depth: number
  id: number
  leaf?: number
  parent: BaseNode["id"] | null
  path: number[]
}
type TreeNode = BaseNode & {
  children?: Array<TreeNode["id"]>
}
type TreeNodeFull = BaseNode & {
  children?: TreeNodeFull[]
}

type Tree = {
  [key: TreeNode["id"]]: TreeNode
}

enum Side {
  Left = "left",
  Right = "right",
}

class SnailfishNumber {
  private readonly tree: Tree

  public constructor(numDefinition: Tree | string) {
    this.tree =
      typeof numDefinition === "string"
        ? SnailfishNumber.fromString(numDefinition)
        : numDefinition
  }

  public static sumAll(list: string): SnailfishNumber {
    const snailfishList = list
      .split("\n")
      .filter((line) => !!line.trim())
      .map((line) => new SnailfishNumber(line))

    return snailfishList
      .slice(1)
      .reduce((...[accNumberSnailfish, snailfishNumber]) => {
        const newNumber = accNumberSnailfish.add(snailfishNumber)

        newNumber.reduce()

        return newNumber
      }, snailfishList[0])
  }

  public static getHighestMagnitude(list: string): number {
    const snailfishList = list
      .split("\n")
      .filter((line) => !!line.trim())
      .map((line) => new SnailfishNumber(line))

    let maxMagnitude = 0

    snailfishList.forEach((...[numberA, numberAIndex]) => {
      snailfishList.forEach((...[numberB, numberBIndex]) => {
        if (numberAIndex === numberBIndex) {
          return
        }

        const newNumber = numberA.add(numberB)

        newNumber.reduce()

        const newMagnitude = newNumber.getMagnitude()

        if (maxMagnitude < newMagnitude) {
          maxMagnitude = newMagnitude
        }
      })
    })

    return maxMagnitude
  }

  private static fromString(numDefinition: string): Tree {
    const numsArray: RecursiveNumArray = JSON.parse(numDefinition)
    let currentId = 0

    const recursiveFn = ({
      depth,
      nodeArr,
      parentId,
      path,
    }: {
      depth: number
      nodeArr: RecursiveNumArray | number
      parentId: TreeNode["id"] | null
      path: number[]
    }): TreeNodeFull => {
      currentId += 1

      const id = currentId

      return {
        depth,
        id: currentId,
        parent: parentId,
        path,
        ...(Array.isArray(nodeArr)
          ? {
              children: nodeArr.map((...[subItem, subItemIndex]) =>
                recursiveFn({
                  depth: depth + 1,
                  nodeArr: subItem,
                  parentId: id,
                  path: path.concat(subItemIndex),
                })
              ),
            }
          : { leaf: nodeArr }),
      }
    }

    const fullTree = recursiveFn({
      depth: 0,
      nodeArr: numsArray,
      parentId: null,
      path: [],
    })

    const recursiveReduce = (...[tree, nodeFull]: [Tree, TreeNodeFull]) => {
      const node: TreeNode =
        "children" in nodeFull
          ? ({
              ...nodeFull,
              children: nodeFull.children!.map((c) => c.id),
            } as TreeNode)
          : ({ ...nodeFull } as TreeNode)

      if ("children" in nodeFull) {
        nodeFull.children!.forEach((c) => {
          recursiveReduce(tree, c)
        })
      }

      tree[node.id] = node

      return tree
    }

    const tree = [fullTree].reduce<Tree>(recursiveReduce, {})

    return tree
  }

  public add(otherNum: SnailfishNumber): SnailfishNumber {
    const maxId = this.getMaxId() + 2 // +1 will be the new root
    const rootNode = this.getRootNode()
    const rootNodeOther = otherNum.getRootNode()
    const thisTree = Object.keys(this.tree).reduce(
      (...[thisTreeAcc, thisTreeKey]: [Tree, string]) => {
        const numKey = Number(thisTreeKey)

        const newNode = {
          ...this.tree[numKey],
        }

        thisTreeAcc[numKey] = newNode
        newNode.path = newNode.path.slice()
        newNode.path.unshift(0)

        return thisTreeAcc
      },
      {}
    )
    const otherTree = Object.keys(otherNum.tree).reduce<Tree>(
      (...[otherTreeAcc, otherTreeKey]: [Tree, string]) => {
        const numKey = Number(otherTreeKey)

        const newId = numKey + maxId
        const newNode = {
          ...otherNum.tree[numKey],
          id: newId,
        }

        otherTreeAcc[newId] = newNode
        newNode.path = newNode.path.slice()
        newNode.path.unshift(1)
        newNode.parent = newNode.parent ? newNode.parent + maxId : null

        if ("children" in newNode) {
          newNode.children = newNode.children!.map((c) => c + maxId)
        }

        return otherTreeAcc
      },
      {}
    )

    const newTree = { ...thisTree, ...otherTree }

    Object.keys(newTree).forEach((newTreeKey) => {
      const numKey = Number(newTreeKey)

      newTree[numKey] = {
        ...newTree[numKey],
        depth: newTree[numKey].depth + 1,
      }
    })

    const newRootId = maxId - 1
    const newRootOtherId = rootNodeOther.id + maxId

    newTree[newRootId] = {
      children: [rootNode.id, newRootOtherId],
      depth: 0,
      id: newRootId,
      parent: null,
      path: [],
    }

    newTree[rootNode.id] = { ...newTree[rootNode.id], parent: newRootId }
    newTree[newRootOtherId] = { ...newTree[newRootOtherId], parent: newRootId }

    return new SnailfishNumber(newTree)
  }

  public getMagnitude() {
    const rootNode = this.getRootNode()

    const recursiveReduce = (node: TreeNode): number => {
      if ("children" in node) {
        return node.children!.reduce((...[subAcc, childId, childIndex]) => {
          const {
            tree: { [childId]: child },
          } = this

          const childVal = recursiveReduce(child)

          return subAcc + (childIndex === 0 ? childVal * 3 : childVal * 2)
        }, 0)
      }

      return node.leaf!
    }

    return recursiveReduce(rootNode)
  }

  public explode() {
    const nodeId = Object.keys(this.tree)
      .filter((treeKey) => {
        const numKey = Number(treeKey)

        return this.tree[numKey].depth >= 4 && !!this.tree[numKey].children
      })
      .sort(this.sortByPath)[0]

    if (!nodeId) {
      return false
    }

    const nodeIdNum = Number(nodeId)

    const {
      tree: { [nodeIdNum]: node },
    } = this

    const nodeValues = node.children!.map((c) => {
      return this.tree[c].leaf!
    })

    node.children!.forEach((c) => {
      delete this.tree[c]
    })
    delete node.children
    node.leaf = 0

    const leftNode = this.getLeftNode(nodeIdNum)

    if (leftNode) {
      leftNode.leaf! += nodeValues[0]
    }

    const rightNode = this.getRightNode(nodeIdNum)

    if (rightNode) {
      rightNode.leaf! += nodeValues[1]
    }

    return true
  }

  public split() {
    const maxId = this.getMaxId()
    const nodeId = Object.keys(this.tree)
      .filter((treeKey) => {
        const numKey = Number(treeKey)

        return "leaf" in this.tree[numKey] && this.tree[numKey].leaf! >= 10
      })
      .sort(this.sortByPath)[0]

    if (!nodeId) {
      return false
    }

    const nodeIdNum = Number(nodeId)
    const {
      tree: { [nodeIdNum]: node },
    } = this
    const halfLeaf = node.leaf! / 2
    const [newLeft, newRight] = [Math.floor(halfLeaf), Math.ceil(halfLeaf)]

    delete node.leaf

    const nodeLeft = {
      depth: node.depth + 1,
      id: maxId + 1,
      leaf: newLeft,
      parent: nodeIdNum,
      path: node.path.concat([0]),
    }
    const nodeRight = {
      depth: node.depth + 1,
      id: maxId + 2,
      leaf: newRight,
      parent: nodeIdNum,
      path: node.path.concat([1]),
    }

    node.children = [nodeLeft.id, nodeRight.id]
    this.tree[nodeLeft.id] = nodeLeft
    this.tree[nodeRight.id] = nodeRight

    return true
  }

  public toString(): string {
    const rootNode = this.getRootNode()

    return this.toStringNode(rootNode)
  }

  public reduce(maxStep = -1) {
    let didChange = true
    let steps = 0

    while (didChange && (maxStep < 0 || steps < maxStep)) {
      steps += 1

      didChange = false
      didChange = this.explode()

      if (didChange) {
        continue
      }

      didChange = this.split()
    }
  }

  private getLeftNode(nodeId: number) {
    return this.getSideNode({ nodeId, side: Side.Left })
  }

  private getRightNode(nodeId: number) {
    return this.getSideNode({ nodeId, side: Side.Right })
  }

  private getSideNode({
    nodeId,
    side,
  }: {
    nodeId: number
    side: Side
  }): TreeNode | null {
    let {
      tree: { [nodeId]: node },
    } = this
    // eslint-disable-next-line prefer-destructuring
    let parent: TreeNode | null = this.tree[node.parent!]

    while (
      parent &&
      parent.children!.indexOf(node.id) !== (side === Side.Left ? 1 : 0)
    ) {
      node = this.tree[parent.id]
      parent = node.parent ? this.tree[node.parent] : null
    }

    if (!parent) {
      return null
    }

    const { [side === Side.Left ? 0 : 1]: newNodeId } =
      this.tree[parent.id].children!

    node = this.tree[Number(newNodeId)]

    while (node.children) {
      node = this.tree[node.children[side === Side.Left ? 1 : 0]]
    }

    return node
  }

  private toStringNode(rootNode: TreeNode): string {
    const recursiveFn = (node: TreeNode): RecursiveNumArray => {
      return "children" in node
        ? node.children!.map((c) => recursiveFn(this.tree[c]))
        : node.leaf!
    }

    const numsArray = recursiveFn(rootNode)

    return JSON.stringify(numsArray, null, 0)
  }

  private getRootNode() {
    const firstId = Number(Object.keys(this.tree)[0]!)
    let {
      tree: {
        [firstId]: { id, parent },
      },
    } = this

    while (parent) {
      id = this.tree[parent].id
      parent = this.tree[parent].parent
    }

    return this.tree[id]
  }

  private getMaxId() {
    return Math.max(...Object.keys(this.tree).map(Number))
  }

  private readonly sortByPath = (...[nodeIdA, nodeIdB]: [string, string]) => {
    const {
      tree: { [Number(nodeIdA)]: nodeA, [Number(nodeIdB)]: nodeB },
    } = this

    for (let pathAIndex = 0; pathAIndex < nodeA.path.length; pathAIndex += 1) {
      const {
        path: { [pathAIndex]: pathAElement },
      } = nodeA
      const {
        path: { [pathAIndex]: pathBElement },
      } = nodeB

      if (pathAElement !== pathBElement) {
        return pathAElement - pathBElement
      }
    }

    /* istanbul ignore next */
    return nodeA.path.length - nodeB.path.length
  }
}

export { SnailfishNumber }
