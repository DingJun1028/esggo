'use client';
import { useState, useCallback, useRef, useEffect } from 'react';
import { 
  Cpu, Play, Pause, Activity, CheckSquare, Inbox, Zap, Send, MessageSquare, Shield, RefreshCw, Bot, Code, Terminal, AlertCircle
} from 'lucide-react';
import { 
  BrandButton, BrandBadge, BrandCard, BrandTabs, BrandStatusDot, BrandProgress, BrandTimeline, BrandPageHeader 
} from '../../components/brand';
import { AgentStep, AgentStatus } from '../../lib/agent/v3-shared';

const agents = [
  { name: 'Aurora', role: 'Orchestrator', state: 'Idle', task: '待命：接收指令並生成 SwarmBrief', health: 100, memory: 85 },
  { name: 'Stakeholder-Surveyor', role: 'Analyst', state: 'Running', task: '提取 2024 年度問卷異常關注點', health: 98, memory: 42 },
  { name: 'Materiality-Maven', role: 'Architect', state: 'Waiting', task: '等待問卷數據以更新重大性矩陣', health: 100, memory: 12 },
  { name: 'CBAM-Sentinel', role: 'Validator', state: 'Running', task: '校驗第三季鋼鐵進口排放數據格式', health: 92, memory: 67 },
  { name: 'ESG-Scribe', role: 'Builder', state: 'Running', task: '撰寫 GRI 305 章節草稿', health: 98, memory: 91 },
];

export default function SwarmPage() {
  const [prompt, setPrompt] = useState('');
  const [tab, setTab] = useState('control');
  const [v3Steps, setV3Steps] = useState<AgentStep[]>([]);
  const [isV3Executing, setIsV3Executing] = useState(false);
  const streamEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    streamEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [v3Steps]);

  const handleV3Dispatch = async () => {
    if (!prompt.trim()) return;
    setV3Steps([]);
    setIsV3Executing(true);
    setTab('control');

    try {
      const response = await fetch('/api/agent/v3/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, autoRepair: true }),
      });

      if (!response.ok || !response.body) throw new Error('V3 API Connection Failed');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const dataStr = line.slice(6).trim();
            if (dataStr === '[DONE]') break;
            try {
              const step = JSON.parse(dataStr) as AgentStep;
              setV3Steps(prev => [...prev, step]);
            } catch (e) { /* parse error */ }
          }
        }
      }
    } catch (err) {
      alert('V3 代理調度失敗，請檢查系統日誌');
    } finally {
      setIsV3Executing(false);
      setPrompt('');
    }
  };

  const getStatusColor = (status: AgentStatus) => {
    switch (status) {
      case 'PLANNING': return 'var(--blue-700)';
      case 'CODING': return 'var(--purple-600)';
      case 'EXECUTING': return 'var(--blue-500)';
      case 'RETRYING': return 'var(--amber-600)';
      case 'SUCCESS': return 'var(--green-600)';
      case 'ERROR': return 'var(--red-600)';
      default: return 'var(--slate-400)';
    }
  };

  return (
    <div className="page-container max-w-7xl mx-auto p-6 space-y-6 fade-in">
      
      <BrandPageHeader 
        title="OmniHermes 代理蜂群 V3" 
        subtitle="Google ADK + Firebase Genkit + AgentZ0 深度整合版"
        icon={<Cpu size={24}/>}
      />

      <BrandCard padding="lg" className="border-l-4 border-l-blue-700 shadow-xl bg-slate-900 text-white">
         <div className="flex items-center gap-2 mb-4">
            <Zap size={14} className="text-gold-500" />
            <p className="text-[10px] font-bold text-blue-200 uppercase tracking-widest">Sovereign Agent V3 Command Console</p>
         </div>
         <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
               <Terminal size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400" />
               <input 
                 className="w-full bg-slate-800 border border-slate-700 rounded-2xl pl-12 pr-4 py-4 text-sm text-green-400 font-mono focus:border-blue-500 outline-none transition-all placeholder:text-slate-600"
                 placeholder="輸入指令啟動 V3 實時調度流程..."
                 value={prompt}
                 onChange={e => setPrompt(e.target.value)}
                 onKeyDown={e => e.key === 'Enter' && handleV3Dispatch()}
                 disabled={isV3Executing}
               />
            </div>
            <BrandButton variant="primary" onClick={handleV3Dispatch} loading={isV3Executing} disabled={!prompt.trim()} className="rounded-2xl px-8 min-h-[56px] shadow-lg shadow-blue-500/20">
               <Cpu size={16}/> EXECUTE V3
            </BrandButton>
         </div>
      </BrandCard>

      <BrandTabs 
        activeTab={tab}
        onTabChange={(t) => setTab(t as any)}
        tabs={[
          { id: 'control', label: 'V3 實時監控 (Genkit Trace)', icon: <Activity size={14}/> },
          { id: 'swarm', label: '代理矩陣', icon: <Users size={14}/> },
          { id: 'kanban', label: '任務看板', icon: <CheckSquare size={14}/> },
        ]}
      />

      {tab === 'control' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 fade-in">
           {/* Left: V3 Execution Stream (Genkit inspired Cockpit) */}
           <div className="lg:col-span-12">
              <BrandCard padding="none" className="bg-[#020617] border-slate-800 shadow-2xl min-h-[500px] flex flex-col overflow-hidden">
                 <div className="p-4 border-b border-slate-800 bg-slate-900/50 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                       <BrandStatusDot status={isV3Executing ? 'active' : 'inactive'} pulse={isV3Executing} size="sm" />
                       <span className="text-xs font-bold text-blue-400 font-mono tracking-tighter">OMNI_V3_RUNFLOW_STREAM</span>
                    </div>
                    <div className="flex gap-4">
                       <div className="flex items-center gap-1.5">
                          <span className="text-[10px] text-slate-500 font-bold uppercase">ADK Hierarchy</span>
                          <BrandBadge variant="outline" size="xs" className="text-blue-400 border-blue-900/50 bg-blue-900/20">Master/Specialist</BrandBadge>
                       </div>
                       <div className="flex items-center gap-1.5">
                          <span className="text-[10px] text-slate-500 font-bold uppercase">Sandbox</span>
                          <BrandBadge variant="outline" size="xs" className="text-green-400 border-green-900/50 bg-green-900/20">AgentZ0 Ready</BrandBadge>
                       </div>
                    </div>
                 </div>

                 <div className="flex-1 p-6 overflow-y-auto space-y-4 font-mono scroll-smooth">
                    {v3Steps.length === 0 && !isV3Executing && (
                      <div className="h-full flex flex-col items-center justify-center text-slate-700 opacity-50 space-y-4">
                         <Terminal size={48} />
                         <p className="text-sm">等待指令輸入以啟動 V3 實時遙測流</p>
                      </div>
                    )}
                    {v3Steps.map((step, i) => (
                      <div key={step.id} className="animate-in fade-in slide-in-from-left-2 flex gap-4">
                         <div className="flex flex-col items-center">
                            <div 
                              className="w-2.5 h-2.5 rounded-full mt-1.5" 
                              style={{ background: getStatusColor(step.status), boxShadow: `0 0 8px ${getStatusColor(step.status)}` }} 
                            />
                            {i < v3Steps.length - 1 && <div className="w-px flex-1 bg-slate-800 my-1" />}
                         </div>
                         <div className="flex-1 pb-4">
                            <div className="flex items-center gap-3 mb-1">
                               <span style={{ color: getStatusColor(step.status) }} className="text-[10px] font-black uppercase tracking-widest">{step.status}</span>
                               <span className="text-[10px] text-slate-600">[{new Date(step.timestamp).toLocaleTimeString()}]</span>
                               <span className="text-[10px] text-blue-500">@{step.agentName}</span>
                            </div>
                            <p className="text-sm text-slate-300 leading-relaxed">{step.message}</p>
                            
                            {step.payload?.code && (
                              <div className="mt-3 p-4 bg-slate-900 border border-slate-800 rounded-xl relative group">
                                 <div className="absolute top-2 right-4 flex gap-2">
                                    <span className="text-[8px] font-bold text-slate-600 uppercase">Python Sandbox</span>
                                    <Code size={10} className="text-slate-600" />
                                 </div>
                                 <pre className="text-xs text-blue-300 whitespace-pre-wrap">{step.payload.code}</pre>
                              </div>
                            )}

                            {step.payload?.stack && (
                              <div className="mt-3 p-4 bg-red-950/20 border border-red-900/30 rounded-xl">
                                 <div className="flex items-center gap-2 mb-2 text-red-500">
                                    <AlertCircle size={12} />
                                    <span className="text-[10px] font-bold uppercase">Runtime Error Trace</span>
                                 </div>
                                 <pre className="text-[10px] text-red-400 font-mono whitespace-pre-wrap">{step.payload.stack}</pre>
                              </div>
                            )}
                         </div>
                      </div>
                    ))}
                    <div ref={streamEndRef} />
                 </div>
              </BrandCard>
           </div>
        </div>
      )}

      {tab === 'swarm' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 fade-in">
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
      )}

      {tab === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 fade-in">
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

    </div>
  );
}
