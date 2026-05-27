'use client';
import React, { useState } from 'react';
import { ListTemplate } from '@/components/templates/ListTemplate';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Plus, Search, Landmark, Calendar, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

interface Grant {
  id: string;
  title: string;
  agency: string;
  status: 'applying' | 'approved' | 'rejected' | 'closed' | 'reviewing';
  budget: string;
  deadline: string;
}

const MOCK_GRANTS: Grant[] = [
  { id: 'GRT-2026-A1', title: '中小企業節能減碳設備補助', agency: '經濟部', status: 'approved', budget: 'NTD 500,000', deadline: '2026-06-30' },
  { id: 'GRT-2026-B2', title: '智慧綠色供應鏈升級計畫', agency: '數位發展部', status: 'reviewing', budget: 'NTD 2,000,000', deadline: '2026-07-15' },
  { id: 'GRT-2026-C3', title: '國際 ESG 永續認證獎助', agency: '環境部', status: 'applying', budget: 'NTD 300,000', deadline: '2026-08-01' },
];

export default function GrantsPage() {
  const [loading, setLoading] = useState(false);

  return (
    <ListTemplate<Grant>
      title="補助案管理模組"
      description="追蹤各部會 ESG 補助案申請進度、經費核銷與結案報告。"
      primaryAction={
        <Button variant="primary" className="rounded-xl px-6 h-11 shadow-lg shadow-aqua-cyan-midtone/20 bg-gradient-to-r from-aqua-cyan-midtone to-aqua-cyan hover:from-aqua-cyan hover:to-aqua-cyan-shadow border-none text-white font-bold">
          <Plus size={18} className="mr-2" /> 申請新補助
        </Button>
      }
      filterBar={
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <Input className="pl-10 h-11 bg-white border-slate-200" placeholder="搜尋補助案名稱、局處或編號..." />
          </div>
          <Button variant="ghost" className="h-11 px-6 border-slate-200 text-slate-600">類型篩選</Button>
        </div>
      }
      columns={[
        { key: 'id', label: '補助編號', width: '15%' },
        { key: 'title', label: '補助案名稱', width: '35%' },
        { key: 'agency', label: '補助單位', width: '20%' },
        { key: 'status', label: '申請狀態', width: '10%' },
        { key: 'deadline', label: '截止日期', width: '15%' },
        { key: 'action', label: '', width: '5%' },
      ]}
      data={MOCK_GRANTS}
      loading={loading}
      renderRow={(grant) => (
        <tr key={grant.id} className="hover:bg-surface-secondary/30 transition-colors group">
          <td className="px-6 py-4 font-mono text-xs font-black text-slate-500">{grant.id}</td>
          <td className="px-6 py-4 font-black text-text-primary text-sm">{grant.title}</td>
          <td className="px-6 py-4 font-medium text-text-secondary text-sm">
            <div className="flex items-center gap-2">
              <Landmark size={12} className="text-slate-400" />
              {grant.agency}
            </div>
          </td>
          <td className="px-6 py-4">
            <Badge tone={
              grant.status === 'approved' ? 'success' : 
              grant.status === 'reviewing' ? 'info' : 
              grant.status === 'applying' ? 'warning' : 'neutral'
            } label={grant.status.toUpperCase()} />
          </td>
          <td className="px-6 py-4 font-mono text-[11px] text-slate-400">
             <div className="flex items-center gap-2">
                <Calendar size={12} />
                {grant.deadline}
             </div>
          </td>
          <td className="px-6 py-4 text-right">
            <Link href={`/grants/${grant.id}`}>
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
