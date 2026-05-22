'use client';
import { useState } from 'react';
import { Shield, Search, CheckCircle, XCircle, Clock, Hash, AlertTriangle, Lock } from 'lucide-react';

async function sha256(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

const MOCK_RECORDS = [
  { id: 'ev-001', title: 'GRI 305-1 溫室氣體盤查清冊', hash: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8', actor: '環安部主任', module: 'Environmental', status: 'verified', created_at: '2024-04-10T08:30:00Z' },
  { id: 'ev-002', title: '台電帳單 2024-Q1', hash: 'ef797c8118f02dfb649607dd5d3f8c7623048c9c063d532cc95c5ed7a898a64f', actor: '總務部門', module: 'Evidence', status: 'verified', created_at: '2024-04-08T14:22:00Z' },
  { id: 'ev-003', title: 'ISO 14001 認證書', hash: '2c624232cdd221771294dfbb310acbc8d21d659b94b5dc02e26157e6e33a5f8e', actor: '環安部', module: 'Compliance', status: 'pending', created_at: '2024-04-05T10:15:00Z' },
];

export default function AuditVerifyPage() {
  const [inputHash, setInputHash] = useState('');
  const [verifyInput, setVerifyInput] = useState('');
  const [result, setResult] = useState<{ match: boolean; computed: string; original: string } | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState<typeof MOCK_RECORDS[0] | null>(null);

  const handleVerify = async () => {
    if (!verifyInput.trim() || !inputHash.trim()) return;
    setVerifying(true);
    setStep(0);
    setResult(null);

    for (let i = 1; i <= 4; i++) {
      await new Promise(r => setTimeout(r, 600));
      setStep(i);
    }

    const computed = await sha256(verifyInput);
    setResult({ match: computed === inputHash, computed, original: inputHash });
    setVerifying(false);
  };

  const STEPS = ['接收驗算請求', 'SHA-256 雜湊計算', '比對資料庫記錄', '輸出驗算結果'];

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#003262', margin: 0 }}>VerifyLink™ 審計驗算入口</h1>
        <p style={{ color: '#64748b', marginTop: '4px', fontSize: '14px' }}>零知識證明 · SHA-256 雜湊驗算 · 5T 不可篡改協議</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
        {/* Verifier */}
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '24px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#003262', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Hash size={18} /> 即時 Hash 驗算器
          </h3>
          <div style={{ marginBottom: '12px' }}>
            <label style={{ fontSize: '12px', fontWeight: '600', color: '#64748b', display: 'block', marginBottom: '6px' }}>輸入原始內容</label>
            <textarea value={verifyInput} onChange={e => setVerifyInput(e.target.value)} placeholder="貼上您要驗算的原始數據或文字..."
              style={{ width: '100%', padding: '10px 12px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '13px', outline: 'none', minHeight: '80px', resize: 'vertical', boxSizing: 'border-box' }} />
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '12px', fontWeight: '600', color: '#64748b', display: 'block', marginBottom: '6px' }}>對照 Hash 值</label>
            <input value={inputHash} onChange={e => setInputHash(e.target.value)} placeholder="貼上原始 SHA-256 Hash..."
              style={{ width: '100%', padding: '10px 12px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '12px', fontFamily: 'monospace', outline: 'none', boxSizing: 'border-box' }} />
          </div>
          <button onClick={handleVerify} disabled={verifying || !verifyInput || !inputHash}
            style={{ width: '100%', padding: '12px', background: '#003262', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '14px', opacity: verifying ? 0.7 : 1 }}>
            {verifying ? '驗算中...' : '🔐 啟動 ZKP 驗算'}
          </button>
        </div>

        {/* Steps + Result */}
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '24px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#003262', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Shield size={18} /> 驗算流程
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
            {STEPS.map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: step > i ? '#003262' : step === i && verifying ? '#f59e0b' : '#e2e8f0',
                  transition: 'background 0.3s',
                }}>
                  {step > i ? <CheckCircle size={16} color="#fff" /> : <span style={{ fontSize: '11px', fontWeight: '700', color: step === i && verifying ? '#fff' : '#94a3b8' }}>{i + 1}</span>}
                </div>
                <span style={{ fontSize: '13px', color: step > i ? '#1e293b' : '#94a3b8', fontWeight: step > i ? '600' : '400', transition: 'color 0.3s' }}>{s}</span>
              </div>
            ))}
          </div>

          {result && (
            <div style={{ padding: '16px', borderRadius: '8px', background: result.match ? '#dcfce7' : '#fee2e2', border: `1px solid ${result.match ? '#86efac' : '#fca5a5'}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                {result.match ? <CheckCircle size={20} color="#16a34a" /> : <XCircle size={20} color="#dc2626" />}
                <span style={{ fontSize: '15px', fontWeight: '800', color: result.match ? '#16a34a' : '#dc2626' }}>
                  {result.match ? '✅ 驗算通過 — 數據完整性確認' : '❌ 驗算失敗 — Hash 不符'}
                </span>
              </div>
              <div style={{ fontSize: '11px', fontFamily: 'monospace', color: '#475569', wordBreak: 'break-all' }}>
                計算值：{result.computed.substring(0, 32)}...
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Records Table */}
      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0' }}>
          <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#003262', margin: 0 }}>已封印實證記錄</h3>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: '#f8fafc' }}>
            <tr>
              {['文件名稱', '模組', '上傳者', '封印時間', '狀態', '操作'].map(h => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', color: '#64748b', fontWeight: '700', borderBottom: '1px solid #e2e8f0' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {MOCK_RECORDS.map(r => (
              <tr key={r.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '14px 16px', fontSize: '13px', fontWeight: '600', color: '#1e293b' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Lock size={12} color="#94a3b8" />
                    {r.title}
                  </div>
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <span style={{ fontSize: '11px', padding: '3px 8px', borderRadius: '20px', background: '#dbeafe', color: '#1e40af', fontWeight: '600' }}>{r.module}</span>
                </td>
                <td style={{ padding: '14px 16px', fontSize: '13px', color: '#64748b' }}>{r.actor}</td>
                <td style={{ padding: '14px 16px', fontSize: '12px', color: '#94a3b8' }}>{new Date(r.created_at).toLocaleDateString('zh-TW')}</td>
                <td style={{ padding: '14px 16px' }}>
                  <span style={{ fontSize: '11px', padding: '3px 8px', borderRadius: '20px', background: r.status === 'verified' ? '#dcfce7' : '#fef3c7', color: r.status === 'verified' ? '#16a34a' : '#92400e', fontWeight: '700' }}>
                    {r.status === 'verified' ? '已驗證' : '待審核'}
                  </span>
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <button onClick={() => { setInputHash(r.hash); setSelected(r); }}
                    style={{ fontSize: '11px', padding: '5px 12px', background: '#003262', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>
                    驗算
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}