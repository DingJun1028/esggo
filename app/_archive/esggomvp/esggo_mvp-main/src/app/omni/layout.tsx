"use client";

import React from 'react';
import { ToastProvider } from '../../components/omni/liquid-glass/ToastProvider';

export default function OmniUniverseLayout({ children }: { children: React.ReactNode }) {
    return (
        <ToastProvider>
            {/* 
                Omni Universe Context Wrapper 
                Nested under MasterLayout - removing redundant shell to fix double-header (果因修復)
            */}
            <div className="flex-1 flex flex-col w-full animate-in fade-in duration-700">
                {children}
            </div>
        </ToastProvider>
    );
}
