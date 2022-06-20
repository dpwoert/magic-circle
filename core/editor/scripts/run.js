#!/usr/bin/env node
const path = require('path');
const argv = require('minimist')(process.argv.slice(2));
const tmp = require('tmp-promise');
const vite = require('vite');
const getRepoInfo = require('git-repo-info');

const rollup = require('rollup');
const nodeResolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');

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
      }),
      commonjs(),
    ],
  });

  // Write to HDD
  await bundle.write({ file: tmpName, format: 'esm' });

  return tmpName;
};

const generateViteSettings = async () => {
  // check if config file is present, if so it needs to be build
  const configPath = await generateConfig();
  const git = getRepoInfo(process.cwd());

  return {
    root: path.resolve(__dirname, '../'), // base: '/foo/',
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
  };
};

const build = async () => {
  const viteSettings = await generateViteSettings();

  const outDirSettings = argv.outDir || argv.O;
  const outDir = outDirSettings
    ? path.join(process.cwd(), outDirSettings)
    : path.join(process.cwd(), 'magic-circle');

  await vite.build({
    ...viteSettings,
    build: {
      outDir,
    },
  });

  console.info(`🎛  Magic Circle build to: ${outDir}`);
};

const run = async () => {
  const viteSettings = await generateViteSettings();

  await vite.build({
    ...viteSettings,
  });

  // run build with vite
  const previewServer = await vite.preview({
    root: path.resolve(__dirname, '../'),
    preview: {
      port: 8080,
      open: true,
    },
  });

  previewServer.printUrls();
};

const serve = async () => {
  const viteSettings = await generateViteSettings();

  const server = await vite.createServer({
    ...viteSettings,
    server: {
      port: 8080,
    },
  });
  await server.listen();
  server.printUrls();
};

if (argv._[0] === 'build') {
  build();
} else if (argv._[0] === 'develop') {
  serve();
} else {
  run();
}
