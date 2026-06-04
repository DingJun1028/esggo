'use client';
import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useState, useCallback, useRef } from 'react';
const ToastContext = createContext(undefined);
export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);
    const counterRef = useRef(0);
    const dismiss = useCallback((id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);
    const toast = useCallback((message, variant = 'info', duration = 4000) => {
        const id = `toast-${++counterRef.current}`;
        setToasts(prev => [...prev, { id, message, variant, duration }]);
        if (duration > 0) {
            setTimeout(() => dismiss(id), duration);
        }
    }, [dismiss]);
    return (_jsx(ToastContext.Provider, { value: { toasts, toast, dismiss }, children: children }));
}
export function useToast() {
    const ctx = useContext(ToastContext);
    if (!ctx)
        throw new Error('useToast must be used within a ToastProvider');
    return ctx;
}
//# sourceMappingURL=toast-provider.js.map