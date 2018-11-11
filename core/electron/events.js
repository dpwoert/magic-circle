const fs = require('fs');
const { ipcMain } = require('electron');

module.exports = (window, frame) => {

  ipcMain.on('intercom', (evt, { channel, payload, to }) => {
    if(to === 'editor'){
      window.webContents.send(channel, payload);
    } else {
      frame.webContents.send(channel, payload);
    }
  });

  ipcMain.on('refresh', () => {
    frame.reload();
  });

  ipcMain.on('screenshot', (evt, settings = {}) => {

    //TODO AGAIN
    window.capturePage(img => {

      const now = new Date();
      const date = `${now.getFullYear()}-${now.getMonth()+1}-${now.getDate()}`;
      const time = `${now.getHours()}.${now.getMinutes()}`;
      const path = `${global.cwd}/screenshots/screenshot ${date} ${time}`;
      const data = JSON.stringify(settings);

      //save both files to HDD
      fs.writeFile(`${path}.png`, img.toPNG(), () => {
        fs.writeFile(`${path}.json`, data, () => {
          window.webContents.send('screenshot-taken');
          console.log(`📸  took screenshot`)
        });
      });

    });

  });

};
