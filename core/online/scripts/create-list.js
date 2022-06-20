const fs = require('fs');
const path = require('path');

const examples = {
  list: [],
};

const exampleFolder = path.join(__dirname, '../../../examples');

// Get all folders
fs.readdirSync(exampleFolder, { withFileTypes: true })
  .filter((dir) => dir.isDirectory())
  .map((dir) => {
    examples.list.push(dir.name);
  });

// write to disk
fs.writeFileSync(
  path.join(__dirname, '../src/list.json'),
  JSON.stringify(examples)
);
