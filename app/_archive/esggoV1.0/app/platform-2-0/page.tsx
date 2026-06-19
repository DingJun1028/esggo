"use client";

import React from "react";
import { AppProvider } from "@/lib/context/app-context";
import { CommandCenterV2 } from "@/components/views/command-center-v2";
import { OmniCommandTray } from "@/components/layout/omni-command-tray";
import { ChartGradientProvider } from "@/components/ui/chart-gradient-provider";
import { Toaster } from "sonner";
import { Sidebar } from "@/components/layout/sidebar";

/**
 * Platform20Gateway
 * A standalone entry point to showcase the Platform 2.0 renovation.
 */
export default function Platform20Gateway() {
    return (
        <AppProvider>
            <ChartGradientProvider />
            <div className="flex h-screen overflow-hidden bg-slate-50 font-sans selection:bg-teal-500/10 relative">
                <Sidebar />

                {/* Background Aesthetics */}
                <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20 z-0">
                    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-teal-400 rounded-full blur-[120px]" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-400 rounded-full blur-[120px]" />
                </div>

                <main className="flex-1 overflow-y-auto relative z-10 p-6 md:p-12 lg:p-16">
                    <div className="max-w-[1400px] mx-auto">
                        <CommandCenterV2 />
                    </div>
                </main>

                {/* Platform 2.0 Persistent Layer */}
                <OmniCommandTray />

                <Toaster position="top-center" expand={true} richColors />
            </div>
        </AppProvider>
    );
}
