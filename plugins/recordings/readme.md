# @CreativeControls/Recordings
Enables the editor to record a movie out by taking a series of screenshots.

## FFMPEG
To convert a sequence of png's to a movie *FFMPEG* can be used.  
To install FFMPEG on OSX:
```sh
brew update
brew install ffmpeg
```

## Settings
```js
import path from 'path';

module.exports = {
  recordings: {

    // Place to save recordings
    path: path.join(__dirname, 'recordings'),

    // Quick list of resolutions
    resolutions: ['1280x720', '1920x1080', '2560x1440', '3840x2160']

    // Enable conversion by FFMPEG
    enableFFMPEG: false
  }
}
```
