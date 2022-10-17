
(function (modules) {

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
  require("/Users/chenyunyi/Desktop/interview/projects/demo-webpack/simplepack/src/index.js");

})({
  "/Users/chenyunyi/Desktop/interview/projects/demo-webpack/simplepack/src/index.js": function (require, module, exports) {
    "use strict";

    var _greeting = require("./greeting.js");

    document.write((0, _greeting.greeting)('Jane'));
  },

  "./greeting.js": function (require, module, exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.greeting = greeting;
    function greeting(name) {
      return 'hello ' + name;
    }
  },
})
