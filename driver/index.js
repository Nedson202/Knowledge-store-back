import { stackLogger } from 'info-logger';
import logger from '../utils/initLogger';
import db from '../utils/initDB';

export const dbQuery = async (queryConfig) => {
  try {
    const start = Date.now();
    const executedQuery = await db.query(queryConfig);
    const duration = Date.now() - start;
    logger.info(`
      Executed query:
      ${JSON.stringify({ query: queryConfig.text, duration })}
    `);
    return executedQuery;
  } catch (error) {
    stackLogger(error);
    return error;
  }
};

export const getClient = (callback) => {
  db.connect((err, client, done) => {
    callback(err, client, done);
  });
};
