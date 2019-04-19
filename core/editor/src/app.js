const { app, BrowserWindow, powerSaveBlocker } = require('electron');
const settings = require('electron-settings');
const url = require('url');
const path = require('path');
const argv = require('minimist')(process.argv.slice(2));

const inject = require('./inject.js');
const eventSystem = require('./events.js');
const resizeHandler = require('./resize.js');
const loadFiles = require('./load-files.js');
const menu = require('./menu.js');

const local = argv.url.indexOf('http') === -1;
global.cwd = argv.cwd;
global.settings = argv.settings;
global.url = local
  ? url.format({
      pathname: path.join(argv.cwd, argv.url || 'index.html'),
      protocol: 'file:',
      slashes: true,
    })
  : argv.url;
global.debug = argv.debug;

let window = null;
let frame = null;

// Wait until the app is ready
app.once('ready', () => {
  // clear settings if needed
  if (argv.clear) {
    console.info('🗑  cleared app settings');
    settings.deleteAll();
  }

  // eslint-disable-next-line
  const settingsFile = require(global.settings) || {};
  const screen = Object.assign(
    {
      size: false,
      enableResize: true,
      enableLargerThanScreen: false,
      preventSleep: false,
    },
    settingsFile.screen || {}
  );

  const defaultSize = { width: 1400, height: 768 };
  const initialSize = screen.size || (settings.get('size') || defaultSize);

  // Create a new window
  window = new BrowserWindow({
    width: initialSize.width,
    height: initialSize.height,
    resizable: screen.enableResize,
    enableLargerThanScreen: screen.enableLargerThanScreen,
    useContentSize: true,
    titleBarStyle: 'hiddenInset',
  });
  frame = new BrowserWindow({
    parent: window,
    width: 800,
    height: 768,
    frame: false,
    hasShadow: false,
  });

  // Power sleep
  if (screen.preventSleep) {
    powerSaveBlocker.start('prevent-display-sleep');
  }

  // Load a URL in the window to the local index.html path
  window.loadURL(
    url.format({
      pathname: path.join(__dirname, 'index.html'),
      protocol: 'file:',
      slashes: true,
    })
  );

  // Load url for frame
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

  // Add menu
  menu(window, frame);
});

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  app.quit();
});
