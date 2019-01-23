const fs = require('fs');
const { ipcMain } = require('electron');

module.exports = (window, frame) => {
  // screenshots
  const screenshotBuffer = {};
  ipcMain.on('screenshot', (evt, settings = {}) => {
    frame.capturePage(img => {
      // Get date
      const now = new Date();
      const date = `${now.getFullYear()}-${now.getMonth() +
        1}-${now.getDate()}`;
      const time = `${now.getHours()}.${now.getMinutes()}`;
      const dateTime = `${date} ${time}`;

      // Get version number if needed
      let version = '';
      if (screenshotBuffer[dateTime]) {
        version = ` (${screenshotBuffer[dateTime]})`;
        screenshotBuffer[dateTime] += 1;
      } else {
        screenshotBuffer[dateTime] = 1;
      }

      // Get path
      const path = `${global.cwd}/screenshots/screenshot ${dateTime}${version}`;
      const data = JSON.stringify(settings);

      // Save both files to HDD
      fs.writeFile(`${path}.png`, img.toPNG(), () => {
        fs.writeFile(`${path}.json`, data, () => {
          window.webContents.send('screenshot-taken');
          console.info(`📸  took screenshot`);
        });
      });
    });
  });
};