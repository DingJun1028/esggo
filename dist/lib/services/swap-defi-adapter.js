export class SwapDeFiClient {
    constructor(config) {
        this.config = {
            apiKey: config?.apiKey || process.env.SWAP_DEFI_API_KEY || '',
            token: config?.token || process.env.SWAP_DEFI_TOKEN || '',
            endpoint: config?.endpoint || process.env.SWAP_DEFI_ENDPOINT || 'https://test-umes.online/api/v1',
        };
    }
    isValidAddress(address) {
        return /^0x[a-fA-F0-9]{40}$/.test(address) || address.length >= 20;
    }
    validateTransactionParams(transaction) {
        if (!transaction.id || typeof transaction.id !== 'string') {
            throw new Error('Transaction ID is required and must be a string');
        }
        if (!transaction.fromToken || !transaction.toToken) {
            throw new Error('Both fromToken and toToken are required');
        }
        if (typeof transaction.amount !== 'number' || transaction.amount <= 0) {
            throw new Error('Amount must be a positive number');
        }
        if (!transaction.userAddress || !this.isValidAddress(transaction.userAddress)) {
            throw new Error('Invalid user address');
        }
        console.log(`[SwapDeFi] ✅ Validated transaction params for ${transaction.id}: ${transaction.amount} ${transaction.fromToken} → ${transaction.toToken}`);
    }
    async getPoolStatus(poolId) {
        console.log(`[SwapDeFi] Fetching pool ${poolId} status from TEST-UMES-ONLINE...`);
        try {
            const response = await fetch(`${this.config.endpoint}/pools/${poolId}/status`, {
                headers: {
                    'Authorization': `Bearer ${this.config.token}`,
                    'X-API-Key': this.config.apiKey,
                },
                signal: AbortSignal.timeout(5000),
            });
            if (!response.ok)
                throw new Error(`HTTP ${response.status}`);
            return await response.json();
        }
        catch (error) {
            console.warn('[SwapDeFi] Pool status fetch failed, using fallback.', error);
            return { poolId, liquidity: '0.00', apy: '0.00%', is_mock: true };
        }
    }
    async executeSwap(transaction) {
        console.log(`[SwapDeFi] Executing swap ${transaction.id}...`);
        // Validate first; let errors propagate to caller
        this.validateTransactionParams(transaction);
        try {
            const response = await fetch(`${this.config.endpoint}/swap`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.config.token}`,
                    'X-API-Key': this.config.apiKey,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(transaction),
                signal: AbortSignal.timeout(15000),
            });
            if (!response.ok)
                throw new Error(`HTTP ${response.status}`);
            return await response.json();
        }
        catch (error) {
            console.warn('[SwapDeFi] Swap execution failed, using fallback.', error);
            return { transactionId: transaction.id, status: 'failed', is_mock: true };
        }
    }
    async listPools() {
        return [
            { id: 'pool_esg_usdc', tokenA: 'ESG', tokenB: 'USDC', feeRate: 0.003 },
            { id: 'pool_ume_btc', tokenA: 'UMES', tokenB: 'WBTC', feeRate: 0.005 },
        ];
    }
}
export const swapDeFi = new SwapDeFiClient();
//# sourceMappingURL=swap-defi-adapter.js.map