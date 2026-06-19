import React, { useState } from 'react';
import { Language } from '@/types';
import { Settings as SettingsIcon, Globe, Bell, Shield, Palette, Database } from 'lucide-react';

export const Settings: React.FC<{ language: Language }> = ({ language }) => {
  const isZh = language === 'zh-TW';
  const [activeTab, setActiveTab] = useState('general');

  const tabs = [
    { id: 'general', label: isZh ? '一般設定' : 'General', icon: SettingsIcon },
    { id: 'appearance', label: isZh ? '外觀主題' : 'Appearance', icon: Palette },
    { id: 'notifications', label: isZh ? '通知設定' : 'Notifications', icon: Bell },
    { id: 'security', label: isZh ? '安全隱私' : 'Security', icon: Shield },
    { id: 'data', label: isZh ? '數據管理' : 'Data', icon: Database },
  ];

  return (
    <div className="p-6 space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
          <SettingsIcon className="text-slate-400 w-6 h-6" />
          {isZh ? '系統設定' : 'System Settings'}
        </h1>
        <p className="text-slate-400 mt-1 text-sm font-medium">
          {isZh ? '自訂您的 ESGss 體驗' : 'Customize your ESGss experience'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Tabs */}
        <div className="lg:col-span-1 space-y-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === tab.id
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-[0_0_10px_rgba(34,211,238,0.2)]'
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span className="font-semibold">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3 bg-slate-900/50 border border-cyan-500/20 rounded-3xl p-6 backdrop-blur-sm">
          {activeTab === 'general' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-white mb-4">
                {isZh ? '一般設定' : 'General Settings'}
              </h2>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                  <div>
                    <h3 className="text-white font-semibold">{isZh ? '語言' : 'Language'}</h3>
                    <p className="text-sm text-slate-400">
                      {isZh ? '選擇介面語言' : 'Choose interface language'}
                    </p>
                  </div>
                  <select className="bg-slate-800 border border-slate-600 text-white rounded-lg px-4 py-2 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none">
                    <option>繁體中文</option>
                    <option>English</option>
                  </select>
                </div>

                <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                  <div>
                    <h3 className="text-white font-semibold">{isZh ? '時區' : 'Timezone'}</h3>
                    <p className="text-sm text-slate-400">
                      {isZh ? '設定您的時區' : 'Set your timezone'}
                    </p>
                  </div>
                  <select className="bg-slate-800 border border-slate-600 text-white rounded-lg px-4 py-2 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none">
                    <option>GMT+8 (台北)</option>
                    <option>GMT+0 (UTC)</option>
                  </select>
                </div>

                <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                  <div>
                    <h3 className="text-white font-semibold">{isZh ? '自動儲存' : 'Auto Save'}</h3>
                    <p className="text-sm text-slate-400">
                      {isZh ? '自動儲存您的變更' : 'Automatically save changes'}
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600 peer-checked:shadow-[0_0_10px_rgba(8,145,178,0.5)]"></div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'appearance' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-white mb-4">
                {isZh ? '外觀主題' : 'Appearance'}
              </h2>

              <div className="grid grid-cols-3 gap-4">
                {['深色', '淺色', '自動'].map(theme => (
                  <div
                    key={theme}
                    className="bg-white/5 border-2 border-cyan-500/30 rounded-xl p-4 cursor-pointer hover:border-cyan-500 transition-colors hover:shadow-[0_0_15px_rgba(6,182,212,0.3)]"
                  >
                    <div className="aspect-video bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg mb-3"></div>
                    <p className="text-white text-center font-semibold">{theme}</p>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                <div>
                  <h3 className="text-white font-semibold">{isZh ? '動畫效果' : 'Animations'}</h3>
                  <p className="text-sm text-slate-400">
                    {isZh ? '啟用介面動畫' : 'Enable interface animations'}
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-slate-700 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600 peer-checked:shadow-[0_0_10px_rgba(8,145,178,0.5)]"></div>
                </label>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-white mb-4">
                {isZh ? '通知設定' : 'Notifications'}
              </h2>

              <div className="space-y-4">
                {[
                  {
                    title: isZh ? 'ESG 數據更新' : 'ESG Data Updates',
                    desc: isZh ? '當 ESG 數據更新時通知我' : 'Notify when ESG data updates',
                  },
                  {
                    title: isZh ? '任務提醒' : 'Task Reminders',
                    desc: isZh ? '任務到期前提醒' : 'Remind before tasks due',
                  },
                  {
                    title: isZh ? 'AI 分析完成' : 'AI Analysis Complete',
                    desc: isZh ? 'AI 分析完成時通知' : 'Notify when AI analysis completes',
                  },
                  {
                    title: isZh ? '系統更新' : 'System Updates',
                    desc: isZh ? '重要系統更新通知' : 'Important system updates',
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-4 bg-white/5 rounded-xl"
                  >
                    <div>
                      <h3 className="text-white font-semibold">{item.title}</h3>
                      <p className="text-sm text-slate-400">{item.desc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-slate-700 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600 peer-checked:shadow-[0_0_10px_rgba(8,145,178,0.5)]"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-white mb-4">
                {isZh ? '安全與隱私' : 'Security & Privacy'}
              </h2>

              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 mb-6 shadow-[0_0_10px_rgba(16,185,129,0.1)]">
                <p className="text-emerald-400 text-sm">
                  ✅ {isZh ? '您的帳戶安全狀態良好' : 'Your account security is good'}
                </p>
              </div>

              <div className="space-y-4">
                <button className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl p-4 text-left transition-colors">
                  <h3 className="font-semibold mb-1">{isZh ? '變更密碼' : 'Change Password'}</h3>
                  <p className="text-sm text-slate-400">
                    {isZh ? '上次更新: 30 天前' : 'Last updated: 30 days ago'}
                  </p>
                </button>

                <button className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl p-4 text-left transition-colors">
                  <h3 className="font-semibold mb-1">
                    {isZh ? '雙因素驗證' : 'Two-Factor Authentication'}
                  </h3>
                  <p className="text-sm text-slate-400">
                    {isZh ? '增強帳戶安全性' : 'Enhance account security'}
                  </p>
                </button>

                <button className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl p-4 text-left transition-colors">
                  <h3 className="font-semibold mb-1">{isZh ? '登入記錄' : 'Login History'}</h3>
                  <p className="text-sm text-slate-400">
                    {isZh ? '查看最近的登入活動' : 'View recent login activity'}
                  </p>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'data' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-white mb-4">
                {isZh ? '數據管理' : 'Data Management'}
              </h2>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-white/5 rounded-xl p-4 text-center">
                  <div className="text-3xl font-black text-emerald-400 mb-1">2.4 GB</div>
                  <div className="text-xs text-slate-400">{isZh ? '已使用空間' : 'Used Space'}</div>
                </div>
                <div className="bg-white/5 rounded-xl p-4 text-center">
                  <div className="text-3xl font-black text-blue-400 mb-1">1,847</div>
                  <div className="text-xs text-slate-400">{isZh ? '數據記錄' : 'Data Records'}</div>
                </div>
                <div className="bg-white/5 rounded-xl p-4 text-center">
                  <div className="text-3xl font-black text-purple-400 mb-1">98%</div>
                  <div className="text-xs text-slate-400">
                    {isZh ? '數據完整度' : 'Data Integrity'}
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <button className="w-full bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-400 rounded-xl p-4 font-semibold transition-colors">
                  {isZh ? '📊 匯出所有數據' : '📊 Export All Data'}
                </button>
                <button className="w-full bg-amber-600/20 hover:bg-amber-600/30 border border-amber-500/30 text-amber-400 rounded-xl p-4 font-semibold transition-colors">
                  {isZh ? '🔄 備份資料' : '🔄 Backup Data'}
                </button>
                <button className="w-full bg-rose-600/20 hover:bg-rose-600/30 border border-rose-500/30 text-rose-400 rounded-xl p-4 font-semibold transition-colors">
                  {isZh ? '🗑️ 清除快取' : '🗑️ Clear Cache'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
