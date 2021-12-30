import { BITSProtocol, Packet, PacketType } from "./lib"

const firstExample = [
  "D2FE28",
  [
    {
      content: 2021,
      type: PacketType.Literal,
      version: 6,
    },
  ],
  6,
]

const secondExample = [
  "38006F45291200",
  [
    {
      subpackets: [
        {
          content: 10,
          type: PacketType.Literal,
          version: 6,
        },
        {
          content: 20,
          type: PacketType.Literal,
          version: 2,
        },
      ],
      type: PacketType.Less,
      version: 1,
    },
  ],
  9,
]

const thirdExample = [
  "EE00D40C823060",
  [
    {
      subpackets: [
        {
          content: 1,
          type: "literal",
          version: 2,
        },
        {
          content: 2,
          type: "literal",
          version: 4,
        },
        {
          content: 3,
          type: "literal",
          version: 1,
        },
      ],
      type: PacketType.Maximum,
      version: 7,
    },
  ],
  14,
]

const fourthExample = [
  "8A004A801A8002F478",
  [
    {
      subpackets: [
        {
          subpackets: [
            {
              subpackets: [
                {
                  content: 15,
                  type: PacketType.Literal,
                  version: 6,
                },
              ],
              type: PacketType.Minimum,
              version: 5,
            },
          ],
          type: PacketType.Minimum,
          version: 1,
        },
      ],
      type: PacketType.Minimum,
      version: 4,
    },
  ],
  16,
]

describe("getPackets", () => {
  it.each([firstExample, secondExample, thirdExample, fourthExample] as Array<
    [string, Packet[], number]
  >)(
    "returns the expected values",
    async (...[packetStr, packets, versionSum]) => {
      const bitsProtocol = new BITSProtocol(packetStr)

      await bitsProtocol.decodeAllPackets()

      const packetsResult = bitsProtocol.getPackets()

      expect(packetsResult).toEqual(packets)
      expect(bitsProtocol.getRecursiveVersionSum()).toEqual(versionSum)
    }
  )
})

describe("getRecursiveVersionSum", () => {
  it.each([
    ["620080001611562C8802118E34", 12],
    ["C0015000016115A2E0802F182340", 23],
    ["A0016C880162017C3686B18A3D4780", 31],
  ])("returns the expected values: %#", async (...[packetStr, versionSum]) => {
    const bitsProtocol = new BITSProtocol(packetStr)

    await bitsProtocol.decodeAllPackets()

    expect(bitsProtocol.getRecursiveVersionSum()).toEqual(versionSum)
  })
})

describe("evaluatePackets", () => {
  it.each([
    ["C200B40A82", 3],
    ["04005AC33890", 54],
    ["880086C3E88112", 7],
    ["CE00C43D881120", 9],
    ["D8005AC2A8F0", 1],
    ["F600BC2D8F", 0],
    ["9C005AC2F8F0", 0],
    ["9C0141080250320F1802104A08", 1],
  ])(
    "returns the expected values: %#",
    async (...[packetStr, evaluateResult]) => {
      const bitsProtocol = new BITSProtocol(packetStr)

      await bitsProtocol.decodeAllPackets()

      expect(bitsProtocol.evaluatePackets()).toEqual(evaluateResult)
    }
  )

  it("fails on unexpected type", () => {
    expect(() =>
      BITSProtocol.evaluatePackets([
        {
          subpackets: [],
          // @ts-expect-error
          type: "unexpected",
          version: 0,
        },
      ])
    ).toThrowError("Unknown packet type")
  })
})
