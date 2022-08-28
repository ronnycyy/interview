const Metalsmith = require('metalsmith');
const path = require('path');
const askQuestions = require("./ask");
const renderTemplateFiles = require('./renderTemplateFiles');


module.exports = function generate(projectName, templatePath, projectPath) {

  // 组合 meta 对象
  const opts = getOptions(projectName, templatePath);

  // 用模板地址作为源，初始化一个 Metalsmith 构建者
  const metalsmith = Metalsmith(path.join(templatePath, 'template'));

  // 收集用户配置
  // 渲染数据到项目中
  metalsmith.use(askQuestions(opts.prompts))
    .use(renderTemplateFiles())
    
  // source 是模板
  // destination 是项目要生成到的地址
  metalsmith
    .clean(false)
    .source('.')
    .destination(projectPath)
    .build((err, files) => {
      console.log(`[metalsmith] 项目已生成: ${projectPath}`);
    })
}

// 组合用户设置的项目名称，再返回 meta 对象。
function getOptions(projectName, templatePath) {
  const opts = getMetadata(templatePath)
  setDefault(opts, 'name', projectName)
  return opts
}

// 取得 meta.js 的导出对象
function getMetadata(templatePath) {
  const js = path.join(templatePath, 'meta.js')
  let opts = {}

  // 直接 require 加载 meta.js 这个模块 (module.exports)，真聪明!
  const req = require(path.resolve(js))
  if (req !== Object(req)) {
    throw new Error('meta.js needs to expose an object')
  }
  opts = req

  return opts
}

function setDefault(opts, key, val) {
  if (opts.schema) {
    opts.prompts = opts.schema
    delete opts.schema
  }
  const prompts = opts.prompts || (opts.prompts = {})
  if (!prompts[key] || typeof prompts[key] !== 'object') {
    prompts[key] = {
      'type': 'string',
      'default': val
    }
  } else {
    prompts[key]['default'] = val
  }
}
