import dotenv from 'dotenv';
import { TEST, PRODUCTION } from '../settings';

dotenv.config();

const databaseURL = `postgres://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;

let config = {
  connectionString: databaseURL
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
