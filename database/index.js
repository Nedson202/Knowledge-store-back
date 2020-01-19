import { Pool } from 'pg';
import { loggerInstance as logger } from '../logger';
import config from './config';

class DB {
  constructor() {
    this.db = new Pool(config);

    this.initDBConnection();
  }

  initDBConnection = () => {
    this.db.connect((err) => {
      if (err) {
        logger.info('-- Unable to establish a connection to database --');

        return;
      }

      logger.info('-- Connected successfully to database --');
    });
  }

  query = async (queryConfig) => {
    try {
      const start = Date.now();
      const executedQuery = await this.db.query(queryConfig);
      const duration = Date.now() - start;
      logger.info(`
        Executed query:
        ${JSON.stringify({ query: queryConfig.text, duration })}
      `);
      return executedQuery;
    } catch (error) {
      logger.stackLogger(error);
      return error;
    }
  };

  getClient = (callback) => {
    this.db.connect((err, client, done) => {
      callback(err, client, done);
    });
  };
}

export const dbInstance = new DB();

export default DB;
