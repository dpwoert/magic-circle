# @CreativeControls/Debug
Enables the app to be debugged.

## Settings
```js
import Fullscreen from '@creative-controls/debug';

module.exports = {
  plugins: defaultPlugins => [...defaultPlugins, Debug],
  debug: {

    // Displays button in editor
    button: true,

    // Enables the user to see the debug
    editor: true,

    // Displays the current git state in the menu bar
    gitInfo: true,
  }
  ...
}
```
