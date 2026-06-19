import React, { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, FileCheck, ShieldCheck, Search, Link, Sparkles, Crown } from 'lucide-react';
import { evidenceVaultService } from '@/services/esg-go/EvidenceVaultService';
import { EvidenceItem } from '@/types/esg_go_schema';
import { EvidenceListItem } from './EvidenceListItem';

const EvidenceVaultPage: React.FC = () => {
    const [isDragging, setIsDragging] = useState(false);
    const [evidenceList, setEvidenceList] = useState<EvidenceItem[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [userTier, setUserTier] = useState<'LITE' | 'PRO'>('LITE'); // Mock: User subscription tier
    const [searchQuery, setSearchQuery] = useState('');
    const [showLinkModal, setShowLinkModal] = useState(false);
    const [selectedEvidence, setSelectedEvidence] = useState<EvidenceItem | null>(null);
    const [generatedLink, setGeneratedLink] = useState('');

    const handleGenerateLink = useCallback((evidence: EvidenceItem) => {
        setSelectedEvidence(evidence);
        // Mock secure link generation
        const mockLink = `https://vault.esgss.ai/evidence/${evidence.id}?token=${Math.random().toString(36).substring(7)}`;
        setGeneratedLink(mockLink);
        setShowLinkModal(true);
    }, []);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(generatedLink);
        alert('Secure link copied to clipboard!');
    };

    const filteredEvidence = useMemo(() => evidenceList.filter(item =>
        item.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.hash_sha256.toLowerCase().includes(searchQuery.toLowerCase())
    ), [evidenceList, searchQuery]);

    // 5T Traceable: Fetch verifiable evidence on mount
    React.useEffect(() => {
        loadEvidence();
    }, []);

    const loadEvidence = async () => {
        try {
            setIsLoading(true);
            const data = await evidenceVaultService.getEvidenceList();
            setEvidenceList(data);
        } catch (error) {
            console.error("Failed to load evidence", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDrop = async (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const files = Array.from(e.dataTransfer.files);
        if (files.length > 0) {
            await processFiles(files);
        }
    };

    const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            await processFiles(files);
        }
    };

    const processFiles = async (files: File[]) => {
        setIsUploading(true);
        try {
            for (const file of files) {
                await evidenceVaultService.uploadEvidence(file, 'General Upload');
            }
            await loadEvidence(); // Refresh list after upload
        } catch (error) {
            console.error("Upload failed", error);
            // Could add toast here
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0F172A] text-slate-100 font-sans selection:bg-[#63a6b0]/30 p-8 pb-32">
            <header className="max-w-6xl mx-auto mb-10 flex flex-wrap items-end justify-between gap-6 border-b border-white/5 pb-8">
                <div>
                    <div className="flex items-center gap-3 text-[#63a6b0] mb-2">
                        <span className="px-3 py-1 rounded-full bg-[#63a6b0]/10 border border-[#63a6b0]/20 text-[10px] font-black uppercase tracking-widest">
                            POC-1: SME Trust Layer
                        </span>
                    </div>
                    <h1 className="text-4xl font-black uppercase tracking-tight italic">
                        Evidence <span className="text-[#63a6b0]">Vault</span> <br />
                        <span className="text-2xl text-white/40 not-italic font-light">5T 雲端證據庫</span>
                    </h1>
                </div>
                <div className="flex gap-4 items-center">
                    <div className="px-6 py-3 bg-white/5 rounded-xl border border-white/10 text-center">
                        <p className="text-[10px] uppercase font-bold text-white/40">Secured Assets</p>
                        <p className="text-2xl font-black text-[#63a6b0]">{evidenceList.length}</p>
                    </div>

                    {/* Tier Badge */}
                    <div className={`px-4 py-2.5 rounded-xl border-2 flex items-center gap-2 ${userTier === 'PRO'
                        ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 border-amber-400/50'
                        : 'bg-white/5 border-slate-600'
                        }`}>
                        {userTier === 'PRO' && <Crown size={16} className="text-amber-400" />}
                        <div className="text-center">
                            <p className="text-[9px] uppercase font-black tracking-widest ${
                                userTier === 'PRO' ? 'text-amber-400' : 'text-slate-400'
                            }">{userTier} Plan</p>
                            <p className="text-[10px] text-white/60">
                                {userTier === 'PRO' ? 'Unlimited Storage' : '5GB Limit'}
                            </p>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Upload Zone */}
                <div className="lg:col-span-1">
                    <div
                        className={`
                            h-64 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center p-6 text-center transition-all cursor-pointer relative overflow-hidden
                            ${isDragging ? 'border-[#63a6b0] bg-[#63a6b0]/10' : 'border-slate-700 bg-white/5 hover:border-slate-500'}
                        `}
                        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                        onDragLeave={() => setIsDragging(false)}
                        onDrop={handleDrop}
                    >
                        <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleFileInput} multiple />

                        {isUploading ? (
                            <div className="flex flex-col items-center">
                                <div className="size-12 border-4 border-[#63a6b0]/20 border-t-[#63a6b0] rounded-full animate-spin mb-4" />
                                <p className="font-bold animate-pulse">Hashing & Encrypting...</p>
                            </div>
                        ) : (
                            <>
                                <div className="size-16 rounded-full bg-slate-800 flex items-center justify-center mb-4 text-[#63a6b0]">
                                    <UploadCloud size={32} />
                                </div>
                                <h3 className="text-lg font-bold mb-2">Drop Proof Here</h3>
                                <p className="text-xs text-slate-400 max-w-[200px]">
                                    Upload contracts, certificates, or receipts. All files are automatically hashed (SHA-256).
                                </p>
                            </>
                        )}
                    </div>

                    <div className="mt-6 p-6 rounded-2xl bg-gradient-to-br from-[#63a6b0]/10 to-transparent border border-[#63a6b0]/20">
                        <h4 className="text-sm font-bold text-[#63a6b0] mb-2 flex items-center gap-2">
                            <ShieldCheck size={16} /> 5T Protocol Active
                        </h4>
                        <p className="text-[10px] text-slate-400 leading-relaxed">
                            Your files are secured with <strong>Hash Lock</strong> technology. Once uploaded, the content fingerprint (Hash) is immutable, ensuring audit integrity.
                        </p>
                    </div>
                </div>

                {/* Evidence List */}
                <div className="lg:col-span-2">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold uppercase flex items-center gap-2">
                            <FileCheck className="text-[#63a6b0]" /> Secured Ledger
                        </h3>
                        <div className="flex bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 items-center gap-2 w-72">
                            <Search size={16} className="text-[#63a6b0]" />
                            <input
                                type="text"
                                placeholder="Quick search by name or hash..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="bg-transparent text-sm text-white outline-none w-full placeholder:text-white/40"
                            />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <AnimatePresence>
                            {filteredEvidence.length === 0 ? (
                                <div className="p-8 text-center border border-dashed border-slate-700 rounded-2xl text-slate-500 text-sm">
                                    {searchQuery ? 'No matching evidence found.' : 'No evidence uploaded yet. Secure your first asset now.'}
                                </div>
                            ) : (
                                filteredEvidence.map((item) => (
                                    <EvidenceListItem
                                        key={item.id}
                                        item={item}
                                        userTier={userTier}
                                        onGenerateLink={handleGenerateLink}
                                    />
                                ))
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </main>

            {/* Secure Link Modal */}
            <AnimatePresence>
                {showLinkModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                        onClick={() => setShowLinkModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-slate-900 border border-white/10 rounded-3xl p-8 max-w-md w-full shadow-2xl"
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 rounded-full bg-[#63a6b0]/20 text-[#63a6b0]">
                                    <Link size={24} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black uppercase italic">Secure Link Generated</h3>
                                    <p className="text-xs text-slate-400">Share evidence with external auditors securely</p>
                                </div>
                            </div>

                            <div className="mb-6">
                                <label className="text-[10px] uppercase font-bold text-slate-500 block mb-2">Shareable URL (Read-Only)</label>
                                <div className="flex items-center gap-2 bg-black/40 border border-white/10 rounded-xl p-3">
                                    <input
                                        type="text"
                                        value={generatedLink}
                                        readOnly
                                        className="bg-transparent text-xs text-[#63a6b0] font-mono w-full outline-none"
                                    />
                                </div>
                                <p className="text-[9px] text-slate-500 mt-2 italic">
                                    🔒 This link expires in 7 days and is protected by token-based authentication.
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    onClick={() => setShowLinkModal(false)}
                                    className="p-3 rounded-xl border border-white/10 hover:bg-white/5 text-sm font-bold transition-all"
                                >
                                    Close
                                </button>
                                <button
                                    onClick={copyToClipboard}
                                    className="p-3 rounded-xl bg-[#63a6b0] text-white text-sm font-bold hover:bg-[#528d96] transition-all shadow-lg shadow-[#63a6b0]/20"
                                >
                                    Copy Link
                                </button>
                            </div>

                            {userTier === 'LITE' && (
                                <div className="mt-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center gap-2">
                                    <Sparkles size={14} className="text-amber-400" />
                                    <p className="text-[10px] text-amber-400 font-bold">Upgrade to PRO for advanced link analytics & expiration control</p>
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default EvidenceVaultPage;
