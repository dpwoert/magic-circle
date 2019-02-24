#!/bin/bash

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
  # lerna publish
fi
