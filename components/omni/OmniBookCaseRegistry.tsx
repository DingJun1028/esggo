'use client';

import React, { useState, useEffect } from 'react';
import { Database, Plus, RefreshCw, FileText, CheckCircle, Search, Loader2 } from 'lucide-react';

import { IOmniComponent } from './types';
import { useToast } from "@/hooks/use-toast";
import { RecordLifecycleStatus } from '@/shared-types/status';
import { OmniZKPBadge } from './OmniZKPBadge';

const MOCK_DATA: IOmniComponent[] = [
  { 
    uuid: 'uuid-001', componentVersion: '8.5.0-Alpha', timestamp: Date.now(), evidence: { source_origin: 'mock', flow_path: [], timestamp: Date.now() },
    id: 'OMNI-001', type: 'Molecule', name: 'BrandKpiCard', lifecycleStatus: RecordLifecycleStatus.Active, attribution: '萬能元件', tangible: true, traceable: true, trackable: true, transparent: true, trustworthy: true 
  },
  { 
    uuid: 'uuid-002', componentVersion: '8.5.0-Alpha', timestamp: Date.now(), evidence: { source_origin: 'mock', flow_path: [], timestamp: Date.now() },
    id: 'OMNI-002', type: 'Organism', name: 'GenesisConsole', lifecycleStatus: RecordLifecycleStatus.Active, attribution: '萬能元件', tangible: true, traceable: true, trackable: true, transparent: true, trustworthy: true 
  },
  { 
    uuid: 'uuid-003', componentVersion: '8.5.0-Alpha', timestamp: Date.now(), evidence: { source_origin: 'mock', flow_path: [], timestamp: Date.now() },
    id: 'OMNI-003', type: 'Atom', name: 'AtomicButton', lifecycleStatus: RecordLifecycleStatus.Pending, attribution: '萬能元件', tangible: true, traceable: true, trackable: false, transparent: false, trustworthy: true 
  },
  { 
    uuid: 'uuid-004', componentVersion: '8.5.0-Alpha', timestamp: Date.now(), evidence: { source_origin: 'mock', flow_path: [], timestamp: Date.now() },
    id: 'OMNI-004', type: 'Template', name: 'OmniCoreShell', lifecycleStatus: RecordLifecycleStatus.Active, attribution: '萬能元件', tangible: true, traceable: true, trackable: true, transparent: true, trustworthy: true 
  },
  { 
    uuid: 'uuid-005', componentVersion: '8.5.0-Alpha', timestamp: Date.now(), evidence: { source_origin: 'mock', flow_path: [], timestamp: Date.now() },
    id: 'OMNI-005', type: 'Molecule', name: 'OmniBookCaseRegistry', lifecycleStatus: RecordLifecycleStatus.Draft, attribution: '萬能元件', tangible: true, traceable: true, trackable: true, transparent: true, trustworthy: true 
  },
  { 
    uuid: 'uuid-006', componentVersion: '1.0.0', timestamp: Date.now(), evidence: { source_origin: 'legacy', flow_path: ['migration'], timestamp: Date.now() },
    id: 'OMNI-006', type: 'Molecule', name: 'CarbonTrendChart', lifecycleStatus: RecordLifecycleStatus.Active, attribution: '萬能元件', tangible: true, traceable: true, trackable: true, transparent: false, trustworthy: false 
  },
  { 
    uuid: 'uuid-007', componentVersion: '1.0.0', timestamp: Date.now(), evidence: { source_origin: 'legacy', flow_path: ['migration'], timestamp: Date.now() },
    id: 'OMNI-007', type: 'Organism', name: 'DailyIntelligenceForm', lifecycleStatus: RecordLifecycleStatus.Pending, attribution: '萬能元件', tangible: true, traceable: true, trackable: true, transparent: true, trustworthy: false 
  },
  { 
    uuid: 'uuid-008', componentVersion: '1.0.0', timestamp: Date.now(), evidence: { source_origin: 'legacy', flow_path: ['migration'], timestamp: Date.now() },
    id: 'OMNI-008', type: 'Organism', name: 'ReportBuilder', lifecycleStatus: RecordLifecycleStatus.Draft, attribution: '萬能元件', tangible: true, traceable: true, trackable: false, transparent: true, trustworthy: false 
  },
  { 
    uuid: 'uuid-009', componentVersion: '1.0.0', timestamp: Date.now(), evidence: { source_origin: 'legacy', flow_path: ['migration'], timestamp: Date.now() },
    id: 'OMNI-009', type: 'Atom', name: 'SyncStatusIndicator', lifecycleStatus: RecordLifecycleStatus.Active, attribution: '萬能元件', tangible: true, traceable: true, trackable: true, transparent: true, trustworthy: true 
  },
];

export default function OmniBookCaseRegistry() {
  const { toast } = useToast();
  const [components, setComponents] = useState<IOmniComponent[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('All');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchComponents = async () => {
      try {
        const res = await fetch('/api/omni-components');
        if (res.ok) {
          const data = await res.json();
          setComponents(data.components || []);
        } else {
          toast('Failed to fetch components', 'error');
        }
      } catch (e) {
        toast('Error fetching components', 'error');
      } finally {
        setIsLoading(false);
      }
    };
    fetchComponents();
  }, [toast]);
  
  const filteredComponents = components.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'All' || c.type === filterType;
    return matchesSearch && matchesType;
  });

  const renderStatusBadge = (status: RecordLifecycleStatus) => {
    switch(status) {
      case RecordLifecycleStatus.Active: return <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 border border-green-200">運作中</span>;
      case RecordLifecycleStatus.Pending: return <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800 border border-yellow-200">測試中</span>;
      case RecordLifecycleStatus.Draft: return <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 border border-blue-200">開發中</span>;
      default: return <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800 border border-gray-200">{status}</span>;
    }
  };

  const renderDimension = (active: boolean, isTrustworthy: boolean = false) => {
    if (active) {
      return isTrustworthy 
        ? <span className="text-red-500 font-bold" title="已封印 (Hash Lock)">🔴</span> 
        : <span className="text-green-500 font-bold" title="啟用">🟢</span>;
    }
    return <span className="text-yellow-500 font-bold" title="待驗證">🟡</span>;
  };

  const syncToWiki = () => {
    // 模擬自動更新 Wiki 的行為
    toast("已觸發自動更新！同步至 OMNICOMPONENT_REGISTRY.md (Wiki)", "success");
  };

  const verifyCompliance = async () => {
    setIsVerifying(true);
    toast('ZKP Verification Initiated... Checking zero-knowledge proofs.', 'success');
    try {
      const response = await fetch('/api/5t', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ components })
      });
      if (response.ok) {
        toast('5T Protocol Verification Trace Logs Dispatched.', 'success');
      } else {
        toast('Verification failed. Check console.', 'error');
      }
    } catch (error) {
      console.error('5T Verification Error:', error);
      toast('Verification encountered an error.', 'error');
    } finally {
      setIsVerifying(false);
    }
  };

  const registerNewComponent = () => {
    const newComponent: IOmniComponent = {
      uuid: `uuid-${Date.now()}`,
      componentVersion: '1.0.0-New',
      timestamp: Date.now(),
      evidence: { source_origin: 'manual_registration', flow_path: [], timestamp: Date.now() },
      id: `OMNI-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      type: 'Atom',
      name: 'NewComponent_' + Math.floor(Math.random() * 100),
      lifecycleStatus: RecordLifecycleStatus.Draft,
      attribution: '萬能元件',
      tangible: true,
      traceable: true,
      trackable: false,
      transparent: false,
      trustworthy: false,
    };
    setComponents([newComponent, ...components]);
    toast(`Successfully registered new component: ${newComponent.name}`, "success");
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden font-sans">
      {/* Header */}
      <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50/50">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-[#63a6b0] to-[#4a8a94] rounded-lg shadow-sm text-white">
            <Database size={20} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">OmniBookCase Registry</h2>
            <p className="text-sm text-gray-500 mt-1">OmniBookCase元件總表 · 5T+1 維度控管矩陣 (MECE 分類)</p>
          </div>
          <div className="ml-4">
            <OmniZKPBadge />
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={verifyCompliance}
            disabled={isVerifying}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium shadow-sm disabled:opacity-50"
          >
            <CheckCircle size={16} className={isVerifying ? 'animate-pulse text-emerald-500' : 'text-emerald-500'} />
            <span>{isVerifying ? '驗證中...' : '5T 協議驗證'}</span>
          </button>
          <button 
            onClick={syncToWiki}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium shadow-sm"
          >
            <RefreshCw size={16} />
            <span>同步至 Wiki</span>
          </button>
          <button 
            onClick={registerNewComponent}
            className="flex items-center gap-2 px-4 py-2 bg-[#63a6b0] hover:bg-[#4a8a94] text-white rounded-lg transition-colors text-sm font-medium shadow-sm"
          >
            <Plus size={16} />
            <span>註冊新元件</span>
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="p-4 border-b border-gray-100 flex gap-4 items-center bg-white">
        <div className="relative max-w-md w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="搜尋序號或名稱..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#63a6b0]/50 transition-all"
          />
        </div>
        
        <select 
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#63a6b0]/50 text-gray-700"
        >
          <option value="All">所有種類 (MECE)</option>
          <option value="Atom">Atom (原子元件)</option>
          <option value="Molecule">Molecule (分子元件)</option>
          <option value="Organism">Organism (組織元件)</option>
          <option value="Template">Template (模板元件)</option>
        </select>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider sticky top-0 z-10 shadow-sm">
              <th className="px-6 py-4 font-semibold border-b border-gray-200">序號 (ID)</th>
              <th className="px-6 py-4 font-semibold border-b border-gray-200">種類 (Type)</th>
              <th className="px-6 py-4 font-semibold border-b border-gray-200">名稱 (Name)</th>
              <th className="px-6 py-4 font-semibold border-b border-gray-200">狀態</th>
              <th className="px-6 py-4 font-semibold border-b border-gray-200 text-center text-[#63a6b0]">元件歸屬</th>
              <th className="px-3 py-4 font-semibold border-b border-gray-200 text-center" title="Tangible">感知</th>
              <th className="px-3 py-4 font-semibold border-b border-gray-200 text-center" title="Traceable">溯源</th>
              <th className="px-3 py-4 font-semibold border-b border-gray-200 text-center" title="Trackable">追蹤</th>
              <th className="px-3 py-4 font-semibold border-b border-gray-200 text-center" title="Transparent">驗算</th>
              <th className="px-6 py-4 font-semibold text-gray-700 text-center">不可篡改<br/><span className="text-[10px] text-gray-400 normal-case">(Trustworthy)</span></th>
              <th className="px-6 py-4 font-semibold border-b border-gray-200 text-right">按鈕 (Actions)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading ? (
              <tr>
                <td colSpan={11} className="px-6 py-12 text-center text-gray-500">
                  <div className="flex flex-col items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-[#63a6b0] mb-4" />
                    <p>載入中... 同步資料庫與 OmniCore 註冊表</p>
                  </div>
                </td>
              </tr>
            ) : filteredComponents.map((comp) => (
              <tr key={comp.id} className="hover:bg-blue-50/30 transition-colors group">
                <td className="px-6 py-4">
                  <span className="font-mono text-xs font-semibold text-gray-600 bg-gray-100 px-2 py-1 rounded">{comp.id}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-gray-700 font-medium">{comp.type}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm font-semibold text-gray-800">{comp.name}</span>
                </td>
                <td className="px-6 py-4">
                  {renderStatusBadge(comp.lifecycleStatus)}
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#63a6b0] bg-[#63a6b0]/10 px-2 py-1 rounded-md border border-[#63a6b0]/20">
                    <CheckCircle size={12} />
                    {comp.attribution}
                  </span>
                </td>
                <td className="px-3 py-4 text-center">{renderDimension(comp.tangible)}</td>
                <td className="px-3 py-4 text-center">{renderDimension(comp.traceable)}</td>
                <td className="px-3 py-4 text-center">{renderDimension(comp.trackable)}</td>
                <td className="px-3 py-4 text-center">{renderDimension(comp.transparent)}</td>
                <td className="px-3 py-4 text-center">{renderDimension(comp.trustworthy, true)}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                    <button className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors" title="檢視詳情">
                      <FileText size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            
            {filteredComponents.length === 0 && (
              <tr>
                <td colSpan={11} className="px-6 py-12 text-center text-gray-500">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Database size={32} className="text-gray-300 mb-2" />
                    <p className="text-base font-medium">找不到符合的元件</p>
                    <p className="text-sm">請嘗試調整搜尋關鍵字或分類</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Footer */}
      <div className="p-4 border-t border-gray-100 bg-gray-50/50 flex justify-between items-center text-xs text-gray-500">
        <div>共 {filteredComponents.length} 個元件</div>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1"><span className="text-green-500 font-bold">🟢</span> 啟用</span>
          <span className="flex items-center gap-1"><span className="text-yellow-500 font-bold">🟡</span> 待驗證</span>
          <span className="flex items-center gap-1"><span className="text-red-500 font-bold">🔴</span> 已封印</span>
        </div>
      </div>
    </div>
  );
}
