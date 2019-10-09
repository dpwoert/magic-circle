const { app, BrowserWindow, powerSaveBlocker } = require('electron');
const electronSettings = require('electron-settings');
const url = require('url');
const path = require('path');
const dotProp = require('dot-prop');
const fs = require('fs');
const { exec } = require('child_process');
const glob = require('glob');

const argv = require('./arguments')();
const logger = require('./logger.js');
const inject = require('./inject.js');
const eventSystem = require('./events.js');
const resizeHandler = require('./resize.js');
const loadFiles = require('./load-files.js');
const menu = require('./menu.js');

class App {
  constructor() {
    this.initialize();
  }

  async initialize() {
    this.windows = {
      frame: null,
      editor: null,
    };

    this.cwd = argv.cwd;
    this.debug = argv.debug;
    this.standalone = argv.standalone;

    // embed files if needed
    if (argv.embed) {
      await this.embed();
    }

    const local = argv.url.indexOf('http') === -1;
    const workPath = this.standalone
      ? path.join(app.getPath('exe'), '../../Resources/app/embed')
      : this.cwd;
    this.url = local
      ? url.format({
          pathname: path.join(workPath, argv.url || 'index.html'),
          protocol: 'file:',
          slashes: true,
        })
      : argv.url;

    // clear settings if needed
    if (argv.clear) {
      console.info('🗑  cleared app settings');
      electronSettings.deleteAll();
    }

    this.settingsFile =
      argv.settings ||
      path.join(app.getPath('exe'), '../../Resources/app/settings.build.js');
    this.settings = require(this.settingsFile) || {}; // eslint-disable-line
    const screen = Object.assign(
      {
        size: false,
        enableResize: true,
        enableLargerThanScreen: false,
        preventSleep: false,
        saveSize: true,
        hideEditor: false,
      },
      this.settings.screen || {}
    );

    const defaultSize = { width: 1400, height: 768 };
    const initialSize = screen.saveSize
      ? screen.size || (electronSettings.get('size') || defaultSize)
      : screen.size || defaultSize;

    const editor = this.openWindow('editor', {
      width: initialSize.width,
      height: initialSize.height,
      resizable: screen.enableResize,
      enableLargerThanScreen: screen.enableLargerThanScreen,
      useContentSize: true,
      titleBarStyle: 'hiddenInset',
    });
    const frame = this.openWindow('frame', {
      parent: editor,
      width: 800,
      height: 768,
      enableLargerThanScreen: screen.enableLargerThanScreen,
      useContentSize: true,
      frame: false,
      hasShadow: false,
      resizable: false,
      movable: false,
    });

    // Power sleep
    if (screen.preventSleep) {
      powerSaveBlocker.start('prevent-display-sleep');
    }

    // Load a URL in the window to the local index.html path
    editor.loadURL(
      url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true,
      })
    );

    // Load url for frame
    frame.loadURL(this.url);

    editor.once('ready-to-show', () => {
      // Show window when page is ready
      if (!screen.hideEditor) {
        window.show();
      }
      frame.show();
    });

    if (argv.inspect) {
      editor.webContents.openDevTools();
      frame.webContents.openDevTools();
    }

    // ensure files folder exists in standalone mode
    if (this.standalone) {
      const standalonePath = path.join(app.getPath('userData'), 'files');
      if (!fs.existsSync(standalonePath)) {
        fs.mkdirSync(standalonePath, { recursive: true });
      }
    }

    // load modules
    [logger, inject, eventSystem, resizeHandler, loadFiles, menu].forEach(fn =>
      fn(this)
    );

    if (argv.CI) {
      console.info('CI run succesfully');
      app.quit();
    }
  }

  embed() {
    if (this.standalone) {
      return false;
    }

    const embed = argv.embed.length > 0 ? argv.embed : '*';
    const target = path.join(app.getPath('exe'), '../../Resources/app/embed');
    if (!fs.existsSync(target)) {
      fs.mkdirSync(target, { recursive: true });
    }

    return new Promise(resolve => {
      glob(embed, { cwd: this.cwd }, (er, files) => {
        const commands = files
          .map(file => {
            const targetDir = path.join(target, path.dirname(file));
            return `mkdir -p "${targetDir}/" && cp "${file}" "${targetDir}/"`;
          })
          .join('\n');
        const run = exec(`rm -rf ${target}/{*,.*}\n${commands}`, {
          cwd: this.cwd,
        });

        if (this.debug) {
          run.stdout.on('data', data => process.stdout.write(data));
          run.stderr.on('data', data => process.stderr.write(data));
        }

        // waiting to be done
        run.on('exit', () => {
          console.info('✅  done embedding app');
          resolve();
        });
      });
    });
  }

  window(name) {
    return this.windows[name];
  }

  openWindow(name, settings) {
    this.windows[name] = new BrowserWindow(settings);
    return this.window(name);
  }

  setting(pathString, d) {
    return dotProp.get(this.settings, pathString, d);
  }
}

app.once('ready', () => {
  new App(); // eslint-disable-line
});

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  app.quit();
});
