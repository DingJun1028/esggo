/**
 * 日期時間工具函數
 * 前後端通用的日期處理函數
 */

// ============================================
// 日期格式化
// ============================================

export function formatDateTime(date: Date): string {
  return date.toISOString();
}

export function formatDateTimeLocal(date: Date, locale: string = 'zh-TW'): string {
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(date);
}

export function formatRelativeTime(date: Date, locale: string = 'zh-TW'): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);
  
  if (diffSec < 60) {
    return '剛剛';
  } else if (diffMin < 60) {
    return `${diffMin} 分鐘前`;
  } else if (diffHour < 24) {
    return `${diffHour} 小時前`;
  } else if (diffDay < 7) {
    return `${diffDay} 天前`;
  } else {
    return formatDateTimeLocal(date, locale);
  }
}

// ============================================
// 日期計算
// ============================================

export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export function addHours(date: Date, hours: number): Date {
  const result = new Date(date);
  result.setHours(result.getHours() + hours);
  return result;
}

export function subtractDays(date: Date, days: number): Date {
  return addDays(date, -days);
}

export function getDaysDifference(date1: Date, date2: Date): number {
  const diffMs = Math.abs(date1.getTime() - date2.getTime());
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}

// ============================================
// 日期驗證
// ============================================

export function isValidDate(date: unknown): date is Date {
  return date instanceof Date && !isNaN(date.getTime());
}

export function isExpired(expiryDate: Date): boolean {
  return new Date() > expiryDate;
}

export function isWithinRange(
  date: Date,
  startDate: Date,
  endDate: Date
): boolean {
  return date >= startDate && date <= endDate;
}

// ============================================
// 時區處理
// ============================================

export function convertToUTC(date: Date): Date {
  return new Date(date.toUTCString());
}

export function convertFromUTC(date: Date, timezone: string): Date {
  return new Date(date.toLocaleString('en-US', { timeZone: timezone }));
}

// ============================================
// 日期範圍生成
// ============================================

export interface DateRange {
  start: Date;
  end: Date;
}

export function getDateRange(period: 'today' | 'week' | 'month' | 'year'): DateRange {
  const now = new Date();
  const start = new Date(now);
  const end = new Date(now);
  
  switch (period) {
    case 'today':
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
      break;
    case 'week':
      start.setDate(now.getDate() - 7);
      break;
    case 'month':
      start.setMonth(now.getMonth() - 1);
      break;
    case 'year':
      start.setFullYear(now.getFullYear() - 1);
      break;
  }
  
  return { start, end };
}

// ============================================
// ISO Week 計算
// ============================================

export function getISOWeek(date: Date): number {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 4 - (d.getDay() || 7));
  const yearStart = new Date(d.getFullYear(), 0, 1);
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}

// ============================================
// 日期解析
// ============================================

export function parseDate(dateString: string): Date | null {
  try {
    const date = new Date(dateString);
    return isValidDate(date) ? date : null;
  } catch {
    return null;
  }
}

export function parseDateSafe(dateString: string, fallback: Date = new Date()): Date {
  return parseDate(dateString) ?? fallback;
}
