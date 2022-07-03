const fs = require('fs');
const path = require('path');

const examples = {
  list: [],
};

const exampleFolder = path.join(__dirname, '../../../examples');

// Get all folders
fs.readdirSync(exampleFolder, { withFileTypes: true })
  .filter((dir) => dir.isDirectory())
  .forEach((dir) => {
    const pkgFile = fs.readFileSync(
      path.join(exampleFolder, dir.name, 'package.json')
    );
    const pkg = JSON.parse(pkgFile.toString('utf8'));

    examples.list.push({
      name: pkg.exampleName || dir.name,
      repo: `${pkg.repository.url.replace('.git', '')}/tree/master/${
        pkg.repository.directory
      }`,
    });
  });

// write to disk
fs.writeFileSync(
  path.join(__dirname, '../src/list.json'),
  JSON.stringify(examples)
);
