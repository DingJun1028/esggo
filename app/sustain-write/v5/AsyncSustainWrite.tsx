/**
 * app/sustain-write/v5/AsyncSustainWrite.tsx — 異步報告生成組件
 *
 * 處理非同步報告任務的啟動、進度追蹤和結果顯示。
 */

'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Loader2, CheckCircle2, XCircle, Clock } from 'lucide-react';
import type { TaskProgress, Company, CustomCompanyForm } from './types';
import { GATE_COLORS, GATE_LABELS, CUSTOM_COMPANY_ID } from './types';
import { startAsyncReport, pollTaskProgress, cancelTask } from './api';

interface AsyncSustainWriteProps {
  company: Company | null;
  templateId: string;
  selectedNotes: string[];
  customCompany: CustomCompanyForm | null;
  onComplete: (progress: TaskProgress) => void;
  onError: (error: string) => void;
}

export function AsyncSustainWrite({
  company,
  templateId,
  selectedNotes,
  customCompany,
  onComplete,
  onError,
}: AsyncSustainWriteProps) {
  const [progress, setProgress] = useState<TaskProgress | null>(null);
  const [isPolling, setIsPolling] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pollRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      if (pollRef.current) {
        clearInterval(pollRef.current);
      }
    };
  }, []);

  const startTask = useCallback(async () => {
    if (!company) {
      setError('請先選擇公司');
      return;
    }

    setError(null);
    setIsPolling(true);

    try {
      const companyId = customCompany ? CUSTOM_COMPANY_ID : company.id;
      const { taskId } = await startAsyncReport(
        companyId,
        templateId,
        selectedNotes.length > 0 ? selectedNotes : undefined,
        customCompany || undefined
      );

      // Start polling
      pollRef.current = setInterval(async () => {
        try {
          const p = await pollTaskProgress(taskId);
          setProgress(p);

          if (p.status === 'completed' || p.status === 'failed') {
            if (pollRef.current) {
              clearInterval(pollRef.current);
              pollRef.current = null;
            }
            setIsPolling(false);

            if (p.status === 'completed') {
              onComplete(p);
            } else {
              onError('報告生成失敗');
            }
          }
        } catch (err) {
          console.error('Poll error:', err);
        }
      }, 2000);

      // Initial poll
      const initialProgress = await pollTaskProgress(taskId);
      setProgress(initialProgress);
    } catch (err) {
      setError(err instanceof Error ? err.message : '啟動任務失敗');
      setIsPolling(false);
    }
  }, [company, templateId, selectedNotes, customCompany, onComplete, onError]);

  const handleCancel = useCallback(async () => {
    if (progress?.taskId) {
      await cancelTask(progress.taskId);
      if (pollRef.current) {
        clearInterval(pollRef.current);
        pollRef.current = null;
      }
      setIsPolling(false);
      setProgress(null);
    }
  }, [progress]);

  const statusIcon = () => {
    if (error) return <XCircle className="text-red-500" size={20} />;
    if (progress?.status === 'completed') return <CheckCircle2 className="text-green-500" size={20} />;
    if (isPolling) return <Loader2 className="animate-spin text-accentTeal" size={20} />;
    return <Clock className="text-textSecondary" size={20} />;
  };

  return (
    <div className="border border-borderColor rounded-xl p-6 bg-secondary">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-lg flex items-center gap-2">
          {statusIcon()}
          異步報告生成
        </h3>
        {isPolling && (
          <button
            onClick={handleCancel}
            className="text-sm text-red-500 hover:text-red-700 transition-colors"
          >
            取消任務
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {progress && (
        <div className="space-y-4">
          {/* Progress Bar */}
          <div className="w-full bg-bgBase rounded-full h-2.5">
            <div
              className="bg-accentTeal h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${progress.percent}%` }}
            />
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-4 gap-4 text-sm">
            <div>
              <div className="text-textSecondary">進度</div>
              <div className="font-bold">{progress.percent}%</div>
            </div>
            <div>
              <div className="text-textSecondary">章節</div>
              <div className="font-bold">{progress.currentChapter}/{progress.totalChapters}</div>
            </div>
            <div>
              <div className="text-textSecondary">字數</div>
              <div className="font-bold">{progress.wordsSoFar.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-textSecondary">5T 閘道</div>
              <div className="font-bold">
                <span className={`inline-block px-2 py-0.5 rounded text-xs text-white ${GATE_COLORS[progress.fiveTGate as keyof typeof GATE_COLORS] || 'bg-gray-400'}`}>
                  {GATE_LABELS[progress.fiveTGate as keyof typeof GATE_LABELS] || progress.fiveTGate}
                </span>
              </div>
            </div>
          </div>

          {/* Current Chapter */}
          <div className="text-sm text-textSecondary">
            目前章節: <span className="text-textPrimary font-medium">{progress.chapterTitle}</span>
          </div>

          {/* Result */}
          {progress.status === 'completed' && progress.result && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
              <div className="font-bold text-green-800 mb-2">報告生成完成</div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <div className="text-green-600">總字數</div>
                  <div className="font-bold">{progress.result.totalWords.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-green-600">標籤數</div>
                  <div className="font-bold">{progress.result.totalTags}</div>
                </div>
                <div>
                  <div className="text-green-600">Trinity Hash</div>
                  <div className="font-mono text-xs break-all">{progress.result.trinityHash}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {!isPolling && !progress && (
        <button
          onClick={startTask}
          disabled={!company}
          className="w-full py-3 bg-accentTeal text-white rounded-lg font-bold hover:bg-accentTeal/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          啟動異步報告生成
        </button>
      )}
    </div>
  );
}
