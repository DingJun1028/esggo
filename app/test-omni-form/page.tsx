'use client';

import React, { useState } from 'react';
import { OmniForm } from '@/components/ui/omni/OmniForm';
import { OmniComponentHeart } from '@esggo/types';

export default function TestOmniFormPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [heartState, setHeartState] = useState<OmniComponentHeart>({
    omniSignature: 'Pending ZKP Signature...',
    omniClass: 'OmniGeneral',
    coreContext: {
      actor: 'system',
      timestamp: Date.now(),
      requestId: 'test-req',
      environment: 'development',
    },
    resonanceState: 0.5, // 初始草稿狀態：水色青
    fiveTState: {
      tangible: true,
      traceable: true,
      trackable: true,
      transparent: true,
      trustworthy: false, // 尚未封印
    },
  });

  const handleFormSubmit = async (data: unknown) => {
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/nexus/agent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-omni-token': 'OmniAgent_gold_2026',
        },
        body: JSON.stringify({
          tool: 'seal_5t_proof',
          arguments: {
            atomId: crypto.randomUUID(),
            proof: data,
          },
        }),
      });

      const result = await res.json();
      if (result.success && result.data?.seal) {
        // 更新為 100% 共鳴 (永恆金)
        setHeartState((prev) => ({
          ...prev,
          omniSignature: result.data.seal,
          resonanceState: 1.0,
          fiveTState: {
            tangible: prev.fiveTState?.tangible ?? true,
            traceable: prev.fiveTState?.traceable ?? true,
            trackable: prev.fiveTState?.trackable ?? true,
            transparent: prev.fiveTState?.transparent ?? true,
            trustworthy: true,
          },
        }));

        alert(
          `資料已成功寫入 ESG Atoms，並完成 5T 哈希封印！\n\n狀態: ${result.data.writeStatus}\nAtom ID: ${result.data.atomId}\nZKP Hash: ${result.data.seal}`
        );
      } else {
        throw new Error(result.error || '封印失敗');
      }
    } catch (e) {
      console.error(e);
      alert('封印過程發生錯誤');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--theme-base)] text-[var(--theme-text)] p-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-bold mb-2 text-[#63a6b0]">OmniForm 5T 封裝展示</h1>
          <p className="text-[var(--theme-text-muted)] text-sm">
            提交表單後，將呼叫後端 <b>OmniNexus API</b>。系統會產生密碼學 Hash，並將資料物理封存至{' '}
            <b>esg_atoms</b> 表中。 封存完成後，表單將瞬間提升至 100% 共鳴狀態 (永恆金防護罩)！
          </p>
        </div>

        <OmniForm
          omniHeart={heartState}
          submitLabel={isSubmitting ? 'ZKP 封印中...' : '簽署並送出 (ZKP Signed)'}
          fields={[
            {
              name: 'entityName',
              label: '組織實體名稱',
              type: 'text',
              required: true,
              placeholder: '例：全球永續發展總部',
            },
            {
              name: 'emissionData',
              label: '碳排放總量 (tCO2e)',
              type: 'number',
              required: true,
              placeholder: '0.00',
            },
            {
              name: 'dataSource',
              label: '數據來源',
              type: 'enum',
              options: ['IoT 感測器', 'ERP 系統匯出', '手動憑證輸入'],
              required: true,
            },
            {
              name: 'notes',
              label: '稽核備註 (不可篡改)',
              type: 'textarea',
              placeholder: '輸入查證過程或異常說明...',
            },
          ]}
          onSubmit={handleFormSubmit}
          onCancel={() => console.log('cancelled')}
        />
      </div>
    </div>
  );
}
