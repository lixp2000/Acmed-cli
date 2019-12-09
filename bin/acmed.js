#!/usr/bin/env node
/**
 * Author: Barry_li
 * created: 2019-12-06
 */

const program = require('commander')

// 定义当前版本
// 定义使用方法
// 定义指令

// program
//   .version(require('../package').version)
//   .usage('<command> [options]')
//   .command('add', 'add a new template')
//   .command('delete', 'delete a template')
//   .command('list', 'list all the templates')
//   .command('create', 'generate a new project from a template')

program
  .version(require('../package').version)
  .usage('<command> [options]')

// 创建模板项目
program
  .command('create <template-name> [project-name]')
  .description('create a new project from a template')
  .action(() => {
    require('./acmed-create.js')
  })

// 新增模板
program
  .command('add')
  .description('add a new template')
  .action(() => {
    require('./acmed-add.js')
  })

// 删除模板
program
  .command('delete')
  .description('delete a new template')
  .action(() => {
    require('./acmed-delete.js')
  })

// 查看模板列表
program
  .command('list')
  .description('list all the templates')
  .action(() => {
    require('./acmed-list.js')
  })

// 解析命令行参数
program.parse(process.argv)

if (!process.argv.slice(2).length) {
  program.outputHelp()
}
