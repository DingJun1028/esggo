import React, { memo, useState, useCallback, useMemo } from 'react';
import { MOCK_TALENT_POOL } from '@/types/talent';
import { omniLogger, LogCategory } from '@/services/omniLogger';

// ==================== TYPE DEFINITIONS ====================
interface ProjectGenesisModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onSuccess: () => void;
}

interface FormData {
  title: string;
  metric: string;
  target: string;
}

const INITIAL_FORM_DATA: FormData = {
  title: '',
  metric: '',
  target: '',
};

// ==================== MAIN COMPONENT ====================
export const ProjectGenesisModal = memo<ProjectGenesisModalProps>(
  ({ isOpen, onClose, onSuccess }: ProjectGenesisModalProps) => {
    const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const currentUser = useMemo(
      () =>
        MOCK_TALENT_POOL['user-jun-001'] || {
          uuid: 'unknown',
          name: 'Unknown User',
          role: 'N/A',
          avatar_url: '',
          department: 'N/A',
          skills: [],
        },
      []
    );

    const handleSubmit = useCallback(
      async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
          const response = await fetch('http://localhost:3000/api/projects', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              title: formData.title,
              owner_id: currentUser.uuid,
              impact_metric: formData.metric,
              target_value: Number(formData.target),
            }),
          });

          if (!response.ok) throw new Error('Genesis Failed');

          setFormData(INITIAL_FORM_DATA);
          onSuccess();
          onClose();
          onClose();
        } catch (error) {
          omniLogger.error(LogCategory.UI, 'Minting Error', { error });
          alert('創世失敗，請檢查控制台日誌。');
        } finally {
          setIsSubmitting(false);
        }
      },
      [formData, currentUser.uuid, onSuccess, onClose]
    );

    const handleOverlayClick = useCallback(
      (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      },
      [onClose]
    );

    const updateField = useCallback(
      (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [field]: e.target.value }));
      },
      []
    );

    if (!isOpen) return null;

    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm transition-opacity duration-300"
        onClick={handleOverlayClick}
        role="dialog"
        aria-labelledby="genesis-modal-title"
        aria-modal="true"
      >
        <div className="w-[500px] bg-[#0B0C10] border border-primary rounded-xl p-6 shadow-[0_0_40px_rgba(13,242,238,0.25)] relative overflow-hidden">
          <div
            className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50"
            aria-hidden="true"
          />

          <header className="flex justify-between items-center mb-6">
            <h2
              id="genesis-modal-title"
              className="text-primary text-xl font-bold flex items-center gap-2"
            >
              <span className="animate-pulse" aria-hidden="true">
                ⚡
              </span>{' '}
              PROJECT GENESIS
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              aria-label="Close modal"
            >
              ✕
            </button>
          </header>

          <div className="mb-6 flex items-center gap-3 bg-gray-900/50 p-3 rounded border border-gray-800">
            <img
              src={currentUser.avatar_url}
              alt={currentUser.name}
              className="w-10 h-10 rounded-full border border-primary"
            />
            <div>
              <div className="text-xs text-gray-400 font-mono">ISSUING AUTHORITY (專案發起人)</div>
              <div className="text-sm font-bold text-white">
                {currentUser.name}{' '}
                <span className="text-[primary] text-xs">({currentUser.role})</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label htmlFor="project-title" className="text-gray-400 text-xs font-mono block mb-1">
                PROJECT DESIGNATION (專案名稱)
              </label>
              <input
                id="project-title"
                type="text"
                className="w-full bg-black border border-gray-700 rounded p-3 text-white focus:border-[primary] focus:shadow-[0_0_10px_rgba(212,175,55,0.3)] outline-none transition-all placeholder-gray-600"
                value={formData.title}
                onChange={updateField('title')}
                placeholder="e.g. 2026 Supply Chain Net-Zero Initiative"
                required
                aria-required="true"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="impact-metric"
                  className="text-gray-400 text-xs font-mono block mb-1"
                >
                  IMPACT METRIC (影響力指標)
                </label>
                <input
                  id="impact-metric"
                  type="text"
                  className="w-full bg-black border border-gray-700 rounded p-3 text-white focus:border-primary outline-none transition-all placeholder-gray-600"
                  value={formData.metric}
                  onChange={updateField('metric')}
                  placeholder="e.g. tCO2e"
                  required
                  aria-required="true"
                />
              </div>
              <div>
                <label
                  htmlFor="target-value"
                  className="text-gray-400 text-xs font-mono block mb-1"
                >
                  TARGET VALUE (目標數值)
                </label>
                <input
                  id="target-value"
                  type="number"
                  className="w-full bg-black border border-gray-700 rounded p-3 text-white focus:border-primary outline-none transition-all placeholder-gray-600"
                  value={formData.target}
                  onChange={updateField('target')}
                  placeholder="0"
                  required
                  aria-required="true"
                />
              </div>
            </div>

            <footer className="flex justify-end gap-3 mt-4 pt-4 border-t border-gray-800">
              <button
                type="button"
                onClick={onClose}
                className="text-gray-400 hover:text-white px-4 py-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                ABORT
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-primary text-black font-bold px-6 py-2 rounded hover:bg-primary/80 hover:shadow-[0_0_20px_#0df2ee] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-primary"
                aria-label={isSubmitting ? 'Minting asset in progress' : 'Initialize protocol'}
              >
                {isSubmitting ? (
                  <>
                    <span className="animate-spin" aria-hidden="true">
                      ↻
                    </span>{' '}
                    MINTING ASSET...
                  </>
                ) : (
                  'INITIALIZE PROTOCOL'
                )}
              </button>
            </footer>
          </form>
        </div>
      </div>
    );
  }
);

ProjectGenesisModal.displayName = 'ProjectGenesisModal';
