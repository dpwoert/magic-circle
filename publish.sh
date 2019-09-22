#!/bin/bash

# stop when one of these commands fail
set -e
set -o pipefail

read -p "This will create a new release and reinstall everything in production mode. Do you wish to continue? (y/n) " yn

if [[ `git status --porcelain` ]]; then
  echo ""
  echo "Git changes detected, make sure you've commited all your work before"
  echo ""
  exit 1
fi

echo "Updating README in core plugins"
cp readme.md core/client
cp readme.md core/editor
cp readme.md core/ui

if [[ `git status --porcelain` ]]; then
  echo "Commiting update to README files"
  git add -A
  git commit -am "updates readme in core folders"
  exit 1
fi

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
lerna publish from-package
