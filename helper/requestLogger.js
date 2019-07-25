import winston from 'winston';
import 'winston-daily-rotate-file';
import expressWinston from 'express-winston';

const { transports, } = winston;

const logPath = 'Error';

const dailyRotateFileTransport = new transports.DailyRotateFile({
  filename: `${logPath}/%DATE%-results.log`,
  datePattern: 'YYYY-MM-DD',
});

const requestLogger = expressWinston.logger({
  transports: [
    dailyRotateFileTransport
  ],
  meta: true,
  msg: 'HTTP {{req.method}} {{req.url}}',
  expressFormat: true,
  colorize: false,
  json: false,
  responseWhitelist: ['url', 'method', 'httpVersion', 'originalUrl', 'query']
});

export default requestLogger;
