/**
 * OmniSocialNexus.tsx
 * ----------------------------
 * 社交核心樞紐 - 全方位的社交與團隊管理介面
 * 
 * 核心理念：社交即教學，連結即成長
 * 設計哲學：便當盒式佈局，Aqua 青主題，5T 協議驗證
 */

import React, { useEffect, useState } from 'react';
import { useSocial } from '../../store/useSocial';
import { useOmniLegion } from '../../store/useOmniLegion';
import {
    Users,
    MessageSquare,
    Shield,
    Zap,
    Trophy,
    Activity,
    Search,
    UserPlus,
    Bot,
    Globe,
    Star,
    RefreshCcw,
    CheckCircle2,
    AlertCircle
} from 'lucide-react';

const OmniSocialNexus: React.FC = () => {
    const {
        friends,
        friendRequests,
        omniClaws,
        activityFeed,
        loading,
        fetchFriends,
        fetchOmniClaws,
        fetchActivityFeed,
        activateAgent,
        getSocialAdvice
    } = useSocial();

    const [activeTab, setActiveTab] = useState<'feed' | 'teams' | 'friends'>('teams');
    const [advice, setAdvice] = useState<string | null>(null);
    const [fetchingAdvice, setFetchingAdvice] = useState(false);

    useEffect(() => {
        // 模擬當前用戶 ID
        const currentUserId = 'user-1';
        fetchFriends(currentUserId);
        fetchOmniClaws();
        fetchActivityFeed();
    }, []);

    const handleGetAdvice = async () => {
        setFetchingAdvice(true);
        const result = await getSocialAdvice('user-1', '我想提升團隊的協作效率並增加 ESG 影響力。');
        setAdvice(result);
        setFetchingAdvice(false);
    };

    const getCategoryIcon = (category: string) => {
        switch (category) {
            case 'eco-warrior': return <Zap className="w-5 h-5 text-emerald-400" />;
            case 'governance-auditor': return <Shield className="w-5 h-5 text-blue-400" />;
            case 'social-impact': return <Users className="w-5 h-5 text-orange-400" />;
            default: return <Globe className="w-5 h-5 text-gray-400" />;
        }
    };

    const getCategoryName = (category: string) => {
        switch (category) {
            case 'eco-warrior': return '環境守護者';
            case 'governance-auditor': return '治理審核員';
            case 'social-impact': return '社會影響力導師';
            default: return '通用型';
        }
    };

    return (
        <div className="flex flex-col h-full bg-[#0a0f12] text-white p-6 overflow-hidden">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-[#63a6b0] to-[#ffd700] bg-clip-text text-transparent">
                        社交核心樞紐 (Omni-Social Nexus)
                    </h1>
                    <p className="text-gray-400 mt-1">上善若水，社交無界 — 連接全球 ESG 先鋒</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={handleGetAdvice}
                        disabled={fetchingAdvice}
                        className="flex items-center gap-2 px-4 py-2 bg-[#63a6b0]/20 border border-[#63a6b0]/50 rounded-lg hover:bg-[#63a6b0]/30 transition-all text-[#63a6b0]"
                    >
                        {fetchingAdvice ? <RefreshCcw className="w-4 h-4 animate-spin" /> : <Bot className="w-4 h-4" />}
                        獲取 AI 社交建議
                    </button>
                </div>
            </div>

            {advice && (
                <div className="mb-6 p-4 bg-[#63a6b0]/10 border border-[#63a6b0]/30 rounded-xl animate-in fade-in slide-in-from-top-4">
                    <div className="flex items-start gap-3">
                        <Bot className="w-6 h-6 text-[#ffd700] mt-1 shrink-0" />
                        <div>
                            <h3 className="text-[#ffd700] font-semibold mb-1">AI 社交助手建議：</h3>
                            <p className="text-sm text-gray-200 whitespace-pre-wrap">{advice}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Grid - Bento Box Layout */}
            <div className="grid grid-cols-12 gap-6 flex-1 min-h-0 overflow-hidden">

                {/* Left Sidebar - Navigation & Quick Stats */}
                <div className="col-span-3 flex flex-col gap-6 overflow-auto">
                    <div className="bg-[#151d21] border border-white/5 rounded-2xl p-4">
                        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 px-2">導覽中心</h2>
                        <nav className="space-y-1">
                            {[
                                { id: 'teams', label: '我的團隊 (OmniClaws)', icon: <Users className="w-5 h-5" /> },
                                { id: 'feed', label: '活動動態 (Activity)', icon: <Activity className="w-5 h-5" /> },
                                { id: 'friends', label: '好友列表 (Friends)', icon: <UserPlus className="w-5 h-5" /> },
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as any)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === tab.id
                                            ? 'bg-[#63a6b0] text-white shadow-lg shadow-[#63a6b0]/20'
                                            : 'text-gray-400 hover:bg-white/5'
                                        }`}
                                >
                                    {tab.icon}
                                    <span className="font-medium">{tab.label}</span>
                                </button>
                            ))}
                        </nav>
                    </div>

                    <div className="bg-[#151d21] border border-white/5 rounded-2xl p-4 flex-1">
                        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 px-2">快速統計</h2>
                        <div className="space-y-4 px-2">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-400 text-sm italic">總獲取 XP</span>
                                <span className="text-xl font-bold text-[#ffd700]">12,450</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-400 text-sm italic">團隊等級 (Avg)</span>
                                <span className="text-xl font-bold text-[#63a6b0]">Lv 8</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-400 text-sm italic">完成挑戰</span>
                                <span className="text-xl font-bold text-emerald-400">24</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Center Content - Main Workspace */}
                <div className="col-span-6 flex flex-col min-h-0">
                    <div className="bg-[#151d21] border border-white/10 rounded-3xl p-6 flex-1 flex flex-col min-h-0 shadow-2xl overflow-hidden">
                        {activeTab === 'teams' && (
                            <div className="flex flex-col h-full">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-xl font-bold flex items-center gap-2">
                                        <Users className="text-[#63a6b0]" /> 團隊管理
                                    </h2>
                                    <button className="text-xs px-3 py-1.5 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-colors">
                                        + 創建新團隊
                                    </button>
                                </div>

                                <div className="space-y-4 overflow-auto pr-2 custom-scrollbar">
                                    {loading && omniClaws.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center py-20 opacity-50">
                                            <RefreshCcw className="w-10 h-10 animate-spin mb-4" />
                                            <p>同步中...</p>
                                        </div>
                                    ) : (
                                        omniClaws.map((claw) => (
                                            <div key={claw.id} className="group bg-white/5 border border-white/5 rounded-2xl p-5 hover:border-[#63a6b0]/30 transition-all">
                                                <div className="flex justify-between items-start mb-4">
                                                    <div className="flex gap-4">
                                                        <div className="w-14 h-14 bg-gradient-to-br from-[#63a6b0]/20 to-[#63a6b0]/40 rounded-xl flex items-center justify-center border border-[#63a6b0]/30">
                                                            {getCategoryIcon(claw.category)}
                                                        </div>
                                                        <div>
                                                            <h3 className="font-bold text-lg">{claw.name}</h3>
                                                            <div className="flex items-center gap-2 text-xs">
                                                                <span className="text-[#63a6b0] font-medium">{getCategoryName(claw.category)}</span>
                                                                <span className="text-gray-500">•</span>
                                                                <span className="text-gray-400">{claw.members.length} 名成員</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col items-end">
                                                        <span className="text-xs text-gray-500 italic mb-1">團隊 XP</span>
                                                        <span className="text-lg font-bold text-[#ffd700]">{claw.totalXP}</span>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-2 gap-4 mb-5">
                                                    <div className="bg-black/20 rounded-lg p-2 text-center border border-white/5">
                                                        <div className="text-[10px] text-gray-500 uppercase mb-0.5 tracking-tighter">平均等級</div>
                                                        <div className="font-bold text-[#63a6b0]">Lv {claw.averageLevel.toFixed(1)}</div>
                                                    </div>
                                                    <div className="bg-black/20 rounded-lg p-2 text-center border border-white/5">
                                                        <div className="text-[10px] text-gray-500 uppercase mb-0.5 tracking-tighter">AI 狀態</div>
                                                        <div className={`font-bold flex items-center justify-center gap-1 ${claw.agentId ? 'text-emerald-400' : 'text-gray-500'}`}>
                                                            {claw.agentId ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                                                            {claw.agentStatus === 'active' ? '已激活' : '待激活'}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => activateAgent(claw.id)}
                                                        disabled={!!claw.agentId}
                                                        className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-2 ${claw.agentId
                                                                ? 'bg-emerald-500/10 text-emerald-500/80 cursor-default'
                                                                : 'bg-[#63a6b0] hover:bg-[#528d96] text-white shadow-lg shadow-[#63a6b0]/10'
                                                            }`}
                                                    >
                                                        <Bot className="w-4 h-4" />
                                                        {claw.agentId ? 'AI 代理運行中' : '激活團隊 AI 代理'}
                                                    </button>
                                                    <button className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors text-xs">
                                                        成員管理
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}

                        {activeTab === 'feed' && (
                            <div className="flex flex-col h-full">
                                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                                    <Activity className="text-[#ffd700]" /> 即時活動動態
                                </h2>
                                <div className="space-y-4 overflow-auto pr-2 custom-scrollbar">
                                    {activityFeed.map((item) => (
                                        <div key={item.id} className="flex gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#63a6b0] to-blue-500 flex items-center justify-center text-sm font-bold border border-white/10 shrink-0">
                                                {item.username[0]}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex justify-between items-start">
                                                    <span className="font-semibold text-gray-200">{item.username}</span>
                                                    <span className="text-[10px] text-gray-500">{new Date(item.timestamp).toLocaleTimeString()}</span>
                                                </div>
                                                <p className="text-sm font-bold text-[#63a6b0] my-0.5">{item.title}</p>
                                                <p className="text-xs text-gray-400 leading-relaxed">{item.description}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'friends' && (
                            <div className="flex flex-col h-full">
                                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                                    <UserPlus className="text-[#63a6b0]" /> 好友與連結
                                </h2>
                                <div className="grid grid-cols-2 gap-4">
                                    {friends.map((friend) => (
                                        <div key={friend.userId} className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-4 hover:bg-white/10 transition-all cursor-pointer">
                                            <div className="relative">
                                                <div className="w-12 h-12 rounded-xl bg-gray-700 flex items-center justify-center">
                                                    {friend.username[0]}
                                                </div>
                                                <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-[#151d21] ${friend.status === 'online' ? 'bg-emerald-500' : 'bg-gray-500'}`} />
                                            </div>
                                            <div>
                                                <div className="font-bold">{friend.username}</div>
                                                <div className="text-[10px] text-gray-400 flex items-center gap-1">
                                                    <Star className="w-2.5 h-2.5 text-[#ffd700] fill-[#ffd700]" />
                                                    Lv {friend.level} • {friend.title}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Sidebar - Leaderboard & Potential Partners */}
                <div className="col-span-3 flex flex-col gap-6 overflow-auto">
                    <div className="bg-[#151d21] border border-white/5 rounded-2xl p-4 shadow-xl">
                        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 px-2 flex items-center gap-2">
                            <Trophy className="w-4 h-4 text-[#ffd700]" /> 全球影響力榜
                        </h2>
                        <div className="space-y-3">
                            {[
                                { rank: 1, name: '綠色和平小組', impact: 98, color: '#ffd700' },
                                { rank: 2, name: '再生能源先鋒', impact: 92, color: '#c0c0c0' },
                                { rank: 3, name: '永續供應鏈', impact: 89, color: '#cd7f32' },
                            ].map((entry) => (
                                <div key={entry.rank} className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-all">
                                    <div className="w-6 text-center font-bold" style={{ color: entry.color }}>#{entry.rank}</div>
                                    <div className="flex-1 text-sm font-medium">{entry.name}</div>
                                    <div className="text-xs font-bold text-[#63a6b0]">{entry.impact}%</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-[#151d21] border border-white/5 rounded-2xl p-4 flex-1 shadow-xl">
                        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 px-2 flex items-center gap-2">
                            <MessageSquare className="w-4 h-4 text-[#63a6b0]" /> 探索建議連結
                        </h2>
                        <div className="space-y-4">
                            {[
                                { name: 'Dr. Thoth', desc: 'ESG 智慧顧問', type: 'Expert' },
                                { name: '山衛科技', desc: '可靠度數據夥伴', type: 'Partner' },
                                { name: '全人評測', desc: '職能分析專家', type: 'Partner' },
                            ].map((p) => (
                                <div key={p.name} className="p-3 rounded-xl bg-white/5 border border-white/10 hover:border-[#63a6b0]/50 transition-all">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="font-bold text-sm">{p.name}</span>
                                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#63a6b0]/20 text-[#63a6b0] border border-[#63a6b0]/30">{p.type}</span>
                                    </div>
                                    <p className="text-[10px] text-gray-500">{p.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OmniSocialNexus;
