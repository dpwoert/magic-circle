# stop when one of these commands fail
set -e
set -o pipefail

echo "removing old bundle"
rm -rf core/online/dist

echo "building web safe version of UI package"
WEB=1 npm run build:ui

echo "Creating online bundle"
npm run build:online

echo "building and copying examples"

for dir in examples/*/     # list directories in the form "/tmp/dirname/"
do
    dir=${dir%*/}      # remove the trailing "/"
    example=${dir##*/}

    echo "example: ${example}"
    cd examples/${example}
    npm run build
    mkdir -p ../../core/online/dist/examples/${example}
    cp -R dist/ ../../core/online/dist/examples/${example}
    cd ../..
done

# todo loop

echo "done!"
