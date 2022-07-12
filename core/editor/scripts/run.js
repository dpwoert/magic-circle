#!/usr/bin/env node
const path = require('path');
const fs = require('fs');
const argv = require('minimist')(process.argv.slice(2));
const vite = require('vite');
const getRepoInfo = require('git-repo-info');

const rollup = require('rollup');
const nodeResolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const babel = require('rollup-plugin-babel');
const json = require('@rollup/plugin-json');

const filesToDelete = [];

// Cleanup helpers
process.addListener('exit', () => {
  filesToDelete.forEach((f) => fs.unlinkSync(f));
});
process.on('SIGINT', () => {
  process.exit();
});

const generateConfig = async () => {
  const config = argv.config || argv.C;
  const configFile = config
    ? path.join(process.cwd(), config)
    : path.join(process.cwd(), 'magic.config.js');

  const tmpName = path.join(__dirname, '../build.tmp.js');

  // create a bundle
  const bundle = await rollup.rollup({
    input: configFile,
    external: [
      'styled-components',
      '@magic-circle/styles',
      'react',
      'react-dom',
      'react-is',
    ],
    plugins: [
      nodeResolve({
        browser: true,
        rootDir: process.cwd(),
        extensions: ['.mjs', '.js', '.jsx', '.json'],
      }),
      json(),
      commonjs(),
      babel({ presets: [require('@babel/preset-react')] }),
    ],
  });

  // Write to HDD
  await bundle.write({ file: tmpName, format: 'esm' });

  // Ensure we clean this file on close
  filesToDelete.push(tmpName);

  return tmpName;
};

const generateViteSettings = async (dev) => {
  // check if config file is present, if so it needs to be build
  const configPath = await generateConfig();
  const git = getRepoInfo(process.cwd());

  return {
    root: path.resolve(__dirname, '../'), // base: '/foo/',
    define: {
      'process.env.BUILD_ENV': JSON.stringify(dev ? 'develop' : 'production'),
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
  const viteSettings = await generateViteSettings(false);

  const outDirSettings = argv.outDir || argv.O;
  const outDir = outDirSettings
    ? path.join(process.cwd(), outDirSettings)
    : path.join(process.cwd(), 'magic-circle');

  await vite.build({
    ...viteSettings,
    build: {
      outDir,
    },
    base: argv.base,
  });

  console.info(`🎛  Magic Circle build to: ${outDir}`);
};

const run = async () => {
  const viteSettings = await generateViteSettings(true);

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
  const viteSettings = await generateViteSettings(true);

  const server = await vite.createServer({
    ...viteSettings,
    server: {
      port: 8080,
    },
  });
  await server.listen();
  server.printUrls();
};

const init = async () => {
  const templateFile = path.join(__dirname, '../src/app/template-config.js');
  const configFile = path.join(process.cwd(), 'magic.config.js');

  if (!fs.existsSync(configFile)) {
    await fs.promises.copyFile(
      templateFile,
      path.join(process.cwd(), 'magic.config.js')
    );
  }
};

if (argv._[0] === 'init') {
  init();
} else if (argv._[0] === 'build') {
  build();
} else if (argv._[0] === 'develop') {
  serve();
} else {
  run();
}
