const packager = require('electron-packager');
const fs = require('fs');
const pkg = require('./package.json');

const { executableName } = pkg.executableName;
const namespace = pkg.name.split('/')[0];
const name = namespace.replace('@', '');

packager({
  name,
  executableName,
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
  .then(path => {
    // Create reference to app created
    const app = {
      name,
      executableName,
      namespace: pkg.name.split('/')[0],
      buildDir: path[0],
    };
    fs.writeFileSync('./app.json', JSON.stringify(app));

    console.info('app created');
  })
  .catch(e => {
    console.error('error during build', e);
    process.exit(1);
  });
