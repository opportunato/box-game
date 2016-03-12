import path from 'path';
import express from 'express';
import bunyan from 'bunyan';

import config from '../../config';
import webRoutes from './routes/web';

const logger = bunyan.createLogger({ name: 'box:main' });

const app = express();

app.use(express.static(path.join(__dirname, 'public'), {
  index: false
}));

app.use('/', webRoutes(config));

app.listen(process.env.NODEJS_PORT, process.env.NODEJS_ADDR, () => {
  logger.info(`Start server at ${process.env.NODEJS_ADDR}:${process.env.NODEJS_PORT}`);
});
