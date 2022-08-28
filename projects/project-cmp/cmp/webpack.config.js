const argv = require('yargs-parser')(process.argv.slice(2));  // ['--mode', 'production'] => { mode: 'production' }
const _mode = argv.mode || 'development';
const { merge } = require('webpack-merge');
const _mergeConfig = require(`./configs/webpack.${_mode}.js`);
const { CheckerPlugin } = require('awesome-typescript-loader');
const { resolve } = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

const webpackconfig = {
  entry: {
    app: resolve("./src/index.tsx")
  },
  output: {
    path: path.resolve(process.cwd(), 'dist'),
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx']
  },
  module: {
    rules: [
      {
        test: /\.(j|t)sx?$/,
        use: [
          {
            loader: 'thread-loader',
            options: {
              workers: 3
            }
          },
          {
            loader: 'babel-loader',
            options: {
              // 缓存上次编译结果，避免每次重新编译，减少打包时间
              cacheDirectory: true
            }
          }
        ],
        exclude: /node_modules/
      },
      {
        test: /\.less$/,
        use: [
          'style-loader',
          'css-loader',
          'postcss-loader',
          {
            loader: 'less-loader',
            options: {
              lessOptions: {
                javascriptEnabled: true,
              }
            },
          },
        ],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        use: {
          loader: 'url-loader'
        }
      },
    ]
  },
  plugins: [
    new CheckerPlugin(),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './index.html'
    })
  ]
}

module.exports = merge(webpackconfig, _mergeConfig);
