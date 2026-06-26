'use client';

import Link from 'next/link';
import { useAuth } from '@/components/AuthProvider';
import LoginButton from '@/components/LoginButton';

export default function HomePage() {
  const { user, loading } = useAuth();

  return (
    <div style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 24, padding: '40px 20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 56, height: 56, borderRadius: 16, background: '#009EB0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Montserrat',sans-serif", fontWeight: 700, fontSize: 28, color: '#000' }}>E</div>
        <div>
          <h1 style={{ fontSize: 32, fontWeight: 700, fontFamily: "'Montserrat',sans-serif", color: 'var(--logo-text)' }}>ESGGO v5.0</h1>
          <p style={{ fontSize: 12, color: '#D4AF37', fontWeight: 700 }}>5T 萬能系統 · 永續數據治理平台</p>
        </div>
      </div>

      <p style={{ maxWidth: 520, textAlign: 'center', fontSize: 15, lineHeight: 1.7, color: 'var(--muted-color)' }}>
        歡迎來到 ESGGO 永續數據治理平台。透過 5T 協議（真→善→美→信→通），
        我們將 ESG 報告書生成、RAG 知識檢索、善向永續村投票治理融為一體。
      </p>

      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link href="/omni-center" style={{ padding: '12px 24px', borderRadius: 12, background: '#009EB0', color: '#fff', fontWeight: 600, fontSize: 14 }}>
          ◎ 進入萬能中心
        </Link>
        <Link href="/sustain-write/v5" style={{ padding: '12px 24px', borderRadius: 12, background: '#3B82F6', color: '#fff', fontWeight: 600, fontSize: 14 }}>
          📊 生成 ESG 報告
        </Link>
        <Link href="/village" style={{ padding: '12px 24px', borderRadius: 12, background: '#D4AF37', color: '#000', fontWeight: 600, fontSize: 14 }}>
          🌱 善向永續村
        </Link>
      </div>

      {!loading && (
        <div style={{ marginTop: 16, padding: '12px 20px', borderRadius: 10, background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}>
          {user ? (
            <p style={{ fontSize: 14 }}>
              已登入：<strong>{user.displayName || user.email}</strong>
            </p>
          ) : (
            <LoginButton user={user} />
          )}
        </div>
      )}
    </div>
  );
}
