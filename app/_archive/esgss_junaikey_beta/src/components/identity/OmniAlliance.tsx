// src/components/community/OmniAlliance.tsx
import React, { useState, useEffect } from 'react';
import {
  Users,
  Copy,
  Share2,
  Award,
  Zap,
  Coins,
  Crown,
  ChevronRight,
  CheckCircle2,
  Star,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { omniLogger, LogCategory } from '../../services/omniLogger';

export const OmniAlliance: React.FC = () => {
  const navigate = useNavigate();
  const [inviteCode, setInviteCode] = useState('ESG-888');
  const [inviteCount, setInviteCount] = useState(5);
  const [isCopied, setIsCopied] = useState(false);
  const [coinsEarned, setCoinsEarned] = useState(500);

  useEffect(() => {
    // Mock user invite code generation
    const storedCode = localStorage.getItem('omni_invite_code');
    if (storedCode) {
      setInviteCode(storedCode);
    } else {
      const newCode = 'ESG-' + Math.floor(1000 + Math.random() * 9000);
      localStorage.setItem('omni_invite_code', newCode);
      setInviteCode(newCode);
    }
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteCode);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
    omniLogger.info(LogCategory.USER_ACTION, 'Invite code copied', { code: inviteCode });
  };

  return (
    <div className="min-h-screen bg-slate-950 p-4 md:p-8 pb-32 animate-in fade-in">
      {/* 🎖️ Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#8B0000] to-[#FF4500] p-8 md:p-12 mb-8 shadow-2xl border border-white/10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <div className="inline-flex items-center gap-2 bg-black/30 px-3 py-1 rounded-full text-xs font-bold text-yellow-400 mb-4 border border-yellow-400/30">
              <Crown className="w-3 h-3" /> 善向聯盟 (Omni-Alliance)
            </div>
            <h1 className="text-4xl font-black text-white mb-4">加入聯盟，放大影響力</h1>
            <p className="text-white/80 max-w-xl text-lg">
              這不僅是推廣，更是為了地球的未來。邀請夥伴加入 ESG
              善向永續生態系，您與夥伴將共享專屬的頂級權益。
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 flex flex-col items-center gap-4 min-w-[280px]">
            <span className="text-xs font-bold text-white/60 uppercase tracking-widest">
              您的專屬邀請碼
            </span>
            <div className="text-4xl font-mono font-black text-white tracking-widest">
              {inviteCode}
            </div>
            <div className="flex gap-2 w-full">
              <button
                onClick={handleCopy}
                className={`flex-1 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${isCopied ? 'bg-green-500 text-white' : 'bg-white text-red-900 hover:bg-gray-100'}`}
              >
                {isCopied ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" /> 已複製
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" /> 複製代碼
                  </>
                )}
              </button>
              <button
                onClick={() => {
                  alert('已生成「善向聯盟邀請卡」！\n(模擬：圖片已儲存至裝置)');
                  omniLogger.info(LogCategory.USER_ACTION, 'Social Card Shared');
                }}
                className="py-3 px-4 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold flex items-center justify-center transition-all"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 💎 Elite Benefits */}
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
        <Award className="text-yellow-400" /> 聯盟專屬權益 (Elite Benefits)
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {/* Benefit 1: 雙重權益 (Dual Benefits) */}
        <div className="bg-slate-900 border border-blue-500/30 rounded-2xl p-6 relative overflow-hidden group hover:border-blue-500 transition-colors">
          <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-bl-xl">
            核心福利
          </div>
          <div className="flex items-center justify-start gap-4 mb-4">
            <div className="w-12 h-12 bg-blue-900/30 rounded-full flex items-center justify-center text-blue-500">
              <Zap className="w-6 h-6" />
            </div>
            <div className="text-2xl font-black text-white">+</div>
            <div className="w-12 h-12 bg-yellow-900/30 rounded-full flex items-center justify-center text-yellow-500">
              <Coins className="w-6 h-6" />
            </div>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">影響力與收益兼得</h3>
          <div className="text-2xl font-black text-blue-400 mb-2">
            Proof + Coins <span className="text-sm text-slate-500 font-normal">雙重賦能</span>
          </div>
          <p className="text-slate-400 text-sm mb-4">
            聯盟成員專屬特權。不僅獲得國際級的「SROI
            影響力證明」，更能同時賺取「善向幣」收益。兩者皆得，無需取捨。
          </p>
          <button className="w-full py-2 bg-blue-600/20 hover:bg-blue-600 text-blue-400 hover:text-white rounded-lg text-sm font-bold transition-all">
            立即開通
          </button>
        </div>

        {/* Benefit 2: Coin Multiplier */}
        <div className="bg-slate-900 border border-yellow-500/30 rounded-2xl p-6 hover:border-yellow-500 transition-colors">
          <div className="w-12 h-12 bg-yellow-900/30 rounded-full flex items-center justify-center mb-4 text-yellow-500">
            <Coins className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">善向幣加成</h3>
          <div className="text-3xl font-black text-yellow-500 mb-2">
            +100 <span className="text-sm text-slate-400 font-bold">Coins/人</span>
          </div>
          <p className="text-slate-400 text-sm mb-4">
            每成功邀請一位夥伴，雙方皆可獲得 100 善向幣。可用於 ESG Go! 商店升級 AI 代理。
          </p>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div className="bg-yellow-500 w-[60%] h-full"></div>
          </div>
          <div className="flex justify-between text-xs text-slate-500 mt-2">
            <span>目前累積: {coinsEarned}</span>
            <span>目標: 1000</span>
          </div>
        </div>

        {/* Benefit 3: Titles */}
        <div className="bg-slate-900 border border-purple-500/30 rounded-2xl p-6 hover:border-purple-500 transition-colors">
          <div className="w-12 h-12 bg-purple-900/30 rounded-full flex items-center justify-center mb-4 text-purple-500">
            <Crown className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">榮耀稱號解鎖</h3>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg font-bold text-purple-400">目前: 善向大使</span>
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
          </div>
          <p className="text-slate-400 text-sm mb-4">
            累積邀請 {inviteCount} 人。再邀請 5 人即可晉升為{' '}
            <span className="text-white font-bold">「永續領航者」</span>。
          </p>
          <div className="flex -space-x-2 overflow-hidden mb-4">
            {[1, 2, 3, 4, 5].map(i => (
              <div
                key={i}
                className="inline-block h-8 w-8 rounded-full ring-2 ring-slate-900 bg-slate-700 flex items-center justify-center text-xs text-white font-bold"
              >
                {String.fromCharCode(64 + i)}
              </div>
            ))}
            <div className="inline-block h-8 w-8 rounded-full ring-2 ring-slate-900 bg-slate-800 flex items-center justify-center text-xs text-slate-400 font-bold">
              +
            </div>
          </div>
        </div>
      </div>

      {/* 🌐 Network Visualization Placeholder */}
      <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-8 text-center">
        <Users className="w-12 h-12 text-slate-600 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-white mb-2">您的善向網絡 (My Network)</h3>
        <p className="text-slate-400">
          邀請功能已就緒。開始分享您的代碼，看著您的 ESG 影響力網絡不斷擴大。
        </p>
      </div>
    </div>
  );
};
