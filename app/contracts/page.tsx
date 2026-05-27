'use client';
import React, { useState, useEffect } from 'react';
import { ListTemplate } from '@/components/templates/ListTemplate';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Plus, Search, FileText, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

interface Contract {
  id: string;
  title: string;
  party: string;
  status: 'draft' | 'pending' | 'active' | 'completed' | 'archived';
  amount: string;
  date: string;
}

const MOCK_CONTRACTS: Contract[] = [
  { id: 'CON-2026-001', title: '2026 太陽能板採購合約', party: '宏碁綠能', status: 'active', amount: 'NTD 12,000,000', date: '2026-05-15' },
  { id: 'CON-2026-002', title: 'ESG 顧問諮詢服務協議', party: '資誠聯合會計師事務所', status: 'pending', amount: 'NTD 2,500,000', date: '2026-05-20' },
  { id: 'CON-2026-003', title: '碳權交易預約合同', party: '新加坡碳交易所', status: 'draft', amount: 'USD 500,000', date: '2026-05-25' },
];

export default function ContractsPage() {
  const [loading, setLoading] = useState(false);

  return (
    <ListTemplate<Contract>
      title="合約管理模組"
      description="管理企業 ESG 相關採購、諮詢與合作合約，確保履約誠信與 5T 存證。"
      primaryAction={
        <Button variant="primary" className="rounded-xl px-6 h-11 shadow-lg shadow-aqua-cyan-midtone/20 bg-gradient-to-r from-aqua-cyan-midtone to-aqua-cyan hover:from-aqua-cyan hover:to-aqua-cyan-shadow border-none text-white font-bold">
          <Plus size={18} className="mr-2" /> 建立新合約
        </Button>
      }
      filterBar={
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <Input className="pl-10 h-11 bg-white border-slate-200 focus:border-aqua-cyan-midtone" placeholder="搜尋合約編號、名稱或對象..." />
          </div>
          <Button variant="ghost" className="h-11 px-6 border-slate-200 text-slate-600">進階篩選</Button>
        </div>
      }
      columns={[
        { key: 'id', label: '合約編號', width: '15%' },
        { key: 'title', label: '合約名稱', width: '35%' },
        { key: 'party', label: '簽約對象', width: '20%' },
        { key: 'status', label: '目前狀態', width: '10%' },
        { key: 'date', label: '簽署日期', width: '15%' },
        { key: 'action', label: '', width: '5%' },
      ]}
      data={MOCK_CONTRACTS}
      loading={loading}
      renderRow={(contract) => (
        <tr key={contract.id} className="hover:bg-surface-secondary/30 transition-colors group">
          <td className="px-6 py-4 font-mono text-xs font-black text-slate-500">{contract.id}</td>
          <td className="px-6 py-4 font-black text-text-primary text-sm">{contract.title}</td>
          <td className="px-6 py-4 font-medium text-text-secondary text-sm">{contract.party}</td>
          <td className="px-6 py-4">
            <Badge tone={
              contract.status === 'active' ? 'success' : 
              contract.status === 'pending' ? 'warning' : 
              contract.status === 'draft' ? 'neutral' : 'info'
            } label={contract.status.toUpperCase()} />
          </td>
          <td className="px-6 py-4 font-mono text-[11px] text-slate-400">{contract.date}</td>
          <td className="px-6 py-4 text-right">
            <Link href={`/contracts/${contract.id}`}>
              <button className="p-2 rounded-lg hover:bg-aqua-cyan/10 text-aqua-cyan-midtone transition-all opacity-0 group-hover:opacity-100">
                <ArrowUpRight size={18} />
              </button>
            </Link>
          </td>
        </tr>
      )}
    />
  );
}
