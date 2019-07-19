#!/bin/bash

# remove old build
rm -rfv build/*

# do actual packaging
node package.js

# make alias
rm -rf build/CreativeControls-darwin-x64/CreativeControls.app/Contents/Resources/app/node_modules/@magic-circle
# mkdir build/CreativeControls-darwin-x64/CreativeControls.app/Contents/Resources/app/node_modules/@magic-circle
# mkdir build/CreativeControls-darwin-x64/CreativeControls.app/Contents/Resources/app/node_modules/@magic-circle/ui

if [[ -z "${NODE_ENV}" ]]; then
  echo "linking dependencies"
  ln -s $PWD/node_modules/@magic-circle build/CreativeControls-darwin-x64/CreativeControls.app/Contents/Resources/app/node_modules/@magic-circle
	echo "{ \"mode\": \"development\" }" > $PWD/build/mode.json
else
  echo "copying dependencies"
  cp -L -R $PWD/node_modules/@magic-circle build/CreativeControls-darwin-x64/CreativeControls.app/Contents/Resources/app/node_modules
	echo "{ \"mode\": \"production\" }" > $PWD/build/mode.json
fi
