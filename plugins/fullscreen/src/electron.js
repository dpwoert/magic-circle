const { ipcMain, Menu, MenuItem } = require('electron');

module.exports = app => {
  const editor = app.window('editor');
  const frame = app.window('frame');

  // fullscreen frame
  ipcMain.on('fullscreen-frame', () => {
    frame.setFullScreen(!frame.isFullScreen());
  });

  // fullscreen window
  ipcMain.on('fullscreen-window', () => {
    editor.setFullScreen(!editor.isFullScreen());
  });

  // menu
  const menu = Menu.getApplicationMenu();
  const viewMenu = menu.items[2];

  viewMenu.submenu.insert(
    viewMenu.submenu.items.length,
    new MenuItem({
      label: 'Fullscreen',
      submenu: [
        {
          label: 'Window',
          accelerator: 'CmdOrCtrl+Shift+F',
          click() {
            frame.setFullScreen(!frame.isFullScreen());
          },
        },
        {
          label: 'Editor',
          accelerator: 'CmdOrCtrl+F',
          click() {
            editor.setFullScreen(!editor.isFullScreen());
          },
        },
      ],
    })
  );

  Menu.setApplicationMenu(menu);
};
