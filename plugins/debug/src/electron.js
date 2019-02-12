const { ipcMain, Menu, MenuItem } = require('electron');
const getRepoInfo = require('git-repo-info');

const truncate = (string, max) =>
  string.length > max ? `${string.substring(0, max)}...` : string;

module.exports = (window, frame, settings) => {
  const debug = settings.debug || {};

  const toggleTools = (w, mode) => {
    if (w.webContents.isDevToolsOpened()) {
      w.webContents.closeDevTools();
    } else {
      w.webContents.openDevTools({
        mode: mode || (debug.mode || 'bottom'),
      });
    }
  };

  // devtools by button
  ipcMain.on('dev-tools', () => {
    toggleTools(frame);
  });

  // git status
  const git = getRepoInfo();

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
              click: () => {
                toggleTools(frame);
              },
            },
            {
              label: 'Editor',
              accelerator: 'Alt+Shift+Command+I',
              click: () => {
                toggleTools(window, 'detach');
              },
            },
          ],
        },
        { role: 'separator' },
        {
          label: `env: ${process.env.NODE_ENV || 'development'}`,
          enabled: false,
        },
        {
          label: `branch: ${git.branch}`,
          enabled: false,
        },
        {
          label: `commit: ${truncate(git.commitMessage, 15)}`,
          enabled: false,
        },
        {
          label: `last tag: ${git.lastTag || 'none'}`,
          enabled: false,
        },
      ],
    })
  );

  Menu.setApplicationMenu(menu);
};
