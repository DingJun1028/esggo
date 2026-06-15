'use client';

import React from 'react';
import { OmniBaseCard } from '@/components/ui/omni/OmniBaseCard';
import {
  Shield,
  Activity,
  Cpu,
  Eye,
  Globe,
  Database,
  Network,
  Zap,
  CheckCircle2,
  XCircle,
  Calendar,
  FileCode,
  Compass,
  Heart,
  Palette,
  Layers,
} from 'lucide-react';

interface MatrixNodeProps {
  id: string;
  name: string;
  description: string;
  fiveTStatus: [boolean, boolean, boolean, boolean, boolean]; // Traceable, Transparent, Tangible, Trustworthy, Trackable
  tags: string[];
  registered: boolean;
  deliverables: string[];
  businessLogic: string;
  uiux: string;
  customerJourney: string;
  painPointsSolved: string;
  updateDate: string;
}

const matrixData = [
  {
    category: '感知。UI 基礎 (Perception / Core UI)',
    icon: <Eye size={24} className="text-cyan-400" />,
    description: '液態玻璃介面與萬能組件庫，提供最高標準的美學與功能感知。',
    nodes: [
      {
        id: 'ui-001',
        name: 'OmniBaseCard',
        description: '提供液態玻璃與毛玻璃視覺基礎。',
        fiveTStatus: [true, false, true, false, false],
        tags: ['UI', 'Layout'],
        registered: true,
        deliverables: [
          'components/ui/omni/OmniBaseCard.tsx',
          'Tailwind Card Tokens',
          'Framer Motion Presets',
        ],
        businessLogic:
          '整合背景毛玻璃 backdrop-blur、邊框漸層與動態發光，作為全系統 UI 的基礎容器。',
        uiux: '支援微滑鼠懸停傾斜動態，具有 12 像素圓角與微發光背景。',
        customerJourney: '使用者與系統交互的視覺起點，貫穿整個瀏覽與操作過程。',
        painPointsSolved: '解決傳統硬邊扁平卡片缺乏深度與科技感的痛點。',
        updateDate: '2026-06-14',
      },
      {
        id: 'ui-002',
        name: 'OmniTable',
        description: '萬能數據表格，支援全維度狀態呈現。',
        fiveTStatus: [true, true, true, false, false],
        tags: ['UI', 'Data View'],
        registered: true,
        deliverables: [
          'components/ui/omni/OmniTable.tsx',
          'TypeScript Row Definitions',
          'Pagination Hook',
        ],
        businessLogic: '管理多維度數據集的分頁、欄位排序與行篩選，提供流暢的 CRUD 操作。',
        uiux: '交錯行斑馬紋、行懸停高亮、毛玻璃標頭與平滑載入骨架。',
        customerJourney: '大數據管理與稽核對帳旅程，為主管與稽核員提供清晰報表。',
        painPointsSolved: '解決數據擁擠、難以對齊以及渲染大數據時的卡頓問題。',
        updateDate: '2026-06-14',
      },
      {
        id: 'ui-003',
        name: 'OmniChart',
        description: '高度動態的數據視覺化引擎。',
        fiveTStatus: [true, true, true, false, false],
        tags: ['UI', 'Visualization'],
        registered: true,
        deliverables: ['components/ui/omni/OmniChart.tsx', 'Recharts Wrapper', 'Dynamic Tooltip'],
        businessLogic: '異步加載時序數據並轉換為折線圖、圓餅圖或雷達圖，支援動態指標切換。',
        uiux: '霓虹發光線條、漸層填充色與流暢的數值增長動畫。',
        customerJourney: '數據分析與永續決策旅程，提供視覺化的碳排與能耗趨勢。',
        painPointsSolved: '解決傳統靜態圖表死板、無法互動且高耗能渲染的痛點。',
        updateDate: '2026-06-14',
      },
      {
        id: 'ui-004',
        name: 'OmniCommandPalette',
        description: '全域命令輸入與快捷指令列。',
        fiveTStatus: [false, true, true, false, true],
        tags: ['UI', 'Command'],
        registered: true,
        deliverables: ['components/ui/omni/OmniCommandPalette.tsx', 'Keyboard Shortcuts Hook'],
        businessLogic: '監聽 Command/Ctrl + K，提供全域命令模糊檢索與快速切換路由。',
        uiux: '全螢幕毛玻璃背景遮罩、絲滑的下拉進場動畫、支援鍵盤上下鍵流暢操作。',
        customerJourney: '專業管理員與高級使用者的高效操作旅程，快速切換全站功能。',
        painPointsSolved: '解決選單層級過深、尋找功能繁瑣的極低效率操作問題。',
        updateDate: '2026-06-14',
      },
      {
        id: 'ui-005',
        name: 'OmniSearchBar',
        description: '全站統一的模糊搜尋與過濾元件。',
        fiveTStatus: [false, true, true, false, false],
        tags: ['UI', 'Search'],
        registered: true,
        deliverables: ['components/ui/omni/OmniSearchBar.tsx', 'Debounce Input Hook'],
        businessLogic: '輸入文字後進行防抖動 (Debounce) 處理，異步發送 API 檢索匹配的資源與頁面。',
        uiux: '內嵌動態搜尋圖示、自動聚焦、漸進式浮動建議選單。',
        customerJourney: '資訊查找與導航旅程，為所有訪客提供一鍵即達的搜尋體驗。',
        painPointsSolved: '解決搜尋回應遲鈍、輸入字詞拼寫錯誤時無反饋的冷冰冰體驗。',
        updateDate: '2026-06-14',
      },
      {
        id: 'ui-006',
        name: 'AiStyleSelector',
        description: 'AI 驅動的設計風格與主題切換器。',
        fiveTStatus: [false, true, true, false, false],
        tags: ['UI', 'Theme'],
        registered: true,
        deliverables: ['components/ui/omni/AiStyleSelector.tsx', 'Theme Store (Zustand)'],
        businessLogic:
          '調用 LLM 推薦或手動微調全站色彩與主題（包含毛玻璃飽和度、圓角與主色調），寫入本地緩存。',
        uiux: '絢麗的色彩環旋轉、流暢的毛玻璃不透明度滑桿、即時主題轉場效果。',
        customerJourney: '個性化設定旅程，滿足不同使用者對無障礙與美學風格的偏好。',
        painPointsSolved: '解決傳統主題切換單一死板、不支援細粒度視覺參數自訂的限制。',
        updateDate: '2026-06-14',
      },
      {
        id: 'ui-007',
        name: 'OmniCardsDemo',
        description: '卡片佈局與視覺動效的展示畫廊。',
        fiveTStatus: [false, false, true, false, false],
        tags: ['UI', 'Demo'],
        registered: false,
        deliverables: ['components/ui/omni/OmniCardsDemo.tsx'],
        businessLogic: '展示各式卡片動效與毛玻璃質感的靜態畫廊，不包含後端 API 連結。',
        uiux: '九宮格網格佈局、hover 傾斜、彩虹光圈流動邊框。',
        customerJourney: '開發者或美工審查旅程，用於評估 UI 設計系統的覆蓋率。',
        painPointsSolved: '解決開發者在重構卡片時，缺乏直觀視覺參照範例的問題。',
        updateDate: '2026-06-14',
      },
    ],
  },
  {
    category: '指揮。代理協作 (Command / Swarm Agents)',
    icon: <Cpu size={24} className="text-emerald-400" />,
    description: '多模態智能代理蜂群的調度中樞與協作介面。',
    nodes: [
      {
        id: 'cmd-001',
        name: 'OmniAgentCard',
        description: '單一代理的實體化封裝與能力展示。',
        fiveTStatus: [true, true, true, true, true],
        tags: ['Agent', 'UI'],
        registered: true,
        deliverables: ['components/omni/OmniAgentCard.tsx', 'Agent Capabilities API'],
        businessLogic: '呈現特定 AI 代理（如 Jules、Sentinel）的即時狀態、當前工作與認知負載。',
        uiux: '微縮狀態呼吸燈、脈衝圓環與順滑的摺疊展開面板。',
        customerJourney: 'AI 協同工作旅程，建立人機協作的直觀信任感。',
        painPointsSolved: '解決 AI 運作「黑箱化」，使用者不知道 AI 正在做什麼或是否當機的焦慮。',
        updateDate: '2026-06-14',
      },
      {
        id: 'cmd-002',
        name: 'OmniThinkingChain',
        description: '呈現代理連序思維推理的透明化過程。',
        fiveTStatus: [true, true, true, true, true],
        tags: ['Agent', 'Reasoning'],
        registered: true,
        deliverables: ['components/omni/OmniThinkingChain.tsx', 'Markdown Parser Widget'],
        businessLogic:
          '串接 Agent 的思維推理 API，將其思維鏈 (Thinking Chain) 實時渲染為步驟化的摺疊樹。',
        uiux: '打字機效果、步驟解鎖微動效、乾淨的虛線時間軸。',
        customerJourney: '異常診斷與深度決策期，提供使用者完整的決策依據。',
        painPointsSolved: '解決 AI 給予答案過於突兀、缺乏邏輯推演過程、難以被稽核的痛點。',
        updateDate: '2026-06-14',
      },
      {
        id: 'cmd-003',
        name: 'OmniLHubWidget',
        description: 'L-Hub 代理共識網路的即時監控小工具。',
        fiveTStatus: [true, true, true, true, false],
        tags: ['Agent', 'Consensus'],
        registered: true,
        deliverables: ['components/omni/OmniLHubWidget.tsx', 'Consensus Network SWR Hook'],
        businessLogic: '即時監控 L-Hub 代理網路的共識流動與任務委派權重，計算分散式算力。',
        uiux: '力導向節點環狀圖、高亮委派路徑、綠色動態流動虛線。',
        customerJourney: '高階技術監控期，為系統架構師提供 AI 蜂群狀態大圖。',
        painPointsSolved: '解決多代理協同混亂、算力分配不均與協同網路不可視的問題。',
        updateDate: '2026-06-14',
      },
      {
        id: 'cmd-004',
        name: 'OmniAgentPulse',
        description: '代理活動與心跳狀態的即時監測脈搏。',
        fiveTStatus: [true, true, true, false, true],
        tags: ['Agent', 'Monitor'],
        registered: true,
        deliverables: ['components/omni/OmniAgentPulse.tsx', 'Heartbeat WebSocket Link'],
        businessLogic:
          '通過 WebSocket 維持與代理核心的長連接，每秒監聽代理心跳，反映底層進程活躍度。',
        uiux: '心電圖波形動效、呼吸式光暈、異常斷線紅色閃爍。',
        customerJourney: '即時狀態監控旅程，給予管理員秒級的生命跡象回饋。',
        painPointsSolved: '解決傳統輪詢心跳造成伺服器過載且無法達到毫秒級即時感知的痛點。',
        updateDate: '2026-06-14',
      },
      {
        id: 'cmd-005',
        name: 'OmniAllianceHub',
        description: '多代理結盟與任務分配的協作樞紐。',
        fiveTStatus: [true, true, true, true, true],
        tags: ['Agent', 'Collaboration'],
        registered: false,
        deliverables: ['components/omni/OmniAllianceHub.tsx'],
        businessLogic:
          '多代理結盟決策與衝突仲裁邏輯，當多個代理對同一決策產生分歧時進行投票與共識仲裁。',
        uiux: '圓桌式頭像排列、投票進度條、動態光束聚焦中標者. (Orbit Layout).',
        customerJourney: '複雜決策制定與衝突解決期，確保多 Agent 任務流不會死鎖。',
        painPointsSolved: '解決多 AI 決策打架、互不相讓導致流程卡死甚至崩潰的困局。',
        updateDate: '2026-06-14',
      },
      {
        id: 'cmd-006',
        name: 'ThinkTankControl',
        description: '高級智庫代理的控制面板與參數設定。',
        fiveTStatus: [true, true, true, true, true],
        tags: ['Agent', 'Control'],
        registered: true,
        deliverables: ['components/omni/ThinkTankControl.tsx', 'Parameter Range Store'],
        businessLogic:
          '提供高級智庫 AI 運行的超參數手動微調控制，包括溫度 (Temperature)、最大 Token 與 TopP 等。',
        uiux: '精緻的旋鈕與滑桿、霓虹刻度線、即時參數變更波形圖。',
        customerJourney: '進階專家調參旅程，讓數據科學家精細調配 AI 創造力。',
        painPointsSolved: '解決傳統 AI 引導死板，不開放底層控制導致產出缺乏彈性的缺陷。',
        updateDate: '2026-06-14',
      },
      {
        id: 'cmd-007',
        name: 'SkillBookUI',
        description: '代理技能書與知識庫的視覺化介面。',
        fiveTStatus: [true, true, true, false, false],
        tags: ['Agent', 'Knowledge'],
        registered: true,
        deliverables: ['components/omni/SkillBookUI.tsx', 'Skill Library GraphQL API'],
        businessLogic:
          '檢視與熱插拔代理技能包，即時向 Agent 注入新的 PDF 說明書或 Python 運算模組。',
        uiux: '書架卡片滑動效果、技能解鎖發光特效、技能卡拖曳排序。',
        customerJourney: '能力擴充與自訂技能旅程，快速適應新業務場景。',
        painPointsSolved: '解決 AI 技能升級需要重啟、停機或重新部署代碼的極低效率困境。',
        updateDate: '2026-06-14',
      },
    ],
  },
  {
    category: '全知。防禦與安全 (Omniscience / Security & 5T)',
    icon: <Shield size={24} className="text-rose-400" />,
    description: '5T 協議合規性與 ZKP 零知識證明的守護陣列。',
    nodes: [
      {
        id: 'sec-001',
        name: 'ShieldOfAbsoluteTruth',
        description: '絕對真實的數據封印與防篡改徽章。',
        fiveTStatus: [true, true, true, true, true],
        tags: ['Security', '5T'],
        registered: true,
        deliverables: ['components/omni/ShieldOfAbsoluteTruth.tsx', 'Crypto Proof Engine'],
        businessLogic: '執行資料雜湊 SHA-256 運算並錨定至區塊鏈或數位封印，產生實時防篡改憑證。',
        uiux: '神聖護盾發光外環、Hash Lock 動態旋轉解鎖、不可篡改綠色密封章。',
        customerJourney: '數據存證與安全合規審查期，提供給第三方公證機構。',
        painPointsSolved: '解決 ESG 報告和歷史數據易 be 變更、缺乏驗證的疑慮。',
        updateDate: '2026-06-14',
      },
      {
        id: 'sec-002',
        name: 'OmniJulesPassiveGuard',
        description: 'Jules 萬能防禦因果協議。',
        fiveTStatus: [true, true, true, true, true],
        tags: ['Security', 'Jules'],
        registered: true,
        deliverables: ['components/omni/OmniJulesPassiveGuard.tsx', 'Sentry Proxy'],
        businessLogic:
          '實時監聽瀏覽器運行錯誤與未捕獲異常，自動調用 Jules 因果協定進行無感自我修復。',
        uiux: '偵測到錯誤時螢幕邊緣淡藍色波動、修復成功時彈出「Jules Healing Completed」微動效。',
        customerJourney: '全域防禦與系統健康維持旅程，極致保障高可用性。',
        painPointsSolved: '解決前端報錯導致畫面白屏死機、需要用戶刷新甚至重啟瀏覽器的差勁體驗。',
        updateDate: '2026-06-14',
      },
      {
        id: 'sec-003',
        name: 'OmniZKPBadge',
        description: '零知識證明 (ZKP) 狀態的視覺化驗證。',
        fiveTStatus: [true, true, true, true, true],
        tags: ['Security', 'ZKP'],
        registered: true,
        deliverables: ['components/omni/OmniZKPBadge.tsx', 'Snarkjs Verification Library'],
        businessLogic:
          '本地載入 ZK-SNARKs 證書，在不洩露具體數值的情況下驗證碳排或財務指標是否合規。',
        uiux: '神祕學幾何圖案展開、密碼學發光符號、ZKP 證明通過特效。',
        customerJourney: '隱私資料驗證與合規申報期，保護企業核心機密資料不外流。',
        painPointsSolved: '解決傳統合規審查需要全盤托出底層機密資料、導致企業商業祕密洩漏的兩難。',
        updateDate: '2026-06-14',
      },
      {
        id: 'sec-004',
        name: 'OmniDefenseDashboard',
        description: '全域安全防禦與異常活動的監控儀表板。',
        fiveTStatus: [true, true, true, true, true],
        tags: ['Security', 'Dashboard'],
        registered: true,
        deliverables: ['components/omni/OmniDefenseDashboard.tsx', 'IP Filter Admin API'],
        businessLogic:
          '匯整異常存取、暴力破解、越權注入等安全事件，支援一鍵封鎖惡意 IP 和自動限流。',
        uiux: '雷達掃描地圖、紅色警示波、動態折線圖記錄攻擊流量。',
        customerJourney: '安全營運與危機處理旅程，保障平台不受惡意網路攻擊侵害。',
        painPointsSolved: '解決安全事件分散、缺乏統一可視化儀表板、安全響應慢於攻擊的威脅。',
        updateDate: '2026-06-14',
      },
      {
        id: 'sec-005',
        name: 'OmniAuthOmni',
        description: '高階權限與身份驗證的控制模組。',
        fiveTStatus: [true, false, true, true, true],
        tags: ['Security', 'Auth'],
        registered: true,
        deliverables: ['components/omni/OmniAuthOmni.tsx', 'OAuth SSO Module'],
        businessLogic:
          '提供包含 MFA、指紋、硬體金鑰與無密碼登入的多功能驗證模組，實時生成 JWT 權限。',
        uiux: '安全金庫開門動畫、指紋掃描雷射光暈、流暢的二維碼漸顯。',
        customerJourney: '登入與權限提升旅程，全系統防衛的第一道防線。',
        painPointsSolved: '解決傳統密碼易被安全漏洞竊取、雙重驗證操作複雜、多設備同步卡頓的問題。',
        updateDate: '2026-06-14',
      },
      {
        id: 'sec-006',
        name: 'Protocol5TStrip',
        description: '5T 協議狀態的輕量化狀態橫幅。',
        fiveTStatus: [true, true, true, false, false],
        tags: ['Security', 'UI'],
        registered: true,
        deliverables: ['components/omni/Protocol5TStrip.tsx'],
        businessLogic: '即時計算當前頁面所有數據與元件的平均 5T 得分，展示於頂部或底部輕量化橫幅。',
        uiux: '極簡發光細條、五色合規進度點、鼠標移入展開 5T 雷達圖。',
        customerJourney: '全站合規性概覽，時時刻刻讓用戶感知 5T 治理力量。',
        painPointsSolved: '解決合規指標隱晦、缺乏實時回饋與具體數據指標缺乏透明感的疑慮。',
        updateDate: '2026-06-14',
      },
    ],
  },
  {
    category: '全域。數據與整合 (Global / Data & Integration)',
    icon: <Network size={24} className="text-indigo-400" />,
    description: '無縫橋接外部資料與內部矩陣的資料管線與 API 閘道。',
    nodes: [
      {
        id: 'dat-001',
        name: 'OmniAgentIntegrations',
        description: '各類第三方平台與 ERP 系統的串接管理。',
        fiveTStatus: [true, true, true, false, true],
        tags: ['Integration', 'API'],
        registered: true,
        deliverables: ['components/omni/OmniAgentIntegrations.tsx', 'Webhook Connector API'],
        businessLogic:
          '管理與 ERP、SCM 等外部系統的 Webhook 和 API 連接，具備數據清洗與格式對齊邏輯。',
        uiux: '插頭連接插座動效、數據包流動粒子動畫、連接狀態徽章。',
        customerJourney: '數據導入與多平台整合旅程，打通企業資訊孤島。',
        painPointsSolved: '解決外部 API 多樣混亂、缺乏統一整合配置介面、連線狀態不可控的麻煩。',
        updateDate: '2026-06-14',
      },
      {
        id: 'dat-002',
        name: 'DataVisualizer',
        description: '全局資料流與智能節點拓樸的可視化工具。',
        fiveTStatus: [true, true, true, false, false],
        tags: ['Data', 'Topology'],
        registered: true,
        deliverables: ['components/omni/DataVisualizer.tsx', 'SVG Node Link Graph'],
        businessLogic: '解析複雜的數據管線，動態計算節點深度並使用 SVG 渲染為易讀的流向圖。',
        uiux: '無極縮放與拖拽、流線漸層色、懸浮高亮完整關係鏈。',
        customerJourney: '數據溯源與脈絡分析旅程，深入剖析每一筆資料的來龍去脈。',
        painPointsSolved:
          '解決複雜數據依賴關係難以理解、數據血緣 (Data Lineage) 混亂不可考的難題。',
        updateDate: '2026-06-14',
      },
      {
        id: 'dat-003',
        name: 'VaultOmniTable',
        description: '高安全性資料金庫的專用檢視表。',
        fiveTStatus: [true, true, true, true, true],
        tags: ['Data', 'Vault'],
        registered: true,
        deliverables: ['components/omni/VaultOmniTable.tsx', 'Encrypted Columns DB API'],
        businessLogic:
          '串接安全資料金庫 (Vault)，欄位層級實時解密渲染，支援零洩漏模糊檢索與權限過濾。',
        uiux: '密碼字元漸次解碼、欄位發光鎖頭圖示、高安全性黑色毛玻璃底色。',
        customerJourney: '高機密數據編輯與審查旅程，符合最嚴格的資安標準。',
        painPointsSolved:
          '解決資料庫明文儲存易洩密、後台管理員越權查看用戶隱私資料的重大資安漏洞。',
        updateDate: '2026-06-14',
      },
      {
        id: 'dat-004',
        name: 'OmniAgentEvolutionPanel',
        description: 'OmniAgent 資料管線的演化與效能面板。',
        fiveTStatus: [true, true, true, false, true],
        tags: ['Data', 'Pipeline'],
        registered: false,
        deliverables: ['components/omni/OmniAgentEvolutionPanel.tsx'],
        businessLogic:
          'OmniAgent 智能數據管線的流量自適應與吞吐量優化面板，當檢測到高流量時自動擴容。',
        uiux: '動態齒輪轉動、波形負載圖、擴容進度環。',
        customerJourney: '系統效能監控與自動優化旅程，保證數據處理零延遲。',
        painPointsSolved: '解決高流量衝擊時管線阻塞、資料庫寫入超時與管線擴充繁瑣的手動操作。',
        updateDate: '2026-06-14',
      },
      {
        id: 'dat-005',
        name: 'ScraperControl',
        description: '網頁爬蟲與非結構化數據擷取控制器。',
        fiveTStatus: [true, true, true, false, true],
        tags: ['Data', 'Scraper'],
        registered: true,
        deliverables: ['components/omni/ScraperControl.tsx', 'WebSocket Scraper Worker'],
        businessLogic: '控制後端分散式無頭瀏覽器群，定時抓取政府碳排、環保署公告等非結構化數據。',
        uiux: '代碼爬行視窗、目標網站預覽卡片、即時擷取日誌。',
        customerJourney: '外部情報搜集與自動合規更新旅程，實現資訊實時同步。',
        painPointsSolved: '解決人工搜集政策繁瑣、容易遺漏漏報、法規更新滯後的問題。',
        updateDate: '2026-06-14',
      },
      {
        id: 'dat-006',
        name: 'OmniMatrixInput',
        description: '支援多維度數據輸入與矩陣映射的表單。',
        fiveTStatus: [true, true, true, false, true],
        tags: ['Data', 'Input'],
        registered: true,
        deliverables: ['components/omni/OmniMatrixInput.tsx', 'JSON Grid Form Parser'],
        businessLogic: '支援多維度陣列、動態 JSON 配置的複雜表單，將多變量映射至系統矩陣欄位。',
        uiux: '多維表格格線、動態欄位增減、儲存格聯動計算與防呆高亮。',
        customerJourney: '專業資料錄入與編輯旅程，支援大量自訂配置。',
        painPointsSolved: '解決複雜表格在一般表單中極難排列、欄位過多導致視窗捲動不便的痛點。',
        updateDate: '2026-06-14',
      },
      {
        id: 'dat-007',
        name: 'ApolloStudioConsole',
        description: 'Apollo GraphQL 整合與 API 測試終端。',
        fiveTStatus: [true, true, true, false, false],
        tags: ['Data', 'GraphQL'],
        registered: true,
        deliverables: ['components/omni/ApolloStudioConsole.tsx', 'GraphQL Sandboxed Client'],
        businessLogic:
          '內嵌 GraphQL 查詢編輯器，供開發者與高級稽核員在網頁上直接運行並調試合規資料。',
        uiux: '程式碼語法高亮、一鍵排版、左側結構樹檢索。',
        customerJourney: '開發與高級稽核旅程，快速檢核 API schema 合規。',
        painPointsSolved:
          '解決測試 API 需要安裝外部工具（如 Postman）、環境配置繁瑣、數據不可追蹤的難處。',
        updateDate: '2026-06-14',
      },
    ],
  },
  {
    category: '全息。永續與報告 (Hologram / Sustainability & Reports)',
    icon: <Globe size={24} className="text-amber-400" />,
    description: 'ESG 報告、指標計算與永續成果的全息投影層。',
    nodes: [
      {
        id: 'hol-001',
        name: 'OmniSustainWriteEditor',
        description: '高擬真、自動化生成的 ESG 報告編輯器。',
        fiveTStatus: [true, true, true, true, true],
        tags: ['Report', 'Editor'],
        registered: true,
        deliverables: ['components/omni/OmniSustainWriteEditor.tsx', 'SustainWrite Store'],
        businessLogic:
          '基於 Tiptap 核心的智能永續報告編輯器，支援與 AI Swarm 協同修改，即時計算 5T SHA-256。',
        uiux: '打字專專注模式、AI floating menu、右下角 glowing 5T shield badge。',
        customerJourney: 'ESG 報告主體編寫與修訂旅程，系統最核心的文字生產陣地。',
        painPointsSolved:
          '解決永續報告撰寫格式混亂、協同效率低下、內容難以與底層碳排數據即時對齊的難題。',
        updateDate: '2026-06-14',
      },
      {
        id: 'hol-002',
        name: 'OmniBookCaseRegistry',
        description: '16 維度組件註冊表與知識資產的展示櫃。',
        fiveTStatus: [true, true, true, true, true],
        tags: ['Registry', 'Knowledge'],
        registered: true,
        deliverables: ['components/omni/OmniBookCaseRegistry.tsx', '16D Assets Metadata API'],
        businessLogic:
          '16 維度組件治理資產的總展覽櫃，記錄全域所有設施的最新版本與健康度，一鍵檢視 metadata。',
        uiux: '仿實體書架 3D 懸浮傾斜、各書脊對應不同狀態顏色、順滑的抽書展開動畫。',
        customerJourney: '全域資產稽核與架構盤點旅程，為首席架構師展示系統合規完整性。',
        painPointsSolved:
          '解決系統組件散亂、版本衝突難以盤點、代碼資產缺乏統一視覺展示介面的空缺。',
        updateDate: '2026-06-14',
      },
      {
        id: 'hol-003',
        name: 'OmniKpiCard',
        description: '永續 KPI 的關鍵指標動態追蹤卡片。',
        fiveTStatus: [true, true, true, false, false],
        tags: ['Report', 'KPI'],
        registered: true,
        deliverables: ['components/omni/OmniKpiCard.tsx', 'KPI Threshold Evaluation Hook'],
        businessLogic:
          '即時追蹤企業碳排、能耗等永續關鍵績效指標，當數值逼近預警線時自動觸發通知與降解。',
        uiux: '環形進度條、數值滾動動畫、動態警告光暈與霓虹數字。',
        customerJourney: '每日數據監控與預警旅程，協助管理者牢牢掌控永續指標。',
        painPointsSolved: '解決 KPI 反應滯後、需要手動計算、指標超標時無法及時發出警報的困境。',
        updateDate: '2026-06-14',
      },
      {
        id: 'hol-004',
        name: 'OmniBlueDashboard',
        description: 'ESG 藍圖與長期減碳目標的全息儀表板。',
        fiveTStatus: [true, true, true, true, true],
        tags: ['Report', 'Dashboard'],
        registered: true,
        deliverables: ['components/omni/OmniBlueDashboard.tsx', 'Longterm Forecast API'],
        businessLogic: '整合長期減碳藍圖與大數據預測，展現企業未來 10 年的碳中和演化路徑。',
        uiux: '3D 地球自轉、時間軸滑桿動態演進、藍色霓虹科技感網格。',
        customerJourney: '企業長遠戰略規劃與外部公眾展示期，展現永續願景與承諾。',
        painPointsSolved:
          '解決長期願景缺乏技術依據、純文字描述缺乏說服力、數據無法模擬演進的痛點。',
        updateDate: '2026-06-14',
      },
      {
        id: 'hol-005',
        name: 'OmniEvidenceUploader',
        description: '支援 5T 封印的碳盤查證據上傳器。',
        fiveTStatus: [true, true, true, true, true],
        tags: ['Report', 'Evidence'],
        registered: true,
        deliverables: ['components/omni/OmniEvidenceUploader.tsx', 'IPFS/Cloud Storage API'],
        businessLogic:
          '將碳盤查發票、佐證合約、照片等上傳至安全雲倉，上傳完成後自動進行 5T 加密封印並產出 hash_lock。',
        uiux: '拖曳上傳發光區、上傳進度雷射掃描效果、封印成功時彈出金色印章微動效。',
        customerJourney: '證據搜集與稽核準備旅程，為審計提供最堅實的底層證明。',
        painPointsSolved:
          '解決佐證資料雜亂無章、容易丟失、且無法證明文件在上傳後未被動手腳的資安隱憂。',
        updateDate: '2026-06-14',
      },
      {
        id: 'hol-006',
        name: 'NoteSearch',
        description: '永續報告與知識庫的深度語義搜尋。',
        fiveTStatus: [true, true, true, false, false],
        tags: ['Report', 'Search'],
        registered: true,
        deliverables: ['components/omni/NoteSearch.tsx', 'Vector Search DB API'],
        businessLogic: '串接向量資料庫，支援對永續報告、歷史筆記與知識庫的自然語言模糊語意檢索。',
        uiux: '打字機模糊搜索提示、按語意相關度排序的發光條、即時高亮關鍵段落。',
        customerJourney: '知識檢索與深度自主研習旅程，快速解答法規疑難。',
        painPointsSolved:
          '解決傳統關鍵字搜索死板不靈活、同義詞找不到、文件內容龐大查找極耗時的缺點。',
        updateDate: '2026-06-14',
      },
    ],
  },
  {
    category: '原子。萬能 UI 基礎元件 (Atoms & Molecules / Omni Atoms)',
    icon: <Layers size={24} className="text-pink-400" />,
    description: '平台底層核心 UI 原子與分子元件，支撐上層所有高階設施。',
    nodes: [
      {
        id: 'atm-001',
        name: 'OmniButton',
        description: '統一按鈕、禁用、載入與觸控回饋。',
        fiveTStatus: [true, false, true, false, false],
        tags: ['Atom', 'Button'],
        registered: true,
        deliverables: ['components/ui/omni/OmniButton.tsx', 'Button Theme styles'],
        businessLogic:
          '封裝載入中 (loading) 與停用 (disabled) 狀態，提供統一的交互邊界限制與事件防抖 (Debounce)。',
        uiux: '提供 primary、secondary、ghost 與 danger 變體，具備流暢的微縮縮放與按壓陰影特效。',
        customerJourney: '貫穿所有頁面與表單，為用戶提交資料與觸發功能的主要入口。',
        painPointsSolved: '解決不同頁面按鈕行為不一、點擊重複提交、以及點擊反饋遲鈍的痛點。',
        updateDate: '2026-06-14',
      },
      {
        id: 'atm-002',
        name: 'OmniBadge',
        description: '狀態徽章、警示、成功、輪廓樣式。',
        fiveTStatus: [true, false, true, false, false],
        tags: ['Atom', 'Badge'],
        registered: true,
        deliverables: ['components/ui/omni/OmniBadge.tsx', 'Status Color Classes'],
        businessLogic:
          '依據傳入之狀態 (verified, draft, warning, error) 動態載入對應之 5T 合規與警示級別。',
        uiux: '微縮膠囊外觀、霓虹發光背景邊框、支援閃爍脈衝標記。',
        customerJourney: '數據稽核與概覽旅程，第一時間向使用者揭示特定數據的合規屬性。',
        painPointsSolved: '解決狀態指示不明顯、視覺噪音過大、以及缺乏標準化語意顏色的困擾。',
        updateDate: '2026-06-14',
      },
      {
        id: 'atm-003',
        name: 'OmniInput',
        description: '表單輸入、錯誤提示與一致性邊界。',
        fiveTStatus: [true, false, true, false, false],
        tags: ['Atom', 'Input'],
        registered: true,
        deliverables: ['components/ui/omni/OmniInput.tsx', 'Form Validator Hook'],
        businessLogic: '內嵌錯誤狀態判定與文字清空機制，與 React Hook Form 無縫整合。',
        uiux: '輸入框聚焦時邊框發光漸層、極簡毛玻璃不透明度。',
        customerJourney: '資料編輯與參數配置旅程，給予最精準的輸入格式防呆。',
        painPointsSolved: '解決傳統輸入框無輸入提示、無驗證錯誤樣式、以及樣式生硬不美觀的問題。',
        updateDate: '2026-06-14',
      },
      {
        id: 'atm-004',
        name: 'OmniTextarea',
        description: '多行文字輸入與報告欄位編輯。',
        fiveTStatus: [true, false, true, false, false],
        tags: ['Atom', 'Input'],
        registered: true,
        deliverables: ['components/ui/omni/OmniTextarea.tsx'],
        businessLogic: '支援自動增高 (Auto-grow)、字數限制與行數防溢出保護。',
        uiux: '平滑的滾動條、內凹陰影質感、柔和的聚焦外框。',
        customerJourney: '敘述性資料填寫與意見反饋旅程，提供流暢的段落輸入。',
        painPointsSolved: '解決多行輸入框在字數過多時，手動拉伸導致排版錯亂或內容被遮擋的麻煩。',
        updateDate: '2026-06-14',
      },
      {
        id: 'atm-005',
        name: 'OmniToggle',
        description: '布林開關與功能啟停。',
        fiveTStatus: [true, false, true, false, false],
        tags: ['Atom', 'Switch'],
        registered: true,
        deliverables: ['components/ui/omni/OmniToggle.tsx'],
        businessLogic: '維護開關切換的布林狀態，具備即時事件觸發與防連擊控制。',
        uiux: '絲滑的左右滑動彈性動畫、霓虹綠色開啟狀態、暗色關閉狀態。',
        customerJourney: '設定與控制面板旅程，用於一鍵啟用或禁用系統特定模組或警報。',
        painPointsSolved: '解決傳統開關切換生硬、無過渡動畫、以及點擊不靈敏的限制。',
        updateDate: '2026-06-14',
      },
      {
        id: 'atm-006',
        name: 'OmniModal',
        description: '通用對話框、表單與確認流程。',
        fiveTStatus: [true, false, true, false, false],
        tags: ['Atom', 'Modal'],
        registered: true,
        deliverables: ['components/ui/omni/OmniModal.tsx', 'Dialog Trigger hook'],
        businessLogic: '管理彈窗的銷毀與載入、攔截 Esc 與點擊外部關閉，支援焦點鎖定 (Focus Lock)。',
        uiux: '中心淡入放大彈性動畫、背景暗色毛玻璃遮罩、精緻的右上關閉按鈕。',
        customerJourney: '高風險操作確認或詳情檢視旅程，提供安全的對焦操作環境。',
        painPointsSolved: '解決彈窗載入時页面背景滾動穿透、按鍵導航失效、以及進出場生硬的痛點。',
        updateDate: '2026-06-14',
      },
      {
        id: 'atm-007',
        name: 'OmniProgress',
        description: '任務進度、上傳進度與流程狀態。',
        fiveTStatus: [true, false, true, false, false],
        tags: ['Atom', 'Progress'],
        registered: true,
        deliverables: ['components/ui/omni/OmniProgress.tsx'],
        businessLogic: '動態計算百分比，支援條狀與環狀進度，自適應緩動插值。',
        uiux: '漸層流光動畫、進度數值微彈動效。',
        customerJourney: '長耗時任務（如上傳證據、計算 ZKP 證書）時的視覺感知回饋旅程。',
        painPointsSolved: '解決後台運行耗時操作時，用戶不知道系統進度、以為網頁卡死的問題。',
        updateDate: '2026-06-14',
      },
      {
        id: 'atm-008',
        name: 'OmniStatusDot',
        description: '連線、存活與狀態燈號。',
        fiveTStatus: [true, false, true, false, false],
        tags: ['Atom', 'Indicator'],
        registered: true,
        deliverables: ['components/ui/omni/OmniStatusDot.tsx'],
        businessLogic:
          '監聽網路或 API 心跳，依據在線 (online)、離線 (offline) 與異常狀態動態流轉。',
        uiux: '擴散波紋動畫 (Pulse Ring)、微縮尺寸、高對比發光色。',
        customerJourney: '即時連線監控旅程，第一時間反映與後端或 AI 的狀態連結。',
        painPointsSolved: '解決系統斷線時無靜態反饋、缺乏微觀生命指徵監控的問題。',
        updateDate: '2026-06-14',
      },
      {
        id: 'atm-009',
        name: 'OmniForm',
        description: '表單容器、驗證與提交流程。',
        fiveTStatus: [true, true, true, false, false],
        tags: ['Molecule', 'Form'],
        registered: true,
        deliverables: ['components/ui/omni/OmniForm.tsx', 'Yup/Zod Validator Schema'],
        businessLogic: '封裝 Schema 驗證，攔截 Submit 事件，整合全域錯誤摘要與重置。',
        uiux: '網格化排版對齊、錯誤欄位自動捲動對焦、平滑的整頁骨架切換。',
        customerJourney: '資料申報與大批量登錄旅程，最大化減少表單填寫耗時。',
        painPointsSolved: '解決繁瑣表單欄位散亂、手動驗證代碼臃腫、提交錯誤難以定位的痛點。',
        updateDate: '2026-06-14',
      },
      {
        id: 'atm-010',
        name: 'OmniDB',
        description: '資料庫狀態、連線與資料脈絡展示。',
        fiveTStatus: [true, true, true, true, true],
        tags: ['Molecule', 'Database'],
        registered: false,
        deliverables: ['components/ui/omni/OmniDB.tsx'],
        businessLogic:
          '展示資料庫表結構、連線池 (Connection Pool) 佔用率與 PostgreSQL 唯讀複本狀態。',
        uiux: '3D 圓柱體堆疊結構、連線流動管線粒子、即時 SQL 執行延遲計時器。',
        customerJourney: '高級維護與數據稽核旅程，為系統管理員提供底層儲存診斷。',
        painPointsSolved:
          '解決資料庫連線卡死、慢查詢 (Slow Queries) 無法直觀察覺、底層狀態與前端隔絕的難題。',
        updateDate: '2026-06-14',
      },
    ],
  },
];

export function OmniUltimateMatrix() {
  const [selectedNode, setSelectedNode] = React.useState<MatrixNodeProps>(
    matrixData[0].nodes[0] as unknown as MatrixNodeProps
  );

  return (
    <div className="flex flex-col gap-10 w-full animate-in fade-in duration-700">
      <div className="relative mb-6">
        <h2 className="text-3xl font-black text-white tracking-wider flex items-center gap-3">
          <Zap size={32} className="text-cyan-400" />
          萬能元件。終極矩陣 (Omni Component Ultimate Matrix)
        </h2>
        <p className="text-slate-400 mt-3 font-medium max-w-3xl leading-relaxed">
          The 16-Dimensional Governance Architectural Matrix. 本矩陣映射了 ESGGO
          平台的「神親三位一體」架構，確保每一個「功能設施 (Facilities)」與「萬能元件 (Omni
          Components)」 皆符合 5T 協議 (Traceable, Transparent, Tangible, Trustworthy, Trackable)
          的至高標準，實現「無作妙德，圓通無礙」的運行境界。
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: The Category Grid (8 Cols) */}
        <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          {matrixData.map((category, idx) => (
            <OmniBaseCard
              key={idx}
              variant="glass"
              className="p-6 border-cyan-500/10 bg-gradient-to-br from-black/60 to-cyan-950/10 relative overflow-hidden h-full flex flex-col"
            >
              {/* Ambient Background Glow */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-cyan-500/5 blur-[60px] rounded-full pointer-events-none" />

              <div className="flex items-center gap-4 mb-6 relative z-10 border-b border-cyan-500/10 pb-4">
                <div className="p-3 bg-cyan-500/10 rounded-xl border border-cyan-500/30 shrink-0">
                  {category.icon}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white tracking-wide">
                    {category.category}
                  </h3>
                  <p className="text-xs text-cyan-400/70 mt-1">{category.description}</p>
                </div>
              </div>

              <div className="space-y-4 relative z-10 flex-1 overflow-y-auto pr-1 custom-scrollbar max-h-[350px]">
                {category.nodes.map((node) => {
                  const isCurrentSelected = selectedNode.id === node.id;
                  return (
                    <div
                      key={node.id}
                      onClick={() => setSelectedNode(node as unknown as MatrixNodeProps)}
                      className={`cursor-pointer rounded-xl p-4 transition-all duration-300 border mb-4 last:mb-0 ${
                        isCurrentSelected
                          ? 'bg-cyan-500/15 border-cyan-400/80 shadow-[0_0_15px_rgba(34,211,238,0.25)]'
                          : 'bg-slate-900/60 border-white/5 hover:border-cyan-500/30 hover:bg-slate-900/80'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4
                          className={`font-bold flex items-center gap-2 ${
                            isCurrentSelected ? 'text-white' : 'text-cyan-300'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              isCurrentSelected ? 'bg-white animate-ping' : 'bg-cyan-500'
                            }`}
                          ></span>
                          {node.name}
                        </h4>
                        <div className="flex gap-2">
                          {node.tags.map((tag) => (
                            <span
                              key={tag}
                              className="text-[9px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700 font-mono"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                        {node.description}
                      </p>

                      {/* 5T Protocol Status Strip */}
                      <div className="flex items-center gap-1 mt-3 pt-3 border-t border-white/5">
                        <span className="text-[9px] font-mono text-slate-500 mr-2">
                          5T Protocol:
                        </span>
                        {['Traceable', 'Transparent', 'Tangible', 'Trustworthy', 'Trackable'].map(
                          (t, i) => {
                            const isActive = node.fiveTStatus[i] as boolean;
                            return (
                              <div
                                key={t}
                                title={t}
                                className={`w-5 h-5 rounded flex items-center justify-center text-[9px] font-bold ${
                                  isActive
                                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                    : 'bg-slate-800 text-slate-600 border border-slate-700'
                                }`}
                              >
                                {t[0]}
                              </div>
                            );
                          }
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </OmniBaseCard>
          ))}
        </div>

        {/* Right Side: The Status & Design Matrix Detail Panel (4 Cols) */}
        <div className="lg:col-span-4 sticky top-8">
          <OmniBaseCard
            variant="glass"
            className="p-6 border-cyan-400/30 bg-gradient-to-b from-slate-950 to-cyan-950/30 relative overflow-hidden shadow-[0_0_25px_rgba(34,211,238,0.08)]"
          >
            {/* Gradient Top Line */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />

            {/* Pulse Indicator */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-5">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                </span>
                <span className="text-xs font-mono font-bold text-cyan-400/80">
                  NODE_DESCRIPTOR_ACTIVE
                </span>
              </div>
              <span className="text-xs font-mono text-slate-500">#{selectedNode.id}</span>
            </div>

            {/* Header Area */}
            <div className="mb-6">
              <h3 className="text-2xl font-black text-white tracking-wide flex items-center gap-2">
                {selectedNode.name}
              </h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed bg-slate-900/60 p-3 rounded-lg border border-white/5">
                {selectedNode.description}
              </p>
            </div>

            {/* Matrix Status Form/Table */}
            <div className="space-y-4">
              {/* 1. Registration Status (已註冊/未註冊) */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/50 border border-white/5">
                <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
                  <Layers size={14} className="text-cyan-400" /> 註冊狀態
                </span>
                {selectedNode.registered ? (
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
                    <CheckCircle2 size={12} /> 已註冊 (Registered)
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-500 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-full animate-pulse">
                    <XCircle size={12} /> 未註冊 (Pending)
                  </span>
                )}
              </div>

              {/* 2. Update Date */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/50 border border-white/5">
                <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
                  <Calendar size={14} className="text-cyan-400" /> 更新日期
                </span>
                <span className="text-xs font-mono text-cyan-300/80 font-semibold">
                  {selectedNode.updateDate}
                </span>
              </div>

              {/* 3. Deliverables */}
              <div className="p-3.5 rounded-xl bg-slate-900/50 border border-white/5 space-y-2">
                <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
                  <FileCode size={14} className="text-cyan-400" /> 交付項目 (Deliverables)
                </span>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {selectedNode.deliverables.map((d, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] font-mono px-2 py-1 rounded bg-slate-950 text-slate-300 border border-slate-800"
                    >
                      {d}
                    </span>
                  ))}
                </div>
              </div>

              {/* 4. Business Logic */}
              <div className="p-3.5 rounded-xl bg-slate-900/50 border border-white/5 space-y-1.5">
                <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
                  <Cpu size={14} className="text-cyan-400" /> 業務邏輯 (Business Logic)
                </span>
                <p className="text-xs text-slate-300/90 leading-relaxed font-medium">
                  {selectedNode.businessLogic}
                </p>
              </div>

              {/* 5. UIUX Description */}
              <div className="p-3.5 rounded-xl bg-slate-900/50 border border-white/5 space-y-1.5">
                <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
                  <Palette size={14} className="text-cyan-400" /> UIUX 設計描述
                </span>
                <p className="text-xs text-slate-300/90 leading-relaxed font-medium">
                  {selectedNode.uiux}
                </p>
              </div>

              {/* 6. Customer Journey */}
              <div className="p-3.5 rounded-xl bg-slate-900/50 border border-white/5 space-y-1.5">
                <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
                  <Compass size={14} className="text-cyan-400" /> 客戶旅程階段
                </span>
                <p className="text-xs text-slate-300/90 leading-relaxed font-medium">
                  {selectedNode.customerJourney}
                </p>
              </div>

              {/* 7. Pain Points Solved */}
              <div className="p-3.5 rounded-xl bg-slate-900/50 border border-white/5 space-y-1.5">
                <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
                  <Heart size={14} className="text-cyan-400" /> 痛點解決方案
                </span>
                <p className="text-xs text-emerald-400/90 leading-relaxed font-medium">
                  {selectedNode.painPointsSolved}
                </p>
              </div>
            </div>

            {/* Glowing Footer Bumper */}
            <div className="mt-6 pt-4 border-t border-white/10 flex justify-between items-center text-[10px] font-mono text-slate-500">
              <span>SYSTEM: ESGGO_CORE</span>
              <span className="text-cyan-500/80">VERIFIED_合規</span>
            </div>
          </OmniBaseCard>
        </div>
      </div>
    </div>
  );
}
