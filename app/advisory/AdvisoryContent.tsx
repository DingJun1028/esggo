'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, 
  SendHorizontal, 
  Sparkles, 
  User, 
  Bot, 
  Zap, 
  ShieldCheck, 
  BrainCircuit,
  RefreshCcw,
  ChevronRight
} from 'lucide-react';
import { personas, Persona } from '@/lib/advisory-data';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function AdvisoryContent() {
  const [activePersona, setActivePersona] = useState<Persona>(personas[0]);
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'assistant', content: '您好，我是您的 ESG 諮詢助手。請問今天有什麼我可以協助您的？', timestamp: new Date() }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // 模擬 AI 回覆
    setTimeout(() => {
      const aiMsg: Message = { 
        id: (Date.now() + 1).toString(), 
        role: 'assistant', 
        content: `基於 ${activePersona.name} 的視角分析：針對您的問題「${input}」，建議優先查閱 GRI 302 \u80fd\u6e90\u63ed\u9732\u8981\u6c42\uff0c\u4e26\u7d50\u5408 5T \u5be6\u8b49\u5354\u8b70\u9032\u884c\u6578\u64da\u5c01\u5370\u3002`, 
        timestamp: new Date() 
      };
      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="h-[calc(100vh-160px)] flex gap-8 animate-in fade-in duration-700">
      {/* Persona Sidebar */}
      <aside className="w-80 flex flex-col gap-6">
        <div className="bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-sm">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 px-2">專家精神人格 Personas</h3>
          <div className="space-y-3">
            {personas.map((p) => (
              <button
                key={p.id}
                onClick={() => setActivePersona(p)}
                className={`w-full p-5 rounded-2xl transition-all text-left border relative overflow-hidden group ${
                  activePersona.id === p.id 
                    ? `bg-${p.color}-50 border-${p.color}-200 ring-2 ring-${p.color}-500/10` 
                    : 'bg-white border-slate-100 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-4 relative z-10">
                  <span className="text-2xl">{p.avatar}</span>
                  <div>
                    <p className={`text-xs font-black uppercase ${activePersona.id === p.id ? `text-${p.color}-600` : 'text-slate-400'}`}>{p.name}</p>
                    <p className="text-[10px] text-slate-500 font-medium leading-tight mt-0.5">{p.role}</p>
                  </div>
                </div>
                {activePersona.id === p.id && (
                   <motion.div layoutId="active" className={`absolute inset-0 bg-${p.color}-500/5`} />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white flex-1 relative overflow-hidden flex flex-col justify-between">
           <BrainCircuit size={100} className="absolute -right-10 -top-10 text-white/5" />
           <div className="relative z-10">
              <h4 className="font-black text-lg mb-2">人格特質描述</h4>
              <p className="text-xs text-slate-400 leading-relaxed font-medium">
                {activePersona.description}
              </p>
           </div>
           <div className="relative z-10 space-y-4">
              <div className="flex items-center gap-2 text-emerald-400">
                 <ShieldCheck size={16} />
                 <span className="text-[10px] font-black uppercase tracking-widest">5T AI Integrity Active</span>
              </div>
              <button className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">
                 匯出對話摘要
              </button>
           </div>
        </div>
      </aside>

      {/* Chat Area */}
      <main className="flex-1 bg-white rounded-[3rem] border border-slate-200 shadow-soft-xl flex flex-col overflow-hidden">
        <header className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
           <div className="flex items-center gap-4">
              <div className={`p-2 rounded-xl bg-slate-900 text-white`}>
                 <Bot size={20} />
              </div>
              <div>
                 <h2 className="font-black text-slate-900 uppercase">Expert Advisory Chat</h2>
                 <p className="text-[10px] text-slate-400 font-black uppercase tracking-tighter">Consulting with {activePersona.name}</p>
              </div>
           </div>
           <button className="p-3 hover:bg-white rounded-xl text-slate-400 hover:text-slate-900 transition-all">
              <RefreshCcw size={18} />
           </button>
        </header>

        <div ref={scrollRef} className="flex-1 overflow-y-auto p-10 space-y-8 custom-scrollbar">
           {messages.map((m) => (
             <motion.div 
               key={m.id}
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
             >
               <div className={`max-w-[80%] flex gap-4 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${
                    m.role === 'user' ? 'bg-slate-900 text-white' : `bg-${activePersona.color}-100 text-${activePersona.color}-600`
                  }`}>
                    {m.role === 'user' ? <User size={20} /> : <Bot size={20} />}
                  </div>
                  <div className={`p-6 rounded-[2rem] text-sm font-medium leading-relaxed ${
                    m.role === 'user' ? 'bg-slate-900 text-white rounded-tr-none' : 'bg-slate-50 text-slate-800 rounded-tl-none'
                  }`}>
                    {m.content}
                  </div>
               </div>
             </motion.div>
           ))}
           {isTyping && (
             <div className="flex justify-start">
                <div className="flex gap-4">
                   <div className={`w-10 h-10 rounded-2xl flex items-center justify-center bg-${activePersona.color}-50 text-${activePersona.color}-400`}>
                      <Bot size={20} />
                   </div>
                   <div className="bg-slate-50 px-6 py-4 rounded-[2rem] flex gap-1 items-center">
                      <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                      <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                      <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                   </div>
                </div>
             </div>
           )}
        </div>

        <footer className="p-8 bg-slate-50/50 border-t border-slate-100">
           <div className="relative group focus-within:scale-[1.01] transition-transform duration-500">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="輸入您的 ESG 諮詢問題... (Enter 發送)"
                className="w-full bg-white border border-slate-200 rounded-[2rem] px-8 py-5 text-sm font-bold shadow-sm outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/5 transition-all pr-32"
              />
              <button 
                onClick={handleSend}
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-slate-900 text-white p-3.5 rounded-full hover:bg-emerald-600 transition-all shadow-lg active:scale-90"
              >
                <SendHorizontal size={20} />
              </button>
           </div>
        </footer>
      </main>
    </div>
  );
}