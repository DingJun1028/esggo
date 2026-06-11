import React, { useState } from 'react';

// 定義萬能元件支援的區塊類型
type BlockType = 'narrative' | 'data_table' | 'compliance_statement';

interface ReportBlock {
  id: string;
  type: BlockType;
  content: string;
  hashLock?: string;
}

export function ReportBuilder() {
  const [blocks, setBlocks] = useState<ReportBlock[]>([]);
  const [reportStatus, setReportStatus] = useState<'draft' | 'sealed'>('draft');

  // 新增區塊
  const addBlock = (type: BlockType) => {
    setBlocks([...blocks, { id: Date.now().toString(), type, content: '' }]);
  };

  // 封印報告，觸發 OmniNexus API
  const sealReport = async () => {
    try {
      const res = await fetch('/api/nexus/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tool: 'seal_5t_proof',
          arguments: { blocks },
          userId: 'current-user-uuid' // 實際中從 Auth 取得
        })
      });
      const data = await res.json();
      
      if (data.success) {
        setReportStatus('sealed');
        alert(`報告已成功封印！\n5T 信任分數: ${data.metadata.trustScore}\nTransaction ID: ${data.metadata.transactionId}`);
      }
    } catch (e) {
      console.error(e);
      alert('無法觸發 Proof Center 封印，請確認 API 服務。');
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-md border border-gray-200">
      {/* 標題與狀態 */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">永續撰寫 (Report Builder 萬能元件)</h2>
        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
          reportStatus === 'sealed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
        }`}>
          {reportStatus === 'sealed' ? '🔒 已封印 (Trustworthy)' : '📝 草稿 (Draft)'}
        </span>
      </div>

      {/* 編輯區塊 */}
      <div className="space-y-4 mb-6">
        {blocks.map((block) => (
          <div key={block.id} className="p-4 border rounded-lg bg-gray-50 flex flex-col gap-2">
            <span className="text-xs font-bold text-gray-500 uppercase">
              {block.type.replace('_', ' ')}
            </span>
            {block.type === 'narrative' && (
              <textarea 
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500" 
                placeholder="AI 輔助敘述生成區塊（可自動生成 GRI 應答）..." 
                disabled={reportStatus === 'sealed'}
              />
            )}
            {block.type === 'data_table' && (
              <div className="p-4 bg-white border border-gray-200 rounded text-sm text-gray-600">
                📊 動態數據表：已即時連結 <b>Vault Omni</b> 的來源數據（不可手動修改）
              </div>
            )}
            {block.type === 'compliance_statement' && (
              <div className="p-4 bg-green-50 border border-green-200 text-green-800 rounded text-sm">
                ✅ 合規聲明：本區塊已通過 <b>Compliance Check</b> 審核，確認對齊 GRI 準則
              </div>
            )}
          </div>
        ))}
        {blocks.length === 0 && (
          <div className="text-center py-8 text-gray-400 border-2 border-dashed rounded-xl">
            點擊下方按鈕，開始從萬能元件庫新增報告區塊
          </div>
        )}
      </div>

      {/* 操作區 */}
      {reportStatus === 'draft' && (
        <div className="flex gap-4">
          <button onClick={() => addBlock('narrative')} className="px-4 py-2 bg-blue-50 text-blue-700 rounded hover:bg-blue-100 transition-colors">
            + 敘述區塊 (Narrative)
          </button>
          <button onClick={() => addBlock('data_table')} className="px-4 py-2 bg-purple-50 text-purple-700 rounded hover:bg-purple-100 transition-colors">
            + 連結數據 (Vault Omni)
          </button>
          <button onClick={() => addBlock('compliance_statement')} className="px-4 py-2 bg-green-50 text-green-700 rounded hover:bg-green-100 transition-colors">
            + 插入合規聲明 (GRI)
          </button>
        </div>
      )}

      {/* 封印動作 */}
      <div className="mt-8 pt-6 border-t flex justify-end">
        {reportStatus === 'draft' ? (
          <button 
            onClick={sealReport} 
            className="px-6 py-2 bg-gray-900 text-white font-semibold rounded shadow hover:bg-gray-800 transition-all active:scale-95"
          >
            啟動 Proof Center 封印
          </button>
        ) : (
          <button disabled className="px-6 py-2 bg-gray-200 text-gray-500 font-semibold rounded cursor-not-allowed">
            報告具備防竄改證明 (Immutable)
          </button>
        )}
      </div>
    </div>
  );
}
