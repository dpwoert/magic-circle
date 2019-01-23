const { app, BrowserWindow } = require('electron');
const settings = require('electron-settings');
const url = require('url');
const path = require('path');
const argv = require('minimist')(process.argv.slice(2));

const inject = require('./inject.js');
const eventSystem = require('./events.js');
const resizeHandler = require('./resize.js');
const loadFiles = require('./load-files.js');

global.cwd = argv.cwd;
global.url = argv.url;

let window = null;
let frame = null;

// Wait until the app is ready
app.once('ready', () => {
  // clear settings if needed
  if (argv.clear) {
    console.info('🗑  cleared app settings');
    settings.deleteAll();
  }

  const initialSize = settings.get('size') || {};

  // Create a new window
  window = new BrowserWindow({
    width: initialSize.width || 1400,
    height: initialSize.height || 768,
    // show: false,
    resizable: true,
    useContentSize: true,
    titleBarStyle: 'hiddenInset',
  });
  frame = new BrowserWindow({
    parent: window,
    width: 800,
    height: 768,
    frame: false,
    // resize: false,
    hasShadow: false,
    // transparent: true
  });

  // Load a URL in the window to the local index.html path
  window.loadURL(
    url.format({
      pathname: path.join(__dirname, 'index.html'),
      protocol: 'file:',
      slashes: true,
    })
  );
  frame.loadURL(global.url);

  window.once('ready-to-show', () => {
    // Show window when page is ready
    window.show();
    frame.show();
  });

  // inject needed data
  inject(window, frame);

  // load event system
  eventSystem(window, frame);

  // Resize logic
  resizeHandler(window, frame);

  // Load plugins
  loadFiles(window, frame);
});

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  app.quit();
});
