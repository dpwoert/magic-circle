# @CreativeControls/Screenshots
Creates screenshots [todo]

## Settings
```js
import Screenshots from '@creative-controls/screenshots';
import path from 'path';

{
  plugins: defaultPlugins => [...defaultPlugins, Screenshots],
  screenshots: {
    path: path.join(__dirname, 'screenshots'),
    gitInfo: true,
  }
  ...
}
```
