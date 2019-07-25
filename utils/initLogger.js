import { createLogger } from 'info-logger';
import { logFolderName, logFileName } from './default';

const logger = createLogger(logFolderName, logFileName);
export default logger;
