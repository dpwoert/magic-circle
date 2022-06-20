# Ensure folder is deleted
rm -rf magic-circle

# Build Magic Circle
npx controls build

# ensure we have an example dir
mkdir magic-circle/examples

cd ../../examples/

# Build example scripts
for file in $(ls -d */); do (
  echo "building example: $file"
  cd "$file"
  npm run build:prod
  cp -R dist ../../core/online/magic-circle/examples/$file
) done
