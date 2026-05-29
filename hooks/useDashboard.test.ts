import { renderHook, waitFor } from '@testing-library/react';
import { useDashboardStats } from './useDashboard';
import { useServices } from '../contexts/ServiceContext';
import { getDoc } from 'firebase/firestore';
import { vi, describe, beforeEach, it, expect } from 'vitest';

// 1. 模擬 Firebase 模組，避免真的發出網路請求
vi.mock('../lib/firebase', () => ({
    db: {}
}));

vi.mock('firebase/firestore', () => ({
    doc: vi.fn(),
    getDoc: vi.fn(),
    setDoc: vi.fn(),
}));

// 2. 模擬 ServiceContext，以注入 Mock Logger
vi.mock('../contexts/ServiceContext', () => ({
    useServices: vi.fn(),
}));

describe('useDashboardStats', () => {
    const mockLoggerError = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        // 設定 useServices 回傳包含我們監聽函數的 loggerService
        (useServices as any).mockReturnValue({
            loggerService: {
                error: mockLoggerError,
            },
        });
    });

    it('should call loggerService.error and set fallback stats when getDoc fails', async () => {
        // 準備測試資料：讓 Firebase getDoc 強制拋出一個錯誤
        const mockError = new Error('Firebase network connection failed');
        (getDoc as any).mockRejectedValueOnce(mockError);

        // 渲染 (執行) Hook
        const { result } = renderHook(() => useDashboardStats());

        // 等待非同步的 fetchStats 執行完畢 (loading 變成 false)
        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        // 斷言 1：確保 loggerService.error 被正確呼叫，且參數正確
        expect(mockLoggerError).toHaveBeenCalledTimes(1);
        expect(mockLoggerError).toHaveBeenCalledWith('Failed to sync dashboard intelligence', mockError);

        // 斷言 2：確保 Hook 的狀態有正確更新為錯誤提示與 Fallback 數據
        expect(result.current.error).toBe('Failed to sync dashboard intelligence.');
        expect(result.current.stats).toEqual({
            complianceRate: 78, carbonEmissions: 1247, griCoverage: 67, auditCount: 2847
        });
    });
});
    });

    it('should call loggerService.error and set fallback stats when getDoc fails', async () => {
        // 準備測試資料：讓 Firebase getDoc 強制拋出一個錯誤
        const mockError = new Error('Firebase network connection failed');
        (getDoc as jest.Mock).mockRejectedValueOnce(mockError);

        // 渲染 (執行) Hook
        const { result } = renderHook(() => useDashboardStats());

        // 等待非同步的 fetchStats 執行完畢 (loading 變成 false)
        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        // 斷言 1：確保 loggerService.error 被正確呼叫，且參數正確
        expect(mockLoggerError).toHaveBeenCalledTimes(1);
        expect(mockLoggerError).toHaveBeenCalledWith('Failed to sync dashboard intelligence', mockError);

        // 斷言 2：確保 Hook 的狀態有正確更新為錯誤提示與 Fallback 數據
        expect(result.current.error).toBe('Failed to sync dashboard intelligence.');
        expect(result.current.stats).toEqual({
            complianceRate: 78, carbonEmissions: 1247, griCoverage: 67, auditCount: 2847
        });
    });
});