'use client';

import React, { useState, useEffect } from 'react';
import { OmniBaseCard } from '@/components/ui/omni/OmniBaseCard';
import { OmniButton } from '@/components/ui/omni/OmniButton';
import { Building2, User, Save, ShieldCheck, Mail, Phone, MapPin, Hash, CheckCircle2 } from 'lucide-react';

export default function ProfilePage() {
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  // 企業資訊狀態
  const [companyInfo, setCompanyInfo] = useState({
    name: 'ESG GO 示範企業',
    registrationId: '12345678',
    industry: '半導體製造業',
    address: '台北市信義區信義路五段7號',
    foundedYear: '1995',
  });

  // 用戶資料狀態
  const [userInfo, setUserInfo] = useState({
    fullName: '陳永續 (Sustainability Manager)',
    title: '永續發展部 經理',
    email: 'esg.admin@esggo.com',
    phone: '+886 2 1234 5678',
  });

  const handleSave = () => {
    setLoading(true);
    // 模擬存檔至後端
    setTimeout(() => {
      setLoading(false);
      setSaved(true);
      // 3秒後隱藏成功訊息
      setTimeout(() => setSaved(false), 3000);
      
      // 也可以將資料存入 localStorage 供 Zero-Compute Engine 讀取
      localStorage.setItem('esg_company_info', JSON.stringify(companyInfo));
      localStorage.setItem('esg_user_info', JSON.stringify(userInfo));
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 p-4 md:p-8 font-sans">
      <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        {/* Header Area */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-6 border-b border-slate-200">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-teal-100 flex items-center justify-center border border-teal-200 shadow-sm relative group">
              <Building2 className="text-teal-600 relative z-10" size={28} />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-bold rounded">資料齊全</span>
                <span className="text-xs font-mono text-slate-500 uppercase tracking-widest">Global Profile</span>
              </div>
              <h1 className="text-3xl font-black text-slate-800 tracking-tight">企業與用戶基本資料</h1>
              <p className="text-slate-500 text-sm mt-1">此處設定的資料將自動帶入年度 ESG 永續報告書中</p>
            </div>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <OmniButton 
              variant="primary" 
              icon={<Save size={16}/>} 
              onClick={handleSave} 
              isLoading={loading} 
              className="flex-1 md:flex-none !bg-teal-600 hover:!bg-teal-700"
            >
              儲存並同步至報告庫
            </OmniButton>
          </div>
        </header>

        {saved && (
          <div className="bg-green-50 border border-green-200 p-4 rounded-xl flex items-center gap-3 text-green-800">
            <CheckCircle2 size={20} />
            <p className="font-bold">資料已成功儲存！</p>
            <p className="text-sm">您的永續報告將自動套用最新設定。</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 企業資訊區塊 */}
          <OmniBaseCard variant="default" className="p-6">
            <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <Building2 size={20} />
              </div>
              <h2 className="text-xl font-bold text-slate-800">企業資訊 (Company Info)</h2>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">企業全銜</label>
                <input 
                  type="text" 
                  value={companyInfo.name}
                  onChange={(e) => setCompanyInfo({...companyInfo, name: e.target.value})}
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition"
                  placeholder="例如：善向永續股份有限公司"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1 flex items-center gap-1"><Hash size={14}/> 統一編號</label>
                  <input 
                    type="text" 
                    value={companyInfo.registrationId}
                    onChange={(e) => setCompanyInfo({...companyInfo, registrationId: e.target.value})}
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">成立年份</label>
                  <input 
                    type="text" 
                    value={companyInfo.foundedYear}
                    onChange={(e) => setCompanyInfo({...companyInfo, foundedYear: e.target.value})}
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">所屬產業別</label>
                <select 
                  value={companyInfo.industry}
                  onChange={(e) => setCompanyInfo({...companyInfo, industry: e.target.value})}
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none bg-white transition"
                >
                  <option>半導體製造業</option>
                  <option>金融保險業</option>
                  <option>生技醫療業</option>
                  <option>傳統製造業</option>
                  <option>資訊軟體服務業</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1 flex items-center gap-1"><MapPin size={14}/> 登記地址</label>
                <input 
                  type="text" 
                  value={companyInfo.address}
                  onChange={(e) => setCompanyInfo({...companyInfo, address: e.target.value})}
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition"
                />
              </div>
            </div>
          </OmniBaseCard>

          {/* 報告聯絡人區塊 */}
          <OmniBaseCard variant="default" className="p-6">
            <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
              <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                <User size={20} />
              </div>
              <h2 className="text-xl font-bold text-slate-800">報告聯絡人 (User Profile)</h2>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">負責人 / 聯絡人姓名</label>
                <input 
                  type="text" 
                  value={userInfo.fullName}
                  onChange={(e) => setUserInfo({...userInfo, fullName: e.target.value})}
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">職稱 / 部門</label>
                <input 
                  type="text" 
                  value={userInfo.title}
                  onChange={(e) => setUserInfo({...userInfo, title: e.target.value})}
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1 flex items-center gap-1"><Mail size={14}/> 電子信箱</label>
                <input 
                  type="email" 
                  value={userInfo.email}
                  onChange={(e) => setUserInfo({...userInfo, email: e.target.value})}
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1 flex items-center gap-1"><Phone size={14}/> 聯絡電話</label>
                <input 
                  type="text" 
                  value={userInfo.phone}
                  onChange={(e) => setUserInfo({...userInfo, phone: e.target.value})}
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition"
                />
              </div>
            </div>

            <div className="mt-8 p-4 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-600">
              <ShieldCheck className="inline-block text-teal-600 mr-2" size={16}/>
              此處輸入的個人資料將受到 <strong>ESGGO 5T 隱私遮蔽協議</strong> 與 <strong>台灣個人資料保護法</strong> 保護。在匯出報告時，我們會自動依據您的隱私設定進行適當的遮蔽 (ZKP 處理)。
            </div>
          </OmniBaseCard>
        </div>

      </div>
    </div>
  );
}
