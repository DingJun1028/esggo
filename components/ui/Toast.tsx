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
  return null;
}
