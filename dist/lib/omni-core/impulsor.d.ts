/**
 * ImpulsorEngine (3.7GHz晶振驅動器 sprd.ai M2進線版)
 * ADK小隊新手向指導手冊（E001-V2.1） - 系統基礎設備
 */
export declare class ImpulsorEngine {
    private status;
    private hz;
    constructor();
    private registerHooks;
    getStatus(): {
        status: "active" | "offline" | "overdrive";
        clockSpeed: string;
        version: string;
    };
    forgeSelfHealing(): {
        system: {
            real: boolean;
            trace: string;
            fallback: string;
        };
    };
}
export declare const impulsorEngine: ImpulsorEngine;
//# sourceMappingURL=impulsor.d.ts.map