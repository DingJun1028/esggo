'use client';

import React, { useState, useMemo } from 'react';
import {
  GlassContainer,
  GlassCard,
  GlassButton,
  GlassInput,
  GlassModal,
} from '../../ui/GlassComponents';
import { IntegrityPassport, VerificationStatus } from '../../../types/services-part3';

interface IntegrityPassportUIProps {
  data?: IntegrityPassport;
  language?: 'zh-TW' | 'en';
  theme?: 'light' | 'dark';
}

export const IntegrityPassportUI: React.FC<IntegrityPassportUIProps> = ({
  data,
  language = 'zh-TW',
  theme = 'light',
}) => {
  const [selectedCredential, setSelectedCredential] = useState<string | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const isZh = language === 'zh-TW';

  const texts = {
    title: isZh ? '誠信護照' : 'Integrity Passport',
    subtitle: isZh
      ? '區塊鏈驗證的個人誠信數字身份'
      : 'Blockchain-verified Personal Integrity Digital Identity',
    passportId: isZh ? '護照編號' : 'Passport ID',
    holder: isZh ? '持有人' : 'Holder',
    organization: isZh ? '組織' : 'Organization',
    issuedAt: isZh ? '發行日期' : 'Issued At',
    expiresAt: isZh ? '到期日期' : 'Expires At',
    verificationStatus: isZh ? '驗證狀態' : 'Verification Status',
    credentials: isZh ? '認證憑證' : 'Credentials',
    sharePassport: isZh ? '分享護照' : 'Share Passport',
    viewDetails: isZh ? '查看詳情' : 'View Details',
    verifyNow: isZh ? '立即驗證' : 'Verify Now',
    auditTrail: isZh ? '審計軌跡' : 'Audit Trail',
    totalCredentials: isZh ? '總認證數' : 'Total Credentials',
    verifiedCredentials: isZh ? '已驗證' : 'Verified',
    passportScore: isZh ? '護照分數' : 'Passport Score',
    nextVerification: isZh ? '下次驗證' : 'Next Verification',
    searchCredentials: isZh ? '搜尋認證...' : 'Search credentials...',
    blockchainAddress: isZh ? '區塊鏈地址' : 'Blockchain Address',
    digitalSignature: isZh ? '數位簽名' : 'Digital Signature',
    lastVerified: isZh ? '最後驗證' : 'Last Verified',
    viewOnBlockchain: isZh ? '查看區塊鏈' : 'View on Blockchain',
    downloadCertificate: isZh ? '下載證書' : 'Download Certificate',
    shareSettings: isZh ? '分享設定' : 'Share Settings',
    publicProfile: isZh ? '公開資料' : 'Public Profile',
    shareCredentialsInfo: isZh ? '分享認證資訊' : 'Share Credentials',
    shareVerificationInfo: isZh ? '分享驗證狀態' : 'Share Verification Status',
    verified: isZh ? '已驗證' : 'Verified',
    pending: isZh ? '待驗證' : 'Pending',
    expired: isZh ? '已過期' : 'Expired',
    suspended: isZh ? '已暫停' : 'Suspended',
    version: isZh ? '版本' : 'Version',
  };

  const filteredCredentials = useMemo(() => {
    if (!data?.credentials) return [];

    return data.credentials.filter(
      credential =>
        credential.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        credential.issuer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        credential.type.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [data?.credentials, searchQuery]);

  const statusColor = (status: string) => {
    switch (status) {
      case 'verified':
        return 'text-green-500';
      case 'pending':
        return 'text-yellow-500';
      case 'expired':
        return 'text-red-500';
      case 'suspended':
        return 'text-orange-500';
      default:
        return 'text-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'verified':
        return texts.verified;
      case 'pending':
        return texts.pending;
      case 'expired':
        return texts.expired;
      case 'suspended':
        return texts.suspended;
      default:
        return status;
    }
  };

  const getCredentialTypeIcon = (type: string) => {
    switch (type) {
      case 'certification':
        return '🏆';
      case 'achievement':
        return '🎯';
      case 'verification':
        return '✅';
      case 'endorsement':
        return '👍';
      default:
        return '📜';
    }
  };

  return (
    <GlassContainer theme={theme} className="p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{texts.title}</h1>
          <p className="text-gray-600 dark:text-gray-300">{texts.subtitle}</p>
        </div>

        {/* Passport Overview */}
        {data?.passportData && (
          <GlassCard theme={theme} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="text-sm text-gray-500 dark:text-gray-400">
                  {texts.passportId}
                </label>
                <div className="font-semibold text-gray-900 dark:text-white">
                  {data.passportData.passportId}
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-500 dark:text-gray-400">{texts.holder}</label>
                <div className="font-semibold text-gray-900 dark:text-white">
                  {data.passportData.holder}
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-500 dark:text-gray-400">
                  {texts.organization}
                </label>
                <div className="font-semibold text-gray-900 dark:text-white">
                  {data.passportData.organization}
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-500 dark:text-gray-400">
                  {texts.verificationStatus}
                </label>
                <div
                  className={`font-semibold ${statusColor(data.verificationStatus.overallStatus)}`}
                >
                  {getStatusText(data.verificationStatus.overallStatus)}
                </div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-gray-500 dark:text-gray-400">{texts.issuedAt}:</span>
                <span className="ml-2 text-gray-900 dark:text-white">
                  {new Date(data.passportData.issuedAt).toLocaleDateString()}
                </span>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400">{texts.expiresAt}:</span>
                <span className="ml-2 text-gray-900 dark:text-white">
                  {new Date(data.passportData.expiresAt).toLocaleDateString()}
                </span>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400">{texts.version}:</span>
                <span className="ml-2 text-gray-900 dark:text-white">
                  {data.passportData.version}
                </span>
              </div>
            </div>
          </GlassCard>
        )}

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <GlassCard theme={theme} className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {data?.credentials?.length || 0}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">{texts.totalCredentials}</div>
          </GlassCard>

          <GlassCard theme={theme} className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {data?.credentials?.filter(c => c.blockchainVerified).length || 0}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              {texts.verifiedCredentials}
            </div>
          </GlassCard>

          <GlassCard theme={theme} className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {data?.verificationStatus?.score || 0}%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">{texts.passportScore}</div>
          </GlassCard>

          <GlassCard theme={theme} className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {data?.verificationStatus?.nextVerificationDue
                ? new Date(data.verificationStatus.nextVerificationDue).toLocaleDateString()
                : '--'}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">{texts.nextVerification}</div>
          </GlassCard>
        </div>

        {/* Controls */}
        <GlassCard theme={theme} className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <GlassInput
                type="text"
                placeholder={texts.searchCredentials}
                value={searchQuery}
                onChange={(e: any) => setSearchQuery(e.target.value)}
                theme={theme}
              />
            </div>
            <div className="flex gap-2">
              <GlassButton
                onClick={() => setShowShareModal(true)}
                theme={theme}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {texts.sharePassport}
              </GlassButton>
            </div>
          </div>
        </GlassCard>

        {/* Credentials List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredCredentials.map(credential => (
            <GlassCard key={credential.id} theme={theme} className="p-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="text-2xl">{getCredentialTypeIcon(credential.type)}</div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {credential.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{credential.issuer}</p>
                  </div>
                  <div className="text-right">
                    {credential.blockchainVerified && (
                      <div className="text-xs text-green-500 font-medium">
                        ✅ {isZh ? '區塊鏈驗證' : 'Blockchain Verified'}
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">
                      {isZh ? '類型' : 'Type'}:
                    </span>
                    <div className="text-gray-900 dark:text-white capitalize">
                      {credential.type}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">{texts.issuedAt}:</span>
                    <div className="text-gray-900 dark:text-white">
                      {new Date(credential.issuedAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <GlassButton
                    onClick={() => setSelectedCredential(credential.id)}
                    theme={theme}
                    className="flex-1"
                  >
                    {texts.viewDetails}
                  </GlassButton>
                  <GlassButton
                    onClick={() => console.log(`Verifying credential: ${credential.id}`)}
                    theme={theme}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    {texts.verifyNow}
                  </GlassButton>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>

        {/* Blockchain Info */}
        {data?.passportData && (
          <GlassCard theme={theme} className="p-4">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
              📋 {isZh ? '區塊鏈資訊' : 'Blockchain Information'}
            </h3>
            <div className="space-y-2 text-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-gray-500 dark:text-gray-400">
                    {texts.blockchainAddress}:
                  </span>
                  <div className="font-mono text-xs text-blue-600 dark:text-blue-400 break-all mt-1">
                    {data.passportData.blockchainAddress}
                  </div>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">
                    {texts.digitalSignature}:
                  </span>
                  <div className="font-mono text-xs text-gray-600 dark:text-gray-400 break-all mt-1">
                    {data.passportData.digitalSignature.substring(0, 30)}...
                  </div>
                </div>
              </div>
              <div className="flex gap-2 mt-3">
                <GlassButton
                  onClick={() => console.log('Viewing on blockchain...')}
                  theme={theme}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  {texts.viewOnBlockchain}
                </GlassButton>
                <GlassButton
                  onClick={() => console.log('Downloading certificate...')}
                  theme={theme}
                >
                  {texts.downloadCertificate}
                </GlassButton>
              </div>
            </div>
          </GlassCard>
        )}

        {/* Share Modal */}
        {showShareModal && (
          <GlassModal
            isOpen={showShareModal}
            onClose={() => setShowShareModal(false)}
            theme={theme}
          >
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                {texts.shareSettings}
              </h2>
              {data?.sharingSettings && (
                <div className="space-y-4">
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={data.sharingSettings.publicProfile}
                      className="rounded"
                      readOnly
                    />
                    <span className="text-gray-900 dark:text-white">{texts.publicProfile}</span>
                  </label>
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={data.sharingSettings.shareCredentials}
                      className="rounded"
                      readOnly
                    />
                    <span className="text-gray-900 dark:text-white">
                      {texts.shareCredentialsInfo}
                    </span>
                  </label>
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={data.sharingSettings.shareVerificationStatus}
                      className="rounded"
                      readOnly
                    />
                    <span className="text-gray-900 dark:text-white">
                      {texts.shareVerificationInfo}
                    </span>
                  </label>
                  <div className="flex gap-2 mt-4">
                    <GlassButton
                      onClick={() => setShowShareModal(false)}
                      theme={theme}
                      className="flex-1"
                    >
                      {isZh ? '取消' : 'Cancel'}
                    </GlassButton>
                    <GlassButton
                      onClick={() => {
                        console.log('Sharing passport...');
                        setShowShareModal(false);
                      }}
                      theme={theme}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      {isZh ? '分享' : 'Share'}
                    </GlassButton>
                  </div>
                </div>
              )}
            </div>
          </GlassModal>
        )}
      </div>
    </GlassContainer>
  );
};
