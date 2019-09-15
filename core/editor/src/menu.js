const { Menu } = require('electron');

module.exports = app => {
  const frame = app.window('frame');
  const template = [];

  template.push({
    label: 'Magic Circle',
    submenu: [
      { role: 'about' },
      { type: 'separator' },
      { role: 'services' },
      { type: 'separator' },
      { role: 'hide' },
      { role: 'hideothers' },
      { role: 'unhide' },
      { type: 'separator' },
      { role: 'quit' },
    ],
  });

  template.push({
    label: 'Edit',
    submenu: [
      { role: 'undo' },
      { role: 'redo' },
      { type: 'separator' },
      { role: 'cut' },
      { role: 'copy' },
      { role: 'paste' },
      { role: 'pasteandmatchstyle' },
      { role: 'delete' },
      { role: 'selectall' },
    ],
  });

  template.push({
    label: 'View',
    submenu: [
      {
        label: 'Play/Pause',
        accelerator: 'CmdOrCtrl+P',
      },
      {
        label: 'Reload',
        accelerator: 'CmdOrCtrl+R',
        click: () => {
          frame.reload();
        },
      },
      {
        label: 'Hard Reload',
        accelerator: 'CmdOrCtrl+Shift+R',
        click() {
          frame.reload();
        },
      },
      {
        label: 'Resync',
        accelerator: 'CmdOrCtrl+Y',
        click() {
          frame.webContents.send('resync');
        },
      },
      { type: 'separator' },
      { role: 'resetzoom' },
      { role: 'zoomin' },
      { role: 'zoomout' },
      { type: 'separator' },
      {
        id: 'sidebar',
        label: 'Sidebar',
        submenu: [
          {
            label: 'Layers',
            accelerator: 'CmdOrCtrl+1',
          },
          {
            label: 'Screenshots',
            accelerator: 'CmdOrCtrl+2',
          },
          {
            label: 'Performance',
            accelerator: 'CmdOrCtrl+3',
          },
        ],
      },
      {
        type: 'separator',
        id: 'open-files-seperator',
        visible: app.standalone,
      },
      {
        id: 'open-files',
        label: 'Open files',
        accelerator: 'CmdOrCtrl+O',
        visible: app.standalone,
        click() {
          require('electron').shell.openItem(app.path(null, ''));
        },
      },
    ],
  });

  template.push({
    label: 'Plugins',
    submenu: [],
  });

  template.push({
    role: 'help',
    submenu: [
      {
        label: 'Learn More',
        click: () => {
          require('electron').shell.openExternal(
            'https://github.com/dpwoert/magic-circle'
          );
        },
      },
    ],
  });

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
};
