"use strict";
/**
 * 日期時間工具函數
 * 前後端通用的日期處理函數
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatDateTime = formatDateTime;
exports.formatDateTimeLocal = formatDateTimeLocal;
exports.formatRelativeTime = formatRelativeTime;
exports.addDays = addDays;
exports.addHours = addHours;
exports.subtractDays = subtractDays;
exports.getDaysDifference = getDaysDifference;
exports.isValidDate = isValidDate;
exports.isExpired = isExpired;
exports.isWithinRange = isWithinRange;
exports.convertToUTC = convertToUTC;
exports.convertFromUTC = convertFromUTC;
exports.getDateRange = getDateRange;
exports.getISOWeek = getISOWeek;
exports.parseDate = parseDate;
exports.parseDateSafe = parseDateSafe;
// ============================================
// 日期格式化
// ============================================
function formatDateTime(date) {
    return date.toISOString();
}
function formatDateTimeLocal(date, locale = 'zh-TW') {
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
function formatRelativeTime(date, locale = 'zh-TW') {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);
    if (diffSec < 60) {
        return '剛剛';
    }
    else if (diffMin < 60) {
        return `${diffMin} 分鐘前`;
    }
    else if (diffHour < 24) {
        return `${diffHour} 小時前`;
    }
    else if (diffDay < 7) {
        return `${diffDay} 天前`;
    }
    else {
        return formatDateTimeLocal(date, locale);
    }
}
// ============================================
// 日期計算
// ============================================
function addDays(date, days) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}
function addHours(date, hours) {
    const result = new Date(date);
    result.setHours(result.getHours() + hours);
    return result;
}
function subtractDays(date, days) {
    return addDays(date, -days);
}
function getDaysDifference(date1, date2) {
    const diffMs = Math.abs(date1.getTime() - date2.getTime());
    return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}
// ============================================
// 日期驗證
// ============================================
function isValidDate(date) {
    return date instanceof Date && !isNaN(date.getTime());
}
function isExpired(expiryDate) {
    return new Date() > expiryDate;
}
function isWithinRange(date, startDate, endDate) {
    return date >= startDate && date <= endDate;
}
// ============================================
// 時區處理
// ============================================
function convertToUTC(date) {
    return new Date(date.toUTCString());
}
function convertFromUTC(date, timezone) {
    return new Date(date.toLocaleString('en-US', { timeZone: timezone }));
}
function getDateRange(period) {
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
function getISOWeek(date) {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + 4 - (d.getDay() || 7));
    const yearStart = new Date(d.getFullYear(), 0, 1);
    return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}
// ============================================
// 日期解析
// ============================================
function parseDate(dateString) {
    try {
        const date = new Date(dateString);
        return isValidDate(date) ? date : null;
    }
    catch {
        return null;
    }
}
function parseDateSafe(dateString, fallback = new Date()) {
    return parseDate(dateString) ?? fallback;
}
//# sourceMappingURL=date.utils.js.map