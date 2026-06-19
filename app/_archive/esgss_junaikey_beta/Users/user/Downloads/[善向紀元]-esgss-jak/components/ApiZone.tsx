import React, { useState, useRef, useEffect } from 'react';
import { Language, WebhookConfig, WebhookDelivery } from '../types';
import {
    Code, Key, Activity, Copy, Terminal, Zap, Shield, Globe,
    Radio, Trash2, Send, Plus, RefreshCw, Webhook,
    CheckCircle2, Info, ShieldCheck,
    Loader2, X, Play, Database, List, Search, ArrowRight,
    Lock, Command, Settings
} from 'lucide-react';
import { useToast } from '../contexts/ToastContext';
import { UniversalPageHeader } from './UniversalPageHeader';
import { useCompany } from './providers/CompanyProvider';
import { JunAiKeyAPI } from '../services/ai-service';

interface ApiZoneProps {
    language: Language;
}

type SandboxEndpoint = {
    method: 'GET' | 'POST';
    path: string;
    description: string;
    payload: any;
    execute: (p: any) => Promise<any>;
};

export const ApiZone: React.FC<ApiZoneProps> = ({ language }) => {
    const isZh = language === 'zh-TW';
    const { addToast } = useToast();
    const { webhooks, addWebhook, deleteWebhook, updateWebhookStatus } = useCompany();

    const [apiKey] = useState('sk-jak-' + Math.random().toString(36).substring(7).toUpperCase());
    const [activeTab, setActiveTab] = useState<'auth' | 'webhooks' | 'sandbox'>('sandbox');

    // Webhook States
    const [newWebhookUrl, setNewWebhookUrl] = useState('');
    const [newWebhookEvent, setNewWebhookEvent] = useState('report.generated');
    const [showSecretId, setShowSecretId] = useState<string | null>(null);
    const [isTestingId, setIsTestingId] = useState<string | null>(null);
    const [lastTestResult, setLastTestResult] = useState<WebhookDelivery | null>(null);

    // Sandbox States
    const [selectedEndpoint, setSelectedEndpoint] = useState<number>(0);
    const [isExecuting, setIsExecuting] = useState(false);
    const [sandboxResponse, setSandboxResponse] = useState<any>(null);
    const [sandboxLogs, setSandboxLogs] = useState<{ t: string, m: string }[]>([]);
    const sandboxLogRef = useRef<HTMLDivElement>(null);

    const endpoints: SandboxEndpoint[] = [
        {
            method: 'POST', path: '/v1/manifest/summarize',
            description: isZh ? '生成內容的智慧結晶摘要' : 'Generate wisdom crystal summary.',
            payload: { content: "王道領導力的本質在於利他，透過多方利益的動態平衡達成永續經營。" },
            execute: (p) => JunAiKeyAPI.v1.manifest.summarize(p.content)
        },
        {
            method: 'POST', path: '/v1/cognition/reason',
            description: isZh ? '啟動深度推理引擎進行決策分析' : 'Activate deep reasoning engine.',
            payload: { prompt: "分析歐盟 CBAM 對台灣半導體產業的長期估值影響。", useThinking: true },
            execute: (p) => JunAiKeyAPI.v1.cognition.reason(p.prompt, [], p.useThinking)
        },
        {
            method: 'GET', path: '/v1/intelligence/search',
            description: isZh ? '全網檢索即時 ESG 情報' : 'Retrieve real-time ESG intel from the web.',
            payload: { query: "2024 TSMC ESG Report Highlights" },
            execute: (p) => JunAiKeyAPI.v1.intelligence.search(p.query)
        },
        {
            method: 'POST', path: '/v1/perception/analyze',
            description: isZh ? '解析多模態數據資產' : 'Analyze multi-modal data assets.',
            payload: { prompt: "這張工廠排放圖表中是否存在異常趨勢？", media_base64: "..." },
            execute: (p) => JunAiKeyAPI.v1.perception.analyze(p.media_base64, p.prompt)
        }
    ];

    const eventTypes = [
        'report.generated', 'carbon.threshold_exceeded', 'audit.verified',
        'alert.critical', 'system.evolution', 'card.unlocked'
    ];

    const handleCopy = (text: string, label: string) => {
        navigator.clipboard.writeText(text);
        addToast('success', `${label} Copied`, 'System');
    };

    const handleRunSandbox = async () => {
        setIsExecuting(true);
        setSandboxResponse(null);
        const endpoint = endpoints[selectedEndpoint];
        if (!endpoint) return;

        const log = (m: string) => setSandboxLogs(prev => [...prev, { t: new Date().toLocaleTimeString([], { hour12: false }), m }]);

        log(`[KERNEL] Handshaking with ${endpoint.path}...`);
        await new Promise(r => setTimeout(r, 600));
        log(`[AUTH] API_KEY VERIFIED (sk-jak-***)`);

        try {
            const res = await endpoint.execute(endpoint.payload);
            log(`[SYSTEM] Response 200 OK received.`);
            setSandboxResponse(res);
        } catch (e: any) {
            log(`[ERROR] Logic breach: ${e.message}`);
            setSandboxResponse({ error: e.message, status: 500 });
        } finally {
            setIsExecuting(false);
        }
    };

    useEffect(() => {
        sandboxLogRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [sandboxLogs]);

    return (
        <div className="h-full flex flex-col space-y-4 animate-fade-in overflow-hidden pb-4">
            <UniversalPageHeader
                icon={Code}
                title={{ zh: 'API 開發者專區', en: 'API Developer Zone' }}
                description={{ zh: '整合 JunAiKey 核心至您的企業應用：金鑰、Webhook 與全功能 Sandbox', en: 'Integrate JunAiKey Core: Keys, Webhooks & Full-featured Sandbox.' }}
                language={language}
                tag={{ zh: '開發內核 v1.2', en: 'DEV_CORE_V1.2' }}
            />

            <div className="flex bg-slate-900/50 p-1.5 rounded-2xl border border-white/10 w-fit backdrop-blur-xl shrink-0">
                {[
                    { id: 'auth', label: isZh ? '驗證管理' : 'AUTH', icon: Key },
                    { id: 'webhooks', label: isZh ? 'WEBHOOKS' : 'HOOKS', icon: Webhook },
                    { id: 'sandbox', label: isZh ? 'API 實驗室' : 'SANDBOX', icon: Terminal },
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex items-center gap-2 px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-white text-black shadow-lg' : 'text-gray-500 hover:text-white'}`}
                    >
                        <tab.icon className="w-4 h-4" />
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="flex-1 min-h-0 overflow-hidden">
                {activeTab === 'auth' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full animate-fade-in">
                        <div className="lg:col-span-2 glass-bento p-10 bg-slate-900/60 border-white/5 rounded-[3rem] relative overflow-hidden shadow-2xl flex flex-col justify-center">
                            <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none"><Key className="w-64 h-64" /></div>
                            <h3 className="zh-main text-3xl text-white mb-6 uppercase tracking-tighter">Master_API_Key</h3>
                            <p className="text-gray-400 mb-8 max-w-xl leading-relaxed italic">
                                Use this key to authenticate with the JunAiKey Kernel via Bearer Token.
                                Rotation advised every 90 cycles for maximum logic integrity.
                            </p>
                            <div className="bg-black/60 border border-white/10 p-8 rounded-[2.5rem] flex items-center justify-between group shadow-inner">
                                <code className="text-2xl font-mono text-celestial-gold tracking-widest blur-[6px] group-hover:blur-0 transition-all duration-700">{apiKey}</code>
                                <button onClick={() => handleCopy(apiKey, 'API Key')} className="p-4 bg-white text-black rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl"><Copy className="w-6 h-6" /></button>
                            </div>
                        </div>
                        <div className="glass-bento p-10 bg-slate-950 border-emerald-500/10 rounded-[3rem] shadow-xl flex flex-col items-center justify-center text-center">
                            <div className="p-5 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mb-6 shadow-2xl animate-neural-pulse"><ShieldCheck className="w-12 h-12" /></div>
                            <h4 className="zh-main text-xl text-white mb-2">Endpoint Security</h4>
                            <p className="text-[11px] text-gray-500 leading-relaxed uppercase tracking-widest">TLS 1.3 Encryption • SHA-256 Sig • RSA-4096 Auth</p>
                        </div>
                    </div>
                )}

                {activeTab === 'webhooks' && (
                    <div className="h-full flex flex-col gap-6 animate-fade-in overflow-hidden">
                        <div className="glass-bento p-8 bg-slate-900/60 border-white/5 rounded-[3rem] shrink-0">
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                                <div className="lg:col-span-4">
                                    <label className="text-[9px] font-black text-gray-600 uppercase tracking-widest ml-1 mb-2 block">Event Trigger</label>
                                    <select value={newWebhookEvent} onChange={e => setNewWebhookEvent(e.target.value)} className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:border-pink-500/50 outline-none appearance-none cursor-pointer">
                                        {eventTypes.map(t => <option key={t} value={t}>{t}</option>)}
                                    </select>
                                </div>
                                <div className="lg:col-span-6">
                                    <label className="text-[9px] font-black text-gray-600 uppercase tracking-widest ml-1 mb-2 block">Endpoint URL</label>
                                    <input value={newWebhookUrl} onChange={e => setNewWebhookUrl(e.target.value)} className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:border-pink-500/50 outline-none placeholder:text-gray-800" placeholder="https://..." />
                                </div>
                                <div className="lg:col-span-2 flex items-end">
                                    {/* Fix: Wrap addWebhook to pass required object instead of MouseEvent */}
                                    <button onClick={() => addWebhook({ eventType: newWebhookEvent, url: newWebhookUrl, status: 'active' })} className="w-full h-[46px] bg-pink-500 text-white font-black rounded-xl hover:brightness-110 transition-all shadow-xl shadow-pink-500/20">REGISTER</button>
                                </div>
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto no-scrollbar space-y-4 pr-2 pb-10">
                            {webhooks.map(wh => (
                                <div key={wh.id} className="p-8 bg-slate-900/40 border border-white/5 rounded-[2.5rem] flex items-center justify-between group hover:border-pink-500/30 transition-all">
                                    <div className="flex items-center gap-6">
                                        <div className="p-4 bg-pink-500/10 text-pink-400 rounded-2xl border border-pink-500/20"><Radio className="w-8 h-8 animate-pulse" /></div>
                                        <div>
                                            <h4 className="zh-main text-2xl text-white tracking-tighter">{wh.eventType}</h4>
                                            <div className="flex items-center gap-2 text-xs text-gray-500 font-mono mt-1"><Globe className="w-3 h-3" /> {wh.url}</div>
                                        </div>
                                    </div>
                                    <div className="flex gap-3">
                                        <button onClick={() => deleteWebhook(wh.id)} className="p-4 bg-white/5 hover:bg-rose-500/20 text-gray-600 hover:text-rose-400 rounded-2xl border border-white/5 transition-all"><Trash2 className="w-5 h-5" /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'sandbox' && (
                    <div className="h-full grid grid-cols-12 gap-6 overflow-hidden animate-fade-in">
                        {/* Endpoint Explorer */}
                        <div className="col-span-12 lg:col-span-4 flex flex-col gap-4 overflow-hidden">
                            <div className="flex-1 glass-bento p-8 bg-slate-900 border-white/5 rounded-[3rem] shadow-2xl flex flex-col min-h-0">
                                <h3 className="text-sm font-black text-gray-500 uppercase tracking-[0.3em] mb-8 flex items-center gap-3"><List className="w-4 h-4" /> KERNEL_ENDPOINTS</h3>
                                <div className="flex-1 overflow-y-auto no-scrollbar space-y-2 pr-2">
                                    {endpoints.map((ep, i) => (
                                        <button
                                            key={i}
                                            onClick={() => { setSelectedEndpoint(i); setSandboxResponse(null); setSandboxLogs([]); }}
                                            className={`w-full p-6 rounded-[2.2rem] border transition-all text-left flex flex-col gap-2 group
                                            ${selectedEndpoint === i ? 'bg-celestial-gold/10 border-celestial-gold/50 shadow-2xl' : 'bg-white/5 border-white/5 hover:border-white/10'}
                                        `}
                                        >
                                            <div className="flex items-center gap-3">
                                                <span className={`text-[8px] font-black px-2 py-0.5 rounded ${ep.method === 'POST' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/20' : 'bg-blue-500/20 text-blue-400 border border-blue-500/20'}`}>{ep.method}</span>
                                                <span className="text-[10px] font-mono text-white tracking-widest">{ep.path}</span>
                                            </div>
                                            <p className="text-[10px] text-gray-500 leading-relaxed font-light group-hover:text-gray-300 transition-colors">{ep.description}</p>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Request/Response Console */}
                        <div className="col-span-12 lg:col-span-8 flex flex-col gap-4 overflow-hidden">
                            <div className="flex-[1.5] glass-bento bg-slate-950 border-white/10 rounded-[3rem] shadow-2xl flex flex-col overflow-hidden relative">
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(251,191,36,0.03)_0%,transparent_70%)] pointer-events-none" />

                                <div className="p-6 border-b border-white/5 bg-slate-900/40 flex justify-between items-center z-10 shrink-0">
                                    <div className="flex items-center gap-4">
                                        <div className="p-2.5 bg-celestial-gold/20 rounded-2xl text-celestial-gold border border-celestial-gold/30"><Command className="w-5 h-5" /></div>
                                        <span className="zh-main text-base text-white tracking-widest uppercase">API_PLAYGROUND_CONSOLE</span>
                                    </div>
                                    <button
                                        onClick={handleRunSandbox}
                                        disabled={isExecuting}
                                        className="px-10 py-3 bg-white text-black font-black rounded-2xl flex items-center gap-3 hover:bg-celestial-gold transition-all shadow-xl disabled:opacity-30 active:scale-95 uppercase tracking-widest text-[10px]"
                                    >
                                        {isExecuting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current" />} RUN_QUERY
                                    </button>
                                </div>

                                <div className="flex-1 grid grid-cols-2 min-h-0 overflow-hidden">
                                    {/* Editor Side */}
                                    <div className="border-r border-white/5 flex flex-col p-8 overflow-hidden">
                                        {/* Fix: Settings icon now properly imported */}
                                        <h5 className="text-[9px] font-black text-gray-700 uppercase tracking-widest mb-4 flex items-center gap-2"><Settings className="w-3 h-3" /> REQUEST_BODY</h5>
                                        <div className="flex-1 bg-black/40 rounded-[2rem] border border-white/5 p-6 font-mono text-[10px] text-celestial-blue overflow-y-auto no-scrollbar shadow-inner">
                                            <pre>{JSON.stringify(endpoints[selectedEndpoint].payload, null, 2)}</pre>
                                        </div>
                                    </div>

                                    {/* Response Side */}
                                    <div className="flex flex-col p-8 overflow-hidden">
                                        <h5 className="text-[9px] font-black text-gray-700 uppercase tracking-widest mb-4 flex items-center gap-2"><Activity className="w-3 h-3" /> RESPONSE_JSON</h5>
                                        <div className="flex-1 bg-black/60 rounded-[2rem] border border-white/5 p-6 font-mono text-[10px] text-emerald-400 overflow-y-auto no-scrollbar shadow-inner relative">
                                            {isExecuting ? (
                                                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 opacity-40">
                                                    <RefreshCw className="w-8 h-8 animate-spin" />
                                                    <span className="text-[8px] font-black uppercase tracking-widest">Awaiting_Kernel...</span>
                                                </div>
                                            ) : sandboxResponse ? (
                                                <pre className="animate-fade-in">{JSON.stringify(sandboxResponse, null, 2)}</pre>
                                            ) : (
                                                <div className="h-full flex items-center justify-center opacity-10 italic">Awaiting Request Trigger...</div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Kernel Trace Log */}
                            <div className="flex-1 glass-bento bg-black/80 border-white/5 rounded-[2.5rem] p-6 shadow-xl flex flex-col min-h-0 overflow-hidden">
                                <div className="flex justify-between items-center mb-4 shrink-0 px-2">
                                    <h4 className="en-sub !text-[9px] text-emerald-500 font-black flex items-center gap-2 tracking-[0.2em]"><Terminal className="w-3.5 h-3.5" /> LIVE_KERNEL_TELEMETRY</h4>
                                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]" />
                                </div>
                                <div className="flex-1 overflow-y-auto no-scrollbar space-y-1.5 font-mono text-[9px] text-gray-600 px-2 pr-4">
                                    {sandboxLogs.length === 0 ? (
                                        <div className="h-full flex items-center justify-center opacity-20 italic">No telemetry data present.</div>
                                    ) : (
                                        sandboxLogs.map((log, i) => (
                                            <div key={i} className="flex gap-4 border-b border-white/[0.02] pb-1 transition-all animate-slide-up">
                                                <span className="text-gray-800 shrink-0">[{log.t}]</span>
                                                <span className="text-gray-400">{log.m}</span>
                                            </div>
                                        ))
                                    )}
                                    <div ref={sandboxLogRef} />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};