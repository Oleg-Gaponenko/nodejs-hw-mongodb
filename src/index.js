import 'dotenv/config';
import initMongoConnection from './db/initMongoConnection.js';
import setupServer from './server.js';

async function initialBoot() {
  await initMongoConnection();
  setupServer();
}

initialBoot();
