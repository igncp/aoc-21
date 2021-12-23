#!/bin/bash

set -e

LINES="$(./node_modules/.bin/ts-prune days \
  || true)"

if [ -n "$LINES" ]; then
  echo "$LINES"
  exit 1
fi
