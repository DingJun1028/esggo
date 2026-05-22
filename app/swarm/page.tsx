'use client';
import { useState } from 'react';
import { 
  Cpu, Play, Pause, Activity, CheckSquare, Inbox, Zap, Send, MessageSquare, Shield, RefreshCw, Bot 
} from 'lucide-react';
import { 
  BrandButton, BrandBadge, BrandCard, BrandTabs, BrandStatusDot, BrandProgress, BrandTimeline, BrandPageHeader 
} from '../../components/brand';

const agents = [
  { name: 'Aurora', role: 'Orchestrator', state: 'Idle', task: '待命：接收指令並生成 SwarmBrief', health: 100, memory: 85 },
  { name: 'Stakeholder-Surveyor', role: 'Analyst', state: 'Running', task: '提取 2024 年度問卷異常關注點', health: 98, memory: 42 },
  { name: 'Materiality-Maven', role: 'Architect', state: 'Waiting', task: '等待問卷數據以更新重大性矩陣', health: 100, memory: 12 },
  { name: 'CBAM-Sentinel', role: 'Validator', state: 'Running', task: '校驗第三季鋼鐵進口排放數據格式', health: 92, memory: 67 },
  { name: 'ESG-Scribe', role: 'Builder', state: 'Running', task: '撰寫 GRI 305 章節草稿', health: 98, memory: 91 },
];

const STREAM_DATA = [
  { id: '1', title: 'OmniMemory 碎片整合', description: 'GRI 305-1 → CBAM Sector Mapping', time: '14:32', badge: <BrandBadge variant="info" size="xs">Sync</BrandBadge>, color: 'var(--blue-600)' },
  { id: '2', title: 'Aurora 分發任務', description: 'Stakeholder-Surveyor [High Priority]', time: '14:32', badge: <BrandBadge variant="purple" size="xs">Dispatch</BrandBadge>, color: 'var(--purple-600)' },
  { id: '3', title: 'CBAM-Sentinel 執行完成', description: '格式校驗成功，寫入 Draft Store', time: '14:31', badge: <BrandBadge variant="success" size="xs">Success</BrandBadge>, color: 'var(--green-600)' },
  { id: '4', title: 'Hash Lock 預備封印', description: 'Artifact_Exec_882 進入排隊佇列', time: '14:31', badge: <BrandBadge variant="gold" size="xs">Trust</BrandBadge>, color: 'var(--gold-600)' },
];

export default function SwarmPage() {
  const [prompt, setPrompt] = useState('');
  const [tab, setTab] = useState('control');
  const [dispatching, setDispatching] = useState(false);

  const handleDispatch = async () => {
    if (!prompt.trim()) return;
    setDispatching(true);
    await new Promise(r => setTimeout(r, 2000));
    setPrompt('');
    setDispatching(false);
    alert('Aurora 已將您的指令拆解並派發！');
  };

  return (
    <div className="page-container max-w-7xl mx-auto p-6 space-y-6 fade-in">
      
      <BrandPageHeader 
        title="OmniHermes 代理蜂群" 
        subtitle="多代理協同執行模式 · 異步任務拆解 · 蜂群編排系統"
        icon={<Cpu size={24}/>}
      />

      <BrandCard padding="lg" className="border-l-4 border-l-blue-700 shadow-sm">
         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">向全球代理發布意圖 (Sovereign Intent)</p>
         <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
               <MessageSquare size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
               <input 
                 className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-11 pr-4 py-4 text-sm focus:bg-white focus:border-blue-600 outline-none transition-all"
                 placeholder="例如：幫我分析本季供應鏈碳排異常..."
                 value={prompt}
                 onChange={e => setPrompt(e.target.value)}
                 disabled={dispatching}
               />
            </div>
            <BrandButton variant="primary" onClick={handleDispatch} loading={dispatching} disabled={!prompt.trim()} className="rounded-2xl px-8 min-h-[56px] sm:min-h-0">
               <Zap size={16}/> Dispatch
            </BrandButton>
         </div>
      </BrandCard>

      <BrandTabs 
        activeTab={tab}
        onTabChange={(t) => setTab(t as any)}
        tabs={[
          { id: 'control', label: '控制平面', icon: <Activity size={14}/> },
          { id: 'kanban', label: '任務看板', icon: <CheckSquare size={14}/> },
          { id: 'inbox', label: '收件箱', icon: <Inbox size={14}/> },
        ]}
      />

      {tab === 'control' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 fade-in">
           {/* Left: Conscious Stream */}
           <div className="lg:col-span-4">
              <BrandCard padding="md">
                 <div className="mb-4 pb-4 border-b border-slate-50">
                    <h3 className="text-sm font-bold text-[#003262]">AI 共鳴意識流</h3>
                    <p className="text-xs text-slate-500 mt-1">OmniMemory 實時同步軌跡</p>
                 </div>
                 <div className="scroll-x-governed">
                   <BrandTimeline items={STREAM_DATA} />
                 </div>
              </BrandCard>
           </div>

           {/* Right: Agent Grid */}
           <div className="lg:col-span-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {agents.map((a, i) => (
                  <BrandCard key={i} padding="md" hover>
                     <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                           <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${a.state === 'Running' ? 'bg-blue-700 text-white shadow-lg' : 'bg-slate-100 text-slate-400'}`}>
                              <Bot size={20}/>
                           </div>
                           <div>
                              <p className="text-sm font-bold text-slate-900">{a.name}</p>
                              <BrandBadge variant="outline" size="xs">{a.role}</BrandBadge>
                           </div>
                        </div>
                        <BrandStatusDot status={a.state === 'Running' ? 'active' : 'inactive'} pulse={a.state === 'Running'} size="sm" />
                     </div>
                     
                     <p className="text-xs text-slate-600 mb-6 min-h-[32px]">{a.task}</p>
                     
                     <div className="space-y-4">
                        <div className="space-y-1.5">
                           <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase">
                              <span>Health</span>
                              <span>{a.health}%</span>
                           </div>
                           <BrandProgress value={a.health} color={a.health > 90 ? 'green' : 'gold'} size="xs" />
                        </div>
                        <div className="space-y-1.5">
                           <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase">
                              <span>Memory Load</span>
                              <span>{a.memory}%</span>
                           </div>
                           <BrandProgress value={a.memory} color="blue" size="xs" />
                        </div>
                     </div>

                     <div className="flex gap-2 mt-6 pt-4 border-t border-slate-50">
                        <BrandButton variant="ghost" size="sm"><Play size={12}/></BrandButton>
                        <BrandButton variant="ghost" size="sm"><Pause size={12}/></BrandButton>
                        <BrandButton variant="ghost" size="sm" className="ml-auto">詳情</BrandButton>
                     </div>
                  </BrandCard>
                ))}
              </div>
           </div>
        </div>
      )}

      {tab === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {['Ready', 'Running', 'Review', 'Done'].map(lane => (
            <div key={lane} className="space-y-4">
               <div className="flex items-center justify-between px-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{lane}</span>
                  <BrandBadge variant="outline" size="xs">0</BrandBadge>
               </div>
               <div className="min-h-[400px] bg-slate-50/50 rounded-3xl border border-dashed border-slate-200 p-3">
                  {lane === 'Running' && (
                    <BrandCard padding="sm" className="border-l-4 border-l-red-500 mb-3 shadow-sm">
                       <p className="text-xs font-bold text-slate-900">撰寫 GRI 305 章節</p>
                       <p className="text-[10px] text-slate-500 mt-1">ESG-Scribe · 85%</p>
                    </BrandCard>
                  )}
               </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'inbox' && (
        <BrandCard padding="none" className="min-h-[400px] flex items-center justify-center">
           <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mx-auto text-slate-300">
                 <Inbox size={32} />
              </div>
              <div>
                 <p className="font-bold text-slate-700">收件箱空白</p>
                 <p className="text-xs text-slate-400">當前無待處理的 Checkpoint 或審核任務</p>
              </div>
           </div>
        </BrandCard>
      )}

    </div>
  );
}
