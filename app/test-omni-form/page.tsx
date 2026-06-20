'use client';

import React from 'react';
import { OmniForm } from '@/components/ui';
import { OmniComponentHeart } from '@esggo/types';

export default function TestOmniFormPage() {
  const mockHeart: OmniComponentHeart = {
    omniSignature: 'ZKP-FORM-2026-009',
    omniClass: 'DataEntry',
    coreContext: {
      actor: 'system',
      timestamp: Date.now()
    },
    resonanceState: 1.0,
    fiveTState: {
      tangible: true,
      traceable: true,
      trackable: true,
      transparent: true,
      trustworthy: true,
    }
  };

  const handleFormSubmit = (data: unknown) => {
    console.log('5T Secured Form Data:', data);
    alert('資料已透過 5T 封裝並送出！\n\n' + JSON.stringify(data, null, 2));
  };

  return (
    <div className="min-h-screen bg-[var(--theme-base)] text-[var(--theme-text)] p-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-bold mb-2 text-[#63a6b0]">OmniForm 5T 封裝展示</h1>
          <p className="text-[var(--theme-text-muted)] text-sm">
            本表單已注入 OmniHeart，並具備 100% 共鳴與完整的 5T Matrix。輸入框將呈現「水色青」鎖定，外框則由「永恆金」保護。
          </p>
        </div>

        <OmniForm
          omniHeart={mockHeart}
          submitLabel="簽署並送出 (ZKP Signed)"
          fields={[
            { name: 'entityName', label: '組織實體名稱', type: 'text', required: true, placeholder: '例：全球永續發展總部' },
            { name: 'emissionData', label: '碳排放總量 (tCO2e)', type: 'number', required: true, placeholder: '0.00' },
            { name: 'dataSource', label: '數據來源', type: 'enum', options: ['IoT 感測器', 'ERP 系統匯出', '手動憑證輸入'], required: true },
            { name: 'notes', label: '稽核備註 (不可篡改)', type: 'textarea', placeholder: '輸入查證過程或異常說明...' }
          ]}
          onSubmit={handleFormSubmit}
          onCancel={() => console.log('cancelled')}
        />
      </div>
    </div>
  );
}
