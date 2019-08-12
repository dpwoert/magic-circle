#!/bin/bash

# remove old build
rm -rf build/*

if [ "$1" == "--install" ]; then
  npm i
fi


# do actual packaging
node package.js

NAME=$(node -p -e "require('./build/app.json').name")
NAMESPACE=$(node -p -e "require('./build/app.json').namespace")
BUILD_DIR=$(node -p -e "require('./build/app.json').buildDir")

# make alias
rm -rf $BUILD_DIR/$NAME.app/Contents/Resources/app/node_modules/$NAMESPACE

if [[ -z "${NODE_ENV}" ]]; then
  echo "linking dependencies"
  ln -s $PWD/node_modules/$NAMESPACE $BUILD_DIR/$NAME.app/Contents/Resources/app/node_modules/$NAMESPACE
	echo "{ \"mode\": \"development\" }" > $PWD/build/mode.json
else
  echo "copying dependencies"
  cp -L -R $PWD/node_modules/$NAMESPACE $BUILD_DIR/$NAME.app/Contents/Resources/app/node_modules
	echo "{ \"mode\": \"production\" }" > $PWD/build/mode.json
fi
