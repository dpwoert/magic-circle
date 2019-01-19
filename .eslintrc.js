module.exports = {
  extends: ['airbnb', 'prettier'],
  parser: 'babel-eslint',
  plugins: ['prettier'],
  env: {
    browser: true,
  },

  rules: {
    // No need to append .js extension to imports
    'global-require': 0,
    'import/extensions': 0,
    'import/no-extraneous-dependencies': 0,
    'import/no-unresolved': 0,
    'import/prefer-default-export': 0,

    'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx'] }],
    'react/prop-types': 0,
    'react/jsx-one-expression-per-line': 0,
    'react/destructuring-assignment': 0,
    'react/sort-comp': 0,
    'jsx-a11y/label-has-associated-control': 0,
    'jsx-a11y/label-has-for': 0,

    // Recommend not to leave any console.log in your code
    // Use console.error, console.warn and console.info instead
    'no-console': ['error', { allow: ['warn', 'error', 'info'] }],

    // ESLint plugin for prettier formatting
    // https://github.com/prettier/eslint-plugin-prettier
    'prettier/prettier': 'error',
  },
};
