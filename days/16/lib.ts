import { Readable } from "node:stream"
import { Observable, from, mergeMap, of, reduce } from "rxjs"

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

enum State {
  CollectingSubpackets = "subpackets",
  CollectingSubpacketsLength = "subpackets-length",
  Head = "head",
  LiteralContent = "literal",
}

enum LengthType {
  Bits = "bits",
  Count = "count",
}

const hex2bin = (hexLetter: string) =>
  parseInt(hexLetter, 16).toString(2).padStart(4, "0")

class BITSProtocol {
  private packets: Packet[] = []
  private readonly bits: Observable<number>

  public constructor(rawInput: Readable | string) {
    this.bits = (
      typeof rawInput === "string" ? of(rawInput) : from(rawInput)
    ).pipe(
      mergeMap((str: Buffer | string) => {
        return str
          .toString()
          .split("")
          .filter((v) => !!v)
          .reduce<number[]>((...[bits, hexLetter]) => {
            const subBits = hex2bin(hexLetter).split("").map(Number)

            bits.push(...subBits)

            return bits
          }, [])
      })
    )
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
    maxPackets,
  }: {
    bits: number[]
    maxPackets: number | null
  }) {
    const packets: Packet[] = []
    const literalContentBits: number[] = []

    let packetPosition = 0
    let subBits = ""
    let packet: Partial<Packet> = {}
    let subpacketsLength = 0
    let bitsCount = 0
    let skipBits = 0

    let { Head: state }: { Head: State } = State
    let { Bits: lengthType }: { Bits: LengthType } = LengthType

    const savePacket = () => {
      packets.push(packet as Packet)
      packetPosition = 0
    }

    bits.forEach((...[bit, bitIndex]) => {
      if (typeof maxPackets === "number" && maxPackets === packets.length) {
        return
      }

      if (skipBits) {
        skipBits -= 1

        return
      }

      bitsCount += 1
      subBits += bit

      switch (true) {
        case packetPosition === 0: {
          packet = {}
          literalContentBits.length = 0
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
              lengthType = LengthType.Bits
            } else {
              lengthType = LengthType.Count
            }

            state = State.CollectingSubpacketsLength
            subBits = ""
          }

          break
        }
      }

      if (
        state === State.CollectingSubpacketsLength &&
        subBits.length === (lengthType === LengthType.Bits ? 15 : 11)
      ) {
        subpacketsLength = parseInt(subBits, 2)

        if (lengthType === LengthType.Bits) {
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
          bitsCount += newBitsCount

          return
        }
      }

      if (
        state === State.CollectingSubpackets &&
        subBits.length === subpacketsLength
      ) {
        const { packets: subpackets } = BITSProtocol.decodePackets({
          bits: subBits.split("").map(Number),
          maxPackets: null,
        })

        ;(packet as OperatorPacket).subpackets = subpackets

        savePacket()

        return
      }

      if (state === State.LiteralContent && subBits.length === 5) {
        const [shouldContinue, ...newContentBits] = subBits
          .split("")
          .map(Number)

        literalContentBits.push(...newContentBits)

        subBits = ""

        if (shouldContinue === 0) {
          ;(packet as LiteralPacket).content = parseInt(
            literalContentBits.join(""),
            2
          )
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

    return new Promise<void>((resolve) => {
      bits
        .pipe(
          reduce((...[collectedBits, bit]) => {
            return collectedBits.concat([bit])
          }, [] as number[])
        )
        .subscribe((allBits) => {
          this.packets = BITSProtocol.decodePackets({
            bits: allBits,
            maxPackets: null,
          }).packets

          resolve()
        })
    })
  }

  public evaluatePackets() {
    return BITSProtocol.evaluatePackets(this.packets)
  }

  public getPackets() {
    return this.packets.slice()
  }

  public getRecursiveVersionSum() {
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

    return this.packets.reduce(recursiveReduce, 0)
  }
}

export { BITSProtocol, PacketType, Packet }
