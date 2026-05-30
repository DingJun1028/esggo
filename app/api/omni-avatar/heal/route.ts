import { NextRequest, NextResponse } from 'next/server';
import { GlobalHealing, HealingLevel } from '../../../../lib/omni-space/global-healing';
import { EventStore } from '../../../../lib/omni-space/event-store';
// 注意：在實際環境中，您需要實例化並注入對應的 AdapterNodes (例如 NotionNode, AlTableNode)
// 這裡展示 API 接口的架構。

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const level: HealingLevel = body.level || 'LV2_AUTO_HEAL';
    
    // 1. 初始化 GPL 事件庫 (實務上應連線至 Supabase/Postgres 或共用實例)
    const eventStore = new EventStore();

    // 2. 初始化調和器
    const healer = new GlobalHealing(eventStore, level);

    // 3. 註冊要掃描的節點
    // 實務上這裡會動態載入使用者的整合設定，例如：
    // healer.registerNode(new NotionAdapterNode(process.env.NOTION_PAGE_ID));
    // healer.registerNode(new AlTableAdapterNode(process.env.ALTABLE_RECORD_ID));
    // 為展示架構，這裡假設節點已註冊

    // 4. 啟動全域痊癒
    const result = await healer.applyHealing();

    return NextResponse.json({
      success: true,
      message: 'Global Healing executed.',
      data: result,
    });
  } catch (error: unknown) {
    console.error('[OmniAvatar API] Healing failed:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Unknown error occurred during global healing.',
      },
      { status: 500 }
    );
  }
}
