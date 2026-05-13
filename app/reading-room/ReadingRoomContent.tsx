'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  Clock, 
  ExternalLink, 
  Search, 
  Tag, 
  Filter,
  RefreshCcw,
  Zap,
  ArrowUpRight
} from 'lucide-react';
import { db } from '@/lib/db';
import { getTimeAgo } from '@/lib/reading-room-data';

export default function ReadingRoomContent() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function loadReports() {
      try {
        const data = await db.getReadingRoomReports();
        setReports(data);
      } catch (err) {
        console.error('Failed to load reports:', err);
      } finally {
        setLoading(false);
      }
    }
    loadReports();
  }, []);

  const filteredReports = reports.filter(r => 
    r.title.toLowerCase().includes(search.toLowerCase()) || 
    r.summary?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-slate-900 text-white rounded-2xl shadow-lg">
              <BookOpen size={24} />
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter">永續閱覽室 Reading Room</h1>
          </div>
          <p className="text-slate-500 font-medium text-sm mt-1">
            已與 Supabase Cloud 同步 | 5T 誠信情報持久化存證中心
          </p>
        </div>
        <div className="flex gap-3">
          <div className="bg-white border border-slate-200 rounded-2xl px-4 py-2.5 flex items-center gap-3 shadow-sm focus-within:border-emerald-400 transition-all">
            <Search size={16} className="text-slate-300" />
            <input 
              type="text" 
              placeholder="搜尋情報..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent border-none outline-none text-xs font-bold w-48" 
            />
          </div>
          <button 
            onClick={() => { setLoading(true); window.location.reload(); }}
            className="p-3 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all text-slate-400 hover:text-slate-900"
          >
            <RefreshCcw size={18} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </header>

      {loading ? (
        <div className="py-32 text-center space-y-4">
           <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Accessing Intelligence Vault...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {filteredReports.map((report, idx) => (
              <motion.div
                key={report.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -8 }}
                className="bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-sm hover:shadow-xl transition-all group flex flex-col h-full"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                    report.report_type === 'Alert' ? 'bg-rose-50 text-rose-600 border border-rose-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                  }`}>
                    {report.report_type || 'Insight'}
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1.5">
                    <Clock size={12} /> {getTimeAgo(new Date(report.created_at))}
                  </span>
                </div>

                <h3 className="text-xl font-black text-slate-900 leading-tight mb-4 group-hover:text-emerald-600 transition-colors">
                  {report.title}
                </h3>
                
                <p className="text-slate-500 text-sm font-medium leading-relaxed mb-8 flex-1">
                  {report.summary}
                </p>

                <div className="space-y-6 pt-6 border-t border-slate-50">
                  <div className="flex flex-wrap gap-2">
                    {report.tags?.map((tag: string) => (
                      <span key={tag} className="text-[9px] font-black bg-slate-50 text-slate-400 px-2 py-1 rounded border border-slate-100 uppercase tracking-tighter">
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center">
                        <Zap size={10} />
                      </div>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest truncate max-w-[120px]">
                        {report.source}
                      </span>
                    </div>
                    <button className="p-2 bg-slate-50 rounded-xl text-slate-400 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                      <ExternalLink size={16} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {!loading && filteredReports.length === 0 && (
        <div className="py-32 text-center">
          <BookOpen size={64} className="mx-auto text-slate-200 mb-6" />
          <h3 className="text-xl font-black text-slate-400">目前尚無相關情報報告</h3>
        </div>
      )}
    </div>
  );
}