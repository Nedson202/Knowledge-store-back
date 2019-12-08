import { Pool } from 'pg';
import { stackLogger } from 'info-logger';
import logger from '../utils/initLogger';
import config from './config';
import { PRODUCTION, TEST } from '../settings';

class DB {
  constructor() {
    this.db = {};

    this.initDBConnectiion();
  }

  initDBConnectiion = () => {
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

    this.db = db;
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
      stackLogger(error);
      return error;
    }
  };

  getClient = (callback) => {
    this.db.connect((err, client, done) => {
      callback(err, client, done);
    });
  };
}

export default DB;
