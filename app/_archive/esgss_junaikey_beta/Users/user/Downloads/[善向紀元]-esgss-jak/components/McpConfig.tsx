
import React, { useState, useEffect } from 'react';
import { 
    Globe, Zap, Plus, Link, RefreshCw, Info, Radio, ExternalLink, 
    Github, Activity as ActivityIcon, Server, Shield, Lock, User,
    Terminal, Code, BookOpen, Key, Share2, Network, Settings,
    FileCode, List, CheckCircle2, ChevronRight, Search, Layers, Loader2, ShieldCheck
} from 'lucide-react';
import { Language, McpServer } from '../types';
import { UniversalPageHeader } from './UniversalPageHeader';
import { universalIntelligence } from '../services/evolutionEngine';
import { useToast } from '../contexts/ToastContext';

export const McpConfig: React.FC<{ language: Language }> = ({ language }) => {
  const isZh = language === 'zh-TW';
  const { addToast } = useToast();
  const [servers, setServers] = useState<McpServer[]>([]);
  const [activeTab, setActiveTab] = useState<'registry' | 'api-nexus'>('registry');
  
  // Form States
  const [newUrl, setNewUrl] = useState('');
  const [newName, setNewName] = useState('');
  const [newTransport, setNewTransport] = useState<'sse' | 'streamable_http'>('sse');
  const [newAuth, setNewAuth] = useState<'none' | 'oauth'>('none');

  const [isRefreshingProtocols, setIsRefreshingProtocols] = useState(false);
  const activeProtocols = [
      { id: 'esg-standard-v1', name: 'GRI_Core_Context', version: '1.2.4', type: 'SCHEMA' },
      { id: 'carbon-ledger-api', name: 'Scope3_Data_Bus', version: '2.0.1', type: 'RESOURCE' },
      { id: 'agent-identity-p', name: 'Neural_Identity_P', version: '1.0.0', type: 'IDENTITY' }
  ];

  useEffect(() => {
    const sub = universalIntelligence.mcpServers$.subscribe(setServers);
    return () => sub.unsubscribe();
  }, []);

  const handleAddServer = () => {
    if (!newUrl.trim() || !newName.trim()) {
        addToast('error', isZh ? '請輸入完整的伺服器資訊' : 'Please provide full server details', 'Validation');
        return;
    }
    
    const id = newName.toLowerCase().replace(/\s+/g, '-');
    universalIntelligence.addMcpServer({
        id,
        name: newName,
        url: newUrl,
        transport: newTransport,
        auth: newAuth,
        status: 'connecting',
        latency: 0,
        tools: []
    });
    
    setNewUrl('');
    setNewName('');
    addToast('info', isZh ? '正在建立 MCP 握手協定...' : 'Establishing MCP Handshake...', 'Nexus');
    
    setTimeout(() => {
        addToast('success', isZh ? 'MCP 節點已上線' : 'MCP Node Online', 'Registry');
    }, 2000);
  };

  const handleAuthorize = (id: string) => {
    addToast('info', isZh ? '啟動 OAuth 2.0 授權流程...' : 'Initiating OAuth 2.0 Auth...', 'Security');
    setTimeout(() => {
        addToast('success', isZh ? '授權成功！' : 'Authorization successful!', 'OAuth');
    }, 2000);
  };

  const handleSyncProtocols = () => {
      setIsRefreshingProtocols(true);
      addToast('info', isZh ? '同步全域內容協議...' : 'Syncing global context protocols...', 'Nexus');
      setTimeout(() => {
          setIsRefreshingProtocols(false);
          addToast('success', isZh ? '通訊協議同步完成' : 'Protocols synchronized', 'Registry');
      }, 1500);
  };

  return (
    <div className="h-full flex flex-col space-y-4 animate-fade-in overflow-hidden">
        <UniversalPageHeader 
            icon={Globe}
            title={{ zh: 'MCP 內容協議管理', en: 'MCP Context Protocol' }}
            description={{ zh: '管理模型內容協議：連結外部工具、資源與即時上下文', en: 'Managing Model Context Protocols: Linking tools, resources & real-time context.' }}
            language={language}
            tag={{ zh: '通訊內核 v1.0', en: 'MCP_NEXUS_V1.0' }}
        />

        <div className="flex bg-slate-900/50 p-1 rounded-xl border border-white/10 w-fit backdrop-blur-xl shrink-0">
            <button onClick={() => setActiveTab('registry')} className={`px-6 py-1.5 rounded-lg text-[10px] font-black transition-all ${activeTab === 'registry' ? 'bg-white text-black shadow-lg' : 'text-gray-500 hover:text-white'}`}>REGISTRY</button>
            <button onClick={() => setActiveTab('api-nexus')} className={`px-6 py-1.5 rounded-lg text-[10px] font-black transition-all ${activeTab === 'api-nexus' ? 'bg-emerald-500 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}>API_NEXUS</button>
        </div>

        <div className="flex-1 grid grid-cols-12 gap-4 min-h-0 overflow-hidden">
            {/* Left: Server Registration & Docs (4/12) */}
            <div className="col-span-12 lg:col-span-4 flex flex-col gap-4 overflow-hidden">
                <div className="glass-bento p-8 bg-slate-900/60 border-emerald-500/20 rounded-[2.5rem] shadow-2xl shrink-0">
                    <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-3">
                        <Plus className="w-5 h-5 text-emerald-500" />
                        {isZh ? '註冊新 MCP 伺服器' : 'Register New MCP'}
                    </h3>
                    <div className="space-y-5">
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Server Designation</label>
                            <input 
                                value={newName}
                                onChange={e => setNewName(e.target.value)}
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-[11px] text-white focus:ring-1 focus:ring-emerald-500 outline-none transition-all placeholder:text-gray-700"
                                placeholder="e.g. GitHub_Context"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Endpoint URL</label>
                            <input 
                                value={newUrl}
                                onChange={e => setNewUrl(e.target.value)}
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-[11px] text-white focus:ring-1 focus:ring-emerald-500 outline-none transition-all placeholder:text-gray-700"
                                placeholder="https://mcp.provider.com/sse"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Transport</label>
                                <select value={newTransport} onChange={e => setNewTransport(e.target.value as any)} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-[10px] text-white focus:ring-1 focus:ring-emerald-500 outline-none transition-all appearance-none cursor-pointer">
                                    <option value="sse">SSE</option>
                                    <option value="streamable_http">Direct HTTP</option>
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Authentication</label>
                                <select value={newAuth} onChange={e => setNewAuth(e.target.value as any)} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-[10px] text-white focus:ring-1 focus:ring-emerald-500 outline-none transition-all appearance-none cursor-pointer">
                                    <option value="none">None</option>
                                    <option value="oauth">OAuth 2.0</option>
                                </select>
                            </div>
                        </div>
                        <button onClick={handleAddServer} disabled={!newUrl || !newName} className="w-full py-4 bg-white text-black font-black rounded-2xl shadow-xl hover:bg-emerald-500 transition-all disabled:opacity-30 uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 active:scale-95">
                            <Link className="w-4 h-4" /> REGISTER_NEXUS_NODE
                        </button>
                    </div>
                </div>

                <div className="glass-bento p-8 flex-1 bg-slate-950 border-white/10 rounded-[2.5rem] shadow-xl overflow-hidden flex flex-col min-h-0">
                    <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-6 flex items-center gap-2"><BookOpen className="w-4 h-4" /> KNOWLEDGE_NEXUS</h4>
                    <div className="flex-1 overflow-y-auto no-scrollbar space-y-4 pr-2">
                        <div className="p-6 bg-white/5 border border-white/10 rounded-[2rem] space-y-4 group hover:bg-white/10 transition-all">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Github className="w-5 h-5 text-white" />
                                    <span className="text-xs font-black text-white uppercase tracking-widest">GitHub REST API</span>
                                </div>
                                <span className="text-[8px] font-black bg-white/20 text-white px-1.5 py-0.5 rounded">EXTERNAL</span>
                            </div>
                            <p className="text-[10px] text-gray-400 leading-relaxed italic">
                                Integration reference for the direct GitHub API connection via streamable_http.
                            </p>
                            <a href="https://docs.github.com/en/rest" target="_blank" rel="noopener noreferrer" className="w-full py-3 bg-white/5 hover:bg-white/10 text-white font-black rounded-xl text-[10px] flex items-center justify-center gap-2 border border-white/10 transition-all uppercase tracking-widest">
                                <ExternalLink className="w-3 h-3" /> API_REST_DOCS
                            </a>
                        </div>

                        <div className="p-6 bg-emerald-500/5 border border-emerald-500/20 rounded-[2rem] space-y-4 group hover:bg-emerald-500/10 transition-all">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Zap className="w-5 h-5 text-emerald-400" />
                                    <span className="text-xs font-black text-white uppercase tracking-widest">AgenticFlow API Docs</span>
                                </div>
                                <span className="text-[8px] font-black bg-emerald-500 text-black px-1.5 py-0.5 rounded">OFFICIAL</span>
                            </div>
                            <p className="text-[10px] text-gray-400 leading-relaxed italic">
                                Access the complete Technical Specification and integration guides for the AgenticFlow Kernel.
                            </p>
                            <a href="https://docs.agenticflow.ai/developers/api" target="_blank" rel="noopener noreferrer" className="w-full py-3 bg-white text-black font-black rounded-xl text-[10px] flex items-center justify-center gap-2 hover:bg-celestial-gold transition-all shadow-lg shadow-emerald-500/10 uppercase tracking-widest">
                                <ExternalLink className="w-3 h-3" /> Explore_API_Docs
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Area (8/12) */}
            <div className="col-span-12 lg:col-span-8 flex flex-col gap-4 overflow-hidden">
                {activeTab === 'registry' ? (
                    <div className="flex-1 glass-bento p-8 bg-slate-900/40 border-white/5 rounded-[3rem] shadow-2xl flex flex-col min-h-0 overflow-hidden">
                        <div className="flex justify-between items-center mb-8 shrink-0">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-white/5 rounded-2xl border border-white/10 text-emerald-400">
                                    <ActivityIcon className="w-6 h-6 animate-pulse" />
                                </div>
                                <div>
                                    <h3 className="zh-main text-2xl text-white uppercase tracking-tighter">Active_MCP_Registry</h3>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                        <span className="en-sub !text-[8px] text-emerald-500 font-black">SYNC_BUS_L1.0</span>
                                    </div>
                                </div>
                            </div>
                            <button className="p-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 text-gray-500 hover:text-white transition-all">
                                <RefreshCw className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto no-scrollbar space-y-6 pr-2">
                            {servers.map(server => (
                                <div key={server.id} className="p-8 bg-black/60 border border-white/5 rounded-[2.5rem] relative overflow-hidden group hover:border-emerald-500/30 transition-all">
                                    <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                                        <div className="flex gap-6 items-start">
                                            <div className={`p-4 rounded-2xl ${server.status === 'connected' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'} border border-white/5 shadow-inner`}>
                                                <Radio className={`w-8 h-8 ${server.status === 'connected' ? 'animate-pulse' : ''}`} />
                                            </div>
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-3">
                                                    <h4 className="zh-main text-2xl text-white">{server.name}</h4>
                                                    <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded border ${server.status === 'connected' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-amber-500/20 text-amber-400 border-amber-500/30'}`}>
                                                        {server.status.toUpperCase()}
                                                    </span>
                                                </div>
                                                <div className="text-xs text-gray-500 font-mono flex items-center gap-2"><Globe className="w-3 h-3" /> {server.url}</div>
                                                {server.documentationUrl && (
                                                    <a href={server.documentationUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-[9px] font-black text-gray-500 hover:text-emerald-400 transition-colors uppercase tracking-widest mt-2">
                                                        <ExternalLink className="w-2.5 h-2.5" /> Documentation_Source
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-6">
                                            {server.auth === 'oauth' && (
                                                <button onClick={() => handleAuthorize(server.id)} className="px-5 py-2.5 bg-blue-500 text-black font-black rounded-xl text-[10px] uppercase tracking-widest hover:bg-blue-400 transition-all flex items-center gap-2 shadow-xl shadow-blue-500/20">
                                                    <User className="w-3.5 h-3.5" /> Authorize_Nexus
                                                </button>
                                            )}
                                            <div className="flex gap-6 text-right">
                                                <div><div className="text-[10px] text-gray-600 font-black tracking-tighter">Latency</div><div className="text-xl font-mono font-bold text-white">{server.latency}ms</div></div>
                                                <div className="w-px h-10 bg-white/10" />
                                                <div><div className="text-[10px] text-gray-600 font-black tracking-tighter">Tools</div><div className="text-xl font-mono font-bold text-emerald-400">{server.tools.length}</div></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col gap-4 min-h-0 overflow-hidden animate-fade-in">
                        <div className="glass-bento p-10 bg-slate-900/60 border-emerald-500/20 rounded-[3.5rem] shadow-2xl relative overflow-hidden shrink-0">
                            <div className="absolute top-0 right-0 p-12 opacity-5"><Code className="w-64 h-64 text-emerald-400" /></div>
                            <div className="relative z-10">
                                <h3 className="zh-main text-3xl text-white uppercase tracking-tighter">Developer_API_Nexus</h3>
                                <p className="text-gray-400 mt-2 max-w-2xl leading-relaxed">Expose your AgenticFlow context to external clients or manage context protocols for synchronized cross-agent reasoning.</p>
                                <div className="mt-8 flex flex-wrap gap-4">
                                    <div className="p-4 bg-black/40 rounded-2xl border border-white/5 flex flex-col gap-1 min-w-[200px]">
                                        <span className="text-[9px] font-black text-gray-600 uppercase">Primary_Endpoint</span>
                                        <code className="text-xs text-emerald-500 font-mono">https://agenticflow.jak.ai/api/mcp/v1</code>
                                    </div>
                                    <div className="p-4 bg-black/40 rounded-2xl border border-white/5 flex flex-col gap-1 min-w-[200px]">
                                        <span className="text-[9px] font-black text-gray-600 uppercase">Auth_Status</span>
                                        <div className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
                                            <span className="text-xs text-white font-bold">256-BIT_SECURE</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 glass-bento p-10 bg-slate-950 border-white/10 rounded-[3.5rem] shadow-2xl flex flex-col min-h-0 overflow-hidden relative">
                            <div className="flex justify-between items-center mb-8 shrink-0">
                                <div className="flex items-center gap-4">
                                    <div className="p-2.5 bg-white/5 rounded-2xl text-celestial-gold"><Layers className="w-6 h-6" /></div>
                                    <h4 className="zh-main text-xl text-white uppercase tracking-widest">Active_Context_Protocols</h4>
                                </div>
                                <button 
                                    onClick={handleSyncProtocols}
                                    className="px-6 py-2.5 bg-white text-black font-black rounded-xl text-[10px] flex items-center gap-2 hover:bg-emerald-500 transition-all uppercase tracking-widest"
                                >
                                    {isRefreshingProtocols ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
                                    Refresh_Protocols
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto no-scrollbar space-y-4 pr-2">
                                {activeProtocols.map(proto => (
                                    <div key={proto.id} className="p-6 bg-black/60 border border-white/5 rounded-3xl hover:border-white/20 transition-all group flex items-center justify-between">
                                        <div className="flex items-center gap-6">
                                            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-gray-600 group-hover:text-celestial-gold transition-colors">
                                                <FileCode className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-3">
                                                    <span className="zh-main text-lg text-white group-hover:text-celestial-gold transition-colors">{proto.name}</span>
                                                    <span className="text-[9px] font-black px-2 py-0.5 rounded bg-white/5 text-gray-500 border border-white/5 uppercase">{proto.type}</span>
                                                </div>
                                                <div className="text-[10px] font-mono text-gray-600 mt-1">ID: {proto.id} • VERSION: {proto.version}</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <button className="p-3 bg-white/5 rounded-xl text-gray-500 hover:text-white transition-all" title="View Schema"><Code className="w-4 h-4" /></button>
                                            <button className="p-3 bg-white/5 rounded-xl text-gray-500 hover:text-white transition-all" title="Manage Protocol"><Settings className="w-4 h-4" /></button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-8 p-6 bg-white/5 rounded-[2.5rem] border border-white/10 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-emerald-500/20 rounded-xl text-emerald-400"><ShieldCheck className="w-5 h-5" /></div>
                                    <div className="text-xs text-gray-300 font-medium">Protocol synchronization integrity verified via Kernel A11 Dimension.</div>
                                </div>
                                <a href="https://docs.agenticflow.ai/developers/api" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[10px] font-black text-celestial-gold hover:underline uppercase tracking-widest">
                                    Learn_More <ChevronRight className="w-3 h-3" />
                                </a>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    </div>
  );
};
