import { writeFileSync, existsSync, mkdirSync } from 'fs';
import path from 'path';

interface LogEntry {
  timestamp: string;
  service: string;
  action: string;
  payload: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  result: any;  // eslint-disable-line @typescript-eslint/no-explicit-any
  error?: string;
}

const LOGS_DIR = 'logs';

if (!existsSync(LOGS_DIR)) {
  mkdirSync(LOGS_DIR);
}

const LOG_FILE = path.join(LOGS_DIR, 'omnimcp.log');

export function logEvent(service: string, action: string, payload: any, result: any, error?: string) {
  const entry: LogEntry = {
    timestamp: new Date().toISOString(),
    service,
    action,
    payload,
    result,
    error
  };

  // Log to console for immediate feedback
  console.log(`[${entry.timestamp}] ${service}.${action} - ${error ? 'ERROR' : 'SUCCESS'}`);
  if (error) console.error(error);

  // Append to log file
  const logLine = JSON.stringify(entry) + '\n';
  writeFileSync(LOG_FILE, logLine, { flag: 'a' });
}

export function getRecentLogs(limit: number = 10): LogEntry[] {
  if (!existsSync(LOG_FILE)) return [];
  const content = readFileSync(LOG_FILE, 'utf-8');
  const lines = content.split('\n').filter(line => line.trim());
  const entries = lines.map(line => JSON.parse(line) as LogEntry);
  return entries.slice(-limit);
}

export function exportLogs(): string {
  if (!existsSync(LOG_FILE)) return '';
  return readFileSync(LOG_FILE, 'utf-8');
}