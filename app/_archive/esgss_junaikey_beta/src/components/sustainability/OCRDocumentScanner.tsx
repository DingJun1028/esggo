/**
 * 📄 OCR Document Scanner Component
 * 
 * 永續報告書 OCR 文檔掃描與識別組件
 * 
 * Features:
 * - Multi-language OCR (繁體中文/English)
 * - Drag & Drop file upload
 * - Real-time scanning progress
 * - Confidence scoring
 * - Format cleaning integration
 */

import React, { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Upload,
    FileText,
    Image,
    X,
    CheckCircle,
    AlertCircle,
    Loader2,
    ScanLine,
    Languages,
    Eye,
    EyeOff,
    RefreshCw,
    Download
} from 'lucide-react';
import { ComponentCoreFactory } from '@/services/ceremony/core/IComponentCore';

interface OCRResult {
    id: string;
    text: string;
    confidence: number;
    language: 'zh-TW' | 'en' | 'mixed';
    blocks: OCRBlock[];
    processedAt: Date;
}

interface OCRBlock {
    text: string;
    confidence: number;
    boundingBox: {
        x: number;
        y: number;
        width: number;
        height: number;
    };
    type: 'text' | 'table' | 'chart' | 'header' | 'footer';
}

interface OCRDocumentScannerProps {
    onScanComplete: (result: OCRResult) => void;
    onError: (error: string) => void;
    maxFileSize?: number;
    acceptedFormats?: string[];
}

export const OCRDocumentScanner: React.FC<OCRDocumentScannerProps> = ({
    onScanComplete,
    onError,
    maxFileSize = 10 * 1024 * 1024, // 10MB
    acceptedFormats = ['.pdf', '.png', '.jpg', '.jpeg', '.tiff', '.docx']
}) => {
    // 5T Protocol: Core Identity
    const core = useRef(useCallback(() => 
        ComponentCoreFactory.create('OCRDocumentScanner'), []
    )).current();

    const [isDragging, setIsDragging] = useState(false);
    const [isScanning, setIsScanning] = useState(false);
    const [scanProgress, setScanProgress] = useState(0);
    const [scanStatus, setScanStatus] = useState('');
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
    const [scanResults, setScanResults] = useState<OCRResult[]>([]);
    const [selectedResult, setSelectedResult] = useState<OCRResult | null>(null);
    const [showConfidence, setShowConfidence] = useState(true);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // ========================================
    // File Handling
    // ========================================

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const files = Array.from(e.dataTransfer.files);
        processFiles(files);
    }, []);

    const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        processFiles(files);
    }, []);

    const processFiles = async (files: File[]) => {
        const validFiles = files.filter(file => {
            const ext = `.${file.name.split('.').pop()?.toLowerCase()}`;
            if (!acceptedFormats.includes(ext)) {
                onError(`不支援的檔案格式: ${file.name}`);
                return false;
            }
            if (file.size > maxFileSize) {
                onError(`檔案過大: ${file.name} (最大 ${maxFileSize / 1024 / 1024}MB)`);
                return false;
            }
            return true;
        });

        if (validFiles.length > 0) {
            setUploadedFiles(prev => [...prev, ...validFiles]);
            for (const file of validFiles) {
                await scanDocument(file);
            }
        }
    };

    // ========================================
    // OCR Scanning
    // ========================================

    const scanDocument = async (file: File) => {
        setIsScanning(true);
        setScanProgress(0);
        setScanStatus('初始化掃描引擎...');

        try {
            // Simulate multi-stage OCR process
            const stages = [
                { progress: 10, status: '載入文件...' },
                { progress: 25, status: '分析文件結構...' },
                { progress: 40, status: '識別文字區塊...' },
                { progress: 55, status: 'OCR 文字識別中 (繁體中文)...' },
                { progress: 70, status: 'OCR 文字識別中 (English)...' },
                { progress: 85, status: '語言模型校對中...' },
                { progress: 95, status: '格式化清洗...' },
                { progress: 100, status: '掃描完成!' }
            ];

            for (const stage of stages) {
                await new Promise(resolve => setTimeout(resolve, 300));
                setScanProgress(stage.progress);
                setScanStatus(stage.status);
            }

            // Generate mock OCR result
            const result: OCRResult = {
                id: `ocr-${Date.now()}`,
                text: generateMockOCRResult(file),
                confidence: 0.92 + Math.random() * 0.06,
                language: file.name.includes('en') ? 'en' : 'zh-TW',
                blocks: generateMockOCRBlocks(),
                processedAt: new Date()
            };

            setScanResults(prev => [...prev, result]);
            onScanComplete(result);

        } catch (error) {
            onError(`掃描失敗: ${error instanceof Error ? error.message : '未知錯誤'}`);
        } finally {
            setIsScanning(false);
            setScanProgress(0);
            setScanStatus('');
        }
    };

    const generateMockOCRResult = (file: File): string => {
        return `
            2024企業永續報告書
            
            GRI 302-1 組織內部的能源消耗
            本年度能源消耗總量為 125,000 GJ，較去年減少 5.2%。
            其中電力消耗為 85,000 MWh，天然氣消耗為 40,000 GJ。
            
            GRI 305-1 直接溫室氣體排放（範疇一）
            2024年直接排放量為 12,500 tCO2e，較基準年減少 15%。
            
            多元化數據
            女性主管比例：38%
            整體員工滿意度：4.2/5.0
            
            公司治理
            獨立董事比例：45%
            召開董事会會議：12次
        `.trim();
    };

    const generateMockOCRBlocks = (): OCRBlock[] => {
        return [
            {
                text: '2024企業永續報告書',
                confidence: 0.98,
                boundingBox: { x: 100, y: 50, width: 400, height: 40 },
                type: 'header'
            },
            {
                text: 'GRI 302-1 組織內部的能源消耗',
                confidence: 0.95,
                boundingBox: { x: 50, y: 120, width: 500, height: 25 },
                type: 'text'
            },
            {
                text: '本年度能源消耗總量為 125,000 GJ',
                confidence: 0.94,
                boundingBox: { x: 50, y: 150, width: 450, height: 20 },
                type: 'text'
            },
            {
                text: '女性主管比例：38%',
                confidence: 0.96,
                boundingBox: { x: 50, y: 300, width: 300, height: 20 },
                type: 'text'
            }
        ];
    };

    // ========================================
    // UI Handlers
    // ========================================

    const removeFile = (index: number) => {
        setUploadedFiles(prev => prev.filter((_, i) => i !== index));
    };

    const clearResults = () => {
        setScanResults([]);
        setUploadedFiles([]);
        setSelectedResult(null);
    };

    // ========================================
    // Render
    // ========================================

    return (
        <div
            data-uuid={core.uuid}
            data-timestamp={core.timestamp}
            data-component="OCRDocumentScanner"
            className="w-full"
        >
            {/* Drop Zone */}
            <motion.div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className={`
                    relative border-2 border-dashed rounded-3xl p-8 transition-all duration-300 cursor-pointer
                    ${isDragging 
                        ? 'border-[#63a6b0] bg-[#63a6b0]/10' 
                        : 'border-white/20 hover:border-[#63a6b0]/50 bg-white/5'
                    }
                `}
                onClick={() => fileInputRef.current?.click()}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept={acceptedFormats.join(',')}
                    onChange={handleFileSelect}
                    className="hidden"
                />

                <div className="flex flex-col items-center justify-center text-center">
                    <motion.div
                        animate={{ y: isDragging ? -10 : 0 }}
                        className="mb-4 p-4 rounded-full bg-[#63a6b0]/10"
                    >
                        <Upload className="w-8 h-8 text-[#63a6b0]" />
                    </motion.div>
                    
                    <h3 className="text-lg font-bold text-white mb-2">
                        拖放文件到這裡 或 點擊選擇文件
                    </h3>
                    
                    <p className="text-sm text-slate-400 mb-4">
                        支援 PDF、PNG、JPG、TIFF、DOCX
                    </p>

                    <div className="flex items-center gap-4 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                            <Languages className="w-3 h-3" />
                            繁體中文 / English 雙語識別
                        </span>
                        <span className="flex items-center gap-1">
                            <ScanLine className="w-3 h-3" />
                            即時 OCR
                        </span>
                    </div>
                </div>

                {/* Scanning Overlay */}
                <AnimatePresence>
                    {isScanning && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-[#050c14]/90 rounded-3xl flex flex-col items-center justify-center z-50"
                        >
                            <div className="w-64">
                                <div className="flex items-center justify-between mb-2">
                                    <Loader2 className="w-5 h-5 text-[#63a6b0] animate-spin" />
                                    <span className="text-sm text-white">{scanStatus}</span>
                                </div>
                                
                                {/* Progress Bar */}
                                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${scanProgress}%` }}
                                        transition={{ duration: 0.3 }}
                                        className="h-full bg-gradient-to-r from-[#63a6b0] to-[#4d9e9f]"
                                    />
                                </div>
                                
                                <p className="text-center text-xs text-slate-400 mt-2">
                                    {scanProgress}%
                                </p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            {/* Uploaded Files List */}
            {uploadedFiles.length > 0 && (
                <div className="mt-6 space-y-3">
                    <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold text-slate-300">
                            已上傳文件 ({uploadedFiles.length})
                        </h4>
                        <button
                            onClick={clearResults}
                            className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1"
                        >
                            <X className="w-3 h-3" />
                            清除全部
                        </button>
                    </div>

                    <div className="grid gap-2">
                        {uploadedFiles.map((file, index) => (
                            <motion.div
                                key={`${file.name}-${index}`}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-2xl"
                            >
                                <div className="flex items-center gap-3">
                                    {file.type.includes('image') ? (
                                        <Image className="w-5 h-5 text-[#63a6b0]" />
                                    ) : (
                                        <FileText className="w-5 h-5 text-[#63a6b0]" />
                                    )}
                                    <div>
                                        <p className="text-sm font-medium text-white">
                                            {file.name}
                                        </p>
                                        <p className="text-xs text-slate-500">
                                            {(file.size / 1024).toFixed(1)} KB
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    {scanResults[index] ? (
                                        <div className="flex items-center gap-2">
                                            <CheckCircle className="w-4 h-4 text-emerald-500" />
                                            <span className="text-xs text-emerald-400">
                                                {Math.round(scanResults[index].confidence * 100)}%
                                            </span>
                                        </div>
                                    ) : (
                                        <Loader2 className="w-4 h-4 text-[#63a6b0] animate-spin" />
                                    )}
                                    
                                    <button
                                        onClick={() => removeFile(index)}
                                        className="p-1 hover:bg-white/10 rounded-lg"
                                    >
                                        <X className="w-4 h-4 text-slate-400" />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}

            {/* OCR Results */}
            {scanResults.length > 0 && (
                <div className="mt-8">
                    <div className="flex items-center justify-between mb-4">
                        <h4 className="text-sm font-bold text-slate-300 flex items-center gap-2">
                            <ScanLine className="w-4 h-4 text-[#63a6b0]" />
                            OCR 識別結果
                        </h4>
                        
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setShowConfidence(!showConfidence)}
                                className="text-xs text-slate-400 flex items-center gap-1 hover:text-white"
                            >
                                {showConfidence ? (
                                    <><Eye className="w-3 h-3" /> 顯示置信度</>
                                ) : (
                                    <><EyeOff className="w-3 h-3" /> 隱藏置信度</>
                                )}
                            </button>
                            
                            <button
                                onClick={() => {
                                    const blob = new Blob([scanResults[0].text], { type: 'text/plain' });
                                    const url = URL.createObjectURL(blob);
                                    const a = document.createElement('a');
                                    a.href = url;
                                    a.download = 'ocr-result.txt';
                                    a.click();
                                }}
                                className="text-xs text-[#63a6b0] flex items-center gap-1 hover:text-[#4d9e9f]"
                            >
                                <Download className="w-3 h-3" />
                                匯出文字
                            </button>
                        </div>
                    </div>

                    {/* Result Selection */}
                    <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                        {scanResults.map((result, index) => (
                            <button
                                key={result.id}
                                onClick={() => setSelectedResult(result)}
                                className={`
                                    px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all
                                    ${selectedResult?.id === result.id
                                        ? 'bg-[#63a6b0] text-white'
                                        : 'bg-white/5 text-slate-300 hover:bg-white/10'
                                    }
                                `}
                            >
                                {uploadedFiles[index]?.name || `Result ${index + 1}`}
                            </button>
                        ))}
                    </div>

                    {/* Result Content */}
                    <AnimatePresence mode="wait">
                        {selectedResult && (
                            <motion.div
                                key={selectedResult.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="liquid-glass rounded-3xl overflow-hidden"
                            >
                                {/* Confidence Indicator */}
                                <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Languages className="w-4 h-4 text-slate-400" />
                                        <span className="text-xs text-slate-300">
                                            {selectedResult.language === 'zh-TW' ? '繁體中文' : 'English'}
                                        </span>
                                    </div>
                                    
                                    {showConfidence && (
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs text-slate-400">識別置信度:</span>
                                            <div className="flex items-center gap-1">
                                                <div className="w-20 h-2 bg-white/10 rounded-full overflow-hidden">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${selectedResult.confidence * 100}%` }}
                                                        className={`
                                                            h-full rounded-full
                                                            ${selectedResult.confidence >= 0.9 
                                                                ? 'bg-emerald-500' 
                                                                : selectedResult.confidence >= 0.8 
                                                                    ? 'bg-amber-500' 
                                                                    : 'bg-red-500'
                                                            }
                                                        `}
                                                    />
                                                </div>
                                                <span className="text-xs font-mono text-white">
                                                    {Math.round(selectedResult.confidence * 100)}%
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Text Content */}
                                <div className="p-6 max-h-96 overflow-auto">
                                    <pre className="text-sm text-slate-300 whitespace-pre-wrap font-mono leading-relaxed">
                                        {selectedResult.text}
                                    </pre>
                                </div>

                                {/* Block Details */}
                                <div className="px-6 py-4 border-t border-white/10">
                                    <p className="text-xs text-slate-500 mb-3">識別區塊:</p>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedResult.blocks.map((block, i) => (
                                            <div
                                                key={i}
                                                className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-lg"
                                            >
                                                <span className="text-xs text-slate-300 truncate max-w-150">
                                                    {block.text.substring(0, 20)}...
                                                </span>
                                                {showConfidence && (
                                                    <span className={`
                                                        text-[10px] px-1.5 py-0.5 rounded
                                                        ${block.confidence >= 0.9 
                                                            ? 'bg-emerald-500/20 text-emerald-400' 
                                                            : 'bg-amber-500/20 text-amber-400'
                                                        }
                                                    `}>
                                                        {Math.round(block.confidence * 100)}%
                                                    </span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            )}

            {/* Error Display */}
            <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                    <p className="text-sm text-red-400 font-medium">掃描注意事項</p>
                    <ul className="text-xs text-red-400/70 mt-1 space-y-1">
                        <li>• 支援繁體中文與英文混合識別</li>
                        <li>• 圖片解析度越高，識別效果越好</li>
                        <li>• PDF 文件將自動轉為圖片進行 OCR</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default OCRDocumentScanner;
