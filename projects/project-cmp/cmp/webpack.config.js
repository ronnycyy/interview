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
        use: [
          {
            loader: 'url-loader',
            options: {
              name: '[name]_[contenthash].[ext]',
              limit: 5 * 1024,
              outputpath: 'static/images/'
            }
          },
          {
            loader: 'image-webpack-loader',
            options: {
              mozjpeg: {
                progressive: true,
              },
              optipng: {
                enabled: false,
              },
              pngquant: {
                quality: [0.65, 0.90],
                speed: 4
              },
              gifsicle: {
                interlaced: false,
              },
              webp: {
                quality: 75
              }
            }
          }
        ]
      },
    ]
  },
  plugins: [
    new CheckerPlugin(),
    new HtmlWebpackPlugin({
      // 使用开发者自定义的模板
      template: path.resolve(__dirname, 'index.html'),
      // 引入所有资源，JS 引入到 body 标签底部，CSS 引入到 head 底部
      inject: true,
      minify: {
        // 按 HTML5 规范解析输入资源
        html5: true,
        // 去掉空格
        collapseWhitespace: true,
        // 去掉换行符
        preserveLineBreaks: false,
        // 压缩在 style 标签或者 style 属性中的 css 代码
        minifyCSS: true,
        // 压缩在 script 标签或事件属性（如 onclick）里的 js 代码
        minifyJS: true,
        // 移除注释
        removeComments: true
      }
    })
  ]
}

module.exports = merge(webpackconfig, _mergeConfig);
