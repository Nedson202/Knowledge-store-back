import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

const { createLogger, transports, format } = winston;

const {
  combine, timestamp, label, printf,
} = format;

class Logger {
  constructor(logFileName, logLevel) {
    this.logFileName = logFileName || 'api-log-results-%DATE%';
    this.fullLogPath = `Logs/${this.logFileName}.log`;
    this.datePattern = 'YYYY-MM-DD';
    this.timestampFormat = 'YYYY-MM-DD HH:mm:ss';
    this.logLevel = logLevel || 'verbose';
    this.transportLogLevel = 'info';

    this.logger = this.initLogger();
    this.logger.stackLogger = this.stackLogger;
  }

  /**
   *
   *
   * @memberof Logger
   */
  printFormat = () => printf((info) => {
    const logPattern = `${info.timestamp} [${info.label}] ${info.level}: ${info.message}`;
    return logPattern;
  });


  /**
   *
   * Creates logger with defined transports
   * @memberof Logger
   */
  initLogger = () => createLogger({
    level: this.logLevel,
    format: combine(
      label({ label: __filename }),
      timestamp({
        format: this.timestampFormat
      }),
      this.printFormat(),
    ),
    transports: [
      new transports.Console({
        level: this.transportLogLevel,
        format: format.combine(
          format.colorize(),
          this.printFormat(),
        ),
      }),
      new DailyRotateFile({
        filename: this.fullLogPath,
        datePattern: this.datePattern,
      }),
    ],
  })

  /**
   *
   * @param {object} node.js error object
   * @memberof Logger
   */
  stackLogger = error => this.logger.error(`${error.stack}\n`);
}

export const loggerInstance = new Logger().logger;

export default Logger;
