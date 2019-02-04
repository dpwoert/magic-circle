#!/usr/bin/env node
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const argv = require('minimist')(process.argv.slice(2));

const rollup = require('rollup');
const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');

const args = {};
args.cwd = process.cwd();
args.url = argv.url || argv.u;
args.clear = argv.clear || argv.clear;

const argsStr = Object.keys(args)
  .filter(key => args[key])
  .map(key => {
    if (args[key] === true) {
      return `--${key}`;
    }
    return `--${key} ${args[key]}`;
  })
  .join(' ');

// compile settings
async function build() {
  try {
    const config = argv.config || argv.c;
    const configFile = config
      ? `${process.cwd()}/${config}`
      : `${__dirname}/default-settings.js`;

    // create a bundle
    const bundle = await rollup.rollup({
      input: configFile,
      external: ['styled-components', 'fs', 'react', 'react-dom', 'react-is'],
      plugins: [
        resolve({
          browser: true,
          customResolveOptions: {
            moduleDirectory: path.join(process.cwd(), 'node_modules'),
          },
        }),
        commonjs(),
      ],
    });

    await bundle.write({
      file: `${process.cwd()}/.settings.build.js`,
      format: 'cjs',
    });

    // execute
    const run = exec(`electron app.js ${argsStr}`, {
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
      console.info('👋  closing creative controls');

      // delete sync file again
      fs.unlinkSync(`${process.cwd()}/.settings.build.js`);
    });
  } catch (e) {
    console.error(e);
    process.exit();
  }
}

build();
