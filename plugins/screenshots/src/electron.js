/* eslint-disable no-param-reassign */
const fs = require('fs');
const path = require('path');
const { ipcMain } = require('electron');
const getRepoInfo = require('git-repo-info');

module.exports = (window, frame, settings) => {
  // screenshots
  const screenshotBuffer = {};
  ipcMain.on('screenshot', (evt, data = {}) => {
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

      // Add git info
      let git = {};
      if (settings.gitInfo) {
        git = getRepoInfo();
        data.git = git || {};
      }

      // Add meta info
      data.meta = {
        name: git.commitMessage || `${dateTime}${version}`,
        createdAt: +Date.now(),
      };

      // Get path
      const filePath = path.join(
        settings.screenshots.path,
        `screenshot ${dateTime}${version}`
      );
      const content = JSON.stringify(data);

      // Save both files to HDD
      fs.writeFile(`${filePath}.png`, img.toPNG(), () => {
        fs.writeFile(`${filePath}.json`, content, () => {
          window.webContents.send('screenshot-taken');
          console.info(`📸  took screenshot`);
        });
      });
    });
  });
};
