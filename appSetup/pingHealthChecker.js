import http from 'http';
import https from 'https';
import dotenv from 'dotenv';

import { DEVELOPMENT, PRODUCTION } from '../settings';

dotenv.config();

const port = process.env.PORT || 4000;
const appUrl = process.env.NODE_ENV.match(DEVELOPMENT)
  ? `http://localhost:${port}` : process.env.PROD_SERVER;

const httpProtocol = process.env.NODE_ENV.match(DEVELOPMENT) ? http : https;

const handlePing = () => {
  if (!process.env.NODE_ENV.match(PRODUCTION)) {
    return;
  }

  setInterval(() => {
    (() => {
      httpProtocol.get(`${appUrl}/health`, () => { });
    })();
  }, 1000 * 10 * 60);
};

handlePing();
