'use client';
import { Shield, Lock, AlertTriangle, CheckCircle, Activity, Server } from 'lucide-react';

const METRICS = [
  { label: '資安事件數', value: '0', unit: '件', gri: 'GRI 418-1', color: '#22c55e', trend: '同期 0' },
  { label: '系統可用率', value: '99.97', unit: '%', gri: 'GRI 418-1', color: '#003262', trend: '+0.02%' },
  { label: '弱點掃描覆蓋', value: '100', unit: '%', gri: 'GRI 418-1', color: '#3b7ea1', trend: '最新 2024-Q4' },
  { label: '客戶隱私投訴', value: '0', unit: '件', gri: 'GRI 418-1', color: '#8b5cf6', trend: '同期 0' },
];

const CERTS = [
  { name: 'ISO 27001', status: '已認證', year: '2024', desc: '資訊安全管理系統' },
  { name: 'ISO 27701', status: '進行中', year: '2025', desc: '隱私資訊管理' },
  { name: 'SOC 2 Type II', status: '規劃中', year: '2025', desc: '服務組織控制' },
];

export default function CybersecurityPage() {
  return (
    <div className="space-y-6 pb-20">
      <div className="page-header">
        <h1>資安與創新中心</h1>
        <p>Cybersecurity & Innovation · GRI 418 · ISO 27001 · 數位韌性指標</p>
        <div className="page-header-meta">
          <span className="badge badge-green"><Shield size={10} /> 系統安全</span>
          <span className="badge badge-blue"><Lock size={10} /> GRI 418 合規</span>
        </div>
      </div>

      <div className="stats-grid">
        {METRICS.map(m => (
          <div key={m.label} className="stat-item">
            <div className="stat-value" style={{ color: m.color }}>{m.value}<span style={{ fontSize: 14 }}>{m.unit}</span></div>
            <div className="stat-label">{m.label}</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>{m.gri}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16 }}>
        <div className="card">
          <div className="card-title" style={{ marginBottom: 16 }}>資安認證狀態</div>
          <div style={{ display: 'grid', gap: 10 }}>
            {CERTS.map((c, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, padding: '14px', background: 'var(--bg-primary)', borderRadius: '10px', border: '1px solid var(--border-light)' }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: c.status === '已認證' ? '#dcfce7' : '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {c.status === '已認證' ? <CheckCircle size={18} color="#16a34a" /> : <Activity size={18} color="#d97706" />}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{c.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{c.desc}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span className={`badge ${c.status === '已認證' ? 'badge-green' : c.status === '進行中' ? 'badge-yellow' : 'badge-gray'}`}>{c.status}</span>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>{c.year}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-title" style={{ marginBottom: 16 }}>系統架構韌性</div>
          <div style={{ display: 'grid', gap: 8 }}>
            {[
              { label: '多因素驗證 (MFA)', status: '啟用', color: '#22c55e' },
              { label: '數據加密 (AES-256)', status: '啟用', color: '#22c55e' },
              { label: 'ZKP 零知識證明', status: '啟用', color: '#22c55e' },
              { label: '備份頻率', status: '每日', color: '#3b7ea1' },
              { label: '滲透測試', status: '季度執行', color: '#3b7ea1' },
              { label: 'DDoS 防護', status: 'Cloudflare', color: '#3b7ea1' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: 'var(--bg-primary)', borderRadius: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Server size={14} color="var(--text-muted)" />
                  <span style={{ fontSize: 13 }}>{item.label}</span>
                </div>
                <span style={{ fontSize: 12, fontWeight: 600, color: item.color }}>{item.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-title" style={{ marginBottom: 4 }}>GRI 418 隱私政策揭露</div>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 16 }}>依據 GRI 418-1，公司須揭露已識別的客戶隱私侵害行為及相關投訴情況。</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
          {[
            { label: '客戶資料洩漏事件', value: '0 件', desc: '2024 全年' },
            { label: '監管機關受理投訴', value: '0 件', desc: '2024 全年' },
            { label: '涉及客戶數 (洩漏)', value: '0 人', desc: '2024 全年' },
            { label: '法規裁罰總額', value: 'NT$ 0', desc: '2024 全年' },
          ].map((item, i) => (
            <div key={i} style={{ padding: '16px', background: '#f0fdf4', borderRadius: '10px', border: '1px solid #bbf7d0' }}>
              <div style={{ fontSize: 12, color: '#16a34a', fontWeight: 600, marginBottom: 4 }}>{item.label}</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: '#15803d' }}>{item.value}</div>
              <div style={{ fontSize: 11, color: '#166534', marginTop: 2 }}>{item.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}