const { ipcMain, Menu, MenuItem } = require('electron');

module.exports = (window, frame, settings) => {
  const debug = settings.debug || {};

  const toggleTools = w => {
    if (w.webContents.isDevToolsOpened()) {
      w.webContents.closeDevTools();
    } else {
      w.webContents.openDevTools({
        mode: debug.mode || 'bottom',
      });
    }
  };

  // devtools by button
  ipcMain.on('dev-tools', () => {
    toggleTools(frame);
  });

  // menu
  const menu = Menu.getApplicationMenu();
  menu.insert(
    menu.items.length - 1,
    new MenuItem({
      label: 'Debug',
      beforeGroupContaining: 'help',
      submenu: [
        {
          label: 'DevTools',
          submenu: [
            {
              label: 'Window',
              accelerator: 'Alt+Command+I',
              onClick: () => {
                toggleTools(frame);
              },
            },
            {
              label: 'Editor',
              accelerator: 'Alt+Shift+Command+I',
              onClick: () => {
                toggleTools(window);
              },
            },
          ],
        },
      ],
    })
  );

  Menu.setApplicationMenu(menu);

  console.log(Menu.getApplicationMenu());
};
