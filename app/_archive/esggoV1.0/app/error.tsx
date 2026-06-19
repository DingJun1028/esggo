"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // 可以在這裡串接正式的 Log 系統
        console.error("Critical Terminal Error:", error);
    }, [error]);

    return (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-surface p-6 text-center">
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="max-w-md w-full p-8 border-2 border-error/20 bg-error/5 rounded-2xl backdrop-blur-xl"
            >
                <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-full bg-error/10 text-error">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                </div>

                <h2 className="text-2xl font-space-grotesk font-bold text-on-surface mb-2">
                    Terminal Status: CRITICAL_FAILURE
                </h2>

                <p className="text-on-surface/60 font-newsreader italic mb-8">
                    The 5T Protocol has encountered an unexpected anomaly. Entropy levels are fluctuating...
                </p>

                <div className="flex flex-col gap-3">
                    <button
                        onClick={() => reset()}
                        className="w-full py-3 px-6 bg-primary text-on-primary rounded-xl font-bold hover:opacity-90 transition-opacity"
                    >
                        Reconnect Terminal
                    </button>

                    <button
                        onClick={() => window.location.href = "/"}
                        className="w-full py-3 px-6 border-2 border-on-surface/10 text-on-surface/60 rounded-xl font-bold hover:bg-on-surface/5 transition-colors"
                    >
                        Return to Core Hub
                    </button>
                </div>

                {error.digest && (
                    <p className="mt-8 text-[10px] text-on-surface/30 font-mono tracking-tighter">
                        Anomany Digest: {error.digest}
                    </p>
                )}
            </motion.div>
        </div>
    );
}
