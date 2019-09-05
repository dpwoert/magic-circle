const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

// eslint-disable-next-line
const { ipcMain, powerSaveBlocker } = require('electron');

const trailingZeros = (nr, maxNumber) => {
  const digits = String(maxNumber).length;
  const currentDigits = String(nr).length;
  let output = nr;

  for (let i = 0; i < digits - currentDigits; i += 1) {
    output = `0${output}`;
  }

  return output;
};

module.exports = (window, frame, settings) => {
  ipcMain.on('record', (_, { duration, fps }) => {
    console.info(`🎥  start recording (${duration}s @ ${fps}fps)`);

    const nrFrames = fps * duration;
    let rendered = 0;

    // stop playing
    frame.webContents.send('change-play-state', false);

    // ensure folder exists
    if (!fs.existsSync(settings.recordings.path)) {
      fs.mkdirSync(settings.recordings.path, { recursive: true });
    }

    // ensure computer doesn't go in power save mode
    const keepAwake = powerSaveBlocker.start('prevent-display-sleep');

    ipcMain.on('frame-stepped', evt => {
      if (rendered >= nrFrames) {
        console.info(`🎥  finished recording`);
        window.webContents.send('recording-status', {
          total: nrFrames,
          done: rendered,
        });
        window.webContents.send('finished-recording');
        powerSaveBlocker.stop(keepAwake);
        return false;
      }

      // capture frame
      frame.capturePage(img => {
        // save to file
        const filePath = path.join(
          settings.recordings.path,
          `recording-${trailingZeros(rendered, nrFrames)}.png`
        );
        fs.writeFile(filePath, img.toPNG(), () => {
          // update front-end
          window.webContents.send('recording-status', {
            total: nrFrames,
            done: rendered,
          });

          // update count
          rendered += 1;

          // no longer block process
          evt.returnValue = true; // eslint-disable-line

          // render next frame
          setTimeout(() => {
            frame.webContents.send('step-frame', { fps });
          });
        });
      });

      return true;
    });

    setTimeout(() => {
      frame.webContents.send('step-frame', { fps });
    }, 1000);
  });

  ipcMain.on('convert-recording', (evt, { width, height, fps }) => {
    console.info(`♻️  start converting video`);

    const run = exec(
      `ffmpeg -r ${fps} -f image2 -s ${width}x${height} -i recording-%04d.png -vcodec libx264 -crf 15  -pix_fmt yuv420p recording.mp4`,
      {
        cwd: settings.recordings.path,
      }
    );

    // waiting to be done
    run.on('exit', () => {
      console.info('✅  done converting video');
      frame.webContents.send('conversion-complete');
    });
  });
};
