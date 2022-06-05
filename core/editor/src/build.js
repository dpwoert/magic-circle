#!/usr/bin/env node
const path = require('path');
const argv = require('minimist')(process.argv.slice(2));

const rollup = require('rollup');
const nodeResolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const babel = require('rollup-plugin-babel');
const replace = require('rollup-plugin-replace');

const build = async () => {
  const config = argv.config || argv.C;
  const configFile = config
    ? path.join(process.cwd(), config)
    : path.join(process.cwd(), 'controls.config.js');

  console.log({ configFile });

  // create a bundle
  const bundle = await rollup.rollup({
    input: configFile,
    // external: ['styled-components', 'fs', 'react', 'react-dom', 'react-is'],
    plugins: [
      nodeResolve({
        browser: true,
        // customResolveOptions: {
        //   moduleDirectory: path.join(process.cwd(), 'node_modules'),
        // },
      }),
      // replace({
      //   __dirname: id => `'${path.dirname(id)}'`,
      // }),
      commonjs(),
    ],
  });

  await bundle.write({
    file: path.join(process.cwd(), '.settings.build.js'),
    format: 'cjs',
  });

  // to do copy other files over?
};

console.log('pre build run');

build();
