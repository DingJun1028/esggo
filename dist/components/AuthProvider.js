'use client';
import { Fragment as _Fragment, jsx as _jsx } from "react/jsx-runtime";
import { useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useAuthStore } from '@/src/client/store/useAuthStore';
import '@/lib/firebase'; // 確保 Firebase App 已經初始化
export function AuthProvider({ children }) {
    const setUser = useAuthStore((state) => state.setUser);
    const setError = useAuthStore((state) => state.setError);
    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (user) => setUser(user), (error) => setError(error.message));
        return () => unsubscribe();
    }, [setUser, setError]);
    return _jsx(_Fragment, { children: children });
}
//# sourceMappingURL=AuthProvider.js.map