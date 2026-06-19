import React, { useState } from 'react';
import { Language } from '@/types';

// 定義從後端回傳的數據結構
interface OcrResult {
  rawText: string;
  kwh: number | null;
  billAmount: number | null;
  supplier: string;
}

interface OcrUploaderProps {
  language: Language;
}

export const OcrUploader: React.FC<OcrUploaderProps> = ({ language }) => {
  const isZh = language === 'zh-TW';
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [ocrResult, setOcrResult] = useState<OcrResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
      // 清除舊的結果
      setError(null);
      setOcrResult(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError(isZh ? '請先選擇一個 PDF 或圖片檔案' : 'Please select a PDF or image file first');
      return;
    }

    setIsLoading(true);
    setError(null);
    setOcrResult(null);

    const formData = new FormData();
    formData.append('document', selectedFile);

    try {
      // Use Vite's environment variable to construct the full API URL
      const apiUrl = `${import.meta.env.VITE_API_BASE_URL || ''}/api/upload-and-extract`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(
          isZh
            ? `伺服器錯誤: ${response.status} ${response.statusText}`
            : `Server Error: ${response.status} ${response.statusText}`
        );
      }

      const result = await response.json();
      if (result.success) {
        setOcrResult(result.data);
      } else {
        throw new Error(result.error || (isZh ? '後端辨識失敗' : 'Backend identification failed'));
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        border: '1px solid rgba(255,255,255,0.1)',
        padding: '24px',
        borderRadius: '16px',
        maxWidth: '600px',
        margin: '20px auto',
        background: 'rgba(255,255,255,0.05)',
        backdropFilter: 'blur(10px)',
        color: '#fff',
      }}
    >
      <h3 style={{ marginTop: 0 }}>
        {isZh ? '永續數據上傳與辨識' : 'Sustainability Data Upload & OCR'}
      </h3>
      <p style={{ opacity: 0.7 }}>
        {isZh
          ? '請上傳您的電費單、水費單等 PDF 或圖片檔案。'
          : 'Please upload your electricity bill, water bill, etc. (PDF or image).'}
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <input
          type="file"
          accept=".pdf,.png,.jpg,.jpeg,.tiff"
          onChange={handleFileChange}
          style={{
            padding: '10px',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '8px',
          }}
        />
        <button
          onClick={handleUpload}
          disabled={isLoading || !selectedFile}
          style={{
            padding: '12px',
            background: '#3490dc',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            cursor: isLoading || !selectedFile ? 'not-allowed' : 'pointer',
            fontWeight: 'bold',
          }}
        >
          {isLoading
            ? isZh
              ? '正在辨識中...'
              : 'Identifying...'
            : isZh
              ? '上傳並辨識'
              : 'Upload & Identify'}
        </button>
      </div>

      {error && (
        <p style={{ color: '#ff6b6b', marginTop: '16px' }}>
          {isZh ? '錯誤' : 'Error'}: {error}
        </p>
      )}

      {ocrResult && (
        <div
          style={{
            marginTop: '24px',
            padding: '16px',
            borderTop: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          <h4 style={{ color: '#4dc0ff' }}>{isZh ? '辨識結果' : 'Recognition Result'}：</h4>
          <div style={{ display: 'grid', gap: '12px', marginTop: '12px' }}>
            <p>
              <strong>{isZh ? '供應商' : 'Supplier'}:</strong>{' '}
              {ocrResult.supplier ?? (isZh ? '未能辨識' : 'Not identified')}
            </p>
            <p>
              <strong>{isZh ? '用電度數' : 'Consumption'} (kWh):</strong>{' '}
              {ocrResult.kwh ?? (isZh ? '未能辨識' : 'Not identified')}
            </p>
            <p>
              <strong>{isZh ? '帳單金額' : 'Bill Amount'}:</strong>{' '}
              {ocrResult.billAmount ?? (isZh ? '未能辨識' : 'Not identified')}
            </p>
          </div>

          <details style={{ marginTop: '16px' }}>
            <summary style={{ cursor: 'pointer', opacity: 0.6 }}>
              {isZh ? '顯示原始辨識文字' : 'Show RAW Identification Text'}
            </summary>
            <pre
              style={{
                whiteSpace: 'pre-wrap',
                backgroundColor: 'rgba(0,0,0,0.3)',
                padding: '12px',
                borderRadius: '8px',
                maxHeight: '200px',
                overflowY: 'auto',
                fontSize: '12px',
                marginTop: '8px',
                border: '1px solid rgba(255,255,255,0.1)',
              }}
            >
              {ocrResult.rawText}
            </pre>
          </details>
        </div>
      )}
    </div>
  );
};
