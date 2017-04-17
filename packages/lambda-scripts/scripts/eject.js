// @remove-file-on-eject
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */
'use strict';

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', err => {
  throw err;
});

const fs = require('fs-extra');
const path = require('path');
const spawnSync = require('cross-spawn').sync;
const chalk = require('chalk');
const prompt = require('lambda-dev-utils/prompt');
const paths = require('../config/paths');
const createJestConfig = require('./utils/createJestConfig');

const green = chalk.green;
const cyan = chalk.cyan;

prompt(
  'Are you sure you want to eject? This action is permanent.',
  false
).then(shouldEject => {
  if (!shouldEject) {
    console.log(cyan('Close one! Eject aborted.'));
    process.exit(1);
  }

  console.log('Ejecting...');

  const ownPath = paths.ownPath;
  const appPath = paths.appPath;

  function verifyAbsent(file) {
    if (fs.existsSync(path.join(appPath, file))) {
      console.error(
        `\`${file}\` already exists in your app folder. We cannot ` +
          'continue as you would lose all the changes in that file or directory. ' +
          'Please move or delete it (maybe make a copy for backup) and run this ' +
          'command again.'
      );
      process.exit(1);
    }
  }

  const folders = ['config', 'config/jest', 'scripts', 'scripts/utils'];

  // Make shallow array of files paths
  const files = folders.reduce(
    (files, folder) => {
      return files.concat(
        fs
          .readdirSync(path.join(ownPath, folder))
          // set full path
          .map(file => path.join(ownPath, folder, file))
          // omit dirs from file list
          .filter(file => fs.lstatSync(file).isFile())
      );
    },
    []
  );

  // Ensure that the app folder is clean and we won't override any files
  folders.forEach(verifyAbsent);
  files.forEach(verifyAbsent);

  console.log();
  console.log(cyan(`Copying files into ${appPath}`));

  folders.forEach(folder => {
    fs.mkdirSync(path.join(appPath, folder));
  });

  files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');

    // Skip flagged files
    if (content.match(/\/\/ @remove-file-on-eject/)) {
      return;
    }
    content = content
      // Remove dead code from .js files on eject
      .replace(
        /\/\/ @remove-on-eject-begin([\s\S]*?)\/\/ @remove-on-eject-end/mg,
        ''
      )
      // Remove dead code from .applescript files on eject
      .replace(
        /-- @remove-on-eject-begin([\s\S]*?)-- @remove-on-eject-end/mg,
        ''
      )
      .trim() + '\n';
    console.log(`  Adding ${cyan(file.replace(ownPath, ''))} to the project`);
    fs.writeFileSync(file.replace(ownPath, appPath), content);
  });
  console.log();

  const ownPackage = require(path.join(ownPath, 'package.json'));
  const appPackage = require(path.join(appPath, 'package.json'));

  console.log(cyan('Updating the dependencies'));
  const ownPackageName = ownPackage.name;
  if (appPackage.devDependencies[ownPackageName]) {
    console.log(`  Removing ${cyan(ownPackageName)} from devDependencies`);
    delete appPackage.devDependencies[ownPackageName];
  }
  if (appPackage.dependencies[ownPackageName]) {
    console.log(`  Removing ${cyan(ownPackageName)} from dependencies`);
    delete appPackage.dependencies[ownPackageName];
  }

  Object.keys(ownPackage.dependencies).forEach(key => {
    // For some reason optionalDependencies end up in dependencies after install
    if (ownPackage.optionalDependencies[key]) {
      return;
    }
    console.log(`  Adding ${cyan(key)} to devDependencies`);
    appPackage.devDependencies[key] = ownPackage.dependencies[key];
  });
  console.log();
  console.log(cyan('Updating the scripts'));
  delete appPackage.scripts['eject'];
  Object.keys(appPackage.scripts).forEach(key => {
    Object.keys(ownPackage.bin).forEach(binKey => {
      const regex = new RegExp(binKey + ' (\\w+)', 'g');
      appPackage.scripts[key] = appPackage.scripts[key].replace(
        regex,
        'node scripts/$1.js'
      );
      console.log(
        `  Replacing ${cyan(`"${binKey} ${key}"`)} with ${cyan(`"node scripts/${key}.js"`)}`
      );
    });
  });

  console.log();
  console.log(cyan('Configuring package.json'));
  // Add Jest config
  console.log(`  Adding ${cyan('Jest')} configuration`);
  appPackage.jest = createJestConfig(
    filePath => path.posix.join('<rootDir>', filePath),
    null,
    true
  );

  // Add Babel config
  console.log(`  Adding ${cyan('Babel')} preset`);
  appPackage.babel = {
    presets: ['lambda-app'],
  };

  // Add ESlint config
  console.log(`  Adding ${cyan('ESLint')} configuration`);
  appPackage.eslintConfig = {
    extends: 'lambda-app',
  };

  fs.writeFileSync(
    path.join(appPath, 'package.json'),
    JSON.stringify(appPackage, null, 2) + '\n'
  );
  console.log();

  // "Don't destroy what isn't ours"
  if (ownPath.indexOf(appPath) === 0) {
    try {
      // remove lambda-scripts and lambda-scripts binaries from app node_modules
      Object.keys(ownPackage.bin).forEach(binKey => {
        fs.removeSync(path.join(appPath, 'node_modules', '.bin', binKey));
      });
      fs.removeSync(ownPath);
    } catch (e) {
      // It's not essential that this succeeds
    }
  }

  if (fs.existsSync(paths.yarnLockFile)) {
    console.log(cyan('Running yarn...'));
    spawnSync('yarnpkg', [], { stdio: 'inherit' });
  } else {
    console.log(cyan('Running npm install...'));
    spawnSync('npm', ['install'], { stdio: 'inherit' });
  }
  console.log(green('Ejected successfully!'));
  console.log();

  console.log(green('Please consider sharing why you ejected in this survey:'));
  console.log(green('  http://goo.gl/forms/Bi6CZjk1EqsdelXk1'));
  console.log();
});
