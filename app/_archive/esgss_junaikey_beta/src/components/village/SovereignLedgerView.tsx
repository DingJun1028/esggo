import React, { useState, useEffect } from 'react';
import SovereignVaultService, { VaultRecord } from '../../services/SovereignVaultService';
import SwarmConsensusService from '../../services/SwarmConsensusService';
import { Shield, Database, Activity, Search, ExternalLink } from 'lucide-react';

/**
 * ??ï¸?SovereignLedgerView: ä¸»æ?å¸³æœ¬æª¢è???
 * 
 * ?¸å??Ÿèƒ½:
 * 1. ?€å¡Šç€è¦½?¨é¢¨?¼æª¢è¦? å±•ç¤ºä¿éšªç®±ä¸­?„ä??¯ç¯¡?¹è??„ã€?
 * 2. ?¸æ??ˆå??´æ€§è?è¦ºå?: å±•ç¤ºæ¯ä?ç­†è??„ç? Hash ?‡é€????
 * 3. ?±é³´?±è?æ¨™è¨»: é¡¯ç¤º?‚ç¾¤?±è??„é??ç??‹ã€?
 */
const SovereignLedgerView: React.FC = () => {
    const [ledger, setLedger] = useState<VaultRecord[]>([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const loadLedger = () => {
            setLedger(SovereignVaultService.getLedger());
        };
        loadLedger();

        // æ¨¡æ“¬?¸æ?è®Šå???½
        const interval = setInterval(loadLedger, 3000);
        return () => clearInterval(interval);
    }, []);

    const filteredLedger = ledger.filter(record =>
        record.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.hash.toLowerCase().includes(searchTerm.toLowerCase())
    ).reverse();

    return (
        <div className="bg-[#0f172a] text-white p-6 rounded-2xl border border-[#00FFFF]/20 shadow-2xl">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#00FFFF]/10 rounded-lg">
                        <Database className="w-6 h-6 text-[#00FFFF]" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold">Sovereign Data Vault</h2>
                        <p className="text-sm text-gray-400">Immutable Ledger Explorer</p>
                    </div>
                </div>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by hash or type..."
                        className="bg-[#1e293b] border border-[#00FFFF]/30 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-[#00FFFF] transition-colors"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                {filteredLedger.length === 0 ? (
                    <div className="text-center py-20 text-gray-500">
                        <Activity className="w-12 h-12 mx-auto mb-4 opacity-20" />
                        <p>No records found in the vault.</p>
                    </div>
                ) : (
                    filteredLedger.map((record, index) => (
                        <div key={record.id} className="bg-[#1e293b]/50 border border-[#00FFFF]/10 rounded-xl p-4 hover:border-[#00FFFF]/40 transition-all group">
                            <div className="flex items-start justify-between mb-3">
                                <div>
                                    <span className="text-[10px] font-mono text-[#00FFFF] bg-[#00FFFF]/10 px-2 py-0.5 rounded uppercase tracking-wider">
                                        {record.type}
                                    </span>
                                    <h3 className="text-sm font-semibold mt-1 flex items-center gap-2">
                                        Record #{ledger.length - index}
                                        <Shield className="w-3 h-3 text-[#ffd700]" />
                                    </h3>
                                </div>
                                <span className="text-[10px] text-gray-500 font-mono">
                                    {new Date(record.timestamp).toLocaleString()}
                                </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-[10px] text-gray-500 mb-1">CURRENT HASH</p>
                                    <div className="bg-black/30 p-2 rounded font-mono text-[10px] text-green-400 break-all border border-green-900/30">
                                        {record.hash}
                                    </div>
                                </div>
                                <div>
                                    <p className="text-[10px] text-gray-500 mb-1">PREVIOUS HASH</p>
                                    <div className="bg-black/30 p-2 rounded font-mono text-[10px] text-gray-400 break-all border border-gray-800/30">
                                        {record.previousHash}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="flex flex-col">
                                        <span className="text-[8px] text-gray-500 uppercase">Signer DID</span>
                                        <span className="text-[10px] font-mono text-[#00FFFF]">{record.did.substring(0, 24)}...</span>
                                    </div>
                                    <div className="h-6 w-px bg-gray-700"></div>
                                    <div className="flex flex-col">
                                        <span className="text-[8px] text-gray-500 uppercase">Sealing Proof</span>
                                        <span className="text-[10px] font-mono text-[#ffd700] uppercase">{record.signature.substring(0, 16)}...</span>
                                    </div>
                                </div>
                                <button className="p-2 hover:bg-[#00FFFF]/10 rounded-lg transition-colors">
                                    <ExternalLink className="w-4 h-4 text-[#00FFFF]" />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <div className="mt-6 pt-6 border-t border-gray-800 flex items-center justify-between text-[10px] text-gray-500 uppercase tracking-widest">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    Ledger Integrity: Synchronized
                </div>
                <span>Sentient Ecosystem v8.2.1</span>
            </div>
        </div>
    );
};

export default SovereignLedgerView;

