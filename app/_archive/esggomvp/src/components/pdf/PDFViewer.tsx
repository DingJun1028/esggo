'use client';

import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Maximize2, X } from 'lucide-react';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { useLanguage } from '@/components/LanguageProvider';

// Set up the worker source
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@\${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PDFViewerProps {
    fileUrl: string | File | null;
    onClose?: () => void;
    title?: string;
}

export function PDFViewer({ fileUrl, onClose, title = 'Document Viewer' }: PDFViewerProps) {
    const { locale } = useLanguage();
    const [numPages, setNumPages] = useState<number>(0);
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [scale, setScale] = useState<number>(1.2);
    const [loading, setLoading] = useState<boolean>(true);

    const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
        setNumPages(numPages);
        setPageNumber(1);
        setLoading(false);
    };

    const handleZoomIn = () => setScale(s => Math.min(s + 0.2, 3.0));
    const handleZoomOut = () => setScale(s => Math.max(s - 0.2, 0.5));
    const handlePrevPage = () => setPageNumber(p => Math.max(p - 1, 1));
    const handleNextPage = () => setPageNumber(p => Math.min(p + 1, numPages));

    if (!fileUrl) return null;

    return (
        <div className="flex flex-col h-full w-full bg-[#1a1c23] rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
            {/* Toolbar */}
            <div className="flex items-center justify-between px-4 py-3 bg-white/5 border-b border-white/10 backdrop-blur-md">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-aqua/20 rounded-lg">
                        <Maximize2 size={16} className="text-aqua" />
                    </div>
                    <h3 className="text-white font-bold text-sm tracking-widest uppercase">{title}</h3>
                </div>

                <div className="flex items-center gap-2">
                    {/* Zoom Controls */}
                    <div className="flex items-center bg-black/40 rounded-lg p-1 mr-4 border border-white/5">
                        <button onClick={handleZoomOut} aria-label="Zoom Out" className="p-1.5 hover:bg-white/10 rounded-md text-gray-400 hover:text-white transition-colors" title="Zoom Out">
                            <ZoomOut size={16} aria-hidden="true" />
                        </button>
                        <span className="text-xs font-mono text-gray-400 px-2 min-w-[3rem] text-center" aria-live="polite" aria-atomic="true">{Math.round(scale * 100)}%</span>
                        <button onClick={handleZoomIn} aria-label="Zoom In" className="p-1.5 hover:bg-white/10 rounded-md text-gray-400 hover:text-white transition-colors" title="Zoom In">
                            <ZoomIn size={16} aria-hidden="true" />
                        </button>
                    </div>

                    {/* Pagination */}
                    <div className="flex items-center bg-black/40 rounded-lg p-1 mr-4 border border-white/5">
                        <button
                            onClick={handlePrevPage}
                            disabled={pageNumber <= 1}
                            aria-label="Previous Page"
                            title="Previous Page"
                            className="p-1.5 hover:bg-white/10 rounded-md text-gray-400 hover:text-white transition-colors disabled:opacity-30"
                        >
                            <ChevronLeft size={16} aria-hidden="true" />
                        </button>
                        <span className="text-xs font-mono text-gray-300 px-3" aria-live="polite" aria-atomic="true">
                            {pageNumber} <span className="text-gray-600" aria-hidden="true">/</span> <span aria-label={`of ${numPages || 'unknown'}`}>{numPages || '-'}</span>
                        </span>
                        <button
                            onClick={handleNextPage}
                            disabled={pageNumber >= numPages}
                            aria-label="Next Page"
                            title="Next Page"
                            className="p-1.5 hover:bg-white/10 rounded-md text-gray-400 hover:text-white transition-colors disabled:opacity-30"
                        >
                            <ChevronRight size={16} aria-hidden="true" />
                        </button>
                    </div>

                    {/* Close Button */}
                    {onClose && (
                        <button onClick={onClose} aria-label="Close Document" title="Close Document" className="p-2 hover:bg-red-500/20 hover:text-red-400 text-gray-400 rounded-lg transition-colors ml-2">
                            <X size={20} aria-hidden="true" />
                        </button>
                    )}
                </div>
            </div>

            {/* Document Container */}
            <div className="flex-1 overflow-auto bg-[#0f1115] flex justify-center p-4 sm:p-8 relative custom-scrollbar">
                {loading && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0f1115]/80 backdrop-blur-sm z-10">
                        <div className="w-12 h-12 border-4 border-aqua/30 border-t-aqua rounded-full animate-spin mb-4" />
                        <p className="text-aqua font-bold tracking-widest uppercase text-xs">
                            {locale === 'zh-TW' ? '文檔解析中...' : 'Parsing Document...'}
                        </p>
                    </div>
                )}

                <Document
                    file={fileUrl}
                    onLoadSuccess={onDocumentLoadSuccess}
                    loading={null} // Handled by custom loader above
                    className="flex flex-col items-center drop-shadow-2xl"
                >
                    <Page
                        pageNumber={pageNumber}
                        scale={scale}
                        renderTextLayer={true}
                        renderAnnotationLayer={true}
                        className="bg-white" // PDF pages should have white background
                        loading={
                            <div className="w-[600px] h-[800px] bg-white/5 animate-pulse rounded-lg border border-white/10" />
                        }
                    />
                </Document>
            </div>
        </div>
    );
}
