import winston from 'winston';
// Configure defaults for development environment if config is missing
const configLogConfig = {
  monitoring: { logLevel: 'info' },
  nodeEnv: process.env.NODE_ENV || 'development',
};
// Create logger instance
const logger = winston.createLogger({
  level: configLogConfig.monitoring.logLevel,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'esg-api' },
  transports: [
    // Write all logs with importance level of `error` or less to `error.log`
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    // Write all logs with importance level of `info` or less to `combined.log`
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
if (configLogConfig.nodeEnv !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
    })
  );
}
// Add custom methods to logger type or export wrapper
export default {
  ...logger,
  info: logger.info.bind(logger),
  warn: logger.warn.bind(logger),
  error: logger.error.bind(logger),
  debug: logger.debug.bind(logger),
  infoWithContext: (message, context = {}) => {
    logger.info(message, { ...context, timestamp: new Date().toISOString() });
  },
  errorWithContext: (message, error, context = {}) => {
    logger.error(message, {
      error: error.message,
      stack: error.stack,
      ...context,
      timestamp: new Date().toISOString(),
    });
  },
  warnWithContext: (message, context = {}) => {
    logger.warn(message, { ...context, timestamp: new Date().toISOString() });
  },
  debugWithContext: (message, context = {}) => {
    logger.debug(message, { ...context, timestamp: new Date().toISOString() });
  },
};
