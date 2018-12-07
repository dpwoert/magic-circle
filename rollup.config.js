import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';

const pkg = require(`${process.cwd()}/package.json`);

console.log(Object.keys(pkg.peerDependencies || {}));

export default {
  input: 'src/index.js',
  output: {
    name: 'creativeControls',
    file: 'dist/bundle.js',
    format: 'cjs',
  },
  external: [
    'styled-components',
    'react',
    'fs',
    // ...Object.keys(pkg.dependencies || {}),
    // ...Object.keys(pkg.peerDependencies || {})
  ],
  plugins: [
    babel({
      exclude: 'node_modules/**'
    }),
    resolve(),
    commonjs({
      namedExports: {
        'node_modules/react/index.js': ['Component', 'PureComponent', 'Fragment', 'Children', 'createElement'],
        'node_modules/react-dom/index.js': ['findDOMNode'],
      }
    }),
  ]
}
