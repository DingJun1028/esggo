
import React, { useEffect } from 'react';
import { useToast } from '../contexts/ToastContext';
import { Toast as ToastType } from '../types';
import { X, CheckCircle, AlertTriangle, AlertCircle, Info, Star } from 'lucide-react';

const icons = {
  success: <CheckCircle className="w-5 h-5 text-emerald-400" />,
  error: <AlertCircle className="w-5 h-5 text-red-400" />,
  warning: <AlertTriangle className="w-5 h-5 text-amber-400" />,
  info: <Info className="w-5 h-5 text-blue-400" />,
  reward: <Star className="w-5 h-5 text-yellow-400 fill-current animate-spin-slow" />,
};

const styles = {
  success: 'border-emerald-500/30 bg-emerald-500/10 shadow-emerald-500/10',
  error: 'border-red-500/30 bg-red-500/10 shadow-red-500/10',
  warning: 'border-amber-500/30 bg-amber-500/10 shadow-amber-500/10',
  info: 'border-blue-500/30 bg-blue-500/10 shadow-blue-500/10',
  reward: 'border-yellow-500/50 bg-yellow-500/20 shadow-yellow-500/30 ring-1 ring-yellow-400/50',
};

const ToastItem: React.FC<{ toast: ToastType }> = ({ toast }) => {
  const { removeToast } = useToast();

  return (
    <div 
      className={`
        pointer-events-auto w-full max-w-sm overflow-hidden rounded-xl border backdrop-blur-xl
        p-4 shadow-lg transition-all duration-300 animate-fade-in mb-3
        ${styles[toast.type]}
      `}
      role="alert"
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">
          {icons[toast.type]}
        </div>
        <div className="flex-1 w-0">
          {toast.title && (
            <p className={`text-sm font-semibold mb-1 ${toast.type === 'reward' ? 'text-yellow-200' : 'text-white'}`}>
              {toast.title}
            </p>
          )}
          <p className="text-sm text-gray-300 leading-relaxed">
            {toast.message}
          </p>
        </div>
        <div className="ml-4 flex flex-shrink-0">
          <button
            className="inline-flex rounded-md text-gray-400 hover:text-white focus:outline-none"
            onClick={() => removeToast(toast.id)}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export const ToastContainer: React.FC = () => {
  const { toasts } = useToast();

  return (
    <div 
      aria-live="assertive" 
      className="pointer-events-none fixed inset-0 z-[100] flex flex-col items-end px-4 py-6 sm:items-end sm:p-6"
    >
      <div className="flex w-full flex-col items-center space-y-4 sm:items-end top-16 relative">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} />
        ))}
      </div>
    </div>
  );
};
