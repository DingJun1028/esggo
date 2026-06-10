import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import crypto from 'crypto';

// =========================================================================
// 1. 萬能元件心核 (IComponentCore) 規範 - 永恆刻印
// =========================================================================
interface IComponentCore {
  readonly uuid: string;         // 萬能永憶主體唯一識別碼
  readonly version: string;      // 語義化版本控制
  readonly timestamp: number;    // 刻印時間戳
  evidence: string;              // 證據佐證庫
}

const COMPONENT_CORE: IComponentCore = {
  uuid: "ee4af378-b9d7-412d-91d2-d50b98fa0715",
  version: "2.3.0-stable.5T",    // 升級至完全對稱與 QKP 治療共鳴版本
  timestamp: 1772421600000,      // 2026-06-01
  evidence: "ZKP_SEAL_GATEWAY_INTEGRATION_WITH_BROWSERBASE_AND_QKP_HEALING"
};

// =========================================================================
// 2. 數據契約與 Zod Schema 驗證 (Transparent 可透明)
// =========================================================================
const AuditEventTypeSchema = z.enum([
  'activation:chain:completed',
  'color:drop:issued',
  'color:drop:verified',
  'frn_loss:consensus',
  'system:flow:optimized',
  'qkp:healing:required',          // 無作妙德：QKP 治療需求事件
  'vault:seal:medical_zkp_ready'   // 無作妙德：醫學級零知識驗證完成事件
]);

const AuditRecordPayloadSchema = z.object({
  zkp_hash: z.string().optional(),
  nodes_involved: z.array(z.string()).default([]),
  metrics: z.record(z.any()).default({})
});

const OmniTableSyncPayloadSchema = z.object({
  tenant_id: z.string().min(1, "Tenant ID 不可為空"),
  event_type: AuditEventTypeSchema,
  payload: AuditRecordPayloadSchema,
  source_origin: z.string().min(1, "Source Origin 不可為空"), // Traceable 可溯源
  last_modified_by: z.string().default('Human_User')         // Trustworthy (防迴圈)
});

type OmniTableSyncPayload = z.infer<typeof OmniTableSyncPayloadSchema>;

// =========================================================================
// 3. 雙向防迴圈簽章、Browserbase 設定與內存資料庫配置
// =========================================================================
const BOT_SIGNATURE = 'BLUE_Automation_Bot';
const MOCK_JWT_SECRET = process.env.BLUE_CC_TOKEN;

// Browserbase 模擬配置 (對應 browse.sh 網路自動化技能)
const BROWSERBASE_CONFIG = {
  apiKey: process.env.BROWSERBASE_API_KEY || 'mock_browserbase_key_12345',
  projectId: process.env.BROWSERBASE_PROJECT_ID || 'project_esggo_automation',
  baseUrl: 'https://api.browserbase.com/v1'
};

// 模擬多租戶 Postgres 資料庫內存 AuditRecord 表狀態（已補齊 QKP 治療與醫學 ZKP 紀錄）
const mockDatabase: Array<{
  id: string;
  tenant_id: string;
  event_type: string;
  payload: any;
  source_origin: string;
  last_modified_by: string;
  timestamp: number;
}> = [
  {
    id: "3e4b2d1c-8e01-412d-90cf-1936984db6a1",
    tenant_id: "tenant-esg-taiwan",
    event_type: "activation:chain:completed",
    payload: {
      zkp_hash: "0x8fa0715e2d1d2d50b98fa071588c94cf",
      nodes_involved: ["GPU_NODE_01", "VECTOR_DB_03"],
      metrics: { execution_time_ms: 142, consensus_reached: true }
    },
    source_origin: "AITable_Record_9d87d49a",
    last_modified_by: "Human_User",
    timestamp: Date.now() - 3600000 * 3
  },
  {
    id: "7f4c9a8b-1b2c-3d4e-5f6a-7b8c9d0e1f2a",
    tenant_id: "tenant-esg-taiwan",
    event_type: "color:drop:issued",
    payload: {
      zkp_hash: "0x3eeb4039ad864d2c96569dbbc94cfb0a",
      nodes_involved: ["OMNIBLUE_CONTROL_PLANE"],
      metrics: { drop_amount: 500, target_wallet: "0x4fd1...c287" }
    },
    source_origin: "BLUE_CC_TASK-88921",
    last_modified_by: BOT_SIGNATURE,
    timestamp: Date.now() - 3600000 * 2
  },
  {
    id: "d4e5f6a7-8b9c-0d1e-2f3a-4b5c6d7e8f9a",
    tenant_id: "tenant-esg-taiwan",
    event_type: "qkp:healing:required",
    payload: {
      zkp_hash: "0x76ac3039ee3039ad864d2c81d8d0715e",
      nodes_involved: ["SPONTANEOUS_VIRTUE_VALIDATOR"],
      metrics: { healing_urgency: "HIGH", deviation_score: 0.14, requires_qkp_healing: true }
    },
    source_origin: "Agent_Bus_Flow_Monitor",
    last_modified_by: "Human_User",
    timestamp: Date.now() - 3600000 * 1.5 // 1.5小時前
  },
  {
    id: "e5f6a7b8-9c0d-1e2f-3a4b-5c6d7e8f9a0b",
    tenant_id: "tenant-esg-taiwan",
    event_type: "vault:seal:medical_zkp_ready",
    payload: {
      zkp_hash: "0x3eeb4039ad864d2c96569dbbc94cfb0b",
      nodes_involved: ["ZKP_SEAL_ENGINE_01", "MEDICAL_GRADE_ZKP_VALIDATOR"],
      metrics: { verification_level: "medical-grade", cert_authority: "MODA_TRUST" }
    },
    source_origin: "effortless-zkp-extension",
    last_modified_by: BOT_SIGNATURE,
    timestamp: Date.now() - 3600000 * 0.5 // 30分鐘前
  },
  {
    id: "a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d",
    tenant_id: "tenant-esg-global",
    event_type: "frn_loss:consensus",
    payload: {
      zkp_hash: "0x569dbbc94cfb0apat3eeb4039ad864d2c",
      nodes_involved: ["NODE_GLOBAL_01", "NODE_GLOBAL_02"],
      metrics: { consensus_rate: 0.999, entropy_loss: -14.2 }
    },
    source_origin: "Global_Bridge_Node_99",
    last_modified_by: "Human_User",
    timestamp: Date.now() - 3600000 * 1
  }
];

// 模擬資料庫查詢輔助
const mockDatabaseQuery = async (sql: string, params: any[]) => {
  console.log(`[Database SQL Execution]\nQUERY: ${sql}\nPARAMS:`, JSON.stringify(params, null, 2));
  
  if (sql.includes('INSERT INTO "AuditRecord"')) {
    const [tenant_id, event_type, payload, source_origin, last_modified_by, timestamp] = params;
    const newRecord = {
      id: crypto.randomUUID(),
      tenant_id,
      event_type,
      payload,
      source_origin,
      last_modified_by,
      timestamp
    };
    mockDatabase.push(newRecord);
    return { rows: [newRecord] };
  }
  
  if (sql.includes('SELECT * FROM "AuditRecord"')) {
    const [tenant_id] = params;
    const filtered = mockDatabase.filter(r => r.tenant_id === tenant_id);
    return { rows: filtered };
  }

  return { rows: [{ success: true }] };
};

// =========================================================================
// 4. ZKP Seal 零知識證明單向鏈式加密算法 (Trustworthy 不可篡改)
// =========================================================================
function generateZkpSeal(
  previousHash: string,
  data: any,
  source: string,
  timestamp: number
): string {
  const serializedData = JSON.stringify(data);
  const rawPayload = `${previousHash}||${serializedData}||${source}||${timestamp}`;
  
  if (!MOCK_JWT_SECRET) {
    throw new Error('Server misconfiguration: missing JWT secret');
  }

  return crypto
    .createHmac('sha256', MOCK_JWT_SECRET)
    .update(rawPayload)
    .digest('hex');
}

// =========================================================================
// 5. Browserbase (browse.sh) 網路自動化與技能調度器 (Agent Gateway)
// =========================================================================
async function runBrowserbaseEsggoAutomation(
  targetUrl: string,
  actionType: 'scrape_esg_report' | 'verify_carbon_credit'
): Promise<{ extractedData: any; screenshotUrl?: string; durationMs: number }> {
  console.log(`🌐 [Browserbase browse.sh] 啟動 AI 瀏覽代理任務: ${actionType} -> ${targetUrl}`);
  const startTime = Date.now();

  // 模擬 browserbase 爬取到的真實環境與社會責任數據
  let extractedData = {};
  if (actionType === 'scrape_esg_report') {
    extractedData = {
      compliance_status: "PASSED",
      scope_1_co2e_tons: 1420.5,
      scope_2_co2e_tons: 890.3,
      green_power_percentage: "42.8%",
      third_party_verified: true,
      verification_standard: "ISO-14064-1"
    };
  } else {
    extractedData = {
      credit_id: "VCS-2026-CC-9921",
      registry: "Verra",
      certified_vintage: "2025",
      is_double_counted: false,
      validation_score: 0.998
    };
  }

  const durationMs = Date.now() - startTime;
  return {
    extractedData,
    screenshotUrl: `https://api.browserbase.com/v1/screenshots/mock_${crypto.randomUUID().substring(0,8)}.png`,
    durationMs
  };
}

// =========================================================================
// 6. Next.js Route Handlers (GET / POST / PATCH)
// =========================================================================

/**
 * GET /api/omni-table
 * 支援多雲與多租戶 RLS 隔離的歷史拉取與實時 SSE 監控
 */
export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized: 缺少 Bearer 驗證權杖' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    
    // 依據 Token 模擬身份識別與 RLS 物理隔離
    let tenantIdFromToken = "tenant-esg-taiwan"; 
    if (token === 'global-jwt-token') {
      tenantIdFromToken = "tenant-esg-global";
    } else if (token === 'hacker-jwt-token') {
      console.error(`🚨 [RLS Blocking] 黑客憑證攔截成功，禁止存取任何審計數據。`);
      return NextResponse.json({ error: 'Forbidden: RLS 物理安全屏障拒絕存取' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const isStream = searchParams.get('stream') === 'true';

    // ==========================================
    // 實時 SSE 串流模式 (SSE & Event Replay 實體化)
    // ==========================================
    if (isStream) {
      const encoder = new TextEncoder();
      
      const stream = new ReadableStream({
        async start(controller) {
          const sendEvent = (event: string, data: any) => {
            controller.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`));
          };

          // 1. 建立連線，發送 RLS 激活信號
          sendEvent('connection:established', {
            tenant_id: tenantIdFromToken,
            status: 'RLS_ACTIVE',
            timestamp: Date.now()
          });

          // 2. 廣播歷史數據以進行狀態水合 (Hydration)
          const filtered = mockDatabase.filter(r => r.tenant_id === tenantIdFromToken);
          sendEvent('state:hydration', { records: filtered });

          // 模擬背景輪流產生的多樣化「無作妙德」實時日誌事件 (由優化、治療、醫學 ZKP 組成的循環)
          const simulatedEvents = [
            {
              event_type: 'system:flow:optimized' as const,
              metrics: { entropy_reduction_rate: -3.4, speed_multiplier: 1.2 },
              origin: "OmniBlue_Optimizer_Bot"
            },
            {
              event_type: 'qkp:healing:required' as const,
              metrics: { healing_urgency: "MEDIUM", deviation_score: 0.08, requires_qkp_healing: true },
              origin: "Spontaneous_Wondrous_Virtue_Validator"
            },
            {
              event_type: 'vault:seal:medical_zkp_ready' as const,
              metrics: { verification_level: "medical-grade", cert_authority: "MODA_TRUST" },
              origin: "Effortless_Zkp_Extension_Bot"
            },
            {
              event_type: 'color:drop:verified' as const,
              metrics: { validation_score: 1.0, is_consensus_safe: true },
              origin: "Zkp_Seal_Engine_01"
            }
          ];

          let cycleIndex = 0;
          const intervalId = setInterval(() => {
            const currentSim = simulatedEvents[cycleIndex % simulatedEvents.length];
            const simulatedEvent = {
              id: crypto.randomUUID(),
              tenant_id: tenantIdFromToken,
              event_type: currentSim.event_type,
              payload: {
                zkp_hash: generateZkpSeal("0xprev", currentSim.metrics, currentSim.origin, Date.now()),
                nodes_involved: ["GPU_NODE_HYBRID_02", "ZKP_SEAL_ENGINE_01"],
                metrics: currentSim.metrics
              },
              source_origin: currentSim.origin,
              last_modified_by: BOT_SIGNATURE,
              timestamp: Date.now()
            };
            sendEvent('color:drop:live', simulatedEvent);
            cycleIndex++;
          }, 8000);

          // 連線中斷時清除計時器
          req.signal.addEventListener('abort', () => {
            clearInterval(intervalId);
            controller.close();
            console.log(`🔌 [SSE Connection Closed] 租戶 ${tenantIdFromToken} 的實時監控連線已中斷。`);
          });
        }
      });

      return new Response(stream, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        }
      });
    }

    // ==========================================
    // 標準資料庫 RLS 拉取模式
    // ==========================================
    await mockDatabaseQuery(
      `SELECT set_config('request.jwt.claims', $1, true)`,
      [JSON.stringify({ tenant_id: tenantIdFromToken })]
    );

    const sql = `SELECT * FROM "AuditRecord" WHERE tenant_id = $1 ORDER BY timestamp ASC`;
    const dbResult = await mockDatabaseQuery(sql, [tenantIdFromToken]);

    return NextResponse.json({
      status: 'success',
      tenant_id: tenantIdFromToken,
      records: dbResult.rows,
      component_core: {
        uuid: COMPONENT_CORE.uuid,
        version: COMPONENT_CORE.version
      }
    }, { status: 200 });

  } catch (error) {
    console.error('❌ [GET Omni-Table Error]:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

/**
 * POST /api/omni-table
 * 支援數據同步、ZKP 封印，並可手動觸發時光重放 (Replay Action) 或 Browserbase 自動化技能 (Browserbase Action)
 */
export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized: 缺少 Bearer 驗證權杖' }, { status: 401 });
    }
    
    const token = authHeader.split(' ')[1];
    const isMockAuthorized = !!MOCK_JWT_SECRET && token === MOCK_JWT_SECRET;
    const tenantIdFromToken = "tenant-esg-taiwan";

    if (!isMockAuthorized) {
      return NextResponse.json({ error: 'Forbidden: 權杖失效或不具存取權限' }, { status: 403 });
    }

    const body = await req.json();

    // =========================================================================
    // 支援 Browserbase (browse.sh) 自動化技能觸發 (New Feature!)
    // =========================================================================
    if (body.action === 'browserbase_automation') {
      const { target_url, action_type } = body;
      if (!target_url || !action_type) {
        return NextResponse.json({ error: '缺少必要欄位 (target_url, action_type)' }, { status: 400 });
      }

      // 執行 Browserbase 頭端自動化網路技能
      const automationResult = await runBrowserbaseEsggoAutomation(target_url, action_type);

      // 生成此自動化結果的 ZKP Seal 加密鎖定
      const mockPreviousHash = "0x8fa0715e2d1d2d50b98fa071588c94cf";
      const timestamp = Date.now();
      const finalZkpHash = generateZkpSeal(
        mockPreviousHash,
        automationResult.extractedData,
        "Browserbase_browse_sh",
        timestamp
      );

      // 物理級寫入 AuditRecord 資料庫，受 RLS 政策保護
      await mockDatabaseQuery(
        `SELECT set_config('request.jwt.claims', $1, true)`,
        [JSON.stringify({ tenant_id: tenantIdFromToken })]
      );

      const sql = `
        INSERT INTO "AuditRecord" (tenant_id, event_type, payload, source_origin, last_modified_by, timestamp)
        VALUES ($1, $2, $3, $4, $5, $6)
      `;
      const params = [
        tenantIdFromToken,
        'color:drop:verified', // 經自動化驗證成功的事件
        { 
          zkp_hash: finalZkpHash, 
          nodes_involved: ["BROWSERBASE_BROWSE_SH", "ZKP_SEAL_ENGINE_01"],
          metrics: { 
            ...automationResult.extractedData, 
            automation_duration_ms: automationResult.durationMs,
            screenshot_proof: automationResult.screenshotUrl
          }
        },
        `Browserbase_Session_${crypto.randomUUID().substring(0,8)}`,
        BOT_SIGNATURE, // 機器人發起
        timestamp
      ];
      await mockDatabaseQuery(sql, params);

      return NextResponse.json({
        status: 'success',
        message: 'Browserbase 網路自動化任務執行完畢，數據已通過 ZKP 鏈式封印歸檔。',
        extracted_data: automationResult.extractedData,
        zkp_hash: finalZkpHash,
        screenshot_proof: automationResult.screenshotUrl,
        component_core: {
          uuid: COMPONENT_CORE.uuid,
          version: COMPONENT_CORE.version
        }
      }, { status: 201 });
    }

    // ==========================================
    // 支援時光重放 (Replay Engine Trigger)
    // ==========================================
    if (body.action === 'replay') {
      const speed = body.speed || 1;
      console.log(`🔄 [Replay Engine Action] 接收到重放請求。租戶: ${tenantIdFromToken}, 倍速: ${speed}x`);
      
      const history = mockDatabase
        .filter(r => r.tenant_id === tenantIdFromToken)
        .sort((a, b) => a.timestamp - b.timestamp);

      return NextResponse.json({
        status: 'success',
        action: 'replay:initiated',
        details: `已為租戶 [${tenantIdFromToken}] 裝載 ${history.length} 筆歷史審計日誌。準備執行時光倒流。`,
        records_to_replay: history
      }, { status: 200 });
    }

    // 1. Transparent (可透明): 驗證 Payload 格式
    const parseResult = OmniTableSyncPayloadSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { error: '數據契約驗證失敗', details: parseResult.error.format() },
        { status: 400 }
      );
    }

    const validData: OmniTableSyncPayload = parseResult.data;

    // 2. Trustworthy (不可篡改): 迴圈防禦閘門 (Infinite Loop Guard)
    if (validData.last_modified_by === BOT_SIGNATURE) {
      console.log(`🛡️ [Loop Guard Alert] 檢測到變更源自 ${BOT_SIGNATURE}。安全攔截雙向同步，截斷無窮迴圈。`);
      return NextResponse.json({
        status: 'ignored',
        message: '雙向同步保護機制：機器人自發事件已安全截斷，不進行重覆處理。'
      }, { status: 200 });
    }

    // 3. 跨租戶物理隔離核對 (RLS Enforcement on API Layer)
    if (validData.tenant_id !== tenantIdFromToken) {
      return NextResponse.json(
        { error: 'Forbidden: RLS 邊界違規，禁止跨租戶注入數據' },
        { status: 403 }
      );
    }

    // 4. ZKP Seal 零知識證明雜湊鏈封印
    const mockPreviousHash = "0x8fa0715e2d1d2d50b98fa071588c94cf";
    const timestamp = Date.now();
    const finalZkpHash = generateZkpSeal(
      mockPreviousHash,
      validData.payload.metrics,
      validData.source_origin,
      timestamp
    );

    // 5. 注入 Postgres RLS Session 上下文，強制喚醒底層 RLS 安全 Policy 
    const dbTransaction = async () => {
      await mockDatabaseQuery(
        `SELECT set_config('request.jwt.claims', $1, true)`,
        [JSON.stringify({ tenant_id: validData.tenant_id })]
      );

      const sql = `
        INSERT INTO "AuditRecord" (tenant_id, event_type, payload, source_origin, last_modified_by, timestamp)
        VALUES ($1, $2, $3, $4, $5, $6)
      `;
      const params = [
        validData.tenant_id,
        validData.event_type,
        { ...validData.payload, zkp_hash: finalZkpHash },
        validData.source_origin,
        validData.last_modified_by,
        timestamp
      ];
      await mockDatabaseQuery(sql, params);
    };

    await dbTransaction();

    const recordResponse = Object.freeze({
      id: crypto.randomUUID(),
      tenant_id: validData.tenant_id,
      event_type: validData.event_type,
      zkp_hash: finalZkpHash,
      source_origin: validData.source_origin,
      last_modified_by: BOT_SIGNATURE,
      timestamp,
      component_core: {
        uuid: COMPONENT_CORE.uuid,
        version: COMPONENT_CORE.version,
        timestamp: COMPONENT_CORE.timestamp,
        evidence: `ZKP_SEAL_HASH_LINKED: ${finalZkpHash.substring(0, 16)}...`
      }
    });

    return NextResponse.json({
      status: 'success',
      message: '神聖契約封印成功，已歸檔於 Postgres AuditRecord',
      record: recordResponse
    }, { status: 201 });

  } catch (error) {
    console.error('❌ [Omni-Table Gateway Error]:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', message: error instanceof Error ? error.message : '未知錯誤' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/omni-table
 * 模擬反向更新 (BLUE ➡️ AITable) 時對 AITable 進行數據回填的代理
 */
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { recordId, status, tenant_id } = body;

    if (!recordId || !status || !tenant_id) {
      return NextResponse.json({ error: '缺少必要欄位 (recordId, status, tenant_id)' }, { status: 400 });
    }

    console.log(`🔄 [AITable Backfill Triggered] 開始對 AITable record ${recordId} 進行狀態回填...`);

    const spaceId = process.env.OMNITABLE_SPACE_ID || 'space_default';
    const requestPayload = {
      records: [
        {
          recordId: recordId,
          fields: {
            Status: status,
            Last_Modified_By: BOT_SIGNATURE 
          }
        }
      ]
    };

    console.log(`📡 [Sending to AITable API]`, JSON.stringify(requestPayload, null, 2));

    return NextResponse.json({
      status: 'success',
      message: '狀態已攜帶 Bot 標籤強制回填至 AITable，迴圈制動防衛鎖已生效。',
      backfilled_record: recordId
    }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ error: '回填失敗', details: error instanceof Error ? error.message : '' }, { status: 500 });
  }
}