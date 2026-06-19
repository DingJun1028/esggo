import React, { useState, useEffect, useRef } from 'react';
import { omniLogger, LogCategory } from '@/omni/infrastructure/logging/OmniLogger';

import { MediaStorageService, MediaAsset } from '../../services/MediaStorageService';


// Lightbox/Preview Modal Component
const PreviewModal: React.FC<{ asset: MediaAsset; onClose: () => void }> = ({ asset, onClose }) => {
    // Lock body scroll when modal is open & Handle Esc key
    useEffect(() => {
        document.body.style.overflow = 'hidden';

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKeyDown);

        return () => {
            document.body.style.overflow = 'unset';
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [onClose]);

    const copyToClipboard = (url: string) => {
        navigator.clipboard.writeText(url);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md transition-opacity duration-300">
            {/* Close Button */}
            <button
                onClick={onClose}
                className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all text-white/70 hover:text-white z-50 backdrop-blur-md"
            >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>

            {/* Backdrop Click Area */}
            <div className="absolute inset-0" onClick={onClose} />

            <div className="flex flex-col md:flex-row w-full h-full max-w-7xl mx-auto p-4 md:p-8 gap-8 relative z-10 pointer-events-none">
                {/* Image Container */}
                <div className="flex-1 flex items-center justify-center relative group pointer-events-auto">
                    <img
                        src={asset.url}
                        alt={asset.name}
                        className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl transition-transform duration-300"
                    />
                </div>

                {/* Sidebar / Metadata */}
                <div className="w-full md:w-96 flex flex-col justify-center gap-6 text-white animate-in slide-in-from-right-8 fade-in duration-500 pointer-events-auto bg-black/40 md:bg-transparent p-6 md:p-0 rounded-3xl backdrop-blur-md md:backdrop-blur-none">
                    <div>
                        <span className="text-#00D4AA text-xs font-bold tracking-widest uppercase mb-2 block">{asset.category || 'Uncategorized'}</span>
                        <h2 className="text-3xl font-bold leading-tight">{asset.name}</h2>
                        <p className="text-slate-400 mt-2 text-sm">
                            {asset.description || 'No description provided.'}
                        </p>
                    </div>

                    <div className="space-y-4 border-t border-white/10 pt-4">
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-slate-500">檔案類型</span>
                            <span className="font-mono text-slate-300 uppercase">{asset.type}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-slate-500">檔案大小</span>
                            <span className="font-mono text-slate-300">{(asset.size_bytes! / 1024).toFixed(1)} KB</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-slate-500">上傳日期</span>
                            <span className="font-mono text-slate-300">{new Date(asset.created_at).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-slate-500">存儲路徑</span>
                            <span className="font-mono text-xs text-slate-300 truncate max-w-[200px]" title={asset.storage_path}>{asset.storage_path}</span>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3 mt-4">
                        <button
                            onClick={() => copyToClipboard(asset.url)}
                            className="w-full py-3 rounded-xl bg-#00D4AA text-[#0F172A] font-bold hover:bg-#00D4AA/90 transition-all flex items-center justify-center gap-2 active:scale-95"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l-3-3" /></svg>
                            複製連結 (Copy Link)
                        </button>
                        <button
                            onClick={() => window.open(asset.url, '_blank')}
                            className="w-full py-3 rounded-xl bg-white/10 border border-white/10 hover:bg-white/20 transition-all flex items-center justify-center gap-2 font-medium"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                            開啟原圖 (Open Original)
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const PremiumMediaGallery: React.FC = () => {
    const [assets, setAssets] = useState<MediaAsset[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [selectedAsset, setSelectedAsset] = useState<MediaAsset | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        loadAssets();
    }, []);

    const loadAssets = async () => {
        try {
            const data = await MediaStorageService.getAllAssets();
            setAssets(data);
        } catch (error) {
            omniLogger.error(LogCategory.SYSTEM, '[PremiumMediaGallery] Failed to load assets:', { error })
        } finally {
            setLoading(false);
        }
    };

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            await MediaStorageService.uploadAsset(file, {
                name: file.name,
                category: 'Upload',
                type: 'image'
            });
            await loadAssets(); // Refresh
        } catch (error) {
            omniLogger.error(LogCategory.SYSTEM, '[PremiumMediaGallery] Upload failed:', { error })
            alert('上傳失敗，請檢查權限或網路連接。');
        } finally {
            setUploading(false);
            if (event.target) event.target.value = '';
        }
    };

    const copyToClipboard = (url: string, e?: React.MouseEvent) => {
        e?.stopPropagation();
        navigator.clipboard.writeText(url);
    };

    return (
        <div className="p-8 min-h-screen bg-[#0F172A] text-white">
            {selectedAsset && (
                <PreviewModal asset={selectedAsset} onClose={() => setSelectedAsset(null)} />
            )}

            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileChange}
                accept="image/*"
            />

            <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="space-y-1">
                    <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-#00D4AA via-white to-#00D4AA bg-clip-text text-transparent">
                        線上圖文儲存空間
                    </h1>
                    <div className="flex items-center gap-2 text-slate-400">
                        <span className="h-1.5 w-1.5 rounded-full bg-#00D4AA animate-pulse" />
                        <p className="text-sm font-medium uppercase tracking-[0.2em]">Premium Orchestrator</p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-400">
                        {assets.length} 資產已存儲
                    </div>
                    <button
                        onClick={handleUploadClick}
                        disabled={uploading}
                        className={`px-8 py-3 rounded-2xl font-bold transition-all duration-300 transform active:scale-95 flex items-center gap-2 shadow-[0_0_20px_rgba(0,212,170,0.2)] ${uploading
                            ? 'bg-slate-700 cursor-not-allowed text-slate-400'
                            : 'bg-#00D4AA text-[#0F172A] hover:shadow-[0_0_30px_rgba(0,212,170,0.4)] hover:-translate-y-0.5'
                            }`}
                    >
                        {uploading ? (
                            <>
                                <div className="animate-spin h-4 w-4 border-2 border-[#0F172A]/20 border-t-[#0F172A] rounded-full" />
                                上傳中...
                            </>
                        ) : (
                            <>
                                <span>+ 快速上傳圖文</span>
                            </>
                        )}
                    </button>
                </div>
            </header>

            {loading ? (
                <div className="flex flex-col justify-center items-center h-96 gap-4">
                    <div className="relative h-20 w-20">
                        <div className="absolute inset-0 rounded-full border-4 border-white/5" />
                        <div className="absolute inset-0 rounded-full border-4 border-t-#00D4AA animate-spin" />
                    </div>
                    <p className="text-#00D4AA font-bold animate-pulse">正在載入專屬空間...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {assets.map((asset) => (
                        <div
                            key={asset.id}
                            onClick={() => setSelectedAsset(asset)}
                            className="group relative rounded-3xl overflow-hidden border border-white/5 bg-white/5 backdrop-blur-2xl hover:border-#00D4AA/30 transition-all duration-500 shadow-2xl cursor-pointer"
                        >
                            <div className="aspect-[4/3] relative overflow-hidden bg-black/40">
                                <img
                                    src={asset.url}
                                    alt={asset.name}
                                    className="object-cover w-full h-full transform group-hover:scale-110 transition-transform duration-1000 ease-out"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-transparent to-transparent opacity-60" />

                                {/* Overlay Actions - Only for direct copy, click anywhere else opens preview */}
                                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <button
                                        onClick={(e) => copyToClipboard(asset.url, e)}
                                        className="p-2 rounded-full bg-black/50 backdrop-blur-md border border-white/20 hover:bg-#00D4AA hover:text-[#0F172A] transition-all text-white"
                                        title="快速複制連結"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l-3-3" /></svg>
                                    </button>
                                </div>

                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                                    <span className="px-4 py-2 bg-black/50 backdrop-blur-md rounded-full text-white text-xs font-bold border border-white/20 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                        點擊預覽
                                    </span>
                                </div>
                            </div>

                            <div className="p-5 relative">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex flex-col">
                                        <h3 className="font-bold text-sm tracking-tight truncate w-40">{asset.name}</h3>
                                        <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">
                                            {asset.type} • {(asset.size_bytes! / 1024).toFixed(1)} KB
                                        </p>
                                    </div>
                                    <span className="text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-lg border border-#00D4AA/20 bg-#00D4AA/5 text-#00D4AA">
                                        {asset.category}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between pt-2 border-t border-white/5">
                                    <span className="text-[10px] text-slate-500 italic">
                                        {new Date(asset.created_at).toLocaleDateString()} 已存入
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {assets.length === 0 && !loading && (
                <div className="flex flex-col items-center justify-center min-h-[60vh] rounded-[3rem] border-2 border-dashed border-white/5 bg-white/[0.02] backdrop-blur-md group hover:border-#00D4AA/20 transition-all duration-700">
                    {/* Empty state content */}
                    <div className="relative w-32 h-32 mb-8 transform group-hover:scale-110 transition-transform duration-500">
                        <div className="absolute inset-0 bg-#00D4AA/10 rounded-full blur-3xl animate-pulse" />
                        <svg className="w-32 h-32 text-slate-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <div className="text-center space-y-2">
                        <p className="text-2xl font-bold bg-gradient-to-r from-slate-400 to-slate-600 bg-clip-text text-transparent">
                            專屬空間尚無內容
                        </p>
                        <p className="text-slate-500 font-medium max-w-xs mx-auto">
                            開始上傳您的第一個精美視覺資產，構建您的 ESG 影響力圖庫。
                        </p>
                        <button
                            onClick={handleUploadClick}
                            className="mt-6 px-10 py-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 hover:border-#00D4AA/30 transition-all text-sm font-bold tracking-widest uppercase"
                        >
                            立即發佈
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
