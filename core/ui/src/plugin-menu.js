/* eslint-disable spaced-comment */

/*#if _WEB
const Menu = {};
const MenuItem = {};
//#else */
const { Menu, MenuItem } = require('electron').remote;
//#endif

export default function addPluginMenu(name, list) {
  // menu
  const menu = Menu.getApplicationMenu();
  const pMenu = menu.items.find((f) => f.label === 'Plugins');
  pMenu.submenu.append(
    new MenuItem({
      label: name,
      submenu: list,
    })
  );

  Menu.setApplicationMenu(menu);
}
