/**
 * 日期時間工具函數
 * 前後端通用的日期處理函數
 */
export declare function formatDateTime(date: Date): string;
export declare function formatDateTimeLocal(date: Date, locale?: string): string;
export declare function formatRelativeTime(date: Date, locale?: string): string;
export declare function addDays(date: Date, days: number): Date;
export declare function addHours(date: Date, hours: number): Date;
export declare function subtractDays(date: Date, days: number): Date;
export declare function getDaysDifference(date1: Date, date2: Date): number;
export declare function isValidDate(date: unknown): date is Date;
export declare function isExpired(expiryDate: Date): boolean;
export declare function isWithinRange(date: Date, startDate: Date, endDate: Date): boolean;
export declare function convertToUTC(date: Date): Date;
export declare function convertFromUTC(date: Date, timezone: string): Date;
export interface DateRange {
    start: Date;
    end: Date;
}
export declare function getDateRange(period: 'today' | 'week' | 'month' | 'year'): DateRange;
export declare function getISOWeek(date: Date): number;
export declare function parseDate(dateString: string): Date | null;
export declare function parseDateSafe(dateString: string, fallback?: Date): Date;
//# sourceMappingURL=date.utils.d.ts.map