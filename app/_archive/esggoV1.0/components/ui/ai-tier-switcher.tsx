"use client";

import React from "react";
import { Cloud, Server, Cpu } from "lucide-react";
import { cn } from "@/lib/utils";
import { AITier } from "@/lib/services/omni-ai-router";

interface AITierSwitcherProps {
    activeTier: AITier;
    onChange: (tier: AITier) => void;
    className?: string;
    edgeProgress?: number;
}

export function AITierSwitcher({ activeTier, onChange, className, edgeProgress }: AITierSwitcherProps) {
    const tiers: { id: AITier; label: string; icon: React.ReactNode; description: string }[] = [
        { id: "Cloud", label: "Cloud AI", icon: <Cloud className="w-4 h-4" />, description: "雲端推論 (Vertex AI / Gemini)" },
        { id: "Local", label: "Local AI", icon: <Server className="w-4 h-4" />, description: "本地推論 (Genkit + Ollama)" },
        { id: "Edge", label: "On-Device", icon: <Cpu className="w-4 h-4" />, description: "設備端推論 (MediaPipe WebML)" }
    ];

    return (
        <div
            className={cn(
                "inline-flex bg-gray-100 dark:bg-gray-800/80 rounded-lg p-1 shadow-inner",
                className
            )}
        >
            {tiers.map((tier) => (
                <button
                    key={tier.id}
                    onClick={() => onChange(tier.id)}
                    title={tier.description}
                    className={cn(
                        "relative overflow-hidden flex items-center justify-center px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200 ease-in-out",
                        activeTier === tier.id
                            ? "bg-white dark:bg-gray-900 text-blue-600 dark:text-blue-400 shadow-sm ring-1 ring-black/5 dark:ring-white/10"
                            : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    )}
                >
                    {/* Edge 模型下載進度條底色 */}
                    {tier.id === "Edge" && edgeProgress !== undefined && edgeProgress > 0 && edgeProgress < 100 && (
                        <span
                            className="absolute left-0 top-0 bottom-0 bg-blue-500/15 dark:bg-blue-400/20 transition-all duration-300 pointer-events-none"
                            style={{ width: `${edgeProgress}%` }}
                        />
                    )}
                    <span className="relative z-10 flex items-center gap-2 pointer-events-none">
                        {tier.icon}
                        <span>
                            {tier.label}
                            {tier.id === "Edge" && edgeProgress !== undefined && edgeProgress > 0 && edgeProgress < 100 && (
                                <span className="ml-1 text-[10px] font-bold opacity-80">
                                    {Math.round(edgeProgress)}%
                                </span>
                            )}
                        </span>
                    </span>
                </button>
            ))}
        </div>
    );
}