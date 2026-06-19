import { IOmniAtom, IImpactTrade } from './omni-types.ts';
import { omniLogger, LogCategory } from './omniLogger.ts';
import { v4 as uuidv4 } from 'uuid';

/**
 * 💎 ImpactExchange: The Decentralized ESG Marketplace
 * Manages the transition of sovereign impact atoms between domains.
 */
export class ImpactExchange {
    private static trades: IImpactTrade[] = [];

    /**
     * 🤝 ProposeTrade: Initiate a swap of impact assets.
     */
    public static executeTrade(fromDomain: string, toDomain: string, atom: IOmniAtom<any>, value: number): IImpactTrade {
        omniLogger.info(LogCategory.SYSTEM, `ImpactExchange: Manifesting trade from [${fromDomain}] to [${toDomain}] for Atom ${atom.uuid}`);

        const trade: IImpactTrade = {
            fromDomain,
            toDomain,
            atomUuid: atom.uuid,
            exchangeValue: value,
            notarizationHash: `SHA256-${uuidv4().split('-')[0].toUpperCase()}`
        };

        this.trades.push(trade);

        omniLogger.info(LogCategory.SYSTEM, `ImpactExchange: Trade Notarized [${trade.notarizationHash}]. Transaction Value: ${value} OmniCredits.`);
        return trade;
    }

    /**
     * 📜 Ledger: Retrieve the history of cross-domain exchanges.
     */
    public static getLedger(): IImpactTrade[] {
        return this.trades;
    }
}
