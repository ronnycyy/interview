const { join } = require('path');
const WebpackBuildNotifierPlugin = require('webpack-build-notifier');

module.exports = {
  // 热更新
  devServer: {
    contentBase: join(__dirname, '../dist'),
    hot: true,
    port: 3000
  },
  plugins: [
    // 系统级别的构建消息通知
    new WebpackBuildNotifierPlugin({
      title: "My Webpack Project",
      // logo: path.resolve("./img/favicon.png"),
      suppressSuccess: true,
    })
  ]
}