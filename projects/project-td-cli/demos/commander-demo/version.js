const { program } = require('commander');

program
  .option('-v, --version');

/**
 * process.argv 是 node 进程的输入，它是一个数组, 包含: node的位置，脚本的位置，输入的参数。
 * [ 
 *  '/usr/local/bin/node',
 *  '/Users/chenyunyi/Desktop/front-end-interview/projects/td-cli/commander-demo/version.js',
 *  '-v'
 * ]
 */
program.parse(process.argv);

// { version: true }
const options = program.opts();

// 打印版本号
if (options.version) {
  console.log('v1.0.0');
}