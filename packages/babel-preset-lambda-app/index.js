/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */
 'use strict';

var path = require('path');

const plugins = [
  require.resolve('babel-plugin-transform-class-properties'),
  [
    require.resolve('babel-plugin-transform-object-rest-spread'),
    {
      useBuiltIns: true,
    },
  ],
  [
    require.resolve('babel-plugin-transform-runtime'),
    {
      helpers: false,
      polyfill: false,
      regenerator: true,
      moduleName: path.dirname(require.resolve('babel-runtime/package')),
    },
  ],
];

var env = process.env.BABEL_ENV || process.env.NODE_ENV;
if (env !== 'development' && env !== 'test' && env !== 'production') {
  throw new Error('Please set BABEL_ENV or NODE_ENV environment variable.');
}

if (env === 'test') {
  module.exports = {
    presets: [
      [
        require('babel-preset-env').default,
        {
          targets: {
            node: 'current',
          },
        },
      ],
    ],
    plugins: plugins.concat([
      require.resolve('babel-plugin-dynamic-import-node'),
    ]),
  };
} else {
  module.exports = {
    presets: [
      [
        require.resolve('babel-preset-env'),
        {
          targets: {
            uglify: true,
          },
          useBuiltIns: false,
          modules: false,
        },
      ],
    ],
    plugins: plugins.concat([
      [
        require.resolve('babel-plugin-transform-regenerator'),
        {
          async: false,
        },
      ],
      require.resolve('babel-plugin-syntax-dynamic-import'),
    ]),
  };
}
