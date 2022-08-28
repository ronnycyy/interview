// 主命令

const { program } = require('commander');

module.exports = function main() {

  program
    .version(require('../package').version)
    .usage('<command> [son command] [options]')
    .command('init', '根据一个业务模板, 生成项目')   // 寻找 bin/td-init.js
    .command('list', '列出所有业务模板')

  program.parse(process.argv)
}