import path from 'path';
import { DefinePlugin } from 'webpack';

import WebpackMd5Hash from 'webpack-md5-hash';

import config from '../config';

const deps = [];

const baseConfig = {
  module: {
    noParse: [],

    preLoaders: [
      ...(config.dev ?
        [
          {
            test: /\.jsx?$/,
            // we are using `eslint-loader` explicitly since
            // we have ESLint module installed. This way we
            // can be certain that it uses the right loader
            loader: 'eslint-loader',
            include: config.src
          }
        ] :
        [])
    ],

    loaders: [
      {
        test: /\.jsx?$/,
        include: [
          config.src,
          path.join(config.root, 'config.js'),
          path.join(config.root, 'constants.js')
          // path.join(config.root, 'node_modules', 'test-shared-components')
        ],
        loaders: ['babel']
      },
      {
        test: /\.(png|jpg|svg|woff)$/,
        loaders: ['url?limit=4096&name=[name].[hash].[ext]']
      },
      {
        test: /\.json$/,
        loaders: ['json-loader']
      },
      {
        test: /\.(mp3)$/,
        loaders: ['file-loader']
      },
    ]
  },

  debug: config.dev,

  devtool: config.dev ? 'cheap-module-source-map' : 'source-map',

  resolve: {
    extensions: ['', '.js', '.css']
  },

  plugins: [
    new WebpackMd5Hash(),

    new DefinePlugin({
      'EMBED_ID': JSON.stringify(config.assetsPath),

      'process.env.NODE_ENV': JSON.stringify(
        process.env.NODE_ENV || 'development'
      ),
      'process.env.CLIENT_PORT': JSON.stringify(config.clientPort)
    })
  ]
};

deps.forEach(dep => {
  const nodeModulesDir = path.join(__dirname, '..', 'node_modules');
  const depPath = path.resolve(nodeModulesDir, dep);

  baseConfig.module.noParse.push(depPath);
});

export default baseConfig;
