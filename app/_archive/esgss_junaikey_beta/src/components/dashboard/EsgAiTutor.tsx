import React from 'react';
import { motion } from 'framer-motion';

/**
 * 🤖 ESG AI Tutor (v8.4.0)
 * --------------------------------------------------
 * 24/7 Knowledge Base assistant powered by Gemini 2.0.
 */
export const EsgAiTutor = () => {
  return (
    <div className="bg-[#050c0b] text-white min-h-screen font-display selection:bg-[#3df5e6]/20 flex flex-col relative overflow-hidden transition-colors duration-300">
      {/* Ambient Background */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-10">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#3df5e6]/5 rounded-full blur-[120px]" />
      </div>

      <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-[#050c0b]/60 backdrop-blur-xl px-8 h-20 flex items-center justify-between">
        <div className="flex items-center gap-10">
          <div className="flex items-center gap-4 text-[#3df5e6]">
            <div className="size-10 bg-[#3df5e6]/20 rounded-xl flex items-center justify-center border border-[#3df5e6]/30">
              <span className="material-symbols-outlined text-[28px]">smart_toy</span>
            </div>
            <h2 className="text-xl font-black tracking-tighter italic uppercase">
              InfoOne <span className="text-white font-light">AI Tutor</span>
            </h2>
          </div>

          <div className="relative group hidden lg:block">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-[18px]">
              search
            </span>
            <input
              type="text"
              placeholder="搜索知識晶體、ISO 標準或證據庫..."
              className="bg-white/5 border border-white/10 rounded-full pl-12 pr-6 py-2.5 text-xs w-[400px] focus:ring-1 focus:ring-[#3df5e6] focus:border-[#3df5e6] transition-all placeholder-slate-600 outline-none italic font-black"
            />
          </div>
        </div>

        <div className="flex items-center gap-8">
          <nav className="hidden md:flex items-center gap-8">
            {['5T 證據庫', 'ISO 標準庫', '實戰案例', '學習路徑'].map(n => (
              <a
                key={n}
                className="text-[10px] font-black uppercase tracking-widest italic text-[#9cbab7] hover:text-[#3df5e6] transition-colors cursor-pointer"
              >
                {n}
              </a>
            ))}
          </nav>
          <div className="flex gap-4">
            <button className="size-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#3df5e6]/20 text-slate-400 hover:text-[#3df5e6] transition-all backdrop-blur-xl">
              <span className="material-symbols-outlined text-[20px]">notifications</span>
            </button>
            <div className="size-10 rounded-full border border-[#3df5e6]/30 overflow-hidden ring-4 ring-[#3df5e6]/5">
              <div className="w-full h-full bg-slate-800" />
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside className="w-72 border-r border-white/5 bg-[#050c0b]/40 backdrop-blur-3xl hidden lg:flex flex-col justify-between p-8 space-y-12">
          <div className="space-y-10">
            <div className="flex items-center gap-5 p-2">
              <div className="size-12 rounded-2xl bg-[#1c2a29] border border-[#3df5e6]/30 p-1">
                <div className="w-full h-full rounded-xl bg-slate-800" />
              </div>
              <div className="space-y-1">
                <h1 className="text-sm font-black italic tracking-tight uppercase leading-none">
                  DingJun Hong
                </h1>
                <p className="text-[8px] text-[#3df5e6] font-black uppercase tracking-[0.2em] italic">
                  ESG 專業學習者
                </p>
              </div>
            </div>

            <div className="space-y-2">
              {[
                { ic: 'chat', t: 'AI 智能助教', active: true },
                { ic: 'diamond', t: '知識晶體庫' },
                { ic: 'folder_open', t: '我的 5T 證據' },
                { ic: 'article', t: 'ISO 條款解析' },
                { ic: 'query_stats', t: '實戰績效分析' },
              ].map((item, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all cursor-pointer border border-transparent ${item.active ? 'bg-[#3df5e6]/10 text-[#3df5e6] border-[#3df5e6]/20 shadow-xl' : 'text-slate-500 hover:bg-white/5 hover:text-white'}`}
                >
                  <span className="material-symbols-outlined text-[20px]">{item.ic}</span>
                  <p className="text-[11px] font-black italic uppercase tracking-widest">
                    {item.t}
                  </p>
                </div>
              ))}
            </div>

            <div className="space-y-6">
              <h3 className="text-[9px] font-black text-slate-600 uppercase tracking-[0.4em] italic px-2">
                最近對話
              </h3>
              <div className="space-y-3 px-2">
                <p className="text-[10px] text-slate-500 font-bold italic truncate cursor-pointer hover:text-[#3df5e6] transition-colors">
                  範疇一排放查證要求...
                </p>
                <p className="text-[10px] text-slate-500 font-bold italic truncate cursor-pointer hover:text-[#3df5e6] transition-colors">
                  ISO 14064-1 條文解析...
                </p>
              </div>
            </div>
          </div>

          <div className="bg-[#3df5e6]/5 rounded-3xl p-6 space-y-4 border border-[#3df5e6]/10">
            <div className="flex justify-between items-center">
              <p className="text-[10px] font-black text-[#3df5e6] uppercase italic">學習進度</p>
              <p className="text-lg font-black text-[#3df5e6] italic tracking-tighter">78%</p>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '78%' }}
                className="bg-[#3df5e6] h-full shadow-[0_0_10px_rgba(61,245,230,0.5)]"
              />
            </div>
          </div>
        </aside>

        {/* Chat Main Area */}
        <main className="flex-1 flex flex-col relative overflow-hidden backdrop-blur-sm">
          <div className="flex flex-wrap justify-between items-end gap-6 p-10">
            <div className="space-y-2">
              <h1 className="text-5xl font-black italic tracking-tighter uppercase leading-none">
                智能助教：<span className="text-[#3df5e6]">24/7 永續知識庫</span>
              </h1>
              <p className="text-slate-500 text-sm font-black italic tracking-widest uppercase">
                結合 Gemini 2.0 深入探索 ESG 知識晶體與 5T 證據佐證
              </p>
            </div>
            <button className="px-10 py-4 bg-[#3df5e6] text-[#050c0b] rounded-2xl font-black italic uppercase tracking-widest text-[10px] shadow-2xl shadow-[#3df5e6]/20 hover:brightness-110 active:scale-95 transition-all">
              生成學習報告
            </button>
          </div>

          <div className="flex-1 flex flex-col md:flex-row gap-10 p-10 pt-0 overflow-hidden">
            {/* Messages Stream */}
            <div className="flex-1 bg-white/[0.02] border border-white/5 rounded-[3.5rem] flex flex-col overflow-hidden backdrop-blur-3xl shadow-3xl">
              <div className="px-10 py-6 border-b border-white/5 flex items-center justify-between bg-[#3df5e6]/5">
                <div className="flex items-center gap-4">
                  <div className="size-2 bg-[#3df5e6] rounded-full animate-pulse shadow-[0_0_10px_#3df5e6]" />
                  <span className="text-[10px] font-black text-[#3df5e6] uppercase tracking-[0.4em] italic">
                    Gemini 2.0 導師系統已連線
                  </span>
                </div>
                <span className="material-symbols-outlined text-slate-600 hover:text-[#3df5e6] cursor-pointer transition-colors">
                  more_horiz
                </span>
              </div>

              <div className="flex-1 overflow-y-auto p-10 space-y-10 custom-scrollbar">
                {/* AI Message */}
                <div className="flex items-start gap-8">
                  <div className="size-14 rounded-2xl bg-[#3df5e6]/10 border border-[#3df5e6]/30 flex items-center justify-center text-[#3df5e6] shrink-0 shadow-lg">
                    <span className="material-symbols-outlined text-[32px]">smart_toy</span>
                  </div>
                  <div className="space-y-3 max-w-[85%]">
                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest italic ml-2">
                      ESG AI Tutor
                    </p>
                    <div className="bg-white/5 border border-white/10 rounded-[2.5rem] rounded-tl-none p-8 text-sm leading-relaxed italic text-white/90">
                      您好，DingJun Hong！我是您的 ESG
                      智能助教。今天想深入了解哪方面的永續知識？我可以協助您查詢 ISO 14064-1
                      或是導覽 5T 證據佐證庫。
                    </div>
                  </div>
                </div>

                {/* User Message */}
                <div className="flex items-start gap-8 flex-row-reverse">
                  <div className="size-14 rounded-2xl bg-white/5 border border-white/10 p-1 shrink-0">
                    <div className="w-full h-full rounded-xl bg-slate-800" />
                  </div>
                  <div className="space-y-3 max-w-[85%] text-right">
                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest italic mr-2">
                      DingJun Hong
                    </p>
                    <div className="bg-[#3df5e6] text-[#050c0b] rounded-[2.5rem] rounded-tr-none p-8 text-sm font-black italic tracking-tight leading-relaxed shadow-2xl shadow-[#3df5e6]/10">
                      請幫我分析範疇一排放的查證要求，並連結相關的實戰案例。
                    </div>
                  </div>
                </div>

                {/* AI Insight Message */}
                <div className="flex items-start gap-8">
                  <div className="size-14 rounded-2xl bg-[#3df5e6]/10 border border-[#3df5e6]/30 flex items-center justify-center text-[#3df5e6] shrink-0 shadow-lg">
                    <span className="material-symbols-outlined text-[32px]">smart_toy</span>
                  </div>
                  <div className="space-y-3 max-w-[85%]">
                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest italic ml-2">
                      ESG AI Tutor Analysis
                    </p>
                    <div className="bg-white/5 border border-white/10 rounded-[2.5rem] rounded-tl-none p-10 space-y-6">
                      <p className="text-sm italic leading-relaxed text-white/90">
                        根據 <strong>ISO 14064-1:2018</strong>
                        ，範疇一（直接溫室氣體排放）的查證核心在於排放源的完整性。我已經為您整理了三個關鍵「知識晶體」：
                      </p>
                      <div className="space-y-4">
                        {[
                          '溫室氣體排放清冊編制規範',
                          '逸散排放源的量化不確定性分析',
                          '5T 證據：廠區電費單與冷媒填充記錄',
                        ].map((item, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-4 text-sm font-black text-[#3df5e6] italic group cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-[20px] group-hover:scale-125 transition-transform">
                              check_circle
                            </span>
                            <span className="hover:underline">{item}</span>
                          </div>
                        ))}
                      </div>
                      <p className="text-[10px] text-[#3df5e6] font-black italic tracking-widest pt-4 border-t border-white/5 uppercase">
                        點擊右側知識板塊以展開詳細實戰案例。
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Input Area */}
              <div className="p-10 pt-6">
                <div className="relative bg-[#050c0b] border-2 border-[#3df5e6]/20 rounded-[2.5rem] p-3 flex items-center gap-4 group focus-within:border-[#3df5e6] transition-all">
                  <button className="size-12 rounded-full hover:bg-white/5 text-slate-500 hover:text-[#3df5e6] transition-all">
                    <span className="material-symbols-outlined text-[24px]">add_circle</span>
                  </button>
                  <input
                    type="text"
                    placeholder="詢問關於 ESG 報告、ISO 標準 or 數據佐證..."
                    className="flex-1 bg-transparent border-none outline-none text-sm font-black italic tracking-tight placeholder-slate-700 text-white"
                  />
                  <div className="flex items-center gap-3">
                    <button className="size-12 rounded-full hover:bg-white/5 text-slate-500 hover:text-[#3df5e6] transition-all">
                      <span className="material-symbols-outlined text-[24px]">mic</span>
                    </button>
                    <button className="size-12 bg-[#3df5e6] text-[#050c0b] rounded-full shadow-xl shadow-[#3df5e6]/30 flex items-center justify-center active:scale-90 transition-all">
                      <span className="material-symbols-outlined text-[24px] font-black">send</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Knowledge Crystals Side Panel */}
            <div className="w-full md:w-[400px] space-y-10 overflow-y-auto custom-scrollbar pr-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-black italic tracking-tighter uppercase flex items-center gap-4">
                  <span className="material-symbols-outlined text-[#3df5e6]">diamond</span>
                  關聯知識晶體
                </h3>
                <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest italic">
                  找到 12 個關聯點
                </span>
              </div>

              <div className="space-y-6">
                {[
                  {
                    t: '範疇1：排放邊界界定',
                    d: '定義組織邊界與營運邊界，是所有碳盤查的第一步。需包含所有設施之直接排放。',
                    tag: 'ISO 14064-1',
                  },
                  {
                    t: '高科技製造業盤查範例',
                    d: '某半導體廠如何透過 IoT 系統自動收集鍋爐、備用發電機之即時油耗數據。',
                    tag: '實戰案例',
                  },
                  {
                    t: '年度能源使用清冊',
                    d: '結構化呈現電力、天然氣與移動源燃料之原始憑證對照表。',
                    tag: '5T 證據庫',
                  },
                ].map((crystal, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ x: 10 }}
                    className={`p-8 bg-white/5 border border-white/10 rounded-[2.5rem] border-l-4 group cursor-pointer hover:border-[#3df5e6]/40 transition-all ${i === 0 ? 'border-l-[#3df5e6] shadow-[0_0_40px_rgba(61,245,230,0.15)]' : 'border-l-slate-700'}`}
                  >
                    <div className="flex justify-between items-start mb-6">
                      <span
                        className={`text-[9px] font-black px-3 py-1 rounded-full uppercase italic ${i === 0 ? 'bg-[#3df5e6]/20 text-[#3df5e6]' : 'bg-slate-800 text-slate-500'}`}
                      >
                        {crystal.tag}
                      </span>
                      <span className="material-symbols-outlined text-slate-700 group-hover:text-[#3df5e6] transition-colors">
                        open_in_new
                      </span>
                    </div>
                    <h4 className="text-lg font-black italic tracking-tighter mb-4 transition-colors group-hover:text-[#3df5e6] uppercase">
                      {crystal.t}
                    </h4>
                    <p className="text-xs text-slate-500 leading-relaxed italic mb-6">
                      {crystal.d}
                    </p>
                    <div className="flex items-center gap-4">
                      <div className="flex -space-x-3">
                        <div className="size-8 rounded-full border-2 border-[#050c0b] bg-slate-800 text-[8px] flex items-center justify-center font-black italic">
                          5T
                        </div>
                        <div className="size-8 rounded-full border-2 border-[#050c0b] bg-[#3df5e6] text-[#050c0b] text-[8px] flex items-center justify-center font-black italic">
                          REF
                        </div>
                      </div>
                      <span className="text-[10px] text-slate-600 font-black italic tracking-widest uppercase">
                        3 個佐證來源
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>

      <style>{`
                .shadow-3xl { box-shadow: 0 50px 100px -20px rgba(0, 0, 0, 0.7), 0 30px 60px -30px rgba(0, 242, 223, 0.05); }
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(61, 245, 230, 0.2); border-radius: 10px; }
            `}</style>
    </div>
  );
};
