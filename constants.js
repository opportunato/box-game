const clientPort = process.env.CLIENT_PORT || 3001;
const clientAddr = process.env.CLIENT_ADDR || 'localhost';
const serverPort = process.env.NODEJS_PORT || Number(clientPort) + 1;
const serverAddr = process.env.NODEJS_ADDR || 'localhost';

export default {
  CLIENT_PORT: clientPort,
  CLIENT_ADDR: clientAddr,

  SERVER_PORT: serverPort,
  SERVER_ADDR: serverAddr
};
