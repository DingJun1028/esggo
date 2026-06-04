'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Play, Loader2, CheckCircle, AlertTriangle, Globe } from 'lucide-react';
import { BrandCard, BrandCardHeader, BrandButton, BrandBadge } from '../brand';
export default function ScraperControl() {
    const [loadingTarget, setLoadingTarget] = useState(null);
    const [results, setResults] = useState([
        {
            id: 'task-1',
            target: 'GRI Standards Update',
            status: 'success',
            itemsScraped: 12,
            timestamp: new Date(Date.now() - 3600000).toLocaleString(),
            sourceUrl: 'https://globalreporting.org'
        },
        {
            id: 'task-2',
            target: 'EU CBAM Regulations',
            status: 'success',
            itemsScraped: 8,
            timestamp: new Date(Date.now() - 7200000).toLocaleString(),
            sourceUrl: 'https://taxation-customs.ec.europa.eu'
        }
    ]);
    const handleScrape = async (target) => {
        setLoadingTarget(target);
        try {
            let response;
            if (target === 'all') {
                response = await fetch('/api/scraper', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ action: 'scrape_all' })
                });
            }
            else {
                response = await fetch('/api/scraper', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ action: 'scrape_target', targetIds: [target] })
                });
            }
            const data = await response.json();
            if (!response.ok || !data.success) {
                throw new Error(data.error || 'Scraping failed');
            }
            if (target === 'all') {
                const newResults = data.results.map((r, index) => {
                    const item = r;
                    return {
                        id: `task-${Date.now()}-${index}`,
                        target: item.source || 'Unknown Source',
                        status: item.success ? 'success' : 'failed',
                        itemsScraped: item.articles?.length || 0,
                        timestamp: new Date().toLocaleString(),
                        sourceUrl: item.url || 'Multiple Sources'
                    };
                });
                setResults(prev => [...newResults, ...prev]);
            }
            else {
                const newResult = {
                    id: `task-${Date.now()}`,
                    target: data.result.source || target,
                    status: data.result.success ? 'success' : 'failed',
                    itemsScraped: data.result.articles?.length || 0,
                    timestamp: new Date().toLocaleString(),
                    sourceUrl: data.result.url || 'https://example-source.com'
                };
                setResults(prev => [newResult, ...prev]);
            }
        }
        catch (error) {
            console.error("Scraping failed", error);
        }
        finally {
            setLoadingTarget(null);
        }
    };
    const targets = [
        { id: 'twse-esg', name: '台灣證交所 ESG 資訊', desc: '抓取上市櫃公司永續報告書新規範' },
        { id: 'tcfd', name: 'TCFD 氣候財務揭露', desc: '獲取最新科學基礎氣候風險標準' },
        { id: 'gri', name: 'GRI 全球報告倡議組織', desc: '追蹤 GRI 準則動態與更新' },
    ];
    return (_jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-8", children: [_jsx("div", { className: "lg:col-span-1 space-y-6", children: _jsxs(BrandCard, { children: [_jsx(BrandCardHeader, { title: "\u722C\u87F2\u4EFB\u52D9\u63A7\u5236", subtitle: "\u9078\u64C7\u76EE\u6A19\u4F86\u6E90\u4E26\u555F\u52D5\u63A1\u96C6" }), _jsxs("div", { className: "mt-6 space-y-4", children: [targets.map(t => (_jsxs("div", { className: "p-4 border border-slate-200 rounded-2xl hover:border-blue-300 hover:bg-blue-50/30 transition-all", children: [_jsxs("div", { className: "flex justify-between items-start mb-2", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Globe, { size: 16, className: "text-[#003262]" }), _jsx("h3", { className: "text-sm font-bold text-[#003262]", children: t.name })] }), _jsxs(BrandButton, { variant: "primary", size: "sm", className: "h-8 px-4", disabled: loadingTarget === t.id || loadingTarget === 'all', onClick: () => handleScrape(t.id), children: [loadingTarget === t.id ? _jsx(Loader2, { size: 14, className: "animate-spin" }) : _jsx(Play, { size: 14 }), _jsx("span", { className: "ml-1", children: loadingTarget === t.id ? '採集中...' : '啟動' })] })] }), _jsx("p", { className: "text-xs text-slate-500 font-medium", children: t.desc })] }, t.id))), _jsxs("div", { className: "pt-4 mt-2 border-t border-slate-100", children: [_jsxs(BrandButton, { variant: "secondary", fullWidth: true, className: "h-12 bg-gradient-to-r from-[#003262] to-[#1a4a7a] text-white font-black", disabled: loadingTarget !== null, onClick: () => handleScrape('all'), children: [loadingTarget === 'all' ? _jsx(Loader2, { size: 18, className: "animate-spin mr-2" }) : _jsx(Play, { size: 18, className: "mr-2" }), "\u4E00\u9375\u5168\u5C40\u6383\u63CF (Scrape All)"] }), _jsx("p", { className: "text-center text-[10px] text-slate-400 mt-2 font-bold tracking-widest uppercase", children: "Warning: May consume significant Omni-Agent credits" })] })] })] }) }), _jsx("div", { className: "lg:col-span-2", children: _jsxs(BrandCard, { className: "h-full", children: [_jsxs("div", { className: "flex justify-between items-center mb-6", children: [_jsx(BrandCardHeader, { title: "\u8FD1\u671F\u63A1\u96C6\u7D00\u9304", subtitle: "Scraper Execution History" }), _jsxs(BrandBadge, { variant: "outline", size: "sm", children: [results.length, " \u7B46\u7D00\u9304"] })] }), _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full text-sm text-left", children: [_jsx("thead", { className: "bg-slate-50 text-xs text-slate-500 uppercase font-black tracking-widest border-y border-slate-100", children: _jsxs("tr", { children: [_jsx("th", { className: "px-4 py-3", children: "\u72C0\u614B" }), _jsx("th", { className: "px-4 py-3", children: "\u4EFB\u52D9\u76EE\u6A19" }), _jsx("th", { className: "px-4 py-3", children: "\u53D6\u5F97\u7B46\u6578" }), _jsx("th", { className: "px-4 py-3", children: "\u5B8C\u6210\u6642\u9593" }), _jsx("th", { className: "px-4 py-3", children: "\u4F86\u6E90" })] }) }), _jsxs("tbody", { className: "divide-y divide-slate-100", children: [results.map(r => (_jsxs("tr", { className: "hover:bg-slate-50/50 transition-colors", children: [_jsx("td", { className: "px-4 py-4", children: r.status === 'success' ? (_jsxs("div", { className: "flex items-center gap-1.5 text-emerald-600", children: [_jsx(CheckCircle, { size: 16 }), _jsx("span", { className: "text-xs font-bold", children: "\u6210\u529F" })] })) : (_jsxs("div", { className: "flex items-center gap-1.5 text-red-500", children: [_jsx(AlertTriangle, { size: 16 }), _jsx("span", { className: "text-xs font-bold", children: "\u5931\u6557" })] })) }), _jsx("td", { className: "px-4 py-4 font-bold text-slate-800", children: r.target }), _jsx("td", { className: "px-4 py-4", children: _jsxs("span", { className: "px-2.5 py-1 bg-[#FDB515]/10 text-[#FDB515] font-black rounded-lg", children: [r.itemsScraped, " \u7B46"] }) }), _jsx("td", { className: "px-4 py-4 text-xs text-slate-500 font-mono", children: r.timestamp }), _jsx("td", { className: "px-4 py-4", children: _jsxs("a", { href: r.sourceUrl, target: "_blank", rel: "noopener noreferrer", className: "flex items-center gap-1 text-blue-600 hover:underline text-xs font-medium", children: [_jsx(Globe, { size: 14 }), "\u524D\u5F80\u4F86\u6E90"] }) })] }, r.id))), results.length === 0 && (_jsx("tr", { children: _jsx("td", { colSpan: 5, className: "text-center py-8 text-slate-400 text-sm", children: "\u5C1A\u7121\u63A1\u96C6\u7D00\u9304" }) }))] })] }) })] }) })] }));
}
//# sourceMappingURL=ScraperControl.js.map