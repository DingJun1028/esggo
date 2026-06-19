import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const filePath = path.join(__dirname, 'src', 'adk', 'mcp', 'OmniMeceToolset.ts');
const content = fs.readFileSync(filePath, 'utf8');
const lines = content.split('\n');

const fixes = {
    4: " * [本質] 將 24 項 MECE 服務橋接至 MCP 工具適配層",
    87: "// ═══════ MECE Service Descriptors (24 items, key services exposed) ════════",
    155: "        description: '真相引擎：多源數據交叉驗證、幻覺檢測 (Cross-validate data from multiple sources)',",
    161: "        description: '風險評估引擎：ESG 風險識別、量化與預警 (Identify, quantify, and alert ESG risks)',",
    167: "        description: 'ESG 評分計算器：多維度環境/社會/治理評分 (Calculate multi-dimensional E/S/G scores)',",
    173: "        description: '演化引擎：組織永續成熟度評估 (Assess organization sustainability maturity evolution)',",
    179: "        description: '價值鏈分析：ESG 價值鏈分析、利害相關者映射 (Analyze ESG value chain)',",
    185: "        description: '時間同步錨定：區塊鏈時間戳、不可篡改證據鏈 (Blockchain timestamp & immutable evidence chain)',",
    199: "        description: '🔑 OmniKey: Unlock the System Evolution Cycle (Awaken -> Analyze -> Execute).',",
    213: "        description: '🌱 Nourish: Inject knowledge to grow a cultivation target (Agent, Asset, or Chapter).',",
    228: "        description: '✂️ Prune: Stabilize logic and reduce entropy of a cultivation target.',",
    255: "        description: '🏗️ Assemble: Start or continue building a sovereign structure or service.',",
    284: "        description: '🏛️ Finalize: Deploy and manifest a construction site as a Sovereign Asset.',",
    297: "        description: '🧬 Synthesize: Connect disparate knowledge domains to increase cognitive depth.',",
    352: "        description: '⚖️ Stabilize: Perform a global consistency check on the Knowledge Base.',",
    402: "        description: '💎 Collect: Harvest a sentient asset into the user portfolio.',",
    430: "        description: '🔮 Consult: Seek wisdom resolution and universal guidance (OmniChing).',",
    471: "        description: '💡 OmniConcept: Define a new Abstract Idea / Schema.',",
    485: "        description: '🔮 OmniOrb: Tap into the Global Event Bus / Universal Interface.',",
    498: `        description: '🧭 OmniClue: Get a "Next Step" hint (Performance Guidance).',`,
    511: "        description: '👥 OmniCrew: Dispatch a task to the Agentic Workforce (Autonomous Action).',",
    525: "        description: '🏰 OmniCastle: Fortify System Structure or Validate Integrity.',",
    538: "        description: '📂 OmniCase: Open a Sovereign Container (Project/Context).',",
    578: "        description: '🎨 OmniCanvas: Render a Sovereign Workshop/Surface (Creative).',",
    604: "        description: '📖 OmniClass: Start a Sovereign Session (Unit/Interaction).',",
    645: "        description: '🌟 OmniCreation: Spark a Sovereign Creation (Factory/Studio).',",
    674: "        description: '📇 OmniContact: Register a new identity.',",
    710: "        description: '⚖️ OmniConvince: Propose a Decision for Consensus (Governance).',",
    738: "        description: '⚔️ OmniConflict: Report a System/Data Conflict (Governance).',",
    780: "        description: '🔄 OmniCoordinator: Coordinate tasks across multiple participants.',",
    794: "        description: '⚙️ OmniConfig: Set a Sovereign configuration parameter.',",
    808: "        description: '📜 OmniConstitution: Verify system status against the Sovereign Decree.',",
    818: "        description: '📦 OmniCompress: Compress system state into a portable .omni format.',",
    831: "        description: '🧩 OmniComponent: Assemble a Sovereign Block (Part/Module).',",
    845: "        description: '👘 OmniCostume: Wear a Sovereign Attire/Skin.',",
    859: "        description: '🎛️ OmniCustom: Adapt Sovereign Settings/Customization.',",
    873: "        description: '💻 OmniChip: Process/Compute Sovereign Logic.',",
    887: "        description: '💬 OmniChat: Initiate a Sovereign Dialogue (Cognitive).',",
    916: "        description: '📇 OmniContact: Register a Sovereign Identity.',",
    931: "        description: '🌐 OmniCommunity: Sovereign Usage of Group/Society.',",
    945: "        description: '🎲 OmniChance: Sovereign Usage of Probability/Luck.',",
    957: "        description: '☁️ OmniCloud: Sovereign Usage of Cloud/Network.',",
    971: "        description: '⛰️ OmniClimax: Reach a Milestone Peak (Excellence).',",
    999: "        description: '🎵 OmniChant: Sovereign Usage of Mantra/Vibration.',",
    1013: "        description: '🗣️ OmniConversation: Sovereign Usage of Dialogue.',",
    1055: "        description: '🏷️ OmniCategory: Classify a Sovereign Item (Cognitive).',",
    1069: "        description: '💓 OmniCenter: Pulse/Align Sovereign Hub (Heart/Core).',",
    1083: "        description: '📸 OmniCapture: Snap/Record Sovereign Input (Sensor/Eye).',",
    1111: "        description: '💰 OmniCost: Measure/Record Sovereign Value (Expense/Ledger).',",
    1140: "        description: '🗄️ OmniCloset: Access Sovereign Storage (Wardrobe/Cache).',",
    1195: "        description: '🏗️ OmniBase: Deploy/Anchor/Check Sovereign Foundation.',",
    1208: "        description: '⚡ OmniCommander: Issue a Strategic Directive (Agency).',",
    1221: "// ═══════ Service Executor Interface ══════════════════════════════════════",
    1226: "// ═══════ Default Service Executor ════════════════════════════════════════",
    1754: "// ═══════ OmniMeceToolset ═════════════════════════════════════════════════",
    1778: "    // ═══════ Private: Create Registration ═════════════════════════════════",
    1786: "                query: { type: 'string', description: '查詢參數 (query parameter)' },",
    1787: "                data: { type: 'object', description: '附加資料 (additional data)' },",
    1825: "// ═══════ Singleton Export ═════════════════════════════════════════════════",
};

let fixCount = 0;
for (const [lineNum, fixedText] of Object.entries(fixes)) {
    const idx = parseInt(lineNum) - 1;
    if (idx < lines.length) {
        lines[idx] = fixedText;
        fixCount++;
    }
}

fs.writeFileSync(filePath, lines.join('\n'), 'utf8');
console.log(`✅ Fixed ${fixCount} garbled lines in OmniMeceToolset.ts`);
