// @ts-nocheck
'use client';

import React, { useState } from 'react';

import {
  Users,
  MessageSquare,
  Heart,
  Share2,
  Eye,
  ThumbsUp,
  Award,
  Globe,
  Leaf,
  TrendingUp,
  Star,
  MapPin,
  Calendar,
  Search,
  Filter,
  Plus,
  ChevronRight,
  Zap,
  ShieldCheck,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { OmniBaseCard } from '@/components/ui/omni/OmniBaseCard';
import { OmniBadge } from '@/components/ui/omni/OmniBadge';
import { OmniButton } from '@/components/ui/omni/OmniButton';

/* ─── Types ─── */
interface CommunityPost {
  id: string;
  author: string;
  avatar: string;
  org: string;
  title: string;
  content: string;
  tags: string[];
  likes: number;
  comments: number;
  views: number;
  timestamp: number;
  image?: string;
  liked?: boolean;
}

interface CommunityMember {
  id: string;
  name: string;
  avatar: string;
  org: string;
  role: string;
  points: number;
  badges: string[];
  joinedAt: string;
}

/* ─── Mock Data ─── */
const POSTS: CommunityPost[] = [
  {
    id: 'post-001',
    author: '林永續',
    avatar: '🌱',
    org: '綠色科技',
    title: '我們公司剛完成首次碳盤查！',
    content:
      '經過三個月的努力，我們終於完成了 Scope 1 和 Scope 2 的碳盤查。過程中遇到不少挑戰，但透過 ESGGO 的 5T 協議驗證，數據品質得到了顯著提升。分享一些心得給大家...',
    tags: ['碳盤查', '5T 協議', '經驗分享'],
    likes: 45,
    comments: 12,
    views: 234,
    timestamp: Date.now() - 3600000,
    liked: false,
  },
  {
    id: 'post-002',
    author: '王顧問',
    avatar: '📊',
    org: '永續顧問',
    title: 'GRI G4 報告撰寫技巧分享',
    content:
      '撰寫 GRI G4 報告時，最容易忽略的是重大主題的界定。建議大家先進行利害關係人議合，再決定報告邊界。以下是我整理的檢查清單...',
    tags: ['GRI', '報告撰寫', '最佳實踐'],
    likes: 78,
    comments: 23,
    views: 456,
    timestamp: Date.now() - 7200000,
    liked: true,
  },
  {
    id: 'post-003',
    author: '張分析師',
    avatar: '🔍',
    org: '投資研究',
    title: 'ESG 評級對融資成本的影響分析',
    content:
      '根據我們的研究，ESG 評級每提升一個等級，企業融資成本平均降低 15-20 個基點。這對於中小企業來說是一個很強的激勵...',
    tags: ['ESG 評級', '融資', '研究'],
    likes: 92,
    comments: 34,
    views: 678,
    timestamp: Date.now() - 86400000,
    liked: false,
  },
  {
    id: 'post-004',
    author: '陳廠長',
    avatar: '🏭',
    org: '製造業',
    title: '供應鏈碳排數據收集經驗',
    content:
      'Scope 3 的數據收集一直是我們最大的挑戰。經過多次嘗試，我們建立了一套有效的供應商數據收集流程，現在分享給大家...',
    tags: ['供應鏈', 'Scope 3', '數據收集'],
    likes: 56,
    comments: 18,
    views: 345,
    timestamp: Date.now() - 172800000,
    liked: true,
  },
];

const MEMBERS: CommunityMember[] = [
  {
    id: 'mem-001',
    name: '林永續',
    avatar: '🌱',
    org: '綠色科技',
    role: 'CSO',
    points: 2450,
    badges: ['🏆', '🌟', '📊'],
    joinedAt: '2025-06-15',
  },
  {
    id: 'mem-002',
    name: '王顧問',
    avatar: '📊',
    org: '永續顧問',
    role: '資深顧問',
    points: 3890,
    badges: ['🏆', '🌟', '📜', '🔗'],
    joinedAt: '2025-03-20',
  },
  {
    id: 'mem-003',
    name: '張分析師',
    avatar: '🔍',
    org: '投資研究',
    role: 'ESG 分析師',
    points: 1890,
    badges: ['🌟', '📊'],
    joinedAt: '2025-08-10',
  },
  {
    id: 'mem-004',
    name: '陳廠長',
    avatar: '🏭',
    org: '製造業',
    role: '廠長',
    points: 1560,
    badges: ['🏆', '🔗'],
    joinedAt: '2025-09-05',
  },
];

/* ─── Components ─── */

function PostCard({ post }: { post: CommunityPost }) {
  const timeAgo = (ts: number) => {
    const diff = Date.now() - ts;
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (hours < 1) return '剛剛';
    if (hours < 24) return `${hours} 小時前`;
    return `${days} 天前`;
  };

  return (
    <div
      className="bg-white rounded-xl border border-slate-100 p-5 hover:shadow-md transition-all"
    >
      {/* Author */}
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-xl">
          {post.avatar}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-[#003262]">{post.author}</span>
            <span className="text-[10px] text-slate-400">·</span>
            <span className="text-[10px] text-slate-400">{post.org}</span>
          </div>
          <span className="text-[10px] text-slate-300">{timeAgo(post.timestamp)}</span>
        </div>
      </div>

      {/* Content */}
      <h3 className="text-sm font-bold text-[#003262] mb-2">{post.title}</h3>
      <p className="text-xs text-slate-500 leading-relaxed line-clamp-3 mb-3">{post.content}</p>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {post.tags.map((tag) => (
          <span
            key={tag}
            className="text-[9px] px-2 py-0.5 bg-cyan-50 text-cyan-600 rounded-full font-medium"
          >
            #{tag}
          </span>
        ))}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-50">
        <div className="flex items-center gap-4">
          <button
            className={cn(
              'flex items-center gap-1 text-xs transition-colors',
              post.liked ? 'text-rose-500' : 'text-slate-400 hover:text-rose-500'
            )}
          >
            <Heart size={14} className={post.liked ? 'fill-current' : ''} />
            {post.likes}
          </button>
          <button className="flex items-center gap-1 text-xs text-slate-400 hover:text-cyan-600 transition-colors">
            <MessageSquare size={14} />
            {post.comments}
          </button>
          <span className="flex items-center gap-1 text-xs text-slate-300">
            <Eye size={14} />
            {post.views}
          </span>
        </div>
        <button className="p-1.5 hover:bg-slate-50 rounded-lg transition-colors">
          <Share2 size={14} className="text-slate-400" />
        </button>
      </div>
    </div>
  );
}

function MemberCard({ member }: { member: CommunityMember }) {
  return (
    <div
      whileHover={{ y: -2 }}
      className="bg-white rounded-xl border border-slate-100 p-4 hover:shadow-md transition-all"
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-2xl">
          {member.avatar}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-bold text-[#003262]">{member.name}</h4>
          <p className="text-[10px] text-slate-400">
            {member.role} · {member.org}
          </p>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          {member.badges.map((badge, i) => (
            <span key={i} className="text-sm">
              {badge}
            </span>
          ))}
        </div>
        <span className="text-[10px] font-mono font-bold text-[#003262]">{member.points} pts</span>
      </div>
    </div>
  );
}

/* ─── Main Page ─── */
export default function VillagePage() {
  const [activeTab, setActiveTab] = useState<'feed' | 'members' | 'leaderboard'>('feed');

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8">
      <div className="max-w-[1200px] mx-auto space-y-6">
        {/* ─── Header ─── */}
        <header className="bg-white rounded-2xl border border-slate-100 p-6 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-violet-50 rounded-full blur-3xl breathing-glow" />
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg breathing-glow">
                <Users size={28} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-[#003262] tracking-tight">社群村落</h1>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  Village · UGC 內容 · 連結用戶
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-2xl font-black text-[#003262]">{MEMBERS.length}</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase">成員</p>
              </div>
              <div className="w-px h-10 bg-slate-100" />
              <div className="text-right">
                <p className="text-2xl font-black text-violet-600">{POSTS.length}</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase">貼文</p>
              </div>
            </div>
          </div>
        </header>

        {/* ─── Tab Navigation ─── */}
        <div className="flex gap-2">
          {[
            { id: 'feed' as const, label: '動態牆', icon: MessageSquare },
            { id: 'members' as const, label: '社群成員', icon: Users },
            { id: 'leaderboard' as const, label: '排行榜', icon: Award },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all',
                activeTab === tab.id
                  ? 'bg-[#003262] text-white shadow-md'
                  : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'
              )}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* ─── Content ─── */}
        {activeTab === 'feed' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              {/* New Post */}
              <OmniBaseCard className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#003262] flex items-center justify-center text-white text-sm font-bold">
                    U
                  </div>
                  <input
                    type="text"
                    placeholder="分享你的 ESG 經驗..."
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
                  />
                  <OmniButton
                    variant="primary"
                    size="sm"
                    icon={<Plus size={14} />}
                    className="bg-[#003262] hover:bg-[#002244] text-white"
                  >
                    發布
                  </OmniButton>
                </div>
              </OmniBaseCard>

              {/* Posts */}
              {POSTS.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              <OmniBaseCard className="p-4">
                <h3 className="text-sm font-bold text-[#003262] mb-3">熱門標籤</h3>
                <div className="flex flex-wrap gap-2">
                  {[
                    '碳盤查',
                    '5T 協議',
                    'GRI',
                    '供應鏈',
                    'ESG 評級',
                    '報告撰寫',
                    'Scope 3',
                    'ZKP',
                  ].map((tag) => (
                    <button
                      key={tag}
                      className="text-[10px] px-2 py-1 bg-slate-50 text-slate-500 rounded-full hover:bg-cyan-50 hover:text-cyan-600 transition-colors"
                    >
                      #{tag}
                    </button>
                  ))}
                </div>
              </OmniBaseCard>

              <OmniBaseCard className="p-4">
                <h3 className="text-sm font-bold text-[#003262] mb-3">推薦成員</h3>
                <div className="space-y-2">
                  {MEMBERS.slice(0, 3).map((member) => (
                    <div key={member.id} className="flex items-center gap-2 py-1.5">
                      <span className="text-lg">{member.avatar}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-[#003262] truncate">{member.name}</p>
                        <p className="text-[9px] text-slate-400">{member.role}</p>
                      </div>
                      <button className="text-[9px] font-bold text-cyan-600 hover:text-cyan-800">
                        追蹤
                      </button>
                    </div>
                  ))}
                </div>
              </OmniBaseCard>
            </div>
          </div>
        )}

        {activeTab === 'members' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {MEMBERS.map((member) => (
              <MemberCard key={member.id} member={member} />
            ))}
          </div>
        )}

        {activeTab === 'leaderboard' && (
          <OmniBaseCard className="p-5">
            <h3 className="text-base font-bold text-[#003262] mb-4 flex items-center gap-2">
              <Award size={16} className="text-amber-500" />
              學習積分排行榜
            </h3>
            <div className="space-y-2">
              {MEMBERS.sort((a, b) => b.points - a.points).map((member, i) => (
                <div
                  key={member.id}
                  className={cn(
                    'flex items-center gap-3 py-3 px-4 rounded-xl transition-colors',
                    i === 0
                      ? 'bg-amber-50 border border-amber-200'
                      : i === 1
                      ? 'bg-slate-50 border border-slate-200'
                      : i === 2
                      ? 'bg-orange-50 border border-orange-200'
                      : 'bg-white border border-slate-100'
                  )}
                >
                  <span
                    className={cn(
                      'w-8 h-8 rounded-full flex items-center justify-center text-sm font-black',
                      i === 0
                        ? 'bg-amber-500 text-white'
                        : i === 1
                        ? 'bg-slate-400 text-white'
                        : i === 2
                        ? 'bg-orange-500 text-white'
                        : 'bg-slate-100 text-slate-500'
                    )}
                  >
                    {i + 1}
                  </span>
                  <span className="text-2xl">{member.avatar}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-[#003262]">{member.name}</p>
                    <p className="text-[10px] text-slate-400">
                      {member.role} · {member.org}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    {member.badges.map((badge, j) => (
                      <span key={j} className="text-sm">
                        {badge}
                      </span>
                    ))}
                  </div>
                  <span className="text-sm font-mono font-bold text-[#003262]">
                    {member.points}
                  </span>
                </div>
              ))}
            </div>
          </OmniBaseCard>
        )}
      </div>
    </div>
  );
}
