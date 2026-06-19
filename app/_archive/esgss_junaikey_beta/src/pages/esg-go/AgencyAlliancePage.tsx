/**
 * 🤝 Agency Alliance & Commission Management Platform
 * 
 * 代理聯盟分潤管理平台
 * 
 * Core Features:
 * 1. Partner Management (夥伴管理)
 * 2. Commission Tracking (分潤追蹤)
 * 3. Tier System (階梯分潤)
 * 4. Payout Management (出金管理)
 * 5. Performance Analytics (績效分析)
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Users, Building2, DollarSign, Percent, TrendingUp, Award,
    Star, Target, Gift, Wallet, CreditCard, Banknote, Clock,
    Plus, Search, Filter, Download, Upload, MoreVertical, ChevronRight,
    CheckCircle, XCircle, AlertTriangle, ArrowUpRight, ArrowDownRight,
    BarChart3, PieChart, LineChart, Activity, Zap, Medal, Crown,
    Link, ExternalLink, Copy, Share2, Settings, Bell, HelpCircle,
    Calendar, FileText, Mail, Phone, MapPin, Globe, Building,
    RefreshCw, Save, Edit3, Trash2, Eye, Send, MessageSquare
} from 'lucide-react';

// ============================================
// Types & Interfaces
// ============================================

interface Partner {
    id: string;
    name: string;
    type: 'individual' | 'agency' | 'enterprise' | 'consultant';
    level: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
    status: 'active' | 'pending' | 'suspended' | 'inactive';
    email: string;
    phone: string;
    company?: string;
    region: string;
    joinDate: string;
    totalReferrals: number;
    totalRevenue: number;
    totalCommission: number;
    pendingPayout: number;
    tierPoints: number;
    nextTierThreshold: number;
    avatar?: string;
    tags: string[];
    upline?: string;      // 上級代理商
    downlines: string[];  // 下級代理商
    bankAccount: {
        bankName: string;
        accountNumber: string;
        accountName: string;
    };
    performance: {
        thisMonth: number;
        lastMonth: number;
        thisQuarter: number;
        lastQuarter: number;
        trend: 'up' | 'down' | 'stable';
    };
}

interface Commission {
    id: string;
    partnerId: string;
    partnerName: string;
    referralId: string;
    referralCompany: string;
    orderId: string;
    orderAmount: number;
    commissionRate: number;
    commissionAmount: number;
    status: 'pending' | 'approved' | 'paid' | 'rejected';
    createdAt: string;
    paidAt?: string;
    tier: string;
    product: string;
    notes?: string;
}

interface TierConfig {
    level: string;
    name: string;
    minPoints: number;
    baseRate: number;
    bonusRate: number;
    benefits: string[];
    color: string;
    icon: string;
}

interface PayoutRequest {
    id: string;
    partnerId: string;
    partnerName: string;
    amount: number;
    status: 'processing' | 'approved' | 'completed' | 'rejected';
    requestedAt: string;
    processedAt?: string;
    method: 'bank' | 'credit' | 'crypto';
    reference?: string;
    notes?: string;
}

// ============================================
// Mock Data
// ============================================

const TIER_CONFIGS: TierConfig[] = [
    {
        level: 'bronze',
        name: '銅牌夥伴',
        minPoints: 0,
        baseRate: 5,
        bonusRate: 0,
        benefits: ['基本分潤 5%', '月報表支援', '線上客服'],
        color: 'from-orange-500 to-amber-600',
        icon: '🥉'
    },
    {
        level: 'silver',
        name: '銀牌夥伴',
        minPoints: 1000,
        baseRate: 7,
        bonusRate: 1,
        benefits: ['分潤 7% + 1% 獎勵', '優先客服', '季報分析', '專屬網址'],
        color: 'from-slate-400 to-gray-500',
        icon: '🥈'
    },
    {
        level: 'gold',
        name: '金牌夥伴',
        minPoints: 5000,
        baseRate: 10,
        bonusRate: 2,
        benefits: ['分潤 10% + 2% 獎勵', '專屬經理', '客製化報告', '線下活動邀請'],
        color: 'from-amber-400 to-yellow-500',
        icon: '🥇'
    },
    {
        level: 'platinum',
        name: '白金夥伴',
        minPoints: 20000,
        baseRate: 12,
        bonusRate: 3,
        benefits: ['分潤 12% + 3% 獎勵', 'VP 對接', '策略會議', '獨家資源'],
        color: 'from-cyan-400 to-blue-500',
        icon: '💎'
    },
    {
        level: 'diamond',
        name: '鑽石夥伴',
        minPoints: 50000,
        baseRate: 15,
        bonusRate: 5,
        benefits: ['分潤 15% + 5% 獎勵', 'CEO 見面', '年度晚宴', '全球資源'],
        color: 'from-purple-400 to-pink-500',
        icon: '👑'
    }
];

const MOCK_PARTNERS: Partner[] = [
    {
        id: 'p-001',
        name: '永續管理顧問有限公司',
        type: 'agency',
        level: 'gold',
        status: 'active',
        email: 'contact@sustain.com.tw',
        phone: '+886-2-2345-6789',
        company: '永續管理顧問有限公司',
        region: '北部',
        joinDate: '2023-06-15',
        totalReferrals: 45,
        totalRevenue: 12500000,
        totalCommission: 1250000,
        pendingPayout: 185000,
        tierPoints: 8500,
        nextTierThreshold: 20000,
        tags: ['資深夥伴', 'ESG 專家'],
        upline: 'p-003',
        downlines: ['p-005', 'p-006'],
        bankAccount: {
            bankName: '玉山銀行',
            accountNumber: '1234-5678-9012',
            accountName: '永續管理顧問有限公司'
        },
        performance: {
            thisMonth: 350000,
            lastMonth: 320000,
            thisQuarter: 980000,
            lastQuarter: 850000,
            trend: 'up'
        }
    },
    {
        id: 'p-002',
        name: '陳建宏',
        type: 'consultant',
        level: 'platinum',
        status: 'active',
        email: 'chen.jianhong@email.com',
        phone: '+886-3-456-7890',
        region: '中部',
        joinDate: '2022-03-10',
        totalReferrals: 128,
        totalRevenue: 42000000,
        totalCommission: 5040000,
        pendingPayout: 420000,
        tierPoints: 45000,
        nextTierThreshold: 50000,
        tags: ['TOP Sales', '碳交所認證'],
        downlines: ['p-004'],
        bankAccount: {
            bankName: '中國信託',
            accountNumber: '9876-5432-1098',
            accountName: '陳建宏'
        },
        performance: {
            thisMonth: 580000,
            lastMonth: 620000,
            thisQuarter: 1750000,
            lastQuarter: 1680000,
            trend: 'stable'
        }
    },
    {
        id: 'p-003',
        name: '綠色企業聯盟協會',
        type: 'enterprise',
        level: 'diamond',
        status: 'active',
        email: 'info@greenalliance.org',
        phone: '+886-2-3456-7890',
        company: '綠色企業聯盟協會',
        region: '北部',
        joinDate: '2021-01-01',
        totalReferrals: 520,
        totalRevenue: 180000000,
        totalCommission: 27000000,
        pendingPayout: 1250000,
        tierPoints: 180000,
        nextTierThreshold: null,
        tags: ['策略夥伴', '大型企業'],
        downlines: ['p-001', 'p-007'],
        bankAccount: {
            bankName: '台灣銀行',
            accountNumber: '1111-2222-3333',
            accountName: '綠色企業聯盟協會'
        },
        performance: {
            thisMonth: 2100000,
            lastMonth: 1950000,
            thisQuarter: 5800000,
            lastQuarter: 5200000,
            trend: 'up'
        }
    },
    {
        id: 'p-004',
        name: '林曉萍',
        type: 'individual',
        level: 'silver',
        status: 'active',
        email: 'sarah.lin@email.com',
        phone: '+886-4-567-8901',
        region: '南部',
        joinDate: '2023-11-20',
        totalReferrals: 18,
        totalRevenue: 3200000,
        totalCommission: 224000,
        pendingPayout: 56000,
        tierPoints: 1800,
        nextTierThreshold: 5000,
        tags: ['新銳夥伴'],
        upline: 'p-002',
        bankAccount: {
            bankName: '富邦銀行',
            accountNumber: '5555-6666-7777',
            accountName: '林曉萍'
        },
        performance: {
            thisMonth: 85000,
            lastMonth: 65000,
            thisQuarter: 180000,
            lastQuarter: 95000,
            trend: 'up'
        }
    },
    {
        id: 'p-005',
        name: '碳管理科技股份有限公司',
        type: 'agency',
        level: 'bronze',
        status: 'pending',
        email: 'business@carbontech.com',
        phone: '+886-2-4567-8901',
        company: '碳管理科技股份有限公司',
        region: '北部',
        joinDate: '2024-01-15',
        totalReferrals: 5,
        totalRevenue: 850000,
        totalCommission: 42500,
        pendingPayout: 42500,
        tierPoints: 500,
        nextTierThreshold: 1000,
        tags: ['新夥伴'],
        upline: 'p-001',
        bankAccount: {
            bankName: '兆豐銀行',
            accountNumber: '8888-9999-0000',
            accountName: '碳管理科技股份有限公司'
        },
        performance: {
            thisMonth: 45000,
            lastMonth: 0,
            thisQuarter: 45000,
            lastQuarter: 0,
            trend: 'up'
        }
    }
];

const MOCK_COMMISSIONS: Commission[] = [
    {
        id: 'c-001',
        partnerId: 'p-003',
        partnerName: '綠色企業聯盟協會',
        referralId: 'r-001',
        referralCompany: '台積電製造股份有限公司',
        orderId: 'ORD-2024-001',
        orderAmount: 5000000,
        commissionRate: 15,
        commissionAmount: 750000,
        status: 'pending',
        createdAt: '2024-01-20',
        tier: 'diamond',
        product: '碳中和輔導專案'
    },
    {
        id: 'c-002',
        partnerId: 'p-002',
        partnerName: '陳建宏',
        referralId: 'r-002',
        referralCompany: '鴻海精密工業股份有限公司',
        orderId: 'ORD-2024-002',
        orderAmount: 3500000,
        commissionRate: 12,
        commissionAmount: 420000,
        status: 'approved',
        createdAt: '2024-01-18',
        tier: 'platinum',
        product: '供應商評估系統'
    },
    {
        id: 'c-003',
        partnerId: 'p-001',
        partnerName: '永續管理顧問有限公司',
        referralId: 'r-003',
        referralCompany: '中信金控股份有限公司',
        orderId: 'ORD-2024-003',
        orderAmount: 2800000,
        commissionRate: 10,
        commissionAmount: 280000,
        status: 'paid',
        createdAt: '2024-01-15',
        paidAt: '2024-01-25',
        tier: 'gold',
        product: 'TCFD 氣候風險專案'
    },
    {
        id: 'c-004',
        partnerId: 'p-004',
        partnerName: '林曉萍',
        referralId: 'r-004',
        referralCompany: '高雄鋼鐵股份有限公司',
        orderId: 'ORD-2024-004',
        orderAmount: 1200000,
        commissionRate: 7,
        commissionAmount: 84000,
        status: 'pending',
        createdAt: '2024-01-22',
        tier: 'silver',
        product: 'ISO 14064 認證'
    },
    {
        id: 'c-005',
        partnerId: 'p-003',
        partnerName: '綠色企業聯盟協會',
        referralId: 'r-005',
        referralCompany: '華碩電腦股份有限公司',
        orderId: 'ORD-2024-005',
        orderAmount: 2200000,
        commissionRate: 15,
        commissionAmount: 330000,
        status: 'pending',
        createdAt: '2024-01-25',
        tier: 'diamond',
        product: '永續報告書優化'
    }
];

const MOCK_PAYOUT_REQUESTS: PayoutRequest[] = [
    {
        id: 'pay-001',
        partnerId: 'p-002',
        partnerName: '陳建宏',
        amount: 420000,
        status: 'processing',
        requestedAt: '2024-01-26',
        method: 'bank',
        reference: 'TXN-2024-0125'
    },
    {
        id: 'pay-002',
        partnerId: 'p-001',
        partnerName: '永續管理顧問有限公司',
        amount: 185000,
        status: 'approved',
        requestedAt: '2024-01-25',
        processedAt: '2024-01-26',
        method: 'bank',
        reference: 'TXN-2024-0124'
    },
    {
        id: 'pay-003',
        partnerId: 'p-004',
        partnerName: '林曉萍',
        amount: 56000,
        status: 'completed',
        requestedAt: '2024-01-20',
        processedAt: '2024-01-22',
        method: 'credit',
        reference: 'TXN-2024-0120'
    }
];

// ============================================
// Helper Functions
// ============================================

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('zh-TW', { style: 'currency', currency: 'TWD', maximumFractionDigits: 0 }).format(value);
};

const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('zh-TW', { year: 'numeric', month: 'short', day: 'numeric' });
};

const getTierConfig = (level: string) => {
    return TIER_CONFIGS.find(t => t.level === level) || TIER_CONFIGS[0];
};

const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
        active: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
        pending: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
        suspended: 'bg-red-500/20 text-red-400 border-red-500/30',
        inactive: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
        approved: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
        paid: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
        completed: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
        rejected: 'bg-red-500/20 text-red-400 border-red-500/30',
        processing: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30'
    };
    return colors[status] || 'bg-slate-500/20 text-slate-400';
};

const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
        active: '活躍',
        pending: '待審核',
        suspended: '已停權',
        inactive: '非活躍',
        approved: '已核准',
        paid: '已付款',
        completed: '已完成',
        rejected: '已拒絕',
        processing: '處理中'
    };
    return labels[status] || status;
};

// ============================================
// Main Component
// ============================================

const AgencyAlliancePage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'partners' | 'commissions' | 'payouts' | 'analytics'>('partners');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTier, setSelectedTier] = useState<string>('all');
    const [showPayoutModal, setShowPayoutModal] = useState(false);
    const [showPartnerModal, setShowPartnerModal] = useState(false);

    // Filtered Partners
    const filteredPartners = useMemo(() => {
        return MOCK_PARTNERS.filter(partner => {
            const matchesSearch = partner.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                partner.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                partner.email.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesTier = selectedTier === 'all' || partner.level === selectedTier;
            return matchesSearch && matchesTier;
        });
    }, [searchQuery, selectedTier]);

    // Statistics
    const stats = useMemo(() => ({
        totalPartners: MOCK_PARTNERS.length,
        activePartners: MOCK_PARTNERS.filter(p => p.status === 'active').length,
        totalRevenue: MOCK_PARTNERS.reduce((sum, p) => sum + p.totalRevenue, 0),
        totalCommission: MOCK_PARTNERS.reduce((sum, p) => sum + p.totalCommission, 0),
        pendingPayout: MOCK_PARTNERS.reduce((sum, p) => sum + p.pendingPayout, 0),
        avgCommissionRate: 10.5
    }), []);

    return (
        <div className="min-h-screen bg-[#0F172A] text-slate-100 font-sans">
            {/* Header */}
            <header className="bg-gradient-to-r from-[#0a1628] via-[#132744] to-[#0a1628] border-b border-white/5 sticky top-0 z-50 backdrop-blur-xl">
                <div className="max-w-[1600px] mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="size-12 rounded-xl bg-gradient-to-br from-[#63a6b0] to-cyan-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                                <Users className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-black uppercase tracking-tight italic">
                                    Agency <span className="text-[#63a6b0]">Alliance</span>
                                </h1>
                                <p className="text-xs text-slate-400 uppercase tracking-widest">代理聯盟分潤管理</p>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl border border-white/10">
                                <Search className="w-4 h-4 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="搜尋夥伴..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="bg-transparent text-sm outline-none w-48"
                                />
                            </div>
                            <button 
                                onClick={() => setShowPartnerModal(true)}
                                className="px-4 py-2 bg-[#63a6b0] hover:bg-[#528d96] rounded-xl text-sm font-bold flex items-center gap-2 transition-all"
                            >
                                <Plus className="w-4 h-4" />
                                新增夥伴
                            </button>
                            <button className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all">
                                <Bell className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Navigation Tabs */}
            <nav className="bg-[#0a1628]/50 border-b border-white/5 backdrop-blur-md">
                <div className="max-w-[1600px] mx-auto px-6">
                    <div className="flex gap-1">
                        {[
                            { id: 'partners', label: '夥伴管理', icon: Users },
                            { id: 'commissions', label: '分潤追蹤', icon: DollarSign },
                            { id: 'payouts', label: '出金管理', icon: Wallet },
                            { id: 'analytics', label: '績效分析', icon: BarChart3 }
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                                className={`flex items-center gap-2 px-6 py-4 text-sm font-bold uppercase tracking-wider transition-all border-b-2 -mb-px ${
                                    activeTab === tab.id 
                                        ? 'text-[#63a6b0] border-[#63a6b0] bg-[#63a6b0]/5' 
                                        : 'text-slate-400 border-transparent hover:text-slate-200'
                                }`}
                            >
                                <tab.icon className="w-4 h-4" />
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="max-w-[1600px] mx-auto px-6 py-8">
                <AnimatePresence mode="wait">
                    {/* Partners Tab */}
                    {activeTab === 'partners' && (
                        <motion.div
                            key="partners"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-6"
                        >
                            {/* Stats */}
                            <div className="grid grid-cols-5 gap-4">
                                {[
                                    { label: '總夥伴數', value: stats.totalPartners, icon: Users, color: 'from-blue-500 to-cyan-600' },
                                    { label: '活躍夥伴', value: stats.activePartners, icon: Activity, color: 'from-emerald-500 to-green-600' },
                                    { label: '總營收', value: formatCurrency(stats.totalRevenue), icon: TrendingUp, color: 'from-amber-500 to-orange-600' },
                                    { label: '總分潤', value: formatCurrency(stats.totalCommission), icon: DollarSign, color: 'from-purple-500 to-indigo-600' },
                                    { label: '待出金', value: formatCurrency(stats.pendingPayout), icon: Wallet, color: 'from-[#63a6b0] to-cyan-600' }
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

                            {/* Tier Filter */}
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <Filter className="w-4 h-4 text-slate-400" />
                                    <span className="text-sm font-bold">等級篩選：</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    {['all', ...TIER_CONFIGS.map(t => t.level)].map(level => (
                                        <button
                                            key={level}
                                            onClick={() => setSelectedTier(level)}
                                            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                                                selectedTier === level 
                                                    ? 'bg-[#63a6b0] text-white' 
                                                    : 'bg-white/5 hover:bg-white/10'
                                            }`}
                                        >
                                            {level === 'all' ? '全部' : TIER_CONFIGS.find(t => t.level === level)?.icon}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Partners Grid */}
                            <div className="grid grid-cols-3 gap-6">
                                {filteredPartners.map((partner) => {
                                    const tier = getTierConfig(partner.level);
                                    const progress = partner.nextTierThreshold 
                                        ? Math.min((partner.tierPoints / partner.nextTierThreshold) * 100, 100)
                                        : 100;
                                    
                                    return (
                                        <motion.div
                                            key={partner.id}
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all group"
                                        >
                                            {/* Header */}
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="flex items-center gap-3">
                                                    <div className={`size-12 rounded-xl bg-gradient-to-br ${tier.color} flex items-center justify-center text-2xl`}>
                                                        {tier.icon}
                                                    </div>
                                                    <div>
                                                        <h3 className="font-bold text-lg">{partner.name}</h3>
                                                        <p className="text-xs text-slate-400">{partner.company || '個人夥伴'}</p>
                                                    </div>
                                                </div>
                                                <div className={`px-2 py-1 rounded-full text-xs font-bold border ${getStatusColor(partner.status)}`}>
                                                    {getStatusLabel(partner.status)}
                                                </div>
                                            </div>

                                            {/* Tier Progress */}
                                            <div className="mb-4">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-xs text-slate-400">晉升進度</span>
                                                    <span className="text-xs font-bold">{partner.tierPoints} / {partner.nextTierThreshold || 'MAX'} 點</span>
                                                </div>
                                                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                                    <div 
                                                        className={`h-full bg-gradient-to-r ${tier.color} transition-all`}
                                                        style={{ width: `${progress}%` }}
                                                    />
                                                </div>
                                                {partner.nextTierThreshold && (
                                                    <p className="text-xs text-slate-500 mt-1">
                                                        距離升級還需 {partner.nextTierThreshold - partner.tierPoints} 點
                                                    </p>
                                                )}
                                            </div>

                                            {/* Stats */}
                                            <div className="grid grid-cols-3 gap-3 mb-4">
                                                <div className="text-center p-3 bg-black/20 rounded-xl">
                                                    <div className="text-lg font-black">{partner.totalReferrals}</div>
                                                    <div className="text-xs text-slate-400">推薦數</div>
                                                </div>
                                                <div className="text-center p-3 bg-black/20 rounded-xl">
                                                    <div className="text-lg font-black">{formatCurrency(partner.totalCommission)}</div>
                                                    <div className="text-xs text-slate-400">累積分潤</div>
                                                </div>
                                                <div className="text-center p-3 bg-black/20 rounded-xl">
                                                    <div className="text-lg font-black text-emerald-400">{formatCurrency(partner.pendingPayout)}</div>
                                                    <div className="text-xs text-slate-400">待出金</div>
                                                </div>
                                            </div>

                                            {/* Tags */}
                                            <div className="flex flex-wrap gap-1 mb-4">
                                                {partner.tags.map((tag, i) => (
                                                    <span key={i} className="px-2 py-1 bg-[#63a6b0]/20 text-[#63a6b0] rounded text-xs">
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>

                                            {/* Performance Trend */}
                                            <div className="flex items-center justify-between pt-4 border-t border-white/10">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs text-slate-400">本月業績</span>
                                                    <div className={`flex items-center gap-1 text-sm font-bold ${
                                                        partner.performance.trend === 'up' ? 'text-emerald-400' :
                                                        partner.performance.trend === 'down' ? 'text-red-400' : 'text-slate-400'
                                                    }`}>
                                                        {partner.performance.trend === 'up' && <ArrowUpRight className="w-4 h-4" />}
                                                        {partner.performance.trend === 'down' && <ArrowDownRight className="w-4 h-4" />}
                                                        {formatCurrency(partner.performance.thisMonth)}
                                                    </div>
                                                </div>
                                                <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                                                    <ChevronRight className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </motion.div>
                    )}

                    {/* Commissions Tab */}
                    {activeTab === 'commissions' && (
                        <motion.div
                            key="commissions"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-6"
                        >
                            {/* Commission Summary */}
                            <div className="grid grid-cols-4 gap-4">
                                {[
                                    { label: '待審核', value: formatCurrency(MOCK_COMMISSIONS.filter(c => c.status === 'pending').reduce((s, c) => s + c.commissionAmount, 0)), icon: Clock, color: 'bg-amber-500' },
                                    { label: '已核准', value: formatCurrency(MOCK_COMMISSIONS.filter(c => c.status === 'approved').reduce((s, c) => s + c.commissionAmount, 0)), icon: CheckCircle, color: 'bg-blue-500' },
                                    { label: '已付款', value: formatCurrency(MOCK_COMMISSIONS.filter(c => c.status === 'paid').reduce((s, c) => s + c.commissionAmount, 0)), icon: DollarSign, color: 'bg-emerald-500' },
                                    { label: '本月總額', value: formatCurrency(MOCK_COMMISSIONS.reduce((s, c) => s + c.commissionAmount, 0)), icon: TrendingUp, color: 'bg-purple-500' }
                                ].map((item, i) => (
                                    <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className={`size-10 rounded-xl ${item.color} flex items-center justify-center`}>
                                                <item.icon className="w-5 h-5 text-white" />
                                            </div>
                                            <span className="text-sm text-slate-400">{item.label}</span>
                                        </div>
                                        <div className="text-2xl font-black">{item.value}</div>
                                    </div>
                                ))}
                            </div>

                            {/* Commission List */}
                            <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-white/5 border-b border-white/10">
                                            <tr>
                                                <th className="text-left p-4 text-xs font-bold uppercase tracking-widest text-slate-400">夥伴</th>
                                                <th className="text-left p-4 text-xs font-bold uppercase tracking-widest text-slate-400">推薦客戶</th>
                                                <th className="text-left p-4 text-xs font-bold uppercase tracking-widest text-slate-400">產品</th>
                                                <th className="text-left p-4 text-xs font-bold uppercase tracking-widest text-slate-400">訂單金額</th>
                                                <th className="text-left p-4 text-xs font-bold uppercase tracking-widest text-slate-400">分潤率</th>
                                                <th className="text-left p-4 text-xs font-bold uppercase tracking-widest text-slate-400">分潤金額</th>
                                                <th className="text-left p-4 text-xs font-bold uppercase tracking-widest text-slate-400">狀態</th>
                                                <th className="text-left p-4 text-xs font-bold uppercase tracking-widest text-slate-400">日期</th>
                                                <th className="p-4"></th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5">
                                            {MOCK_COMMISSIONS.map((commission) => (
                                                <tr key={commission.id} className="hover:bg-white/5 transition-all">
                                                    <td className="p-4">
                                                        <div className="font-bold">{commission.partnerName}</div>
                                                        <div className="text-xs text-slate-400">{commission.tier}</div>
                                                    </td>
                                                    <td className="p-4">
                                                        <div className="font-medium">{commission.referralCompany}</div>
                                                        <div className="text-xs text-slate-400">{commission.orderId}</div>
                                                    </td>
                                                    <td className="p-4 text-sm">{commission.product}</td>
                                                    <td className="p-4 font-bold">{formatCurrency(commission.orderAmount)}</td>
                                                    <td className="p-4">
                                                        <span className="px-2 py-1 bg-[#63a6b0]/20 text-[#63a6b0] rounded text-sm font-bold">
                                                            {commission.commissionRate}%
                                                        </span>
                                                    </td>
                                                    <td className="p-4 font-bold text-emerald-400">{formatCurrency(commission.commissionAmount)}</td>
                                                    <td className="p-4">
                                                        <span className={`px-2 py-1 rounded-full text-xs font-bold border ${getStatusColor(commission.status)}`}>
                                                            {getStatusLabel(commission.status)}
                                                        </span>
                                                    </td>
                                                    <td className="p-4 text-sm text-slate-400">{formatDate(commission.createdAt)}</td>
                                                    <td className="p-4">
                                                        <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                                                            <Eye className="w-4 h-4" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Payouts Tab */}
                    {activeTab === 'payouts' && (
                        <motion.div
                            key="payouts"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-6"
                        >
                            {/* Payout Stats */}
                            <div className="grid grid-cols-4 gap-4">
                                {[
                                    { label: '處理中', value: formatCurrency(MOCK_PAYOUT_REQUESTS.filter(p => p.status === 'processing').reduce((s, p) => s + p.amount, 0)), color: 'bg-cyan-500' },
                                    { label: '已核准', value: formatCurrency(MOCK_PAYOUT_REQUESTS.filter(p => p.status === 'approved').reduce((s, p) => s + p.amount, 0)), color: 'bg-blue-500' },
                                    { label: '已完成', value: formatCurrency(MOCK_PAYOUT_REQUESTS.filter(p => p.status === 'completed').reduce((s, p) => s + p.amount, 0)), color: 'bg-emerald-500' },
                                    { label: '待處理總額', value: formatCurrency(MOCK_PAYOUT_REQUESTS.filter(p => ['processing', 'approved'].includes(p.status)).reduce((s, p) => s + p.amount, 0)), color: 'bg-amber-500' }
                                ].map((item, i) => (
                                    <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6">
                                        <div className={`size-10 rounded-xl ${item.color} flex items-center justify-center mb-4`}>
                                            <Wallet className="w-5 h-5 text-white" />
                                        </div>
                                        <div className="text-2xl font-black">{item.value}</div>
                                        <div className="text-xs text-slate-400 uppercase tracking-widest mt-1">{item.label}</div>
                                    </div>
                                ))}
                            </div>

                            {/* Payout Requests */}
                            <div className="space-y-4">
                                {MOCK_PAYOUT_REQUESTS.map((payout) => (
                                    <motion.div
                                        key={payout.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className={`size-12 rounded-xl ${
                                                    payout.method === 'bank' ? 'bg-blue-500' : 'bg-purple-500'
                                                } flex items-center justify-center`}>
                                                    {payout.method === 'bank' ? <Building className="w-6 h-6" /> : <CreditCard className="w-6 h-6" />}
                                                </div>
                                                <div>
                                                    <h3 className="font-bold">{payout.partnerName}</h3>
                                                    <p className="text-sm text-slate-400">{payout.method === 'bank' ? '銀行轉帳' : '信用卡'} • {payout.reference}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-6">
                                                <div className="text-right">
                                                    <div className="text-2xl font-black text-emerald-400">{formatCurrency(payout.amount)}</div>
                                                    <div className="text-xs text-slate-400">申請日期: {formatDate(payout.requestedAt)}</div>
                                                </div>
                                                <div className={`px-3 py-1 rounded-full text-sm font-bold border ${getStatusColor(payout.status)}`}>
                                                    {getStatusLabel(payout.status)}
                                                </div>
                                                {payout.status === 'processing' && (
                                                    <button 
                                                        onClick={() => setShowPayoutModal(true)}
                                                        className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 rounded-xl text-sm font-bold transition-all"
                                                    >
                                                        核准出金
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* Analytics Tab */}
                    {activeTab === 'analytics' && (
                        <motion.div
                            key="analytics"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-6"
                        >
                            {/* Tier Distribution */}
                            <div className="grid grid-cols-2 gap-6">
                                <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
                                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                        <PieChart className="text-[#63a6b0]" />
                                        夥伴等級分布
                                    </h3>
                                    <div className="space-y-4">
                                        {TIER_CONFIGS.map((tier, i) => {
                                            const count = MOCK_PARTNERS.filter(p => p.level === tier.level).length;
                                            const percentage = (count / MOCK_PARTNERS.length) * 100;
                                            return (
                                                <div key={tier.level} className="flex items-center gap-4">
                                                    <span className="text-2xl">{tier.icon}</span>
                                                    <div className="flex-1">
                                                        <div className="flex items-center justify-between mb-1">
                                                            <span className="text-sm font-bold">{tier.name}</span>
                                                            <span className="text-sm text-slate-400">{count} 人</span>
                                                        </div>
                                                        <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                                                            <div 
                                                                className={`h-full bg-gradient-to-r ${tier.color}`}
                                                                style={{ width: `${percentage}%` }}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
                                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                        <TrendingUp className="text-[#63a6b0]" />
                                        分潤趨勢
                                    </h3>
                                    <div className="flex items-end justify-between h-48 px-4">
                                        {[35, 42, 38, 55, 48, 62, 58, 72, 68, 85, 78, 92].map((value, i) => (
                                            <div key={i} className="flex flex-col items-center gap-2">
                                                <div 
                                                    className="w-8 bg-gradient-to-t from-[#63a6b0] to-cyan-400 rounded-t-lg transition-all hover:opacity-80"
                                                    style={{ height: `${value * 1.5}px` }}
                                                />
                                                <span className="text-xs text-slate-400">{i + 1}月</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Top Performers */}
                            <div className="bg-gradient-to-br from-[#63a6b0]/10 to-cyan-600/5 border border-[#63a6b0]/30 rounded-3xl p-8">
                                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                    <Medal className="text-amber-400" />
                                    本月最佳夥伴 TOP 3
                                </h3>
                                <div className="grid grid-cols-3 gap-6">
                                    {[
                                        { rank: 1, name: '陳建宏', revenue: 580000, level: 'platinum', icon: '🥇' },
                                        { rank: 2, name: '綠色企業聯盟協會', revenue: 2100000, level: 'diamond', icon: '🥈' },
                                        { rank: 3, name: '永續管理顧問有限公司', revenue: 350000, level: 'gold', icon: '🥉' }
                                    ].map((performer, i) => (
                                        <div key={performer.rank} className="text-center">
                                            <div className="text-4xl mb-2">{performer.icon}</div>
                                            <h4 className="font-bold text-lg">{performer.name}</h4>
                                            <div className="text-sm text-slate-400 mb-2">{getTierConfig(performer.level).name}</div>
                                            <div className="text-2xl font-black text-emerald-400">{formatCurrency(performer.revenue)}</div>
                                            <div className="text-xs text-slate-500">本月業績</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            {/* Partner Modal */}
            <AnimatePresence>
                {showPartnerModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
                        onClick={() => setShowPartnerModal(false)}
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
                                新增夥伴
                            </h3>
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-widest text-slate-500">姓名/公司</label>
                                        <input type="text" className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 focus:border-[#63a6b0] outline-none transition-colors" placeholder="輸入名稱" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-widest text-slate-500">類型</label>
                                        <select className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 focus:border-[#63a6b0] outline-none transition-colors">
                                            <option value="individual">個人</option>
                                            <option value="agency">代理商</option>
                                            <option value="enterprise">企業</option>
                                            <option value="consultant">顧問</option>
                                        </select>
                                    </div>
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
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-slate-500">所屬區域</label>
                                    <select className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 focus:border-[#63a6b0] outline-none transition-colors">
                                        <option value="north">北部</option>
                                        <option value="central">中部</option>
                                        <option value="south">南部</option>
                                        <option value="east">東部</option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 mt-8">
                                <button 
                                    onClick={() => setShowPartnerModal(false)}
                                    className="flex-1 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-bold transition-all"
                                >
                                    取消
                                </button>
                                <button 
                                    onClick={() => {
                                        setShowPartnerModal(false);
                                        alert('夥伴已新增！');
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

export default AgencyAlliancePage;
