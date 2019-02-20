#!/bin/bash

# reinstall all dependencies
npm run clean
npm i

# rebuild all projects
npm run build:prod
npm run package:prod

# publish
lerna version
lerna publish
