export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
  CRITICAL = 'CRITICAL',
}

export enum LogCategory {
  SYSTEM = 'SYSTEM',
  API = 'API',
  UI = 'UI',
  DATA = 'DATA',
  AUTH = 'AUTH',
  PERFORMANCE = 'PERFORMANCE',
  GENESIS = 'GENESIS',
  DEVELOPMENT = 'DEVELOPMENT',
  AI = 'AI',
  LEGION = 'LEGION',
  ESG = 'ESG',
  SECURITY = 'SECURITY',
  AGENT = 'AGENT',
  QUANTUM = 'QUANTUM',
  SOVEREIGN = 'SOVEREIGN',
  MARKET = 'MARKET',
  OCR = 'OCR',
  BLOCKCHAIN = 'BLOCKCHAIN',
  AUDIT = 'AUDIT',
  GOVERNANCE = 'GOVERNANCE',
  SOCIAL = 'SOCIAL',
}

export const omniLogger = {
  info: (category: LogCategory | string, message: string, metadata?: any) => {
    console.log(`[INFO] ${category} "${message}"`, metadata ? JSON.stringify(metadata, null, 2) : '');
  },
  warn: (category: LogCategory | string, message: string, metadata?: any) => {
    console.warn(`[WARN] ${category} "${message}"`, metadata ? JSON.stringify(metadata, null, 2) : '');
  },
  error: (category: LogCategory | string, message: string, metadata?: any) => {
    console.error(`[ERROR] ${category} "${message}"`, metadata ? JSON.stringify(metadata, null, 2) : '');
  },
  debug: (category: LogCategory | string, message: string, metadata?: any) => {
    console.debug(`[DEBUG] ${category} "${message}"`, metadata ? JSON.stringify(metadata, null, 2) : '');
  },
  critical: (category: LogCategory | string, message: string, metadata?: any) => {
    console.error(`[CRITICAL] ${category} "${message}"`, metadata ? JSON.stringify(metadata, null, 2) : '');
  },
};

export default omniLogger;
