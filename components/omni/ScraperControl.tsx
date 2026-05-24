'use client';

import React, { useState } from 'react';
import { Play, Loader2, CheckCircle, AlertTriangle, FileText, Globe } from 'lucide-react';
import { BrandCard, BrandCardHeader, BrandButton, BrandBadge } from '../brand';

interface ScraperResult {
  id: string;
  target: string;
  status: 'success' | 'failed';
  itemsScraped: number;
  timestamp: string;
  sourceUrl: string;
}

export default function ScraperControl() {
  const [loadingTarget, setLoadingTarget] = useState<string | null>(null);
  const [results, setResults] = useState<ScraperResult[]>([
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

  const handleScrape = async (target: string) => {
    setLoadingTarget(target);
    
    try {
      let response;
      if (target === 'all') {
        response = await fetch('/api/scraper', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'scrape_all' })
        });
      } else {
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
        const newResults: ScraperResult[] = data.results.map((r: any, index: number) => ({
          id: `task-${Date.now()}-${index}`,
          target: r.source || 'Unknown Source',
          status: r.success ? 'success' : 'failed',
          itemsScraped: r.articles?.length || 0,
          timestamp: new Date().toLocaleString(),
          sourceUrl: r.url || 'Multiple Sources'
        }));
        setResults(prev => [...newResults, ...prev]);
      } else {
        const newResult: ScraperResult = {
          id: `task-${Date.now()}`,
          target: data.result.source || target,
          status: data.result.success ? 'success' : 'failed',
          itemsScraped: data.result.articles?.length || 0,
          timestamp: new Date().toLocaleString(),
          sourceUrl: data.result.url || 'https://example-source.com'
        };
        setResults(prev => [newResult, ...prev]);
      }
    } catch (error) {
      console.error("Scraping failed", error);
    } finally {
      setLoadingTarget(null);
    }
  };

  const targets = [
    { id: 'twse-esg', name: '台灣證交所 ESG 資訊', desc: '抓取上市櫃公司永續報告書新規範' },
    { id: 'tcfd', name: 'TCFD 氣候財務揭露', desc: '獲取最新科學基礎氣候風險標準' },
    { id: 'gri', name: 'GRI 全球報告倡議組織', desc: '追蹤 GRI 準則動態與更新' },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Control Panel */}
      <div className="lg:col-span-1 space-y-6">
        <BrandCard>
          <BrandCardHeader title="爬蟲任務控制" subtitle="選擇目標來源並啟動採集" />
          <div className="mt-6 space-y-4">
            {targets.map(t => (
              <div key={t.id} className="p-4 border border-slate-200 rounded-2xl hover:border-blue-300 hover:bg-blue-50/30 transition-all">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <Globe size={16} className="text-[#003262]" />
                    <h3 className="text-sm font-bold text-[#003262]">{t.name}</h3>
                  </div>
                  <BrandButton 
                    variant="primary" 
                    size="sm" 
                    className="h-8 px-4"
                    disabled={loadingTarget === t.id || loadingTarget === 'all'}
                    onClick={() => handleScrape(t.id)}
                  >
                    {loadingTarget === t.id ? <Loader2 size={14} className="animate-spin" /> : <Play size={14} />}
                    <span className="ml-1">{loadingTarget === t.id ? '採集中...' : '啟動'}</span>
                  </BrandButton>
                </div>
                <p className="text-xs text-slate-500 font-medium">{t.desc}</p>
              </div>
            ))}
            
            <div className="pt-4 mt-2 border-t border-slate-100">
              <BrandButton 
                variant="secondary" 
                fullWidth 
                className="h-12 bg-gradient-to-r from-[#003262] to-[#1a4a7a] text-white font-black"
                disabled={loadingTarget !== null}
                onClick={() => handleScrape('all')}
              >
                {loadingTarget === 'all' ? <Loader2 size={18} className="animate-spin mr-2" /> : <Play size={18} className="mr-2" />}
                一鍵全局掃描 (Scrape All)
              </BrandButton>
              <p className="text-center text-[10px] text-slate-400 mt-2 font-bold tracking-widest uppercase">
                Warning: May consume significant Omni-Agent credits
              </p>
            </div>
          </div>
        </BrandCard>
      </div>

      {/* Task History */}
      <div className="lg:col-span-2">
        <BrandCard className="h-full">
          <div className="flex justify-between items-center mb-6">
             <BrandCardHeader title="近期採集紀錄" subtitle="Scraper Execution History" />
             <BrandBadge variant="outline" size="sm">{results.length} 筆紀錄</BrandBadge>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-xs text-slate-500 uppercase font-black tracking-widest border-y border-slate-100">
                <tr>
                  <th className="px-4 py-3">狀態</th>
                  <th className="px-4 py-3">任務目標</th>
                  <th className="px-4 py-3">取得筆數</th>
                  <th className="px-4 py-3">完成時間</th>
                  <th className="px-4 py-3">來源</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {results.map(r => (
                  <tr key={r.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-4">
                      {r.status === 'success' ? (
                        <div className="flex items-center gap-1.5 text-emerald-600">
                          <CheckCircle size={16} />
                          <span className="text-xs font-bold">成功</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-red-500">
                          <AlertTriangle size={16} />
                          <span className="text-xs font-bold">失敗</span>
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-4 font-bold text-slate-800">{r.target}</td>
                    <td className="px-4 py-4">
                      <span className="px-2.5 py-1 bg-[#FDB515]/10 text-[#FDB515] font-black rounded-lg">
                        {r.itemsScraped} 筆
                      </span>
                    </td>
                    <td className="px-4 py-4 text-xs text-slate-500 font-mono">{r.timestamp}</td>
                    <td className="px-4 py-4">
                      <a href={r.sourceUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-blue-600 hover:underline text-xs font-medium">
                        <Globe size={14} />
                        前往來源
                      </a>
                    </td>
                  </tr>
                ))}
                {results.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-slate-400 text-sm">
                      尚無採集紀錄
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </BrandCard>
      </div>
    </div>
  );
}
