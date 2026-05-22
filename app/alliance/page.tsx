'use client';
import { useState } from 'react';
import {
  Shield, CheckCircle, Lock, Globe, Fingerprint, Plus,
  Copy, Eye, EyeOff, Zap, Users, AlertTriangle, Network
} from 'lucide-react';

interface AllianceMember {
  id: string;
  partner_name: string;
  organization: string;
  clearance_level: 'L1' | 'L2' | 'L3';
  token: string;
  status: 'active' | 'pending' | 'revoked';
  webhook_url?: string;
  zkp_calls: number;
  last_access?: string;
  created_at: string;
}

const SEED_MEMBERS: AllianceMember[] = [
  {
    id: '1',
    partner_name: 'TSMC 供應鏈管理',
    organization: '台灣積體電路製造股份有限公司',
    clearance_level: 'L3',
    token: 'token-tsmc-supply-chain-req-2026',
    status: 'active',
    webhook_url: 'https://api.tsmc.com/supplier-esg/v1/ingest',
    zkp_calls: 87,
    last_access: '2026-05-19T08:32:00Z',
    created_at: '2026-04-01',
  },
  {
    id: '2',
    partner_name: '善向永續 Win-Sustainability',
    organization: '善向永續股份有限公司',
    clearance_level: 'L2',
    token: 'token-win-sustainability-xyz-2026',
    status: 'active',
    webhook_url: 'https://api.win-sustainability.com/data-trust/v1',
    zkp_calls: 34,
    last_access: '2026-05-18T14:22:00Z',
    created_at: '2026-04-15',
  },
  {
    id: '3',
    partner_name: '王道商業聯盟',
    organization: '王道商業聯盟協會',
    clearance_level: 'L2',
    token: 'token-wang-dao-alliance-abc-2026',
    status: 'active',
    zkp_calls: 12,
    last_access: '2026-05-17T10:05:00Z',
    created_at: '2026-05-01',
  },
  {
    id: '4',
    partner_name: 'MODA 數位發展部',
    organization: '台灣數位發展部',
    clearance_level: 'L1',
    token: 'token-moda-national-trust-2026',
    status: 'pending',
    zkp_calls: 0,
    created_at: '2026-05-18',
  },
];

const CLEARANCE_COLORS: Record<string, string> = { L1: '#22c55e', L2: '#3b7ea1', L3: '#FDB515' };
const CLEARANCE_LABELS: Record<string, string> = {
  L1: 'L1 — 公開揭露',
  L2: 'L2 — 聯盟共享',
  L3: 'L3 — 核心廠級',
};

export default function AlliancePage() {
  const [members, setMembers] = useState<AllianceMember[]>(SEED_MEMBERS);
  const [activeTab, setActiveTab] = useState<'members' | 'verify' | 'webhook' | 'protocol'>('members');
  const [showToken, setShowToken] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [verifyToken, setVerifyToken] = useState('');
  const [verifyResult, setVerifyResult] = useState<any>(null);
  const [verifying, setVerifying] = useState(false);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  const [newMember, setNewMember] = useState({ partner_name: '', organization: '', clearance_level: 'L2' as 'L1' | 'L2' | 'L3', webhook_url: '' });

  const activeMemberCount = members.filter(m => m.status === 'active').length;
  const totalZKPCalls = members.reduce((s, m) => s + m.zkp_calls, 0);

  const handleCopyToken = (token: string) => {
    navigator.clipboard.writeText(token).catch(() => {});
    setCopiedToken(token);
    setTimeout(() => setCopiedToken(null), 2000);
  };

  const handleVerify = async () => {
    if (!verifyToken.trim()) return;
    setVerifying(true);
    setVerifyResult(null);
    await new Promise(r => setTimeout(r, 1800));
    const found = members.find(m => m.token === verifyToken.trim());
    if (found) {
      setVerifyResult({
        valid: true,
        partner: found.partner_name,
        organization: found.organization,
        clearance: found.clearance_level,
        status: found.status,
        zkpCalls: found.zkp_calls,
        hashLock: 'sha256:' + Array.from({ length: 16 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
        timestamp: new Date().toLocaleString('zh-TW'),
      });
    } else {
      setVerifyResult({ valid: false });
    }
    setVerifying(false);
  };

  const handleAddMember = () => {
    if (!newMember.partner_name || !newMember.organization) return;
    const token = `token-${newMember.partner_name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;
    const member: AllianceMember = {
      id: Date.now().toString(),
      ...newMember,
      token,
      status: 'pending',
      zkp_calls: 0,
      created_at: new Date().toISOString().split('T')[0],
    };
    setMembers(prev => [...prev, member]);
    setShowAdd(false);
    setNewMember({ partner_name: '', organization: '', clearance_level: 'L2', webhook_url: '' });
  };

  const TABS = [
    { key: 'members', label: '聯盟成員' },
    { key: 'verify', label: 'ZKP 驗證艙' },
    { key: 'webhook', label: 'Webhook 推送' },
    { key: 'protocol', label: '共榮協定' },
  ];

  return (
    <div className="space-y-6 pb-20">
      <div className="page-header">
        <h1>王道聯盟數據信託</h1>
        <p>Alliance Data Sharing Protocol · ZKP 零知識證明 · 跨組織授權 · 5T 誠信協議</p>
        <div className="page-header-meta">
          <span className="t5-badge t5-t4">T4: 不可篡改</span>
          <span className="t5-badge t5-t5">T5: 可追蹤</span>
          <span className="badge badge-green"><Shield size={10} /> Data Trust Active</span>
        </div>
      </div>

      <div className="stats-grid">
        {[
          { label: '聯盟成員', value: members.length, color: '#003262' },
          { label: '活躍成員', value: activeMemberCount, color: '#22c55e' },
          { label: 'ZKP 總調用', value: totalZKPCalls, color: '#3b7ea1' },
          { label: 'L3 核心廠', value: members.filter(m => m.clearance_level === 'L3').length, color: '#FDB515' },
        ].map(s => (
          <div key={s.label} className="stat-item">
            <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="tab-list">
          {TABS.map(t => (
            <button key={t.key} className={`tab-btn${activeTab === t.key ? ' active' : ''}`} onClick={() => setActiveTab(t.key as any)}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Members Tab */}
      {activeTab === 'members' && (
        <div className="card">
          <div className="card-header">
            <div className="card-title">聯盟成員管理</div>
            <button className="btn btn-primary btn-sm" onClick={() => setShowAdd(true)}><Plus size={14} />新增成員</button>
          </div>
          <div style={{ display: 'grid', gap: 14 }}>
            {members.map(m => (
              <div key={m.id} style={{ padding: '18px', background: 'var(--bg-secondary)', borderRadius: 14, border: '1px solid var(--border-light)' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
                  {/* Alliance ID Card */}
                  <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                    <div style={{ width: 56, height: 56, borderRadius: 14, background: `linear-gradient(135deg, ${CLEARANCE_COLORS[m.clearance_level]}20, ${CLEARANCE_COLORS[m.clearance_level]}40)`, border: `2px solid ${CLEARANCE_COLORS[m.clearance_level]}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Fingerprint size={22} color={CLEARANCE_COLORS[m.clearance_level]} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 15 }}>{m.partner_name}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{m.organization}</div>
                      <div style={{ display: 'flex', gap: 6, marginTop: 6, flexWrap: 'wrap' }}>
                        <span className={`badge ${m.status === 'active' ? 'badge-green' : m.status === 'pending' ? 'badge-yellow' : 'badge-red'}`}>
                          {m.status === 'active' ? '啟用' : m.status === 'pending' ? '待審核' : '已撤銷'}
                        </span>
                        <span className="badge" style={{ background: CLEARANCE_COLORS[m.clearance_level] + '20', color: CLEARANCE_COLORS[m.clearance_level], fontWeight: 700 }}>
                          {CLEARANCE_LABELS[m.clearance_level]}
                        </span>
                        <span className="badge badge-gray"><Zap size={8} />{m.zkp_calls} 次 ZKP</span>
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button className="btn btn-ghost btn-sm" onClick={() => setShowToken(showToken === m.id ? null : m.id)}>
                      {showToken === m.id ? <EyeOff size={12} /> : <Eye size={12} />} Token
                    </button>
                    <button className="btn btn-ghost btn-sm" onClick={() => handleCopyToken(m.token)}>
                      <Copy size={12} /> {copiedToken === m.token ? '已複製' : '複製'}
                    </button>
                  </div>
                </div>
                {showToken === m.id && (
                  <div style={{ marginTop: 12, padding: '10px 14px', background: '#1e1e2e', borderRadius: 8 }}>
                    <code style={{ fontSize: 11, color: '#a6e3a1', fontFamily: 'monospace', wordBreak: 'break-all' }}>{m.token}</code>
                  </div>
                )}
                {m.last_access && (
                  <div style={{ marginTop: 8, fontSize: 11, color: 'var(--text-muted)' }}>
                    最後存取：{new Date(m.last_access).toLocaleString('zh-TW')}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Verify Tab */}
      {activeTab === 'verify' && (
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <div className="card">
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              <div style={{ width: 56, height: 56, borderRadius: 16, background: 'linear-gradient(135deg, #003262, #3b7ea1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                <Fingerprint size={26} style={{ color: 'white' }} />
              </div>
              <div style={{ fontWeight: 700, fontSize: 20, color: '#003262' }}>ZKP 液態玻璃驗證艙</div>
              <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>輸入聯盟 Token 進行零知識證明驗算 — Verified without revealing data</p>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <input
                className="form-input"
                style={{ flex: 1 }}
                value={verifyToken}
                onChange={e => setVerifyToken(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleVerify()}
                placeholder="token-xxxx-alliance-2026"
              />
              <button className="btn btn-primary" onClick={handleVerify} disabled={verifying}>
                {verifying ? '驗算中...' : <><Shield size={14} />執行驗算</>}
              </button>
            </div>
            {verifying && (
              <div style={{ textAlign: 'center', padding: '24px', color: 'var(--text-secondary)' }}>
                <div style={{ width: 36, height: 36, border: '3px solid #003262', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 12px' }} />
                <div style={{ fontSize: 13 }}>正在透過 ZKP 協議建立安全通道...</div>
              </div>
            )}
            {verifyResult && !verifying && (
              <div style={{ marginTop: 16, padding: '20px', borderRadius: 12, border: `1px solid ${verifyResult.valid ? '#bbf7d0' : '#fecaca'}`, background: verifyResult.valid ? '#f0fdf4' : '#fef2f2' }}>
                {verifyResult.valid ? (
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                      <CheckCircle size={24} color="#16a34a" />
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 16, color: '#15803d' }}>聯盟身份驗證成功</div>
                        <div style={{ fontSize: 12, color: '#16a34a' }}>Verified without revealing data</div>
                      </div>
                    </div>
                    <div style={{ display: 'grid', gap: 8 }}>
                      {[
                        { label: '聯盟夥伴', value: verifyResult.partner },
                        { label: '所屬組織', value: verifyResult.organization },
                        { label: 'ZKP 存取層級', value: CLEARANCE_LABELS[verifyResult.clearance] },
                        { label: '帳戶狀態', value: verifyResult.status },
                        { label: 'ZKP 調用次數', value: `${verifyResult.zkpCalls} 次` },
                        { label: 'Hash Anchor', value: verifyResult.hashLock },
                        { label: '驗算時間', value: verifyResult.timestamp },
                      ].map(item => (
                        <div key={item.label} style={{ display: 'grid', gridTemplateColumns: '110px 1fr', gap: 8 }}>
                          <span style={{ fontSize: 12, color: '#166534', fontWeight: 600 }}>{item.label}</span>
                          <span style={{ fontSize: 12, fontFamily: item.label === 'Hash Anchor' ? 'monospace' : 'inherit', wordBreak: 'break-all' }}>{item.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <AlertTriangle size={24} color="#dc2626" />
                    <div>
                      <div style={{ fontWeight: 700, color: '#dc2626' }}>無效的聯盟憑證</div>
                      <div style={{ fontSize: 13, color: '#b91c1c' }}>Token 不存在或已撤銷，請確認後重試</div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="card" style={{ marginTop: 16 }}>
            <div className="card-title" style={{ marginBottom: 12 }}>快速測試憑證</div>
            <div style={{ display: 'grid', gap: 8 }}>
              {members.filter(m => m.status === 'active').map(m => (
                <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: 'var(--bg-secondary)', borderRadius: 8 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: CLEARANCE_COLORS[m.clearance_level], flexShrink: 0 }} />
                  <span style={{ flex: 1, fontSize: 12 }}>{m.partner_name}</span>
                  <span className="badge" style={{ background: CLEARANCE_COLORS[m.clearance_level] + '20', color: CLEARANCE_COLORS[m.clearance_level], fontSize: 9 }}>{m.clearance_level}</span>
                  <button className="btn btn-ghost btn-sm" style={{ fontSize: 10 }} onClick={() => setVerifyToken(m.token)}>使用此 Token</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Webhook Tab */}
      {activeTab === 'webhook' && (
        <div className="card">
          <div className="card-title" style={{ marginBottom: 4 }}>B2B Webhook 推送紀錄</div>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 16 }}>當企業鎖定章節後，系統自動將 ZKP 脫敏數據推送至已註冊的聯盟成員端點。</p>
          <div className="table-container">
            <table>
              <thead>
                <tr><th>聯盟成員</th><th>ZKP 層級</th><th>推送狀態</th><th>Hash 錨點</th><th>推送時間</th></tr>
              </thead>
              <tbody>
                {[
                  { partner: 'TSMC 供應鏈管理', level: 'L2', status: 'success', hash: 'sha256:a1b2c3d4e5f6', time: '2026-05-19 08:32' },
                  { partner: '善向永續', level: 'L2', status: 'success', hash: 'sha256:f9e8d7c6b5a4', time: '2026-05-18 14:22' },
                  { partner: '王道商業聯盟', level: 'L1', status: 'success', hash: 'sha256:1a2b3c4d5e6f', time: '2026-05-17 10:05' },
                  { partner: 'MODA 數位發展部', level: 'L1', status: 'pending', hash: '—', time: '待確認' },
                ].map((row, i) => (
                  <tr key={i}>
                    <td style={{ fontWeight: 500, fontSize: 13 }}>{row.partner}</td>
                    <td><span className="badge" style={{ background: CLEARANCE_COLORS[row.level] + '20', color: CLEARANCE_COLORS[row.level] }}>{row.level}</span></td>
                    <td>
                      {row.status === 'success'
                        ? <span className="badge badge-green"><CheckCircle size={9} />推送成功</span>
                        : <span className="badge badge-yellow"><Globe size={9} />待推送</span>
                      }
                    </td>
                    <td><code style={{ fontSize: 10, color: '#6366f1' }}>{row.hash}</code></td>
                    <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>{row.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Protocol Tab */}
      {activeTab === 'protocol' && (
        <div style={{ display: 'grid', gap: 16 }}>
          <div className="card" style={{ background: 'linear-gradient(135deg, #003262, #1a4a7a)', border: 'none' }}>
            <div style={{ color: 'white' }}>
              <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 8 }}>聯盟共榮數據共享協定</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', marginBottom: 16 }}>Alliance Data Sharing Protocol v1.0 — 基於 5T 誠信協議</div>
              <div style={{ display: 'grid', gap: 8 }}>
                {[
                  '第一條：零知識傳輸 — 所有數據交換採用 ZKP L1-L3 分級脫敏',
                  '第二條：不可篡改錨定 — 傳輸數據附帶 Hash Lock 密碼學證明',
                  '第三條：生命週期追蹤 — 所有跨組織流轉皆刻印至鏈式日誌',
                  '第四條：主權隔離 — 各成員節點資料在靜止與流轉中皆不可交叉',
                  '第五條：透明驗算 — 演算法與計算公式完全公開，支持零幻覺驗算',
                ].map((clause, i) => (
                  <div key={i} style={{ display: 'flex', gap: 10, padding: '10px 14px', background: 'rgba(255,255,255,0.08)', borderRadius: 8 }}>
                    <CheckCircle size={14} style={{ color: '#22c55e', flexShrink: 0, marginTop: 2 }} />
                    <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.85)', lineHeight: 1.6 }}>{clause}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
            {[
              { level: 'L1', name: '公開揭露層', desc: '一般大眾可存取的摘要資訊，符合 GRI 公開揭露標準', color: '#22c55e', examples: ['年度排放摘要', '員工人數', '治理結構'] },
              { level: 'L2', name: '聯盟共享層', desc: '聯盟夥伴共享的指標數據，需具備 ZKP L2 憑證', color: '#3b7ea1', examples: ['供應鏈 ESG 評分', '減碳進度', '合規完成率'] },
              { level: 'L3', name: '核心廠層', desc: '僅供最高權限核心廠存取的機敏數據', color: '#FDB515', examples: ['精確碳排成本', '技術機密數據', '財務詳細資料'] },
            ].map(tier => (
              <div key={tier.level} className="card" style={{ borderTop: `3px solid ${tier.color}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: tier.color + '20', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Lock size={16} color={tier.color} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{tier.level} — {tier.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{tier.desc}</div>
                  </div>
                </div>
                <div style={{ display: 'grid', gap: 6 }}>
                  {tier.examples.map((ex, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-secondary)' }}>
                      <div style={{ width: 4, height: 4, borderRadius: '50%', background: tier.color }} />
                      {ex}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Member Modal */}
      {showAdd && (
        <div className="modal-overlay">
          <div className="modal-box">
            <div className="modal-header">
              <div className="card-title">新增聯盟成員</div>
              <button onClick={() => setShowAdd(false)} className="btn btn-ghost btn-sm">×</button>
            </div>
            <div className="modal-body">
              <div className="alert alert-info" style={{ marginBottom: 16 }}>
                <Shield size={14} />加入後系統將自動生成專屬 ZKP Token 並建立聯盟核心節點 ID 卡。
              </div>
              {[
                { label: '夥伴名稱', key: 'partner_name', placeholder: '例：善向永續 Win-Sustainability' },
                { label: '所屬組織', key: 'organization', placeholder: '例：善向永續股份有限公司' },
                { label: 'Webhook URL (選填)', key: 'webhook_url', placeholder: 'https://api.example.com/esg/v1/ingest' },
              ].map(f => (
                <div className="form-group" key={f.key}>
                  <label className="form-label">{f.label}</label>
                  <input className="form-input" value={(newMember as any)[f.key]} onChange={e => setNewMember(p => ({ ...p, [f.key]: e.target.value }))} placeholder={f.placeholder} />
                </div>
              ))}
              <div className="form-group">
                <label className="form-label">ZKP 存取層級</label>
                <select className="form-select" value={newMember.clearance_level} onChange={e => setNewMember(p => ({ ...p, clearance_level: e.target.value as 'L1' | 'L2' | 'L3' }))}>
                  <option value="L1">L1 — 公開揭露層</option>
                  <option value="L2">L2 — 聯盟共享層</option>
                  <option value="L3">L3 — 核心廠層（最高權限）</option>
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setShowAdd(false)}>取消</button>
              <button className="btn btn-primary" onClick={handleAddMember}><Plus size={14} />建立聯盟節點</button>
            </div>
          </div>
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}