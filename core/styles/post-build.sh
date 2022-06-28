# cp src/assets/fonts/*.woff dist/assets/fonts/

mkdir -p dist/assets/fonts
mkdir -p dist/assets/icons

cd src/assets/fonts

for file in *.woff; do cp "$file" "../../../dist/assets/fonts/$file" ;done
for file in *.woff2; do cp "$file" "../../../dist/assets/fonts/$file" ;done

cd ../icons

for file in *.svg; do cp "$file" "../../../dist/assets/icons/$file" ;done