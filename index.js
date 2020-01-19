import './appSetup/exceptionHandler';
import './appSetup/pingHealthChecker';
import app from './appSetup/middlewareHook';

import './passport';
import { loggerInstance as logger } from './logger';

const port = process.env.PORT || 4000;

app.listen(port,
  () => {
    logger.info(`
      App running in ${process.env.NODE_ENV.toUpperCase()} mode
      Listening on port ${port}
    `);

    if (!process.env.NODE_ENV.match('production')) {
      logger.info(`http://localhost:${port}\n`);
    }
  });
