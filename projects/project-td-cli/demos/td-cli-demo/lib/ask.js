const async = require("async");
const inquirer = require("inquirer");

const promptMapping = {
  string: 'input',
  boolean: 'confirm'
}

module.exports = function askQuestions(prompts) {
  return (files, metalsmith, done) => {
    ask(prompts, metalsmith.metadata(), done);
  }
}

function ask (prompts, data, done) {
  const canuse = ['name', 'description', 'author'];
  async.eachSeries(Object.keys(prompts).filter(k => canuse.includes(k)), (key, next) => {
    prompt(data, key, prompts[key], next)
  }, done)
}

function prompt (data, key, prompt, done) {
  let promptDefault = prompt.default
  
  inquirer.prompt([{
    type: promptMapping[prompt.type] || prompt.type,
    name: key,
    message: prompt.message || prompt.label || key,
    default: promptDefault,
    choices: prompt.choices || [],
    validate: prompt.validate || (() => true)
  }]).then(answers => {
    if (Array.isArray(answers[key])) {
      data[key] = {}
      answers[key].forEach(multiChoiceAnswer => {
        data[key][multiChoiceAnswer] = true
      })
    } else if (typeof answers[key] === 'string') {
      data[key] = answers[key].replace(/"/g, '\\"')
    } else {
      data[key] = answers[key]
    }
    done()
  }).catch(done)
}
