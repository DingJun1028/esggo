import { celestialOrchestrator } from './CelestialOrchestrator';

export class CelestialBridge {
  // 將外部 API 呼叫納入「無作妙德」治理
  static async invoke<T>(command: string, payload: T): Promise<any> {
    const context = {
      uuid: crypto.randomUUID(), // 遵循心核 UUID 規範
      timestamp: Date.now(),
      origin: 'ESG_GO_CORE',
      command,
    };

    console.log(`[CelestialBridge] Invoking command: ${command}`);

    // 執行：感知 -> 封印 (Object.freeze) -> 執行流轉與校準 -> 沉澱
    const sealedInput = Object.freeze({
      data: payload,
      metadata: context,
    });

    return await celestialOrchestrator.executeCelestialFlow(sealedInput);
  }
}
