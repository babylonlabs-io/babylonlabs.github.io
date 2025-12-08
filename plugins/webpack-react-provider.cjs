const webpack = require('webpack');

module.exports = function (context, options) {
  return {
    name: 'webpack-react-provider',
    configureWebpack(config, isServer) {
      return {
        plugins: [
          new webpack.ProvidePlugin({
            React: require.resolve('react'),
          }),
        ],
      };
    },
  };
};

