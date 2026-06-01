/**
 * 🎪 AtomicLibraryShowcase - Comprehensive Showcase of Universal Atomic Components
 * v3.0 | #AtomicShowcase #UniversalThemes #LiquidGlass #FullSpectrum
 */

'use client';

import React, { useState } from 'react';
import { AtomicButton } from './AtomicButton';
import { AtomicInput } from './AtomicInput';
import { AtomicBadge } from './AtomicBadge';
import { AtomicCard } from './AtomicCard';
import { AtomicProgress } from './AtomicProgress';
import { AtomicToggle } from './AtomicToggle';
import { AtomicSelect } from './AtomicSelect';
import { AtomicTable } from './AtomicTable';
import { AtomicModal } from './AtomicModal';
import { AtomicAlert } from './AtomicAlert';
import { useAtomicLibrary } from './AtomicLibraryProvider';
import { UniversalThemeId, ModeLayer } from './atomic-core';
import { useListAuditRecords } from '../../src/dataconnect-generated/react';

export const AtomicLibraryShowcase: React.FC = () => {
  const { theme, mode, setTheme, setMode } = useAtomicLibrary();

  // Internal states for interactive showcase components
  const [toggle1, setToggle1] = useState(true);
  const [toggle2, setToggle2] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [selectValue, setSelectValue] = useState('esg-t4');
  const [progressVal, setProgressVal] = useState(65);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const themes: { id: UniversalThemeId; label: string }[] = [
    { id: 'benevolent-classic', label: '善向永續經典款' },
    { id: 'berkeley-academy', label: '柏克萊學院風' },
    { id: 'extreme-minimalist', label: '極致簡約款' },
    { id: 'best-practice', label: '最佳實踐款' }
  ];

  const modes: { id: ModeLayer; label: string }[] = [
    { id: 'light', label: '淺色模式' },
    { id: 'dark', label: '深色模式' },
    { id: 'system', label: '系統模式' }
  ];

  const selectOptions = [
    { label: '5T 協議 T1 - 真實性門檻 (Truth)', value: 'esg-t1' },
    { label: '5T 協議 T4 - 不可篡改門檻 (Trust)', value: 'esg-t4' },
    { label: 'GRI 305 - 溫室氣體排放標準', value: 'gri-305' },
    { label: 'ISO 14064 - 溫室氣體碳盤查規範', value: 'iso-14064' }
  ];

  const tableColumns = [
    { key: 'nodeId', header: '節點代碼' },
    { key: 'action', header: '核心行動與揭露' },
    { key: 'category', header: '類別' },
    { 
      key: 'status', 
      header: '5T 誠信狀態', 
      render: (row: any) => (
        <AtomicBadge variant={row.status === 'Verified' ? 'verified' : row.status === 'Auditing' ? 'warning' : 'error'}>
          {row.status}
        </AtomicBadge>
      )
    }
  ];

  const { data: auditData, isLoading: auditLoading } = useListAuditRecords();

  const tableData = auditData?.auditRecords && auditData.auditRecords.length > 0 
    ? auditData.auditRecords.map(record => ({
        nodeId: record.source,
        action: record.title,
        category: record.dataType,
        status: record.zkpStatus
      }))
    : [
        { nodeId: 'GOV_NODE_001', action: '溫室氣體範疇一直接排放量盤查', category: 'Environment', status: 'Verified' },
        { nodeId: 'GOV_NODE_002', action: '供應商全面簽署人權與誠信條約', category: 'Governance', status: 'Auditing' },
        { nodeId: 'GOV_NODE_003', action: '水資源消耗強度減量達標稽核', category: 'Social', status: 'Verified' },
        { nodeId: 'GOV_NODE_004', action: 'ESG 數位雙生實體共鳴度分析', category: 'Innovation', status: 'Failed' }
      ];

  return (
    <div className="space-y-12">
      {/* 👑 Control Panel */}
      <AtomicCard glassIntensity="high" padding="lg" hoverEffect="glow" className="border-[#06b6d4]/20 shadow-[0_0_30px_rgba(6,182,212,0.05)]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h2 className="text-xs font-black uppercase tracking-[0.25em] text-[#06b6d4] flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#06b6d4] animate-pulse" />
              全域主題切換 (Theme Presets)
            </h2>
            <div className="flex flex-wrap gap-2.5">
              {themes.map(t => (
                <AtomicButton 
                  key={t.id} 
                  variant={theme === t.id ? 'primary' : 'outline'}
                  onClick={() => setTheme(t.id)}
                  className="text-xs py-1.5 px-3 rounded-lg"
                >
                  {t.label}
                </AtomicButton>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xs font-black uppercase tracking-[0.25em] text-[#10b981] flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse" />
              模式分層分級 (Rendering Mode)
            </h2>
            <div className="flex flex-wrap gap-2.5">
              {modes.map(m => (
                <AtomicButton 
                  key={m.id} 
                  variant={mode === m.id ? 'primary' : 'outline'}
                  onClick={() => setMode(m.id)}
                  className="text-xs py-1.5 px-3 rounded-lg"
                >
                  {m.label}
                </AtomicButton>
              ))}
            </div>
          </div>
        </div>
      </AtomicCard>

      {/* 🧩 Atoms & Elements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Button Showcase */}
        <AtomicCard glassIntensity="medium" padding="md" hoverEffect="lift">
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-black text-slate-200 uppercase tracking-wider">按鈕原子 (Button Atoms)</h3>
              <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-widest">ATOM_BTN_001 • v1.0.0</p>
            </div>
            <div className="flex flex-col gap-3">
              <AtomicButton variant="primary">主要操作 (Primary)</AtomicButton>
              <AtomicButton variant="default">預設操作 (Default)</AtomicButton>
              <AtomicButton variant="outline">邊框樣式 (Outline)</AtomicButton>
              <AtomicButton variant="ghost">幽靈按鈕 (Ghost)</AtomicButton>
            </div>
          </div>
        </AtomicCard>

        {/* Input & Form Showcase */}
        <AtomicCard glassIntensity="medium" padding="md" hoverEffect="lift">
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-black text-slate-200 uppercase tracking-wider">輸入與選擇原子 (Inputs & Dropdowns)</h3>
              <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-widest">ATOM_INP_001 / ATOM_SEL_001</p>
            </div>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <AtomicInput 
                  placeholder="輸入檢索內容..." 
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <AtomicSelect 
                  options={selectOptions}
                  value={selectValue}
                  onChange={setSelectValue}
                  helperText="選擇治理依循的法規標準與協議門檻"
                />
              </div>
            </div>
          </div>
        </AtomicCard>

        {/* Badges & Status Showcase */}
        <AtomicCard glassIntensity="medium" padding="md" hoverEffect="lift">
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-black text-slate-200 uppercase tracking-wider">標籤狀態 (Badge Atoms)</h3>
              <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-widest">ATOM_BDG_001 • v1.0.0</p>
            </div>
            <div className="flex flex-wrap gap-2.5">
              <AtomicBadge variant="verified">Verified T4</AtomicBadge>
              <AtomicBadge variant="default">Draft Mode</AtomicBadge>
              <AtomicBadge variant="warning">In Review</AtomicBadge>
              <AtomicBadge variant="error">Critical Block</AtomicBadge>
              <AtomicBadge variant="outline">GRI 305 Aligned</AtomicBadge>
            </div>
            <div className="pt-4 border-t border-white/5 space-y-2">
              <p className="text-xs font-mono text-slate-400">整合 5T 誠信門檻認證標籤，支援不同狀態視覺反饋。</p>
            </div>
          </div>
        </AtomicCard>

        {/* Toggle Switches */}
        <AtomicCard glassIntensity="medium" padding="md" hoverEffect="lift">
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-black text-slate-200 uppercase tracking-wider">開關原子 (Toggle Switches)</h3>
              <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-widest">ATOM_TGL_001 • v1.0.0</p>
            </div>
            <div className="space-y-4">
              <AtomicToggle 
                label="5T 鏈上共識保障協定"
                isToggled={toggle1}
                onToggle={setToggle1}
              />
              <AtomicToggle 
                label="自動發布至永續治理終端"
                isToggled={toggle2}
                onToggle={setToggle2}
              />
            </div>
            <div className="p-3 bg-white/5 border border-white/5 rounded-lg text-xs space-y-1 text-slate-400">
              <div className="flex justify-between font-mono">
                <span>協定共鳴:</span>
                <span className={toggle1 ? "text-[#10b981]" : "text-rose-400"}>{toggle1 ? "Active" : "Off"}</span>
              </div>
              <div className="flex justify-between font-mono">
                <span>自動發布:</span>
                <span className={toggle2 ? "text-[#06b6d4]" : "text-slate-500"}>{toggle2 ? "Enabled" : "Disabled"}</span>
              </div>
            </div>
          </div>
        </AtomicCard>

        {/* Progress Metrics */}
        <AtomicCard glassIntensity="medium" padding="md" hoverEffect="lift">
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-black text-slate-200 uppercase tracking-wider">量化指標 (Progress Atoms)</h3>
              <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-widest">ATOM_PRG_001 • v1.0.0</p>
            </div>
            <div className="space-y-4">
              <AtomicProgress 
                value={progressVal}
                showLabel
                label="碳排放量減量達標率"
              />
              <AtomicProgress 
                value={100}
                variant="success"
                showLabel
                label="治理合規核准進度"
              />
            </div>
            <div className="flex items-center gap-3">
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={progressVal}
                onChange={(e) => setProgressVal(Number(e.target.value))}
                className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#06b6d4]"
              />
            </div>
          </div>
        </AtomicCard>

        {/* Dynamic Alerts & Modal Interactivity */}
        <AtomicCard glassIntensity="medium" padding="md" hoverEffect="lift">
          <div className="space-y-4 h-full flex flex-col justify-between">
            <div className="space-y-3">
              <h3 className="text-sm font-black text-slate-200 uppercase tracking-wider">通知與彈窗 (Overlays & Dialogs)</h3>
              <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-widest">ATOM_ALT_001 / ATOM_MOD_001</p>
              
              <AtomicAlert variant="info" title="5T 誠信警示">
                溫室氣體數據需要附帶 SHA-256 簽署驗證方能生效。
              </AtomicAlert>
            </div>
            
            <AtomicButton 
              variant="outline" 
              onClick={() => setIsModalOpen(true)}
              className="w-full text-xs font-black"
            >
              開啟二次確認彈窗
            </AtomicButton>
          </div>
        </AtomicCard>

      </div>

      {/* 📊 Universal Registry Table (Full-Width Segment) */}
      <div className="space-y-4">
        <h3 className="text-xs font-black uppercase tracking-[0.25em] text-[#06b6d4] pl-2 border-l-2 border-[#06b6d4]">
          治理節點註冊列表 (AtomicTable Spec ATOM_TBL_001)
        </h3>
        <AtomicTable 
          columns={tableColumns} 
          data={tableData} 
          loading={auditLoading}
          caption="ESG Governance Node Status Registry"
        />
      </div>

      {/* 🪟 Interactive Modal Component */}
      <AtomicModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="5T 鏈上封印二次確認 (Hash Lock Signature)"
        footerActions={
          <div className="flex gap-2">
            <AtomicButton variant="outline" onClick={() => setIsModalOpen(false)} className="text-xs">
              取消返回
            </AtomicButton>
            <AtomicButton 
              variant="primary" 
              onClick={() => {
                alert('完成 SHA-256 密鑰鏈上封印！');
                setIsModalOpen(false);
              }} 
              className="text-xs"
            >
              完成 Hash Lock
            </AtomicButton>
          </div>
        }
      >
        <div className="space-y-4 text-slate-300">
          <p>
            您正在對 **GOV_NODE_001 - 溫室氣體直接排放量盤查** 資料執行永續誠信鎖定 (Hash Lock)。
            一旦鎖定完成，本報告將作為「無始無終」的數位生命，不可篡改地刻印於 Supabase 安全治理鏈上。
          </p>
          <AtomicAlert variant="warning" title="不可逆操作">
            此簽章操作在 5T 協議（Trustworthy）下將進行零知識證明 (ZKP) 密鑰刻印，後續稽核團隊將可直接追溯至 `source_origin`。
          </AtomicAlert>
        </div>
      </AtomicModal>
    </div>
  );
};
