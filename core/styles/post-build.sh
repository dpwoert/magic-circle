# cp src/assets/fonts/*.woff dist/assets/fonts/

mkdir dist/assets/fonts -p
mkdir dist/assets/icons -p

cd src/assets/fonts

for file in *.woff; do cp "$file" "../../../dist/assets/fonts/$file" ;done
for file in *.woff2; do cp "$file" "../../../dist/assets/fonts/$file" ;done

cd ../icons

for file in *.svg; do cp "$file" "../../../dist/assets/icons/$file" ;done