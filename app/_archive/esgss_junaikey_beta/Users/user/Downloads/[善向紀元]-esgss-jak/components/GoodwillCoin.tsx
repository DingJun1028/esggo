import React, { useState } from 'react';
import { Language } from '../types';
import {
    Coins, Wallet, Send, ArrowDown, ArrowUp, History,
    TrendingUp, Shield, Zap, Users, DollarSign
} from 'lucide-react';
import { useCompany } from './providers/CompanyProvider';
import { UniversalPageHeader } from './UniversalPageHeader';

interface Transaction {
    id: string;
    type: 'received' | 'sent' | 'earned' | 'spent';
    amount: number;
    description: string;
    timestamp: number;
    counterparty?: string;
}

const SAMPLE_TRANSACTIONS: Transaction[] = [
    {
        id: 'tx-1',
        type: 'earned',
        amount: 150,
        description: '完成碳資產分析任務',
        timestamp: Date.now() - 3600000,
        counterparty: '系統'
    },
    {
        id: 'tx-2',
        type: 'spent',
        amount: -50,
        description: '購買AI洞察服務',
        timestamp: Date.now() - 7200000,
        counterparty: 'AI服務'
    },
    {
        id: 'tx-3',
        type: 'received',
        amount: 200,
        description: 'ESG改善獎勵',
        timestamp: Date.now() - 10800000,
        counterparty: '系統'
    }
];

export const GoodwillCoin: React.FC<{ language: Language }> = ({ language }) => {
    const isZh = language === 'zh-TW';
    const { goodwillBalance, updateGoodwillBalance, addAuditLog } = useCompany();

    const [transactions] = useState<Transaction[]>(SAMPLE_TRANSACTIONS);
    const [transferAmount, setTransferAmount] = useState('');
    const [recipient, setRecipient] = useState('');
    const [isTransferring, setIsTransferring] = useState(false);

    const handleTransfer = async () => {
        const amount = parseInt(transferAmount);
        if (!amount || amount <= 0 || amount > goodwillBalance || !recipient.trim()) return;

        setIsTransferring(true);
        // Simulate transfer
        await new Promise(resolve => setTimeout(resolve, 1500));

        updateGoodwillBalance(-amount);
        addAuditLog(`轉帳善意幣`, `轉給 ${recipient} ${amount} GWC`);

        setTransferAmount('');
        setRecipient('');
        setIsTransferring(false);
    };

    const totalEarned = transactions.filter(tx => tx.amount > 0).reduce((sum, tx) => sum + tx.amount, 0);
    const totalSpent = Math.abs(transactions.filter(tx => tx.amount < 0).reduce((sum, tx) => sum + tx.amount, 0));

    return (
        <div className="h-full flex flex-col min-h-0 overflow-hidden space-y-2">
            <div className="shrink-0 pb-1 border-b border-white/5">
                <UniversalPageHeader
                    icon={Coins}
                    title={{ zh: '善意幣錢包 (Goodwill Coin)', en: 'Goodwill Coin Wallet' }}
                    description={{ zh: 'Web3風格代幣經濟與交易歷史', en: 'Web3-Style Token Economy & Transaction History.' }}
                    language={language}
                    tag={{ zh: '代幣經濟 v2.1', en: 'TOKEN_ECONOMY_v2.1' }}
                />
            </div>

            <div className="flex-1 grid grid-cols-12 gap-3 min-h-0 overflow-hidden">
                {/* 1. 錢包概覽 (4/12) */}
                <div className="col-span-12 lg:col-span-4 flex flex-col gap-3 min-h-0 overflow-hidden">
                    <div className="glass-bento p-6 bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-amber-500/20 rounded-[2rem] text-center">
                        <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center">
                            <Coins className="w-10 h-10 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-1">{isZh ? '善意幣餘額' : 'Goodwill Balance'}</h3>
                        <div className="text-5xl font-mono font-black text-white tracking-tighter">
                            {goodwillBalance.toLocaleString()}
                        </div>
                        <div className="text-sm text-amber-300 mt-2">GWC</div>
                    </div>

                    {/* 統計卡片 */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="glass-bento p-4 bg-emerald-500/10 border-emerald-500/20 rounded-2xl text-center">
                            <ArrowUp className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
                            <div className="text-lg font-mono font-bold text-white">{totalEarned}</div>
                            <div className="text-[10px] text-emerald-300 uppercase font-black">{isZh ? '總收入' : 'Total Earned'}</div>
                        </div>
                        <div className="glass-bento p-4 bg-rose-500/10 border-rose-500/20 rounded-2xl text-center">
                            <ArrowDown className="w-6 h-6 text-rose-400 mx-auto mb-2" />
                            <div className="text-lg font-mono font-bold text-white">{totalSpent}</div>
                            <div className="text-[10px] text-rose-300 uppercase font-black">{isZh ? '總支出' : 'Total Spent'}</div>
                        </div>
                    </div>
                </div>

                {/* 2. 轉帳功能 (4/12) */}
                <div className="col-span-12 lg:col-span-4 flex flex-col gap-3 min-h-0 overflow-hidden">
                    <div className="glass-bento p-5 bg-slate-950 border-white/10 rounded-[2rem]">
                        <h3 className="zh-main text-[11px] text-white mb-6 flex items-center gap-2 uppercase"><Send className="w-3.5 h-3.5 text-blue-400" /> Transfer_Goodwill_Coin</h3>

                        <div className="space-y-4">
                            <div>
                                <label className="text-[10px] text-gray-500 uppercase font-black mb-2 block">{isZh ? '接收者' : 'Recipient'}</label>
                                <input
                                    type="text"
                                    value={recipient}
                                    onChange={(e) => setRecipient(e.target.value)}
                                    placeholder={isZh ? '輸入接收者地址或名稱' : 'Enter recipient address or name'}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-white text-sm focus:border-blue-500/50 focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="text-[10px] text-gray-500 uppercase font-black mb-2 block">{isZh ? '轉帳金額' : 'Transfer Amount'}</label>
                                <input
                                    type="number"
                                    value={transferAmount}
                                    onChange={(e) => setTransferAmount(e.target.value)}
                                    placeholder="0"
                                    min="1"
                                    max={goodwillBalance}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-white text-sm font-mono focus:border-blue-500/50 focus:outline-none"
                                />
                            </div>

                            <button
                                onClick={handleTransfer}
                                disabled={isTransferring || !transferAmount || !recipient || parseInt(transferAmount) > goodwillBalance}
                                className="w-full py-4 bg-blue-500 text-white font-black text-sm uppercase rounded-xl shadow-lg hover:bg-blue-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                            >
                                {isTransferring ? <Zap className="w-4 h-4 animate-pulse" /> : <Send className="w-4 h-4" />}
                                {isTransferring ? (isZh ? '轉帳中...' : 'Transferring...') : (isZh ? '確認轉帳' : 'Confirm Transfer')}
                            </button>
                        </div>
                    </div>
                </div>

                {/* 3. 交易歷史 (4/12) */}
                <div className="col-span-12 lg:col-span-4 flex flex-col gap-3 min-h-0 overflow-hidden">
                    <div className="glass-bento p-5 bg-slate-900/60 border-white/10 rounded-[2rem]">
                        <div className="flex justify-between items-center mb-6 shrink-0">
                            <h3 className="zh-main text-[11px] text-white uppercase flex items-center gap-2"><History className="w-3.5 h-3.5 text-purple-400" /> Transaction_History</h3>
                        </div>

                        <div className="flex-1 min-h-0 overflow-auto space-y-3">
                            {transactions.map(transaction => (
                                <div key={transaction.id} className="glass-bento p-3 rounded-xl bg-slate-900/40 border border-white/10">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            {transaction.type === 'earned' && <ArrowUp className="w-4 h-4 text-emerald-400" />}
                                            {transaction.type === 'spent' && <ArrowDown className="w-4 h-4 text-rose-400" />}
                                            {transaction.type === 'received' && <ArrowDown className="w-4 h-4 text-blue-400" />}
                                            {transaction.type === 'sent' && <ArrowUp className="w-4 h-4 text-orange-400" />}
                                            <span className="text-sm font-bold text-white capitalize">{transaction.type}</span>
                                        </div>
                                        <span className={`text-sm font-mono font-bold ${
                                            transaction.amount > 0 ? 'text-emerald-400' : 'text-rose-400'
                                        }`}>
                                            {transaction.amount > 0 ? '+' : ''}{transaction.amount} GWC
                                        </span>
                                    </div>

                                    <p className="text-[11px] text-gray-400 mb-2">{transaction.description}</p>

                                    <div className="flex items-center justify-between text-[10px] text-gray-500">
                                        <span>{transaction.counterparty}</span>
                                        <span>{new Date(transaction.timestamp).toLocaleString()}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};