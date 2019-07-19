#!/bin/bash

# stop when one of these commands fail
set -e

# update version
lerna version

# reinstall all dependencies
npm run clean
npm install

# rebuild all projects
npm run build:prod
npm run package:prod

# publish
if [[ "$1" == "--confirm" ]]; then
  echo "publishing to NPM"
  lerna publish
fi
