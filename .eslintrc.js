module.exports = {
  extends: ['airbnb', 'prettier'],
  parser: 'babel-eslint',
  plugins: ['prettier'],
  env: {
    browser: true,
  },

  rules: {
    // No need to append .js extension to imports
    'import/extensions': ['error', 'always', { js: 'never' }],
    'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx'] }],
    'react/prop-types': 0,
    'global-require': 0,

    // Recommend not to leave any console.log in your code
    // Use console.error, console.warn and console.info instead
    'no-console': ['error', { allow: ['warn', 'error', 'info'] }],

    // ESLint plugin for prettier formatting
    // https://github.com/prettier/eslint-plugin-prettier
    'prettier/prettier': 'error',
  },
};
