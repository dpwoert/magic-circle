#!/bin/bash

# stop when one of these commands fail
set -e
set -o pipefail

read -p "This will create a new release and reinstall everything in production mode. Do you wish to continue? (y/n) " yn

case $yn in
    [Yy]* ) echo "\nseting up a developing environment";;
    [Nn]* ) exit;;
    * )
      echo "Please answer yes or no."
      exit;
    ;;
esac

echo "cleaning repo and (re)installing dependencies"
npm run clean
npm install

echo "building packages"
npm run build:ui:prod
npm run build:client:prod
npm run package:prod

# ensuring project is fully linted
npm run lint

# update version
lerna version

# publish to npm
lerna publish
