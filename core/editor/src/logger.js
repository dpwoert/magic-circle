const { ipcMain, app: electron } = require('electron');

module.exports = function logger(app) {
  ipcMain.on('log', (evt, ...args) => {
    let type = 'log';
    let msg = args[0];

    if (args.length === 2) {
      [type, msg] = args;
    }

    if (app.CI && type === 'error') {
      console.info('CI has run with an error');
      electron.exit(1);
    }

    // eslint-disable-next-line
    console[type](msg);
  });
};
