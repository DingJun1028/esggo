import React, { useState, useEffect } from 'react';
import { omniLogger, LogCategory } from '@/omni/infrastructure/logging/OmniLogger';

import { supabase } from '../../lib/supabase';
import {
  Notifications,
  Groups,
  Gavel,
  Settings,
  Send,
  Analytics,
  Security,
  PriorityHigh,
  History,
  CloudDone,
  FilterList,
  Warning,
  Info,
  MoreVert,
  Archive,
  Delete,
  Psychology,
  ViewInAr,
  Search,
  AutoAwesome,
  Block,
  CheckCircle,
  Schedule,
} from '@mui/icons-material';
import {
  Bell,
  Leaf,
  Users,
  ShieldAlert,
  Settings as SettingsIcon,
  Send as SendIcon,
  Network,
  BarChart3,
  ShieldCheck,
  AlertTriangle,
  Clock,
  CloudLightning,
  Sliders,
  AlertCircle,
  Info as InfoIcon,
  MoreHorizontal,
  Package,
  Trash2,
  Brain,
  Box,
  Search as SearchIcon,
  Sparkles,
  Ban,
  CheckCircle2,
  Watch,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * 🔔 Smart Notification System (Service 4.4)
 * --------------------------------------------------
 * "AI-Driven ESG Message Management" for DingJun Hong.
 * Features: Priority Feed, AI Noise Reduction, Multi-channel Sync.
 */
export const SmartNotificationSystem = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) return;

    const fetchNotifications = async () => {
      try {
        const { data, error } = await supabase
          .from('esg_notifications')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setNotifications(data || []);
      } catch (err) {
        omniLogger.error(LogCategory.SYSTEM, '[SmartNotificationSystem] Error fetching notifications:', { error: err });
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();

    // Real-time subscription
    const subscription = supabase
      .channel('esg_notifications_changes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'esg_notifications' }, (payload: any) => {
        setNotifications(prev => [payload.new, ...prev]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const markAsRead = async (id: string) => {
    if (!supabase) return;
    try {
      await supabase.from('esg_notifications').update({ is_read: true }).eq('id', id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
    } catch (err) {
      omniLogger.error(LogCategory.SYSTEM, '[SmartNotificationSystem] Error marking as read:', { error: err });
    }
  };

  const stats = [
    {
      label: '今日通知總數 Total',
      val: '128',
      trend: '+12%',
      icon: BarChart3,
      color: 'text-[#63a6b0]',
    },
    {
      label: 'AI 已攔截噪音 Filtered',
      val: '84',
      trend: '減少 45%',
      icon: Ban,
      color: 'text-red-400',
    },
    {
      label: '待處理急件 Urgent',
      val: '12',
      trend: 'Avg 8m',
      icon: AlertCircle,
      color: 'text-[#63a6b0]',
    },
    {
      label: '發送成功率 Success Rate',
      val: '99.8%',
      trend: 'Stable',
      icon: CheckCircle2,
      color: 'text-[#63a6b0]',
    },
  ];

  return (
    <div className="bg-[#102222] text-white min-h-screen font-display selection:bg-[#63a6b0]/20 overflow-x-hidden">
      {/* Fixed Background Glows */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-[10%] right-[10%] size-[600px] bg-[#63a6b0]/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-[20%] left-[5%] size-[400px] bg-[#63a6b0]/10 rounded-full blur-[120px]" />
      </div>

      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-10 py-5 backdrop-blur-3xl bg-[#102222]/80 border-b border-[#63a6b0]/20">
        <div className="flex items-center gap-10">
          <div className="flex items-center gap-4 text-[#63a6b0]">
            <ViewInAr className="size-8" />
            <h2 className="text-white text-xl font-black tracking-tighter leading-none">
              ESGss JunAiKey
            </h2>
          </div>
          <div className="relative group hidden lg:block">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-[#63a6b0]/40 size-4 group-focus-within:text-[#63a6b0] transition-colors" />
            <input
              className="bg-[#63a6b0]/10 border border-[#63a6b0]/20 rounded-2xl pl-12 pr-6 py-2.5 text-xs w-80 outline-none focus:ring-1 focus:ring-[#63a6b0] transition-all placeholder:text-[#63a6b0]/40"
              placeholder="搜索 ESG 通知 Search Notifications..."
            />
          </div>
        </div>

        <div className="flex items-center gap-10">
          <nav className="hidden xl:flex items-center gap-9">
            {['控制面板', '通訊管理', '數據分析', '系統設置'].map((link, i) => (
              <a
                key={i}
                className={`text-[10px] font-black uppercase tracking-[0.3em] transition-colors ${i === 1 ? 'text-[#63a6b0]' : 'text-white/40 hover:text-white'}`}
                href="#"
              >
                {link}
              </a>
            ))}
          </nav>
          <button className="flex items-center gap-3 bg-[#63a6b0] hover:bg-[#63a6b0]/80 text-[#102222] px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl transition-all active:scale-95">
            <Sparkles size={14} /> AI 降噪開啟 Noise-Kill On
          </button>
          <div className="size-10 rounded-full border-2 border-[#63a6b0]/40 p-0.5 overflow-hidden ring-4 ring-[#63a6b0]/5">
            <div
              className="size-full rounded-full bg-cover bg-center"
              style={{
                backgroundImage:
                  "url('https://lh3.googleusercontent.com/a/ACg8ocL_U0YV6m_XzW_G_y_W_s_x_x_x=s96-c')",
              }}
            />
          </div>
        </div>
      </header>

      <main className="max-w-[1700px] mx-auto px-10 py-12 flex gap-10">
        {/* Left Side Navigation Sidebar */}
        <aside className="w-80 flex flex-col gap-8 sticky top-32 h-fit">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="backdrop-blur-3xl bg-white/[0.03] border border-white/10 p-10 rounded-[2.5rem] flex flex-col gap-10 shadow-2xl"
          >
            <div className="space-y-2">
              <h1 className="text-2xl font-black tracking-tighter text-white">DingJun Hong</h1>
              <p className="text-[#63a6b0] text-[10px] font-black tracking-[0.3em] uppercase opacity-70">
                智能通知中心 Notification Hub
              </p>
            </div>

            <nav className="flex flex-col gap-3">
              {[
                { label: '全部通知', en: 'All Feed', icon: Bell, count: 24, active: true },
                { label: '碳排放警報', en: 'Carbon Alert', icon: Leaf },
                { label: '社會責任 (S)', en: 'Social (S)', icon: Users },
                { label: '治理合規 (G)', en: 'Governance (G)', icon: ShieldAlert },
                { label: '系統訊息', en: 'System Ops', icon: SettingsIcon },
              ].map((item, i) => (
                <a
                  key={i}
                  href="#"
                  className={`flex items-center gap-5 px-6 py-4 rounded-2xl transition-all border ${item.active ? 'bg-[#63a6b0] text-[#102222] border-[#63a6b0] shadow-[0_0_20px_rgba(99,166,176,0.3)]' : 'bg-white/5 text-white/50 border-transparent hover:bg-white/10 hover:text-white'}`}
                >
                  <item.icon size={18} />
                  <div className="flex flex-col flex-1">
                    <span className="font-black text-[13px] tracking-tight">{item.label}</span>
                    <span
                      className={`text-[8px] font-bold uppercase tracking-widest ${item.active ? 'text-[#102222]/60' : 'text-white/20'}`}
                    >
                      {item.en}
                    </span>
                  </div>
                  {item.count && (
                    <span
                      className={`text-[10px] font-black px-3 py-1 rounded-full ${item.active ? 'bg-[#102222]/10 text-[#102222]' : 'bg-white/5 text-white/40'}`}
                    >
                      {item.count}
                    </span>
                  )}
                </a>
              ))}
            </nav>

            <button className="w-full flex items-center justify-center gap-4 h-16 bg-[#0ab8b2]/10 border border-[#0ab8b2]/20 text-[#0ab8b2] rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-[#0ab8b2]/20 transition-all active:scale-95 shadow-xl">
              <SendIcon size={16} /> 發布新通知 Publish
            </button>
          </motion.div>

          {/* Distribution Status Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="backdrop-blur-3xl bg-white/[0.03] border border-white/10 p-10 rounded-[2.5rem] shadow-2xl space-y-8"
          >
            <h3 className="text-white text-[10px] font-black tracking-[0.3em] uppercase flex items-center gap-4">
              <Network size={16} className="text-[#63a6b0]" /> 多管道分發狀態
            </h3>
            <div className="space-y-6">
              {[
                { label: 'Email 網關', status: '正常運作', val: 95 },
                { label: 'SMS 服務', status: '99.2%', val: 99 },
              ].map((gate, i) => (
                <div key={i} className="space-y-3">
                  <div className="flex items-center justify-between text-[11px] font-black">
                    <span className="text-white/40 uppercase tracking-widest">{gate.label}</span>
                    <span className="text-[#63a6b0] tracking-tighter">{gate.status}</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden p-[1px]">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${gate.val}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className="h-full bg-[#63a6b0] rounded-full shadow-[0_0_10px_#63a6b0]"
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col gap-10">
          {/* Page Heading Ribbon */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="backdrop-blur-3xl bg-white/[0.02] border border-white/10 rounded-[3rem] p-12 flex flex-col lg:flex-row justify-between items-end gap-10 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 size-96 bg-[#63a6b0]/10 blur-[120px] -mr-48 -mt-48 rounded-full" />

            <div className="space-y-4 relative z-10">
              <h1 className="text-6xl font-black tracking-tighter text-white">4.4 智能通知系統</h1>
              <p className="text-[#63a6b0]/60 text-2xl font-light tracking-tight italic">
                基於 AI 驅動的{' '}
                <span className="text-white font-medium not-italic">
                  ESG 訊息管理與多管道分發中心
                </span>
              </p>
            </div>

            <div className="relative z-10">
              <button className="flex items-center gap-4 bg-[#63a6b0]/10 border border-[#63a6b0]/20 text-white px-10 py-5 rounded-[2rem] text-[10px] font-black uppercase tracking-[0.3em] hover:bg-[#63a6b0]/20 transition-all active:scale-95 shadow-2xl">
                <Sliders size={16} /> 過濾規則設定 Rules
              </button>
            </div>
          </motion.div>

          {/* Real-time Statistics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i }}
                className="backdrop-blur-2xl bg-white/[0.03] border border-[#0ab8b2]/20 p-10 rounded-[3rem] space-y-6 shadow-xl group hover:border-[#0ab8b2] transition-all"
              >
                <div className="flex justify-between items-start">
                  <p className="text-white/40 text-[9px] font-black uppercase tracking-[0.3em]">
                    {stat.label}
                  </p>
                  <stat.icon
                    size={18}
                    className="text-[#63a6b0] opacity-40 group-hover:opacity-100 transition-opacity"
                  />
                </div>
                <div className="space-y-2">
                  <p className="text-5xl font-black text-white tracking-tighter">{stat.val}</p>
                  <div
                    className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ${stat.color}`}
                  >
                    {stat.trend}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Page-wide Info Banner (Re-introduced with new aesthetics) */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-8 rounded-[2.5rem] bg-[#63a6b0]/5 border border-dashed border-[#63a6b0]/30 flex items-center gap-6"
          >
            <div className="size-12 rounded-full bg-[#63a6b0]/10 flex items-center justify-center text-[#63a6b0]">
              <Brain size={24} />
            </div>
            <p className="text-white/40 text-sm font-light tracking-tight">
              <span className="text-[#63a6b0] font-black uppercase tracking-widest mr-3 italic">AI Sentinel Observation</span>
              智能哨兵已啟動：系統將自動追蹤全球 ESG 風險，並根據 5T 誠信協議為您提供主動建議。
            </p>
          </motion.div>

          {/* Notification Feed Matrix */}
          <div className="flex flex-col gap-8">
            <div className="flex border-b border-white/5 px-4 gap-12">
              {['優先級視圖 Priority', '類別視圖 Category', '通路狀態 Channel'].map((tab, i) => (
                <button
                  key={i}
                  className={`pb-6 pt-4 text-[11px] font-black uppercase tracking-[0.3em] transition-all border-b-4 ${i === 0 ? 'border-[#0ab8b2] text-[#0ab8b2]' : 'border-transparent text-white/30 hover:text-white'}`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="space-y-8">
              {loading ? (
                <div className="flex flex-col gap-6 animate-pulse">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-48 bg-white/5 rounded-[3rem] border border-white/10" />
                  ))}
                </div>
              ) : notifications.length === 0 ? (
                <div className="text-center py-20 bg-white/[0.02] border border-dashed border-white/10 rounded-[3rem]">
                  <p className="text-white/20 text-xl font-light italic">目前沒有新的通知 No new alerts found.</p>
                </div>
              ) : (
                notifications.map((notif) => (
                  <motion.div
                    key={notif.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.01 }}
                    className={`backdrop-blur-3xl bg-white/[0.02] border ${notif.severity === 'High' ? 'border-l-8 border-l-[#fa5c38] border-[#fa5c38]/40 shadow-[0_0_40px_rgba(250,92,56,0.1)]' : 'border-[#63a6b0]/10 border-l-8 border-l-[#63a6b0] hover:border-[#63a6b0]/40'} rounded-[3rem] p-12 shadow-2xl relative overflow-hidden group transition-all`}
                  >
                    <div className="flex flex-col lg:flex-row justify-between items-start gap-10 relative z-10">
                      <div className="flex gap-10">
                        <div className={`size-20 ${notif.severity === 'High' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-[#63a6b0]/10 text-[#63a6b0] border-[#63a6b0]/20'} border rounded-[2rem] flex items-center justify-center shadow-2xl`}>
                          {notif.type === 'CRITICAL_RISK' ? <AlertTriangle size={36} /> : notif.type === 'DAILY_BRIEFING' ? <Brain size={36} /> : <InfoIcon size={36} />}
                        </div>
                        <div className="space-y-4">
                          <div className="flex items-center gap-4">
                            <span className={`${notif.severity === 'High' ? 'bg-red-500 text-white' : 'bg-[#63a6b0] text-[#102222]'} text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest leading-none shadow-lg`}>
                              {notif.type.replace('_', ' ')}
                            </span>
                            <h4 className="text-white text-3xl font-black tracking-tight leading-none">
                              {notif.title}
                            </h4>
                          </div>
                          <p className={`text-white/${notif.is_read ? '20' : '60'} text-xl font-light leading-relaxed max-w-4xl tracking-tight whitespace-pre-wrap`}>
                            {notif.content}
                          </p>

                          {notif.action_guide && (
                            <div className="mt-6 p-6 rounded-2xl bg-white/5 border border-white/10">
                              <p className="text-[#63a6b0] font-black text-xs uppercase tracking-widest mb-2 flex items-center gap-2">
                                <Sparkles size={14} /> AI Actionable Guide
                              </p>
                              <p className="text-white/50 text-base italic leading-relaxed">
                                {notif.action_guide}
                              </p>
                            </div>
                          )}

                          <div className="flex items-center gap-10 text-[10px] font-black uppercase tracking-widest text-white/30 pt-6">
                            <div className="flex items-center gap-3">
                              <Clock size={16} /> {new Date(notif.created_at).toLocaleString()}
                            </div>
                            {notif.is_read && (
                              <div className="flex items-center gap-3 text-[#63a6b0]/60">
                                <CheckCircle2 size={16} /> 已讀 Read
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-4">
                        {!notif.is_read && (
                          <button
                            onClick={() => markAsRead(notif.id)}
                            className="bg-[#63a6b0] hover:bg-[#63a6b0]/80 text-[#102222] px-10 py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl active:scale-95 transition-all"
                          >
                            標記已讀 Mark Read
                          </button>
                        )}
                        <button className="size-16 rounded-2xl border border-white/10 flex items-center justify-center text-white/40 hover:bg-white/5 transition-all">
                          <MoreHorizontal />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* AI Education Alert Banner */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-12 p-10 rounded-[3rem] bg-[#0ab8b2]/5 border border-dashed border-[#0ab8b2]/30 flex items-center gap-8 shadow-2xl relative overflow-hidden"
            >
              <div className="size-16 rounded-full bg-[#0ab8b2]/10 flex items-center justify-center text-[#0ab8b2]">
                <Brain size={32} />
              </div>
              <div className="space-y-2">
                <p className="text-[#0ab8b2] font-black text-lg tracking-tight italic uppercase tracking-widest">
                  AI 教育提醒 AI Assistant Insight
                </p>
                <p className="text-white/40 text-base font-light tracking-tight leading-relaxed">
                  當前的「AI 降噪」已自動過濾 <span className="text-white font-bold">24</span>{' '}
                  條低相關性系統日誌。您可以隨時在設置中調整過濾權重，優化決策效率。
                </p>
              </div>
              <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#0ab8b2]/10 to-transparent pointer-events-none" />
            </motion.div>
          </div>
        </div>
      </main>

      <footer className="mt-32 pt-12 border-t border-white/5 opacity-30 text-center pb-20">
        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white">
          © 2024 ESGss JunAiKey • DingJun Hong Ecosystem • Smart Notification System v4.4
        </p>
      </footer>
    </div>
  );
};
