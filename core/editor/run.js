#!/usr/bin/env node
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const argv = require('minimist')(process.argv.slice(2));
const singleLineLog = require('single-line-log').stdout;

const rollup = require('rollup');
const nodeResolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const babel = require('rollup-plugin-babel');
const replace = require('rollup-plugin-replace');

// compile settings
async function build() {
  /* eslint-disable import/no-dynamic-require */
  const app = require(path.join(__dirname, 'build/app.json'));
  /* eslint-enable import/no-dynamic-require */

  const buildPath = path.join(
    __dirname,
    app.buildDir,
    `${app.name}.app`,
    'Contents/Resources/app',
    'settings.build.js'
  );

  if (process.platform !== 'darwin') {
    throw new Error('⚠️ this editor can only run on OSX for now...');
  }

  const args = {};
  args.cwd = process.cwd();
  args.url = argv.url || argv.u;
  args.clear = argv.clear;
  args.debug = argv.d || argv.debug;
  args.inspect = argv.i || argv.inspect;
  args.CI = !!process.env.CI;
  args.settings =
    app.environment === 'production'
      ? buildPath
      : path.join(process.cwd(), '.settings.build.js');

  const argsStr = Object.keys(args)
    .filter(key => args[key])
    .map(key => {
      if (args[key] === true) {
        return `--${key}`;
      }
      return `--${key} ${args[key]}`;
    })
    .join(' ');

  try {
    const config = argv.config || argv.c;
    const configFile = config
      ? `${process.cwd()}/${config}`
      : `${__dirname}/src/default-settings.js`;

    // create a bundle
    const bundle = await rollup.rollup({
      input: configFile,
      external: ['styled-components', 'fs', 'react', 'react-dom', 'react-is'],
      plugins: [
        nodeResolve({
          browser: true,
          customResolveOptions: {
            moduleDirectory: path.join(process.cwd(), 'node_modules'),
          },
        }),
        replace({
          __dirname: id => `'${path.dirname(id)}'`,
        }),
        babel({
          exclude: '**/node_modules/**',
          presets: ['@babel/preset-react'],
          runtimeHelpers: true,
          plugins: [
            '@babel/plugin-proposal-class-properties',
            'babel-plugin-styled-components',
          ],
        }),
        commonjs(),
      ],
    });

    await bundle.write({
      file: args.settings,
      format: 'cjs',
    });

    // execute
    const cmd = args.debug
      ? 'electron'
      : path.join(
          __dirname,
          app.buildDir,
          `${app.name}.app`,
          `Contents/MacOS/${app.executableName}`
        );

    const run = exec(`"${cmd}" src/app.js ${argsStr}`, {
      cwd: __dirname,
    });

    // log
    run.stdout.on('data', data => {
      process.stdout.write(data);
    });
    run.stderr.on('data', data => {
      process.stdout.write(`⚠️  ${data}`);
    });

    // waiting to be done
    run.on('close', () => {
      console.info('👋  closing Magic Circle');

      // delete sync file again if needed
      if (args.debug) {
        fs.unlinkSync(path.join(process.cwd(), '.settings.build.js'));
      }
    });
  } catch (e) {
    console.error(e);
    process.exit();
  }
}

function buildApp() {
  console.info('👷‍  First time running Magic Circle, building the app now');

  const dev = fs.existsSync('./env.json');

  return new Promise(resolve => {
    const run = exec(
      `npm run package:${dev ? 'dev' : 'prod'} ${dev ? '' : '-- --install'}`,
      {
        cwd: __dirname,
      }
    );

    // log
    run.stdout.on('data', data => {
      singleLineLog(data);
    });
    run.stderr.on('data', data => {
      process.stderr.write(`⚠️  ' ${data}`);
      // reject(data)
    });

    // waiting to be done
    run.on('exit', () => {
      console.info('✅  done!');
      resolve();
    });
  });
}

async function detectBuild() {
  // detect if app has been build before
  if (!fs.existsSync(path.join(__dirname, 'build'))) {
    await buildApp();
  }

  build();
}

detectBuild();
