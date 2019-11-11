import './appSetup/exceptionHandler';
import app from './appSetup/middlewareHook';
import './appSetup/pingHealthChecker';

import './passport';
import {
  elasticClientHealthCheck, createMapping
} from './elasticSearch';
import logger from './utils/initLogger';
import './redis';

const port = process.env.PORT || 4000;

app.listen(port,
  () => {
    logger.info(`
      App running on ${process.env.NODE_ENV.toUpperCase()} mode and
      Listening on port ${port}...\n
    `);

    if (process.env.NODE_ENV.match('development')) {
      logger.info(`http://localhost:${port}\n`);
    }
  });

elasticClientHealthCheck();
createMapping();
