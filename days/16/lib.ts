enum PacketType {
  Equal = "equal",
  Greater = "greater",
  Less = "less",
  Literal = "literal",
  Maximum = "maximum",
  Minimum = "minimum",
  Multiply = "multiply",
  Sum = "sum",
}

const typeIdToTypeValue = [
  PacketType.Sum,
  PacketType.Multiply,
  PacketType.Minimum,
  PacketType.Maximum,
  PacketType.Literal,
  PacketType.Greater,
  PacketType.Less,
  PacketType.Equal,
]

type LiteralPacket = {
  content: number
  type: PacketType.Literal
  version: number
}

type OperatorPacket = {
  subpackets: Packet[] // eslint-disable-line @typescript-eslint/no-use-before-define
  type:
    | PacketType.Equal
    | PacketType.Greater
    | PacketType.Less
    | PacketType.Maximum
    | PacketType.Minimum
    | PacketType.Multiply
    | PacketType.Sum
  version: number
}

type Packet = LiteralPacket | OperatorPacket

const hex2bin = (hexLetter: string) =>
  parseInt(hexLetter, 16).toString(2).padStart(4, "0")

class BITSProtocol {
  private packets: Packet[] = []
  private readonly bits: number[]

  // @TODO: rxjs input
  public constructor(input: string) {
    this.bits = input
      .split("")
      .filter((v) => !!v)
      .reduce<number[]>((...[bits, hexLetter]) => {
        const subBits = hex2bin(hexLetter).split("").map(Number)

        bits.push(...subBits)

        return bits
      }, [])
  }

  public static getRecursiveVersionSum(packets: Packet[]) {
    const recursiveReduce = (...[sum, packet]: [number, Packet]): number => {
      return (
        sum +
        packet.version +
        ("subpackets" in packet ? packet.subpackets : []).reduce(
          recursiveReduce,
          0
        )
      )
    }

    return packets.reduce(recursiveReduce, 0)
  }

  public static evaluatePackets(packets: Packet[]) {
    const operationResult = (packet: Packet): number => {
      switch (packet.type) {
        case PacketType.Literal:
          return packet.content

        case PacketType.Sum: {
          return packet.subpackets.reduce((...[total, subpacket]) => {
            return total + operationResult(subpacket)
          }, 0)
        }

        case PacketType.Multiply: {
          return packet.subpackets.reduce((...[total, subpacket]) => {
            return total * operationResult(subpacket)
          }, 1)
        }

        case PacketType.Minimum: {
          return packet.subpackets.reduce((...[total, subpacket]) => {
            return Math.min(total, operationResult(subpacket))
          }, Infinity)
        }

        case PacketType.Maximum: {
          return packet.subpackets.reduce((...[total, subpacket]) => {
            return Math.max(total, operationResult(subpacket))
          }, 0)
        }

        case PacketType.Greater: {
          return operationResult(packet.subpackets[0]) >
            operationResult(packet.subpackets[1])
            ? 1
            : 0
        }

        case PacketType.Less: {
          return operationResult(packet.subpackets[0]) <
            operationResult(packet.subpackets[1])
            ? 1
            : 0
        }

        case PacketType.Equal: {
          return operationResult(packet.subpackets[0]) ===
            operationResult(packet.subpackets[1])
            ? 1
            : 0
        }

        default:
          throw new Error("Unknown packet type")
      }
    }

    return packets.reduce((...[sum, packet]) => {
      return sum + operationResult(packet)
    }, 0)
  }

  private static decodePackets({
    bits,
  }: {
    bits: number[]
    maxPackets: number | null
  }) {
    enum State {
      CollectingSubpackets = "subpackets",
      CollectingSubpacketsLength = "subpackets-length",
      Head = "head",
      LiteralContent = "literal",
      Padding = "padding",
    }

    enum LengthType {
      Bits = "bits",
      Count = "count",
    }

    const packets: Packet[] = []

    let packetPosition = 0
    let subBits = ""
    const contentBits: number[] = []
    let packet: Partial<Packet> = {}
    let subpacketsLengthBits = 0
    let subpacketsLength = 0
    let bitsCount = 0
    let skipBits = 0

    // eslint-disable-next-line prefer-destructuring
    let subpacketsLengthType: LengthType = LengthType.Bits
    // eslint-disable-next-line prefer-destructuring
    let state: State = State.Head

    const savePacket = () => {
      packets.push(packet as Packet)
      packetPosition = 0
    }

    bits.forEach((...[bit, bitIndex]) => {
      bitsCount += 1
      subBits += bit

      if (skipBits) {
        skipBits -= 1

        return
      }

      switch (true) {
        case packetPosition === 0: {
          packet = {}
          contentBits.length = 0
          state = State.Head
          subBits = bit.toString()
          break
        }

        case packetPosition === 2: {
          packet.version = parseInt(subBits, 2)
          subBits = ""
          break
        }

        case packetPosition === 5: {
          const typeId = parseInt(subBits, 2)

          packet.type = typeIdToTypeValue[typeId]
          subBits = ""
          break
        }

        case packetPosition === 6: {
          if (packet.type === PacketType.Literal) {
            state = State.LiteralContent
          } else {
            if (subBits === "0") {
              subpacketsLengthType = LengthType.Bits
              subpacketsLengthBits = 15
            } else {
              subpacketsLengthType = LengthType.Count
              subpacketsLengthBits = 11
            }

            state = State.CollectingSubpacketsLength
            subBits = ""
          }

          break
        }
      }

      if (
        state === State.CollectingSubpacketsLength &&
        subBits.length === subpacketsLengthBits
      ) {
        subpacketsLength = parseInt(subBits, 2)

        if (subpacketsLengthType === LengthType.Bits) {
          state = State.CollectingSubpackets
          subBits = ""
        } else {
          const { bitsCount: newBitsCount, packets: subpackets } =
            BITSProtocol.decodePackets({
              bits: bits.slice(bitIndex + 1, bits.length),
              maxPackets: subpacketsLength,
            })

          ;(packet as OperatorPacket).subpackets = subpackets
          savePacket()
          skipBits = newBitsCount

          return
        }
      }

      if (
        state === State.CollectingSubpackets &&
        subBits.length === subpacketsLength
      ) {
        // eslint-disable-next-line @typescript-eslint/no-extra-semi
        ;(packet as OperatorPacket).subpackets = BITSProtocol.decodePackets({
          bits: subBits.split("").map(Number),
          maxPackets: null,
        }).packets
        savePacket()

        return
      }

      if (state === State.LiteralContent && subBits.length === 5) {
        const [shouldContinue, ...newContentBits] = subBits
          .split("")
          .map(Number)

        contentBits.push(...newContentBits)

        subBits = ""

        if (shouldContinue === 0) {
          // eslint-disable-next-line @typescript-eslint/no-extra-semi
          ;(packet as LiteralPacket).content = parseInt(contentBits.join(""), 2)
          savePacket()

          return
        }
      }

      packetPosition += 1
    })

    return {
      bitsCount,
      packets,
    }
  }

  public decodeAllPackets() {
    const { bits } = this

    this.packets = BITSProtocol.decodePackets({
      bits,
      maxPackets: null,
    }).packets
  }

  public getPackets() {
    return this.packets.slice()
  }
}

export { BITSProtocol, PacketType, Packet }
