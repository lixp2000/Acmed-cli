#!/usr/bin/env node
/**
 * Author: Barry_li
 * created: 2019-12-06
 */

const fs = require("fs-extra");
const path = require("path");
const program = require("commander");
const chalk = require("chalk");
const ora = require("ora");
const download = require("download-git-repo");
const validateProjectName = require("validate-npm-package-name");
// const vfs = require('vinyl-fs');
const tplObj = require(`${__dirname}/../template`);

program.parse(process.argv);
// 当没有输入参数的时候给个提示
if (program.args.length < 1) return program.help();

// 好比 vue init webpack project-name 的命令一样，第一个参数是 webpack，第二个参数是 project-name
let templateName = program.args[0];
let projectName = program.args[1];

if (!tplObj[templateName]) {
  console.log(chalk.red("\n Template does not exit! \n "));
  return;
}
if (!projectName) {
  console.log(chalk.red("\n Project should not be empty! \n "));
  return;
}

// 判断所取得项目名称是否符合规范
const result = validateProjectName(projectName);
if (!result.validForNewPackages) {
  console.error(
    chalk.red(`\n Invalid project name: "${chalk.cyan(projectName)}"`)
  );
  result.errors &&
    result.errors.forEach(err => {
      console.error(chalk.red.dim(`\n Error: ${err}`));
    });
  result.warnings &&
    result.warnings.forEach(warn => {
      console.error(chalk.red.dim(`\n  Warning: ${warn}`));
    });
  process.exit(1);
}

const url = tplObj[templateName];

// 检测当前文件夹下是否有相同的文件夹
const cwd = process.cwd();
const targetDir = path.resolve(cwd, projectName);
const appDir = path.join(cwd, `./${projectName}`)

if (fs.existsSync(targetDir)) {
  console.log(
    chalk.white(
      `\n Target directory ${chalk.cyan(targetDir)} already exists \n`
    )
  );
  return;
}

//下载模板 选择模板
//通过配置文件，获取模板信息
const spinner = ora('downloading template...')
spinner.start()
// 执行下载方法并传入参数
download(url, projectName, err => {
  if (err) {
    spinner.fail();
    console.log(chalk.red(`Generation failed. ${err}`));
    return;
  }
  spinner.succeed();
  const app = path.basename(appDir);
  // 修改package中nane的名称
  const configPath = `${appDir}/package.json`;
  const configFile = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
  configFile.name = `${projectName}`;
  fs.writeFileSync(configPath, JSON.stringify(configFile, null, 2));
  console.log(chalk.green(`\n Success! Created ${app} project complete!`));
  console.log("\n To get started");
  console.log(`\n    cd ${app}`);
  console.log(`\n    yarn install \n`);
  console.log(`\n    yarn serve \n`);
  process.exit();
})
