import * as winston from 'winston';
import * as config from 'config';
import * as expressWinston from 'express-winston';
import { LoggerInstance } from 'winston';
import { Application } from 'express';

export const logger: LoggerInstance = new winston.Logger();

process.on('unhandledRejection', (reason, p) => {
  logger.warn('Possibly Unhandled Rejection at: Promise ', p, ' reason: ', reason);
});

const level: string = config.get('loglevel');

export function setupLogging(app: Application) {
  /**
   * Development Logger
   * const env = server-config.util.getEnv('NODE_ENV');
   * error: 0, warn: 1, info: 2, verbose: 3, debug: 4, silly: 5
   */

   if (level === 'info') {
    logger.add(winston.transports.Console, {
      type: 'debug',
      colorize: true,
      prettyPrint: true,
      handleExceptions: true,
      humanReadableUnhandledException: true
    });
   }
}
