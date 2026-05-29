'use client';

import React, { useState } from 'react';
import { Bot, PlayCircle, Activity, Loader2, CheckCircle, AlertTriangle } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import StandardPage from '@/components/brand/StandardPage';
import { UniversalPageConfig } from '@/lib/page-config';

export default function OmniAgentOrchestrator() {
  const [taskInput, setTaskInput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<any>(null);

  const runCommand = async (presetTask?: string) => {
    const taskToRun = presetTask || taskInput;
    if (!taskToRun) return;

    setIsRunning(true);
    setResults(null);

    try {
      const res = await fetch('/api/omni-agent-api/command', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task: taskToRun })
      });
      const data = await res.json();
      setResults(data);
    } catch (err: any) {
      setResults({ success: false, error: err.message });
    } finally {
      setIsRunning(false);
    }
  };

  const pageConfig: UniversalPageConfig = {
    id: 'omniagent-orchestrator',
    title: 'OmniAgent 調度中心 ⚡',
    subtitle: '指揮與調度您的 ESG 代理蜂群 (Agent Swarm) 進行自動化報告生成與稽核。',
    icon: <Bot size={32} className="text-berkeley-blue" />,
    griReference: 'Orchestrator / oX',
    activeT5Tags: ['T4', 'T5'],
    isOXModule: true,
    features: { useAuditLog: true },

    sections: [
      {
        id: 'commander',
        title: '任務指派 (Mission Command)',
        columns: 12,
        component: (
          <div className="space-y-6">
            <Card className="p-8 bg-white/60 shadow-glass">
               <h3 className="text-lg font-black text-berkeley-blue mb-4">預設任務 (Preset Missions)</h3>
               <div className="flex flex-wrap gap-4 mb-8">
                 <Button variant="primary" onClick={() => runCommand('PILOT_REPORT_GENERATION')}>
                   <PlayCircle size={16} className="mr-2" /> 執行自主報告生成 (SustainWrite Pilot)
                 </Button>
                 <Button variant="glass" onClick={() => runCommand('EVIDENCE_AUDIT')}>
                   <Activity size={16} className="mr-2" /> 執行蜂群實證稽核 (Swarm Audit)
                 </Button>
                 <Button variant="secondary" onClick={() => runCommand('TRANSFER_TO_NCBDB')}>
                   <Activity size={16} className="mr-2" /> 深度同步至 NCBDB
                 </Button>
                 <Button 
                   variant="glass" 
                   className="bg-emerald-500/20 text-emerald-700 hover:bg-emerald-500/30 border-emerald-500/50"
                   onClick={async () => {
                     setIsRunning(true);
                     setResults(null);
                     try {
                       const res = await fetch('/api/omnicore/audit-pdf', {
                         method: 'POST',
                         headers: { 'Content-Type': 'application/json' },
                         body: JSON.stringify({ fileName: 'sample-evidence.pdf' })
                       });
                       const data = await res.json();
                       setResults(data);
                     } catch (err: any) {
                       setResults({ success: false, error: err.message });
                     } finally {
                       setIsRunning(false);
                     }
                   }}
                 >
                   <CheckCircle size={16} className="mr-2" /> 實際抓取 PDF 並入庫 (Real PDF)
                 </Button>

                 <Button 
                   variant="glass" 
                   className="bg-cyan-500/20 text-cyan-700 hover:bg-cyan-500/30 border-cyan-500/50"
                   onClick={async () => {
                     setIsRunning(true);
                     setResults(null);
                     try {
                       const res = await fetch('/api/omnicore/scrape-esg-web', {
                         method: 'POST',
                         headers: { 'Content-Type': 'application/json' },
                         body: JSON.stringify({ url: 'https://www.w3.org/Provider/Style/dummy.html' })
                       });
                       const data = await res.json();
                       setResults(data);
                     } catch (err: any) {
                       setResults({ success: false, error: err.message });
                     } finally {
                       setIsRunning(false);
                     }
                   }}
                 >
                   <Activity size={16} className="mr-2" /> 自動抓取公開網頁 (Web Scrape)
                 </Button>
               </div>

               <h3 className="text-lg font-black text-berkeley-blue mb-4">自定義指令 (Custom Command)</h3>
               <div className="flex gap-4">
                 <input 
                   type="text" 
                   value={taskInput}
                   onChange={e => setTaskInput(e.target.value)}
                   placeholder="Enter OmniAgent command..."
                   className="flex-1 px-4 py-2 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-berkeley-blue"
                 />
                 <Button onClick={() => runCommand()} disabled={!taskInput || isRunning}>
                   {isRunning ? <Loader2 size={16} className="animate-spin" /> : '執行 (Execute)'}
                 </Button>
               </div>
            </Card>

            {results && (
              <Card className="p-8 bg-slate-900 text-white shadow-xl">
                 <div className="flex items-center gap-3 mb-6">
                   {results.success ? (
                     <CheckCircle size={24} className="text-emerald-400" />
                   ) : (
                     <AlertTriangle size={24} className="text-red-400" />
                   )}
                   <h3 className="text-xl font-black">執行結果 (Execution Result)</h3>
                 </div>
                 
                 <div className="bg-black/50 p-6 rounded-xl font-mono text-sm overflow-auto max-h-[400px]">
                   <pre className="text-emerald-300">
                     {JSON.stringify(results, null, 2)}
                   </pre>
                 </div>
              </Card>
            )}
          </div>
        )
      }
    ]
  };

  return <StandardPage config={pageConfig} />;
}
