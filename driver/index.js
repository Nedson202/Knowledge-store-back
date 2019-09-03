import { Pool } from 'pg';
import { stackLogger } from 'info-logger';
import logger from '../utils/initLogger';
import config from './config';

const pool = new Pool(config);

pool.on('connect', () => {
  logger.info('Connected successfully to database');
});

export const dbQuery = async (queryConfig) => {
  try {
    const start = Date.now();
    const executedQuery = await pool.query(queryConfig);
    const duration = Date.now() - start;
    logger.info('Executed query', { query: queryConfig.text, duration });
    return executedQuery;
  } catch (error) {
    stackLogger(error);
    return error;
  }
};

export const getClient = (callback) => {
  pool.connect((err, client, done) => {
    callback(err, client, done);
  });
};
