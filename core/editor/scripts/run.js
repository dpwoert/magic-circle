#!/usr/bin/env node
const path = require('path');
const argv = require('minimist')(process.argv.slice(2));
const tmp = require('tmp-promise');
const vite = require('vite');
const getRepoInfo = require('git-repo-info');

const rollup = require('rollup');
const nodeResolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const babel = require('rollup-plugin-babel');
const replace = require('rollup-plugin-replace');
const { config } = require('process');

const generateConfig = async () => {
  const config = argv.config || argv.C;
  const configFile = config
    ? path.join(process.cwd(), config)
    : path.join(process.cwd(), 'controls.config.js');

  const tmpName = await tmp.tmpName({ postfix: '.js' });

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

  // Write to HDD
  await bundle.write({ file: tmpName, format: 'esm' });

  return tmpName;
};

const run = async () => {
  // check if config file is present, if so it needs to be build
  const configPath = await generateConfig();

  const git = getRepoInfo(process.cwd());

  await vite.build({
    root: path.resolve(__dirname, '../'), // base: '/foo/',
    // build: {
    //   rollupOptions: {
    //     // ...
    //   },
    // },
    define: {
      'process.env.GIT_BRANCH': JSON.stringify(git.branch),
      'process.env.GIT_COMMIT_MESSAGE': JSON.stringify(git.commitMessage),
      'process.env.GIT_COMMIT_SHA': JSON.stringify(git.sha),
    },
    resolve: {
      alias: {
        './user-config': configPath,
      },
    },
  });

  // run build with vite
  const previewServer = await vite.preview({
    root: path.resolve(__dirname, '../'),

    // any valid user config options, plus `mode` and `configFile`
    preview: {
      port: 8080,
      open: true,
    },
  });

  previewServer.printUrls();

  // copy to correct folder
};

const serve = async () => {
  // todo
};

run();
