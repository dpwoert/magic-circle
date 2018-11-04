const { app, BrowserWindow } = require('electron');
const url = require('url');
const path = require('path');

const eventSystem = require('./src/electron/events.js');

let window = null;
let frame = null;

// Wait until the app is ready
app.once('ready', () => {
  // Create a new window
  window = new BrowserWindow({
    width: 1400,
    height: 768,
    // show: false,
    resizable: true,
    useContentSize: true,
    titleBarStyle: 'hiddenInset'
  });
  frame = new BrowserWindow({
    parent: window,
    width: 800,
    height: 768,
    frame: false,
    // resize: false,
    hasShadow: false,
    // transparent: true
  })

  // Load a URL in the window to the local index.html path
  window.loadURL(
    url.format({
      pathname: path.join(__dirname, 'dist/index.html'),
      protocol: 'file:',
      slashes: true
    })
  );
  frame.loadURL('http://localhost:1234/index.html');

  frame.webContents.on('dom-ready', () => {
    // Add ipcRenderer to front-end
    frame.webContents.executeJavaScript(`
      window.__IPC = require(\'electron\').ipcRenderer
      window.__controls.connect();
    `);
    console.log('injected IPC');
  });

  window.webContents.on('devtools-reload-page', () => {
    frame.reload();
  });

  window.once('ready-to-show', () => {
    // Show window when page is ready
    window.show();
    frame.show();
  });

  //load event system
  eventSystem(window, frame);

  const moveResize = () => {
    const position = window.getPosition();
    const size = window.getSize();
    const contentSize = window.getContentSize();
    const titleBarHeight = size[1] - contentSize[1];

    if(frame){
      frame.setPosition(position[0] + 250, position[1] + titleBarHeight + 46);
      frame.setSize(contentSize[0] - 475, contentSize[1] - 46);
      // frame.setSize(100, contentSize[1]);

      // frame.close();
      // frame = null;
    }
  };

  window.on('move', moveResize);
  window.on('resize', moveResize);
  moveResize();

});

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  app.quit();
});
