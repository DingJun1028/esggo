'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/v2/Card';
import { Button } from '@/components/ui/v2/Button';
import { Badge } from '@/components/ui/v2/Input';
import { 
  Stethoscope, 
  ArrowLeft, 
  Map, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp, 
  ShieldCheck, 
  UploadCloud,
  Loader2,
  ListTodo
} from 'lucide-react';
import { useOmniNotesStore } from '@/store/useOmniNotesStore';

export default function EnterpriseHealthResultPage() {
  const router = useRouter();
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [exportComplete, setExportComplete] = useState(false);
  const addNote = useOmniNotesStore((state) => state.addNote);

  useEffect(() => {
    // Calculate mock score based on answers
    try {
      const stored = localStorage.getItem('esg_health_answers');
      if (stored) {
        const answers = JSON.parse(stored);
        const total = Object.values(answers).reduce((acc: number, val: any) => acc + val, 0);
        // 15 questions, max 3 each = 45. Scale to 100.
        const calculatedScore = Math.round((total / 45) * 100);
        setScore(calculatedScore);
      } else {
        setScore(68); // fallback
      }
    } catch {
      setScore(68);
    }
    
    // Simulate AI Generation time
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleExportToTasks = async () => {
    setIsExporting(true);
    
    // Simulate API call to convert roadmap into OmniNotes / NCB Tasks
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Create a mock task note in OmniNotes (will auto-sync if type is task)
    const today = new Date().toISOString().split('T')[0];
    addNote('完成 2026 年度 ISO 14064-1 溫室氣體盤查 (來自企業健檢建議)', 'task', today);
    addNote('建立供應商 ESG 稽核表單與評鑑機制', 'task', today);

    setExportComplete(true);
    setIsExporting(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-4 space-y-6">
        <div className="relative">
          <div className="w-24 h-24 rounded-full border-4 border-slate-100 flex items-center justify-center">
            <Loader2 size={40} className="text-cyan-500 animate-spin" />
          </div>
          <div className="absolute inset-0 border-4 border-cyan-500 rounded-full border-t-transparent animate-spin-slow" />
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-xl font-black text-[#003262]">正在匯整健檢數據...</h2>
          <p className="text-sm text-slate-500 font-mono">OmniAgent is generating your 90-Day Roadmap</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl shadow-lg">
              <Stethoscope size={28} className="text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="success" size="sm" icon={<ShieldCheck size={12} />}>
                  Diagnostic Complete
                </Badge>
              </div>
              <h1 className="text-3xl font-black text-[#003262] tracking-tight">企業 ESG 診斷報告</h1>
              <p className="text-sm text-slate-400 mt-1">根據您的填寫結果，系統已為您生成專屬分析與改善路徑。</p>
            </div>
          </div>
          <Button variant="ghost" onClick={() => router.push('/intelligence')} className="text-slate-500">
            <ArrowLeft size={16} className="mr-2" /> 返回商情中心
          </Button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Score Card */}
          <Card className="p-8 flex flex-col items-center justify-center text-center space-y-4 border-t-4 border-t-cyan-500 shadow-md bg-white">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">ESG 成熟度總分</h3>
            <div className="relative">
              <svg className="w-32 h-32 transform -rotate-90">
                <circle cx="64" cy="64" r="60" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-100" />
                <circle 
                  cx="64" cy="64" r="60" 
                  stroke="currentColor" strokeWidth="8" fill="transparent" 
                  strokeDasharray={377} 
                  strokeDashoffset={377 - (377 * score) / 100} 
                  className={score >= 80 ? "text-emerald-500" : score >= 60 ? "text-amber-500" : "text-rose-500"} 
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <span className="text-4xl font-black text-[#003262]">{score}</span>
              </div>
            </div>
            <p className="text-sm font-bold text-slate-600">
              {score >= 80 ? '領先群標竿' : score >= 60 ? '穩健發展中' : '起步奠基期'}
            </p>
          </Card>

          {/* Key Findings */}
          <Card className="md:col-span-2 p-8 space-y-6 shadow-md bg-white">
            <h3 className="text-lg font-black text-[#003262] flex items-center gap-2">
              <TrendingUp size={18} className="text-cyan-600" /> 核心發現與洞察
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 size={16} className="text-emerald-600" />
                  <span className="font-bold text-emerald-800">優勢項目</span>
                </div>
                <p className="text-sm text-emerald-700 leading-relaxed">社會參與 (S) 與員工福利政策完善。已具備基本的治理結構基礎。</p>
              </div>
              <div className="p-4 bg-rose-50 rounded-xl border border-rose-100">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle size={16} className="text-rose-600" />
                  <span className="font-bold text-rose-800">優先改善</span>
                </div>
                <p className="text-sm text-rose-700 leading-relaxed">缺乏系統化的溫室氣體盤查數據，數據收集仍依賴人工，有高度合規風險。</p>
              </div>
            </div>
          </Card>
        </div>

        {/* 90-Day Roadmap */}
        <Card className="p-0 overflow-hidden shadow-lg border-0 bg-white">
          <div className="p-6 md:p-8 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50/50">
            <div>
              <h3 className="text-xl font-black text-[#003262] flex items-center gap-2 mb-1">
                <Map size={20} className="text-indigo-600" /> 90 天永續改善路徑圖
              </h3>
              <p className="text-sm text-slate-500">系統已根據您的弱項，為您規劃未來三個月的具體行動方案。</p>
            </div>
            {!exportComplete ? (
              <Button 
                variant="primary" 
                onClick={handleExportToTasks} 
                isLoading={isExporting}
                className="bg-[#003262] hover:bg-[#002244] shrink-0"
              >
                <UploadCloud size={16} className="mr-2" /> 匯入任務中心 (NCB)
              </Button>
            ) : (
              <Button 
                variant="outline" 
                onClick={() => router.push('/omni-notes')}
                className="border-emerald-500 text-emerald-600 hover:bg-emerald-50 shrink-0 font-bold"
              >
                <ListTodo size={16} className="mr-2" /> 前往任務看板
              </Button>
            )}
          </div>
          
          <div className="p-6 md:p-8">
            <div className="relative border-l-2 border-slate-200 ml-3 md:ml-6 space-y-8 pb-4">
              
              {/* Month 1 */}
              <div className="relative">
                <div className="absolute -left-[35px] md:-left-[43px] w-8 h-8 md:w-10 md:h-10 bg-cyan-100 rounded-full border-4 border-white flex items-center justify-center shadow-sm">
                  <span className="text-xs md:text-sm font-black text-cyan-600">M1</span>
                </div>
                <div className="pl-6 md:pl-8">
                  <h4 className="text-lg font-bold text-slate-800 mb-2">啟動數位盤查與框架對齊</h4>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2 text-sm text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100">
                      <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 mt-1.5 shrink-0" />
                      導入 ESGGO 數據中心，完成 2026 年度 ISO 14064-1 組織邊界設定。
                    </li>
                    <li className="flex items-start gap-2 text-sm text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100">
                      <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 mt-1.5 shrink-0" />
                      召開董事會永續委員會，確立年度減碳目標 (如 5% 減量)。
                    </li>
                  </ul>
                </div>
              </div>

              {/* Month 2 */}
              <div className="relative">
                <div className="absolute -left-[35px] md:-left-[43px] w-8 h-8 md:w-10 md:h-10 bg-blue-100 rounded-full border-4 border-white flex items-center justify-center shadow-sm">
                  <span className="text-xs md:text-sm font-black text-blue-600">M2</span>
                </div>
                <div className="pl-6 md:pl-8">
                  <h4 className="text-lg font-bold text-slate-800 mb-2">供應鏈與社會面強化</h4>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2 text-sm text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                      建立供應商 ESG 稽核表單與評鑑機制，發送首波問卷。
                    </li>
                    <li className="flex items-start gap-2 text-sm text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                      完成內部人權盡職調查初步風險鑑別。
                    </li>
                  </ul>
                </div>
              </div>

              {/* Month 3 */}
              <div className="relative">
                <div className="absolute -left-[35px] md:-left-[43px] w-8 h-8 md:w-10 md:h-10 bg-indigo-100 rounded-full border-4 border-white flex items-center justify-center shadow-sm">
                  <span className="text-xs md:text-sm font-black text-indigo-600">M3</span>
                </div>
                <div className="pl-6 md:pl-8">
                  <h4 className="text-lg font-bold text-slate-800 mb-2">報告書編製與 5T 驗證</h4>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2 text-sm text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                      將盤查與社會面數據寫入區塊鏈 Hash Lock (5T 誠信協議)。
                    </li>
                    <li className="flex items-start gap-2 text-sm text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                      啟動永續報告書第三方查證作業。
                    </li>
                  </ul>
                </div>
              </div>

            </div>
          </div>
        </Card>

      </div>
    </div>
  );
}
