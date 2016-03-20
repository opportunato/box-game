import path from 'path';
import { optimize, DefinePlugin, HotModuleReplacementPlugin } from 'webpack';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import StatsPlugin from 'stats-webpack-plugin';

import autoprefixer from 'autoprefixer-core';
import mqpacker from 'css-mqpacker';
import nestedRules from 'postcss-nested';
import reporter from 'postcss-reporter';
import bemLinter from 'postcss-bem-linter';
import simpleVars from 'postcss-simple-vars';

import config from '../config';
import base from './base.config';

const deps = [
  'react',
  'lodash-node'
];

export default {
  ...base,

  node: {
    fs: 'empty',
    net: 'empty'
  },

  entry: config.dev ?
    [
      ...(config.hotLoader ? ['webpack/hot/only-dev-server'] : []),
      path.join(config.src, 'client', 'index')
    ] :
    {
      app: path.join(config.src, 'client', 'index'),
      vendor: deps
    },

  output: {
    path: path.join(config.dist, config.dev ? 'dev' : 'prod', 'public'),
    filename: config.dev ? 'app.js' : '[name].[chunkhash].js',
    chunkFilename: '[id].chunk.[chunkhash].js',
    publicPath: config.dev ?
      `http://${config.clientAddr}:${config.clientPort}/` :
      `${config.assetsPath}`
  },

  module: {
    ...base.module,

    loaders: [
      ...base.module.loaders.map(loader => (
        config.hotLoader && loader.loaders.indexOf('babel') >= 0
          && loader.loaders.unshift('react-hot'),
        loader
      )),

      {
        test: /\.s?css$/,
        loader: config.dev ?
          'style!css?-minimize&modules&localIdentName=[name]-[local]--[hash:base64:5]&sourceMap!postcss!sass' :
          ExtractTextPlugin.extract('style', 'css?modules&sourceMap!postcss!sass')
      },
    ]
  },

  postcss: () => ([
    autoprefixer({
      browsers: ['last 2 version', 'Opera >= 12', 'ie >= 9'],
      remove: false
    }),
    nestedRules,
    mqpacker,
    reporter({
      clearMessages: true
    }),
  ]),

  plugins: [
    ...base.plugins,

    new DefinePlugin({
      '__CLIENT__': true,
      '__SERVER__': false
    }),

    new StatsPlugin('webpack-client-stats.json', {
      timings: true,
      assets: true,
      chunks: true,
      chunkModules: true,
      modules: true,
      cached: true,
      reasons: true,
      chunkOrigins: true,
      exclude: [/node_modules[\\\/]react/]
    }),

    ...(config.prod ?
        [new ExtractTextPlugin('[name].[contenthash].css'),
         new optimize.OccurenceOrderPlugin(),
         new optimize.CommonsChunkPlugin(
          'vendor',
          'vendor.[chunkhash].js'
         )
        ] : []),

    ...(config.hotLoader ? [new HotModuleReplacementPlugin()] : []),

    ...(config.prod ?
        [new optimize.UglifyJsPlugin({ compress: { warnings: false } })] : [])
  ]
};
