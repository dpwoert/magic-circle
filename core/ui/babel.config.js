module.exports = function(api) {
  api.cache(true);

  const presets = ['@babel/preset-react'];
  const plugins = [
    '@babel/plugin-proposal-class-properties',
    'babel-plugin-styled-components',
    'inline-react-svg',
  ];

  return {
    presets,
    plugins,
    ignore: [filename => filename.indexOf('node_modules') > -1],
  };
};
