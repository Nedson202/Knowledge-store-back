import http from 'http';
import https from 'https';

import { DEVELOPMENT } from '../settings';

const port = process.env.PORT || 4000;
const appUrl = process.env.NODE_ENV.match(DEVELOPMENT)
  ? `http://localhost:${port}` : process.env.PROD_SERVER;

const httpProtocol = process.env.NODE_ENV.match(DEVELOPMENT) ? http : https;

setInterval(() => {
  (() => {
    httpProtocol.get(`${appUrl}/healthChecker`, () => { });
  })();
}, 1000 * 10 * 60);
