const path = require('path')
const webpack = require('webpack')

const PATHS = {
  demo: path.join(__dirname, 'demo', 'js', 'main.js'),
  build: path.join(__dirname),
}

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
      {
        test: __dirname,
        exclude: /(node_modules|asset)/,
        loader: 'babel-loader',
        options: {
          presets: ['flow'],
        },
      },
    ],
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({ minimize: true }),
    new webpack.ProvidePlugin({
      three: 'three',
    }),
  ],
  resolve: {
    modules: [__dirname, 'node_modules'],
    alias: {
      demo: 'demo/js',
    },
  },
}
