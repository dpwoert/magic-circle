
#!/bin/bash

# stop when one of these commands fail
set -e
set -o pipefail

if [[ `git status --porcelain` ]]; then
  echo ""
  echo "Git changes detected, make sure you've commited all your work before"
  echo ""
  exit 1
fi

# ensuring project is fully linted
npm run lint

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
npx nx reset

echo "Running prettier to ensure not detecting wrong changes"
npm run prettier

echo "Running tests"
npm run test
npm run lint
npm run lint:types
npm run lint:dependencies

echo "building packages"
npm run build:dev
npm run build:prod

if [[ `git status --porcelain` ]]; then
  echo ""
  echo "Git changes detected, make sure you've commited all your work before"
  echo ""
  exit 1
fi

# update version
npx lerna version --no-push

# publish to npm
npx lerna publish from-package

# push to github
git push --follow-tags
