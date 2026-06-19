import React, { useState } from 'react';
import {
  ArrowBack,
  Sync,
  MoreVert,
  CalendarToday,
  Group,
  CloudDownload,
  Psychology,
  Description,
  OpenInNew,
  GridView,
  AccountTree,
  Add,
  Analytics,
  Settings,
} from '@mui/icons-material';
import {
  Zap,
  Target,
  ShieldCheck,
  Activity,
  Cpu,
  CheckCircle2,
  Clock,
  ArrowRight,
  Monitor,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * ?? Mission & Workflow Mobile (Service 4.2 & 4.3 Mobile)
 * --------------------------------------------------
 * "ESG Mission Matrix & Intelligent Workflow Monitor"
 * Features: Mission Cards with 5T Toggles, Real-time Vertical Process Timeline.
 */
import { agencyManager, MissionObjective } from '../../services/AgencyManager';

export const MissionWorkflowMobile = () => {
  const [activeTab, setActiveTab] = useState('current');
  const [missions, setMissions] = useState<MissionObjective[]>(() => agencyManager.getMissions());
  const [isSyncing, setIsSyncing] = useState(false);

  React.useEffect(() => {
    return agencyManager.subscribe(() => {
      setMissions(agencyManager.getMissions());
    });
  }, []);

  const handleSync = async () => {
    setIsSyncing(true);
    await agencyManager.syncMissions();
    setIsSyncing(false);
  };

  return (
    <div className="bg-[#0a1414] text-white min-h-screen font-display selection:bg-[#0df2df]/20 flex flex-col relative pb-32 max-w-[430px] mx-auto border-x border-white/5 shadow-2xl overflow-x-hidden">
      {/* Background Refraction Pulse */}
      <div className="fixed inset-0 pointer-events-none -z-10 bg-[radial-gradient(circle_at_top_right,#00FFFF08,transparent_50%)]" />

      {/* Header Navigation */}
      <header className="sticky top-0 z-50 backdrop-blur-3xl bg-[#0a1414]/80 border-b border-aqua-500/20 px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button className="size-11 flex items-center justify-center rounded-full bg-white/5 border border-white/5 active:scale-90 transition-all">
            <ArrowBack style={{ fontSize: '20px' }} className="text-white/60" />
          </button>
          <div className="flex flex-col">
            <h1 className="text-sm font-black tracking-tighter uppercase italic leading-none text-white">
              ESG 任�??��?�?Matrix
            </h1>
            <p className="text-[9px] text-aqua-400 font-black uppercase tracking-widest mt-1 opacity-80 italic">
              Operations Control v1.0
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleSync}
            disabled={isSyncing}
            className="size-11 flex items-center justify-center rounded-xl bg-aqua-500/20 text-aqua-400 shadow-[0_0_15px_rgba(0,255,255,0.3)] border border-aqua-500/30 active:scale-95 transition-all disabled:opacity-50">
            <Sync className={isSyncing ? "animate-spin" : ""} />
          </button>
          <div
            className="size-11 rounded-full border-2 border-aqua-500 bg-cover bg-center overflow-hidden shadow-xl"
            style={{
              backgroundImage:
                "url('https://lh3.googleusercontent.com/a/ACg8ocL_U0YV6m_XzW_G_y_W_s_x_x_x=s128-c')",
            }}
          />
        </div>
      </header>

      <main className="flex-1 overflow-y-auto no-scrollbar space-y-12 py-8">
        {/* 4.2 Mission Matrix Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between px-6">
            <h2 className="text-xl font-black italic tracking-tighter text-white uppercase italic flex items-center gap-3">
              <span className="w-1.5 h-6 bg-aqua-500 rounded-full" /> 4.2 任�??�陣 Missions
            </h2>
            <span className="text-[10px] bg-aqua-500/10 text-aqua-400 px-4 py-1.5 rounded-full font-black uppercase tracking-widest border border-aqua-500/30">
              2 ?��?�?Pending
            </span>
          </div>

          {/* Mobile Tabs */}
          <div className="px-6 border-b border-white/10 flex gap-8">
            {['?��?任�? Current', '已�???Complete', '?�常追蹤 Issues'].map((tab, i) => (
              <button
                key={i}
                onClick={() => setActiveTab(tab.toLowerCase().split(' ')[0] || '')}
                className={`pb-4 text-[10px] font-black uppercase tracking-widest transition-all border-b-2 ${activeTab === (tab.toLowerCase().split(' ')[0] || '') ? 'border-aqua-500 text-aqua-400' : 'border-transparent text-white/30'}`}
              >
                {tab.split(' ')[0] || ''}
              </button>
            ))}
          </div>

          {/* Mission Cards */}
          <div className="px-6 space-y-5">
            {missions.map((mission, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                className="backdrop-blur-3xl bg-white/[0.03] rounded-[2.5rem] p-6 border border-white/10 border-l-[6px] border-l-aqua-500 shadow-2xl space-y-6 active:scale-[0.98] transition-all"
              >
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <span
                      className={`text-[8px] font-black px-3 py-1 rounded-md uppercase tracking-widest italic ${mission.priority === 'HIGH PRIORITY' ? 'bg-rose-500/20 text-rose-500' : 'bg-white/10 text-white/40'}`}
                    >
                      {mission.priority}
                    </span>
                    <h3 className="text-lg font-black italic tracking-tighter text-white uppercase uppercase leading-snug">
                      {mission.objective}
                    </h3>
                  </div>
                  <MoreVert className="text-white/20" />
                </div>

                {/* 5T Status Toggle (Interactive Segmented) */}
                <div className="bg-black/60 rounded-[1.2rem] p-1.5 flex justify-between gap-1 overflow-x-auto no-scrollbar shadow-inner border border-white/5">
                  {['?��? Target', '追蹤 Track', '溯�? Origin', '?��? Clear', '轉�? Transform'].map(
                    (step, sIdx) => (
                      <button
                        key={sIdx}
                        className={`flex-1 py-2.5 px-3 rounded-xl text-[8px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${mission.status5T.split(' ')[0] === step.split(' ')[0] ? 'bg-aqua-500 text-[#0a1414] shadow-xl scale-105' : 'bg-transparent text-white/20'}`}
                      >
                        {step.split(' ')[0]}
                      </button>
                    )
                  )}
                </div>

                <div className="flex justify-between items-center text-[9px] text-white/30 font-black uppercase tracking-widest px-1">
                  <span className="flex items-center gap-2">
                    <CalendarToday style={{ fontSize: '14px' }} className="text-aqua-400" />{' '}
                    {mission.deadline}
                  </span>
                  <span className="flex items-center gap-2">
                    <Group style={{ fontSize: '14px' }} className="text-aqua-400" />{' '}
                    {mission.assignee}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* 4.3 Intelligent Workflow Section */}
        <section className="space-y-8">
          <div className="flex items-center justify-between px-6">
            <h2 className="text-xl font-black italic tracking-tighter text-white uppercase italic flex items-center gap-3">
              <span className="w-1.5 h-6 bg-aqua-500 rounded-full" /> 4.3 流�???��??Process
            </h2>
            <div className="flex items-center gap-2">
              <div className="size-2 rounded-full bg-aqua-500 animate-pulse shadow-[0_0_8px_rgba(0,255,255,1)]" />
              <span className="text-[10px] text-aqua-400 font-black uppercase tracking-widest italic">
                LIVE STREAM
              </span>
            </div>
          </div>

          <div className="px-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              className="backdrop-blur-3xl bg-white/[0.03] border border-white/10 rounded-[3rem] p-10 relative overflow-hidden shadow-3xl"
            >
              {/* Internal Gradient Refraction */}
              <div className="absolute -top-24 -right-24 size-60 bg-aqua-500/10 rounded-full blur-[80px]" />
              <div className="absolute -bottom-24 -left-24 size-60 bg-aqua-500/5 rounded-full blur-[80px]" />

              {/* Workflow Vertical Timeline */}
              <div className="relative space-y-12">
                {/* Step 1: Completed */}
                <div className="flex gap-6 relative">
                  <div className="absolute left-[15px] top-10 -bottom-16 w-1 bg-aqua-500/30 rounded-full" />
                  <div className="relative z-10 size-8 rounded-full bg-aqua-500 flex items-center justify-center shadow-[0_0_15px_rgba(0,255,255,0.6)] border-4 border-[#0a1414]">
                    <CloudDownload
                      style={{ fontSize: '14px' }}
                      className="text-[#0a1414] font-bold"
                    />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex justify-between items-baseline">
                      <h4 className="text-sm font-black italic text-white uppercase tracking-tight">
                        ?��?源�???Data Ingestion
                      </h4>
                      <span className="text-[9px] text-aqua-400 font-black uppercase tracking-widest bg-aqua-500/10 px-2 py-0.5 rounded italic">
                        Completed
                      </span>
                    </div>
                    <p className="text-[11px] text-white/30 font-light italic leading-relaxed tracking-tight">
                      �?IoT 網�?以�? ERP 系統?��??��?廠�??��??�電?��??��??��?...
                    </p>
                    <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-aqua-500 w-full shadow-[0_0_10px_rgba(0,255,255,1)]" />
                    </div>
                  </div>
                </div>

                {/* Step 2: Processing */}
                <div className="flex gap-6 relative">
                  <div className="absolute left-[15px] top-10 -bottom-16 w-1 bg-white/5 rounded-full" />
                  <div className="relative z-10 size-8 rounded-full bg-aqua-500/20 border-4 border-aqua-500 flex items-center justify-center animate-pulse shadow-[0_0_10px_rgba(0,255,255,0.3)]">
                    <Psychology style={{ fontSize: '14px' }} className="text-aqua-400" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex justify-between items-baseline">
                      <h4 className="text-sm font-black italic text-white uppercase tracking-tight text-aqua-400">
                        AI ?�常檢測�?Detection
                      </h4>
                      <span className="text-[9px] text-aqua-400 font-black uppercase tracking-widest italic animate-pulse">
                        Processing 74%
                      </span>
                    </div>
                    <p className="text-[11px] text-white/30 font-light italic leading-relaxed tracking-tight">
                      比�?歷史?��?線�??�用 GAN 模�?計�?碳強度異常�??�並?��?標籤...
                    </p>
                    <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: '74%' }}
                        transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
                        className="h-full bg-aqua-500 shadow-[0_0_10px_rgba(0,255,255,1)] relative"
                      >
                        <div className="absolute right-0 top-0 bottom-0 w-4 bg-white/30 blur-sm" />
                      </motion.div>
                    </div>
                  </div>
                </div>

                {/* Step 3: Pending */}
                <div className="flex gap-6">
                  <div className="relative z-10 size-8 rounded-full bg-white/5 border-4 border-white/10 flex items-center justify-center opacity-40">
                    <Description style={{ fontSize: '14px' }} className="text-white" />
                  </div>
                  <div className="flex-1 opacity-40 space-y-2 text-white/20">
                    <div className="flex justify-between items-baseline">
                      <h4 className="text-sm font-black italic uppercase tracking-tight">
                        ?��??��? Report Generation
                      </h4>
                      <span className="text-[9px] font-black uppercase tracking-widest italic">
                        Waiting
                      </span>
                    </div>
                    <p className="text-[11px] font-light italic leading-relaxed tracking-tight">
                      系統將根?��??��??�自?��??�可視�? PDF ?��??��?並推?�至管�?�?..
                    </p>
                    <div className="w-full h-1 bg-white/10 rounded-full" />
                  </div>
                </div>
              </div>

              <button className="w-full mt-12 py-5 rounded-2xl bg-aqua-500/5 border border-aqua-500/20 text-aqua-400 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-4 hover:bg-aqua-500/10 transition-all active:scale-95 group">
                ?��?完整?��??�日�?System Logs{' '}
                <OpenInNew
                  style={{ fontSize: '14px' }}
                  className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
                />
              </button>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Floating Action Navigation (The Ring) */}
      <nav className="fixed bottom-6 left-6 right-6 h-20 bg-black/40 backdrop-blur-3xl border border-white/10 rounded-[2rem] flex items-center justify-around px-2 z-[100] shadow-[0_30px_60px_rgba(0,0,0,0.8)]">
        <button className="flex flex-col items-center gap-1.5 text-aqua-400 scale-110 active:scale-95 transition-all">
          <GridView style={{ fontSize: '26px' }} className="drop-shadow-[0_0_8px_rgba(0,255,255,1)]" />
          <span className="text-[9px] font-black uppercase tracking-widest leading-none">
            ?�陣 Matrix
          </span>
        </button>
        <button className="flex flex-col items-center gap-1.5 text-white/20 hover:text-white transition-all active:scale-95">
          <AccountTree style={{ fontSize: '26px' }} />
          <span className="text-[9px] font-black uppercase tracking-widest leading-none">
            流�? Flow
          </span>
        </button>

        {/* Center High-Impact Button */}
        <div className="relative -top-8">
          <button className="size-16 bg-aqua-500 rounded-full shadow-[0_15px_35px_rgba(0,255,255,0.5)] flex items-center justify-center text-[#0a1414] border-[6px] border-[#0a1414] active:scale-90 transition-all hover:scale-110">
            <Add style={{ fontSize: '36px' }} className="font-bold" />
          </button>
        </div>

        <button className="flex flex-col items-center gap-1.5 text-white/20 hover:text-white transition-all active:scale-95">
          <Analytics style={{ fontSize: '26px' }} />
          <span className="text-[9px] font-black uppercase tracking-widest leading-none">
            ?��? Data
          </span>
        </button>
        <button className="flex flex-col items-center gap-1.5 text-white/20 hover:text-white transition-all active:scale-95">
          <Settings style={{ fontSize: '26px' }} />
          <span className="text-[9px] font-black uppercase tracking-widest leading-none">
            設�? Set
          </span>
        </button>
      </nav>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .font-display { font-family: 'Space Grotesk', 'Noto Sans TC', sans-serif; }
        .animate-spin-slow { animation: spin 4s linear infinite; }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

