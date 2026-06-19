
import React, { createContext, useContext, useState, useCallback } from 'react';
import { Toast, ToastType } from '../types';

interface ToastContextType {
  toasts: Toast[];
  notifications: Toast[]; // Persistent history
  /**
   * Triggers a new toast notification and adds it to history.
   */
  addToast: (type: ToastType, message: string, title?: string, duration?: number) => void;
  removeToast: (id: string) => void;
  clearNotifications: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

/**
 * Provides a global system for displaying temporary notification messages (Toasts)
 * and maintaining a persistent notification history for the notification center.
 */
export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [notifications, setNotifications] = useState<Toast[]>([
    // Initial Mock Notifications
    { id: 'init-1', type: 'success', title: 'System Ready', message: 'ESGss Platform v12.0.4 initialized.', duration: 0 },
    { id: 'init-2', type: 'info', title: 'AI Agent', message: 'Gemini 3 Pro connected for deep reasoning.', duration: 0 }
  ]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const addToast = useCallback((type: ToastType, message: string, title?: string, duration = 5000) => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 9);
    const newToast: Toast = { id, type, message, title, duration };
    
    // Add to transient toasts (popups)
    setToasts((prev) => [...prev, newToast]);

    // Add to persistent history (notification center)
    setNotifications((prev) => [newToast, ...prev].slice(0, 50)); // Keep last 50

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ toasts, notifications, addToast, removeToast, clearNotifications }}>
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

/**
 * ToastContainer component to display active toasts
 */
export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 p-4 ${
            toast.type === 'success' ? 'border-l-4 border-emerald-500' :
            toast.type === 'error' ? 'border-l-4 border-red-500' :
            toast.type === 'warning' ? 'border-l-4 border-yellow-500' :
            'border-l-4 border-blue-500'
          }`}
        >
          <div className="flex items-start">
            <div className="flex-shrink-0">
              {toast.type === 'success' && <div className="w-6 h-6 text-emerald-500">✓</div>}
              {toast.type === 'error' && <div className="w-6 h-6 text-red-500">✕</div>}
              {toast.type === 'warning' && <div className="w-6 h-6 text-yellow-500">⚠</div>}
              {toast.type === 'info' && <div className="w-6 h-6 text-blue-500">ℹ</div>}
            </div>
            <div className="ml-3 w-0 flex-1 pt-0.5">
              {toast.title && (
                <p className="text-sm font-medium text-gray-900">{toast.title}</p>
              )}
              <p className="text-sm text-gray-500">{toast.message}</p>
            </div>
            <div className="ml-4 flex-shrink-0 flex">
              <button
                className="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                onClick={() => removeToast(toast.id)}
              >
                ×
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
