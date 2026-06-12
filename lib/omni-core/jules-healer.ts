import { omniCore } from '../omni-core.ts';

/**
 * 萬能果因引擎 (OmniJules Healer Engine)
 * 負責執行 9-Step Karma Protocol 解決系統異常
 */
export class JulesHealer {
  private static instance: JulesHealer;

  private constructor() {}

  static getInstance(): JulesHealer {
    if (!JulesHealer.instance) {
      JulesHealer.instance = new JulesHealer();
    }
    return JulesHealer.instance;
  }

  /**
   * 萬能果因修復協議：亂碼修復專用通道
   * @param rawBytes 原始二進位流（不帶預設立場的觀果）
   */
  public async fixGarbledText(rawBytes: Buffer | Uint8Array | number[]): Promise<{
    originalText: string,
    diagnostics: any
  }> {
    console.log(`[OmniJules] 🚨 啟動「萬能果因修復協議」- 亂碼專項`);

    // 階段一：覺察與導向 (Awareness & Direction)
    // 1. 觀果: 看見原始位元流
    const byteStream = Array.from(rawBytes as ArrayLike<number>);
    console.log(`[OmniJules] 觀果: 接收到 ${byteStream.length} bytes 的原始資料`);
    
    // 2. 立願: 恢復絕對真理 (精準的文字語義)
    // 3. 尋因: 第一性原理溯源，通常是 Big5/UTF-8 碰撞
    
    // 階段二：轉化與顯化 (Transformation & Manifestation)
    // 4. 修因: 實作多維度解碼攔截
    let decodedText = "";
    let encodingUsed = "unknown";
    
    try {
      // 先嘗試無損 UTF-8
      decodedText = new TextDecoder('utf-8', { fatal: true }).decode(new Uint8Array(byteStream));
      encodingUsed = "utf-8";
    } catch (e) {
      // 5. 造緣: 若失敗，則建立安全的 Big5 降級處理沙盒 (台灣常見亂碼源)
      console.log(`[OmniJules] 尋因: UTF-8 解碼失敗，偵測到可能的 Big5 污染。造緣啟動降級解碼。`);
      try {
        decodedText = new TextDecoder('big5').decode(new Uint8Array(byteStream));
        encodingUsed = "big5";
      } catch (big5Error) {
        // 最終兜底
        decodedText = new TextDecoder('utf-8').decode(new Uint8Array(byteStream));
        encodingUsed = "utf-8 (forced)";
      }
    }
    
    // 6. 結果: 取得乾淨的字串
    
    // 階段三：確信與進化 (Verification & Evolution)
    // 7. 驗因: 驗證字串中是否還有典型亂碼特徵 (如 \ufffd)
    const hasGarbage = decodedText.includes('\ufffd');
    
    // 8. 證果: Hash Lock
    const crystal = await omniCore.sealComponent(
      'TextDecoding',
      'OmniJules',
      JSON.stringify({ textLength: decodedText.length, encoding: encodingUsed }),
      'Garbled Text Fixed'
    );

    // 9. 傳法: 輸出結果
    const diagnostics = {
      rootCause: `Encoding mismatch. Original stream contained ${byteStream.length} bytes.`,
      actionTaken: `Applied Karma Protocol multi-dimensional decoding. Resolved via ${encodingUsed}.`,
      karmaStatus: hasGarbage ? "PARTIALLY TRANSCENDED" : "TRANSCENDED (證果)",
      repairHash: crystal.hash_lock
    };

    console.log(`[OmniJules] 證果: 修復完成。Hash: ${diagnostics.repairHash}`);

    return {
      originalText: decodedText,
      diagnostics
    };
  }
}

export const julesHealer = JulesHealer.getInstance();
