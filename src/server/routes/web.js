import path from 'path';
import express from 'express';
import nunjucks from 'nunjucks';

// import React from 'react';
// import ReactDOMServer from 'react-dom/server';

// import App from '../../client/components/App';

import 'babel-polyfill';

export default function (config) {
  /* eslint-disable new-cap */
  const router = express.Router();
  /* eslint-enable new-cap */

  nunjucks.configure(path.join(__dirname, 'public'), {
    autoescape: false,
    tags: {
      blockStart: '<%',
      blockEnd: '%>',
      variableStart: '%%',
      variableEnd: '%%',
      commentStart: '<#',
      commentEnd: '#>'
    }
  });

  router.get('*', (req, res) => {
    const html = null;

    const context = {
      ...(res.context : {}),
      assetsPath: process.env.LOCAL ? '' : config.assetsPath,
      body: html,
      lang: 'ru'
    };

    nunjucks.render(res.template || 'index.html', context, (err, data) => {
      res.send(data);
    });
  });

  return router;
}
