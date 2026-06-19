// src/components/profile/OmniHut.tsx
import React, { useState } from 'react';
import {
  User,
  Settings,
  Sun,
  Moon,
  Palette,
  Coins,
  ArrowRight,
  Layout,
  Zap,
  Award,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { omniLogger, LogCategory } from '../../services/omniLogger';

export const OmniHut: React.FC = () => {
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [activeTheme, setActiveTheme] = useState('default');

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    // In a real app, this would toggle a global context or class on the <html> tag
    omniLogger.info(LogCategory.USER_ACTION, 'Theme toggled', {
      mode: !isDarkMode ? 'Dark' : 'Light',
    });
  };

  return (
    <div
      className={`min-h-screen ${isDarkMode ? 'bg-slate-950 text-white' : 'bg-slate-100 text-slate-900'} p-4 md:p-8 pb-32 animate-in fade-in transition-colors duration-500`}
    >
      {/* 🏠 Header: The Hut Identity */}
      <div
        className={`${isDarkMode ? 'bg-slate-900 border-white/10' : 'bg-white border-slate-200'} border rounded-3xl p-8 mb-8 shadow-xl flex flex-col md:flex-row items-center gap-8`}
      >
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-3xl font-bold text-white shadow-2xl">
            JC
          </div>
          <div className="absolute -bottom-2 -right-2 bg-yellow-400 text-black text-xs font-black px-2 py-1 rounded-full border-2 border-slate-900">
            LV.5
          </div>
        </div>

        <div className="flex-1 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
            <h1 className="text-3xl font-black">Juniper's Omni-Hut</h1>
            <span className="bg-cyan-500/10 text-cyan-500 text-xs px-2 py-1 rounded font-bold">
              Pro Member
            </span>
          </div>
          <p className={`${isDarkMode ? 'text-slate-400' : 'text-slate-500'} mb-4`}>
            善向永續小屋 - 您的數位資產與風格中心
          </p>
          <div className="flex items-center justify-center md:justify-start gap-4">
            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}
            >
              <Coins className="w-5 h-5 text-yellow-400" />
              <span className="font-bold text-lg">1,250</span>
            </div>
            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}
            >
              <Award className="w-5 h-5 text-purple-400" />
              <span className="font-bold text-sm">善向大使</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => navigate('/plan')}
            className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all ${isDarkMode ? 'bg-slate-800 hover:bg-slate-700 text-white' : 'bg-slate-200 hover:bg-slate-300 text-slate-900'}`}
          >
            <Zap className="w-4 h-4 text-yellow-400" /> 管理訂閱
          </button>
          <button
            className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 border transition-all ${isDarkMode ? 'border-white/10 hover:bg-white/5' : 'border-slate-300 hover:bg-slate-100'}`}
          >
            <Settings className="w-4 h-4" /> 設定
          </button>
        </div>
      </div>

      {/* 🎨 Theme Engine Section */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Palette className="w-5 h-5 text-pink-500" /> 風格與主題 (Theme Engine)
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Day/Night Toggle */}
          <div
            className={`${isDarkMode ? 'bg-slate-900 border-white/10' : 'bg-white border-slate-200'} border rounded-2xl p-6`}
          >
            <h3 className="font-bold mb-4">日夜模式切換 (Mode)</h3>
            <div className="flex gap-4">
              <button
                onClick={() => !isDarkMode && toggleTheme()} // Only toggle if not already dark
                className={`flex-1 py-4 rounded-xl flex flex-col items-center gap-2 border-2 transition-all ${isDarkMode ? 'border-cyan-500 bg-cyan-900/20 text-cyan-400' : 'border-transparent bg-slate-100 text-slate-400 hover:bg-slate-200'}`}
              >
                <Moon className="w-6 h-6" /> <span className="text-sm font-bold">Dark Night</span>
              </button>
              <button
                onClick={() => isDarkMode && toggleTheme()} // Only toggle if not already light
                className={`flex-1 py-4 rounded-xl flex flex-col items-center gap-2 border-2 transition-all ${!isDarkMode ? 'border-amber-500 bg-amber-50 text-amber-600' : 'border-transparent bg-slate-800 text-slate-500 hover:bg-slate-700'}`}
              >
                <Sun className="w-6 h-6" /> <span className="text-sm font-bold">Bright Day</span>
              </button>
            </div>
          </div>

          {/* Premium Templates */}
          <div
            className={`${isDarkMode ? 'bg-slate-900 border-white/10' : 'bg-white border-slate-200'} border rounded-2xl p-6`}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold">付費主題模板 (Premium Templates)</h3>
              <span className="text-xs bg-pink-500 text-white px-2 py-1 rounded font-bold">
                PRO ONLY
              </span>
            </div>

            <div className="space-y-3">
              <div
                className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer ${activeTheme === 'default' ? (isDarkMode ? 'border-cyan-500 bg-cyan-900/10' : 'border-cyan-500 bg-cyan-50') : isDarkMode ? 'border-white/5 bg-slate-800' : 'border-slate-200 bg-slate-50'}`}
                onClick={() => setActiveTheme('default')}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-700"></div>
                  <span className="text-sm font-bold">預設 (Default)</span>
                </div>
                {activeTheme === 'default' && (
                  <div className="w-2 h-2 rounded-full bg-cyan-500"></div>
                )}
              </div>

              <div className="p-3 rounded-xl border border-dashed border-indigo-500/30 bg-gradient-to-r from-indigo-900/20 to-purple-900/20 opacity-70 hover:opacity-100 transition-opacity cursor-pointer md:cursor-not-allowed group">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600"></div>
                    <div>
                      <span className="text-sm font-bold block">深海 (Deep Ocean)</span>
                      <span className="text-[10px] text-pink-400">需 Pro 訂閱</span>
                    </div>
                  </div>
                  <Coins className="w-4 h-4 text-yellow-500" />
                </div>
              </div>

              <div className="p-3 rounded-xl border border-dashed border-amber-500/30 bg-gradient-to-r from-amber-900/20 to-yellow-900/20 opacity-70 hover:opacity-100 transition-opacity cursor-pointer md:cursor-not-allowed group">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-yellow-600"></div>
                    <div>
                      <span className="text-sm font-bold block">黃金起源 (Genesis Gold)</span>
                      <span className="text-[10px] text-yellow-500">需 Enterprise 訂閱</span>
                    </div>
                  </div>
                  <Coins className="w-4 h-4 text-yellow-500" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 📦 Assets Vault Placeholder */}
      <div
        className={`${isDarkMode ? 'bg-slate-900 border-white/10' : 'bg-white border-slate-200'} border rounded-2xl p-6`}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Layout className="w-5 h-5 text-emerald-500" /> 我的資產庫 (My Vault)
          </h2>
          <button
            onClick={() => {
              alert('正在匯出資產證明 PDF...\n(模擬：檔案 export_assets_v10.pdf 下載中)');
              omniLogger.info(LogCategory.USER_ACTION, 'Assets Exported');
            }}
            className={`text-xs px-3 py-1 rounded-lg border font-bold transition-all ${isDarkMode ? 'border-white/20 hover:bg-white/10' : 'border-slate-300 hover:bg-slate-100'}`}
          >
            匯出證明 (Export PDF)
          </button>
        </div>
        <p className={`${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
          您收藏的 影響力證明、企業報告書、以及 AI 道具皆存放於此。資料庫連接中...
        </p>
      </div>
    </div>
  );
};
