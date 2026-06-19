'use client';

import React, { useState } from 'react';
import { LogIn, LogOut, User, ChevronDown } from 'lucide-react';
import Link from 'next/link';

/** 
 * AuthMenu 認證選單元件
 * 當前為 UI Skeleton，未來接入 better-auth session
 */
export default function AuthMenu() {
    const [open, setOpen] = useState(false);
    // 模擬 session 狀態（未來從 better-auth 取得）
    const isLoggedIn = false;

    if (!isLoggedIn) {
        return (
            <Link
                href="/auth/signin"
                className="flex items-center gap-1.5 text-xs font-mono text-white/40 hover:text-omni-primary transition-colors px-3 py-1.5 rounded-lg hover:bg-omni-primary/10 border border-transparent hover:border-omni-primary/20"
            >
                <LogIn size={13} />
                <span>登入</span>
            </Link>
        );
    }

    return (
        <div className="relative">
            <button
                onClick={() => setOpen(v => !v)}
                className="flex items-center gap-2 text-xs font-mono text-white/60 hover:text-white pl-2 pr-3 py-1.5 rounded-xl bg-white/5 border border-white/10 transition-all"
            >
                <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-omni-primary to-blue-400 flex items-center justify-center">
                    <User size={11} className="text-white" />
                </div>
                <span>User</span>
                <ChevronDown size={11} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
            </button>

            {open && (
                <div className="absolute right-0 mt-2 w-48 bg-black/90 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50">
                    <Link
                        href="/omni/profile"
                        className="flex items-center gap-2.5 px-4 py-3 text-sm text-white/70 hover:text-white hover:bg-white/5 transition-all"
                    >
                        <User size={14} />
                        個人設定
                    </Link>
                    <button
                        onClick={() => setOpen(false)}
                        className="w-full flex items-center gap-2.5 px-4 py-3 text-sm text-rose-400/70 hover:text-rose-400 hover:bg-rose-500/5 transition-all border-t border-white/5"
                    >
                        <LogOut size={14} />
                        登出
                    </button>
                </div>
            )}
        </div>
    );
}
