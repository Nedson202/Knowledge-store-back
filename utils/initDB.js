import { Pool } from 'pg';
import config from '../database/config';
import logger from './initLogger';

let dbConfig = config;

if (process.env.NODE_ENV.match('production')) {
  dbConfig = {
    connectionString: process.env.DATABASE_URL
  };
}

const db = new Pool(dbConfig);

db.on('connect', () => {
  logger.info('Connected successfully to database');
});

export default db;
