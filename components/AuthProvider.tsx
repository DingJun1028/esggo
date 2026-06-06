'use client';

import React, { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { useAuthStore } from '@/src/client/store/useAuthStore';
import { auth } from '@/lib/firebase'; // 確保 Firebase App 已經初始化並導入 auth

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const setUser = useAuthStore((state) => state.setUser);
    const setError = useAuthStore((state) => state.setError);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(
            auth,
            (user) => setUser(user),
            (error) => setError(error.message)
        );

        return () => unsubscribe();
    }, [setUser, setError]);

    return <>{children}</>;
}