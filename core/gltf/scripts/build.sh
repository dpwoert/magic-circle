# Ensure folder is deleted
rm -rf magic-circle

# Build Magic Circle
npx magic build

# open folder for inner frame
cd ../../examples/three-gltf-editor

# build
npm run build:prod:gltf
cp -R dist ../../core/gltf/magic-circle/viewer
