const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const CompressionPlugin = require("compression-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');

module.exports = {
  module: {
    rules: [
      {
        test: /\.less$/,
        use: [
          MiniCssExtractPlugin.loader,
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
      }
    ]
  },
  optimization: {
    // 开发环境下启用 CSS 优化
    minimize: true,
    minimizer: [
      new CssMinimizerPlugin(),
      new TerserPlugin({
        parallel: false,
      })
    ],
    // 分包
    splitChunks: {
      // chunks: 'all', // chunk 可以在异步和非异步 chunk 之间共享。
      // minSize: 20000,  // 20KB  生成 chunk 的最小体积（以 bytes 为单位）, 20K以下的依赖不做拆分.
      // maxSize: 51200,  // 50KB  最大 chunk 50KB
      // maxInitialSize: 102400,  // 100KB
      // minRemainingSize: 0,
      // minChunks: 1,  // 拆分前必须共享模块的最小 chunks 数。
      // maxAsyncRequests: 30,   // 按需加载时的最大并行请求数。
      // maxInitialRequests: Infinity,  // 入口点的最大并行请求数。
      cacheGroups: {
        antdGroup: {
          test: /[\\/]node_modules[\\/](antd)[\\/]/,
          name: 'vendor-antd',
          chunks: 'all',
        },
        reactGroup: {
          test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
          name: 'vendor-react',
          chunks: 'all',
        },
      },
      // usedExports: true
    },
  },
  plugins: [
    new CleanWebpackPlugin(),
    // new BundleAnalyzerPlugin(),
    new MiniCssExtractPlugin(),
    new CompressionPlugin(),
    new HardSourceWebpackPlugin()
  ]
}