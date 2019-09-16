const packager = require('electron-packager');
const fs = require('fs');
const pkg = require('./package.json');

const executableName = pkg.executableName; // eslint-disable-line
const name = pkg.executableName;

if (process.platform !== 'darwin') {
  throw new Error('⚠️ this editor can only be build on OSX for now...');
}

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
})
  .then(path => {
    // Create reference to app created
    const app = {
      name,
      executableName,
      namespace: pkg.name.split('/')[0],
      buildDir: path[0],
      environment: process.env.NODE_ENV || 'development',
    };
    fs.writeFileSync('build/app.json', JSON.stringify(app));

    console.info('app created');
  })
  .catch(e => {
    console.error('error during build', e);
    process.exit(1);
  });
