/* eslint-disable no-console */

import fs from 'fs';
import path from 'path';
import gulp from 'gulp';
import gutil from 'gulp-util';
import rimraf from 'gulp-rimraf';
import webpack from 'webpack';
import forEach from 'lodash-node/modern/collection/forEach';
import flatten from 'lodash-node/modern/array/flatten';

import config from './config';
import webpackConfigServer from './webpack/server.config';
import webpackConfigClient from './webpack/client.config';

import prepareHTML from './tasks/prepare_html';

const taskName = config.taskName('dist');

const wpConfig = {
  server: webpackConfigServer,
  client: webpackConfigClient
};

function reportHardError(err, target, cb) {
  cb(new gutil.PluginError(`webpack:${target}`, gutil.colors.red(err)));
}

function reportSoftError(err) {
  gutil.log(gutil.colors.red(err));
}

gulp.task(taskName('clean'), () => {
  return gulp
    .src([path.join(config.dist, 'prod')], { read: false })
    .pipe(rimraf());
});

gulp.task(taskName('webpack'), ['lint', taskName('clean')], (cb) => {
  const completed = [];

  Object.keys(wpConfig).forEach(target => {
    wpConfig[target].plugins.push(new webpack.ProgressPlugin((progress, message) => {
      gutil.log(gutil.colors.cyan(`webpack:${target}`), message);
    }));

    webpack(wpConfig[target], (err, stats) => {
      if (err) {
        return reportHardError(err, target, cb);
      }

      const statsJson = stats.toJson({
        timings: true,
        assets: true,
        chunks: true,
        chunkModules: true,
        modules: true,
        cached: true,
        reasons: true,
        chunkOrigins: true
      });

      if (statsJson.errors.length) {
        statsJson.errors.forEach(reportSoftError);
        return cb(null, statsJson);
      }

      console.log(stats.toString({
        colors: true
      }));

      completed.push(target);

      if (completed.length === Object.keys(wpConfig).length) {
        cb(null, statsJson);
      }
    });
  });
});

gulp.task(taskName('html'), [taskName('webpack')], prepareHTML({
  src: config.templates,
  dest: path.join(config.dist, 'prod', 'public'),
  files: [
    path.join(config.templates, '*.dist.html'),
    path.join(config.templates, '*.all.html')
  ],
  context: () => {
    const clientStatsPath = path.join(config.dist, 'prod', 'public', 'webpack-client-stats.json');
    const clientStatsJSON = JSON.parse(fs.readFileSync(clientStatsPath, 'utf8'));
    const revved = {};

    // Gather all resources revved by Webpack (app scripts)
    // Stats format: {"assetsByChunkName": {"app": ["1.chunk.1dcc48763e98f59f00e6.js", ...], ...}}
    forEach(clientStatsJSON.assetsByChunkName, (assets, chunkName) => {
      const preparedAssets = flatten([assets]).filter(asset => {
        return ['.js', '.css'].indexOf(path.extname(asset)) > -1;
      });

      if (!preparedAssets.length) {
        throw new Error('No files emitted for a chunk: ' + chunkName);
      }

      preparedAssets.forEach(asset => {
        revved[`/${chunkName}${path.extname(asset)}`] = path.join('/', asset);
      });
    });

    return {
      getRevved: (name) => {
        if (!revved[name]) {
          console.log('Known assets:', revved);
          throw new Error('Unknown asset key: ' + name);
        }

        return revved[name];
      }
    };
  }
}));

gulp.task(taskName('build'), [taskName('html')]);
