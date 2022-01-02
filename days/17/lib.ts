type Vector = {
  x: number
  y: number
}
type Point = Vector
type Velocity = Vector

type Bounds = {
  maxX: number
  maxY: number
  minX: number
  minY: number
}

const calculateTrajectory = (opts: {
  bounds: Bounds
  velocity: Velocity
}): Point[] => {
  const points: Point[] = []
  const velocity = { ...opts.velocity }

  while (true) {
    const lastPoint = points[points.length - 1] || { x: 0, y: 0 }
    const nextPoint = {
      x: lastPoint.x + velocity.x,
      y: lastPoint.y + velocity.y,
    }

    velocity.x = Math.max(velocity.x - 1, 0)
    velocity.y -= 1

    points.push(nextPoint)

    if (
      nextPoint.x > opts.bounds.maxX ||
      nextPoint.y < opts.bounds.minY ||
      (velocity.x === 0 && nextPoint.x < opts.bounds.minX)
    ) {
      break
    }
  }

  return points
}

const extractAreaInfo = (area: string) => {
  const [, coords] = area.split("target area: ")
  const [x, y] = coords.split(", ").map((s) => s.replace(/[xy]=/g, ""))
  const [[minX, maxX], [minY, maxY]] = [x, y].map((coord) =>
    coord.split("..").map(Number)
  )

  return {
    bounds: {
      maxX,
      maxY,
      minX,
      minY,
    },
  }
}

const isInsideBounds = ({
  bounds,
  point,
}: {
  bounds: Bounds
  point: Point
}) => {
  return (
    point.x >= bounds.minX &&
    point.x <= bounds.maxX &&
    point.y >= bounds.minY &&
    point.y <= bounds.maxY
  )
}

const loopValidVelocities = (opts: {
  area: string
  fn: (params: { points: Point[]; velocity: Velocity }) => void
}) => {
  const { bounds } = extractAreaInfo(opts.area)
  const highestPoint = { x: 0, y: 0 }

  for (let { minY: y } = bounds; y < Math.abs(bounds.minY); y += 1) {
    for (let x = 0; x <= bounds.maxX; x += 1) {
      const velocity = { x, y }
      const points = calculateTrajectory({ bounds, velocity })
      const hasPointInBounds = points.find((point) =>
        isInsideBounds({
          bounds,
          point,
        })
      )

      if (hasPointInBounds) {
        opts.fn({
          points,
          velocity,
        })
      }
    }
  }

  return highestPoint
}

const findHighestPoint = (area: string) => {
  const highestPoint = { x: 0, y: 0 }

  loopValidVelocities({
    area,
    fn: ({ points }) => {
      points.forEach((point) => {
        if (point.y > highestPoint.y) {
          highestPoint.x = point.x
          highestPoint.y = point.y
        }
      })
    },
  })

  return highestPoint
}

const getAllValidVelocitiesNum = (area: string) => {
  let velocities = 0

  loopValidVelocities({
    area,
    fn: () => {
      velocities += 1
    },
  })

  return velocities
}

const _test =
  process.env.NODE_ENV === "test"
    ? {
        calculateTrajectory,
        extractAreaInfo,
      }
    : /* istanbul ignore next */
      null

export { findHighestPoint, _test, getAllValidVelocitiesNum }
