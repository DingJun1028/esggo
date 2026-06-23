'use client';

import React, { useEffect, useState } from 'react';
import {
  Mail,
  Calendar,
  HardDrive,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  RefreshCw,
} from 'lucide-react';
import { BrandCard, BrandCardHeader, BrandButton } from '../brand';
import { useSearchParams } from 'next/navigation';

export default function OAAgentIntegrations() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'idle' | 'connected' | 'error' | 'loading'>('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const [connectedEmail, setConnectedEmail] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<any>(null);
  const [isSyncingCalendar, setIsSyncingCalendar] = useState(false);
  const [calendarResult, setCalendarResult] = useState<any>(null);
  const [isScanningDrive, setIsScanningDrive] = useState(false);
  const [driveResult, setDriveResult] = useState<any>(null);

  useEffect(() => {
    const omniSuccess = searchParams?.get('oa_success');
    const omniError = searchParams?.get('oa_error');

    if (omniSuccess === 'google_workspace_connected') {
      setStatus('connected');
    } else if (omniError) {
      setStatus('error');
      setErrorMessage(omniError);
    }

    const checkStatus = async () => {
      try {
        const res = await fetch('/api/oa/google/status');
        const data = await res.json();

        if (data.connected) {
          setStatus('connected');
          if (data.email) {
            setConnectedEmail(data.email);
          }
        } else if (!omniSuccess && !omniError) {
          setStatus('idle');
        }
      } catch (err) {
        console.error('Failed to check OmniAgent status', err);
        if (!omniSuccess && !omniError) {
          setStatus('idle');
        }
      }
    };

    checkStatus();
  }, [searchParams]);

  const handleConnect = () => {
    window.location.href = '/api/oa/google/oauth';
  };

  const runEmailScan = async () => {
    setIsScanning(true);
    setScanResult(null);
    try {
      const res = await fetch('/api/agent/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taskType: 'email_processing',
          title: 'OmniAgent 郵件自動掃描',
          description: '連線 Google Workspace 進行 ESG 信件智能篩選與歸檔。',
          skillKey: 'oa_email_archival',
          actorId: connectedEmail || 'system',
        }),
      });
      const data = await res.json();
      if (data.ok && data.artifact) {
        setScanResult(data.artifact);
      } else {
        alert('郵件掃描任務失敗：' + (data.error || '未回傳結果'));
      }
    } catch (err) {
      console.error(err);
      alert('發生預期外的錯誤。');
    } finally {
      setIsScanning(false);
    }
  };

  const runCalendarSync = async () => {
    setIsSyncingCalendar(true);
    setCalendarResult(null);
    try {
      const res = await fetch('/api/agent/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taskType: 'calendar_scheduling',
          title: 'OmniAgent 行事曆排程同步',
          description: '連線 Google Calendar 提取近期 ESG 關鍵會議，並建立前置自動化準備作業。',
          skillKey: 'oa_calendar_agent',
          actorId: connectedEmail || 'system',
        }),
      });
      const data = await res.json();
      if (data.ok && data.artifact) {
        setCalendarResult(data.artifact);
      } else {
        alert('行事曆同步任務失敗：' + (data.error || '未回傳結果'));
      }
    } catch (err) {
      console.error(err);
      alert('發生預期外的錯誤。');
    } finally {
      setIsSyncingCalendar(false);
    }
  };

  const runDriveScan = async () => {
    setIsScanningDrive(true);
    setDriveResult(null);
    try {
      const res = await fetch('/api/agent/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taskType: 'file_processing',
          title: 'OmniAgent 雲端硬碟掃描',
          description: '連線 Google Drive 識別並歸檔 ESG 相關文件至 Evidence Vault。',
          skillKey: 'oa_drive_archival',
          actorId: connectedEmail || 'system',
        }),
      });
      const data = await res.json();
      if (data.ok && data.artifact) {
        setDriveResult(data.artifact);
      } else {
        alert('雲端硬碟掃描任務失敗：' + (data.error || '未回傳結果'));
      }
    } catch (err) {
      console.error(err);
      alert('發生預期外的錯誤。');
    } finally {
      setIsScanningDrive(false);
    }
  };

  return (
    <div className="space-y-6 fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Google Workspace Integration Card */}
        <BrandCard className="border-[#003262]/10 shadow-sm">
          <BrandCardHeader
            title="Google Workspace"
            subtitle="OmniAgent 辦公室自動化整合"
            icon={<Mail className="text-[#003262]" />}
          />
          <div className="p-6 space-y-6">
            <div className="flex gap-3 text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-100">
              <div className="bg-white p-2 rounded-lg shadow-sm">
                <Mail size={24} className="text-blue-500" />
              </div>
              <div className="bg-white p-2 rounded-lg shadow-sm">
                <Calendar size={24} className="text-green-500" />
              </div>
              <div className="bg-white p-2 rounded-lg shadow-sm">
                <HardDrive size={24} className="text-yellow-500" />
              </div>
            </div>

            <p className="text-sm text-slate-500">
              授權 OmniAgent 讀取與發送 Email、管理 Google Calendar 以及存取 Google Drive。 這將使
              OmniAgent 能夠為您自動安排會議、整理通訊錄與歸檔附件證據。
            </p>

            {status === 'connected' && (
              <div className="flex flex-col gap-2 p-4 bg-green-50 text-green-800 rounded-xl border border-green-200">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={18} className="text-green-600" />
                  <span className="text-sm font-semibold">
                    已成功連結至 Google Workspace (Token Auto-Refresh Active)
                  </span>
                </div>
                {connectedEmail && (
                  <div className="text-sm font-medium opacity-80 pl-6">
                    授權帳號: {connectedEmail}
                  </div>
                )}

                <div className="mt-4 flex flex-col sm:flex-row gap-3">
                  <BrandButton
                    variant="primary"
                    onClick={runEmailScan}
                    disabled={isScanning || isSyncingCalendar || isScanningDrive}
                  >
                    {isScanning ? (
                      <span className="flex items-center gap-2">
                        <RefreshCw size={16} className="animate-spin" />
                        分析郵件中...
                      </span>
                    ) : (
                      '啟動郵件自動化掃描'
                    )}
                  </BrandButton>

                  <BrandButton
                    variant="outline"
                    onClick={runCalendarSync}
                    disabled={isScanning || isSyncingCalendar || isScanningDrive}
                  >
                    {isSyncingCalendar ? (
                      <span className="flex items-center gap-2">
                        <RefreshCw size={16} className="animate-spin" />
                        同步行事曆中...
                      </span>
                    ) : (
                      '同步 Calendar 排程'
                    )}
                  </BrandButton>

                  <BrandButton
                    variant="outline"
                    onClick={runDriveScan}
                    disabled={isScanning || isSyncingCalendar || isScanningDrive}
                  >
                    {isScanningDrive ? (
                      <span className="flex items-center gap-2">
                        <RefreshCw size={16} className="animate-spin" />
                        掃描雲端硬碟中...
                      </span>
                    ) : (
                      '掃描雲端硬碟'
                    )}
                  </BrandButton>
                </div>

                {scanResult && (
                  <div className="mt-4 p-4 bg-white rounded-lg border border-green-100 shadow-sm text-slate-800 text-sm whitespace-pre-wrap">
                    {scanResult.content}
                  </div>
                )}

                {calendarResult && (
                  <div className="mt-4 p-4 bg-white rounded-lg border border-blue-100 shadow-sm text-slate-800 text-sm whitespace-pre-wrap">
                    {calendarResult.content}
                  </div>
                )}

                {driveResult && (
                  <div className="mt-4 p-4 bg-white rounded-lg border border-yellow-100 shadow-sm text-slate-800 text-sm whitespace-pre-wrap">
                    {driveResult.content}
                  </div>
                )}
              </div>
            )}

            {status === 'error' && (
              <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 rounded-lg border border-red-200">
                <AlertCircle size={18} />
                <span className="text-sm font-semibold">
                  授權失敗或取消：
                  {errorMessage === 'missing_config' ? '系統尚未配置 Client ID' : errorMessage}
                </span>
              </div>
            )}

            <div className="pt-2 border-t border-slate-100 flex justify-between items-center">
              <div className="text-xs text-slate-400 flex items-center gap-1">
                <RefreshCw size={12} />
                OAuth 2.0 (Desktop App Type)
              </div>
              <BrandButton
                variant={status === 'connected' ? 'outline' : 'primary'}
                onClick={handleConnect}
              >
                {status === 'connected' ? '重新授權 (Reconnect)' : '連結 Google 帳號 (Connect)'}
                <ExternalLink size={16} className="ml-2" />
              </BrandButton>
            </div>
          </div>
        </BrandCard>

        {/* Other Integrations Placeholder */}
        <BrandCard className="border-slate-100 bg-slate-50/50 opacity-70">
          <BrandCardHeader
            title="Microsoft 365 (即將推出)"
            subtitle="Office 自動化整合"
            icon={<div className="w-5 h-5 bg-blue-600 rounded-sm" />}
          />
          <div className="p-6">
            <p className="text-sm text-slate-500">
              Outlook, Teams, Excel 整化正在開發中。未來將提供與 Google Workspace 對等的自動化能力。
            </p>
          </div>
        </BrandCard>
      </div>
    </div>
  );
}
