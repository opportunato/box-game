import path from 'path';

import constants from './constants';

const root = path.join(__dirname, '.');
const src = path.join(root, 'src');
const dist = path.join(root, 'dist');
const templates = path.join(src, 'client', 'templates');

const prod = process.env.NODE_ENV === 'production';
const dev = !prod;

const hotLoader = dev && process.env.HOT_RELOAD === 'react-hot-loader';

export default {
  root,
  src,
  dist,
  templates,

  prod,
  dev,

  hotLoader,

  clientPort: constants.CLIENT_PORT,
  clientAddr: constants.CLIENT_ADDR,
  serverPort: constants.SERVER_PORT,
  serverAddr: constants.SERVER_ADDR,

  assetsPath: '/embed/dictator',

  taskName: (prefix) => (taskName) => `${prefix}:${taskName}`
};
