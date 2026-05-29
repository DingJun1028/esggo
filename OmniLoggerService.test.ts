import { OmniLoggerService } from './lib/logger/OmniLoggerService';

describe('OmniLoggerService', () => {
    let logger: OmniLoggerService;
    let originalFetch: typeof global.fetch;
    let originalEnv: string | undefined;

    beforeEach(() => {
        // 1. 攔截 console，避免測試過程中在終端機印出一大堆日誌
        jest.spyOn(console, 'debug').mockImplementation(() => { });
        jest.spyOn(console, 'info').mockImplementation(() => { });
        jest.spyOn(console, 'warn').mockImplementation(() => { });
        jest.spyOn(console, 'error').mockImplementation(() => { });

        // 2. 攔截 fetch，模擬遠端 API 呼叫
        originalFetch = global.fetch;
        global.fetch = jest.fn().mockResolvedValue({ ok: true });

        // 3. 備份環境變數
        originalEnv = process.env.NODE_ENV;

        logger = new OmniLoggerService();
    });

    afterEach(() => {
        jest.restoreAllMocks();
        global.fetch = originalFetch;
        (process.env as any).NODE_ENV = originalEnv;
    });

    it('應該正確輸出 info 日誌，且不拋送到遠端', () => {
        logger.info('這是一般資訊', { userId: '123' });

        // 驗證 console.info 被呼叫且包含指定格式
        expect(console.info).toHaveBeenCalledTimes(1);
        expect(console.info).toHaveBeenCalledWith(
            expect.stringContaining('[INFO] 這是一般資訊 | Context: {"userId":"123"}')
        );

        // info 級別不該觸發 fetch
        expect(global.fetch).not.toHaveBeenCalled();
    });

    it('應該正確輸出 warn 日誌，並透過 fetch 拋送至遠端', () => {
        logger.warn('這是一個警告', { action: 'test' });

        expect(console.warn).toHaveBeenCalledTimes(1);
        expect(console.warn).toHaveBeenCalledWith(expect.stringContaining('[WARN] 這是一個警告'));

        // warn 級別必須觸發遙測
        expect(global.fetch).toHaveBeenCalledTimes(1);
        expect(global.fetch).toHaveBeenCalledWith(
            expect.any(String), // url
            expect.objectContaining({
                method: 'POST',
                body: expect.stringContaining('"level":"warn"'),
            })
        );
    });

    it('應該正確輸出 error 日誌，並將 Error 堆疊拋送至遠端', () => {
        const mockError = new Error('系統崩潰錯誤');
        logger.error('執行寫入時發生例外', mockError, { docId: '456' });

        expect(console.error).toHaveBeenCalledTimes(1);
        expect(console.error).toHaveBeenCalledWith(expect.stringContaining('[ERROR] 執行寫入時發生例外'), mockError);

        // 確保 fetch 拋送的 body 中包含錯誤訊息
        expect(global.fetch).toHaveBeenCalledTimes(1);
        expect(global.fetch).toHaveBeenCalledWith(
            expect.any(String),
            expect.objectContaining({
                method: 'POST',
                body: expect.stringContaining('"error":"系統崩潰錯誤"'),
            })
        );
    });

    it('debug 日誌應該只在開發環境輸出', () => {
        process.env.NODE_ENV = 'development';
        logger.debug('這是除錯訊息');
        expect(console.debug).toHaveBeenCalledTimes(1);
        expect(global.fetch).not.toHaveBeenCalled();

        jest.clearAllMocks();

        // 切換到正式環境
        process.env.NODE_ENV = 'production';
        logger.debug('不該出現的除錯訊息');
        expect(console.debug).not.toHaveBeenCalled();
    });
});