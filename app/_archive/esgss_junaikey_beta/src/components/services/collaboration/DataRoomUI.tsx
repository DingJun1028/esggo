import React, { useState, useEffect } from 'react';
import {
  Shield,
  Lock,
  FileText,
  Download,
  Eye,
  ShieldCheck,
  AlertCircle,
  Clock,
  Search,
  Filter,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { DataRoomService, DataRoomDocument } from '@/services/collaboration/DataRoomService';

export const DataRoomUI: React.FC<{ theme?: string }> = ({ theme = 'dark' }) => {
  const isDark = theme === 'dark';
  const [documents, setDocuments] = useState<DataRoomDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const docs = await DataRoomService.getDocuments();
    setDocuments(docs);
    setLoading(false);
  };

  const filteredDocs = documents.filter(
    doc =>
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={`flex flex-col h-full ${isDark ? 'text-white' : 'text-slate-900'}`}>
      <header className="mb-6 flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-black bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
            Secure Data Room
          </h2>
          <p className="text-xs opacity-50 font-mono">Institutional Evidence & Disclosure Vault</p>
        </div>
        <div className="flex gap-2">
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border ${isDark ? 'bg-slate-900 border-white/5' : 'bg-white border-slate-200'}`}
          >
            <Search size={14} className="opacity-30" />
            <input
              type="text"
              placeholder="Search documents..."
              className="bg-transparent border-none outline-none text-[10px] w-40"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-hidden flex flex-col gap-4">
        {/* Security Banner */}
        <div
          className={`p-4 rounded-2xl border ${isDark ? 'bg-indigo-500/10 border-indigo-500/20' : 'bg-indigo-50 border-indigo-200'} flex items-center gap-4`}
        >
          <div className="p-3 rounded-full bg-indigo-500 text-white shadow-lg shadow-indigo-500/30">
            <Shield size={24} />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-sm">Military-Grade Persistence</h3>
            <p className="text-[10px] opacity-60">
              All documents are cross-verified with the Mother of All Truth (SSOT) protocol.
            </p>
          </div>
          <div className="flex -space-x-2">
            {[1, 2, 3].map(i => (
              <div
                key={i}
                className="w-8 h-8 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center text-[10px] font-bold"
              >
                A{i}
              </div>
            ))}
          </div>
        </div>

        {/* File Explorer */}
        <div
          className={`flex-1 rounded-3xl border ${isDark ? 'bg-slate-900/50 border-white/5' : 'bg-white border-slate-200'} overflow-hidden flex flex-col`}
        >
          <div
            className={`p-4 border-b ${isDark ? 'border-white/5' : 'border-slate-100'} flex items-center justify-between text-[10px] font-black opacity-40 uppercase tracking-widest`}
          >
            <div className="flex-1">Document Name</div>
            <div className="w-32">Category</div>
            <div className="w-24">Status</div>
            <div className="w-32 text-right">Updated</div>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
            <AnimatePresence>
              {filteredDocs.map((doc, idx) => (
                <motion.div
                  key={doc.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className={`group p-4 flex items-center rounded-2xl border border-transparent hover:border-indigo-500/30 hover:bg-indigo-500/5 transition-all mb-2`}
                >
                  <div className="flex-1 flex items-center gap-4">
                    <div
                      className={`p-3 rounded-xl ${
                        doc.category === 'FINANCIAL'
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : doc.category === 'ESG_DATA'
                            ? 'bg-cyan-500/10 text-cyan-400'
                            : 'bg-amber-500/10 text-amber-400'
                      }`}
                    >
                      <FileText size={20} />
                    </div>
                    <div>
                      <div className="text-sm font-bold group-hover:text-indigo-400 transition-colors">
                        {doc.name}
                      </div>
                      <div className="text-[10px] opacity-30 font-mono">
                        SHA-256: {doc.integrityHash}
                      </div>
                    </div>
                  </div>

                  <div className="w-32">
                    <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-slate-800 border border-white/5 text-slate-400">
                      {doc.category}
                    </span>
                    {/* [Phase 62] Privacy Tag */}
                    {doc.category === 'ESG_DATA' && (
                      <div className="mt-1 flex items-center gap-1 text-[8px] text-cyan-500 font-mono">
                        <Lock size={8} /> ZK-PROOF
                      </div>
                    )}
                  </div>

                  <div className="w-24">
                    {doc.status === 'VERIFIED' ? (
                      <div className="flex items-center gap-1 text-emerald-400 text-[9px] font-black">
                        <ShieldCheck size={12} /> VERIFIED
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-amber-400 text-[9px] font-black">
                        <Lock size={12} /> PROTECTED
                      </div>
                    )}
                  </div>

                  <div className="w-32 text-right">
                    <div className="text-[10px] opacity-40">
                      {new Date(doc.timestamp).toLocaleDateString()}
                    </div>
                    <div className="text-[9px] opacity-20 font-mono mt-0.5">INTERNAL_ONLY</div>
                  </div>

                  <div className="flex gap-2 ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white transition-colors">
                      <Eye size={14} />
                    </button>
                    <button className="p-2 rounded-lg bg-indigo-500 hover:bg-indigo-400 text-white transition-colors">
                      <Download size={14} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};
