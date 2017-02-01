const path = require('path');
const webpack = require('webpack');

const PATHS = {
  demo: path.join(__dirname, 'demo', 'js', 'main.js'),
  build: path.join(__dirname),
};

module.exports = {
  entry: {
    demo: PATHS.demo,
  },
  devtool: 'eval-source-map',
  devServer: {
    noInfo: true,
    inline: true,
  },
  output: {
    path: PATHS.build,
    filename: '[name].bundle.js',
  },
  module: {
    rules: [
      { test: __dirname,
        exclude: /(node_modules|asset)/,
        loader: 'babel-loader',
      },
    ],
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({ minimize: true }),
  ],
  resolve: {
    modules: [
      __dirname,
      'node_modules',
    ],
  },
};
