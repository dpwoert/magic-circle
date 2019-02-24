#!/bin/bash

# remove old build
rm -rfv build/*

# do actual packaging
node package.js

# make alias
rm -rfv build/CreativeControls-darwin-x64/CreativeControls.app/Contents/Resources/app/node_modules/@creative-controls
# mkdir build/CreativeControls-darwin-x64/CreativeControls.app/Contents/Resources/app/node_modules/@creative-controls
# mkdir build/CreativeControls-darwin-x64/CreativeControls.app/Contents/Resources/app/node_modules/@creative-controls/ui

if [[ -z "${NODE_ENV}" ]]; then
  echo "linking dependencies"
  ln -s $PWD/node_modules/@creative-controls build/CreativeControls-darwin-x64/CreativeControls.app/Contents/Resources/app/node_modules/@creative-controls
else
  echo "copying dependencies"
  cp -L -R $PWD/node_modules/@creative-controls build/CreativeControls-darwin-x64/CreativeControls.app/Contents/Resources/app/node_modules
fi
