const fs = require('fs');
const path = require('path');
const { camel, pascal } = require('case');

let file = '/* eslint-disable no-unused-vars */';
const files = fs.readdirSync(path.join(__dirname, 'src/icons'));
const svgs = files.filter((name) => name.indexOf('.svg') > -1);

// add svgs
svgs.forEach((p) => {
  const filename = path.basename(p);
  const component = pascal(filename.replace('.svg', ''));
  file += '\n';
  file += `import { ${component} } from './${filename}';`;
});

file += '\n';

// add pngs
svgs.forEach((p) => {
  const filename = path.basename(p);
  const component = camel(filename.replace('.svg', ''));
  file += '\n';
  file += `import ${component} from './${filename.replace('svg', 'png')}';`;
});

file += '\n';

// Link assets
svgs.forEach((p) => {
  const filename = path.basename(p);
  const component1 = pascal(filename.replace('.svg', ''));
  const component2 = camel(filename.replace('.svg', ''));
  file += '\n';
  file += `${component1}.png = ${component2};`;
});

file += '\n';
file += '\n';
file += 'export {';

// Link assets
svgs.forEach((p) => {
  const filename = path.basename(p);
  const component = pascal(filename.replace('.svg', ''));
  file += '\n';
  file += `  ${component},`;
});

file += '\n';
file += '};';

fs.writeFileSync(path.join(__dirname, 'src/icons/index.js'), file);
console.info('created index file for icons');
