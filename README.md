# My solutions for [Advent of Code 2021](https://adventofcode.com/2021)

[![Build](https://github.com/igncp/aoc-21/actions/workflows/verify.yml/badge.svg)](https://github.com/igncp/aoc-21/actions/workflows/verify.yml)

The days with link are completed:

<table>
  <tr>
    <td><b><a href="./days/01">01</a></b></td><td><b><a href="./days/02">02</a></b></td>
    <td><b><a href="./days/03">03</a></b></td><td><b><a href="./days/04">04</a></b></td>
    <td><b><a href="./days/05">05</a></b></td>
  </tr>
  <tr>
    <td><b><a href="./days/06">06</a></b></td><td><b><a href="./days/07">07</a></b></td>
    <td><b><a href="./days/08">08</a></b></td><td><b><a href="./days/09">09</a></b></td>
    <td><b><a href="./days/10">10</a></b></td>
  </tr>
  <tr>
    <td><b><a href="./days/11">11</a></b></td>
    <td>12</td><td>13</td><td>14</td><td>15</td>
  </tr>
  <tr>
    <td>16</td><td>17</td><td>18</td><td>19</td><td>20</td>
  </tr>
  <tr>
    <td>21</td><td>22</td><td>23</td><td>24</td><td>25</td>
  </tr>
</table>

Other links:

- [Tests coverage](https://igncp.github.io/aoc-21/tests-coverage)
- [TypeScript coverage](https://igncp.github.io/aoc-21/typescript-coverage)

The goals for this AoC:

- Written in [TypeScript](https://www.typescriptlang.org/)
- [TDD](https://en.wikipedia.org/wiki/Test-driven_development), always writing tests before the implementation
    - Several iterations of refactoring
    - Both integration and unit tests are possible
    - Testing before the implementation is not a common practice for me so this is a way to evaluate it
- High coverage thresholds for [static types](https://github.com/alexcanessa/typescript-coverage-report) and [tests](https://jestjs.io/docs/configuration#coveragethreshold-object)
- Use [Github Copilot](https://copilot.github.com/) as much as possible while coding
- Put focus in the interfaces and data structures
    - Isomorphic code for `lib` files: should be possible to run both in browser and node
    - Consider inputs as infinite streams when appropiate: uses [RxJS](https://rxjs.dev/) or native APIs like [streams](https://nodejs.org/api/stream.html#readable-streams)
