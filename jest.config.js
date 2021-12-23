module.exports = {
  coverageThreshold: {
    global: 80,
  },
  globals: {
    "ts-jest": {
      diagnostics: false,
    },
  },
  preset: "ts-jest",
  testEnvironment: "node",
}
