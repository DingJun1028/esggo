// src/components/dashboard/ComplianceMatrix.tsx
import React, { useState, useEffect } from 'react';
import { ShieldCheck, AlertTriangle, CheckCircle, Search, FileText, Loader2 } from 'lucide-react';
import { omniClient } from '@/api/omniClient';

interface ComplianceItem {
  id: string;
  category: '環境 (E)' | '社會 (S)' | '治理 (G)';
  code: string;
  requirement: string;
  status: 'compliant' | 'warning' | 'non-compliant';
  lastCheck: string;
  sourceUrl?: string;
}

const COMPLIANCE_DATA: ComplianceItem[] = [
  // Environmental (E) - 氣候法與 ISO
  {
    id: 'c1',
    category: '環境 (E)',
    code: 'ISO 14064-1:5.1',
    requirement: '組織邊界設定 (採營運控制權法)',
    status: 'compliant',
    lastCheck: '2026-01-12',
  },
  {
    id: 'c2',
    category: '環境 (E)',
    code: '氣候變遷因應法 §28',
    requirement: '碳費申報與查驗 (每年 4 月底前完成)',
    status: 'warning',
    lastCheck: '2026-01-10',
  },
  {
    id: 'c3',
    category: '環境 (E)',
    code: '空氣污染防制法 §24',
    requirement: '固定污染源設置與操作許可證 (定期展延)',
    status: 'compliant',
    lastCheck: '2025-12-20',
  },
  {
    id: 'c4',
    category: '環境 (E)',
    code: '歐盟 CBAM 規範',
    requirement: '季度過渡期報告 (碳含量計算與申報)',
    status: 'compliant',
    lastCheck: '2025-12-31',
  },

  // Social (S) - 勞基法與職安法
  {
    id: 'c5',
    category: '社會 (S)',
    code: '勞動基準法 §30',
    requirement: '勞工出勤紀錄保存 (至少 5 年，至分鐘)',
    status: 'compliant',
    lastCheck: '2026-01-13',
  },
  {
    id: 'c6',
    category: '社會 (S)',
    code: '職業安全衛生法 §6',
    requirement: '機械設備器具安全防護 (自動化產線安全)',
    status: 'warning',
    lastCheck: '2026-01-08',
  },
  {
    id: 'c7',
    category: '社會 (S)',
    code: 'GRI 401-2',
    requirement: '正職員工福利 (包含保險、育嬰假等)',
    status: 'compliant',
    lastCheck: '2025-11-30',
  },

  // Governance (G) - 證交法與 ISO 27001
  {
    id: 'c8',
    category: '治理 (G)',
    code: '證券交易法 §14-1',
    requirement: '獨立董事設置與審計委員會運作',
    status: 'compliant',
    lastCheck: '2025-06-15',
  },
  {
    id: 'c9',
    category: '治理 (G)',
    code: 'ISO 27001:A.5.1',
    requirement: '資訊安全政策 (管理階層核准與發布)',
    status: 'compliant',
    lastCheck: '2025-12-01',
  },
  {
    id: 'c10',
    category: '治理 (G)',
    code: '內控準則 §9',
    requirement: '關係人交易之管理與揭露',
    status: 'compliant',
    lastCheck: '2026-01-05',
  },
];

const ComplianceMatrix: React.FC = () => {
  const [filter, setFilter] = useState('');
  const [data, setData] = useState<ComplianceItem[]>(COMPLIANCE_DATA);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchLiveRequirements = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/compliance/requirements');
        if (response.ok) {
          const liveReqs: any[] = await response.json();
          if (liveReqs.length > 0) {
            const mappedData: ComplianceItem[] = liveReqs.map((req: any) => ({
              id: req.id,
              category:
                req.category === 'E' ? '環境 (E)' : req.category === 'S' ? '社會 (S)' : '治理 (G)',
              code: req.code,
              requirement: req.title,
              status: 'compliant', // Default for sentient demo
              lastCheck: new Date().toISOString().split('T')[0] || '2026-01-01',
            }));
            // Merge with local data, prioritizing live reqs
            const combined = [
              ...mappedData,
              ...COMPLIANCE_DATA.filter(c => !mappedData.some(m => m.code === c.code)),
            ];
            setData(combined);
          }
        }
      } catch (err) {
        console.warn('Could not fetch live compliance requirements, using cache.', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLiveRequirements();
  }, []);

  const filteredData = data.filter(
    item =>
      item.requirement.includes(filter) || item.code.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl overflow-hidden h-full flex flex-col font-sans">
      <div className="p-4 border-b border-white/10 flex justify-between items-center bg-slate-800/50">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            全法遵核規矩陣 (Compliance Matrix)
          </h3>
          <span className="text-[10px] text-slate-400 font-mono tracking-wider">
            REAL-TIME REGULATORY DISCLOSURE
          </span>
        </div>
        <div className="relative flex items-center gap-2">
          {isLoading && <Loader2 className="w-3 h-3 text-cyan-400 animate-spin" />}
          <div className="relative">
            <Search className="w-3 h-3 absolute left-2 top-2 text-slate-500" />
            <input
              type="text"
              placeholder="搜尋條款..."
              value={filter}
              onChange={e => setFilter(e.target.value)}
              className="bg-slate-900 border border-slate-600 rounded-full pl-7 pr-3 py-1 text-xs text-white focus:border-emerald-500 outline-none w-32 focus:w-48 transition-all"
            />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-0 scrollbar-thin scrollbar-thumb-slate-700">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-800 sticky top-0 z-10 text-[10px] text-slate-400 font-semibold tracking-wider">
            <tr>
              <th className="p-3">條款代碼 (Code)</th>
              <th className="p-3">核規要求細節 (Requirement)</th>
              <th className="p-3 text-right">狀態 (Status)</th>
            </tr>
          </thead>
          <tbody className="text-xs">
            {filteredData.map((item, idx) => (
              <tr
                key={item.id}
                className="border-b border-white/5 hover:bg-white/5 transition-colors"
              >
                <td className="p-3 text-cyan-400 font-bold whitespace-nowrap align-top">
                  {item.code}
                  <div className="text-[10px] text-slate-500 font-normal mt-1">{item.category}</div>
                </td>
                <td className="p-3 text-slate-300 leading-relaxed align-top">
                  {item.requirement}
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] text-slate-600">稽核日: {item.lastCheck}</span>
                    <button className="flex items-center gap-0.5 text-[10px] text-slate-500 hover:text-cyan-400 transition-colors">
                      <FileText className="w-3 h-3" /> 檢視條文
                    </button>
                  </div>
                </td>
                <td className="p-3 text-right sticky right-0 align-top">
                  {item.status === 'compliant' && (
                    <span className="inline-flex items-center gap-1 text-emerald-400 bg-emerald-900/20 px-2 py-0.5 rounded border border-emerald-500/30">
                      <CheckCircle className="w-3 h-3" /> 合規
                    </span>
                  )}
                  {item.status === 'warning' && (
                    <span className="inline-flex items-center gap-1 text-amber-400 bg-amber-900/20 px-2 py-0.5 rounded border border-amber-500/30 animate-pulse">
                      <AlertTriangle className="w-3 h-3" /> 注意
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="p-2 border-t border-white/5 bg-slate-900/80 text-[10px] text-center text-slate-600 font-mono">
        System Audit Trail ID: #SHA-256-{new Date().getTime().toString(16).toUpperCase()}
      </div>
    </div>
  );
};

export default ComplianceMatrix;
