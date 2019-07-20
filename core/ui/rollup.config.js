import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import builtins from 'builtin-modules';
import replace from 'rollup-plugin-replace';
import path from 'path';

const pkg = require(`${process.cwd()}/package.json`);

export default {
  input: 'src/index.js',
  output: [
    {
      name: pkg.name,
      file: 'dist/bundle.js',
      format: 'umd',
    },
    {
      name: pkg.name,
      file: 'dist/bundle.esm.js',
      format: 'esm',
    },
  ],
  external: [
    ...builtins,
    'styled-components',
    'react',
    'react-dom',
    'react-is',
  ],
  plugins: [
    peerDepsExternal(),
    replace({
      ENV: JSON.stringify(process.env.NODE_ENV || 'development'),
      __dirname: id => `'${path.dirname(id)}'`,
    }),
    babel({
      exclude: 'node_modules/**',
      // include: 'node_modules/@magic-circle/**',
    }),
    resolve({
      browser: true,
      preferBuiltins: true,
    }),
    commonjs({
      namedExports: {
        'node_modules/react-is/index.js': [
          'isValidElementType',
          'isElement',
          'ForwardRef',
        ],
        'node_modules/react/index.js': [
          'Component',
          'PureComponent',
          'Fragment',
          'Children',
          'createElement',
          'cloneElement',
          'createContext',
        ],
        'node_modules/react-dom/index.js': ['findDOMNode'],
      },
    }),
  ],
};
