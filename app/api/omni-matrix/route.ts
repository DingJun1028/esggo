import { NextRequest, NextResponse } from 'next/server';
import { omniMatrix } from '@/lib/omni-core/matrix';

/**
 * 萬能元件心核 API 端點 (OmniComponent Matrix Gateway)
 * 接收使用者的「混亂輸入」，推入「終始矩陣」進行六式循環，
 * 最終回傳具備 5T Hash Lock 封印的「結構化知識資產」。
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { rawCommand, context, expectedDoD } = body;

    if (!rawCommand || !expectedDoD) {
      return NextResponse.json({
        success: false,
        error: "Missing required matrix inputs: 'rawCommand' and 'expectedDoD' must be provided."
      }, { status: 400 });
    }

    console.log(`[OmniMatrix Gateway] 🚀 啟動終始矩陣: 接收到混亂輸入...`);

    // 將輸入推入 OmniMatrix 執行六式閉環
    const matrixOutput = await omniMatrix.runLifecycle({
      rawCommand,
      context: context || {},
      expectedDoD,
    });

    console.log(`[OmniMatrix Gateway] ♾️ 矩陣運算完成，資產已沉澱 (Hash: ${matrixOutput.hashLock})`);

    return NextResponse.json({
      success: true,
      data: matrixOutput,
      timestamp: Date.now()
    });

  } catch (error) {
    console.error('[OmniMatrix Gateway] 發生無法預期的矩陣崩塌:', error);
    return NextResponse.json({
      success: false,
      error: (error as Error).message,
    }, { status: 500 });
  }
}
