import React, { useState } from 'react';
import { X } from 'lucide-react';

interface CreateAgentModalProps {
  onClose: () => void;
  onCreate: (agent: { name: string; role: 'E' | 'S' | 'G'; description: string }) => void;
}

export const CreateAgentModal: React.FC<CreateAgentModalProps> = ({ onClose, onCreate }) => {
  const [name, setName] = useState('');
  const [role, setRole] = useState<'E' | 'S' | 'G'>('E');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreate({ name, role, description });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200">
      <div
        className="bg-slate-900/90 border border-white/10 rounded-2xl shadow-2xl p-8 w-full max-w-md relative overflow-hidden animate-in slide-in-from-bottom-4 duration-300"
        onClick={e => e.stopPropagation()}
      >
        {/* 背景裝飾 */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="flex justify-between items-center mb-6 relative z-10">
          <h2 className="text-2xl font-bold text-white tracking-tight">鍛造新智慧體</h2>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="relative z-10">
          <div className="space-y-5">
            <div>
              <label
                htmlFor="agent-name"
                className="block text-sm font-medium text-slate-400 mb-1.5 ml-1"
              >
                智慧體代號
              </label>
              <input
                id="agent-name"
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                placeholder="例如: EcoGuardian Alpha"
                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
              />
            </div>

            <div>
              <label
                htmlFor="agent-role"
                className="block text-sm font-medium text-slate-400 mb-1.5 ml-1"
              >
                核心職責 (ESG)
              </label>
              <div className="relative">
                <select
                  id="agent-role"
                  value={role}
                  onChange={e => setRole(e.target.value as 'E' | 'S' | 'G')}
                  className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all appearance-none cursor-pointer hover:bg-black/30"
                >
                  <option value="E" className="bg-slate-900 text-emerald-400">
                    🌿 環境 (Environmental)
                  </option>
                  <option value="S" className="bg-slate-900 text-pink-400">
                    🤝 社會 (Social)
                  </option>
                  <option value="G" className="bg-slate-900 text-blue-400">
                    ⚖️ 治理 (Governance)
                  </option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </div>
              </div>
            </div>

            <div>
              <label
                htmlFor="agent-description"
                className="block text-sm font-medium text-slate-400 mb-1.5 ml-1"
              >
                功能描述
              </label>
              <textarea
                id="agent-description"
                value={description}
                onChange={e => setDescription(e.target.value)}
                required
                rows={4}
                placeholder="描述此智慧體的主要任務與能力..."
                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all resize-none"
              />
            </div>
          </div>

          <div className="mt-8 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 font-medium transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold shadow-lg shadow-blue-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              確認鍛造
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
