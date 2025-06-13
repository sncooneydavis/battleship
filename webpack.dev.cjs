// webpack.dev.cjs

const path = require('path');
const { merge } = require('webpack-merge');
const common = require('./webpack.common.cjs');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'eval-source-map',
  devServer: {
    static: {
      directory: path.resolve('./dist'),
    },
    port: 8080,
    open: true,
    hot: true,
    watchFiles: ['./src/template.html'],
    historyApiFallback: true,
  },
});
