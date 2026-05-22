'use client';

import React, { useState, useEffect } from 'react';
import ClientLayout from '../ClientLayout';
import { getSocialMetrics, SocialMetric } from '@/lib/db';
import BrandPageHeader from '@/components/brand/BrandPageHeader';
import BrandTabs from '@/components/brand/BrandTabs';
import BrandKpiCard from '@/components/brand/BrandKpiCard';
import BrandCard, { BrandCardHeader } from '@/components/brand/BrandCard';
import BrandBadge from '@/components/brand/BrandBadge';
import { Users, ShieldAlert, BookOpen, Link, Heart, Scale, Sparkles, RefreshCw, CheckCircle } from 'lucide-react';

const TAB_DATA = [
  { id: 'workforce', label: '員工結構', icon: <Users size={16} />, gri: 'GRI 2-7, 401-405' },
  { id: 'safety', label: '職業安全', icon: <ShieldAlert size={16} />, gri: 'GRI 403' },
  { id: 'training', label: '人才培育', icon: <BookOpen size={16} />, gri: 'GRI 404' },
  { id: 'supply', label: '供應鏈管理', icon: <Link size={16} />, gri: 'GRI 308, 414' },
  { id: 'community', label: '社區共榮', icon: <Heart size={16} />, gri: 'GRI 413, 201' },
  { id: 'human_rights', label: '人權盡職調查', icon: <Scale size={16} />, gri: 'GRI 412' },
];

export default function SocialPage() {
  const [metrics, setMetrics] = useState<SocialMetric[]>([]);
  const [activeTab, setActiveTab] = useState('workforce');
  const [loading, setLoading] = useState(true);
  const [insights, setInsights] = useState('');
  const [loadingInsights, setLoadingInsights] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' | 'info' } | null>(null);

  const showToast = (msg: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (metrics.length > 0) {
      loadInsights(activeTab);
    }
  }, [activeTab, metrics]);

  async function loadData() {
    setLoading(true);
    try {
      const data = await getSocialMetrics();
      setMetrics(data);
    } catch (err) {
      console.error('Failed to load social metrics:', err);
      showToast('無法取得社會類別指標，請稍後重試。', 'error');
    } finally {
      setLoading(false);
    }
  }

  async function loadInsights(category: string) {
    setLoadingInsights(true);
    setInsights('');
    try {
      const res = await fetch(`/api/social/insights?category=${category}`);
      if (res.ok) {
        const data = await res.json();
        setInsights(data.insights);
      } else {
        setInsights('**無法取得 OmniHermes 洞察。**\n連線逾時或伺服器錯誤，請檢查網路連線或稍後再試。');
        showToast('無法取得洞察，請稍後重試。', 'error');
      }
    } catch (err) {
      console.error(err);
      setInsights('**取得洞察時發生錯誤。**\n請確認您的網路環境是否正常。');
      showToast('洞察載入失敗。', 'error');
    } finally {
      setLoadingInsights(false);
    }
  }

  const tabMetrics = metrics.filter(m => m.category === activeTab);
  const activeTabData = TAB_DATA.find(t => t.id === activeTab);

  return (
    <ClientLayout>
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-6 right-6 z-[9999] fade-in">
          <BrandCard padding="sm" className={`flex items-center gap-3 border-none text-white shadow-xl ${toast.type === 'error' ? 'bg-red-600' : toast.type === 'info' ? 'bg-blue-700' : 'bg-green-600'}`}>
             {toast.type === 'error' ? <ShieldAlert size={16} /> : <CheckCircle size={16} />} 
             <span className="font-bold text-sm">{toast.msg}</span>
          </BrandCard>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <BrandPageHeader
          title="共榮普惠 (Social Impact)"
          subtitle="GRI 401-414 社會類別指標：透過 Hermes AI 提供員工、安全、供應鏈與社區參與的深度洞察"
          icon={<Heart size={28} />}
        />

        <BrandTabs
          tabs={TAB_DATA.map(t => ({
            id: t.id,
            label: t.label,
            icon: t.icon,
            badge: metrics.filter(m => m.category === t.id).length || undefined
          }))}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          variant="line"
        />

        {loading ? (
          <div className="space-y-6 animate-pulse">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
              {[1, 2, 3, 4].map(i => (
                <BrandCard key={i} padding="md" className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-slate-200"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                    <div className="h-6 bg-slate-200 rounded w-1/3"></div>
                  </div>
                </BrandCard>
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <BrandCard className="h-full">
                  <div className="p-4 border-b border-slate-100 flex justify-between">
                    <div className="h-6 bg-slate-200 rounded w-1/3"></div>
                    <div className="h-6 bg-slate-200 rounded w-1/4"></div>
                  </div>
                  <div className="p-4 space-y-4">
                    {[1, 2, 3, 4].map(i => <div key={i} className="h-10 bg-slate-100 rounded w-full"></div>)}
                  </div>
                </BrandCard>
              </div>
              <div className="lg:col-span-1">
                <div className="bg-slate-200 rounded-2xl h-full min-h-[300px]"></div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            
            {/* KPI Summary Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
              {tabMetrics.map((m, idx) => (
                <BrandKpiCard
                  key={m.id || idx}
                  label={m.metric_name}
                  value={m.metric_value ?? '-'}
                  unit={m.unit}
                  verified={m.verified}
                  sealed={m.zkp_sealed}
                  color={m.verified ? '#22C55E' : '#FDB515'}
                  icon={<Users size={20} />}
                />
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Detailed Table Section */}
              <div className="lg:col-span-2">
                <BrandCard className="h-full">
                  <BrandCardHeader 
                    title={`${activeTabData?.label} 指標明細`}
                    subtitle={`符合 ${activeTabData?.gri} 標準`}
                  />
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-600">
                      <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
                        <tr>
                          <th className="px-4 py-3">指標名稱</th>
                          <th className="px-4 py-3 text-right">數值</th>
                          <th className="px-4 py-3">GRI 參考</th>
                          <th className="px-4 py-3 text-center">狀態</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tabMetrics.length === 0 ? (
                          <tr>
                            <td colSpan={4} className="px-4 py-8 text-center text-slate-400">無相關數據</td>
                          </tr>
                        ) : (
                          tabMetrics.map((m, idx) => (
                            <tr key={idx} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50">
                              <td className="px-4 py-3 font-medium text-[#0F172A]">{m.metric_name}</td>
                              <td className="px-4 py-3 text-right">
                                <span className="font-bold text-[#003262] text-base">{m.metric_value}</span>
                                <span className="text-slate-400 ml-1">{m.unit}</span>
                              </td>
                              <td className="px-4 py-3">
                                <BrandBadge variant="default">{m.gri_standard}</BrandBadge>
                              </td>
                              <td className="px-4 py-3 text-center">
                                {m.zkp_sealed ? (
                                  <BrandBadge variant="sealed" dot>
                                    <ShieldAlert size={12} className="inline mr-1" />
                                    ZKP 封印
                                  </BrandBadge>
                                ) : m.verified ? (
                                  <BrandBadge variant="success">✓ 已驗證</BrandBadge>
                                ) : (
                                  <BrandBadge variant="warning">待驗證</BrandBadge>
                                )}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </BrandCard>
              </div>

              {/* Hermes AI Insights Section */}
              <div className="lg:col-span-1">
                <div className="bg-gradient-to-br from-[#003262] to-[#001F3F] rounded-2xl p-6 text-white h-full shadow-lg relative overflow-hidden flex flex-col">
                  {/* Decorative Elements */}
                  <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-white/5 blur-2xl" />
                  <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-32 h-32 rounded-full bg-[#FDB515]/10 blur-2xl" />
                  
                  <div className="relative z-10 flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md">
                        <Sparkles size={20} className="text-[#FDB515]" />
                      </div>
                      <h3 className="font-semibold text-lg">Hermes 智能洞察</h3>
                    </div>
                    {loadingInsights && <RefreshCw size={16} className="animate-spin text-white/60" />}
                  </div>

                  <div className="relative z-10 flex-1 flex flex-col text-sm text-slate-200/90 leading-relaxed overflow-y-auto pr-2 custom-scrollbar">
                    {loadingInsights ? (
                      <div className="flex flex-col items-center justify-center flex-1 space-y-3 opacity-70 py-10">
                        <div className="flex gap-1">
                          <span className="w-2 h-2 rounded-full bg-[#FDB515] animate-bounce" style={{ animationDelay: '0ms' }} />
                          <span className="w-2 h-2 rounded-full bg-[#FDB515] animate-bounce" style={{ animationDelay: '150ms' }} />
                          <span className="w-2 h-2 rounded-full bg-[#FDB515] animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                        <p>正在分析 {activeTabData?.label} 數據...</p>
                      </div>
                    ) : (
                      <div className="prose prose-invert prose-sm max-w-none">
                        {insights ? (
                          <div dangerouslySetInnerHTML={{ __html: insights.replace(/\n/g, '<br/>') }} />
                        ) : (
                          <p className="text-slate-400 italic">目前無洞察報告</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}
      </div>
    </ClientLayout>
  );
}