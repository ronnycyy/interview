const async = require('async');
const render = require('consolidate').handlebars.render

module.exports = function renderTemplateFiles() {
  // 返回到 metalsmith 的中间件函数
  return (files, metalsmith, done) => {
    const keys = Object.keys(files);
    // 得到所有配置，即 用户配置+默认配置
    const metalsmithMetadata = metalsmith.metadata();
    // 遍历所有文件
    async.each(keys, (file, next) => {
    
      // 拿到文件的内容
      const str = files[file].contents.toString()
    
      // do not attempt to render files that do not have mustaches
      // 没有模板语法，不需要渲染，直接下一个文件
      if (!/{{([^{}]+)}}/g.test(str)) {
        return next()
      }
    
      // 渲染数据到模板
      render(str, metalsmithMetadata, (err, res) => {
        if (err) {
          err.message = `[${file}] ${err.message}`
          return next(err)
        }
        // 渲染完毕，将字符串转成 buffer 写入文件内容。
        files[file].contents = Buffer.from(res)
      
        // 继续处理下一个文件
        next()
      })
    }, done)
  }
}
