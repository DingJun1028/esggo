import { LiquidGlassContainer } from "@/components/omni/liquid-glass/LiquidGlassContainer";
import { IComponentCore } from "../../core/gov/IComponentCore";

export default function OmniLoading() {
    const loadingCore: IComponentCore = {
        uuid: 'mod-omni-loading',
        version: '1.0.0',
        timestamp: Date.now(),
        evidence: []
    };
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] w-full p-4">
            <LiquidGlassContainer glowColor="aqua" intensity="medium" className="w-full max-w-md p-8 text-center" coreContext={loadingCore}>
                <div className="w-16 h-16 mx-auto mb-6 relative">
                    <div className="absolute inset-0 rounded-full border-t-2 border-omni-primary animate-spin shadow-[0_0_15px_var(--theme-primary)]"></div>
                    <div className="absolute inset-2 rounded-full border-r-2 border-omni-accent animate-spin-slow"></div>
                </div>
                <h2 className="text-xl font-mono text-omni-text-main mb-2 tracking-widest animate-pulse">
                    SYNCHRONIZING
                </h2>
                <p className="text-sm text-omni-text-muted font-mono">
                    Establishing Golden Thread connections...
                </p>

                {/* Loading Bar */}
                <div className="w-full h-1 bg-omni-bg rounded-full mt-8 overflow-hidden relative">
                    <div className="absolute left-0 top-0 h-full w-1/3 bg-gradient-to-r from-omni-primary to-omni-accent shadow-[0_0_10px_var(--theme-primary)] animate-pulse"
                        style={{
                            animation: 'shimmer 2s infinite linear',
                            backgroundSize: '200% 100%'
                        }}
                    />
                </div>
            </LiquidGlassContainer>
        </div>
    );
}
