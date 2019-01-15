#!/usr/bin/env node
const { exec } = require('child_process');
const argv = require('minimist')(process.argv.slice(2));

const cwd = process.cwd();
const url = argv.url || argv.u;
const configFile = argv.config || argv.c;

console.log(url);

//execute
const run = exec(
  `electron app.js --cwd ${cwd} --url ${url} --config ${configFile}`,
  {
    cwd: __dirname,
  }
);

//log
run.stdout.on('data', data => {
  process.stdout.write(data);
});
run.stderr.on('data', data => {
  process.stdout.write('⚠️  ' + data);
});

//waiting to be done
run.on('close', code => {
  console.log('👋  closing creative controls');
});
