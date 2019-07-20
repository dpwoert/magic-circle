module.exports = function logger(window, frame) {
  window.webContents.on('log', (evt, ...args) => {
    let type = 'log';
    let msg = args[0];

    if (args === 2) {
      type = args[0];
      msg = args[1];
    }

    console[type](args, msg);
  });
};
