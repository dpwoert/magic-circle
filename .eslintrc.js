module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'react-hooks', 'prettier'],
  extends: [
    'eslint-config-airbnb-base',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  env: {
    browser: true,
  },
  globals: {},
  rules: {
    // No need to append .js extension to imports
    'global-require': 0,
    'import/extensions': 0,
    'import/no-extraneous-dependencies': 0,
    'import/no-unresolved': 0,
    'import/prefer-default-export': 0,
    'arrow-body-style': 0,
    'import/no-anonymous-default-export': 0,
    'default-param-last': 0,
    'no-restricted-exports': 0,
    'import/no-named-default': 0,
    // 'import/no-cycle': 2,

    // Typescript
    '@typescript-eslint/no-explicit-any': 0,
    '@typescript-eslint/explicit-module-boundary-types': 0,
    '@typescript-eslint/ban-ts-comment': 0,
    'no-shadow': 0,
    'no-use-before-define': [0],
    '@typescript-eslint/no-use-before-define': [1],
    'lines-between-class-members': 0,

    // React
    // 'react/jsx-filename-extension': [
    //   1,
    //   { extensions: ['.js', '.jsx', '.ts', '.tsx'] },
    // ],
    'react/prop-types': 0,
    'react/jsx-one-expression-per-line': 0,
    'react/destructuring-assignment': 0,
    'react/sort-comp': 0,
    'react/require-default-props': 0,
    'react/jsx-props-no-spreading': 0,
    'react/no-unused-prop-types': 0,
    'jsx-a11y/label-has-associated-control': 0,
    'jsx-a11y/label-has-for': 0,
    'jsx-a11y/anchor-is-valid': 0,
    'jsx-a11y/mouse-events-have-key-events': 0,
    'jsx-a11y/accessible-emoji': 0,
    'jsx-a11y/no-static-element-interactions': 0,
    'react-hooks/exhaustive-deps': [
      'error',
      {
        additionalHooks: '(useRecoilCallback|useAsync|useAsyncRetry)',
      },
    ],

    'class-methods-use-this': 0,
    'no-await-in-loop': 0,
    'max-classes-per-file': 0,

    // Next specific
    '@next/next/no-img-element': 0,

    // Recommend not to leave any console.log in your code
    // Use console.error, console.warn and console.info instead
    'no-console': ['error', { allow: ['warn', 'error', 'info'] }],

    // ESLint plugin for prettier formatting
    // https://github.com/prettier/eslint-plugin-prettier
    'prettier/prettier': 'error',

    'no-restricted-globals': [
      'error',
      {
        name: 'ipcRenderer',
        message:
          'Do not use the ipcRenderer global, instead import from utils/ipc-tools',
      },
    ],

    'no-restricted-imports': [
      'error',
      {
        name: 'electron',
        importNames: ['ipcMain'],
        message:
          'Do not use the ipcMain directly, instead use the utils/ipc wrappers',
      },
    ],
  },
  overrides: [
    {
      files: ['*d.ts'],
      rules: {
        camelcase: 0,
        'spaced-comment': 0,
        '@typescript-eslint/no-empty-interface': 0,
      },
    },
    {
      files: ['scripts/**/*.js'],
      rules: {
        camelcase: 0,
        '@typescript-eslint/no-var-requires': 0,
        '@typescript-eslint/no-empty-function': 0,
      },
    },
    {
      files: ['core/{editor,styles,online}/scripts/**/*.js'],
      rules: {
        '@typescript-eslint/no-var-requires': 0,
      },
    },
    {
      files: ['*.test.ts'],
      rules: {
        'no-new': 0,
      },
    },
  ],
};
