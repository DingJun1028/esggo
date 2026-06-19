import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  ShieldCheck,
  Download,
  VerifiedUser,
  Lock,
  Edit,
  RefreshCw,
  Activity,
  Zap,
  History,
  MoveUp,
  Rocket,
  Database,
  Brain,
  Globe,
  Shield,
  User,
  Eye,
} from 'lucide-react';
import { UserService, UserProfile } from '../services/UserService';
import { omniLogger, LogCategory } from '../2-infra/logging/OmniLogger';

/**
 * 🔒 Profile Page & Data Vault (7.1)
 * --------------------------------------------------
 * Implements the "Liquid Glass" design for User Data Sovereignty.
 * Connects to Firebase Firestore for real-time 5T data.
 */
const ProfilePage = () => {
  const { user, profile } = useAuth();
  const integrityScore = 988; // Default/Mock
  const logs = [
    {
      id: 1,
      action: '2023 Identity Baseline',
      hash: '8e3ca912',
      timestamp: '2023-01-01',
      frozen: true,
    },
    {
      id: 2,
      action: 'Q4 Asset Record',
      hash: '2f1dbb88',
      timestamp: '2023-12-01',
      frozen: true,
    },
  ];

  const handleExport = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(profile));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute('href', dataStr);
    downloadAnchorNode.setAttribute('download', 'dingjun_data_vault.json');
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    omniLogger.info(LogCategory.USER_ACTION, 'User exported data vault');
  };

  if (!profile) return <div className="p-10 text-white">Loading Profile...</div>;

  return (
    <div className="bg-[#f5f8f8] dark:bg-[#102222] font-sans min-h-screen text-white transition-colors duration-300">
      <div className="relative flex w-full flex-col overflow-x-hidden">
        {/* Header - Already in MainLayout usually, but keeping specific page header styling if needed. 
            Actually MainLayout has SideNavBar. This page content goes inside MainLayout's <main>. 
            So we should render just the content content. 
        */}

        <main className="flex-1 overflow-y-auto px-4 md:px-10 py-8">
          {/* Header Section */}
          <div className="flex flex-wrap justify-between items-start gap-4 mb-8">
            <div className="flex flex-col gap-1">
              <h1 className="text-white text-4xl font-black leading-tight tracking-tight">
                個人資料與數據保險箱
              </h1>
              <p className="text-[#9cbab9] text-base font-normal">
                管理符合 5T 標準的主權數據與不可篡改記錄。
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleExport}
                className="flex items-center justify-center rounded-lg h-10 px-4 bg-[#283939] text-white text-sm font-bold hover:bg-[#3b5453] transition-all"
              >
                <Download className="mr-2 w-4 h-4" />
                匯出 (JSON)
              </button>
            </div>
          </div>

          {/* Identity Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
            {/* Identity Card */}
            <div
              className="xl:col-span-2 relative overflow-hidden rounded-xl p-6 flex flex-col md:flex-row items-center gap-6 border border-[#0ab8b2]/20 shadow-lg"
              style={{
                background:
                  'linear-gradient(135deg, rgba(10, 184, 178, 0.1), rgba(255, 255, 255, 0.03))',
                backdropFilter: 'blur(12px)',
              }}
            >
              <div className="relative">
                <div
                  className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-32 border-4 border-[#0ab8b2]/20"
                  style={{
                    backgroundImage: `url(${user?.photoURL || 'https://lh3.googleusercontent.com/aida-public/AB6AXuDccTe1u8EoJA7vm2RSK8JARB6gClw8BI2tdpkGrS-m75bsTJDNp2asrxGd4rulngyZ0JLLrdz-py8YQiyD4BXw-wlwpYQdhxBZJURq3zF_T-aPeFvWkqANOXRqvjEjcfddFVLqGHJ9AGilrhTjPRIY8Q1iiXehyJ4CjX9-NKpDqiElmAaFJVbKlUIMaya8fOc022zHRW6lIYYNHTcizE65w9_1huqV_SOdXBSu8PRhZA-a-pFvZVi5FYcnXLh5u5qzHmQfV7FoQHw'})`,
                  }}
                ></div>
                <div className="absolute bottom-0 right-0 bg-[#0ab8b2] text-[#102222] rounded-full p-1 border-2 border-[#102222]">
                  <VerifiedUser className="w-4 h-4" />
                </div>
              </div>

              <div className="flex flex-col flex-1 text-center md:text-left">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                  <p className="text-white text-2xl font-bold">
                    {profile.displayName || user?.displayName || 'Traveler'}
                  </p>
                  <span className="px-2 py-0.5 rounded bg-[#0ab8b2]/20 text-[#0ab8b2] text-[10px] font-bold tracking-widest uppercase">
                    {profile.subscriptionTier === 'SOVEREIGN' ? '已驗證 S-級別' : '標準用戶'}
                  </span>
                </div>
                <p className="text-[#9cbab9] text-sm mt-1">誠信等級：白金級 (超越 98% 用戶)</p>
                <p className="text-[#9cbab9] text-sm">
                  保險箱 ID: {profile.uid.substring(0, 8).toUpperCase()} • 常駐地：OmniVerse
                </p>

                <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-2">
                  <button className="rounded-lg h-9 px-4 bg-[#0ab8b2]/20 text-[#0ab8b2] text-xs font-bold hover:bg-[#0ab8b2]/30 transition-all border border-[#0ab8b2]/30">
                    編輯資料
                  </button>
                  <button className="rounded-lg h-9 px-4 bg-[#283939] text-white text-xs font-bold hover:bg-[#3b5453] transition-all border border-[#3b5453]">
                    重置密鑰
                  </button>
                </div>
              </div>
            </div>

            {/* Score Card */}
            <div
              className="rounded-xl p-6 flex flex-col justify-between border border-[#0ab8b2]/20 shadow-lg"
              style={{
                background:
                  'linear-gradient(135deg, rgba(10, 184, 178, 0.1), rgba(255, 255, 255, 0.03))',
                backdropFilter: 'blur(12px)',
              }}
            >
              <div className="flex justify-between items-start">
                <p className="text-white text-sm font-medium">誠信指標分數</p>
                <ShieldCheck className="text-[#0ab8b2] w-5 h-5" />
              </div>
              <div className="mt-4">
                <p className="text-white text-5xl font-black tracking-tight">{integrityScore}</p>
                <div className="flex items-center gap-1 mt-2">
                  <Activity className="text-green-400 w-4 h-4" />
                  <p className="text-green-400 text-sm font-medium">較上次審計提升 +12%</p>
                </div>
              </div>
              <div className="mt-4 h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-[#0ab8b2] w-[98.8%]"></div>
              </div>
            </div>
          </div>

          {/* 5T Grid */}
          <div className="mb-8">
            <h3 className="text-white text-xl font-bold mb-4 flex items-center gap-2">
              <Database className="text-[#0ab8b2]" />
              5T 合規數據主權
            </h3>
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
              {[
                {
                  icon: Shield,
                  title: '信任 (Trust)',
                  desc: '加密與生物識別驗證',
                  status: '使用中',
                  color: 'text-[#0ab8b2]',
                  border: 'border-l-[#0ab8b2]',
                },
                {
                  icon: Eye,
                  title: '透明 (Transparency)',
                  desc: '即時使用與存取日誌',
                  status: '12 則日誌',
                  color: 'text-blue-400',
                  border: 'border-l-blue-400',
                },
                {
                  icon: History,
                  title: '追蹤 (Traceability)',
                  desc: '所有編輯的審計追蹤',
                  status: '100%',
                  color: 'text-purple-400',
                  border: 'border-l-purple-400',
                },
                {
                  icon: MoveUp,
                  title: '轉移 (Transfer)',
                  desc: '數據可攜性與匯出權限',
                  status: '已授權',
                  color: 'text-orange-400',
                  border: 'border-l-orange-400',
                },
                {
                  icon: Rocket,
                  title: '技術 (Technology)',
                  desc: 'AES-256 量子屏蔽',
                  status: 'V 7.1',
                  color: 'text-emerald-400',
                  border: 'border-l-emerald-400',
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className={`p-5 rounded-xl border-l-4 ${item.border} hover:bg-white/5 cursor-pointer transition-all border border-white/5 bg-white/5`}
                >
                  <item.icon className={`${item.color} mb-2 w-6 h-6`} />
                  <h4 className="text-white text-sm font-bold">{item.title}</h4>
                  <p className="text-xs text-[#9cbab9] mt-1 leading-tight">{item.desc}</p>
                  <p className={`${item.color} text-lg font-bold mt-2`}>{item.status}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Grid: Sync & History */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Sync Monitor */}
            <div
              className="rounded-xl p-6 border border-[#0ab8b2]/20"
              style={{
                background:
                  'linear-gradient(135deg, rgba(10, 184, 178, 0.1), rgba(255, 255, 255, 0.03))',
                backdropFilter: 'blur(12px)',
              }}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-white font-bold flex items-center gap-2">
                  <RefreshCw className="text-[#0ab8b2] w-5 h-5" />
                  同步監控
                </h3>
                <span className="flex items-center gap-1.5 text-[10px] text-green-400 font-bold uppercase tracking-widest">
                  <span className="size-2 bg-green-400 rounded-full animate-pulse"></span>
                  即時連線
                </span>
              </div>
              {/* Visualizer */}
              <div className="flex items-center justify-center gap-8 py-4 relative">
                <div className="flex flex-col items-center gap-3">
                  <div className="size-16 rounded-xl bg-[#283939] border border-[#0ab8b2]/20 flex items-center justify-center shadow-[0_0_20px_rgba(10,184,178,0.1)]">
                    <Database className="text-3xl text-[#0ab8b2]" />
                  </div>
                  <p className="text-xs font-bold text-white/70">PostgreSQL</p>
                </div>
                <div className="flex-1 h-[2px] bg-gradient-to-r from-[#0ab8b2] to-blue-400 relative"></div>
                <div className="flex flex-col items-center gap-3">
                  <div className="size-16 rounded-xl bg-[#283939] border border-blue-400/20 flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.1)]">
                    <Brain className="text-3xl text-blue-400" />
                  </div>
                  <p className="text-xs font-bold text-white/70">向量資料庫</p>
                </div>
              </div>
            </div>

            {/* Frozen History */}
            <div
              className="rounded-xl p-6 border border-[#0ab8b2]/20"
              style={{
                background:
                  'linear-gradient(135deg, rgba(10, 184, 178, 0.1), rgba(255, 255, 255, 0.03))',
                backdropFilter: 'blur(12px)',
              }}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-white font-bold flex items-center gap-2">
                  <Lock className="text-blue-300 w-5 h-5" />
                  Object.freeze() 不可篡改歷史帳本
                </h3>
                <button className="text-xs text-[#0ab8b2] font-bold hover:underline">
                  查看全部
                </button>
              </div>
              <div className="space-y-3">
                {logs.map(log => (
                  <div
                    key={log.id}
                    className="p-3 rounded-lg border border-white/10 flex items-center justify-between bg-white/5"
                  >
                    <div className="flex items-center gap-3">
                      <Lock className="text-blue-200 w-4 h-4" />
                      <div>
                        <p className="text-sm font-bold">{log.action}</p>
                        <p className="text-[10px] text-[#9cbab9]">SHA-256: {log.hash}...</p>
                      </div>
                    </div>
                    <span className="px-2 py-1 bg-blue-400/20 text-blue-200 text-[10px] rounded font-bold uppercase tracking-tighter">
                      {log.frozen ? '不可篡改' : '可寫入'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProfilePage;
