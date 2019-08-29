/* eslint-disable no-else-return */
const fs = require('fs');
const argv = require('minimist')(process.argv.slice(2));

module.exports = () => {
  const path = `${__dirname}/arguments.json`;

  if (argv.url) {
    // save arguments [cli mode]
    fs.writeFileSync(path, JSON.stringify(argv));
    return argv;
  } else if (fs.existsSync(path)) {
    // read arguments [standalone mode]
    return JSON.parse(fs.readFileSync(path));
  }

  throw new Error('arguments not found');
};
