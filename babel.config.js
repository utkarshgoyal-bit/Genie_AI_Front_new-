module.exports = function (api) {
  api.cache(true);

  // Detect production environment
  const isProduction = process.env.NODE_ENV === 'production' ||
                       process.env.BABEL_ENV === 'production';

  const plugins = [];

  // Remove console.log statements in production builds
  if (isProduction) {
    plugins.push(['transform-remove-console', {
      exclude: ['error', 'warn'] // Keep console.error and console.warn for debugging
    }]);
  }

  return {
    presets: ['babel-preset-expo'],
    plugins: plugins,
  };
};
