import { Pool } from 'pg';
import config from '../database/config';
import logger from './initLogger';
import { PRODUCTION, TEST } from '../settings';

let dbConfig = config;

if (process.env.NODE_ENV.match(PRODUCTION)) {
  dbConfig = {
    connectionString: process.env.HEROKU_POSTGRESQL_AMBER_URL
  };
}

if (process.env.NODE_ENV.match(TEST)) {
  dbConfig.database = process.env.TEST_DB_NAME;
}

const db = new Pool(dbConfig);

db.on('connect', () => {
  logger.info('Connected successfully to database');
});

export default db;
