import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/v2/Modal';
import { Button } from '@/components/ui/v2/Button';
import { Input, Badge } from '@/components/ui/v2/Input';
import { Progress } from '@/components/ui/v2/Progress';
import {
  UploadCloud,
  FileSearch,
  ShieldCheck,
  AlertTriangle,
  PenLine,
  Database,
  RefreshCw,
  FileCheck,
  Search,
  CheckCircle2,
  EyeOff,
} from 'lucide-react';

interface DocumentStagingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLock: (docId: string, source: string) => void;
  docId: string;
  docName: string;
}

type TabType = 'upload' | 'manual' | 'erp';
type ScanStatus = 'idle' | 'scanning' | 'scanned' | 'verifying' | 'failed' | 'success';

export function DocumentStagingModal({
  isOpen,
  onClose,
  onLock,
  docId,
  docName,
}: DocumentStagingModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>('upload');
  const [status, setStatus] = useState<ScanStatus>('idle');
  const [confidence, setConfidence] = useState<number>(0);
  const [remark, setRemark] = useState('');
  const [manualData, setManualData] = useState('');
  const [verifyStep, setVerifyStep] = useState(0);

  // ZKP 敏感資料遮蔽
  interface SensitiveField {
    id: string;
    label: string;
    type: string;
    masked: boolean;
  }

  const [sensitiveFields, setSensitiveFields] = useState<SensitiveField[]>([
    { id: 'f1', label: '負責人身份證字號', type: 'PII', masked: true },
    { id: 'f2', label: '詳細薪資給付額', type: 'Financial', masked: true },
    { id: 'f3', label: '客戶合約詳細金額', type: 'Commercial', masked: false },
  ]);

  const toggleMask = (id: string) => {
    setSensitiveFields((prev: SensitiveField[]) =>
      prev.map((field: SensitiveField) => (field.id === id ? { ...field, masked: !field.masked } : field))
    );
  };

  // 每次打開 Modal 重置狀態
  useEffect(() => {
    if (isOpen) {
      setStatus('idle');
      setConfidence(0);
      setRemark('');
      setManualData('');
      setActiveTab('upload');
      setVerifyStep(0);
    }
  }, [isOpen]);

  const handleSimulateUpload = () => {
    setStatus('scanning');
    setConfidence(0);
    // 模擬 OCR 掃描過程
    let current = 0;
    const interval = setInterval(() => {
      current += Math.random() * 20;
      if (current >= 100) {
        clearInterval(interval);
        // 隨機產生信心指數 (70% 機率高於 85%，30% 機率低於 60%)
        const isHighConfidence = Math.random() > 0.3;
        const finalConfidence = isHighConfidence
          ? Math.floor(Math.random() * 15 + 85) // 85-99
          : Math.floor(Math.random() * 30 + 30); // 30-59

        setConfidence(finalConfidence);
        setStatus('scanned');
      } else {
        setConfidence(current);
      }
    }, 200);
  };

  const handleVerifyAndLock = () => {
    setStatus('verifying');
    setVerifyStep(0);
    
    // 模擬 5T 協議檢驗流程 (每個步驟 400ms)
    let step = 0;
    const interval = setInterval(() => {
      step++;
      setVerifyStep(step);
      if (step >= 5) {
        clearInterval(interval);
        setTimeout(() => {
          if (activeTab === 'upload' && confidence < 60) {
            setStatus('failed'); // 檢驗不通過
          } else {
            setStatus('success');
            setTimeout(() => {
              onLock(docId, getSourceLabel());
            }, 1500); // 延長一點讓使用者看到成功畫面與 Hash
          }
        }, 500);
      }
    }, 400);
  };

  const getSourceLabel = () => {
    if (activeTab === 'manual') return '系統填寫';
    if (activeTab === 'erp') return 'ERP 系統拋轉';
    return '單據上傳';
  };

  return (
    <Modal 
      open={isOpen} 
      onClose={status === 'verifying' ? () => {} : onClose} 
      size="lg"
      title="證據停留區 (Staging Area)"
      subtitle={`目標單據：[${docId}] ${docName}`}
      icon={<Database className="text-cyan-600" size={24} />}
    >
      <div className="p-2">
        {/* 來源切換 Tabs */}
        <div className="flex gap-2 mb-6 bg-neutral-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('upload')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
              activeTab === 'upload'
                ? 'bg-white text-neutral-900 shadow-sm'
                : 'text-neutral-500 hover:text-neutral-700'
            }`}
          >
            <UploadCloud size={16} /> 上傳佐證
          </button>
          <button
            onClick={() => setActiveTab('manual')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
              activeTab === 'manual'
                ? 'bg-white text-neutral-900 shadow-sm'
                : 'text-neutral-500 hover:text-neutral-700'
            }`}
          >
            <PenLine size={16} /> 系統填寫
          </button>
          <button
            onClick={() => setActiveTab('erp')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
              activeTab === 'erp'
                ? 'bg-white text-neutral-900 shadow-sm'
                : 'text-neutral-500 hover:text-neutral-700'
            }`}
          >
            <RefreshCw size={16} /> 系統拋轉 (API)
          </button>
        </div>

        {/* ================= 上傳單據流程 ================= */}
        {activeTab === 'upload' && (
          <div className="space-y-6">
            {status === 'idle' && (
              <div
                className="border-2 border-dashed border-neutral-300 rounded-xl p-10 flex flex-col items-center justify-center bg-neutral-50 hover:bg-neutral-100 transition-colors cursor-pointer"
                onClick={handleSimulateUpload}
              >
                <UploadCloud size={40} className="text-neutral-400 mb-3" />
                <p className="text-neutral-600 font-medium">點擊或拖曳檔案至此</p>
                <p className="text-neutral-400 text-xs mt-1">支援 PDF, JPG, PNG (上限 10MB)</p>
              </div>
            )}

            {status === 'scanning' && (
              <div className="bg-cyan-50 border border-cyan-100 rounded-xl p-6 text-center space-y-4">
                <FileSearch size={32} className="text-cyan-500 mx-auto animate-pulse" />
                <div>
                  <p className="font-bold text-cyan-800">OmniOCR 智能掃描中...</p>
                  <p className="text-xs text-cyan-600">正在萃取文本特徵並比對必要性</p>
                </div>
                <Progress value={Math.min(confidence, 100)} size="md" color="auto" />
              </div>
            )}

            {(status === 'scanned' || status === 'verifying' || status === 'failed' || status === 'success') && (
              <div className="space-y-4">
                <div
                  className={`border rounded-xl p-4 flex items-start gap-4 ${
                    confidence >= 60 ? 'bg-emerald-50 border-emerald-200' : 'bg-rose-50 border-rose-200'
                  }`}
                >
                  {confidence >= 60 ? (
                    <FileCheck size={28} className="text-emerald-500 mt-1" />
                  ) : (
                    <AlertTriangle size={28} className="text-rose-500 mt-1" />
                  )}
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <p
                        className={`font-bold ${
                          confidence >= 60 ? 'text-emerald-800' : 'text-rose-800'
                        }`}
                      >
                        已識別檔案：evidence_doc_v1.pdf
                      </p>
                      <Badge variant={confidence >= 60 ? 'success' : 'error'}>
                        精準度 {Math.floor(confidence)}%
                      </Badge>
                    </div>
                    {confidence >= 60 ? (
                      <p className="text-sm text-emerald-600">
                        內容與目標單據「{docName}」高度吻合，可進行入庫。
                      </p>
                    ) : (
                      <p className="text-sm text-rose-600">
                        警告：此單據內容似乎無關。若強行送出將會在智能檢驗被退回。
                      </p>
                    )}
                  </div>
                </div>

                {/* ZKP 敏感資料遮蔽區塊 */}
                {confidence >= 60 && status === 'scanned' && (
                  <div className="border border-neutral-200 rounded-xl p-4 bg-white">
                    <div className="flex items-center gap-2 mb-3">
                      <EyeOff size={18} className="text-indigo-500" />
                      <h4 className="font-bold text-neutral-900 text-sm">
                        [ZKP] 敏感資料遮蔽設定 (Data Redaction)
                      </h4>
                    </div>
                    <p className="text-xs text-neutral-500 mb-3">
                      OmniOCR 已自動識別出以下潛在高敏感欄位。選擇「遮蔽」後，系統將採用零知識證明技術，僅保留數據有效性的數學證明，不對外公開明文，以保護企業機密。
                    </p>
                    <div className="space-y-2">
                      {sensitiveFields.map((field: SensitiveField) => (
                        <div
                          key={field.id}
                          className="flex items-center justify-between p-2 rounded-lg border border-neutral-100 bg-neutral-50 hover:bg-neutral-100 transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" size="sm" className="text-[10px]">
                              {field.type}
                            </Badge>
                            <span className="text-sm font-medium text-neutral-700">
                              {field.label}
                            </span>
                          </div>
                          <button
                            onClick={() => toggleMask(field.id)}
                            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                              field.masked ? 'bg-indigo-500' : 'bg-neutral-300'
                            }`}
                          >
                            <span
                              className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                                field.masked ? 'translate-x-5' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    補充備註 (選填)
                  </label>
                  <Input
                    placeholder="請輸入任何需要審計人員注意的事項..."
                    value={remark}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRemark(e.target.value)}
                    disabled={status === 'verifying' || status === 'success'}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================= 系統填寫流程 ================= */}
        {activeTab === 'manual' && (
          <div className="space-y-4">
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
              <PenLine size={24} className="text-amber-500 flex-shrink-0" />
              <div>
                <p className="text-amber-800 font-medium">手動表單填寫</p>
                <p className="text-amber-600 text-sm">
                  此模式將標記來源為「系統填寫」，具備完整的欄位修改軌跡。
                </p>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                輸入核心數據/內文
              </label>
              <textarea
                className="w-full h-32 p-3 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none"
                placeholder={`請輸入關於「${docName}」的詳細內容...`}
                value={manualData}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setManualData(e.target.value)}
              />
            </div>
          </div>
        )}

        {/* ================= ERP 拋轉流程 ================= */}
        {activeTab === 'erp' && (
          <div className="space-y-4">
            <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 flex gap-3">
              <RefreshCw size={24} className="text-indigo-500 flex-shrink-0" />
              <div>
                <p className="text-indigo-800 font-medium">系統 API 拋轉</p>
                <p className="text-indigo-600 text-sm">
                  已偵測到可對接的外部系統。選擇此選項將直接由 ERP/HR 系統提取數據並自動 Hash 封印。
                </p>
              </div>
            </div>
            <div className="border border-neutral-200 rounded-lg p-4 bg-white">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-neutral-500">來源系統</span>
                <span className="text-sm font-bold text-neutral-900">SAP S/4HANA</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-500">同步狀態</span>
                <Badge variant="success" size="sm">連線正常 (15ms)</Badge>
              </div>
            </div>
          </div>
        )}

        {/* ================= 狀態展示與操作 ================= */}
        {status === 'verifying' && (
          <div className="mt-6 border border-neutral-200 rounded-xl p-6 bg-white space-y-4 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-neutral-900 flex items-center gap-2">
                <ShieldCheck className="text-cyan-600" size={20} />
                [ZKP] 5T 協議智能封印程序
              </h3>
              <Badge variant="outline" size="sm" className="bg-neutral-50 text-neutral-500">
                Zero-Knowledge Proof
              </Badge>
            </div>
            
            <div className="space-y-3">
              {[
                { key: 1, name: 'Tangible (感知)', desc: '資料結構與視覺感知對齊' },
                { key: 2, name: 'Traceable (溯源)', desc: `標記原始來源：${getSourceLabel()}` },
                { key: 3, name: 'Trackable (追蹤)', desc: '寫入時間戳記與操作者軌跡' },
                { key: 4, name: 'Transparent (驗算)', desc: '關聯 ESG 框架指標公式' },
                { key: 5, name: 'Trustworthy (信)', desc: '產生 ZKP Hash Lock 準備封印' }
              ].map(item => (
                <div key={item.key} className={`flex items-center gap-3 text-sm transition-all ${verifyStep >= item.key ? 'text-neutral-900' : 'text-neutral-400 opacity-50'}`}>
                  {verifyStep >= item.key ? (
                    <CheckCircle2 size={16} className="text-emerald-500" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border-2 border-neutral-200" />
                  )}
                  <span className="font-medium w-36">{item.name}</span>
                  <span className="text-neutral-500 text-xs truncate">{item.desc}</span>
                  {verifyStep === item.key && <Search className="animate-spin text-cyan-500 ml-auto flex-shrink-0" size={14} />}
                </div>
              ))}
            </div>
          </div>
        )}

        {status === 'failed' && (
          <div className="mt-6 bg-rose-50 border border-rose-200 p-4 rounded-lg flex gap-3 text-rose-700">
            <AlertTriangle size={24} className="flex-shrink-0" />
            <div>
              <p className="font-bold">智能檢驗未通過：單據已退回</p>
              <p className="text-sm mt-1">
                系統拒絕封印。原因：OCR 識別內容必要性過低 ({Math.floor(confidence)}%)。請重新上傳正確文件。
              </p>
              <Button
                variant="secondary"
                size="sm"
                className="mt-3"
                onClick={() => setStatus('idle')}
              >
                重新上傳
              </Button>
            </div>
          </div>
        )}

        {status === 'success' && (
          <div className="mt-6 bg-emerald-50 border border-emerald-200 p-6 rounded-xl flex flex-col items-center justify-center gap-2 text-center shadow-sm">
            <ShieldCheck size={32} className="text-emerald-600 mb-2" />
            <span className="font-bold text-lg text-emerald-800">5T 檢驗通過！已完成 [ZKP] 封印存入金庫。</span>
            <div className="bg-white px-3 py-2 rounded border border-emerald-100 text-xs font-mono text-neutral-500 truncate w-full max-w-sm mt-2">
              Hash: 0x{Math.random().toString(16).slice(2, 10)}b8f9e...{Math.random().toString(16).slice(2, 10)}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="mt-8 flex justify-end gap-3 pt-4 border-t border-neutral-100">
          <Button variant="ghost" onClick={onClose} disabled={status === 'verifying' || status === 'success'}>
            取消
          </Button>
          {(activeTab !== 'upload' || status === 'scanned' || status === 'failed') && status !== 'success' && (
            <Button
              variant="primary"
              onClick={handleVerifyAndLock}
              disabled={
                status === 'verifying' ||
                (activeTab === 'upload' && status === 'idle') ||
                (activeTab === 'manual' && manualData.length === 0)
              }
              icon={<ShieldCheck size={16} />}
            >
              送往金庫檢驗與封印
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};
