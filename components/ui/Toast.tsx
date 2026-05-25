'use client';
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertTriangle, XCircle, Info, X } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useToast, type ToastVariant } from './toast-provider';

const variantConfig: Record<ToastVariant, { icon: React.ReactNode; containerClass: string }> = {
  success: {
    icon: <CheckCircle size={18} className="text-emerald-500" />,
    containerClass: 'bg-emerald-50 border-emerald-200',
  },
  error: {
    icon: <XCircle size={18} className="text-red-500" />,
    containerClass: 'bg-red-50 border-red-200',
  },
  warning: {
    icon: <AlertTriangle size={18} className="text-amber-500" />,
    containerClass: 'bg-amber-50 border-amber-200',
  },
  info: {
    icon: <Info size={18} className="text-blue-500" />,
    containerClass: 'bg-blue-50 border-blue-200',
  },
};

export function ToastContainer() {
  const { toasts, dismiss } = useToast();

  return (
    <div className="fixed top-4 right-4 z-[500] flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map(t => {
          const config = variantConfig[t.variant];
          return (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, x: 100, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100, scale: 0.95 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              className={cn(
                'pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-2xl border shadow-lg backdrop-blur-md min-w-[300px] max-w-[420px]',
                config.containerClass
              )}
            >
              {config.icon}
              <p className="flex-1 text-sm font-bold text-slate-800">{t.message}</p>
              <button
                onClick={() => dismiss(t.id)}
                className="shrink-0 w-7 h-7 rounded-xl flex items-center justify-center hover:bg-black/5 text-slate-400 transition-colors"
              >
                <X size={14} />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
