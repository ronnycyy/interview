#!/usr/bin/env node

const request = require('request');
const chalk = require('chalk');


request({
  url: 'http://localhost:3000/list',
  headers: {
    'User-Agent': 'td-cli'
  }
}, (err, res, body) => {

  if (err) {
    console.error(err);
    return;
  }

  const requestBody = JSON.parse(body);

  if (Array.isArray(requestBody)) {
    console.log('  所有可用模板如下:')
    console.log()
    requestBody.forEach(repo => {
      console.log(
        '  ' + chalk.yellow('★') +
        '  ' + chalk.blue(repo.name) +
        ' - ' + repo.desc)
    })
  } else {
    console.error(requestBody.message)
  }
})