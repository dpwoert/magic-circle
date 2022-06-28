const depcheck = require('depcheck');
const fs = require('fs');
const path = require('path');
const kleur = require('kleur');

const IGNORE = ['typescript', '@magic-circle/editor'];

const options = {
  ignoreBinPackage: false, // ignore the packages with bin entry
  skipMissing: false, // skip calculation of missing dependencies
  ignorePatterns: [
    // files matching these patterns will be ignored
    'dist',
    'build',
    'out',
    'proto',
    'deploy',
    'coverage',
    'runtime',
    'storybook-static',
    '*.d.ts',
    '.storybook/*.js',
  ],
  ignoreMatches: ['@types/*', '@storybook/*'],
  parsers: {
    // the target parsers
    '**/preview.js': depcheck.parser.jsx,
    '**/*.js': depcheck.parser.es6,
    '**/*.jsx': depcheck.parser.jsx,
    '**/*.ts': depcheck.parser.typescript,
    '**/*.tsx': depcheck.parser.typescript,
  },
  detectors: [
    // the target detectors
    depcheck.detector.requireCallExpression,
    depcheck.detector.importDeclaration,
  ],
  specials: [
    // the target special parsers
    depcheck.special.eslint,
    depcheck.special.tslint,
    depcheck.special.husky,
    depcheck.special.prettier,
    depcheck.special.jest,
    depcheck.special['lint-staged'],
  ],
};

let hasError = false;

const check = async (projectDir) => {
  console.info(`🔎 Scanning project directory: ${projectDir}`);

  const unused = await depcheck(projectDir, options);

  [...unused.dependencies, ...unused.devDependencies].forEach((depName) => {
    if (!IGNORE.includes(depName)) {
      console.info(
        `Unused dependency ${kleur
          .bold()
          .blue(depName)} detected in the package.json. \n${kleur.grey(
          'Remove it from the list, or ignore it in scripts/check-dependencies.js'
        )}`
      );

      hasError = true;
    }
  });

  Object.keys(unused.missing).forEach((depName) => {
    if (!IGNORE.includes(depName)) {
      console.info(
        `Dependency ${kleur
          .bold()
          .yellow(depName)} is missing in the package.json`
      );

      hasError = true;
    }
  });

  Object.keys(unused.invalidFiles).forEach((fileName) => {
    console.info(
      `${kleur
        .bold()
        .red(fileName)} can not be read while trying to detect the dependencies`
    );

    hasError = true;
  });
};

const doCheck = async () => {
  await check(path.join(__dirname, '../core/client'));
  await check(path.join(__dirname, '../core/editor'));
  await check(path.join(__dirname, '../core/styles'));
  await check(path.join(__dirname, '../core/state'));
  await check(path.join(__dirname, '../core/schema'));
  await check(path.join(__dirname, '../core/online'));

  await check(path.join(__dirname, '../plugins/seed'));
  await check(path.join(__dirname, '../plugins/performance'));
  await check(path.join(__dirname, '../plugins/screenshots'));
  await check(path.join(__dirname, '../plugins/recordings'));
  await check(path.join(__dirname, '../plugins/play-controls'));
  await check(path.join(__dirname, '../plugins/controls'));
  await check(path.join(__dirname, '../plugins/layers'));
};

doCheck();

if (hasError) {
  process.exit(1);
}
