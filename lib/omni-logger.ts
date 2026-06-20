// @ts-nocheck
/**
 * 萬能日誌（OmniLogger）
 * 
 * ESGGO 平台的統一日誌系統，取代所有 console.log。
 * 
 * 特性：
 * 1. 日誌級別（debug, info, warn, error）
 * 2. 模組標籤
 * 3. 時間戳
 * 4. 生產環境自動關閉 debug 日誌
 * 5. 5T 協議日誌
 * 6. 萬能元鑰日誌
 * 
 * 使用方式：
 * import { OmniLogger } from '@/lib/omni-logger';
 * 
 * OmniLogger.debug('ModuleName', 'message');
 * OmniLogger.info('ModuleName', 'message');
 * OmniLogger.warn('ModuleName', 'message');
 * OmniLogger.error('ModuleName', 'message');
 * OmniLogger.omni('OmniAgent message');
 * OmniLogger.fiveT('5T protocol message');
 * OmniLogger.key('OmniKey message');
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogConfig {
  level: LogLevel;
  enableTimestamp: boolean;
  enableModule: boolean;
  enableEmoji: boolean;
}

const CONFIG: LogConfig = {
  level: process.env.NODE_ENV === 'production' ? 'warn' : 'debug',
  enableTimestamp: true,
  enableModule: true,
  enableEmoji: true,
};

const LEVEL_PRIORITY: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

const LEVEL_EMOJI: Record<LogLevel, string> = {
  debug: '🔍',
  info: 'ℹ️',
  warn: '⚠️',
  error: '❌',
};

function shouldLog(level: LogLevel): boolean {
  return LEVEL_PRIORITY[level] >= LEVEL_PRIORITY[CONFIG.level];
}

function formatMessage(level: LogLevel, module: string, message: string): string {
  const parts: string[] = [];
  
  if (CONFIG.enableTimestamp) {
    parts.push(`[${new Date().toISOString()}]`);
  }
  
  if (CONFIG.enableEmoji) {
    parts.push(LEVEL_EMOJI[level] || '');
  }
  
  parts.push(`[${level.toUpperCase()}]`);
  
  if (CONFIG.enableModule && module) {
    parts.push(`[${module}]`);
  }
  
  parts.push(message);
  
  return parts.join(' ');
}

export const OmniLogger = {
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
  
  // 萬能元鑰日誌
  key: (message: string, ...args: any[]) => {
    if (shouldLog('info')) {
      console.log(formatMessage('info', 'OmniKey', message), ...args);
    }
  },
  
  // 設定日誌級別
  setLevel: (level: LogLevel) => {
    CONFIG.level = level;
  },
  
  // 取得目前日誌級別
  getLevel: (): LogLevel => CONFIG.level,
};

export default OmniLogger;
