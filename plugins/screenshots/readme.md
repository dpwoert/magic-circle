# @CreativeControls/Screenshots
Enables the editor to save screenshots including a snapshot of the app's current state, this snapshot can then be restored at a later time.

## Settings
```js
import path from 'path';

module.exports = {
  screenshots: {

    // Place to save screenshots
    path: path.join(__dirname, 'screenshots'),

    // Save the current git state into the snapshop
    gitInfo: true,

    // Quick list of resolutions
    resolutions: [
      '800x600',
      '1024x768',
      '1400x768',
      '1080x720',
      '1920x1080',
      '3840×2160',
    ]
  }
}
```
