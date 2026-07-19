export interface IComponentCore {
  readonly uuid: string;
  readonly version: string;
  readonly timestamp: number;
    evidence: {
    originCause: string;    // 因：原始觸發條件
    processTrace: string[]; // 循：InfoOne 流轉路徑
    finalEffect: string;    // 果：最終執行結果與狀態
    [key: string]: any /* eslint-disable-line @typescript-eslint/no-explicit-any */;     // 允許動態屬性如 hash_lock 等
  };
}

export interface IWuZuoMiaoDe extends IComponentCore {
  // 核心狀態機
  state: "Awakened" | "Repairing" | "Calibrating" | "Stable";
  
  // 圓通無礙：流轉控制
  stream: <T>(data: T) => void;
  
  // 無作妙德：自發治理
  governance: {
    seal: <T>(data: T) => Readonly<T>;
    purify: (entropyLevel: number) => void;
  };
}

export interface InputData {
  payload: unknown;
  origin: string;
}
