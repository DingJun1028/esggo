"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logEvent = logEvent;
exports.getRecentLogs = getRecentLogs;
exports.exportLogs = exportLogs;
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const LOGS_DIR = 'logs';
if (!(0, fs_1.existsSync)(LOGS_DIR)) {
    (0, fs_1.mkdirSync)(LOGS_DIR);
}
const LOG_FILE = path_1.default.join(LOGS_DIR, 'omnimcp.log');
function logEvent(service, action, payload, result, error) {
    const entry = {
        timestamp: new Date().toISOString(),
        service,
        action,
        payload,
        result,
        error
    };
    // Log to console for immediate feedback
    console.log(`[${entry.timestamp}] ${service}.${action} - ${error ? 'ERROR' : 'SUCCESS'}`);
    if (error)
        console.error(error);
    // Append to log file
    const logLine = JSON.stringify(entry) + '\n';
    (0, fs_1.writeFileSync)(LOG_FILE, logLine, { flag: 'a' });
}
function getRecentLogs(limit = 10) {
    if (!(0, fs_1.existsSync)(LOG_FILE))
        return [];
    const content = readFileSync(LOG_FILE, 'utf-8');
    const lines = content.split('\n').filter(line => line.trim());
    const entries = lines.map(line => JSON.parse(line));
    return entries.slice(-limit);
}
function exportLogs() {
    if (!(0, fs_1.existsSync)(LOG_FILE))
        return '';
    return readFileSync(LOG_FILE, 'utf-8');
}
//# sourceMappingURL=logger.js.map