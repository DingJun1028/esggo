import React from 'react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { Globe, Terminal, Search } from 'lucide-react';

const TEXT = {
  TITLE: { zh: '深度審計', en: 'DEEP AUDIT' },
  SUBTITLE: { zh: '即時追踪', en: 'Real-time Tracking' },
};

export const DeepAudit: React.FC = () => {
  const { language } = useLanguage();
  const isZh = language === 'zh-TW';

  const logs = [
    {
      id: 1,
      timestamp: '2023-10-27T16:53:52.000Z',
      message: {
        zh: '供應鏈地圖：警報已啟用，等待中...',
        en: 'Supply chain map: alert enabled wait...',
      },
      source: 'COMPLIANCE',
    },
    {
      id: 2,
      timestamp: '2023-10-27T18:25:33.000Z',
      message: { zh: '供應鏈地圖：優化資產...', en: 'Supply chain map: optimization asset...' },
      source: 'IPMS',
    },
    {
      id: 3,
      timestamp: '2023-10-27T10:57:08.000Z',
      message: {
        zh: '供應鏈地圖：檢測到斷開節點...',
        en: 'Supply chain map: disconnected node...',
      },
      source: 'LEGION',
    },
  ];

  return (
    <div className="h-full flex flex-col gap-2">
      {/* Supply Chain Map */}
      <div
        className="flex-1 rounded border border-white/5 relative overflow-hidden group"
        style={{ backgroundImage: 'radial-gradient(circle at center, #1e293b 0%, #0f172a 100%)' }}
      >
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'radial-gradient(circle, #64748b 1px, transparent 1px)',
            backgroundSize: '16px 16px',
          }}
        />
        <div className="absolute top-2 left-2 text-xs font-bold text-white/50 bg-black/50 px-2 py-1 rounded backdrop-blur-sm flex items-center gap-1">
          <Globe className="w-3 h-3" />
          {isZh ? '供應鏈地圖' : 'SUPPLY CHAIN MAP'}
        </div>

        {/* Fake Nodes */}
        <div className="absolute top-[40%] left-[25%] w-2 h-2 bg-red-500 rounded-full animate-ping" />
        <div className="absolute top-[35%] left-[60%] w-2 h-2 bg-red-500 rounded-full animate-ping delay-75" />
        <div className="absolute top-[60%] left-[70%] w-2 h-2 bg-red-500 rounded-full animate-ping delay-150" />

        {/* Log Terminal Overlay */}
        <div className="h-full flex flex-col p-4 font-mono text-sm relative z-10 bg-black/20">
          <div className="flex items-center gap-2 mb-4 shrink-0">
            <Search className="text-cyan-400" size={18} />
            <div>
              <span className="font-bold text-white block leading-none">
                {isZh ? TEXT.TITLE.zh : TEXT.TITLE.en}
              </span>
              <span className="text-[10px] text-slate-500">
                {isZh ? TEXT.SUBTITLE.zh : TEXT.SUBTITLE.en}
              </span>
            </div>
          </div>

          <div className="flex-1 bg-black/60 border border-white/10 rounded-lg p-2 overflow-hidden flex flex-col backdrop-blur-sm">
            <div className="flex items-center gap-2 text-[10px] text-slate-500 border-b border-white/5 pb-2 mb-2">
              <Terminal size={12} />
              <span>root@junaikey-nexus:~$ tail -f /var/log/global_audit.log</span>
            </div>

            <div className="overflow-y-auto custom-scrollbar flex-1 space-y-3">
              {logs.map(log => (
                <div
                  key={log.id}
                  className="flex gap-2 text-xs animate-in slide-in-from-left duration-300"
                >
                  <span className="text-slate-600 shrink-0">
                    [{log.timestamp?.split('T')[1]?.split('.')[0] || '00:00:00'}]
                  </span>
                  <span
                    className={`shrink-0 font-bold px-1 rounded text-[10px] h-fit
                                ${
                                  log.source === 'COMPLIANCE'
                                    ? 'bg-emerald-900/50 text-emerald-400'
                                    : log.source === 'IPMS'
                                      ? 'bg-cyan-900/50 text-cyan-400'
                                      : 'bg-purple-900/50 text-purple-400'
                                }
                             `}
                  >
                    {log.source}
                  </span>
                  <span className="text-slate-300 break-words">
                    {isZh ? log.message?.zh : log.message?.en}
                  </span>
                </div>
              ))}

              <div className="flex gap-2 text-xs opacity-50">
                <span className="text-slate-600">
                  [{new Date().toISOString().split('T')[1]?.split('.')[0]}]
                </span>
                <span className="text-slate-500 animate-pulse">_</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
