/**
 * ZKP 驗證 UI 組件
 * --------------------------------------------------
 * [用途] 展示 ZKP 證明和驗證結果
 * [功能] QR Code 顯示、驗證狀態、區塊鏈錨定資訊
 */

import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { CheckCircle, XCircle, Clock, Link as LinkIcon, Download } from 'lucide-react';
import { ZKPProof, ZKPVerificationResult } from '@/omni/services/ZKPIntegrityService';
import { ZKPUtils } from '@/omni/services/ZKPIntegrityService';

interface ZKPVerificationCardProps {
  proof: ZKPProof;
  verificationResult?: ZKPVerificationResult;
  blockchainAnchor?: {
    transactionHash: string;
    blockNumber: number;
  };
}

export const ZKPVerificationCard: React.FC<ZKPVerificationCardProps> = ({
  proof,
  verificationResult,
  blockchainAnchor,
}) => {
  const [showQR, setShowQR] = useState(false);

  const qrData = ZKPUtils.generateVerificationQRData(proof);
  const remainingValidity = ZKPUtils.formatRemainingValidity(proof);

  const getStatusIcon = () => {
    if (!verificationResult) return <Clock className="text-slate-400" size={20} />;
    if (verificationResult.valid) return <CheckCircle className="text-green-500" size={20} />;
    return <XCircle className="text-red-500" size={20} />;
  };

  const getStatusText = () => {
    if (!verificationResult) return '待驗證';
    if (verificationResult.confidenceLevel === 'verified') return '已驗證';
    if (verificationResult.confidenceLevel === 'expired') return '已過期';
    return '驗證失敗';
  };

  const getStatusColor = () => {
    if (!verificationResult) return 'text-slate-400';
    if (verificationResult.valid) return 'text-green-500';
    return 'text-red-500';
  };

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 space-y-4">
      {/* 標題 */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          {getStatusIcon()}
          ZKP 誠信證明
        </h3>
        <span className={`text-sm font-medium ${getStatusColor()}`}>{getStatusText()}</span>
      </div>

      {/* 證明資訊 */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-slate-400">公開輸入</span>
          <span className="text-slate-200 font-mono text-xs">
            {proof.publicInput.substring(0, 16)}...
          </span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-slate-400">隱私級別</span>
          <span className="text-blue-400 capitalize">{proof.privacyLevel}</span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-slate-400">有效期限</span>
          <span className="text-slate-200">{remainingValidity}</span>
        </div>

        {proof.metadata?.dataType && (
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">數據類型</span>
            <span className="text-slate-200">{proof.metadata.dataType}</span>
          </div>
        )}
      </div>

      {/* 驗證訊息 */}
      {verificationResult && (
        <div
          className={`p-3 rounded-lg ${
            verificationResult.valid
              ? 'bg-green-500/10 border border-green-500/20'
              : 'bg-red-500/10 border border-red-500/20'
          }`}
        >
          <p className={`text-sm ${verificationResult.valid ? 'text-green-400' : 'text-red-400'}`}>
            {verificationResult.message}
          </p>
        </div>
      )}

      {/* 區塊鏈錨定資訊 */}
      {blockchainAnchor && (
        <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg space-y-2">
          <div className="flex items-center gap-2 text-blue-400 text-sm font-medium">
            <LinkIcon size={14} />
            已錨定到區塊鏈
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">交易雜湊</span>
              <span className="text-slate-200 font-mono">
                {blockchainAnchor.transactionHash.substring(0, 16)}...
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">區塊高度</span>
              <span className="text-slate-200">#{blockchainAnchor.blockNumber}</span>
            </div>
          </div>
        </div>
      )}

      {/* 操作按鈕 */}
      <div className="flex gap-2 pt-2">
        <button
          onClick={() => setShowQR(!showQR)}
          className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
        >
          {showQR ? '隱藏' : '顯示'} QR Code
        </button>
        <button
          onClick={() => {
            const json = JSON.stringify(proof, null, 2);
            const blob = new Blob([json], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `zkp-proof-${Date.now()}.json`;
            a.click();
          }}
          className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
        >
          <Download size={16} />
          導出
        </button>
      </div>

      {/* QR Code */}
      {showQR && (
        <div className="flex flex-col items-center gap-3 pt-4 border-t border-slate-700">
          <div className="p-4 bg-white rounded-lg">
            <QRCodeSVG value={qrData} size={200} />
          </div>
          <p className="text-xs text-slate-400 text-center">掃描 QR Code 即可驗證證明</p>
        </div>
      )}
    </div>
  );
};
