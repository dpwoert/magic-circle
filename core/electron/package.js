const packager = require('electron-packager');

// const globToRegExp = require('glob-to-regexp');

packager({
  name: 'CreativeControls',
  // executableName: 'Creative Controls',
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
  .then((err, appPaths) => {
    if (err) {
      console.log(err);
    } else {
      console.info('app created');
      // console.info(appPaths[2]);
    }
  })
  .catch(e => {
    console.error(e);
    process.exit(1);
  });
