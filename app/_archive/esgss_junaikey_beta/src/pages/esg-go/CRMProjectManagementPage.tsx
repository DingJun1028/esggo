/**
 * 📊 CRM & Project Management Platform
 * 
 * CRM 客戶關係管理與專案任務管理平台
 * 
 * Core Features:
 * 1. CRM - 客戶管理 / 聯繫人追蹤 / 互動歷史 / 機會管理
 * 2. Project Management - 專案規劃 / 任務追蹤 / 進度管理 / 資源分配
 */

import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Users, Building2, Phone, Mail, Calendar, MapPin, DollarSign,
    Briefcase, Target, CheckSquare, Clock, AlertTriangle, TrendingUp,
    Plus, Search, Filter, Download, Upload, MoreVertical, ChevronRight,
    Edit3, Trash2, Eye, Send, MessageSquare, PhoneCall, Video,
    FileText, BarChart3, PieChart, Activity, Zap, Award, Star,
    Grid, List, Kanban, Calendar as CalendarIcon, Users as UsersIcon,
    Clock as ClockIcon, CheckCircle, XCircle, AlertOctagon, ArrowUpRight,
    ArrowDownRight, Minus, Link, ExternalLink, Copy, Share2, Printer,
    Milestone, Flag, Layers, Boxes, Brain, Sparkles, Lightbulb,
    RefreshCw, Save, Bell, Settings, HelpCircle, LogOut, User
} from 'lucide-react';

// ============================================
// Types & Interfaces
// ============================================

// CRM Types
interface Contact {
    id: string;
    name: string;
    title: string;
    company: string;
    email: string;
    phone: string;
    industry: string;
    segment: 'enterprise' | 'mid-market' | 'smb' | 'government';
    status: 'active' | 'inactive' | 'prospect' | 'churned';
    lastContact: string;
    nextFollowUp: string;
    esgInterest: string[];
    lifetimeValue: number;
    score: number;
    tags: string[];
    interactions: Interaction[];
}

interface Interaction {
    id: string;
    type: 'email' | 'call' | 'meeting' | 'demo' | 'event';
    date: string;
    summary: string;
    outcome: 'positive' | 'neutral' | 'negative';
    notes: string;
}

interface Opportunity {
    id: string;
    name: string;
    contactId: string;
    contactName: string;
    company: string;
    value: number;
    stage: 'lead' | 'qualified' | 'proposal' | 'negotiation' | 'closed-won' | 'closed-lost';
    probability: number;
    expectedClose: string;
    products: string[];
    competitor?: string;
    notes: string;
}

// Project Management Types
interface Project {
    id: string;
    name: string;
    description: string;
    status: 'planning' | 'active' | 'on-hold' | 'completed' | 'archived';
    priority: 'critical' | 'high' | 'medium' | 'low';
    progress: number;
    startDate: string;
    endDate: string;
    budget: number;
    spent: number;
    owner: string;
    team: string[];
    esgCategory: 'environmental' | 'social' | 'governance' | 'integration';
    milestones: Milestone[];
    tasks: Task[];
}

interface Milestone {
    id: string;
    name: string;
    dueDate: string;
    status: 'pending' | 'in-progress' | 'completed' | 'delayed';
    completionDate?: string;
}

interface Task {
    id: string;
    title: string;
    description: string;
    assignee: string;
    status: 'todo' | 'in-progress' | 'review' | 'completed';
    priority: 'critical' | 'high' | 'medium' | 'low';
    dueDate: string;
    estimatedHours: number;
    actualHours: number;
    dependencies: string[];
    subtasks: SubTask[];
    comments: Comment[];
}

interface SubTask {
    id: string;
    title: string;
    completed: boolean;
}

interface Comment {
    id: string;
    user: string;
    content: string;
    timestamp: string;
}

// ============================================
// Mock Data
// ============================================

const MOCK_CONTACTS: Contact[] = [
    {
        id: 'c-001',
        name: '張志明',
        title: '永續發展處 處長',
        company: '台積電製造股份有限公司',
        email: 'chihming@tsmc.com',
        phone: '+886-2-1234-5678',
        industry: '半導體',
        segment: 'enterprise',
        status: 'active',
        lastContact: '2024-01-15',
        nextFollowUp: '2024-02-01',
        esgInterest: ['碳中和', '再生能源', '供應鏈管理'],
        lifetimeValue: 5000000,
        score: 92,
        tags: ['VIP', '策略夥伴', '碳中和'],
        interactions: [
            { id: 'i-001', type: 'meeting', date: '2024-01-15', summary: '碳中和路徑討論', outcome: 'positive', notes: '對 SBTi 目標設定有高度興趣' },
            { id: 'i-002', type: 'email', date: '2024-01-10', summary: '發送技術方案', outcome: 'neutral', notes: '' }
        ]
    },
    {
        id: 'c-002',
        name: '李美華',
        title: 'CSR 經理',
        company: '鴻海精密工業股份有限公司',
        email: 'meihua@foxconn.com',
        phone: '+886-2-2345-6789',
        industry: '電子製造',
        segment: 'enterprise',
        status: 'active',
        lastContact: '2024-01-18',
        nextFollowUp: '2024-01-25',
        esgInterest: ['範疇三排放', '員工福利', '公司治理'],
        lifetimeValue: 3500000,
        score: 85,
        tags: ['重點客戶', '大型專案'],
        interactions: [
            { id: 'i-003', type: 'call', date: '2024-01-18', summary: '需求訪談', outcome: 'positive', notes: '預計 Q2 啟動專案' }
        ]
    },
    {
        id: 'c-003',
        name: '陳建國',
        title: 'ESG 專案負責人',
        company: '中信金控股份有限公司',
        email: 'jianguo@ctbc.com',
        phone: '+886-2-3456-7890',
        industry: '金融服務',
        segment: 'enterprise',
        status: 'active',
        lastContact: '2024-01-20',
        nextFollowUp: '2024-02-05',
        esgInterest: ['TCFD', '氣候風險', '綠色金融'],
        lifetimeValue: 2800000,
        score: 78,
        tags: ['金融業', '綠色金融'],
        interactions: []
    },
    {
        id: 'c-004',
        name: '王曉萍',
        title: '永續管理師',
        company: '聯華電子股份有限公司',
        email: 'xiaoping@umc.com',
        phone: '+886-3-456-7890',
        industry: '半導體',
        segment: 'enterprise',
        status: 'prospect',
        lastContact: '2024-01-12',
        nextFollowUp: '2024-01-28',
        esgInterest: ['ISO 14064', '碳盤查', '減排目標'],
        lifetimeValue: 1500000,
        score: 65,
        tags: ['新客戶', '碳盤查需求'],
        interactions: [
            { id: 'i-004', type: 'demo', date: '2024-01-12', summary: '產品展示', outcome: 'positive', notes: '表示有興趣進一步了解' }
        ]
    },
    {
        id: 'c-005',
        name: '劉德華',
        title: '董事長特助',
        company: '長榮航空股份有限公司',
        email: 'dehwa@evaair.com',
        phone: '+886-3-351-8000',
        industry: '航空運輸',
        segment: 'enterprise',
        status: 'inactive',
        lastContact: '2023-12-01',
        nextFollowUp: '',
        esgInterest: ['碳抵換', '永續航空燃料'],
        lifetimeValue: 800000,
        score: 45,
        tags: ['待激活', '季節性'],
        interactions: []
    }
];

const MOCK_OPPORTUNITIES: Opportunity[] = [
    {
        id: 'opp-001',
        name: '台積電碳中和輔導專案',
        contactId: 'c-001',
        contactName: '張志明',
        company: '台積電製造股份有限公司',
        value: 5000000,
        stage: 'proposal',
        probability: 60,
        expectedClose: '2024-03-31',
        products: ['碳盤查服務', 'SBTi 輔導', 'TCFD 揭露'],
        competitor: 'PwC',
        notes: '預算已通過，待提案說明'
    },
    {
        id: 'opp-002',
        name: '鴻海範疇三排放管理系統',
        contactId: 'c-002',
        contactName: '李美華',
        company: '鴻海精密工業股份有限公司',
        value: 3500000,
        stage: 'qualified',
        probability: 40,
        expectedClose: '2024-06-30',
        products: ['供應商管理平台', '排放追蹤系統'],
        notes: 'Q2 啟動，已完成需求訪談'
    },
    {
        id: 'opp-003',
        name: '中信金 TCFD 氣候風險評估',
        contactId: 'c-003',
        contactName: '陳建國',
        company: '中信金控股份有限公司',
        value: 2800000,
        stage: 'negotiation',
        probability: 75,
        expectedClose: '2024-02-28',
        products: ['氣候風險模型', '情境分析服務'],
        notes: '進入合約討論階段'
    },
    {
        id: 'opp-004',
        name: '聯電 ISO 14064 認證輔導',
        contactId: 'c-004',
        contactName: '王曉萍',
        company: '聯華電子股份有限公司',
        value: 1500000,
        stage: 'lead',
        probability: 20,
        expectedClose: '2024-04-30',
        products: ['ISO 14064 輔導', '碳盤查培訓'],
        notes: '待安排第二次提案'
    },
    {
        id: 'opp-005',
        name: '華碩永續報告書優化',
        contactId: 'c-006',
        contactName: '林怡君',
        company: '華碩電腦股份有限公司',
        value: 2200000,
        stage: 'proposal',
        probability: 50,
        expectedClose: '2024-03-15',
        products: ['報告書撰寫', 'GRI 對照'],
        notes: '待回覆提案修改意見'
    }
];

const MOCK_PROJECTS: Project[] = [
    {
        id: 'proj-001',
        name: '台積電碳中和路徑規劃專案',
        description: '協助台積電制定 2050 淨零排放路徑圖',
        status: 'active',
        priority: 'critical',
        progress: 65,
        startDate: '2024-01-01',
        endDate: '2024-06-30',
        budget: 5000000,
        spent: 3250000,
        owner: '張志明',
        team: ['永續顧問團隊', '技術支援組'],
        esgCategory: 'environmental',
        milestones: [
            { id: 'm-001', name: '碳排放盤查完成', dueDate: '2024-01-31', status: 'completed', completionDate: '2024-01-28' },
            { id: 'm-002', name: '減排目標設定', dueDate: '2024-02-28', status: 'in-progress' },
            { id: 'm-003', name: '路徑圖初稿', dueDate: '2024-04-30', status: 'pending' },
            { id: 'm-004', name: '方案驗證', dueDate: '2024-06-30', status: 'pending' }
        ],
        tasks: [
            { id: 't-001', title: '範疇一排放資料收集', description: '收集並驗證範疇一排放數據', assignee: '王專員', status: 'completed', priority: 'high', dueDate: '2024-01-15', estimatedHours: 40, actualHours: 38, dependencies: [], subtasks: [], comments: [] },
            { id: 't-002', title: '範疇二排放計算', description: '計算範疇二排放並建立基準', assignee: '李分析師', status: 'completed', priority: 'high', dueDate: '2024-01-20', estimatedHours: 60, actualHours: 55, dependencies: ['t-001'], subtasks: [], comments: [] },
            { id: 't-003', title: 'SBTi 目標對齊分析', description: '分析 SBTi 標準並提出目標建議', assignee: '陳經理', status: 'in-progress', priority: 'critical', dueDate: '2024-02-15', estimatedHours: 80, actualHours: 45, dependencies: ['t-002'], subtasks: [], comments: [] },
            { id: 't-004', title: '再生能源規劃', description: '評估再生能源選項與成本效益', assignee: '劉顧問', status: 'todo', priority: 'high', dueDate: '2024-02-28', estimatedHours: 100, actualHours: 0, dependencies: ['t-003'], subtasks: [], comments: [] }
        ]
    },
    {
        id: 'proj-002',
        name: '鴻海供應商 ESG 評估系統',
        description: '建置供應商 ESG 評估與管理平台',
        status: 'active',
        priority: 'high',
        progress: 35,
        startDate: '2024-02-01',
        endDate: '2024-08-31',
        budget: 3500000,
        spent: 1225000,
        owner: '李美華',
        team: ['系統開發組', '顧問團隊'],
        esgCategory: 'integration',
        milestones: [
            { id: 'm-005', name: '需求分析完成', dueDate: '2024-02-15', status: 'completed', completionDate: '2024-02-12' },
            { id: 'm-006', name: '系統設計', dueDate: '2024-03-31', status: 'in-progress' },
            { id: 'm-007', name: '開發完成', dueDate: '2024-06-30', status: 'pending' },
            { id: 'm-008', name: '上線測試', dueDate: '2024-08-31', status: 'pending' }
        ],
        tasks: [
            { id: 't-005', title: '供應商評估問卷設計', description: '設計 ESG 評估問卷與評分標準', assignee: '趙專員', status: 'completed', priority: 'high', dueDate: '2024-02-10', estimatedHours: 40, actualHours: 35, dependencies: [], subtasks: [], comments: [] },
            { id: 't-006', title: '系統架構規劃', description: '規劃系統架構與資料模型', assignee: '陳架構師', status: 'in-progress', priority: 'critical', dueDate: '2024-02-28', estimatedHours: 80, actualHours: 50, dependencies: [], subtasks: [], comments: [] },
            { id: 't-007', title: 'API 開發', description: '開發供應商資料 API', assignee: '林工程師', status: 'todo', priority: 'high', dueDate: '2024-04-15', estimatedHours: 120, actualHours: 0, dependencies: ['t-006'], subtasks: [], comments: [] }
        ]
    },
    {
        id: 'proj-003',
        name: '中信金 TCFD 氣候風險專案',
        description: '建立氣候相關財務揭露風險評估框架',
        status: 'active',
        priority: 'high',
        progress: 80,
        startDate: '2023-10-01',
        endDate: '2024-02-28',
        budget: 2800000,
        spent: 2240000,
        owner: '陳建國',
        team: ['風險分析組', '財務顧問'],
        esgCategory: 'governance',
        milestones: [
            { id: 'm-009', name: '氣候風險識別', dueDate: '2023-11-30', status: 'completed', completionDate: '2023-11-25' },
            { id: 'm-010', name: '情境分析', dueDate: '2024-01-15', status: 'completed', completionDate: '2024-01-12' },
            { id: 'm-011', name: '財務影響量化', dueDate: '2024-02-15', status: 'in-progress' },
            { id: 'm-012', name: '報告書撰寫', dueDate: '2024-02-28', status: 'pending' }
        ],
        tasks: [
            { id: 't-008', title: '實體風險評估', description: '評估氣候實體風險曝險', assignee: '吳分析師', status: 'completed', priority: 'high', dueDate: '2023-11-20', estimatedHours: 60, actualHours: 55, dependencies: [], subtasks: [], comments: [] },
            { id: 't-009', title: '轉型風險分析', description: '分析低碳轉型風險與機會', assignee: '鄭經理', status: 'completed', priority: 'high', dueDate: '2023-12-15', estimatedHours: 80, actualHours: 75, dependencies: [], subtasks: [], comments: [] },
            { id: 't-010', title: '情境模型建置', description: '建立 2°C/4°C 情境模型', assignee: '陳博士', status: 'in-progress', priority: 'critical', dueDate: '2024-01-31', estimatedHours: 120, actualHours: 100, dependencies: ['t-008', 't-009'], subtasks: [], comments: [] },
            { id: 't-011', title: '報告書草稿', description: '撰寫 TCFD 報告書草稿', assignee: '王作家', status: 'todo', priority: 'high', dueDate: '2024-02-20', estimatedHours: 60, actualHours: 0, dependencies: ['t-010'], subtasks: [], comments: [] }
        ]
    }
];

// ============================================
// Components
// ============================================

const StatusBadge: React.FC<{ status: string; type?: string }> = ({ status, type }) => {
    const colors: Record<string, string> = {
        // Contact Status
        active: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
        inactive: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
        prospect: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
        churned: 'bg-red-500/20 text-red-400 border-red-500/30',
        // Opportunity Stage
        lead: 'bg-slate-500/20 text-slate-400',
        qualified: 'bg-blue-500/20 text-blue-400',
        proposal: 'bg-amber-500/20 text-amber-400',
        negotiation: 'bg-purple-500/20 text-purple-400',
        'closed-won': 'bg-emerald-500/20 text-emerald-400',
        'closed-lost': 'bg-red-500/20 text-red-400',
        // Project Status
        planning: 'bg-slate-500/20 text-slate-400',
        'on-hold': 'bg-amber-500/20 text-amber-400',
        completed: 'bg-emerald-500/20 text-emerald-400',
        archived: 'bg-slate-700/20 text-slate-500',
        // Task Status
        todo: 'bg-slate-500/20 text-slate-400',
        'in-progress': 'bg-blue-500/20 text-blue-400',
        review: 'bg-amber-500/20 text-amber-400',
        // Milestone Status
        pending: 'bg-slate-500/20 text-slate-400',
        delayed: 'bg-red-500/20 text-red-400'
    };

    const labels: Record<string, string> = {
        active: '活躍',
        inactive: '非活躍',
        prospect: '潛在',
        churned: '流失',
        lead: '線索',
        qualified: '合格',
        proposal: '提案',
        negotiation: '談判',
        'closed-won:': '成交',
        'closed-lost': '失敗',
        planning: '規劃中',
        'on-hold': '暫停',
        completed: '完成',
        archived: '歸檔',
        todo: '待辦',
        'in-progress': '進行中',
        review: '審核中',
        pending: '待完成',
        delayed: '延遲'
    };

    return (
        <span className={`px-2 py-1 rounded-full text-xs font-bold border ${colors[status] || colors.active}`}>
            {labels[status] || status}
        </span>
    );
};

const PriorityBadge: React.FC<{ priority: string }> = ({ priority }) => {
    const colors: Record<string, string> = {
        critical: 'bg-red-500/20 text-red-400 border-red-500/30',
        high: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
        medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
        low: 'bg-green-500/20 text-green-400 border-green-500/30'
    };
    return (
        <span className={`px-2 py-1 rounded-full text-xs font-bold border ${colors[priority] || colors.medium}`}>
            {priority === 'critical' ? '緊急' : priority === 'high' ? '高' : priority === 'medium' ? '中' : '低'}
        </span>
    );
};

const ProgressBar: React.FC<{ value: number; color?: string }> = ({ value, color = 'from-[#63a6b0] to-cyan-400' }) => (
    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
        <div className={`h-full bg-gradient-to-r ${color} transition-all duration-500`} style={{ width: `${value}%` }} />
    </div>
);

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('zh-TW', { style: 'currency', currency: 'TWD', maximumFractionDigits: 0 }).format(value);
};

const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('zh-TW', { year: 'numeric', month: 'short', day: 'numeric' });
};

const daysUntil = (dateStr: string) => {
    const days = Math.ceil((new Date(dateStr).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return days;
};

// ============================================
// Main Component
// ============================================

const CRMProjectManagementPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'crm' | 'projects'>('crm');
    const [crmSubTab, setCrmSubTab] = useState<'contacts' | 'opportunities' | 'pipeline'>('contacts');
    const [projectView, setProjectView] = useState<'list' | 'kanban' | 'gantt'>('list');
    const [searchQuery, setSearchQuery] = useState('');
    const [showContactModal, setShowContactModal] = useState(false);
    const [showTaskModal, setShowTaskModal] = useState(false);

    // Filtered Contacts
    const filteredContacts = useMemo(() => {
        return MOCK_CONTACTS.filter(contact => 
            contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            contact.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
            contact.esgInterest.some(interest => interest.toLowerCase().includes(searchQuery.toLowerCase()))
        );
    }, [searchQuery]);

    // CRM Statistics
    const crmStats = useMemo(() => ({
        totalContacts: MOCK_CONTACTS.length,
        activeContacts: MOCK_CONTACTS.filter(c => c.status === 'active').length,
        totalPipeline: MOCK_OPPORTUNITIES.reduce((sum, opp) => sum + opp.value, 0),
        weightedPipeline: MOCK_OPPORTUNITIES.reduce((sum, opp) => sum + opp.value * opp.probability / 100, 0),
        avgScore: Math.round(MOCK_CONTACTS.reduce((sum, c) => sum + c.score, 0) / MOCK_CONTACTS.length)
    }), []);

    // Project Statistics
    const projectStats = useMemo(() => ({
        total: MOCK_PROJECTS.length,
        active: MOCK_PROJECTS.filter(p => p.status === 'active').length,
        totalBudget: MOCK_PROJECTS.reduce((sum, p) => sum + p.budget, 0),
        totalSpent: MOCK_PROJECTS.reduce((sum, p) => sum + p.spent, 0),
        avgProgress: Math.round(MOCK_PROJECTS.reduce((sum, p) => sum + p.progress, 0) / MOCK_PROJECTS.length)
    }), []);

    return (
        <div className="min-h-screen bg-[#0F172A] text-slate-100 font-sans">
            {/* Header */}
            <header className="bg-gradient-to-r from-[#0a1628] via-[#132744] to-[#0a1628] border-b border-white/5 sticky top-0 z-50 backdrop-blur-xl">
                <div className="max-w-[1600px] mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="size-12 rounded-xl bg-gradient-to-br from-[#63a6b0] to-cyan-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                                <Briefcase className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-black uppercase tracking-tight italic">
                                    CRM <span className="text-[#63a6b0]">&</span> Project
                                </h1>
                                <p className="text-xs text-slate-400 uppercase tracking-widest">客戶關係與專案管理平台</p>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl border border-white/10">
                                <Search className="w-4 h-4 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="搜尋..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="bg-transparent text-sm outline-none w-48"
                                />
                            </div>
                            <button className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all">
                                <Bell className="w-4 h-4" />
                            </button>
                            <button className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all">
                                <Settings className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Navigation Tabs */}
            <nav className="bg-[#0a1628]/50 border-b border-white/5 backdrop-blur-md">
                <div className="max-w-[1600px] mx-auto px-6">
                    <div className="flex gap-1">
                        <button
                            onClick={() => setActiveTab('crm')}
                            className={`flex items-center gap-2 px-6 py-4 text-sm font-bold uppercase tracking-wider transition-all border-b-2 -mb-px ${
                                activeTab === 'crm' 
                                    ? 'text-[#63a6b0] border-[#63a6b0] bg-[#63a6b0]/5' 
                                    : 'text-slate-400 border-transparent hover:text-slate-200'
                            }`}
                        >
                            <Users className="w-4 h-4" />
                            CRM 客戶管理
                        </button>
                        <button
                            onClick={() => setActiveTab('projects')}
                            className={`flex items-center gap-2 px-6 py-4 text-sm font-bold uppercase tracking-wider transition-all border-b-2 -mb-px ${
                                activeTab === 'projects' 
                                    ? 'text-[#63a6b0] border-[#63a6b0] bg-[#63a6b0]/5' 
                                    : 'text-slate-400 border-transparent hover:text-slate-200'
                            }`}
                        >
                            <Briefcase className="w-4 h-4" />
                            專案管理
                        </button>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="max-w-[1600px] mx-auto px-6 py-8">
                <AnimatePresence mode="wait">
                    {/* CRM Tab */}
                    {activeTab === 'crm' && (
                        <motion.div
                            key="crm"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-6"
                        >
                            {/* CRM Stats */}
                            <div className="grid grid-cols-5 gap-4">
                                {[
                                    { label: '總聯絡人', value: crmStats.totalContacts, icon: Users, color: 'from-blue-500 to-cyan-600' },
                                    { label: '活躍客戶', value: crmStats.activeContacts, icon: Activity, color: 'from-emerald-500 to-green-600' },
                                    { label: '商機總額', value: formatCurrency(crmStats.totalPipeline), icon: DollarSign, color: 'from-amber-500 to-orange-600' },
                                    { label: '加權商機', value: formatCurrency(crmStats.weightedPipeline), icon: TrendingUp, color: 'from-purple-500 to-indigo-600' },
                                    { label: '平均分數', value: `${crmStats.avgScore}分`, icon: Award, color: 'from-[#63a6b0] to-cyan-600' }
                                ].map((stat, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all"
                                    >
                                        <div className={`size-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-4`}>
                                            <stat.icon className="w-5 h-5 text-white" />
                                        </div>
                                        <div className="text-2xl font-black italic truncate">{stat.value}</div>
                                        <div className="text-xs text-slate-400 uppercase tracking-widest mt-1">{stat.label}</div>
                                    </motion.div>
                                ))}
                            </div>

                            {/* CRM Sub Tabs */}
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-1 p-1 bg-white/5 rounded-xl">
                                    {[
                                        { id: 'contacts', label: '聯絡人', icon: Users },
                                        { id: 'opportunities', label: '商機', icon: Target },
                                        { id: 'pipeline', label: '銷售漏斗', icon: Filter }
                                    ].map(tab => (
                                        <button
                                            key={tab.id}
                                            onClick={() => setCrmSubTab(tab.id as typeof crmSubTab)}
                                            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${
                                                crmSubTab === tab.id 
                                                    ? 'bg-[#63a6b0] text-white' 
                                                    : 'hover:bg-white/5'
                                            }`}
                                        >
                                            <tab.icon className="w-4 h-4" />
                                            {tab.label}
                                        </button>
                                    ))}
                                </div>
                                
                                <button 
                                    onClick={() => setShowContactModal(true)}
                                    className="ml-auto px-4 py-2 bg-[#63a6b0] hover:bg-[#528d96] rounded-xl text-sm font-bold flex items-center gap-2 transition-all"
                                >
                                    <Plus className="w-4 h-4" />
                                    新增聯絡人
                                </button>
                            </div>

                            {/* Contacts View */}
                            {crmSubTab === 'contacts' && (
                                <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden">
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead className="bg-white/5 border-b border-white/10">
                                                <tr>
                                                    <th className="text-left p-4 text-xs font-bold uppercase tracking-widest text-slate-400">聯絡人</th>
                                                    <th className="text-left p-4 text-xs font-bold uppercase tracking-widest text-slate-400">公司</th>
                                                    <th className="text-left p-4 text-xs font-bold uppercase tracking-widest text-slate-400">ESG 興趣</th>
                                                    <th className="text-left p-4 text-xs font-bold uppercase tracking-widest text-slate-400">狀態</th>
                                                    <th className="text-left p-4 text-xs font-bold uppercase tracking-widest text-slate-400">分數</th>
                                                    <th className="text-left p-4 text-xs font-bold uppercase tracking-widest text-slate-400">最後聯繫</th>
                                                    <th className="text-left p-4 text-xs font-bold uppercase tracking-widest text-slate-400">預期價值</th>
                                                    <th className="p-4"></th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-white/5">
                                                {filteredContacts.map((contact) => (
                                                    <tr key={contact.id} className="hover:bg-white/5 transition-all cursor-pointer group">
                                                        <td className="p-4">
                                                            <div className="flex items-center gap-3">
                                                                <div className="size-10 rounded-full bg-gradient-to-br from-[#63a6b0] to-cyan-600 flex items-center justify-center font-bold">
                                                                    {contact.name.charAt(0)}
                                                                </div>
                                                                <div>
                                                                    <div className="font-bold">{contact.name}</div>
                                                                    <div className="text-xs text-slate-400">{contact.title}</div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="p-4">
                                                            <div className="font-medium">{contact.company}</div>
                                                            <div className="text-xs text-slate-400">{contact.industry}</div>
                                                        </td>
                                                        <td className="p-4">
                                                            <div className="flex flex-wrap gap-1">
                                                                {contact.esgInterest.map((interest, i) => (
                                                                    <span key={i} className="px-2 py-1 bg-[#63a6b0]/20 text-[#63a6b0] rounded text-xs">
                                                                        {interest}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        </td>
                                                        <td className="p-4">
                                                            <StatusBadge status={contact.status} />
                                                        </td>
                                                        <td className="p-4">
                                                            <div className="flex items-center gap-2">
                                                                <div className="w-16 h-2 bg-white/10 rounded-full overflow-hidden">
                                                                    <div 
                                                                        className={`h-full ${contact.score >= 80 ? 'bg-emerald-500' : contact.score >= 60 ? 'bg-amber-500' : 'bg-red-500'}`}
                                                                        style={{ width: `${contact.score}%` }}
                                                                    />
                                                                </div>
                                                                <span className="text-sm font-bold">{contact.score}</span>
                                                            </div>
                                                        </td>
                                                        <td className="p-4 text-sm text-slate-400">
                                                            {formatDate(contact.lastContact)}
                                                        </td>
                                                        <td className="p-4 font-bold">
                                                            {formatCurrency(contact.lifetimeValue)}
                                                        </td>
                                                        <td className="p-4">
                                                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                                                                    <Eye className="w-4 h-4" />
                                                                </button>
                                                                <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                                                                    <Edit3 className="w-4 h-4" />
                                                                </button>
                                                                <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                                                                    <MessageSquare className="w-4 h-4" />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {/* Opportunities View */}
                            {crmSubTab === 'opportunities' && (
                                <div className="grid grid-cols-2 gap-6">
                                    {MOCK_OPPORTUNITIES.map((opp) => (
                                        <div key={opp.id} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all">
                                            <div className="flex items-start justify-between mb-4">
                                                <div>
                                                    <h3 className="font-bold text-lg">{opp.name}</h3>
                                                    <p className="text-sm text-slate-400">{opp.company}</p>
                                                </div>
                                                <StatusBadge status={opp.stage} />
                                            </div>
                                            
                                            <div className="grid grid-cols-3 gap-4 mb-4">
                                                <div>
                                                    <div className="text-xs text-slate-400 mb-1">金額</div>
                                                    <div className="font-bold text-lg">{formatCurrency(opp.value)}</div>
                                                </div>
                                                <div>
                                                    <div className="text-xs text-slate-400 mb-1">成交機率</div>
                                                    <div className="font-bold">{opp.probability}%</div>
                                                </div>
                                                <div>
                                                    <div className="text-xs text-slate-400 mb-1">預期關閉</div>
                                                    <div className={`font-bold ${daysUntil(opp.expectedClose) < 30 ? 'text-amber-400' : ''}`}>
                                                        {formatDate(opp.expectedClose)}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap gap-1 mb-4">
                                                {opp.products.map((product, i) => (
                                                    <span key={i} className="px-2 py-1 bg-white/10 rounded text-xs">
                                                        {product}
                                                    </span>
                                                ))}
                                            </div>

                                            <div className="flex items-center justify-between pt-4 border-t border-white/10">
                                                <div className="flex items-center gap-2 text-sm text-slate-400">
                                                    <Users className="w-4 h-4" />
                                                    {opp.contactName}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                                                        <Edit3 className="w-4 h-4" />
                                                    </button>
                                                    <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                                                        <ChevronRight className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Pipeline View */}
                            {crmSubTab === 'pipeline' && (
                                <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
                                    <h3 className="text-xl font-bold mb-8 flex items-center gap-2">
                                        <Filter className="text-[#63a6b0]" />
                                        銷售漏斗分析
                                    </h3>
                                    
                                    <div className="flex items-end gap-4 h-80">
                                        {[
                                            { stage: 'lead', label: '線索', count: MOCK_OPPORTUNITIES.filter(o => o.stage === 'lead').length, value: MOCK_OPPORTUNITIES.filter(o => o.stage === 'lead').reduce((s, o) => s + o.value, 0), width: '20%' },
                                            { stage: 'qualified', label: '合格', count: MOCK_OPPORTUNITIES.filter(o => o.stage === 'qualified').length, value: MOCK_OPPORTUNITIES.filter(o => o.stage === 'qualified').reduce((s, o) => s + o.value, 0), width: '35%' },
                                            { stage: 'proposal', label: '提案', count: MOCK_OPPORTUNITIES.filter(o => o.stage === 'proposal').length, value: MOCK_OPPORTUNITIES.filter(o => o.stage === 'proposal').reduce((s, o) => s + o.value, 0), width: '50%' },
                                            { stage: 'negotiation', label: '談判', count: MOCK_OPPORTUNITIES.filter(o => o.stage === 'negotiation').length, value: MOCK_OPPORTUNITIES.filter(o => o.stage === 'negotiation').reduce((s, o) => s + o.value, 0), width: '70%' },
                                            { stage: 'closed-won', label: '成交', count: MOCK_OPPORTUNITIES.filter(o => o.stage === 'closed-won').length, value: MOCK_OPPORTUNITIES.filter(o => o.stage === 'closed-won').reduce((s, o) => s + o.value, 0), width: '100%' }
                                        ].map((stage, i) => (
                                            <div key={stage.stage} className="flex-1 flex flex-col items-center">
                                                <div className="text-lg font-bold mb-2">{stage.count}</div>
                                                <div 
                                                    className="w-full bg-gradient-to-t from-[#63a6b0] to-cyan-400 rounded-t-xl transition-all hover:opacity-80 cursor-pointer relative group"
                                                    style={{ height: stage.width }}
                                                >
                                                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white text-black px-3 py-1 rounded-lg text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                                        {formatCurrency(stage.value)}
                                                    </div>
                                                </div>
                                                <div className="mt-4 text-sm font-bold text-slate-400">{stage.label}</div>
                                                <div className="text-xs text-slate-500">{formatCurrency(stage.value)}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    )}

                    {/* Projects Tab */}
                    {activeTab === 'projects' && (
                        <motion.div
                            key="projects"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-6"
                        >
                            {/* Project Stats */}
                            <div className="grid grid-cols-5 gap-4">
                                {[
                                    { label: '總專案', value: projectStats.total, icon: Briefcase, color: 'from-blue-500 to-cyan-600' },
                                    { label: '進行中', value: projectStats.active, icon: Activity, color: 'from-emerald-500 to-green-600' },
                                    { label: '總預算', value: formatCurrency(projectStats.totalBudget), icon: DollarSign, color: 'from-amber-500 to-orange-600' },
                                    { label: '已執行', value: formatCurrency(projectStats.totalSpent), icon: TrendingUp, color: 'from-purple-500 to-indigo-600' },
                                    { label: '平均進度', value: `${projectStats.avgProgress}%`, icon: Target, color: 'from-[#63a6b0] to-cyan-600' }
                                ].map((stat, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all"
                                    >
                                        <div className={`size-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-4`}>
                                            <stat.icon className="w-5 h-5 text-white" />
                                        </div>
                                        <div className="text-2xl font-black italic truncate">{stat.value}</div>
                                        <div className="text-xs text-slate-400 uppercase tracking-widest mt-1">{stat.label}</div>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Project View Toggle */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1 p-1 bg-white/5 rounded-xl">
                                    {[
                                        { id: 'list', label: '清單', icon: List },
                                        { id: 'kanban', label: '看板', icon: Kanban },
                                        { id: 'gantt', label: '甘特圖', icon: CalendarIcon }
                                    ].map(view => (
                                        <button
                                            key={view.id}
                                            onClick={() => setProjectView(view.id as typeof projectView)}
                                            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${
                                                projectView === view.id 
                                                    ? 'bg-[#63a6b0] text-white' 
                                                    : 'hover:bg-white/5'
                                            }`}
                                        >
                                            <view.icon className="w-4 h-4" />
                                            {view.label}
                                        </button>
                                    ))}
                                </div>
                                
                                <button 
                                    onClick={() => setShowTaskModal(true)}
                                    className="px-4 py-2 bg-[#63a6b0] hover:bg-[#528d96] rounded-xl text-sm font-bold flex items-center gap-2 transition-all"
                                >
                                    <Plus className="w-4 h-4" />
                                    新增任務
                                </button>
                            </div>

                            {/* Projects List View */}
                            {projectView === 'list' && (
                                <div className="space-y-4">
                                    {MOCK_PROJECTS.map((project) => (
                                        <motion.div
                                            key={project.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all"
                                        >
                                            <div className="flex items-start gap-6">
                                                {/* Progress Circle */}
                                                <div className="relative size-20 flex-shrink-0">
                                                    <svg className="size-20 transform -rotate-90">
                                                        <circle cx="40" cy="40" r="35" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-white/10" />
                                                        <circle 
                                                            cx="40" cy="40" r="35" 
                                                            stroke="currentColor" strokeWidth="6" fill="transparent"
                                                            strokeDasharray={`${project.progress * 2.2} 220`}
                                                            className="text-[#63a6b0]"
                                                            style={{ strokeDashoffset: 0 }}
                                                        />
                                                    </svg>
                                                    <div className="absolute inset-0 flex items-center justify-center">
                                                        <span className="text-xl font-black">{project.progress}%</span>
                                                    </div>
                                                </div>

                                                {/* Project Info */}
                                                <div className="flex-1">
                                                    <div className="flex items-start justify-between mb-2">
                                                        <div>
                                                            <h3 className="font-bold text-lg">{project.name}</h3>
                                                            <p className="text-sm text-slate-400">{project.description}</p>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <PriorityBadge priority={project.priority} />
                                                            <StatusBadge status={project.status} />
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-5 gap-4 mb-4 text-sm">
                                                        <div>
                                                            <span className="text-slate-400">預算</span>
                                                            <div className="font-bold">{formatCurrency(project.budget)}</div>
                                                        </div>
                                                        <div>
                                                            <span className="text-slate-400">已執行</span>
                                                            <div className="font-bold">{formatCurrency(project.spent)}</div>
                                                        </div>
                                                        <div>
                                                            <span className="text-slate-400">截止日期</span>
                                                            <div className="font-bold">{formatDate(project.endDate)}</div>
                                                        </div>
                                                        <div>
                                                            <span className="text-slate-400">負責人</span>
                                                            <div className="font-bold">{project.owner}</div>
                                                        </div>
                                                        <div>
                                                            <span className="text-slate-400">任務數</span>
                                                            <div className="font-bold">{project.tasks.length} 項</div>
                                                        </div>
                                                    </div>

                                                    {/* Milestones */}
                                                    <div className="flex items-center gap-2 mb-4">
                                                        <Milestone className="w-4 h-4 text-slate-400" />
                                                        {project.milestones.map((milestone) => (
                                                            <div 
                                                                key={milestone.id}
                                                                className={`px-3 py-1 rounded-full text-xs flex items-center gap-2 ${
                                                                    milestone.status === 'completed' 
                                                                        ? 'bg-emerald-500/20 text-emerald-400'
                                                                        : milestone.status === 'in-progress'
                                                                        ? 'bg-blue-500/20 text-blue-400'
                                                                        : milestone.status === 'delayed'
                                                                        ? 'bg-red-500/20 text-red-400'
                                                                        : 'bg-white/10 text-slate-400'
                                                                }`}
                                                            >
                                                                {milestone.status === 'completed' && <CheckCircle className="w-3 h-3" />}
                                                                {milestone.name}
                                                            </div>
                                                        ))}
                                                    </div>

                                                    {/* Tasks Preview */}
                                                    <div className="space-y-2">
                                                        {project.tasks.slice(0, 3).map((task) => (
                                                            <div key={task.id} className="flex items-center justify-between p-3 bg-black/20 rounded-lg">
                                                                <div className="flex items-center gap-3">
                                                                    <StatusBadge status={task.status} />
                                                                    <span className="text-sm">{task.title}</span>
                                                                </div>
                                                                <div className="flex items-center gap-4 text-xs text-slate-400">
                                                                    <span>{task.assignee}</span>
                                                                    <span className={task.dueDate < new Date().toISOString() ? 'text-red-400' : ''}>
                                                                        {formatDate(task.dueDate)}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                                                    <ChevronRight className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            {/* Contact Modal */}
            <AnimatePresence>
                {showContactModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
                        onClick={() => setShowContactModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-[#0F172A] border border-white/10 rounded-3xl p-8 max-w-lg w-full mx-4"
                            onClick={e => e.stopPropagation()}
                        >
                            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                                <Users className="text-[#63a6b0]" />
                                新增聯絡人
                            </h3>
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-widest text-slate-500">姓名</label>
                                        <input type="text" className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 focus:border-[#63a6b0] outline-none transition-colors" placeholder="輸入姓名" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-widest text-slate-500">職稱</label>
                                        <input type="text" className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 focus:border-[#63a6b0] outline-none transition-colors" placeholder="輸入職稱" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-slate-500">公司</label>
                                    <input type="text" className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 focus:border-[#63a6b0] outline-none transition-colors" placeholder="輸入公司名稱" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Email</label>
                                        <input type="email" className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 focus:border-[#63a6b0] outline-none transition-colors" placeholder="輸入 Email" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-widest text-slate-500">電話</label>
                                        <input type="tel" className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 focus:border-[#63a6b0] outline-none transition-colors" placeholder="輸入電話" />
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 mt-8">
                                <button 
                                    onClick={() => setShowContactModal(false)}
                                    className="flex-1 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-bold transition-all"
                                >
                                    取消
                                </button>
                                <button 
                                    onClick={() => {
                                        setShowContactModal(false);
                                        alert('聯絡人已新增！');
                                    }}
                                    className="flex-1 py-3 bg-gradient-to-r from-[#63a6b0] to-cyan-600 rounded-xl font-bold transition-all"
                                >
                                    新增
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CRMProjectManagementPage;
