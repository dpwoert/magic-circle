#!/bin/bash

# stop when one of these commands fail
set -e
set -o pipefail

# ensuring project is fully linted
npm run lint

if [[ `git status --porcelain` ]]; then
  echo ""
  echo "Git changes detected, make sure you've commited all your work before"
  echo ""
  exit 1
fi

echo "Updating README in core plugins"
cp readme.md core/client
cp readme.md core/editor
cp readme.md core/styles
cp readme.md core/state
cp readme.md core/schema
cp readme.md core/online

if [[ `git status --porcelain` ]]; then
  echo "Commiting update to README files"
  git add -A
  git commit -am "updates readme in core folders"
fi

echo "cleaning repo and (re)installing dependencies"
npm run clean
npm install

echo "building packages"
npm run build:prod

if [[ `git status --porcelain` ]]; then
  echo ""
  echo "Git changes detected, make sure you've commited all your work before"
  echo ""
  exit 1
fi

# update version
lerna version

# publish to npm
# lerna publish from-package
