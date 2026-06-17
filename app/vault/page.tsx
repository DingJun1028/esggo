'use client';

import React, { useState, useEffect } from 'react';
import { OmniCard } from '@/components/ui';
import { useOmniTheme } from '@/components/theme/OmniThemeProvider';

export default function VaultPage() {
  const [items, setItems] = useState<any[]>([]);
  const [stats, setStats] = useState({ total: 0, verified: 0 });
  const { theme } = useOmniTheme();

  useEffect(() => {
    // 模擬載入數據
    setItems([
      { id: '1', fileName: '碳盤查報告.pdf', category: 'report', tags: ['carbon', 'gri'] },
      { id: '2', fileName: '2025永續報告.docx', category: 'sustainability', tags: ['report'] },
      { id: '3', fileName: '供應鏈數據.xlsx', category: 'evidence', tags: ['supply-chain'] },
    ]);
    setStats({ total: 3, verified: 2 });
  }, []);

  return (
    <div className="min-h-screen p-6 bg-theme-background">
      <header className="mb-8">
        <h1 className="text-heading-lg">萬能典藏</h1>
        <p className="text-body text-theme-muted">加密文件、佐證鎖檔、永久封存</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <OmniCard>
          <h3 className="text-body-lg font-semibold">總檔案數</h3>
          <p className="text-3xl font-bold text-theme-primary">{stats.total}</p>
        </OmniCard>
        <OmniCard>
          <h3 className="text-body-lg font-semibold">已驗證</h3>
          <p className="text-3xl font-bold text-theme-success">{stats.verified}</p>
        </OmniCard>
        <OmniCard>
          <h3 className="text-body-lg font-semibold">加密等級</h3>
          <p className="text-lg font-bold">AES-256-GCM</p>
        </OmniCard>
      </div>

      <section>
        <h2 className="text-heading mb-4">檔案列表</h2>
        <div className="space-y-2">
          {items.map((item) => (
            <OmniCard key={item.id} className="p-4">
              <div className="flex justify-between items-center">
                <span>{item.fileName}</span>
                <span className="text-sm text-theme-muted">{item.category}</span>
              </div>
            </OmniCard>
          ))}
        </div>
      </section>
    </div>
  );
}
