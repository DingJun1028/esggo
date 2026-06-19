/**
 * DoomsdayClock Service
 * 追蹤全球災難風險與「命定全滅結局」的指針位置。
 */
export class DoomsdayClock {
    private static instance: DoomsdayClock;

    // 初始設定在 85 秒，其餘為緩衝空間
    private secondsToMidnight: number = 85;
    private coordinationFailures: number = 0;
    private lastUpdate: Date = new Date();

    private constructor() { }

    public static getInstance(): DoomsdayClock {
        if (!DoomsdayClock.instance) {
            DoomsdayClock.instance = new DoomsdayClock();
        }
        return DoomsdayClock.instance;
    }

    /**
     * 取得目前狀態
     */
    public getStatus() {
        return {
            secondsToMidnight: this.secondsToMidnight,
            coordinationFailures: this.coordinationFailures,
            isCritical: this.secondsToMidnight < 20,
            lastUpdate: this.lastUpdate.toISOString()
        };
    }

    /**
     * 增加多極協調失敗次數 (會加速指針前進)
     */
    public recordCoordinationFailure(impact: number = 1) {
        this.coordinationFailures += 1;
        // 每一次失敗減少指針餘裕
        this.tick(impact);
    }

    /**
     * 指針前進 (災難風險增加)
     */
    public tick(seconds: number = 1) {
        this.secondsToMidnight = Math.max(0, this.secondsToMidnight - seconds);
        this.lastUpdate = new Date();
    }

    /**
     * 玩家合作/永續行動 -> 撥回指針 (災難風險降低)
     */
    public reverseTick(seconds: number = 1) {
        this.secondsToMidnight = Math.min(120, this.secondsToMidnight + seconds);
        this.lastUpdate = new Date();
    }

    /**
     * 重設時鐘 (通常用於新賽季或大成功結局)
     */
    public reset() {
        this.secondsToMidnight = 85;
        this.coordinationFailures = 0;
        this.lastUpdate = new Date();
    }
}

export const doomsdayClock = DoomsdayClock.getInstance();
