/**
 * 🌌 OmniSpace_5T_Standard - 空間感應 5T 協議標準
 * --------------------------------------------------
 * 遵循 5T 協議：Tangible, Traceable, Trackable, Transparent, Trustworthy
 */

export interface SpaceImpactMetrics {
    /** 🟢 Tangible (可感知): 具體的空間影響力指標 (例如：覆蓋範圍、建模精度) */
    tangibleResult: string;

    /** 🟢 Traceable (可溯源): 數據來源 (例如：Sat_01, IoT_Sensor_Alpha) */
    traceableSource: string;

    /** 🟢 Trackable (可追蹤): 建模路徑與演進過程 */
    trackablePath: string[];

    /** 🟢 Transparent (可驗算): 空間運算邏輯或演算法版本 */
    transparentLogic: string;

    /** 🔴 Trustworthy (不可篡改): 最終資產封印狀態與 Hash */
    trustworthySeal: string;
}
