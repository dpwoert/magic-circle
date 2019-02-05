#!/bin/bash

# remove old build
rm -rfv build/*

# do actual packaging
node package.js

# make alias
rm -rfv build/CreativeControls-darwin-x64/CreativeControls.app/Contents/Resources/app/node_modules/@creative-controls
ln -s $PWD/node_modules/@creative-controls build/CreativeControls-darwin-x64/CreativeControls.app/Contents/Resources/app/node_modules/@creative-controls
