import { logger } from './logger';

const stackTracer = (reason) => {
  logger.error(`${reason.stack}\n`);
};

export default stackTracer;