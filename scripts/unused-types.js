const path = require('path');
const kleur = require('kleur');
const analyzeTsConfig = require('ts-unused-exports').default;

let hasError = false;

const test = (base) => {
  const result = analyzeTsConfig(
    path.join(__dirname, '../', base, 'tsconfig.json')
  );

  Object.keys(result).forEach((pathName) => {
    const error = result[pathName];
    const relativePath = kleur.underline(
      path.relative(process.cwd(), pathName)
    );
    const errors = error
      .filter(() => {
        // instead of adding exceptions here, you can also use:
        // ts-unused-exports:disable-next-line

        if (pathName.includes('index.ts')) {
          return false;
        }
        if (pathName.includes('utils/easing')) {
          return false;
        }
        if (pathName.includes('utils/math')) {
          return false;
        }

        return true;
      })
      .map(
        (error) =>
          `${kleur.bold().red(error.exportName)}(${kleur.grey(
            error.location ? error.location.line : '?'
          )})`
      );

    if (errors.length > 0) {
      hasError = true;
      console.info(`Unused exports for ${relativePath}: ${errors.join(', ')}`);
    }
  });
};

test('core/online');
test('core/editor');
test('core/client');
test('core/styles');
test('core/state');
test('core/schema');
test('plugins/layers');
test('plugins/seed');
test('plugins/screenshots');
test('plugins/recordings');
test('plugins/controls');
test('plugins/performance');

if (hasError) {
  process.exit(1);
}
