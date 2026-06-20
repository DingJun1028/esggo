// @ts-nocheck
/**
 * ESGGO 統一日誌系統
 * 
 * 取代所有 console.log，提供：
 * 1. 日誌級別（debug, info, warn, error）
 * 2. 模組標籤
 * 3. 時間戳
 * 4. 生產環境自動關閉 debug 日誌
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogConfig {
  level: LogLevel;
  enableTimestamp: boolean;
  enableModule: boolean;
}

const CONFIG: LogConfig = {
  level: process.env.NODE_ENV === 'production' ? 'warn' : 'debug',
  enableTimestamp: true,
  enableModule: true,
};

const LEVEL_PRIORITY: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

function shouldLog(level: LogLevel): boolean {
  return LEVEL_PRIORITY[level] >= LEVEL_PRIORITY[CONFIG.level];
}

function formatMessage(level: LogLevel, module: string, message: string): string {
  const parts: string[] = [];
  
  if (CONFIG.enableTimestamp) {
    parts.push(`[${new Date().toISOString()}]`);
  }
  
  parts.push(`[${level.toUpperCase()}]`);
  
  if (CONFIG.enableModule && module) {
    parts.push(`[${module}]`);
  }
  
  parts.push(message);
  
  return parts.join(' ');
}

export const logger = {
  debug: (module: string, message: string, ...args: any[]) => {
    if (shouldLog('debug')) {
      console.log(formatMessage('debug', module, message), ...args);
    }
  },
  
  info: (module: string, message: string, ...args: any[]) => {
    if (shouldLog('info')) {
      console.log(formatMessage('info', module, message), ...args);
    }
  },
  
  warn: (module: string, message: string, ...args: any[]) => {
    if (shouldLog('warn')) {
      console.warn(formatMessage('warn', module, message), ...args);
    }
  },
  
  error: (module: string, message: string, ...args: any[]) => {
    if (shouldLog('error')) {
      console.error(formatMessage('error', module, message), ...args);
    }
  },
  
  // OmniAgent 專用日誌
  omni: (message: string, ...args: any[]) => {
    if (shouldLog('debug')) {
      console.log(formatMessage('debug', 'OmniAgent', message), ...args);
    }
  },
  
  // 5T 協議日誌
  fiveT: (message: string, ...args: any[]) => {
    if (shouldLog('info')) {
      console.log(formatMessage('info', '5T-Protocol', message), ...args);
    }
  },
};

export default logger;
