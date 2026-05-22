'use client';
import { Network, Gift } from 'lucide-react';

const agents = [
  { name: '永續聯盟先鋒', tier: 'Gold', goodcoins: 3850, referrals: 23, code: 'ESGGO-GOLD-2025', active: true },
  { name: '綠色推廣大使', tier: 'Silver', goodcoins: 1200, referrals: 8, code: 'ESGGO-SILV-2025', active: true },
];

export default function AgentsPage() {
  return (
    <div className="fade-in" style={{ maxWidth: 1000 }}>
      <div className="page-header">
        <div className="page-eyebrow"><Network size={12} /> 永續聯盟代理推廣碼 · 善向幣</div>
        <h1 className="page-title">代理專區 Agents</h1>
        <p className="page-sub">推廣 ESG GO 獲取善向幣 (GoodCoin) 獎勵</p>
      </div>

      <div className="g-auto">
        {agents.map((a, i) => (
          <div key={i} className="card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div>
                <div style={{ fontWeight: 800 }}>{a.name}</div>
                <span className="badge badge-gold">{a.tier} 代理</span>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#FDB515' }}>⊕ {a.goodcoins.toLocaleString()}</div>
                <div style={{ fontSize: '0.65rem', color: '#94a3b8' }}>善向幣</div>
              </div>
            </div>
            <div style={{ background: '#f8fafc', borderRadius: 8, padding: '0.875rem', marginBottom: '1rem', fontFamily: 'monospace', fontSize: '0.83rem', fontWeight: 700, color: '#003262', letterSpacing: '0.05em' }}>
              {a.code}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>推廣人數: {a.referrals} 人</div>
          </div>
        ))}
      </div>

      <div className="card" style={{ padding: '1.5rem', marginTop: '1.5rem', textAlign: 'center' }}>
        <Gift size={32} color="#FDB515" style={{ margin: '0 auto 1rem' }} />
        <div style={{ fontWeight: 800, fontSize: '1.1rem', marginBottom: '0.5rem' }}>申請成為代理</div>
        <div style={{ color: '#94a3b8', fontSize: '0.83rem', marginBottom: '1.5rem' }}>推廣 ESG GO 善向永續平台，每成功推薦一個企業可獲得善向幣獎勵</div>
        <button className="btn btn-gold">立即申請代理</button>
      </div>
    </div>
  );
}