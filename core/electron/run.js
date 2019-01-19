#!/usr/bin/env node
const { exec } = require('child_process');
const argv = require('minimist')(process.argv.slice(2));

const args = {};
args.cwd = process.cwd();
args.url = argv.url || argv.u;
args.config = argv.config || argv.c;
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
});
