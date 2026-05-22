'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Shield, Search, CheckCircle, XCircle, Clock, Hash, AlertTriangle, Lock, ExternalLink, RefreshCw, FileText, User } from 'lucide-react';
import { listVaultRecords, type VaultOmniRecord, verifyRecord } from '../../lib/vault-omni';
import { 
  BrandButton, BrandBadge, BrandCard, BrandStatusDot, BrandProgress, BrandPageHeader, BrandCardHeader, BrandInput 
} from '../../components/brand';

async function sha256(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

function VerifyContent() {
  const searchParams = useSearchParams();
  const [records, setRecords] = useState<VaultOmniRecord[]>([]);
  const [inputHash, setInputHash] = useState('');
  const [verifyInput, setVerifyInput] = useState('');
  const [result, setResult] = useState<{ match: boolean; computed: string; original: string; detail?: string } | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(true);

  const loadRecords = async () => {
    setLoading(true);
    const data = await listVaultRecords(20);
    setRecords(data);
    setLoading(false);
  };

  useEffect(() => {
    loadRecords();
  }, []);

  useEffect(() => {
    const uuid = searchParams.get('uuid');
    if (uuid && records.length > 0) {
      const record = records.find(r => r.uuid === uuid);
      if (record) {
        setInputHash(record.hash_lock);
        setVerifyInput(record.payload);
        handleVerify(record.payload, record.hash_lock);
      }
    }
  }, [searchParams, records]);

  const handleVerify = async (input = verifyInput, target = inputHash) => {
    if (!input.trim() || !target.trim()) return;
    setVerifying(true);
    setStep(0);
    setResult(null);

    for (let i = 1; i <= 4; i++) {
      await new Promise(r => setTimeout(r, 600));
      setStep(i);
    }

    const computed = await sha256(input);
    const match = computed === target;
    
    // Also use the library verification for deeper checks if possible
    const recordFound = records.find(r => r.hash_lock === target);
    let detail = '';
    if (recordFound) {
      const v = verifyRecord(recordFound);
      detail = v.detail;
    }

    setResult({ match, computed, original: target, detail });
    setVerifying(false);
  };

  const STEPS = ['接收驗算請求', 'SHA-256 雜湊計算', '比對聖碑記錄 (T4)', '輸出驗算結果'];

  return (
    <div className="page-container max-w-7xl mx-auto p-6 space-y-6 fade-in">
      <BrandPageHeader 
        title="VerifyLink™ 審計驗算入口" 
        subtitle="零知識證明 · SHA-256 雜湊驗算 · 5T 不可篡改協議"
        icon={<Shield size={24}/>}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Verifier */}
        <BrandCard padding="lg">
          <BrandCardHeader 
            title="即時 Hash 驗算器" 
            subtitle="手動驗證數據完整性"
            icon={<Hash size={18} className="text-[#003262]" />}
          />
          <div className="space-y-4 mt-6">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase">原始數據內容 (Payload)</label>
              <textarea 
                value={verifyInput} 
                onChange={e => setVerifyInput(e.target.value)} 
                placeholder="貼上您要驗算的原始 JSON 或文字..."
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs font-mono min-h-[120px] focus:bg-white focus:border-blue-600 outline-none transition-all" 
              />
            </div>
            <BrandInput 
              label="對照 Hash 值 (Hash Lock)" 
              value={inputHash} 
              onChange={e => setInputHash(e.target.value)} 
              placeholder="貼上原始 SHA-256 Hash..."
              className="font-mono text-[11px]"
            />
            <BrandButton 
              variant="primary" 
              fullWidth 
              onClick={() => handleVerify()} 
              loading={verifying}
              disabled={!verifyInput || !inputHash}
            >
              <Lock size={16}/> {verifying ? '正在計算 ZKP...' : '啟動 5T 驗算'}
            </BrandButton>
          </div>
        </BrandCard>

        {/* Steps + Result */}
        <BrandCard padding="lg" className="bg-slate-900 text-white border-none shadow-2xl">
          <BrandCardHeader 
            title="驗算流程實況" 
            subtitle="SHA-256 Runtime Trace"
            icon={<RefreshCw size={18} className="text-blue-400" />}
          />
          <div className="flex flex-col gap-6 mt-8">
            {STEPS.map((s, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-500
                  ${step > i ? 'bg-blue-600 text-white scale-110' : step === i && verifying ? 'bg-gold-500 text-white animate-pulse' : 'bg-slate-800 text-slate-500'}
                `}>
                  {step > i ? <CheckCircle size={16} /> : i + 1}
                </div>
                <span className={`text-sm font-bold tracking-tight ${step > i ? 'text-blue-400' : 'text-slate-500'}`}>{s}</span>
              </div>
            ))}
          </div>

          {result && (
            <div className={`mt-8 p-6 rounded-3xl animate-in zoom-in-95 duration-500 ${result.match ? 'bg-green-600/10 border border-green-500/20' : 'bg-red-600/10 border border-red-500/20'}`}>
              <div className="flex items-center gap-3 mb-3">
                {result.match ? <CheckCircle size={24} className="text-green-500" /> : <XCircle size={24} className="text-red-500" />}
                <span className={`text-lg font-black uppercase tracking-tight ${result.match ? 'text-green-500' : 'text-red-500'}`}>
                  {result.match ? 'Integrity Verified' : 'Integrity Failed'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mb-4 leading-relaxed">{result.detail || (result.match ? '數據完整性驗證通過。此紀錄與 5T 聖碑中記載的原始雜湊完全相符。' : '數據雜湊不符。內容可能在封印後遭到篡改或格式不一致。')}</p>
              <div className="p-3 bg-black/30 rounded-xl font-mono text-[9px] text-blue-300 break-all border border-white/5">
                Computed: {result.computed}
              </div>
            </div>
          )}
        </BrandCard>
      </div>

      {/* Records Table */}
      <BrandCard padding="none" className="overflow-hidden">
        <div className="p-6 bg-white border-b border-slate-100 flex justify-between items-center">
          <h3 className="text-base font-bold text-slate-900">已封印 5T 實證記錄 (Vault Omni Core)</h3>
          <BrandButton variant="ghost" size="sm" onClick={loadRecords}><RefreshCw size={14}/></BrandButton>
        </div>
        <div className="overflow-x-auto">
          <BrandTable 
            columns={[
              { key: 'uuid', label: 'UUID' },
              { key: 'dimension', label: '層級' },
              { key: 'hash', label: 'Hash Lock' },
              { key: 'time', label: '時間' },
              { key: 'action', label: '操作' },
            ]}
            data={records.map(r => ({
              uuid: <span className="font-mono text-[10px] font-bold text-blue-600">{r.uuid.slice(0, 8)}</span>,
              dimension: <BrandBadge variant="outline" size="xs">{r.dimension}</BrandBadge>,
              hash: <span className="font-mono text-[10px] text-slate-400">{r.hash_lock.slice(0, 16)}...</span>,
              time: <span className="text-[10px] text-slate-400 font-bold uppercase">{new Date(r.timestamp).toLocaleString()}</span>,
              action: (
                <div className="flex gap-2">
                  <BrandButton 
                    variant="outline" 
                    size="sm" 
                    onClick={() => { setInputHash(r.hash_lock); setVerifyInput(r.payload); handleVerify(r.payload, r.hash_lock); }}
                  >
                    驗算
                  </BrandButton>
                  <BrandButton variant="ghost" size="sm" onClick={() => window.open(`/audit-verify?uuid=${r.uuid}`)}>
                    <ExternalLink size={12}/>
                  </BrandButton>
                </div>
              )
            }))}
          />
        </div>
      </BrandCard>
    </div>
  );
}

export default function AuditVerifyPage() {
  return (
    <Suspense fallback={<div>Loading Verifier...</div>}>
      <VerifyContent />
    </Suspense>
  );
}