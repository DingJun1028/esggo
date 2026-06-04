'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { Mail, Calendar, HardDrive, CheckCircle2, AlertCircle, ExternalLink, RefreshCw } from 'lucide-react';
import { BrandCard, BrandCardHeader, BrandButton } from '../brand';
import { useSearchParams } from 'next/navigation';
export default function HermesIntegrations() {
    const searchParams = useSearchParams();
    const [status, setStatus] = useState('loading');
    const [errorMessage, setErrorMessage] = useState('');
    const [connectedEmail, setConnectedEmail] = useState(null);
    const [isScanning, setIsScanning] = useState(false);
    const [scanResult, setScanResult] = useState(null);
    const [isSyncingCalendar, setIsSyncingCalendar] = useState(false);
    const [calendarResult, setCalendarResult] = useState(null);
    useEffect(() => {
        const hermesSuccess = searchParams?.get('hermes_success');
        const hermesError = searchParams?.get('hermes_error');
        if (hermesSuccess === 'google_workspace_connected') {
            setStatus('connected');
        }
        else if (hermesError) {
            setStatus('error');
            setErrorMessage(hermesError);
        }
        // Verify status with backend regardless of URL params
        const checkStatus = async () => {
            try {
                const res = await fetch('/api/hermes/google/status');
                const data = await res.json();
                if (data.connected) {
                    setStatus('connected');
                    if (data.email) {
                        setConnectedEmail(data.email);
                    }
                }
                else if (!hermesSuccess && !hermesError) {
                    setStatus('idle');
                }
            }
            catch (err) {
                console.error('Failed to check Hermes status', err);
                if (!hermesSuccess && !hermesError) {
                    setStatus('idle');
                }
            }
        };
        checkStatus();
    }, [searchParams]);
    const handleConnect = () => {
        // Redirect to our backend OAuth initialization endpoint
        window.location.href = '/api/hermes/google/oauth';
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
                    title: 'Hermes 郵件自動掃描',
                    description: '連線 Google Workspace 進行 ESG 信件智能篩選與歸檔。',
                    skillKey: 'hermes_email_archival',
                    actorId: connectedEmail || 'system'
                })
            });
            const data = await res.json();
            if (data.ok && data.artifact) {
                setScanResult(data.artifact);
            }
            else {
                alert('郵件掃描任務失敗：' + (data.error || '未回傳結果'));
            }
        }
        catch (err) {
            console.error(err);
            alert('發生預期外的錯誤。');
        }
        finally {
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
                    title: 'Hermes 行事曆排程同步',
                    description: '連線 Google Calendar 提取近期 ESG 關鍵會議，並建立前置自動化準備作業。',
                    skillKey: 'hermes_calendar_agent',
                    actorId: connectedEmail || 'system'
                })
            });
            const data = await res.json();
            if (data.ok && data.artifact) {
                setCalendarResult(data.artifact);
            }
            else {
                alert('行事曆同步任務失敗：' + (data.error || '未回傳結果'));
            }
        }
        catch (err) {
            console.error(err);
            alert('發生預期外的錯誤。');
        }
        finally {
            setIsSyncingCalendar(false);
        }
    };
    return (_jsx("div", { className: "space-y-6 fade-in", children: _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs(BrandCard, { className: "border-[#003262]/10 shadow-lg", children: [_jsx(BrandCardHeader, { title: "Google Workspace", subtitle: "Hermes Agent \u8FA6\u516C\u5BA4\u81EA\u52D5\u5316\u6574\u5408", icon: _jsx(Mail, { className: "text-[#003262]" }) }), _jsxs("div", { className: "p-6 space-y-6", children: [_jsxs("div", { className: "flex gap-3 text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-100", children: [_jsx("div", { className: "bg-white p-2 rounded-lg shadow-sm", children: _jsx(Mail, { size: 24, className: "text-blue-500" }) }), _jsx("div", { className: "bg-white p-2 rounded-lg shadow-sm", children: _jsx(Calendar, { size: 24, className: "text-green-500" }) }), _jsx("div", { className: "bg-white p-2 rounded-lg shadow-sm", children: _jsx(HardDrive, { size: 24, className: "text-yellow-500" }) })] }), _jsx("p", { className: "text-sm text-slate-500", children: "\u6388\u6B0A Hermes Agent \u8B80\u53D6\u8207\u767C\u9001 Email\u3001\u7BA1\u7406 Google Calendar \u4EE5\u53CA\u5B58\u53D6 Google Drive\u3002 \u9019\u5C07\u4F7F OmniAgent \u80FD\u5920\u70BA\u60A8\u81EA\u52D5\u5B89\u6392\u6703\u8B70\u3001\u6574\u7406\u901A\u8A0A\u9304\u8207\u6B78\u6A94\u9644\u4EF6\u8B49\u64DA\u3002" }), status === 'connected' && (_jsxs("div", { className: "flex flex-col gap-2 p-4 bg-green-50 text-green-800 rounded-xl border border-green-200", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(CheckCircle2, { size: 18, className: "text-green-600" }), _jsx("span", { className: "text-sm font-semibold", children: "\u5DF2\u6210\u529F\u9023\u7D50\u81F3 Google Workspace (Token Auto-Refresh Active)" })] }), connectedEmail && (_jsxs("div", { className: "text-sm font-medium opacity-80 pl-6", children: ["\u6388\u6B0A\u5E33\u865F: ", connectedEmail] })), _jsxs("div", { className: "mt-4 flex flex-col sm:flex-row gap-3", children: [_jsx(BrandButton, { variant: "primary", onClick: runEmailScan, disabled: isScanning || isSyncingCalendar, children: isScanning ? (_jsxs("span", { className: "flex items-center gap-2", children: [_jsx(RefreshCw, { size: 16, className: "animate-spin" }), "\u5206\u6790\u90F5\u4EF6\u4E2D..."] })) : ('啟動郵件自動化掃描') }), _jsx(BrandButton, { variant: "outline", onClick: runCalendarSync, disabled: isScanning || isSyncingCalendar, children: isSyncingCalendar ? (_jsxs("span", { className: "flex items-center gap-2", children: [_jsx(RefreshCw, { size: 16, className: "animate-spin" }), "\u540C\u6B65\u884C\u4E8B\u66C6\u4E2D..."] })) : ('同步 Calendar 排程') })] }), scanResult && (_jsx("div", { className: "mt-4 p-4 bg-white rounded-lg border border-green-100 shadow-sm text-slate-800 text-sm whitespace-pre-wrap", children: scanResult.content })), calendarResult && (_jsx("div", { className: "mt-4 p-4 bg-white rounded-lg border border-blue-100 shadow-sm text-slate-800 text-sm whitespace-pre-wrap", children: calendarResult.content }))] })), status === 'error' && (_jsxs("div", { className: "flex items-center gap-2 p-3 bg-red-50 text-red-700 rounded-lg border border-red-200", children: [_jsx(AlertCircle, { size: 18 }), _jsxs("span", { className: "text-sm font-semibold", children: ["\u6388\u6B0A\u5931\u6557\u6216\u53D6\u6D88\uFF1A", errorMessage === 'missing_config' ? '系統尚未配置 Client ID' : errorMessage] })] })), _jsxs("div", { className: "pt-2 border-t border-slate-100 flex justify-between items-center", children: [_jsxs("div", { className: "text-xs text-slate-400 flex items-center gap-1", children: [_jsx(RefreshCw, { size: 12 }), "OAuth 2.0 (Desktop App Type)"] }), _jsxs(BrandButton, { variant: status === 'connected' ? 'outline' : 'primary', onClick: handleConnect, children: [status === 'connected' ? '重新授權 (Reconnect)' : '連結 Google 帳號 (Connect)', _jsx(ExternalLink, { size: 16, className: "ml-2" })] })] })] })] }), _jsxs(BrandCard, { className: "border-slate-100 bg-slate-50/50 opacity-70", children: [_jsx(BrandCardHeader, { title: "Microsoft 365 (\u5373\u5C07\u63A8\u51FA)", subtitle: "Office \u81EA\u52D5\u5316\u6574\u5408", icon: _jsx("div", { className: "w-5 h-5 bg-blue-600 rounded-sm" }) }), _jsx("div", { className: "p-6", children: _jsx("p", { className: "text-sm text-slate-500", children: "Outlook, Teams, Excel \u6574\u5408\u6B63\u5728\u958B\u767C\u4E2D\u3002\u672A\u4F86\u5C07\u63D0\u4F9B\u8207 Google Workspace \u5C0D\u7B49\u7684\u81EA\u52D5\u5316\u80FD\u529B\u3002" }) })] })] }) }));
}
//# sourceMappingURL=HermesIntegrations.js.map