const { getAST, getDependecies, transform } = require('./parser');
const path = require('path');
const fs = require('fs');

// interface Module {
//   filename: string;  // 模块名
//   dependecies: Array<string>;  // 依赖模块名称
//   source: string;  // es5源码名称
// }

module.exports = class Compiler {

  constructor(options) {
    const { entry, output } = options;
    this.entry = entry;  // simplepack定义的entry, 是一个绝对路径: path.join(__dirname, './src/index.js'),
    this.output = output;  // simplepack定义的output对象
    this.modules = [];  // Array<Module>  所有需要处理的模块
  }
  
  /**
   * @return {Array<Module>} 模块实例列表
  */
  run() {
    const entryModule = this.buildModule(this.entry, true);
    this.modules.push(entryModule);
    // 遍历所有模块 (包含动态加入的模块)
    // 不使用 forEach/map 是因为它们遍历的范围在第一次调用 callbackFn 前就会确定，调用 forEach/map 后添加到数组中的项不会被 callbackFn 访问到。
    // 使用 length 检查可以保证正确，因为 push 以后 length 会增加。
    for (let i = 0; i < this.modules.length; i++) {
      // 遍历所有模块的所有依赖名，每个依赖名都进入构建，构建完了就放到数组里
      // 数组里就有了所有要处理的模块实例
      this.modules[i].dependecies.forEach(d => {
        this.modules.push(this.buildModule(d));
      })
    }
    /**
     * this.modules 得到的实例如下:
     *
     * [
     *  {
           filename: '/Users/chenyunyi/Desktop/interview/projects/demo-webpack/simplepack/src/index.js',
           dependecies: [ './greeting.js' ],
           source: '"use strict"; var _greeting = require("./greeting.js"); document.write((0, _greeting.greeting)('Jane'));'
        },
        {
          filename: './greeting.js',
          dependecies: [],
          source: `
            "use strict";
            Object.defineProperty(exports, "__esModule", { value: true });
            function greeting(name) {
              return 'hello ' + name;
            }
            exports.greeting = greeting;'
          `
         }
     * ]
     *
     * 其中 index.js 依赖于 greeting.js,  Node(greeting)->Node(index), 需要先编译完 greeting，才能编译 index (图的拓扑排序)。
    */
    // 模块实例化完毕，写到文件里，保存到硬盘上
    // emitFiles 内部会使用 this.modules，所以这里不用传。
    this.emitFiles();
  }
  
  /**
   * 传入一个模块名，返回这个模块的实例。
   *
   * 步骤:
   * 1. es6 转译成 es5
   * 2. 从 ast 分析出 dependecies
   * 3. 组合信息，返回 Module 对象
   *
   * @param {string} filename 模块名
   * @param {boolean} isEntry 主模块否?
   * @return {Module} 模块对象
   */
  buildModule(filename, isEntry) {
    let ast;
    // es6->ast
    if (isEntry) {
      // 主模块的文件名是绝对路径
      ast = getAST(filename);
    } else {
      const absolutePath = path.join(process.cwd(), './src', filename);
      ast = getAST(absolutePath);
    }
    return {
      filename,
      dependecies: getDependecies(ast),  // 结点的`入度结点们`，编译完`入度结点们`，才能到这个结点
      source: transform(ast),  // ast->es5 转译完成
    }
  }

  emitFiles() {
    const outputPath = path.join(this.output.path, this.output.filename);
    
    // 🔥精髓!: 用一个闭包把模块包裹起来，提供自定义的 require, module, exports, 笔者感觉这是借鉴了 Node.js 源码
    let stringOfModuleObject = '{';
    this.modules.forEach(m => {
      stringOfModuleObject += `
        "${m.filename}": function(require, module, exports) {
          ${m.source}
        },
      `;
    });
    stringOfModuleObject += '}'
    
    const bundle = `
      (function(modules) {
      
        // 加载模块 函数
        // webpack自定义require函数，笔者感觉它是借鉴于Node.js源码
        function require(filename) {
          // stringOfModules中，filename模块的es5源码，包裹了函数之后的样子
          var fn = modules[filename];
          // 自定义一个module实例，用户写的es6转译后的 module.exports 就是给这个实例的 exports 属性赋值，更像Node.js了
          var module = { exports: {} };
          // 执行这个包裹函数，其中会运行用户写的es6转译后的es5代码
          // 传入的 require 将覆盖 Node.js 的 require，所以用户写的 require 实际上运行的是 webpack 提供的函数。module 实例同理。
          fn(require, module, module.exports);
          // 返回用户编写的导出模块
          return module.exports;
        }
        
        // 从 entry 开始加载，entry 是一个绝对路径，通过 simplepack.config.entry 配置，本例中指向用户项目的 src/index.js。
        require("${this.entry}");
        
      })(${stringOfModuleObject})
    `;
  
    // 把 bundle 写到硬盘上
    if (!fs.existsSync(this.output.path)) {
      // 如果没有 dist, 新建 dist
      fs.mkdirSync(this.output.path);
    }
    fs.writeFile(outputPath, bundle, 'utf-8', (err) => {
      if (err) throw err;
      console.log('done');
    });
  }
}
