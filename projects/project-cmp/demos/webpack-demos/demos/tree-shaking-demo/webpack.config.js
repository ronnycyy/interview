const path = require('path');

module.exports = {
  mode: 'development',
  devtool: false,
  module: {
    rules: [
      {
        test: /\.js$/
      }
    ]
  },
  entry: './src/index.js',
  output: {
    filename: '[name].js',
    path: path.join(__dirname, 'dist')
  },
  optimization: {
    usedExports: true
  }
}