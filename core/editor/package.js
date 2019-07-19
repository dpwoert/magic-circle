const packager = require('electron-packager');

// const globToRegExp = require('glob-to-regexp');

packager({
  name: 'MagicCircle',
  // executableName: 'Magic Circle',
  // icon: './src/assets/sn-logo.icns',
  appCopyright: 'Davey van der Woert',

  // target OS (darwin = macosx), options: linux, darwin, win32, all
  target: 'darwin',
  arch: 'x64',
  dir: './',
  out: './build',
  overwrite: true,
  asar: false,
  prune: false,
  ignore: [
    // globToRegExp('data/**/*'),
  ],
})
  .then(err => {
    if (err) {
      console.error(err);
    } else {
      console.info('app created');
    }
  })
  .catch(e => {
    console.error(e);
    process.exit(1);
  });
