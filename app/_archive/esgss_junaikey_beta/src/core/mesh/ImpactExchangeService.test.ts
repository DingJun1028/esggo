/**
 * ImpactExchangeService.test.ts
 * 
 * 測試 Impact Credit Exchange Service 功能
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { ImpactExchangeService, ImpactCredit } from './ImpactExchangeService';

describe('ImpactExchangeService', () => {
    let service: ImpactExchangeService;

    beforeEach(() => {
        service = new ImpactExchangeService('test-node-' + Date.now());
    });

    describe('初始化測試', () => {
        it('應該正確初始化服務', () => {
            expect(service).toBeDefined();
            expect(service.getNodeId()).toContain('test-node-');
        });

        it('應該初始化模擬積分', () => {
            const credits = service.getAllCredits();
            expect(credits.length).toBeGreaterThan(0);
        });
    });

    describe('積分餘額測試', () => {
        it('應該正確返回各類別餘額', () => {
            const balance = service.getBalance();
            expect(balance.size).toBeGreaterThan(0);
            
            // 應該包含 carbon, water, energy 類別
            expect(balance.has('carbon')).toBe(true);
            expect(balance.has('water')).toBe(true);
            expect(balance.has('energy')).toBe(true);
        });
    });

    describe('交換提議測試', () => {
        it('應該成功創建交換提議', async () => {
            const credits = service.getAllCredits();
            const creditIds = credits.slice(0, 1).map(c => c.creditId);
            
            const offer = await service.createOffer(
                creditIds,
                ['social'],
                1.0,
                60
            );

            expect(offer).toBeDefined();
            expect(offer!.status).toBe('pending');
            expect(offer!.offeredCredits.length).toBe(1);
            expect(offer!.requestedCategories).toContain('social');
        });

        it('無效積分 ID 應該返回 null', async () => {
            const offer = await service.createOffer(
                ['invalid-id'],
                ['social'],
                1.0,
                60
            );

            expect(offer).toBeNull();
        });
    });

    describe('接受提議測試', () => {
        it('應該成功接受有效的提議', async () => {
            const credits = service.getAllCredits();
            const creditIds = credits.slice(0, 1).map(c => c.creditId);
            
            const offer = await service.createOffer(
                creditIds,
                ['social'],
                1.0,
                60
            );

            const transfer = await service.acceptOffer(offer!);

            expect(transfer).toBeDefined();
            expect(transfer!.status).toBe('confirmed');
            expect(transfer!.credits.length).toBe(1);
            expect(offer!.status).toBe('accepted');
        });
    });

    describe('拒絕提議測試', () => {
        it('應該成功拒絕提議', async () => {
            const credits = service.getAllCredits();
            const creditIds = credits.slice(0, 1).map(c => c.creditId);
            
            const offer = await service.createOffer(
                creditIds,
                ['social'],
                1.0,
                60
            );

            const result = service.rejectOffer(offer!.offerId);
            expect(result).toBe(true);
            expect(offer!.status).toBe('rejected');
        });
    });

    describe('5T 驗證測試', () => {
        it('應該正確驗證有效的積分', () => {
            const credits = service.getAllCredits();
            const credit = credits[0];

            const isValid = service.verifyCredit(credit);
            expect(isValid).toBe(true);
        });

        it('應該拒絕被篡改的積分', () => {
            const credits = service.getAllCredits();
            const credit = { ...credits[0] };
            
            // 篡改金額
            credit.amount = 999999;

            const isValid = service.verifyCredit(credit);
            expect(isValid).toBe(false);
        });
    });

    describe('轉移歷史測試', () => {
        it('應該記錄轉移歷史', async () => {
            const credits = service.getAllCredits();
            const creditIds = credits.slice(0, 1).map(c => c.creditId);
            
            const offer = await service.createOffer(
                creditIds,
                ['social'],
                1.0,
                60
            );

            await service.acceptOffer(offer!);

            const history = service.getTransferHistory();
            expect(history.length).toBeGreaterThan(0);
        });
    });

    describe('事件監聽測試', () => {
        it('應該觸發 offerCreated 事件', async () => {
            let eventTriggered = false;
            
            service.onOfferCreated(() => {
                eventTriggered = true;
            });

            const credits = service.getAllCredits();
            const creditIds = credits.slice(0, 1).map(c => c.creditId);
            
            await service.createOffer(creditIds, ['social']);

            expect(eventTriggered).toBe(true);
        });

        it('應該觸發 transferConfirmed 事件', async () => {
            let eventTriggered = false;
            
            service.onTransferConfirmed(() => {
                eventTriggered = true;
            });

            const credits = service.getAllCredits();
            const creditIds = credits.slice(0, 1).map(c => c.creditId);
            
            const offer = await service.createOffer(creditIds, ['social']);
            await service.acceptOffer(offer!);

            expect(eventTriggered).toBe(true);
        });
    });
});
