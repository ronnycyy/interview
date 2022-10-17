const fs = require('fs');
const babylon = require('babylon');
const traverse = require('babel-traverse').default;
const { transformFromAst } = require('babel-core');

// interface ASTNode {
//   type: string;
//   start: number;
//   end: number;
//   loc: SourceLocation;
//   source: Node;
// }

module.exports = {
  // es6->ast
  // 请传递`绝对路径`
  getAST: (path) => {
    // 源码字符串
    const source = fs.readFileSync(path, 'utf-8');
    // 从源码解析出 AST
    return babylon.parse(source, { sourceType: 'module' });
  },
  // ast->dependecies
  getDependecies: (ast) => {
    // Array<string>  import引入的模块
    const dependecies = [];
    traverse(ast, {
      /**
       * @param {Node} node AST结点
       */
      ImportDeclaration: ({ node }) => {
        // 从结点中获取所有依赖模块 "./greeting"
        dependecies.push(node.source.value);
      }
    })
    return dependecies;
  },
  // ast->es5
  transform: (ast) => {
    const { code } = transformFromAst(ast, null, {
      presets: ['env']
    });
    
    return code;
  }
}
