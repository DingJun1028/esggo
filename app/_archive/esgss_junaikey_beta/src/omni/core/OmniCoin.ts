import { omniLogger, LogCategory } from '../infrastructure/logging/OmniLogger';
import { omniChain } from './OmniChain';
import { Protocol5T } from './types/InfoOne.types';

/**
 * ?? OmniCoin: The Sentient Value Token.
 * ========================================
 * [?¨Ë≥™] ?•Ë??πÂÄºÁ??èÂ??ñÈ??æÔ??ØÊ?Â∞éÂ∏´?ÅË™≤Á®ãË??°Á??ÑÂÉπ?º‰∫§?õ„Ä?
 * [EN] Quantized manifestation of knowledge value, supporting exchange for mentors, courses, and cards.
 * 
 * Enforces 5T Protocol: Traceable, Trackable, Transparent, Trustworthy, Tangible.
 */
export interface OmniCoinTransaction {
    txId: string;
    from: string;
    to: string;
    amount: number;
    reason: string;
    timestamp: number;
    protocol: Protocol5T[];
}

export class OmniCoin {
    private static instance: OmniCoin;
    private balances: Map<string, number> = new Map();
    private transactions: OmniCoinTransaction[] = [];

    private constructor() { }

    public static getInstance(): OmniCoin {
        if (!OmniCoin.instance) {
            OmniCoin.instance = new OmniCoin();
        }
        return OmniCoin.instance;
    }

    /**
     * Mint value tokens for a user/entity based on knowledge achievement.
     */
    public async mint(targetId: string, amount: number, reason: string): Promise<OmniCoinTransaction> {
        const currentBalance = this.balances.get(targetId) || 0;
        this.balances.set(targetId, currentBalance + amount);

        const tx: OmniCoinTransaction = {
            txId: `tx-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            from: 'SYSTEM_TREASURY',
            to: targetId,
            amount,
            reason,
            timestamp: Date.now(),
            protocol: [Protocol5T.TANGIBLE, Protocol5T.TRACEABLE, Protocol5T.TRUSTWORTHY]
        };

        this.transactions.push(tx);
        omniLogger.info(LogCategory.BUSINESS, `[OmniCoin] ?? Minted ${amount} coins for ${targetId}. Reason: ${reason}`);

        // Anchor transaction to OmniChain for "Knowledge is Asset"
        await omniChain.anchorAsset(tx.txId);

        return tx;
    }

    /**
     * Transfer value tokens between entities.
     */
    public async transfer(from: string, to: string, amount: number, reason: string): Promise<OmniCoinTransaction> {
        const fromBalance = this.balances.get(from) || 0;
        if (fromBalance < amount) {
            throw new Error(`Insufficient OmniCoin balance for ${from}`);
        }

        this.balances.set(from, fromBalance - amount);
        const toBalance = this.balances.get(to) || 0;
        this.balances.set(to, toBalance + amount);

        const tx: OmniCoinTransaction = {
            txId: `tx-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            from,
            to,
            amount,
            reason,
            timestamp: Date.now(),
            protocol: [Protocol5T.TRANSPARENT, Protocol5T.TRACKABLE, Protocol5T.TRUSTWORTHY]
        };

        this.transactions.push(tx);
        omniLogger.info(LogCategory.BUSINESS, `[OmniCoin] ?í∏ Transfer: ${amount} from ${from} to ${to}. Reason: ${reason}`);

        return tx;
    }

    public getBalance(id: string): number {
        return this.balances.get(id) || 0;
    }
}

export const omniCoin = OmniCoin.getInstance();
