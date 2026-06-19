# Fix garbled/mojibake text in OmniMeceToolset.ts
# Strategy: Read as raw bytes, decode, replace garbled lines with correct text

$filePath = "C:\Project\esgss_junaikey_beta\src\adk\mcp\OmniMeceToolset.ts"
$content = [System.IO.File]::ReadAllText($filePath, [System.Text.Encoding]::UTF8)

# === Line 4: File header comment ===
$content = $content -replace '\?\xACE8B3AA\].*?適\xAC層', '[本質] 將 24 項 MECE 服務橋接至 MCP 工具適配層'

# Much simpler approach: replace the garbled byte sequences directly
# The pattern is: literal '?' + garbage byte(s) + sometimes valid Chinese chars
# Let me do line-by-line replacement with known correct values.

$lines = $content -split "`n"

# Map: line_number (0-indexed) => correct replacement text
$fixes = @{}

# L4 - header
$fixes[3] = " * [本質] 將 24 項 MECE 服務橋接至 MCP 工具適配層"

# L87 - section divider
$fixes[86] = "// ═══════ MECE Service Descriptors (24 items, key services exposed) ════════"

# L155 - TruthEngine
$fixes[154] = "        description: '真相引擎：多源數據交叉驗證、幻覺檢測 (Cross-validate data from multiple sources)',"

# L161 - RiskAssessor
$fixes[160] = "        description: '風險評估引擎：ESG 風險識別、量化與預警 (Identify, quantify, and alert ESG risks)',"

# L167 - ScoreCalculator
$fixes[166] = "        description: 'ESG 評分計算器：多維度環境/社會/治理評分 (Calculate multi-dimensional E/S/G scores)',"

# L173 - EvolutionEngine
$fixes[172] = "        description: '演化引擎：組織永續成熟度評估 (Assess organization sustainability maturity evolution)',"

# L179 - ValueDistribution
$fixes[178] = "        description: '價值鏈分析：ESG 價值鏈分析、利害相關者映射 (Analyze ESG value chain)',"

# L185 - TimeSync
$fixes[184] = "        description: '時間同步錨定：區塊鏈時間戳、不可篡改證據鏈 (Blockchain timestamp & immutable evidence chain)',"

# L199 - OmniKey
$fixes[198] = "        description: '🔑 OmniKey: Unlock the System Evolution Cycle (Awaken -> Analyze -> Execute).',"

# L213 - Nourish
$fixes[212] = "        description: '🌱 Nourish: Inject knowledge to grow a cultivation target (Agent, Asset, or Chapter).',"

# L228 - Prune
$fixes[227] = "        description: '✂️ Prune: Stabilize logic and reduce entropy of a cultivation target.',"

# L255 - Assemble
$fixes[254] = "        description: '🏗️ Assemble: Start or continue building a sovereign structure or service.',"

# L284 - Finalize
$fixes[283] = "        description: '🏛️ Finalize: Deploy and manifest a construction site as a Sovereign Asset.',"

# L297 - Synthesize
$fixes[296] = "        description: '🧬 Synthesize: Connect disparate knowledge domains to increase cognitive depth.',"

# L352 - Stabilize
$fixes[351] = "        description: '⚖️ Stabilize: Perform a global consistency check on the Knowledge Base.',"

# L402 - Collect
$fixes[401] = "        description: '💎 Collect: Harvest a sentient asset into the user portfolio.',"

# L430 - Consult
$fixes[429] = "        description: '🔮 Consult: Seek wisdom resolution and universal guidance (OmniChing).',"

# L471 - OmniConcept
$fixes[470] = "        description: '💡 OmniConcept: Define a new Abstract Idea / Schema.',"

# L485 - OmniOrb
$fixes[484] = "        description: '🔮 OmniOrb: Tap into the Global Event Bus / Universal Interface.',"

# L498 - OmniClue
$fixes[497] = "        description: '🧭 OmniClue: Get a ""Next Step"" hint (Performance Guidance).',"

# L511 - OmniCrew
$fixes[510] = "        description: '👥 OmniCrew: Dispatch a task to the Agentic Workforce (Autonomous Action).',"

# L525 - OmniCastle
$fixes[524] = "        description: '🏰 OmniCastle: Fortify System Structure or Validate Integrity.',"

# L538 - OmniCase
$fixes[537] = "        description: '📂 OmniCase: Open a Sovereign Container (Project/Context).',"

# L578 - OmniCanvas
$fixes[577] = "        description: '🎨 OmniCanvas: Render a Sovereign Workshop/Surface (Creative).',"

# L604 - OmniClass
$fixes[603] = "        description: '📖 OmniClass: Start a Sovereign Session (Unit/Interaction).',"

# L645 - OmniCreation
$fixes[644] = "        description: '🌟 OmniCreation: Spark a Sovereign Creation (Factory/Studio).',"

# L674 - OmniContact
$fixes[673] = "        description: '📇 OmniContact: Register a new identity.',"

# L710 - OmniConvince
$fixes[709] = "        description: '⚖️ OmniConvince: Propose a Decision for Consensus (Governance).',"

# L738 - OmniConflict
$fixes[737] = "        description: '⚔️ OmniConflict: Report a System/Data Conflict (Governance).',"

# L780 - OmniCoordinator
$fixes[779] = "        description: '🔄 OmniCoordinator: Coordinate tasks across multiple participants.',"

# L794 - OmniConfig
$fixes[793] = "        description: '⚙️ OmniConfig: Set a Sovereign configuration parameter.',"

# L808 - OmniConstitution
$fixes[807] = "        description: '📜 OmniConstitution: Verify system status against the Sovereign Decree.',"

# L818 - OmniCompress
$fixes[817] = "        description: '📦 OmniCompress: Compress system state into a portable .omni format.',"

# L831 - OmniComponent
$fixes[830] = "        description: '🧩 OmniComponent: Assemble a Sovereign Block (Part/Module).',"

# L845 - OmniCostume
$fixes[844] = "        description: '👘 OmniCostume: Wear a Sovereign Attire/Skin.',"

# L859 - OmniCustom
$fixes[858] = "        description: '🎛️ OmniCustom: Adapt Sovereign Settings/Customization.',"

# L873 - OmniChip
$fixes[872] = "        description: '💻 OmniChip: Process/Compute Sovereign Logic.',"

# L887 - OmniChat
$fixes[886] = "        description: '💬 OmniChat: Initiate a Sovereign Dialogue (Cognitive).',"

# L916 - OmniContact (duplicate)
$fixes[915] = "        description: '📇 OmniContact: Register a Sovereign Identity.',"

# L931 - OmniCommunity
$fixes[930] = "        description: '🌐 OmniCommunity: Sovereign Usage of Group/Society.',"

# L945 - OmniChance
$fixes[944] = "        description: '🎲 OmniChance: Sovereign Usage of Probability/Luck.',"

# L957 - OmniCloud
$fixes[956] = "        description: '☁️ OmniCloud: Sovereign Usage of Cloud/Network.',"

# L971 - OmniClimax
$fixes[970] = "        description: '⛰️ OmniClimax: Reach a Milestone Peak (Excellence).',"

# L999 - OmniChant
$fixes[998] = "        description: '🎵 OmniChant: Sovereign Usage of Mantra/Vibration.',"

# L1013 - OmniConversation
$fixes[1012] = "        description: '🗣️ OmniConversation: Sovereign Usage of Dialogue.',"

# L1055 - OmniCategory
$fixes[1054] = "        description: '🏷️ OmniCategory: Classify a Sovereign Item (Cognitive).',"

# L1069 - OmniCenter
$fixes[1068] = "        description: '💓 OmniCenter: Pulse/Align Sovereign Hub (Heart/Core).',"

# L1083 - OmniCapture
$fixes[1082] = "        description: '📸 OmniCapture: Snap/Record Sovereign Input (Sensor/Eye).',"

# L1111 - OmniCost
$fixes[1110] = "        description: '💰 OmniCost: Measure/Record Sovereign Value (Expense/Ledger).',"

# L1140 - OmniCloset
$fixes[1139] = "        description: '🗄️ OmniCloset: Access Sovereign Storage (Wardrobe/Cache).',"

# L1195 - OmniBase
$fixes[1194] = "        description: '🏗️ OmniBase: Deploy/Anchor/Check Sovereign Foundation.',"

# L1208 - OmniCommander
$fixes[1207] = "        description: '⚡ OmniCommander: Issue a Strategic Directive (Agency).',"

# L1221 - Section divider
$fixes[1220] = "// ═══════ Service Executor Interface ═══════════════════════════════════"

# L1226 - Section divider
$fixes[1225] = "// ═══════ Default Service Executor ════════════════════════════════════"

# L1754 - Section divider
$fixes[1753] = "// ═══════ OmniMeceToolset ══════════════════════════════════════════════"

# L1778 - Private comment
$fixes[1777] = "    // ═══════ Private: Create Registration ═════════════════════════════"

# L1786 - query parameter
$fixes[1785] = "                query: { type: 'string', description: '查詢參數 (query parameter)' },"

# L1787 - additional data
$fixes[1786] = "                data: { type: 'object', description: '附加資料 (additional data)' },"

# L1825 - Singleton Export divider
$fixes[1824] = "// ═══════ Singleton Export ══════════════════════════════════════════════"

# Apply fixes
$fixCount = 0
foreach ($key in $fixes.Keys) {
    if ($key -lt $lines.Count) {
        $lines[$key] = $fixes[$key]
        $fixCount++
    }
}

# Rejoin and write
$result = $lines -join "`n"
[System.IO.File]::WriteAllText($filePath, $result, (New-Object System.Text.UTF8Encoding($false)))

Write-Host "Fixed $fixCount lines in OmniMeceToolset.ts"
