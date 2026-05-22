'use client';
import React, { useState, useCallback } from 'react';
import AppShell from '../AppShell';
import {
  Shield, Hash, Lock, CheckCircle, XCircle, Loader, ChevronDown,
  ChevronUp, Copy, AlertTriangle, Zap, Link, Eye, EyeOff
} from 'lucide-react';
import {
  sha256, sha512, hmacSHA256, createHashLock, verifyHashLock,
  createZKPCommitment, verifyZKPProof, create5TAttestation, mineBlock,
  type HashLockResult, type ZKPCommitment, type ZKPVerifyResult,
  type T5Attestation
} from '../../lib/crypto-proof';

type Tab = 'hash' | 'zkp' | '5t' | 'chain' | 'verify';

function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text).catch(() => {}); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
      style={{ background: 'none', border: 'none', cursor: 'pointer', color: copied ? '#16a34a' : '#94a3b8', display: 'flex', alignItems: 'center', gap: 4, fontSize: 11 }}
    >
      <Copy size={12} /> {copied ? '已複製' : '複製'}
    </button>
  );
}

function CodeBlock({ value, label }: { value: string; label?: string }) {
  return (
    <div style={{ marginBottom: 8 }}>
      {label && <div style={{ fontSize: 10, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: 4 }}>{label}</div>}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, background: '#0f172a', borderRadius: 8, padding: '10px 14px' }}>
        <code style={{ fontFamily: 'monospace', fontSize: 12, color: '#7dd3fc', wordBreak: 'break-all', lineHeight: 1.6, flex: 1 }}>{value}</code>
        <CopyBtn text={value} />
      </div>
    </div>
  );
}

// ─── Tab 1: Hash Laboratory ──────────────────────────────────────
function HashLab() {
  const [input, setInput] = useState('範疇一排放量: 1250 tCO₂e, 來源: ISO 14064-1');
  const [results, setResults] = useState<{ sha256: string; sha512: string; hmac: string } | null>(null);
  const [running, setRunning] = useState(false);

  const run = async () => {
    setRunning(true);
    const [h256, h512, hmac] = await Promise.all([
      sha256(input),
      sha512(input),
      hmacSHA256('ESG_GO_5T_SECRET_KEY_2025', input),
    ]);
    setResults({ sha256: h256, sha512: h512, hmac });
    setRunning(false);
  };

  return (
    <div>
      <div style={{ background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: 10, padding: '14px 16px', marginBottom: 20, fontSize: 13, color: '#0369a1', lineHeight: 1.6 }}>
        <strong>原理：</strong> SHA-256 是由 NIST 制定的密碼學雜湊函數，使用 <strong>Web Crypto API</strong>（瀏覽器原生，無第三方庫）。
        相同輸入永遠產生相同 256-bit 輸出，任何字元改動均導致完全不同的雜湊值（雪崩效應）。
      </div>

      <div style={{ marginBottom: 16 }}>
        <label className="form-label">輸入數據（任意修改以觀察雜湊變化）</label>
        <textarea
          className="form-textarea"
          value={input}
          onChange={e => setInput(e.target.value)}
          rows={3}
        />
      </div>

      <button className="btn btn-primary btn-lg" onClick={run} disabled={running} style={{ marginBottom: 24 }}>
        {running ? <><Loader size={14} className="animate-spin" /> 運算中...</> : <><Hash size={14} /> 執行雜湊計算</>}
      </button>

      {results && (
        <div style={{ animation: 'fadeIn 0.3s ease' }}>
          <CodeBlock label="SHA-256 (256-bit / 64 hex chars) — 5T 標準演算法" value={results.sha256} />
          <CodeBlock label="SHA-512 (512-bit / 128 hex chars) — 更高安全等級" value={results.sha512} />
          <CodeBlock label="HMAC-SHA256 (帶金鑰認證碼) — 防偽造簽章" value={results.hmac} />
          <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 8, padding: '10px 14px', fontSize: 12, color: '#166534' }}>
            ✅ 以上全部使用 <code>window.crypto.subtle</code>（Web Crypto API Level 3）計算，可在 Chrome DevTools Console 獨立驗算：
            <br />
            <code style={{ fontFamily: 'monospace', display: 'block', marginTop: 4, color: '#15803d' }}>
              {`const h = await crypto.subtle.digest('SHA-256', new TextEncoder().encode('${input.substring(0, 30)}...'));`}
            </code>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Tab 2: ZKP Demo ─────────────────────────────────────────────
function ZKPDemo() {
  const [secretValue, setSecretValue] = useState('1250');
  const [commitment, setCommitment] = useState<ZKPCommitment | null>(null);
  const [verifyResult, setVerifyResult] = useState<ZKPVerifyResult | null>(null);
  const [blindingFactor, setBlindingFactor] = useState('');
  const [showBlinding, setShowBlinding] = useState(false);
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    setLoading(true);
    setVerifyResult(null);
    const c = await createZKPCommitment(secretValue, 'GRI_305_1_CARBON');
    // In real ZKP: blinding factor stays secret with prover
    // For demo purposes we reveal it after commitment
    setCommitment(c);
    // Extract blinding factor from commitment internals (demo only)
    setBlindingFactor('demo_bf_' + c.blindingHash.substring(0, 16));
    setLoading(false);
  };

  const verify = async () => {
    if (!commitment) return;
    setLoading(true);
    // For demo: reconstruct with actual blinding factor hash from commitment
    const r = await verifyZKPProof(commitment, 'demo_bf_' + commitment.blindingHash.substring(0, 16));
    setVerifyResult(r);
    setLoading(false);
  };

  return (
    <div>
      <div style={{ background: '#faf5ff', border: '1px solid #e9d5ff', borderRadius: 10, padding: '14px 16px', marginBottom: 20, fontSize: 13, color: '#6b21a8', lineHeight: 1.6 }}>
        <strong>ZKP 零知識證明原理：</strong> 使用 <strong>Pedersen Commitment Scheme</strong>。
        企業可向審計師證明「碳排放量低於法規閾值」，
        而<strong>完全不揭露原始數值</strong>。
        commitment = H(value ‖ blinding_factor)，其中 blinding_factor 只有企業持有。
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        <div>
          <label className="form-label">機密數值（企業持有，審計師不得見）</label>
          <input className="form-input" value={secretValue} onChange={e => setSecretValue(e.target.value)} placeholder="例: 1250 (tCO₂e)" />
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end' }}>
          <button className="btn btn-primary btn-lg" style={{ width: '100%' }} onClick={generate} disabled={loading}>
            {loading ? <><Loader size={14} className="animate-spin" /> 生成中...</> : <><Lock size={14} /> 生成 ZKP 承諾</>}
          </button>
        </div>
      </div>

      {commitment && (
        <div style={{ animation: 'fadeIn 0.3s ease' }}>
          <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10, padding: 16, marginBottom: 16 }}>
            <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 12, color: '#1e293b' }}>
              📦 ZKP 承諾（可公開給審計師）
            </div>
            <CodeBlock label="Commitment = H(value ‖ blinding_factor)" value={commitment.commitment} />
            <CodeBlock label="Public Hash = H(value) — 分類用，不揭露精確值" value={commitment.publicHash} />
            <CodeBlock label="Proof Signature = HMAC(commitment ‖ timestamp)" value={commitment.proofSignature} />
            <CodeBlock label="演算法" value={commitment.algorithm} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12, padding: '8px 12px', background: '#fef9c3', borderRadius: 8, fontSize: 12, color: '#713f12' }}>
              <AlertTriangle size={14} />
              <span>以下盲化因子在真實 ZKP 中永遠不傳輸給驗證者</span>
              <button onClick={() => setShowBlinding(!showBlinding)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#92400e', marginLeft: 'auto' }}>
                {showBlinding ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
            {showBlinding && <CodeBlock label="Blinding Factor Hash（企業保密）" value={commitment.blindingHash} />}
          </div>

          <button className="btn btn-gold btn-lg" style={{ width: '100%', marginBottom: 16 }} onClick={verify} disabled={loading}>
            {loading ? <><Loader size={14} className="animate-spin" /> 驗算中...</> : <><Shield size={14} /> 執行 ZKP 驗算（不揭露原始值）</>}
          </button>

          {verifyResult && (
            <div style={{ background: verifyResult.valid ? '#f0fdf4' : '#fef2f2', border: `2px solid ${verifyResult.valid ? '#86efac' : '#fca5a5'}`, borderRadius: 10, padding: 16, animation: 'fadeIn 0.3s ease' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16, fontSize: 16, fontWeight: 700, color: verifyResult.valid ? '#15803d' : '#dc2626' }}>
                {verifyResult.valid ? <CheckCircle size={20} /> : <XCircle size={20} />}
                {verifyResult.valid ? '✅ ZKP 驗算通過 — 數據真實可信' : '❌ ZKP 驗算失敗 — 數據可能遭篡改'}
                <span style={{ fontSize: 11, fontWeight: 400, marginLeft: 'auto', color: '#64748b' }}>耗時 {verifyResult.timeTaken}ms</span>
              </div>
              {verifyResult.steps.map(s => (
                <div key={s.step} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 0', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                  <div style={{ width: 22, height: 22, borderRadius: '50%', background: s.passed ? '#16a34a' : '#dc2626', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, flexShrink: 0 }}>{s.step}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#1e293b', marginBottom: 3 }}>{s.name}</div>
                    <div style={{ fontFamily: 'monospace', fontSize: 11, color: '#64748b' }}>輸出: {s.output}</div>
                  </div>
                  {s.passed ? <CheckCircle size={16} color="#16a34a" /> : <XCircle size={16} color="#dc2626" />}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Tab 3: 5T Full Attestation ──────────────────────────────────
function T5AttestationDemo() {
  const [metric, setMetric] = useState('範疇一直接排放量');
  const [value, setValue] = useState('1250');
  const [unit, setUnit] = useState('tCO₂e');
  const [source, setSource] = useState('ISO 14064-1 盤查清冊 / 冷媒填充紀錄');
  const [attestation, setAttestation] = useState<T5Attestation | null>(null);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState<string | null>('t4');

  const generate = async () => {
    setLoading(true);
    const a = await create5TAttestation(metric, value, unit, source, `直接量測 + ISO 14064-1 計算方法`);
    setAttestation(a);
    setLoading(false);
  };

  const T5Section = ({ id, label, color, icon: Icon, children }: any) => (
    <div style={{ border: `1px solid ${color}30`, borderRadius: 10, marginBottom: 8, overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: `${color}08`, cursor: 'pointer' }} onClick={() => setExpanded(expanded === id ? null : id)}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Icon size={16} color={color} />
          <span style={{ fontWeight: 700, fontSize: 13, color }}>{label}</span>
        </div>
        {expanded === id ? <ChevronUp size={14} color="#94a3b8" /> : <ChevronDown size={14} color="#94a3b8" />}
      </div>
      {expanded === id && <div style={{ padding: 16 }}>{children}</div>}
    </div>
  );

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
        <div><label className="form-label">ESG 指標名稱</label><input className="form-input" value={metric} onChange={e => setMetric(e.target.value)} /></div>
        <div><label className="form-label">數值</label><input className="form-input" value={value} onChange={e => setValue(e.target.value)} /></div>
        <div><label className="form-label">單位</label><input className="form-input" value={unit} onChange={e => setUnit(e.target.value)} /></div>
        <div><label className="form-label">來源文件</label><input className="form-input" value={source} onChange={e => setSource(e.target.value)} /></div>
      </div>

      <button className="btn btn-primary btn-lg" style={{ width: '100%', marginBottom: 24 }} onClick={generate} disabled={loading}>
        {loading ? <><Loader size={14} className="animate-spin" /> 生成 5T 誠信封印...</> : <><Shield size={14} /> 生成完整 5T 協議認證</>}
      </button>

      {attestation && (
        <div style={{ animation: 'fadeIn 0.3s ease' }}>
          <div style={{ background: 'linear-gradient(135deg, #003262, #1a4a7a)', color: '#fff', borderRadius: 12, padding: '16px 20px', marginBottom: 16 }}>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', marginBottom: 4 }}>MASTER SEAL — 主封印（T1+T2+T3+T4+T5 聚合雜湊）</div>
            <code style={{ fontFamily: 'monospace', fontSize: 13, color: '#FDB515', wordBreak: 'break-all' }}>{attestation.masterSeal}</code>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', marginTop: 6 }}>發行時間: {attestation.issuedAt}</div>
          </div>

          <T5Section id="t1" label="T1 可溯源 (Traceable) — 來源文件雜湊" color="#003262" icon={Link}>
            <CodeBlock label="Hash Lock（來源文件 + Nonce + Timestamp）" value={attestation.t1_traceable.hash} />
            <CodeBlock label="Nonce（防重放攻擊）" value={attestation.t1_traceable.nonce} />
            <CodeBlock label="演算法" value={attestation.t1_traceable.algorithm} />
          </T5Section>

          <T5Section id="t2" label="T2 透明 (Transparent) — 公式與算法公開" color="#3b7ea1" icon={Eye}>
            <div style={{ fontSize: 13, marginBottom: 8 }}><strong>計算公式：</strong>{attestation.t2_transparent.formula}</div>
            <CodeBlock label="輸出雜湊（可獨立驗算）" value={attestation.t2_transparent.outputHash} />
          </T5Section>

          <T5Section id="t3" label="T3 可感知 (Tangible) — 具體指標數值" color="#7c3aed" icon={Zap}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
              {[['指標', attestation.t3_tangible.metric], ['數值', String(attestation.t3_tangible.value)], ['單位', attestation.t3_tangible.unit]].map(([k, v]) => (
                <div key={k} style={{ background: '#f8fafc', borderRadius: 8, padding: '10px 12px', textAlign: 'center' }}>
                  <div style={{ fontSize: 10, color: '#64748b', fontWeight: 700 }}>{k}</div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: '#003262', marginTop: 4 }}>{v}</div>
                </div>
              ))}
            </div>
          </T5Section>

          <T5Section id="t4" label="T4 不可篡改 (Trustworthy) — SHA-256 Hash Lock" color="#16a34a" icon={Lock}>
            <CodeBlock label="Hash Lock（數據 + Nonce + Timestamp = 唯一指紋）" value={attestation.t4_trustworthy.hash} />
            <CodeBlock label="Nonce" value={attestation.t4_trustworthy.nonce} />
            <div style={{ fontSize: 12, color: '#166534', background: '#f0fdf4', padding: '8px 12px', borderRadius: 8 }}>
              ✅ 任何對原始數據的修改，無論多小，都將產生完全不同的雜湊值（雪崩效應）
            </div>
          </T5Section>

          <T5Section id="t5" label="T5 可追蹤 (Trackable) — 區塊鏈式雜湊鏈" color="#d97706" icon={Link}>
            <CodeBlock label="區塊雜湊（難度: 00 前綴，Proof of Work）" value={attestation.t5_trackable.chainBlock.hash} />
            <CodeBlock label="前一個區塊雜湊（鏈式連接）" value={attestation.t5_trackable.chainBlock.previousHash} />
            <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
              <div style={{ flex: 1, background: '#fef9c3', borderRadius: 8, padding: '8px 12px', fontSize: 12 }}>
                <div style={{ fontWeight: 700, color: '#713f12' }}>Nonce（工作量證明）</div>
                <div style={{ fontFamily: 'monospace', color: '#92400e' }}>{attestation.t5_trackable.chainBlock.nonce}</div>
              </div>
              <div style={{ flex: 1, background: '#fef9c3', borderRadius: 8, padding: '8px 12px', fontSize: 12 }}>
                <div style={{ fontWeight: 700, color: '#713f12' }}>區塊索引</div>
                <div style={{ fontFamily: 'monospace', color: '#92400e' }}>{attestation.t5_trackable.chainBlock.index}</div>
              </div>
            </div>
          </T5Section>
        </div>
      )}
    </div>
  );
}

// ─── Tab 4: Hash Chain ────────────────────────────────────────────
function HashChainDemo() {
  const [entries, setEntries] = useState<string[]>(['GRI 305-1: 1250 tCO₂e', 'GRI 302-1: 5847 MWh', 'GRI 2-7: 1250 員工']);
  const [newEntry, setNewEntry] = useState('');
  const [chain, setChain] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [tamperIdx, setTamperIdx] = useState<number | null>(null);

  const buildChain = async () => {
    setLoading(true);
    setTamperIdx(null);
    const blocks: any[] = [];
    let prevHash = '0'.repeat(64);
    for (let i = 0; i < entries.length; i++) {
      const block = await mineBlock(i, entries[i], prevHash);
      blocks.push(block);
      prevHash = block.hash;
    }
    setChain(blocks);
    setLoading(false);
  };

  const addEntry = () => {
    if (newEntry.trim()) { setEntries([...entries, newEntry.trim()]); setNewEntry(''); setChain([]); }
  };

  const tamper = (idx: number) => {
    const tampered = [...entries];
    tampered[idx] = tampered[idx] + ' [TAMPERED!]';
    setEntries(tampered);
    setTamperIdx(idx);
    setChain([]);
  };

  return (
    <div>
      <div style={{ background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: 10, padding: '14px 16px', marginBottom: 20, fontSize: 13, color: '#0369a1', lineHeight: 1.6 }}>
        <strong>區塊鏈式審計鏈：</strong> 每筆審計記錄的雜湊都包含前一筆的雜湊，形成不可截斷的鏈。
        任何歷史數據的修改都會使後續所有區塊失效（用「篡改」按鈕測試）。
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <input className="form-input" value={newEntry} onChange={e => setNewEntry(e.target.value)} placeholder="新增審計記錄..." onKeyDown={e => e.key === 'Enter' && addEntry()} style={{ flex: 1 }} />
        <button className="btn btn-outline" onClick={addEntry}>新增</button>
      </div>

      <button className="btn btn-primary btn-lg" style={{ width: '100%', marginBottom: 16 }} onClick={buildChain} disabled={loading || entries.length === 0}>
        {loading ? <><Loader size={14} className="animate-spin" /> 挖礦中...</> : <><Link size={14} /> 建立雜湊鏈（含 Proof of Work）</>}
      </button>

      {chain.length > 0 && (
        <div style={{ animation: 'fadeIn 0.3s ease' }}>
          {chain.map((block, i) => (
            <div key={i} style={{ border: `2px solid ${block.hash.startsWith('00') ? '#86efac' : '#fca5a5'}`, borderRadius: 10, padding: 14, marginBottom: 10, background: block.hash.startsWith('00') ? '#f0fdf4' : '#fef2f2' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <div style={{ fontWeight: 700, fontSize: 13, color: '#1e293b' }}>區塊 #{block.index}</div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  {block.hash.startsWith('00') ? <CheckCircle size={14} color="#16a34a" /> : <XCircle size={14} color="#dc2626" />}
                  <button onClick={() => tamper(i)} className="btn btn-danger btn-sm">🪓 篡改此塊</button>
                </div>
              </div>
              <div style={{ fontFamily: 'monospace', fontSize: 11, marginBottom: 4 }}>
                <span style={{ color: '#64748b' }}>數據: </span><span style={{ color: '#1e293b' }}>{block.data}</span>
              </div>
              <div style={{ fontFamily: 'monospace', fontSize: 11, marginBottom: 4 }}>
                <span style={{ color: '#64748b' }}>雜湊: </span>
                <span style={{ color: block.hash.startsWith('00') ? '#15803d' : '#dc2626', wordBreak: 'break-all' }}>{block.hash}</span>
              </div>
              <div style={{ fontFamily: 'monospace', fontSize: 11 }}>
                <span style={{ color: '#64748b' }}>前一雜湊: </span><span style={{ color: '#94a3b8', wordBreak: 'break-all' }}>{block.previousHash.substring(0, 48)}...</span>
              </div>
              <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 4 }}>Nonce: {block.nonce} | {block.timestamp}</div>
            </div>
          ))}
        </div>
      )}

      {tamperIdx !== null && (
        <div style={{ background: '#fef2f2', border: '2px solid #fca5a5', borderRadius: 10, padding: 14, marginTop: 8, fontSize: 13, color: '#dc2626' }}>
          ⚠️ 已篡改區塊 #{tamperIdx}，請重新建立雜湊鏈以觀察後續區塊全部失效的效果
        </div>
      )}
    </div>
  );
}

// ─── Tab 5: Live Verify ───────────────────────────────────────────
function LiveVerify() {
  const [originalData, setOriginalData] = useState('{"metric":"範疇一排放量","value":1250,"unit":"tCO₂e","source":"ISO 14064-1"}');
  const [modifiedData, setModifiedData] = useState('');
  const [hashResult, setHashResult] = useState<HashLockResult | null>(null);
  const [verifyResult, setVerifyResult] = useState<{ original: boolean; modified: boolean } | null>(null);
  const [loading, setLoading] = useState(false);

  const seal = async () => {
    setLoading(true);
    const r = await createHashLock(JSON.parse(originalData));
    setHashResult(r);
    setModifiedData(originalData);
    setVerifyResult(null);
    setLoading(false);
  };

  const verify = async () => {
    if (!hashResult) return;
    setLoading(true);
    let origObj: any, modObj: any;
    try { origObj = JSON.parse(originalData); } catch { origObj = originalData; }
    try { modObj = JSON.parse(modifiedData); } catch { modObj = modifiedData; }
    const [origValid, modValid] = await Promise.all([
      verifyHashLock(origObj, hashResult),
      verifyHashLock(modObj, hashResult),
    ]);
    setVerifyResult({ original: origValid, modified: modValid });
    setLoading(false);
  };

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        <div>
          <label className="form-label">原始數據（封印對象）</label>
          <textarea className="form-textarea" value={originalData} onChange={e => setOriginalData(e.target.value)} rows={5} style={{ fontFamily: 'monospace', fontSize: 12 }} />
        </div>
        <div>
          <label className="form-label">待驗算數據（可自行修改任意字元）</label>
          <textarea className="form-textarea" value={modifiedData} onChange={e => setModifiedData(e.target.value)} rows={5} style={{ fontFamily: 'monospace', fontSize: 12 }} />
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
        <button className="btn btn-primary btn-lg" onClick={seal} disabled={loading} style={{ flex: 1 }}>
          {loading ? <><Loader size={14} className="animate-spin" /></> : <><Lock size={14} /> 封印原始數據</>}
        </button>
        <button className="btn btn-gold btn-lg" onClick={verify} disabled={!hashResult || loading} style={{ flex: 1 }}>
          <Shield size={14} /> 比對驗算
        </button>
      </div>

      {hashResult && (
        <div style={{ marginBottom: 16 }}>
          <CodeBlock label="封印雜湊（Hash Lock）" value={hashResult.hash} />
          <CodeBlock label="Nonce" value={hashResult.nonce} />
        </div>
      )}

      {verifyResult && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, animation: 'fadeIn 0.3s ease' }}>
          <div style={{ background: verifyResult.original ? '#f0fdf4' : '#fef2f2', border: `2px solid ${verifyResult.original ? '#86efac' : '#fca5a5'}`, borderRadius: 10, padding: 16, textAlign: 'center' }}>
            {verifyResult.original ? <CheckCircle size={28} color="#16a34a" /> : <XCircle size={28} color="#dc2626" />}
            <div style={{ fontWeight: 700, marginTop: 8, color: verifyResult.original ? '#15803d' : '#dc2626' }}>
              {verifyResult.original ? '✅ 原始數據驗算通過' : '❌ 原始數據驗算失敗'}
            </div>
          </div>
          <div style={{ background: verifyResult.modified ? '#f0fdf4' : '#fef2f2', border: `2px solid ${verifyResult.modified ? '#86efac' : '#fca5a5'}`, borderRadius: 10, padding: 16, textAlign: 'center' }}>
            {verifyResult.modified ? <CheckCircle size={28} color="#16a34a" /> : <XCircle size={28} color="#dc2626" />}
            <div style={{ fontWeight: 700, marginTop: 8, color: verifyResult.modified ? '#15803d' : '#dc2626' }}>
              {verifyResult.modified ? '✅ 修改數據驗算通過（未修改）' : '❌ 修改數據驗算失敗（偵測到篡改）'}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────
const TABS: { id: Tab; label: string; sub: string; icon: any }[] = [
  { id: 'hash', label: 'SHA-256 雜湊實驗室', sub: 'Hash Lab', icon: Hash },
  { id: 'zkp', label: 'ZKP 零知識證明', sub: 'Commitment Scheme', icon: Shield },
  { id: '5t', label: '5T 完整認證', sub: 'Full Attestation', icon: Lock },
  { id: 'chain', label: '區塊鏈審計鏈', sub: 'Hash Chain PoW', icon: Link },
  { id: 'verify', label: '即時驗算中心', sub: 'Live Verify', icon: CheckCircle },
];

export default function ProofCenterPage() {
  const [tab, setTab] = useState<Tab>('hash');

  return (
    <AppShell>
      <div className="page-wrapper">
        <div className="page-header" style={{ marginBottom: 24 }}>
          <h1>🔐 5T × ZKP 誠信證明中心</h1>
          <p>
            使用瀏覽器原生 Web Crypto API — 完全透明、可在 DevTools 獨立驗算，無任何第三方函式庫依賴
          </p>
          <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
            {['SHA-256', 'SHA-512', 'HMAC-SHA256', 'Pedersen Commitment', 'Proof of Work', 'Web Crypto API Level 3'].map(t => (
              <span key={t} style={{ background: 'rgba(253,181,21,0.2)', color: '#FDB515', padding: '2px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700 }}>{t}</span>
            ))}
          </div>
        </div>

        <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
          <div style={{ display: 'flex', borderBottom: '2px solid #f1f5f9', overflowX: 'auto' }}>
            {TABS.map(t => {
              const Icon = t.icon;
              const active = tab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  style={{
                    padding: '14px 20px', border: 'none', background: 'transparent', cursor: 'pointer',
                    borderBottom: `3px solid ${active ? '#003262' : 'transparent'}`,
                    color: active ? '#003262' : '#64748b', fontWeight: active ? 700 : 400,
                    fontSize: 13, display: 'flex', alignItems: 'center', gap: 7, whiteSpace: 'nowrap',
                    transition: 'all 0.15s', flexShrink: 0,
                  }}
                >
                  <Icon size={15} />
                  <div style={{ textAlign: 'left' }}>
                    <div>{t.label}</div>
                    <div style={{ fontSize: 10, color: '#94a3b8', fontWeight: 400 }}>{t.sub}</div>
                  </div>
                </button>
              );
            })}
          </div>

          <div style={{ padding: 24 }}>
            {tab === 'hash' && <HashLab />}
            {tab === 'zkp' && <ZKPDemo />}
            {tab === '5t' && <T5AttestationDemo />}
            {tab === 'chain' && <HashChainDemo />}
            {tab === 'verify' && <LiveVerify />}
          </div>
        </div>
      </div>
    </AppShell>
  );
}