# @CreativeControls/Screenshots

Enables the editor to save screenshots including a snapshot of the app's current state, this snapshot can then be restored at a later time.

## Settings

```js
module.exports = {
  screenshots: {
    // Save the current git state into the snapshot
    gitInfo: true,

    // Use a different directory if the URL of the frame changes
    directoryBasedOnFrameUrl: false,
  },
};
```
