/**
 * HITL Reviewer - 人工審查介面
 * Human-in-the-Loop 審查工作流程
 */

import React, { useState, useEffect } from 'react';

interface Proposal {
  id: string;
  skillName: string;
  proposedBy: string;
  type: string;
  description: string;
  parameters: any;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
}

export const HITLReviewer: React.FC = () => {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');

  const mockProposals: Proposal[] = [
    {
      id: '1',
      skillName: 'email_send',
      proposedBy: 'ESG Advisor',
      type: 'execute_skill',
      description: '發送 ESG 報告給董事會',
      parameters: { to: 'board@company.com', subject: 'Q4 ESG Report' },
      status: 'pending',
      createdAt: new Date(),
    },
    {
      id: '2',
      skillName: 'report_generate',
      proposedBy: 'Data Analyst',
      type: 'execute_skill',
      description: '生成碳排放分析報告',
      parameters: { reportType: 'carbon_analysis', format: 'pdf' },
      status: 'pending',
      createdAt: new Date(Date.now() - 3600000),
    },
  ];

  useEffect(() => {
    setProposals(mockProposals);
  }, []);

  const handleApprove = (id: string) => {
    setProposals(proposals.map(p => (p.id === id ? { ...p, status: 'approved' as const } : p)));
  };

  const handleReject = (id: string) => {
    setProposals(proposals.map(p => (p.id === id ? { ...p, status: 'rejected' as const } : p)));
  };

  const filteredProposals =
    filter === 'all' ? proposals : proposals.filter(p => p.status === filter);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-cosmic mb-6">🔍 HITL 審查中心</h1>

      {/* 過濾器 */}
      <div className="flex gap-3 mb-6">
        {(['all', 'pending', 'approved', 'rejected'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg transition-cosmic ${
              filter === f ? 'glass-strong glow' : 'glass hover:glass-strong'
            }`}
          >
            {f === 'all' && '全部'}
            {f === 'pending' && '⏳ 待審查'}
            {f === 'approved' && '✅ 已批准'}
            {f === 'rejected' && '❌ 已拒絕'}
          </button>
        ))}
      </div>

      {/* 統計 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="nebula-card p-4">
          <div className="text-3xl font-bold text-yellow-400">
            {proposals.filter(p => p.status === 'pending').length}
          </div>
          <div className="text-indigo-300 text-sm">待審查</div>
        </div>
        <div className="nebula-card p-4">
          <div className="text-3xl font-bold text-green-400">
            {proposals.filter(p => p.status === 'approved').length}
          </div>
          <div className="text-indigo-300 text-sm">已批准</div>
        </div>
        <div className="nebula-card p-4">
          <div className="text-3xl font-bold text-red-400">
            {proposals.filter(p => p.status === 'rejected').length}
          </div>
          <div className="text-indigo-300 text-sm">已拒絕</div>
        </div>
      </div>

      {/* 提案列表 */}
      <div className="space-y-4">
        {filteredProposals.map(proposal => (
          <div key={proposal.id} className="nebula-card p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-cosmic mb-2">{proposal.skillName}</h3>
                <p className="text-indigo-300">{proposal.description}</p>
              </div>
              <span
                className={`px-3 py-1 rounded-lg text-sm ${
                  proposal.status === 'pending'
                    ? 'glass-strong'
                    : proposal.status === 'approved'
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-red-500/20 text-red-400'
                }`}
              >
                {proposal.status === 'pending' && '⏳ 待審查'}
                {proposal.status === 'approved' && '✅ 已批准'}
                {proposal.status === 'rejected' && '❌ 已拒絕'}
              </span>
            </div>

            <div className="glass p-4 rounded-lg mb-4">
              <div className="text-sm text-indigo-400 mb-2">參數:</div>
              <pre className="text-xs text-indigo-200 overflow-x-auto">
                {JSON.stringify(proposal.parameters, null, 2)}
              </pre>
            </div>

            <div className="flex items-center justify-between text-sm text-indigo-400 mb-4">
              <span>提出者: {proposal.proposedBy}</span>
              <span>{proposal.createdAt.toLocaleString('zh-TW')}</span>
            </div>

            {proposal.status === 'pending' && (
              <div className="flex gap-3">
                <button
                  onClick={() => handleApprove(proposal.id)}
                  className="btn-cosmic flex-1 bg-green-500/20 hover:bg-green-500/30"
                >
                  ✅ 批准
                </button>
                <button
                  onClick={() => handleReject(proposal.id)}
                  className="glass flex-1 hover:bg-red-500/20"
                >
                  ❌ 拒絕
                </button>
              </div>
            )}
          </div>
        ))}

        {filteredProposals.length === 0 && (
          <div className="text-center text-indigo-300 py-12">
            <div className="text-6xl mb-4">📭</div>
            <p>
              目前沒有
              {filter === 'all'
                ? ''
                : filter === 'pending'
                  ? '待審查的'
                  : filter === 'approved'
                    ? '已批准的'
                    : '已拒絕的'}
              提案
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
