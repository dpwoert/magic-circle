/* eslint-disable no-else-return */
const fs = require('fs');
const path = require('path');
const { app } = require('electron');
const argv = require('minimist')(process.argv.slice(2));

module.exports = () => {
  const file = `${__dirname}/arguments.json`;

  if (argv.url) {
    // save arguments [cli mode]
    fs.writeFileSync(
      file,
      JSON.stringify({
        ...argv,
        settings: '../settings.build.js',
      })
    );
    return {
      ...argv,
      standalone: false,
    };
  } else if (fs.existsSync(file)) {
    // read arguments [standalone mode]
    return {
      ...JSON.parse(fs.readFileSync(file)),
      cwd: path.join(app.getPath('userData'), 'files'),
      standalone: true,
    };
  }

  throw new Error('arguments not found');
};
