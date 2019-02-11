const { Menu } = require('electron');

module.exports = (window, frame) => {
  const template = [];

  template.push({
    label: 'Creative Controls',
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
      { type: 'separator' },
      { role: 'resetzoom' },
      { role: 'zoomin' },
      { role: 'zoomout' },
      { type: 'separator' },
      {
        label: 'fullscreen',
        submenu: [
          {
            label: 'Window',
            accelerator: 'CmdOrCtrl+Shift+F',
          },
          {
            label: 'Editor',
            accelerator: 'CmdOrCtrl+F',
          },
        ],
      },
    ],
  });

  template.push({
    role: 'help',
    submenu: [
      {
        label: 'Learn More',
        click: () => {
          require('electron').shell.openExternal(
            'https://github.com/dpwoert/creative-controls'
          );
        },
      },
    ],
  });

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
};
