import path from 'path';
import fs from 'fs';
import { DefinePlugin } from 'webpack';
import StatsPlugin from 'stats-webpack-plugin';

import config from '../config';
import base from './base.config';
import WatchIgnorePlugin from './WatchIgnorePlugin';

const nodeModulesDirectory = path.join(config.root, 'node_modules');
const nodeModulesExternals = fs.readdirSync(nodeModulesDirectory)
  .filter(name => name !== '.bin')
  .reduce((acc, name) => (
    acc[name] = `commonjs ${name}`,
    acc
  ), {});

const nodeMixin = {
  target: 'node',
  node: {
    console: false,
    process: false,
    global: false,
    Buffer: false,
    __filename: false,
    __dirname: false
  },

  externals: [nodeModulesExternals]
};

export default {
  ...base,
  ...nodeMixin,

  entry: path.join(config.src, 'server', 'index'),

  output: {
    path: path.join(config.dist, config.dev ? 'dev' : 'prod'),
    filename: 'server.js',
    publicPath: config.dev ? '/' : `${config.assetsPath}/`
  },

  module: {
    ...base.module,

    loaders: [
      ...base.module.loaders,

      {
        test: /\.css$/,
        loader: config.dev ?
          'css?-minimize&modules&localIdentName=[name]-[local]--[hash:base64:5]&sourceMap!postcss' :
          'css?modules&sourceMap!postcss'
      }
    ]
  },

  plugins: [
    ...base.plugins,

    new WatchIgnorePlugin([
      path.join(config.src, 'client'),
    ]),

    new DefinePlugin({
      '__CLIENT__': false,
      '__SERVER__': true
    }),

    new StatsPlugin('webpack-server-stats.json', {
      timings: true,
      assets: true,
      chunks: true,
      chunkModules: true,
      modules: true,
      cached: true,
      reasons: true,
      chunkOrigins: true,
      exclude: [/node_modules[\\\/]react/]
    })
  ]
};
