import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Cpu,
  ShieldCheck,
  Cloud,
  FileText,
  BellRing,
  Play,
  CheckCircle2,
  XCircle,
  Clock,
  Terminal,
  Fingerprint,
} from 'lucide-react';
import { useActionExecutor } from '../../hooks/useActionExecutor';
import { useSovereignSession } from '../../hooks/useSovereignSession';
import { useAgentRpg } from '../../hooks/useAgentRpg';

export const ActionCenter: React.FC = () => {
  const { actions, history, runAction } = useActionExecutor();
  const { generateBioID } = useSovereignSession();
  const { profile } = useAgentRpg();

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'ShieldCheck':
        return <ShieldCheck className="w-5 h-5" />;
      case 'Cloud':
        return <Cloud className="w-5 h-5" />;
      case 'FileText':
        return <FileText className="w-5 h-5" />;
      case 'BellRing':
        return <BellRing className="w-5 h-5" />;
      default:
        return <Cpu className="w-5 h-5" />;
    }
  };

  const handleExecute = (actionId: string) => {
    const bioId = generateBioID(profile);
    // Standard actions only need one signature (the active agent)
    // High security will fail here for demo unless more are passed (via Swarm)
    runAction(actionId, [bioId]);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-2">
      {/* Left Col: Available Automation Tasks */}
      <div className="lg:col-span-12 xl:col-span-7 space-y-6">
        <div className="bg-black/60 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center border border-purple-500/40">
                <Cpu className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <h3 className="text-sm font-black text-white uppercase tracking-tighter">
                  實境行動中心 (Real-world Bridge)
                </h3>
                <p className="text-[10px] text-purple-500/70 font-mono">
                  AUTOMATION_LAYER_INFRA_v1
                </p>
              </div>
            </div>
            <div className="flex gap-4 text-[10px] font-mono text-gray-500">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                API_BRIDGE_ONLINE
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {actions.map(action => (
              <div
                key={action.id}
                className="group bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-purple-500/40 transition-all relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                  {getIcon(action.icon)}
                </div>

                <div className="flex items-center gap-3 mb-3">
                  <div
                    className={`p-2 rounded-lg ${
                      action.securityLevel === 'HIGH'
                        ? 'bg-orange-500/10 text-orange-400'
                        : 'bg-cyan-500/10 text-cyan-400'
                    }`}
                  >
                    {getIcon(action.icon)}
                  </div>
                  <div>
                    <div className="text-[13px] font-bold text-gray-200">{action.name}</div>
                    <div
                      className={`text-[8px] font-black uppercase tracking-widest ${
                        action.securityLevel === 'HIGH' ? 'text-orange-500' : 'text-cyan-500'
                      }`}
                    >
                      {action.securityLevel} SECURITY
                    </div>
                  </div>
                </div>
                <p className="text-[11px] text-gray-500 mb-6 leading-relaxed">
                  {action.description}
                </p>
                <button
                  onClick={() => handleExecute(action.id)}
                  className="w-full py-2.5 rounded-xl border border-white/10 bg-white/5 text-[11px] font-black uppercase tracking-wider text-gray-300 hover:bg-purple-500/20 hover:border-purple-500/40 hover:text-purple-400 transition-all flex items-center justify-center gap-2"
                >
                  <Play className="w-3 h-3 fill-current" />
                  Trigger Execution
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Col: Execution Logs */}
      <div className="lg:col-span-12 xl:col-span-5 space-y-6">
        <div className="bg-black/80 border border-white/10 rounded-2xl p-6 h-[600px] flex flex-col font-mono">
          <div className="flex items-center gap-2 mb-6 text-[11px] font-black text-gray-400 uppercase tracking-widest pb-4 border-b border-white/5">
            <Terminal className="w-4 h-4" />
            Execution Live Stream
          </div>

          <div className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-thin scrollbar-thumb-white/10">
            <AnimatePresence initial={false}>
              {history.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-700 opacity-50 space-y-2">
                  <Clock className="w-8 h-8" />
                  <div className="text-[10px] uppercase">Awaiting System Instructions...</div>
                </div>
              ) : (
                history.map(record => (
                  <motion.div
                    key={record.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`p-4 rounded-xl border ${
                      record.status === 'SUCCESS'
                        ? 'border-green-500/20 bg-green-500/5'
                        : 'border-red-500/20 bg-red-500/5'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {record.status === 'SUCCESS' ? (
                          <CheckCircle2 className="w-3 h-3 text-green-400" />
                        ) : (
                          <XCircle className="w-3 h-3 text-red-400" />
                        )}
                        <span className="text-[10px] font-black text-gray-300">{record.id}</span>
                      </div>
                      <span className="text-[9px] text-gray-600">
                        {new Date(record.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="text-[11px] text-gray-400 mb-3 leading-relaxed">
                      {record.result}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {record.signatures.map(sig => (
                        <div
                          key={sig}
                          className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-black/40 border border-white/5"
                        >
                          <Fingerprint className="w-2.5 h-2.5 text-purple-500" />
                          <span className="text-[8px] text-gray-500">{sig}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>

          <div className="mt-6 pt-4 border-t border-white/5 space-y-2">
            <div className="flex justify-between text-[9px] text-gray-600 uppercase font-black">
              <span>Infrastructure Status</span>
              <span className="text-green-500">OPTIMAL</span>
            </div>
            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
              <div className="h-full w-[94%] bg-green-500/40" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
