export var LogLevel;
(function (LogLevel) {
  LogLevel['DEBUG'] = 'DEBUG';
  LogLevel['INFO'] = 'INFO';
  LogLevel['WARN'] = 'WARN';
  LogLevel['ERROR'] = 'ERROR';
  LogLevel['CRITICAL'] = 'CRITICAL';
})(LogLevel || (LogLevel = {}));
export var LogCategory;
(function (LogCategory) {
  LogCategory['SYSTEM'] = 'SYSTEM';
  LogCategory['API'] = 'API';
  LogCategory['UI'] = 'UI';
  LogCategory['DATA'] = 'DATA';
  LogCategory['AUTH'] = 'AUTH';
  LogCategory['PERFORMANCE'] = 'PERFORMANCE';
  LogCategory['GENESIS'] = 'GENESIS';
  LogCategory['DEVELOPMENT'] = 'DEVELOPMENT';
  LogCategory['AI'] = 'AI';
  LogCategory['AGENT'] = 'AGENT';
  LogCategory['ESG'] = 'ESG';
  LogCategory['SECURITY'] = 'SECURITY';
  LogCategory['USER_ACTION'] = 'USER_ACTION';
})(LogCategory || (LogCategory = {}));
export const omniLogger = {
  info: (message, metadata) => {
    console.log(`[INFO] ${message}`, metadata ? JSON.stringify(metadata, null, 2) : '');
  },
  warn: (message, metadata) => {
    console.warn(`[WARN] ${message}`, metadata ? JSON.stringify(metadata, null, 2) : '');
  },
  error: (message, metadata) => {
    console.error(`[ERROR] ${message}`, metadata ? JSON.stringify(metadata, null, 2) : '');
  },
  debug: (message, metadata) => {
    console.debug(`[DEBUG] ${message}`, metadata ? JSON.stringify(metadata, null, 2) : '');
  },
  critical: (message, metadata) => {
    console.error(`[CRITICAL] ${message}`, metadata ? JSON.stringify(metadata, null, 2) : '');
  },
};
export default omniLogger;
