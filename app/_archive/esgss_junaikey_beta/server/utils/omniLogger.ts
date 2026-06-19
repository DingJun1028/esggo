import { BaseLogger, LogCategory, LogLevel, LogEntry, LogMetadata } from '../../shared/logger.shared.js';

/**
 * server/utils/omniLogger.ts
 * 
 * 5T Protocol Backend implementation
 */
export { LogCategory };

/**
 * Internal implementation that follows the shared BaseLogger pattern.
 */
class OmniLoggerImpl extends BaseLogger {
  public minLevel: LogLevel = LogLevel.INFO;
  public sourceOrigin: string = 'backend-neural-core';

  constructor() {
    super('NeuralCore', LogCategory.SYSTEM);

    // Environment awareness
    if (process.env.NODE_ENV === 'development') {
      this.minLevel = LogLevel.DEBUG;
    }
  }

  protected output(entry: LogEntry): void {
    const { timestamp, level, category, context, message, metadata, error } = entry;

    // Liquid Glass Server Sensation - Colorizing output for terminal
    const colors = {
      DEBUG: '\x1b[36m', // Cyan
      INFO: '\x1b[32m',  // Green
      WARN: '\x1b[33m',  // Yellow
      ERROR: '\x1b[31m', // Red
      RESET: '\x1b[0m'
    };

    const prefix = `${colors[level as keyof typeof colors] || ''}${level}${colors.RESET}`;
    const categoryBadge = `\x1b[44m\x1b[37m ${category} \x1b[0m`;
    const contextStr = `\x1b[2m[${context}]\x1b[0m`;

    console.log(`${timestamp} ${prefix} ${categoryBadge} ${contextStr} ${message}`);

    if (metadata && Object.keys(metadata).length > 0) {
      console.log('\x1b[2mMetadata:\x1b[0m', JSON.stringify(metadata, null, 2));
    }

    if (error) {
      console.error('\x1b[31mError Details:\x1b[0m', error);
    }
  }
}

const internalLogger = new OmniLoggerImpl();

/**
 * Compatibility wrapper for the existing category-first API.
 * This avoids inheritance signature conflicts while sharing logic.
 */
const omniLogger = {
  info: (category: LogCategory, message: string, meta?: LogMetadata) => {
    internalLogger.info(message, meta, category);
  },
  warn: (category: LogCategory, message: string, meta?: LogMetadata) => {
    internalLogger.warn(message, meta, category);
  },
  error: (category: LogCategory, message: string, error?: any, meta?: LogMetadata) => {
    // Standardize error loging for 5T compliance
    const errorInstance = error instanceof Error ? error : (typeof error === 'string' ? new Error(error) : undefined);
    const actualMeta = !errorInstance && error ? { ...meta, ...error } : meta;

    internalLogger.error(message, errorInstance, actualMeta, category);
  },
  debug: (category: LogCategory, message: string, meta?: LogMetadata) => {
    internalLogger.debug(message, meta, category);
  }
};

export default omniLogger;
