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
  }
}
```
