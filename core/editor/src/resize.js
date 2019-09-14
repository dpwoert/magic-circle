const { ipcMain } = require('electron');
const settings = require('electron-settings');

module.exports = app => {
  const editor = app.window('editor');
  const frame = app.window('frame');

  const size = {
    top: 46,
    left: 250,
    right: 225,
    bottom: 0,
  };

  const windowMoveResize = () => {
    const position = editor.getPosition();
    const windowSize = editor.getSize();
    const contentSize = editor.getContentSize();
    const titleBarHeight = windowSize[1] - contentSize[1];

    if (frame) {
      const left = position[0] + size.left;
      const top = position[1] + titleBarHeight + size.top;
      const width = contentSize[0] - size.left - size.right;
      const height = contentSize[1] - size.top - size.bottom;
      frame.setPosition(left, top);
      frame.setSize(width, height);
    }

    settings.set('size', {
      width: windowSize[0],
      height: windowSize[1],
    });
  };

  const setSize = (width, height) => {
    editor.setSize(width, height);
    windowMoveResize();
  };

  editor.on('move', windowMoveResize);
  editor.on('resize', windowMoveResize);
  windowMoveResize();

  // update frame size
  ipcMain.on('resize-frame', (evt, frameSize) => {
    const width = frameSize.width + size.left + size.right;
    const height = frameSize.height + size.top + size.bottom;
    setSize(width, height);
  });

  // update window size
  ipcMain.on('resize-window', (evt, windowSize) => {
    setSize(windowSize.width, windowSize.height);
  });
};
