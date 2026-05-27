'use client';
import React from 'react';
import { DetailTemplate } from '@/components/templates/DetailTemplate';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { 
  FileText, Shield, Clock, Users, Database, 
  Download, Lock, AlertTriangle, ChevronRight, CheckCircle 
} from 'lucide-react';

export default function ContractDetailPage({ params }: { params: { id: string } }) {
  const contractId = params.id;

  return (
    <DetailTemplate
      title="2026 太陽能板採購合約"
      subtitle="本合約涉及再生能源基礎建設，需執行最高等級之 T4 哈希鎖定與證據鏈管理。"
      breadcrumbs={[
        { label: '首頁', href: '/' },
        { label: '合約管理', href: '/contracts' },
        { label: contractId, href: '#' },
      ]}
      statusBadge={<Badge tone="success" label="ACTIVE / 執行中" />}
      actions={
        <>
          <Button variant="ghost" className="border-slate-200">
            <Download size={16} className="mr-2" /> 匯出合約
          </Button>
          <Button variant="primary" className="bg-aqua-cyan-midtone border-none shadow-lg shadow-aqua-cyan-midtone/20">
            <Lock size={16} className="mr-2" /> 5T 再次封印
          </Button>
        </>
      }
      summaryItems={[
        { label: '合約編號', value: contractId, icon: <Database size={14} /> },
        { label: '簽約對象', value: '宏碁綠能', icon: <Users size={14} /> },
        { label: '合約金額', value: 'NTD 12,000,000', icon: <FileText size={14} /> },
        { label: '最後更新', value: '2026-05-27', icon: <Clock size={14} /> },
      ]}
      sections={[
        {
          id: 'terms',
          title: '核心條款摘要',
          content: (
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-2">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">履約期限</p>
                  <p className="text-sm font-bold text-text-primary">2026-06-01 至 2027-05-31</p>
                </div>
                <div className="space-y-2">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">交付標準</p>
                  <p className="text-sm font-bold text-text-primary">符合 ISO-14064-1 查證標準</p>
                </div>
              </div>
              <div className="pt-4 border-t border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">條款細節</p>
                <div className="space-y-4 text-sm text-text-secondary leading-relaxed font-medium">
                  <p>1. 乙方需於每季度提供發電數據報告，並由 OmniAgent 自動執行 T1 溯源檢查。</p>
                  <p>2. 雙方同意所有單據皆需上傳至萬能實證金庫 (Vault)，並執行 SHA-256 哈希鎖定。</p>
                </div>
              </div>
            </div>
          )
        },
        {
          id: 'evidence',
          title: '5T 實證清單',
          content: (
            <div className="divide-y divide-slate-100">
              {[
                { name: '廠商資質證明.pdf', size: '1.2 MB', hash: '8f2a...c3d1', status: 'verified' },
                { name: '產品規格說明書.pdf', size: '4.5 MB', hash: '4e11...9a22', status: 'verified' },
                { name: '環保標章認證.jpg', size: '0.8 MB', hash: 'pending', status: 'pending' },
              ].map((file, i) => (
                <div key={i} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white border border-slate-200 rounded-xl shadow-sm">
                      <FileText size={20} className="text-aqua-cyan-midtone" />
                    </div>
                    <div>
                      <p className="text-sm font-black text-text-primary">{file.name}</p>
                      <p className="text-[10px] font-mono text-slate-400 uppercase mt-1">Hash: {file.hash}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    {file.status === 'verified' ? (
                      <Badge tone="success" label="VERIFIED" />
                    ) : (
                      <Badge tone="warning" label="PENDING" />
                    )}
                    <button className="text-slate-400 hover:text-text-brand">
                      <ChevronRight size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )
        }
      ]}
      sidebar={
        <div className="space-y-6">
          <Card className="p-6 border-aqua-cyan/20 bg-aqua-cyan/5">
            <h3 className="text-xs font-black uppercase tracking-widest text-aqua-cyan-midtone mb-4 flex items-center gap-2">
              <Shield size={14} /> 5T 誠信狀態
            </h3>
            <div className="space-y-4">
              {[
                { gate: 'T1 Traceable', status: 'PASS', score: 100 },
                { gate: 'T2 Transparent', status: 'PASS', score: 100 },
                { gate: 'T3 Tangible', status: 'PASS', score: 100 },
                { gate: 'T4 Trustworthy', status: 'WARN', score: 75 },
              ].map((g, i) => (
                <div key={i} className="space-y-1.5">
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                    <span className="text-slate-500">{g.gate}</span>
                    <span className={g.score === 100 ? 'text-emerald-600' : 'text-amber-600'}>{g.status}</span>
                  </div>
                  <div className="h-1 w-full bg-white rounded-full overflow-hidden">
                    <div className={cn("h-full", g.score === 100 ? 'bg-emerald-500' : 'bg-amber-500')} style={{ width: `${g.score}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6 border-slate-200">
            <h3 className="text-xs font-black uppercase tracking-widest text-text-primary mb-4 flex items-center gap-2">
              <Clock size={14} /> 審計時間軸
            </h3>
            <div className="space-y-6">
              {[
                { event: '合規封印執行', time: '2026-05-27 10:30', user: 'OmniAgent', icon: <Lock size={12}/> },
                { event: '廠商資料變更', time: '2026-05-20 14:15', user: '系統自動', icon: <AlertTriangle size={12}/> },
                { event: '合約正式生效', time: '2026-05-15 09:00', user: 'Admin', icon: <CheckCircle size={12}/> },
              ].map((e, i) => (
                <div key={i} className="flex gap-4 relative">
                  {i < 2 && <div className="absolute left-[11px] top-8 bottom-[-24px] w-px bg-slate-100" />}
                  <div className="w-6 h-6 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 z-10 shrink-0">
                    {e.icon}
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-black text-text-primary">{e.event}</p>
                    <p className="text-[10px] text-slate-400 font-medium">{e.time} • {e.user}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      }
    />
  );
}
