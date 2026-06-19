/**
 * Toast 通知系統
 * 提供全局通知功能，支持多種通知類型
 */

import React, { useEffect, useCallback } from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info, Bell, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// ==================== 類型定義 ====================

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
  closable?: boolean;
}

interface ToastStore {
  toasts: Toast[];
  isNotificationPanelOpen: boolean;
  unreadCount: number;
  
  // Toast 操作
  addToast: (toast: Omit<Toast, 'id'>) => string;
  removeToast: (id: string) => void;
  clearAllToasts: () => void;
  
  // 通知面板操作
  openNotificationPanel: () => void;
  closeNotificationPanel: () => void;
  markAllAsRead: () => void;
}

// ==================== 預設配置 ====================

const TOAST_CONFIG = {
  success: { duration: 4000, icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-50 border-green-200' },
  error: { duration: 6000, icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-50 border-red-200' },
  warning: { duration: 5000, icon: AlertTriangle, color: 'text-yellow-500', bg: 'bg-yellow-50 border-yellow-200' },
  info: { duration: 4000, icon: Info, color: 'text-blue-500', bg: 'bg-blue-50 border-blue-200' },
};

// ==================== Zustand Store ====================

export const useToastStore = create<ToastStore>()(
  persist(
    (set, get) => ({
      toasts: [],
      isNotificationPanelOpen: false,
      unreadCount: 0,

      addToast: (toast) => {
        const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const newToast = { ...toast, id };
        
        set((state) => ({
          toasts: [...state.toasts, newToast],
          unreadCount: state.unreadCount + 1,
        }));

        // 自動移除 Toast
        const duration = toast.duration ?? TOAST_CONFIG[toast.type].duration;
        if (duration > 0) {
          setTimeout(() => {
            get().removeToast(id);
          }, duration);
        }

        return id;
      },

      removeToast: (id) => {
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        }));
      },

      clearAllToasts: () => {
        set({ toasts: [], unreadCount: 0 });
      },

      openNotificationPanel: () => {
        set({ isNotificationPanelOpen: true, unreadCount: 0 });
      },

      closeNotificationPanel: () => {
        set({ isNotificationPanelOpen: false });
      },

      markAllAsRead: () => {
        set({ unreadCount: 0 });
      },
    }),
    {
      name: 'toast-storage',
      partialize: (state) => ({ toasts: state.toasts }),
    }
  )
);

// ==================== 快捷方法 ====================

export const toast = {
  success: (title: string, message?: string) => 
    useToastStore.getState().addToast({ type: 'success', title, message }),
  
  error: (title: string, message?: string) => 
    useToastStore.getState().addToast({ type: 'error', title, message }),
  
  warning: (title: string, message?: string) => 
    useToastStore.getState().addToast({ type: 'warning', title, message }),
  
  info: (title: string, message?: string) => 
    useToastStore.getState().addToast({ type: 'info', title, message }),
  
  remove: (id: string) => useToastStore.getState().removeToast(id),
  
  clear: () => useToastStore.getState().clearAllToasts(),
};

// ==================== Toast 組件 ====================

export const ToastItem: React.FC<{ toast: Toast }> = ({ toast }) => {
  const { removeToast } = useToastStore();
  const config = TOAST_CONFIG[toast.type];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: 100, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className={`
        flex items-start gap-3 p-4 rounded-xl border shadow-lg min-w-[320px] max-w-md
        ${config.bg} backdrop-blur-sm
      `}
    >
      {/* 圖標 */}
      <div className={`flex-shrink-0 ${config.color}`}>
        <Icon size={20} />
      </div>

      {/* 內容 */}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-800">{toast.title}</p>
        {toast.message && (
          <p className="text-sm text-gray-600 mt-1 line-clamp-2">{toast.message}</p>
        )}
        
        {/* 操作按鈕 */}
        {toast.action && (
          <button
            onClick={toast.action.onClick}
            className="mt-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
          >
            {toast.action.label}
          </button>
        )}
      </div>

      {/* 關閉按鈕 */}
      {(toast.closable !== false) && (
        <button
          onClick={() => removeToast(toast.id)}
          className="flex-shrink-0 p-1 hover:bg-white/50 rounded-lg transition-colors"
        >
          <X size={16} className="text-gray-500" />
        </button>
      )}
    </motion.div>
  );
};

// ==================== Toast 容器 ====================

export const ToastContainer: React.FC<{
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
}> = ({ position = 'top-right' }) => {
  const { toasts, removeToast } = useToastStore();

  const positionClasses = {
    'top-right': 'fixed top-4 right-4 z-50',
    'top-left': 'fixed top-4 left-4 z-50',
    'bottom-right': 'fixed bottom-4 right-4 z-50',
    'bottom-left': 'fixed bottom-4 left-4 z-50',
    'top-center': 'fixed top-4 left-1/2 -translate-x-1/2 z-50',
    'bottom-center': 'fixed bottom-4 left-1/2 -translate-x-1/2 z-50',
  };

  if (toasts.length === 0) return null;

  return (
    <div className={positionClasses[position]}>
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} />
        ))}
      </AnimatePresence>
    </div>
  );
};

// ==================== 通知面板 ====================

export const NotificationPanel: React.FC = () => {
  const { 
    toasts, 
    clearAllToasts, 
    removeToast,
    isNotificationPanelOpen, 
    closeNotificationPanel,
    unreadCount,
    markAllAsRead,
  } = useToastStore();

  // 關閉面板
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeNotificationPanel();
    };
    
    if (isNotificationPanelOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isNotificationPanelOpen, closeNotificationPanel]);

  if (!isNotificationPanelOpen) return null;

  return (
    <>
      {/* 遮罩 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
        onClick={closeNotificationPanel}
      />

      {/* 面板 */}
      <motion.div
        initial={{ opacity: 0, x: '100%' }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: '100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
      >
        {/* 標題 */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-3">
            <Bell className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold">通知中心</h2>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {toasts.length > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                全部標為已讀
              </button>
            )}
            <button
              onClick={closeNotificationPanel}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={20} className="text-gray-500" />
            </button>
          </div>
        </div>

        {/* 通知列表 */}
        <div className="flex-1 overflow-auto p-4 space-y-3">
          {toasts.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <Zap size={48} className="mb-4 text-gray-300" />
              <p>暫無通知</p>
            </div>
          ) : (
            <AnimatePresence>
              {toasts.map((t) => {
                const config = TOAST_CONFIG[t.type];
                const Icon = config.icon;
                
                return (
                  <motion.div
                    key={t.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    className={`
                      p-4 rounded-xl border ${config.bg} cursor-pointer
                      hover:shadow-md transition-shadow
                    `}
                    onClick={() => removeToast(t.id)}
                  >
                    <div className="flex items-start gap-3">
                      <Icon className={`flex-shrink-0 ${config.color}`} size={20} />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-800">{t.title}</p>
                        {t.message && (
                          <p className="text-sm text-gray-600 mt-1">{t.message}</p>
                        )}
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeToast(t.id);
                        }}
                        className="p-1 hover:bg-white/50 rounded transition-colors"
                      >
                        <X size={14} className="text-gray-500" />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          )}
        </div>

        {/* 底部 */}
        {toasts.length > 0 && (
          <div className="p-4 border-t">
            <button
              onClick={clearAllToasts}
              className="w-full py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              清除所有通知
            </button>
          </div>
        )}
      </motion.div>
    </>
  );
};

// ==================== Toast 通知按鈕 ====================

export const ToastButton: React.FC = () => {
  const { unreadCount, openNotificationPanel } = useToastStore();

  return (
    <button
      onClick={openNotificationPanel}
      className="relative p-2 hover:bg-white/10 rounded-lg transition-colors"
    >
      <Bell size={20} className="text-gray-600" />
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}
    </button>
  );
};

// ==================== Hook ====================

export function useToast() {
  const store = useToastStore();

  return {
    // Toast 方法
    success: useCallback((title: string, message?: string) => {
      store.addToast({ type: 'success', title, message });
    }, [store]),
    
    error: useCallback((title: string, message?: string) => {
      store.addToast({ type: 'error', title, message });
    }, [store]),
    
    warning: useCallback((title: string, message?: string) => {
      store.addToast({ type: 'warning', title, message });
    }, [store]),
    
    info: useCallback((title: string, message?: string) => {
      store.addToast({ type: 'info', title, message });
    }, [store]),
    
    // 移除
    remove: useCallback((id: string) => {
      store.removeToast(id);
    }, [store]),
    
    // 清除
    clear: useCallback(() => {
      store.clearAllToasts();
    }, [store]),
    
    // 通知面板
    notifications: {
      open: store.openNotificationPanel,
      close: store.closeNotificationPanel,
      unreadCount: store.unreadCount,
    },
  };
}

export default ToastContainer;
