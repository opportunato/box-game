/* eslint-disable no-console */

import path from 'path';
import gulp from 'gulp';
import forever from 'forever-monitor';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';

import config from './config';
import webpackConfigServer from './webpack/server.config';
import webpackConfigClient from './webpack/client.config';
import prepareHTML from './tasks/prepare_html';

const taskName = config.taskName('dev');

function createMoninor(webpackConfig, cfg) {
  let monitor;

  webpack(webpackConfig)
    .watch(100, (err, stats) => {
      if (err) {
        throw new Error(err);
      }

      if (!monitor) {
        monitor = new forever.Monitor(cfg.script, {
          max: 1,
          env: cfg.env
        });
        monitor.start();
      } else {
        monitor.restart();
      }

      console.log(stats.toString({
        colors: true
      }));
    });
}

function createWebpackDevServer(webpackConfig, cfg) {
  const server = new WebpackDevServer(webpack(webpackConfig), {
    hot: true,
    stats: {
      colors: true
    },
    proxy: {
      '*': 'http://localhost:' + cfg.proxyPort
    },
    watchOptions: {
      aggregateTimeout: 500,
      poll: 1000
    }
  });

  server.listen(cfg.port);
}

gulp.task(taskName('html'), prepareHTML({
  src: config.templates,
  dest: path.join(config.dist, 'dev', 'public'),
  files: [
    path.join(config.templates, '*.dev.html'),
    path.join(config.templates, '*.all.html')
  ],
  context: () => {
    return {
      PORT: config.clientPort
    };
  }
}));

gulp.task(taskName('watch'), () => {
  gulp.watch(path.join(config.templates, '*.html'), [taskName('html')]);
});

gulp.task(taskName('server'), [taskName('html'), taskName('watch')], () => {
  createMoninor(webpackConfigServer, {
    script: path.join(config.dist, 'dev', 'server.js')
  });

  createWebpackDevServer(webpackConfigClient, {
    port: config.clientPort,
    proxyPort: config.serverPort
  });
});

gulp.task('default', [taskName('server')]);
