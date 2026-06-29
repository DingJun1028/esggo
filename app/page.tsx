'use client';

import Link from 'next/link';
import { useAuth } from '@/components/AuthProvider';
import LoginButton from '@/components/LoginButton';
import { OmniBaseCard } from '@/components/omni-base-card';

export default function HomePage() {
  const { user, loading } = useAuth();

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center gap-6 py-10 px-5">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-accentTeal flex items-center justify-center font-['Montserrat'] font-bold text-3xl text-black shadow-lg">E</div>
        <div>
          <h1 className="text-3xl font-bold font-['Montserrat'] text-accentTeal">ESGGO v5.0</h1>
          <p className="text-xs text-accentGold font-bold">5T 萬能系統 · 永續數據治理平台</p>
        </div>
      </div>

      <p className="max-w-xl text-center text-[15px] leading-relaxed text-textSecondary">
        歡迎來到 ESGGO 永續數據治理平台。透過 5T 協議（真→善→美→信→通），
        我們將 ESG 報告書生成、RAG 知識檢索、善向永續村投票治理融為一體。
      </p>

      <div className="flex gap-4 flex-wrap justify-center mt-2">
        <Link href="/omni-center" className="px-6 py-3 rounded-xl bg-accentTeal text-white font-semibold text-sm hover:opacity-90 transition-opacity shadow-md hover:shadow-lg">
          ◎ 進入萬能中心
        </Link>
        <Link href="/sustain-write/v5" className="px-6 py-3 rounded-xl bg-accentBlue text-white font-semibold text-sm hover:opacity-90 transition-opacity shadow-md hover:shadow-lg">
          📊 生成 ESG 報告
        </Link>
        <Link href="/village" className="px-6 py-3 rounded-xl bg-accentGold text-black font-semibold text-sm hover:opacity-90 transition-opacity shadow-md hover:shadow-lg">
          🌱 善向永續村
        </Link>
        <Link href="/wiki" className="px-6 py-3 rounded-xl bg-accentPurple text-white font-semibold text-sm hover:opacity-90 transition-opacity shadow-md hover:shadow-lg">
          📚 萬能知識庫
        </Link>
      </div>

      {!loading && (
        <div className="mt-8 w-full max-w-md">
          <OmniBaseCard variant="liquid-glass" className="items-center text-center" statusIndicator={user ? 'trustworthy' : 'unverified'}>
            {user ? (
              <p className="text-sm">
                已登入：<strong className="text-accentTeal ml-2">{user.displayName || user.email}</strong>
              </p>
            ) : (
              <LoginButton user={user} />
            )}
          </OmniBaseCard>
        </div>
      )}
    </div>
  );
}
