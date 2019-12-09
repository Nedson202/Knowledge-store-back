import dotenv from 'dotenv';
import { TEST, PRODUCTION } from '../settings';

dotenv.config();

let config = {
  host: '127.0.0.1',
  port: 5432,
  database: process.env.DB_NAME,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
};

if (process.env.NODE_ENV.match(PRODUCTION)) {
  config = {
    connectionString: process.env.HEROKU_POSTGRESQL_AMBER_URL
  };
}

if (process.env.NODE_ENV.match(TEST)) {
  config.database = process.env.TEST_DB_NAME;
}

const dbConfig = config;

export default dbConfig;
