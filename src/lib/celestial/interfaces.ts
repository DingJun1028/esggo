export interface IComponentCore {
  readonly uuid: string;
  readonly timestamp: number;
}

export interface IWuZuoMiaoDe extends IComponentCore {
  version: "1.0.0";
  evidence: string[]; // 記錄狀態流轉路徑與修復紀錄
  
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
  payload: any;
  origin: string;
}
