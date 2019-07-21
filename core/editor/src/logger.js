const { ipcMain } = require('electron');

module.exports = function logger() {
  ipcMain.on('log', (evt, ...args) => {
    let type = 'log';
    let msg = args[0];

    if (args.length === 2) {
      [type, msg] = args;
    }

    // eslint-disable-next-line
    console[type](msg);
  });
};
