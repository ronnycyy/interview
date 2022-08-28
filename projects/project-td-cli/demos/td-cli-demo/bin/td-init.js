#!/usr/bin/env node

const chalk = require('chalk');
const inquirer = require('inquirer');
const ora = require('ora');
const { program } = require('commander');
const download = require('download-git-repo');
const fs = require('fs');
const path = require('path');
const generate = require('../lib/generate');
const rm = require('rimraf').sync
const home = require('user-home')

program
  .description('基于一个业务模板创建一个项目')
  .usage('<template-name> <project-name>')

program.on('--help', () => {
  console.log('  Examples:')
  console.log()
  console.log(chalk.gray('    # 基于 `内置网页` 模板新建一个项目'))
  console.log('    $ td init device my-project')
  console.log()
  console.log(chalk.gray('    # 基于 `管理平台` 模板新建一个项目'))
  console.log('    $ td init manager my-project')
  console.log()
  console.log(chalk.gray('    # 基于 `SDK` 模板新建一个项目'))
  console.log('    $ td init sdk my-project')
  console.log()
})

program.parse(process.argv);


/**
 * 主逻辑
 */
function main() {

  // 传参错误处理
  if (program.args.length < 2) {
    return program.help();
  }

  const templateName = program.args[0];
  const projectName = program.args[1];

  console.log(`[创建项目: ${projectName}]`);

  const url = `direct:git@gitlab.com:td-cli-demo-templates/${templateName}.git`;
  const templatePath = path.join(home, `.td-templates/${templateName}`);
  const projectPath = path.resolve(__dirname, '../projects', projectName);
  
  return generate(projectName, templatePath, projectPath);
  
  // 保证目的地为空, 不然 download-git-repo 这个傻逼库会报 128。
  if (fs.existsSync(templatePath)) {
    rm(templatePath);
  }

  const spinner = ora(`正在下载模板: ${url}...`);
  spinner.start();

  download(
    url,
    templatePath,
    { clone: true, checkout: false },
    function (err) {

      spinner.stop();

      if (err) {
        console.error(err);
        return;
      }

      console.log();
      console.log(`模板已下载到 ${templatePath}`);
      console.log();

      generate(projectName, templatePath, projectPath);
    })
}

main();
