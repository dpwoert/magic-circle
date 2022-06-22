const fs = require('fs');
const path = require('path');
const { pascal } = require('case');

const all = [];

let file = '/* eslint-disable no-unused-vars */';
const files = fs.readdirSync(path.join(__dirname, '../src/assets/icons'));
const svgs = files.filter((name) => name.indexOf('.svg') > -1);

// add svgs
svgs.forEach((p) => {
  const filename = path.basename(p);
  const component = pascal(filename.replace('.svg', ''));
  file += '\n';
  file += `import { ReactComponent as ${component}Icon } from './${filename}';`;
});

file += '\n';
file += '\n';

// Link assets
svgs.forEach((p) => {
  const filename = path.basename(p);
  const component = pascal(filename.replace('.svg', ''));
  file += '\n';

  file += `export const ${component}: IconDefinition = {`;
  file += `name: '${component}',`;
  file += `component: ${component}Icon`;
  file += `};`;

  all.push(component);
});

file += '\n';
file += '\n';
file += 'export type list = ';
file += all.map((a) => `"${a}"`).join(' | ');
file += ';';
file += '\n';
file += '\n';
file += 'export type Component = React.FC<React.SVGProps<SVGSVGElement>>;';
file += '\n';
file += '\n';
file += 'export type IconDefinition = { name: list; component: Component; };';

fs.writeFileSync(path.join(__dirname, '../src/assets/icons/index.ts'), file);
console.info('created index file for icons');
