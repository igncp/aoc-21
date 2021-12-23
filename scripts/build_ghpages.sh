#!/bin/bash

set -e

rm -rf public

mkdir public

cp -r coverage/lcov-report public/tests-coverage
cp -r coverage-ts public/typescript-coverage
