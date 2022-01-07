type RecursiveArray<T> = Array<RecursiveArray<T>> | T
type RecursiveNumArray = RecursiveArray<number>
type TreeNode = {
  children?: Array<TreeNode["id"]>
  depth: number
  id: number
  leaf?: number
  parent: TreeNode["id"] | null
}
// @TODO: Combine types
type TreeNodeFull = {
  depth: number
  id: number
  parent: TreeNodeFull["id"] | null
} & (
  | {
      children: TreeNodeFull[]
    }
  | {
      leaf: number
    }
)

type Tree = {
  [key: TreeNode["id"]]: TreeNode
}

class SnailfishNumber {
  private readonly tree: Tree

  public constructor(numDefinition: Tree | string) {
    this.tree =
      typeof numDefinition === "string"
        ? SnailfishNumber.fromString(numDefinition)
        : numDefinition
  }

  private static fromString(numDefinition: string): Tree {
    const numsArray: RecursiveNumArray = JSON.parse(numDefinition)
    let currentId = 0

    const recursiveFn = ({
      depth,
      nodeArr,
      parentId,
    }: {
      depth: number
      nodeArr: RecursiveNumArray | number
      parentId: TreeNode["id"] | null
    }): TreeNodeFull => {
      currentId += 1

      const id = currentId

      return {
        depth,
        id: currentId,
        parent: parentId,
        ...(Array.isArray(nodeArr)
          ? {
              children: nodeArr.map((subItem) =>
                recursiveFn({
                  depth: depth + 1,
                  nodeArr: subItem,
                  parentId: id,
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
    })

    const recursiveReduce = (...[tree, nodeFull]: [Tree, TreeNodeFull]) => {
      const node =
        "children" in nodeFull
          ? { ...nodeFull, children: nodeFull.children.map((c) => c.id) }
          : { ...nodeFull }

      if ("children" in nodeFull) {
        nodeFull.children.forEach((c) => {
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
    const maxId = this.getMaxId() + 2
    const rootNode = this.getRootNode()
    const rootNodeOther = otherNum.getRootNode()
    const otherTree = Object.keys(otherNum.tree).reduce<Tree>(
      (...[otherTreeAcc, otherTreeKey]: [Tree, string]) => {
        const numKey = Number(otherTreeKey)

        const newNode = {
          ...otherNum.tree[numKey],
        }

        otherTreeAcc[numKey + maxId] = newNode

        if ("children" in newNode) {
          newNode.children = newNode.children!.map((c) => c + maxId)
        }

        return otherTreeAcc
      },
      {}
    )

    const newTree = { ...this.tree, ...otherTree }

    Object.keys(newTree).forEach((newTreeKey) => {
      const numKey = Number(newTreeKey)

      newTree[numKey] = {
        ...newTree[numKey],
        depth: (newTree[numKey].depth += 1),
      }
    })

    const newRootId = maxId - 1
    const newRootOtherId = rootNodeOther.id + maxId

    newTree[newRootId] = {
      children: [rootNode.id, newRootOtherId],
      depth: 0,
      id: newRootId,
      parent: null,
    }

    newTree[rootNode.id] = { ...newTree[rootNode.id], parent: newRootId }
    newTree[newRootOtherId] = { ...newTree[newRootOtherId], parent: newRootId }

    return new SnailfishNumber(newTree)
  }

  public explode() {
    const nodeId = Object.keys(this.tree)
      .filter((treeKey) => {
        const numKey = Number(treeKey)

        return this.tree[numKey].depth >= 4 && !!this.tree[numKey].children
      })
      .sort((...[keyA, keyB]) => Number(keyA) - Number(keyB))[0]

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

  public printTreeNode(nodeId: number) {
    const {
      tree: { [nodeId]: node },
    } = this
    const nodeStr = this.toStringNode(node)

    // eslint-disable-next-line no-console
    console.log("lib.test.ts: nodeStr", nodeStr)
  }

  public toString(): string {
    const rootNode = this.getRootNode()

    return this.toStringNode(rootNode)
  }

  private getLeftNode(nodeId: number) {
    return this.getSideNode({ nodeId, side: "left" })
  }

  private getRightNode(nodeId: number) {
    return this.getSideNode({ nodeId, side: "right" })
  }

  private getSideNode({
    nodeId,
    side,
  }: {
    nodeId: number
    side: "left" | "right"
  }): TreeNode | null {
    let {
      tree: { [nodeId]: node },
    } = this
    let parent = node.parent ? this.tree[node.parent] : null

    while (
      parent &&
      parent.children!.indexOf(node.id) !== (side === "left" ? 1 : 0)
    ) {
      node = this.tree[parent.id]
      parent = node.parent ? this.tree[node.parent] : null
    }

    if (!parent) {
      return null
    }

    node = this.tree[parent.id]

    while (node.children) {
      node = this.tree[node.children[side === "left" ? 0 : 1]]
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
}

export { SnailfishNumber }
