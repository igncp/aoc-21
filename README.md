[![Build](https://github.com/igncp/aoc-21/actions/workflows/verify.yml/badge.svg)](https://github.com/igncp/aoc-21/actions/workflows/verify.yml)

Days completed:

- [01](./days/01)

Other links:

- [Tests coverage](https://igncp.github.io/aoc-21/tests-coverage)
- [TypeScript coverage](https://igncp.github.io/aoc-21/typescript-coverage)

The goals for this AoC (may evolve when progressing):

- Written in TS
- TDD and always writing tests before implementation (with several iterations of refactoring)
    - Both integration and unit tests are possible
    - Tests before implementation is not a common practice for me so it is a way to evaluate it
- High TS and tests coverage
- Use Github Copilot as much as possible
- Put focus in API and data structures, separating concerns
    - Isomorphic code: should be possible to run both in browser and node
    - Consider inputs as infinite streams when possible: use rxjs or native APIs like ReadableStream
    - Modularize separate concerns
