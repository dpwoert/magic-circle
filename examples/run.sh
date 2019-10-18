#!/bin/bash

if [ -z "$1" ]
then
  echo "running example: simple"
  cd examples/simple
  npm run start
  cd ../..
else
  echo "running example: $1"
  cd examples/$1
  CMD=${2:-start}
  npm run ${CMD}
  cd ../..
fi
