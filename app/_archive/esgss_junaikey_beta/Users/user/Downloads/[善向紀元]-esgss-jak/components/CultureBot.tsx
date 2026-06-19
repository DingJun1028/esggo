import React, { useState, useEffect, useMemo } from 'react';
import { Language } from '../types';
import {
    Bot, Heart, MessageCircle, Users, Target, TrendingUp,
    Smile, Frown, Meh, Award, Send, Sparkles, Activity,
    BarChart3, Calendar, Clock, BookOpen, CheckCircle
} from 'lucide-react';
import { useCompany } from './providers/CompanyProvider';
import { UniversalPageHeader } from './UniversalPageHeader';

interface CultureTask {
    id: string;
    title: string;
    description: string;
    type: 'engagement' | 'wellness' | 'education' | 'social';
    difficulty: 'easy' | 'medium' | 'hard';
    xpReward: number;
    gwcReward: number;
    completed: boolean;
    participants: number;
    deadline: number;
    category: string;
}

interface SentimentData {
    department: string;
    score: number;
    trend: 'up' | 'down' | 'stable';
    lastUpdated: number;
}

const SAMPLE_TASKS: CultureTask[] = [
    {
        id: 'task-1',
        title: '分享ESG成功故事',
        description: '在團隊會議中分享一個個人ESG實踐的成功案例',
        type: 'engagement',
        difficulty: 'easy',
        xpReward: 100,
        gwcReward: 25,
        completed: false,
        participants: 12,
        deadline: Date.now() + 86400000 * 7, // 7 days
        category: '團隊建設'
    },
    {
        id: 'task-2',
        title: '永續午餐挑戰',
        description: '組織一次零浪費的部門午餐活動',
        type: 'wellness',
        difficulty: 'medium',
        xpReward: 200,
        gwcReward: 50,
        completed: false,
        participants: 8,
        deadline: Date.now() + 86400000 * 14,
        category: '健康生活'
    },
    {
        id: 'task-3',
        title: '氣候變遷教育工作坊',
        description: '主持一場關於氣候變遷的內部教育工作坊',
        type: 'education',
        difficulty: 'hard',
        xpReward: 300,
        gwcReward: 75,
        completed: true,
        participants: 25,
        deadline: Date.now() - 86400000, // Past deadline
        category: '知識分享'
    }
];

const SENTIMENT_DATA: SentimentData[] = [
    { department: '工程', score: 85, trend: 'up', lastUpdated: Date.now() - 3600000 },
    { department: '市場', score: 78, trend: 'stable', lastUpdated: Date.now() - 7200000 },
    { department: '財務', score: 92, trend: 'up', lastUpdated: Date.now() - 1800000 },
    { department: '人事', score: 88, trend: 'down', lastUpdated: Date.now() - 5400000 }
];

export const CultureBot: React.FC<{ language: Language }> = ({ language }) => {
    const isZh = language === 'zh-TW';
    const { goodwillBalance, updateGoodwillBalance, awardXp, addJournalEntry } = useCompany();

    const [tasks, setTasks] = useState<CultureTask[]>(SAMPLE_TASKS);
    const [selectedTask, setSelectedTask] = useState<CultureTask | null>(null);
    const [broadcastMessage, setBroadcastMessage] = useState('');
    const [isBroadcasting, setIsBroadcasting] = useState(false);
    const [sentimentData, setSentimentData] = useState<SentimentData[]>(SENTIMENT_DATA);

    // Calculate overall culture metrics
    const cultureMetrics = useMemo(() => {
        const totalTasks = tasks.length;
        const completedTasks = tasks.filter(t => t.completed).length;
        const avgSentiment = sentimentData.reduce((sum, dept) => sum + dept.score, 0) / sentimentData.length;
        const activeParticipants = tasks.reduce((sum, task) => sum + task.participants, 0);

        return {
            completionRate: Math.round((completedTasks / totalTasks) * 100),
            avgSentiment: Math.round(avgSentiment),
            activeParticipants,
            trendingUp: sentimentData.filter(d => d.trend === 'up').length
        };
    }, [tasks, sentimentData]);

    const getTaskIcon = (type: string) => {
        switch (type) {
            case 'engagement': return <Users className="w-4 h-4" />;
            case 'wellness': return <Heart className="w-4 h-4" />;
            case 'education': return <BookOpen className="w-4 h-4" />;
            case 'social': return <MessageCircle className="w-4 h-4" />;
            default: return <Target className="w-4 h-4" />;
        }
    };

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case 'easy': return 'text-emerald-400 border-emerald-500/30';
            case 'medium': return 'text-amber-400 border-amber-500/30';
            case 'hard': return 'text-rose-400 border-rose-500/30';
            default: return 'text-gray-400 border-gray-500/30';
        }
    };

    const getSentimentIcon = (score: number) => {
        if (score >= 80) return <Smile className="w-4 h-4 text-emerald-400" />;
        if (score >= 60) return <Meh className="w-4 h-4 text-amber-400" />;
        return <Frown className="w-4 h-4 text-rose-400" />;
    };

    const completeTask = (taskId: string) => {
        setTasks(prev => prev.map(task =>
            task.id === taskId
                ? { ...task, completed: true, participants: task.participants + 1 }
                : task
        ));

        const task = tasks.find(t => t.id === taskId);
        if (task) {
            awardXp(task.xpReward);
            updateGoodwillBalance(task.gwcReward);
            addJournalEntry(
                `完成文化任務: ${task.title}`,
                `獲得 ${task.xpReward} XP 和 ${task.gwcReward} GWC`,
                task.xpReward,
                'action',
                ['Culture', 'Task']
            );
        }
    };

    const sendBroadcast = async () => {
        if (!broadcastMessage.trim()) return;

        setIsBroadcasting(true);
        // Simulate broadcasting
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Update sentiment scores based on broadcast
        setSentimentData(prev => prev.map(dept => ({
            ...dept,
            score: Math.min(100, dept.score + Math.floor(Math.random() * 5) + 1),
            trend: 'up' as const,
            lastUpdated: Date.now()
        })));

        setBroadcastMessage('');
        awardXp(25);
        setIsBroadcasting(false);
    };

    const formatTimeLeft = (deadline: number) => {
        const hoursLeft = Math.floor((deadline - Date.now()) / (1000 * 60 * 60));
        if (hoursLeft < 24) return `${hoursLeft}h`;
        return `${Math.floor(hoursLeft / 24)}d`;
    };

    return (
        <div className="h-full flex flex-col min-h-0 overflow-hidden space-y-2">
            <div className="shrink-0 pb-1 border-b border-white/5">
                <UniversalPageHeader
                    icon={Bot}
                    title={{ zh: '企業文化 Bot (Culture Bot)', en: 'Culture Bot' }}
                    description={{ zh: '員工參與度分析與文化建設任務', en: 'Employee Engagement & Cultural Tasks.' }}
                    language={language}
                    tag={{ zh: '文化演算法 v1.9', en: 'CULTURE_v1.9' }}
                />
            </div>

            <div className="flex-1 grid grid-cols-12 gap-3 min-h-0 overflow-hidden">
                {/* 1. 文化健康指標 (3/12) */}
                <div className="col-span-12 lg:col-span-3 flex flex-col gap-3 min-h-0 overflow-hidden">
                    <div className="glass-bento p-4 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20 rounded-[2rem] text-center">
                        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                            <Heart className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-lg font-bold text-white mb-1">{isZh ? '文化健康度' : 'Culture Health'}</h3>
                        <div className="text-3xl font-mono font-black text-white mb-2">{cultureMetrics.avgSentiment}%</div>
                        <div className="text-sm text-gray-400">{isZh ? '員工滿意度' : 'Employee Satisfaction'}</div>
                    </div>

                    <div className="glass-bento p-4 bg-slate-900/60 border-white/10 rounded-[2rem] space-y-4">
                        <div className="flex items-center gap-2 text-sm font-bold text-white">
                            <BarChart3 className="w-4 h-4 text-purple-400" />
                            {isZh ? '參與指標' : 'Engagement Metrics'}
                        </div>

                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-400">{isZh ? '任務完成率' : 'Task Completion'}</span>
                                <span className="text-sm font-mono text-emerald-400">{cultureMetrics.completionRate}%</span>
                            </div>

                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-400">{isZh ? '活躍參與者' : 'Active Participants'}</span>
                                <span className="text-sm font-mono text-blue-400">{cultureMetrics.activeParticipants}</span>
                            </div>

                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-400">{isZh ? '上升趨勢部門' : 'Trending Up'}</span>
                                <span className="text-sm font-mono text-amber-400">{cultureMetrics.trendingUp}</span>
                            </div>
                        </div>
                    </div>

                    {/* 全域廣播 */}
                    <div className="glass-bento p-4 bg-slate-950 border-white/10 rounded-[2rem]">
                        <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                            <Send className="w-4 h-4 text-blue-400" />
                            {isZh ? '全域廣播' : 'Global Broadcast'}
                        </h4>

                        <textarea
                            value={broadcastMessage}
                            onChange={(e) => setBroadcastMessage(e.target.value)}
                            placeholder={isZh ? '輸入鼓勵訊息...' : 'Enter motivational message...'}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm resize-none focus:border-blue-500/50 focus:outline-none"
                            rows={3}
                        />

                        <button
                            onClick={sendBroadcast}
                            disabled={!broadcastMessage.trim() || isBroadcasting}
                            className="w-full mt-3 py-2 bg-blue-500 text-white font-bold text-sm rounded-xl hover:bg-blue-400 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                        >
                            {isBroadcasting ? <Activity className="w-4 h-4 animate-pulse" /> : <Send className="w-4 h-4" />}
                            {isBroadcasting ? (isZh ? '廣播中...' : 'Broadcasting...') : (isZh ? '發送廣播' : 'Send Broadcast')}
                        </button>
                    </div>
                </div>

                {/* 2. 部門士氣分析 (4/12) */}
                <div className="col-span-12 lg:col-span-4 flex flex-col gap-3 min-h-0 overflow-hidden">
                    <div className="glass-bento p-5 flex flex-col bg-slate-950 border-white/10 min-h-0 rounded-[2rem]">
                        <div className="flex justify-between items-center mb-6 shrink-0">
                            <h3 className="zh-main text-[11px] text-white uppercase flex items-center gap-2"><TrendingUp className="w-3.5 h-3.5 text-emerald-400" /> Department_Sentiment_Analysis</h3>
                        </div>

                        <div className="flex-1 space-y-3 overflow-auto">
                            {sentimentData.map(dept => (
                                <div key={dept.department} className="glass-bento p-4 rounded-2xl bg-slate-900/40 border border-white/10 hover:border-white/20 transition-all">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            {getSentimentIcon(dept.score)}
                                            <div>
                                                <h4 className="text-sm font-bold text-white">{dept.department}</h4>
                                                <div className="text-[10px] text-gray-500 uppercase font-black">
                                                    {new Date(dept.lastUpdated).toLocaleTimeString()}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-lg font-mono font-bold text-white">{dept.score}%</div>
                                            <div className={`text-[8px] uppercase font-black ${
                                                dept.trend === 'up' ? 'text-emerald-400' :
                                                dept.trend === 'down' ? 'text-rose-400' : 'text-gray-400'
                                            }`}>
                                                {dept.trend === 'up' ? '↗' : dept.trend === 'down' ? '↘' : '→'} {dept.trend}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Sentiment bar */}
                                    <div className="w-full bg-slate-800 rounded-full h-2">
                                        <div
                                            className={`h-2 rounded-full transition-all duration-500 ${
                                                dept.score >= 80 ? 'bg-emerald-500' :
                                                dept.score >= 60 ? 'bg-amber-500' : 'bg-rose-500'
                                            }`}
                                            style={{ width: `${dept.score}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 3. 文化任務管理 (5/12) */}
                <div className="col-span-12 lg:col-span-5 flex flex-col gap-3 min-h-0 overflow-hidden">
                    <div className="glass-bento p-5 flex flex-col bg-slate-900/60 border-white/10 min-h-0 rounded-[2rem]">
                        <div className="flex justify-between items-center mb-6 shrink-0">
                            <h3 className="zh-main text-[11px] text-white uppercase flex items-center gap-2"><Target className="w-3.5 h-3.5 text-amber-400" /> Culture_Engagement_Tasks</h3>
                        </div>

                        <div className="flex-1 space-y-3 overflow-auto">
                            {tasks.map(task => (
                                <div
                                    key={task.id}
                                    className={`glass-bento p-4 rounded-2xl border transition-all duration-300 hover:scale-[1.01] cursor-pointer group ${
                                        task.completed
                                            ? 'border-emerald-500/30 bg-emerald-500/5'
                                            : 'border-white/10 bg-slate-900/40'
                                    }`}
                                    onClick={() => setSelectedTask(task)}
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-start gap-3">
                                            <div className={`p-2 rounded-xl ${getDifficultyColor(task.difficulty)}`}>
                                                {getTaskIcon(task.type)}
                                            </div>
                                            <div className="flex-1">
                                                <h4 className={`text-sm font-bold transition-colors ${
                                                    task.completed ? 'text-emerald-300' : 'text-white group-hover:text-blue-300'
                                                }`}>
                                                    {task.title}
                                                </h4>
                                                <div className="text-[10px] text-gray-500 uppercase font-black mt-1">
                                                    {task.category} • {task.difficulty} • {task.participants} {isZh ? '參與者' : 'participants'}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            {task.completed ? (
                                                <CheckCircle className="w-5 h-5 text-emerald-400" />
                                            ) : (
                                                <div className="text-[10px] text-gray-500 uppercase font-black">
                                                    <Clock className="w-3 h-3 inline mr-1" />
                                                    {formatTimeLeft(task.deadline)}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <p className="text-[11px] text-gray-400 mb-3 line-clamp-2">{task.description}</p>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3 text-[10px] text-gray-500">
                                            <span>+{task.xpReward} XP</span>
                                            <span>+{task.gwcReward} GWC</span>
                                        </div>

                                        {!task.completed && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    completeTask(task.id);
                                                }}
                                                className="px-4 py-2 bg-emerald-500 text-white font-bold text-[10px] uppercase rounded-xl hover:bg-emerald-400 transition-all flex items-center gap-2"
                                            >
                                                <Award className="w-3 h-3" />
                                                {isZh ? '完成任務' : 'Complete'}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};