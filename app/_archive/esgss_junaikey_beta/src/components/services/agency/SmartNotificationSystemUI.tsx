import React, { useState } from 'react';
import {
  Zap,
  Bell,
  CheckCircle,
  AlertTriangle,
  Info,
  Clock,
  ExternalLink,
  Search,
  Settings,
  MoreVertical,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { agencyManager, SmartNotification } from '../../../services/AgencyManager';

export const SmartNotificationSystemUI: React.FC<{ language: any; theme: string }> = ({
  language,
  theme,
}) => {
  const isDark = theme === 'dark';
  const [notifications, setNotifications] = useState<SmartNotification[]>(() =>
    agencyManager.getNotifications()
  );

  const handleRead = (id: string) => {
    agencyManager.markAsRead(id);
    setNotifications(agencyManager.getNotifications());
  };

  return (
    <div
      className={`flex flex-col h-full overflow-hidden ${isDark ? 'text-white' : 'text-slate-900'}`}
    >
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-500 border border-amber-500/30">
            <Zap size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight">AI Notification Hub</h2>
            <div className="text-[10px] font-mono opacity-50 uppercase tracking-widest">
              Sentient Intelligence Alert Stream
            </div>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-right">
            <div className="text-[9px] font-black opacity-30 uppercase">System Status</div>
            <div className="text-xs font-bold text-emerald-400">OPTIMAL</div>
          </div>
          <Settings
            size={20}
            className="opacity-30 cursor-pointer hover:rotate-90 transition-transform duration-300"
          />
        </div>
      </div>

      <div
        className={`flex-1 rounded-3xl border ${isDark ? 'bg-slate-900/50 border-white/5' : 'bg-white border-slate-200'} p-6 flex flex-col overflow-hidden`}
      >
        <div className="flex justify-between items-center mb-6 px-2">
          <h3 className="text-xs font-black uppercase tracking-widest opacity-60">
            Intelligence Stream
          </h3>
          <span className="text-[10px] bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded-full font-bold">
            {notifications.filter(n => !n.read).length} UNREAD
          </span>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-4">
          {notifications.map((ntf, i) => (
            <motion.div
              key={ntf.id}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => handleRead(ntf.id)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer relative group ${
                ntf.read
                  ? isDark
                    ? 'bg-slate-950/30 border-white/5 opacity-50'
                    : 'bg-slate-50/50 border-slate-100 opacity-60'
                  : isDark
                    ? 'bg-slate-950 border-white/10 shadow-lg'
                    : 'bg-white border-slate-200 shadow-md'
              }`}
            >
              {!ntf.read && (
                <div className="absolute top-4 left-0 w-1 h-8 bg-amber-500 rounded-r-full" />
              )}

              <div className="flex gap-4">
                <div
                  className={`p-3 rounded-xl h-fit ${
                    ntf.type === 'ALERT'
                      ? 'bg-red-500/10 text-red-500'
                      : ntf.type === 'INSIGHT'
                        ? 'bg-indigo-500/10 text-indigo-400'
                        : 'bg-emerald-500/10 text-emerald-500'
                  }`}
                >
                  {ntf.type === 'ALERT' ? (
                    <AlertTriangle size={20} />
                  ) : ntf.type === 'INSIGHT' ? (
                    <Info size={20} />
                  ) : (
                    <CheckCircle size={20} />
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <span
                      className={`text-[9px] font-black uppercase tracking-widest ${
                        ntf.priority === 'CRITICAL' ? 'text-red-500' : 'text-indigo-400'
                      }`}
                    >
                      {ntf.priority} Priority
                    </span>
                    <span className="text-[9px] font-mono opacity-30 flex items-center gap-1">
                      <Clock size={8} /> {new Date(ntf.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold mb-1">{ntf.title}</h4>
                  <p className="text-xs opacity-60 leading-relaxed">{ntf.message}</p>

                  {!ntf.read && (
                    <div className="mt-4 flex gap-4">
                      <button className="text-[10px] font-black uppercase tracking-widest text-indigo-400 flex items-center gap-1 hover:gap-2 transition-all">
                        Analysis <ExternalLink size={10} />
                      </button>
                      <button className="text-[10px] font-black uppercase tracking-widest opacity-30 hover:opacity-100">
                        Dismiss
                      </button>
                    </div>
                  )}
                </div>
                <MoreVertical
                  size={16}
                  className="opacity-10 group-hover:opacity-30 transition-opacity"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="mt-6 flex justify-between items-center px-4">
        <div className="text-[10px] font-mono opacity-30 uppercase tracking-widest">
          Connection: Multi-Bridge WebSocket Secure
        </div>
        <div className="flex gap-4">
          <button className="text-[10px] font-black uppercase tracking-widest opacity-40 hover:opacity-100">
            Silence System
          </button>
          <button className="text-[10px] font-black uppercase tracking-widest text-indigo-400">
            View History
          </button>
        </div>
      </div>
    </div>
  );
};

export default SmartNotificationSystemUI;
