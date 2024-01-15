# Ensure folder is deleted
rm -rf magic-circle

# Build Magic Circle
npx magic build

# ensure we have an example dir
mkdir magic-circle/viewer

# open folder for inner frame
cd ../../examples/three-gltf-upload

# build
npm run build:prod
cp -R dist ../../core/online/magic-circle/viewer/
