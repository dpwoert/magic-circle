# @CreativeControls/Recordings

Enables the editor to record a movie out by taking a series of screenshots.

## FFMPEG

To convert a sequence of png's to a movie _FFMPEG_ can be used.  
To install FFMPEG on OSX:

```sh
brew update
brew install ffmpeg
```

## Settings

```js
module.exports = {
  recordings: {
    fps: [12, 24, 25, 30, 60],
  },
};
```
