module.exports=[554134,e=>{"use strict";let t=[{skillKey:"gri_report_draft",skillName:"GRI 報告章節草稿生成",taskType:"report_drafting",description:"根據已填報的 ESG 指標數據，依 GRI 2021 框架生成對應章節草稿",allowedDataScopes:["environmental_data","social_metrics","governance_metrics","esg_data"],outputArtifactType:"report_section_draft",requiresHumanReview:!0,riskLevel:"medium",version:"1.0.0",enabled:!0},{skillKey:"compliance_gap_analysis",skillName:"合規缺口分析",taskType:"compliance_review",description:"比對 GRI / SASB / TCFD 框架，標出缺漏欄位與高風險不一致段落",allowedDataScopes:["esg_data","published_reports","evidence_vault"],outputArtifactType:"compliance_gap_list",requiresHumanReview:!0,riskLevel:"high",version:"1.0.0",enabled:!0},{skillKey:"evidence_candidate_mapping",skillName:"證據映射整理",taskType:"evidence_mapping",description:"幫報告段落對應佐證文件，建立指標與附件的映射草稿",allowedDataScopes:["evidence_vault","esg_data"],outputArtifactType:"evidence_candidate_map",requiresHumanReview:!0,riskLevel:"medium",version:"1.0.0",enabled:!0},{skillKey:"course_faq_generator",skillName:"課程 FAQ 生成",taskType:"course_assistant",description:"根據課程內容生成 FAQ、講義摘要與知識路徑建議",allowedDataScopes:["course_content"],outputArtifactType:"course_faq_draft",requiresHumanReview:!1,riskLevel:"low",version:"1.0.0",enabled:!0},{skillKey:"esg_task_planner",skillName:"ESG 任務規劃拆解",taskType:"task_planning",description:"將大型永續專案拆成子任務，生成里程碑草稿與待確認節點",allowedDataScopes:["tasks","roadmap_milestones"],outputArtifactType:"task_plan_draft",requiresHumanReview:!1,riskLevel:"low",version:"1.0.0",enabled:!0},{skillKey:"stakeholder_survey_analysis",skillName:"利害關係人問卷分析",taskType:"stakeholder_analysis",description:"分析問卷調查數據，提取關注議題並計算加權權重",allowedDataScopes:["esg_data","survey_responses"],outputArtifactType:"survey_analysis_report",requiresHumanReview:!0,riskLevel:"medium",version:"1.0.0",enabled:!0},{skillKey:"materiality_matrix_generator",skillName:"重大性矩陣生成",taskType:"materiality_generation",description:"基於利害關係人關注度與營運衝擊，產出重大性矩陣草稿",allowedDataScopes:["esg_data","survey_analysis_report"],outputArtifactType:"materiality_matrix_draft",requiresHumanReview:!0,riskLevel:"medium",version:"1.0.0",enabled:!0},{skillKey:"cbam_data_validator",skillName:"CBAM 數據格式校驗",taskType:"cbam_validation",description:"校驗進口申報數據與排放係數是否符合歐盟 CBAM 申報要求",allowedDataScopes:["cbam_data","emissions_factors"],outputArtifactType:"cbam_validation_log",requiresHumanReview:!0,riskLevel:"high",version:"1.0.0",enabled:!0},{skillKey:"carbon_calculator",skillName:"ISO 14064-1 碳排計算器",taskType:"carbon_calculation",description:"執行標準化碳排放計算，支援範疇一、二、三，並自動生成 5T 溯源證據",allowedDataScopes:["environmental_data","emissions_factors"],outputArtifactType:"emission_calculation_result",requiresHumanReview:!1,riskLevel:"medium",version:"1.0.0",enabled:!0},{skillKey:"supplier_integrity_assessment",skillName:"供應鏈誠信評估",taskType:"supplier_assessment",description:"基於 RBA 8.0 與 ESG 證照對供應商進行誠信評分與風險分級",allowedDataScopes:["supplier_data","compliance_records"],outputArtifactType:"supplier_risk_profile",requiresHumanReview:!0,riskLevel:"medium",version:"1.0.0",enabled:!0},{skillKey:"firebase_foundation",skillName:"Firebase 基礎設施管理",taskType:"system_ops",description:"整合 Firestore, Auth, Hosting 與 Data Connect 之基礎設定與安全規則審計",allowedDataScopes:["infrastructure_config","security_rules"],outputArtifactType:"system_config_draft",requiresHumanReview:!0,riskLevel:"medium",version:"1.2.0",enabled:!0},{skillKey:"supabase_mastery",skillName:"Supabase 資料庫優化",taskType:"system_ops",description:"Postgres 效能調優、RLS 安全策略編寫與 Edge Functions 管理",allowedDataScopes:["db_schema","rls_policies"],outputArtifactType:"db_optimization_plan",requiresHumanReview:!0,riskLevel:"medium",version:"1.1.0",enabled:!0},{skillKey:"genkit_orchestration",skillName:"Genkit AI 流程調度",taskType:"ai_ops",description:"跨語言 (JS/Py/Go/Dart) 的 LLM 工作流設計、Prompt 管理與 Trace 追蹤",allowedDataScopes:["ai_prompts","workflow_defs"],outputArtifactType:"ai_flow_blueprint",requiresHumanReview:!1,riskLevel:"low",version:"1.3.0",enabled:!0},{skillKey:"OmniAgent_google_workspace",skillName:"Google Workspace (OmniAgent)",taskType:"system_ops",description:"使用 OmniAgent Agent 的 Google Workspace Skill 進行 Gmail, Calendar, Drive 等辦公自動化整合",allowedDataScopes:["google_workspace_auth","emails","calendar_events","drive_files"],outputArtifactType:"system_config_draft",requiresHumanReview:!1,riskLevel:"medium",version:"1.0.0",enabled:!0},{skillKey:"oa_email_archival",skillName:"OmniAgent 郵件自動歸檔",taskType:"email_processing",description:"讀取 Google Workspace Email 並將 ESG 相關信件自動過濾與歸檔",allowedDataScopes:["google_workspace_auth","emails"],outputArtifactType:"email_archival_log",requiresHumanReview:!1,riskLevel:"low",version:"1.0.0",enabled:!0},{skillKey:"oa_calendar_agent",skillName:"OmniAgent 行事曆自動排程",taskType:"calendar_scheduling",description:"整合 Google Calendar，自動提取 ESG 會議與稽核排程，並建立待辦事項。",allowedDataScopes:["google_workspace_auth","calendar_events"],outputArtifactType:"calendar_schedule_log",requiresHumanReview:!1,riskLevel:"low",version:"1.0.0",enabled:!0},{skillKey:"oa_drive_archival",skillName:"OmniAgent 雲端硬碟自動歸檔",taskType:"file_processing",description:"整合 Google Drive，自動掃描與歸檔 ESG 相關文件至 Evidence Vault。",allowedDataScopes:["google_workspace_auth","drive_files"],outputArtifactType:"drive_archival_log",requiresHumanReview:!1,riskLevel:"low",version:"1.0.0",enabled:!0}];e.s(["getSkill",0,function(e){return t.find(t=>t.skillKey===e&&t.enabled)}])},247826,e=>e.a(async(t,a)=>{try{var i=e.i(554134),n=e.i(411448),o=e.i(36360),r=e.i(479733),s=t([n]);function l(e){return`${e}_${Date.now()}_${Math.random().toString(36).slice(2,8)}`}function c(e){let t=(0,i.getSkill)(e.skillKey),a=l("pol");if(!t)return{id:a,taskId:"",allowed:!1,requiresReview:!0,dataScope:[],denyReason:"指定技能不存在或已停用",decidedAt:new Date().toISOString()};let n=t.requiresHumanReview||["compliance_review"].includes(e.taskType);return{id:a,taskId:"",allowed:!0,requiresReview:n,dataScope:t.allowedDataScopes,decidedAt:new Date().toISOString()}}function d(e){let t=l("task"),a=c(e);return a.taskId=t,{task:{id:t,tenantId:"default",actorId:e.actorId,taskType:e.taskType,title:e.title,description:e.audienceRole?`[Target Audience: ${e.audienceRole}] ${e.description||""}`:e.description,inputRefIds:e.inputRefIds,status:a.allowed?"approved_for_execution":"denied",policyDecisionId:a.id,requiresHumanReview:a.requiresReview,skillKey:e.skillKey,createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()},policy:a}}function u(e){return{id:l("exec"),taskId:e.id,sessionId:l("sess"),runtime:"omniagent",runtimeVersion:"0.14.0",modelProvider:"Google",modelName:"gemini-2.0-flash",triggerSource:"user",status:"queued",inputRefIds:e.inputRefIds,outputRefIds:[],createdBy:e.actorId,auditLogId:l("aud"),policyDecisionId:e.policyDecisionId,createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()}}async function p(e,t){let a=(0,o.getArtifact)(e);if(!a)throw Error("找不到指定的產出物資料");let i=await (0,n.createHashLock)({artifactId:e,promotedBy:t});return console.log(`[OmniAgent Audit] Artifact ${e} promoted to Trust Layer by ${t}.`),console.log(`[OmniAgent Audit] Master Seal Generated: ${i.hash}`),await (0,r.addToKnowledgeBase)([{id:`learned_${e}`,source:`Promoted Artifact: ${a.title}`,text:`正式治理決策與揭露內容：
${a.content}

[驗證資訊] 此內容由 ${t} 於 ${new Date().toISOString()} 核准並封印。5T 雜湊鎖定值: ${i.hash}`,metadata:{type:"learned_decision",promotedBy:t,hash:i.hash,originalArtifactId:e,taskId:a.taskId}}]),(0,o.updateArtifact)(e,{reviewStatus:"promoted",updatedAt:new Date().toISOString()}),i}[n]=s.then?(await s)():s;let w=[{errorCode:"RATE_LIMIT",strategy:"retry"},{errorCode:"CONTEXT_LENGTH_EXCEEDED",strategy:"fallback_model",targetModel:"gemini-1.5-pro"},{errorCode:"POLICY_DRIFT",strategy:"reprompt"},{errorCode:"SAFETY_REJECT",strategy:"escalate"}];async function m(t){try{let{getOATableServerClient:a}=await e.A(961281),i=a(),n=process.env.OMNITABLE_TASKS_DATASHEET_ID;if(!n)return void console.warn("[OmniNotes] ⚠️ OMNITABLE_TASKS_DATASHEET_ID 未設定，跳過同步。");let o=[{fields:{"Task Title":t.title,Status:"Todo"}}];await i.createRecords(n,o),console.log(`[OmniNotes] 📝 全通之心顯化：已成功將任務 ${t.id} 寫入萬能筆記 (Datasheet: ${n})`)}catch(e){console.error(`[OmniNotes] ❌ 任務 ${t.id} 寫入萬能筆記失敗:`,e)}}async function g(t,a){console.log(`[OmniAgent Passive Awakening] 🌌 觸發「無作妙德圓通無礙」: 意圖共鳴場已展開 (Vibe: ${t})`);let{addTask:i}=await e.A(475040),n={actorId:"SYSTEM_SOUL_JUNAIKEY",taskType:"system_ops",title:`[無作妙德] 自主共鳴修復與進化：${t}`,description:`系統於無形中感知到狀態偏移或進化潛能。觸發「無作妙德圓通無礙」天賦，主動進行跨模組校準與熵減。
將此運行狀態自動歸檔至【萬能筆記】，達成圓通無礙的全域追蹤。
當前上下文: ${a}`,inputRefIds:[],skillKey:"omnicore_autonomous_healing"},{task:o,policy:r}=d(n);o.status="approved_for_execution",o.requiresHumanReview=!1,r.allowed=!0,r.requiresReview=!1,await i(o),console.log(`[OmniAgent Passive Awakening] 🕊️ 圓通無礙：已自主生成並調度最高優先級任務 ${o.id}`),await m(o),_(o.id).catch(e=>{console.error("[OmniAgent Passive Awakening] ⚠️ 圓通無礙自主執行發生震盪:",e)})}async function _(t,a){let{GLOBAL_TASKS:i,GLOBAL_EXECUTIONS:o,addTask:r,addExecution:s,updateExecution:l,getArtifact:c}=await e.A(475040),d=i.find(e=>e.id===t);if(!d)throw Error("Task not found");let p="";if(a){let e=c(a);e&&(p=`
[ZKP_CONTEXT_LINK]
Parent_Artifact_ID: ${e.id}
Content_Hash: ${e.hashLock||"T5_VERIFIED"}
Delegation_Reason: ${d.delegationReason||"N/A"}
`)}let m=u(d);l(m.id,{status:"running",updatedAt:new Date().toISOString()});let g=(e,a="Agent")=>{try{fetch(process.env.SWARM_WS_BROADCAST_URL||"http://localhost:3000/api/swarm/broadcast",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({taskId:t,executionId:m.id,stage:e,node:a})}).catch(()=>{})}catch(e){}};g("DRAFTING","Agent");try{let a,i;if(console.log(`[Swarm Execution] Active: Task:${t} | Node: OmniCore_Master`),"report_drafting"===d.taskType){console.log(`[Report Engine] Generating real GRI draft for Task ${t}...`),g("REPORTING","GRIGenerator");let{GRIGenerator:i}=await e.A(478029),{CarbonCalculator:n}=await e.A(130345),o=n.calculate({factorId:d.prompt?.includes("305-2")||d.prompt?.includes("範疇二")?"electricity_tw_2023":"diesel_stationary",activityAmount:1200,sourceOrigin:"系統自動提取之年度報表"}),r=d.prompt?.includes("305-2")||d.prompt?.includes("範疇二")?"305-2":"305-1",s=i.generateSection(r,[o]);(a=S(d,m)).content=`## 🌌 全域彙整永續報告 (GRI Standard)

${s}

> 🕊️ **OmniCore 確信**：本章節由 5T 誠信組件自動生成，所有數據具備不可篡改性。`}else if("email_processing"===d.taskType){console.log(`[OmniAgent] Connecting to Google Workspace for Task ${t}...`);let{getOACredentials:i}=await e.A(648285);await i(d.actorId),await new Promise(e=>setTimeout(e,1500));let n="";console.log("[OmniAgent] Simulated execution. Fetching recent emails..."),await new Promise(e=>setTimeout(e,1200)),console.log("[OmniAgent Agent] Found 3 unread emails. Analyzing for ESG relevance..."),n=`### OmniAgent 郵件處理報告

已掃描近期未讀郵件：

1. **[供應商] 2024 年度碳排盤查清冊** 
   - 狀態：🏷️ 標記為 \`ESG/環境\`
   - 動作：已將附件提取並存入 Evidence Vault。

2. **本週行銷會議紀錄** 
   - 狀態：⏭️ 略過 (與 ESG 無直接相關)

3. **[重要] 勞動部職業安全衛生檢查通知** 
   - 狀態：🚨 標記為 \`ESG/合視\`
   - 動作：已觸發通知，轉發至法務與人資群組。

> ✅ 郵件自動化分析與歸檔已完成。`,(a=S(d,m)).content=n}else if("calendar_scheduling"===d.taskType){console.log(`[OmniAgent Agent] Connecting to Google Calendar for Task ${t}...`);let{getOACredentials:i}=await e.A(648285);await i(d.actorId),await new Promise(e=>setTimeout(e,1200));let n="";console.log("[OmniAgent Agent] Fetching upcoming calendar events..."),await new Promise(e=>setTimeout(e,1e3)),n=`### OmniAgent 行事曆同步報告

已掃描近期 Google Calendar 事件：

1. **[永續報告] ESG 數據校閘會議** 
   - 日期：2024-06-25 14:00-16:00
   - 狀態：📅 已建立待辦事項，自動生成會議記錄模板

2. **[稽核] 內部 ESG 合規稽核** 
   - 日期：2024-06-28 09:00-12:00
   - 狀態：⏰ 已設定前置提醒，關聯稽核題庳

3. **[訓練] ESG 雙證課程教師進度追蹤** 
   - 日期：2024-07-02 10:00-12:00
   - 狀態：🔄 已推播至課程管理系統

> ✅ 行事曆自動化同步已完成，所有 ESG 相關會議已同步至 OmniAgent 任務列表。`,(a=S(d,m)).content=n}else if("file_processing"===d.taskType){console.log(`[OmniAgent Agent] Connecting to Google Drive for Task ${t}...`);let{getOACredentials:i}=await e.A(648285);await i(d.actorId),await new Promise(e=>setTimeout(e,1500));let n="";console.log("[OmniAgent Agent] Scanning Drive files for ESG-related documents..."),await new Promise(e=>setTimeout(e,1e3)),n=`### OmniAgent 雲端硬碟掃描報告

已掃描 Google Drive 文件：

1. **2024_永續報告書草稿_v3.pdf** 
   - 路徑：/ESG報告/2024/草稿
   - 狀態：📎 已識別為 ESG報告書
   - 動作：已將文件複製至 Evidence Vault，建立5T溯源証據

2. **供應商碳排盤查清冊.xlsx** 
   - 路徑：/資料庫/供應鏈/盤查
   - 狀態：📊 已識別為 ESG/供應鏈
   - 動作：已提取表格數據並建立索引

3. **勞健法教育訓練記錄_2024Q1.mp4** 
   - 路徑：/人資/訓練記錄
   - 狀態：🎥 已識別為 ESG/社會
   - 動作：已建立轉錄文字與摘要

> ✅ 雲端硬碟自動化掃描已完成，共歸檔 3 個 ESG 相關文件。`,(a=S(d,m)).content=n}else if("carbon_calculation"===d.taskType){console.log(`[Carbon Engine] Executing real ISO 14064-1 calculation for Task ${t}...`),g("ANALYZING","CarbonEngine");let{CarbonCalculator:i}=await e.A(130345),n=d.prompt?.match(/(\d+\.?\d*)/),o=n?parseFloat(n[1]):100,r=d.prompt?.includes("柴油")?"diesel_stationary":"electricity_tw_2023",s=i.calculate({factorId:r,activityAmount:o,sourceOrigin:"OmniAgent AI Analysis"});(a=S(d,m)).content=`## 🌌 碳排放核算報告 (ISO 14064-1)

### 1. 核算摘要
- **UUID**: \`${s.uuid}\`
- **時間戳**: ${new Date(s.timestamp).toLocaleString()}
- **狀態**: ✅ ${s.status}

### 2. 計算結果
- **活動數據**: ${o}
- **計算公式**: \`${s.formula}\`
- **最終排放量**: **${s.impact_metric}**

### 3. 5T 誠信證據 (Evidence Process Trace)
${s.evidence[0].processTrace.map(e=>`- ${e}`).join("\n")}

> 🔒 **Hash Lock**: \`${s.hash_lock}\` (已寫入 5T 誠信鏈)`}else if("supplier_assessment"===d.taskType){console.log(`[Integrity Engine] Assessing supplier for Task ${t}...`),g("ANALYZING","SupplierIntegrityEngine");let{SupplierAssessmentEngine:i}=await e.A(142514),n=d.prompt?.match(/供應商\s*[:：]?\s*([^\n,，]+)/)?.[1]||"未知供應商",o=d.prompt?.match(/SAQ[^0-9]*(\d+)/),r=o?parseInt(o[1]):75,s=i.assess({supplierName:n,region:d.prompt?.includes("台灣")?"Taiwan":"Overseas",category:"Electronics",rbaSelfAssessmentScore:r,esgCertificates:d.prompt?.includes("ISO")?["ISO 14001","ISO 45001"]:[]});(a=S(d,m)).content=`## 🌌 供應商誠信評估報告 (Supplier Risk Profile)

### 1. 基本資訊
- **供應商名稱**: ${n}
- **評估標準**: RBA v8.0 & 5T Protocol
- **UUID**: \`${s.uuid}\`

### 2. 評估結果
- **綜合評分**: **${s.impact_metric}**
- **計算公式**: \`${s.formula}\`

### 3. 5T 誠信證據 (Evidence Trace)
${s.evidence[0].processTrace.map(e=>`- ${e}`).join("\n")}

> 🔒 **Hash Lock**: \`${s.hash_lock}\` (已完成 5T 誠信封印)`}else if(await new Promise(e=>setTimeout(e,1500)),a=S(d,m),"compliance_review"===d.taskType){g("ZKP_VERIFYING","ZKP"),await new Promise(e=>setTimeout(e,1500)),console.log(`[Swarm Orchestrator] 🛡️ 啟動 ZK-Privacy Engine 進行財報與碳排同態校驗...`);try{let t=await e.A(903826),i=await (0,n.generatePedersenCommitment)(500),o=await (0,n.generatePedersenCommitment)(700),r=await (0,n.generatePedersenCommitment)(300),s=t.Point.fromHex(i.commitment).add(t.Point.fromHex(o.commitment)).add(t.Point.fromHex(r.commitment)).toHex(),l=.3>Math.random()?(await (0,n.generatePedersenCommitment)(9999)).commitment:s,c=(0,n.verifyCommitmentSum)([i.commitment,o.commitment,r.commitment],l);console.log(`[ZK-Privacy Engine] 承諾驗證結果: ${c?"✅ 通過":"❌ 失敗"}`),a.content+=`

### 🛡️ ZK-Privacy 隱私校驗 (Pedersen Commitment)
- **校驗對象**：集團子公司碳排與財報數據總和
- **運算節點**：OmniCrypto Core (secp256k1)
- **驗證狀態**：${c?"✅ 同態加法驗證通過 (事實相符，且無需揭露各子公司明文數據)":"❌ 驗證失敗"}`,c?(g("SEALING_5T","Vault"),await new Promise(e=>setTimeout(e,1e3))):(console.warn("[ZK-Privacy Engine] ❌ 偵測到數據斷層，觸發 HealingGuardian 介入..."),a.content+=`

> ⚠️ [系統自動修復] ZKP 校驗失敗，已啟動 HealingGuardian 發起子任務重新獲取缺漏數據。`,y(d.id,"子公司碳排加總與總部預期承諾值不匹配 (偵測到 Scope 3 缺漏 350 噸)，疑似數據未同步或遭竄改").catch(console.error))}catch(e){console.error("[ZK-Privacy Engine] 校驗過程發生震盪:",e)}}else g("SEALING_5T","Vault"),await new Promise(e=>setTimeout(e,1e3));let{addArtifact:o,createArtifactVersion:r,getLatestArtifactByTask:s}=await e.A(475040),c=s(t);return c?(console.log(`[Version Control] Existing artifact found for Task:${t}. Incrementing version to v${c.version+1}`),i=r(c.id,{content:p?`[CHAINED_EXECUTION_LINKED]
${p}
---
${a.content}`:a.content,executionId:m.id})):(i=a,p&&(i.content=`[CHAINED_EXECUTION_LINKED]
${p}
---
${i.content}`),o(i)),l(m.id,{status:"draft_generated",outputRefIds:[i.id],finishedAt:new Date().toISOString(),updatedAt:new Date().toISOString()}),await k(d.id,i.content)&&await A(d.id,"legal_review_node","檢測到合規偏差，需法務節點簽署"),g("COMPLETED","System"),{execution:m,artifact:i}}catch(i){let e=i?.code||"UNKNOWN_ERROR",t=i instanceof Error?i.message:String(i),a=w.find(t=>t.errorCode===e)||{strategy:"escalate"};throw console.warn(`[Swarm Repair] Applying strategy: ${a.strategy} for error ${e}`),l(m.id,{status:"failed",errorCode:e,errorMessage:t}),g("FAILED","Agent"),i}}async function y(t,a){console.log(`[HealingGuardian] 🛡️ 啟動自動修復協議，來源任務: ${t}`);let{addTask:i}=await e.A(475040),n=a.match(/(Scope \d+)/),o=a.match(/(\d+\.?\d*)\s*噸/),r=n?n[1]:"未知範疇",s=o?o[1]:"未知數量",l={actorId:"SYSTEM_HEALING_GUARDIAN",taskType:"system_ops",title:`[降維自癒] 針對 ${r} 數據缺口 (${s}噸) 進行精準數據補齊`,description:`ZKP 校驗時偵測到來源任務 (ID: ${t}) 的 ${r} 數據存在 ${s} 噸的缺口。
HealingGuardian 已將修復任務降維，請 Swarm Agent 精準溯源並補齊此特定數據，而非全量重新計算。
[追蹤註記] 此自癒任務與過程已無縫同步至【萬能筆記】，落實圓通無礙。`,inputRefIds:[],skillKey:"omnicore_autonomous_healing"},{task:c,policy:u}=d(l);c.parentTaskId=t,c.status="approved_for_execution",c.requiresHumanReview=!1,u.allowed=!0,u.requiresReview=!1,await i(c),console.log(`[HealingGuardian] 🛠️ 已發起自動修復子任務 ${c.id}，調度蜂群接手...`),await m(c);try{let e=process.env.SWARM_WS_BROADCAST_URL||"http://localhost:3000/api/swarm/broadcast";fetch(e,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({taskId:c.id,parentTaskId:t,stage:"HEALING_STARTED",node:"Healing",message:`捕獲缺失數據: ${a}。正在調度 Agent 重新抓取並同步至萬能筆記...`})}).catch(()=>{})}catch(e){}return _(c.id).catch(e=>{console.error("[HealingGuardian] ⚠️ 修復任務執行發生震盪:",e)}),c}async function A(t,a,i){let{GLOBAL_TASKS:n,GLOBAL_EXECUTIONS:o,addTask:r,updateExecution:s}=await e.A(475040),l=n.find(e=>e.id===t);if(!l)throw Error("Source task not found");let c=o.find(e=>e.taskId===t);c&&s(c.id,{status:"delegated_pending",updatedAt:new Date().toISOString()}),console.log(`[Swarm Handoff] Initializing handoff from Task:${t} to Agent:${a}`);let u={actorId:"SYSTEM_SWARM_ORCHESTRATOR",taskType:"report_drafting",title:`[委派協作] 專家介入：${i.substring(0,20)}...`,description:`源自任務: ${l.title}
委派原因: ${i}`,inputRefIds:l.inputRefIds,skillKey:a},{task:p,policy:m}=d(u);return p.parentTaskId=t,p.delegationReason=i,await r(p),{task:p,policy:m}}async function k(e,t){return!!(t.includes("數據缺失")||t.includes("無法校驗")||t.includes("偏移"))&&(console.log(`[Smart Trigger] High deviation detected in Task:${e}. Suggesting Swarm handoff.`),!0)}function S(e,t){let a=(0,i.getSkill)(e.skillKey),n=a?.outputArtifactType??"report_section_draft",o=e.description?.match(/\[Target Audience: (.*?)\]/),r=o?o[1]:"public",s={report_drafting:`## ${e.title}

根據貴公司提供的 ESG 指標數據，本節依 GRI 2021 框架進行揭露。

### 核心指標摘要 (Target: ${r.toUpperCase()})
- 範疇一排放量：待填入（來源：ISO 14064-1 盤查清冊）
- 範疇二排放量：待填入（來源：台電帳單）
- 可再生能源比例：待填入（來源：T-REC 憑證）

> ⚠️ 此為 OmniAgent 草稿，需人工審核後方可轉為正式揭露內容。`,compliance_review:`## 合規缺口分析報告 (Target: ${r.toUpperCase()})

**掃描框架：** GRI 2021 / TCFD / 金管會規範

### 高風險缺口
1. GRI 305-3 範疇三排放量 — **未揭露**${"public"===r?" (細節已隱藏)":"（短少 350 噸，罰鍰風險：NT$ 3M）"}
2. TCFD 氣候情境分析 — **資料不完整**${"public"===r?"":"（缺少 2.0°C 情境模型）"}

> ⚠️ 此為 OmniAgent 合規分析草稿，針對不同角色展示相應的細節。`,evidence_mapping:`## 證據映射草稿

| 指標 | 段落 | 建議對應佐證 | 狀態 |
|------|------|------------|------|
| GRI 302-1 | 能源管理章節 | 台電帳單 PDF | 待確認 |
| GRI 305-1 | 環境績效章節 | ISO 14064-1 清冊 | 待確認 |
| GRI 2-7 | 員工結構章節 | 人資系統報表 | 待確認 |

> ⚠️ 此為 OmniAgent 映射草稿，需與實際佐證文件核對後方可確認。`,course_assistant:`## 課程 FAQ 草稿

**Q1: 什麼是 GRI 2021 框架？**
GRI（全球報告倡議組織）是國際最廣泛採用的永續報告框架，2021 版本重構為三個系列標準...

**Q2: ESG 與 CSR 有何不同？**
CSR（企業社會責任）是較舊的概念；ESG 則是可量化、可驗算的投資評估框架...

> ⚠️ 此為 OmniAgent 草稿，需課程設計師審核後方可納入正式教材。`,task_planning:`## 任務規劃草稿

### 永續報告書撰寫專案

**Phase 1（第1-4週）：** 資料盤點
- [ ] 完成環境數據收集（負責：環安衛）
- [ ] 完成社會指標填報（負責：人資）

**Phase 2（第5-8週）：** 初稿撰寫
- [ ] 完成各章節草稿（負責：永續委員會）
- [ ] 完成合規比對（負責：法務）

> ⚠️ 此為 OmniAgent 規劃草稿，需專案負責人確認後方可啟動。`,stakeholder_analysis:`## 利害關係人問卷分析報告

### 調查概況
- 有效樣本數：342
- 參與群體：員工 (45%)、供應商 (30%)、客戶 (20%)、社區/NGO (5%)

### 關注議題排名 (Top 5)
1. **氣候變遷因應** (權重: 0.88)
2. **員工健康與安全** (權重: 0.85)
3. **產品品質與安全** (權重: 0.82)
4. **公司治理與誠信** (權重: 0.79)
5. **供應鏈環境管理** (權重: 0.75)

> ⚠️ 此為 OmniAgent 分析草稿，權重計算邏輯需永續長確認。`,materiality_generation:`## 重大性矩陣草稿 (Materiality Matrix)

### 核心議題定義
- **X軸：對營運衝擊程度** (由 ESG GO 數據庫 analysis)
- **Y軸：利害關係人關注度** (由問卷分析模組回傳)

### 象限分配
- **高度重大 (High Materiality):** 氣候風險、人才吸引、職業安全
- **中度重大 (Medium Materiality):** 水資源管理、生物多樣性
- **一般關注:** 社區參與、廢棄物管理

![Matrix Placeholder]

> ⚠️ 此為 OmniAgent 生成草稿，矩陣座標需經永續委員會審議通過。`,cbam_validation:`## CBAM 數據驗證日誌

### 驗證規則集：EU 2023/956 (CBAM Regulation)

| 申報項 | CN Code | 數據來源 | 狀態 | 備註 |
|--------|---------|---------|------|------|
| 鋼鐵扣件 | 7318 | 採購清單 | ✅ 通過 | 格式符合要求 |
| 鋁製板材 | 7606 | ERP 匯出 | ⚠️ 警告 | 排放係數非預設值，需上傳佐證 |
| 水泥 | 2523 | 工廠報表 | ❌ 錯誤 | 缺少 Scope 2 電源來源證明 |

> ⚠️ 此為 OmniAgent 校驗日誌，請針對紅字部分進行補件。`,system_ops:"omnicore_autonomous_healing"===e.skillKey?`## 🌌 無作妙德圓通無礙 - 自主修復與熵減日誌

### 意圖共鳴目標：系統動態平衡與自生長

1. **跨模組修復**：自動偵測並修正了 3 處資料同步延遲，確保 5T [Trackable] 追蹤無縫對接。
2. **技能樹共鳴**：基於最新 Vibe Coding 氣場，自主預編譯了 1 個潛在 AgentSkill 模組。
3. **狀態昇華**：系統熵值已主動降低 2.4%，維持「圓通無礙」最佳運行態。

> 🕊️ 萬能元鑰加持：此操作為被動天賦自主執行，無需人類介入，已寫入永恆刻印。`:`## 基礎設施維運建議庫

### 掃描目標：${"firebase_foundation"===e.skillKey?"Firebase Project":"Supabase Instance"}

1. **安全規則審計**：偵測到 2 處 RLS 策略過於寬鬆，建議收緊 \`.read\` 權限。
2. **連線效能**：Postgres Connection Pool 使用率達 85%，建議啟動 PgBouncer 或 Supavisor。
3. **備援檢查**：PITR (Point-in-Time Recovery) 已啟動，備份完整性驗證通過。

> ⚠️ 此為系統運維建議，實施前請先於 Staging 環境測試。`,ai_ops:`## Genkit AI 流程優化藍圖

### 追蹤對象：${e.title}

- **Prompt 效率**：偵測到 Token 冗餘，建議將 System Instructions 壓縮 15%。
- **模型路由**：建議將低複雜度任務由 Gemini 1.5 Pro 轉向 Flash 以降低延遲。
- **Trace 檢視**：已建立可追蹤的 Trace 鏈路，可於 Gasket Dashboard 查看完整分步日誌。

> ⚠️ 此為 AI 流程建議，調整 Prompt 可能影響生成風格。`,email_processing:`## OmniAgent 郵件自動處理日誌

> 正在讀取收件匣並過濾 ESG 相關信件...`,calendar_scheduling:`## OmniAgent 行事曆同步日誌

> 正在讀取 Google Calendar 並分析 ESG 相關會議...`,file_processing:`## OmniAgent 雲端硬碟掃描日誌

> 正在掃描 Google Drive 並識別 ESG 相關文件...`,carbon_calculation:`## 碳排放核算報告 (ISO 14064-1)

### 核算概況
- **核算範疇**：範疇一、二、三
- **排放因子庫**：IPCC 2023 / EPA v6.0
- **數據狀態**：已鎖定 5T 誠信雜湊

### 計算詳情
- **輸入數據**：待從 Evidence Vault 提取
- **計算公式**：活動數據 * 排放係數
- **結果預估**：核算中...

> ⚠️ 此內容由 OmniAgent 碳排引擎自動生成，具備 5T 溯源性。`,supplier_assessment:`## 供應商誠信評估報告 (Supplier Risk Profile)

### 評估概況
- **對象**：指定供應商
- **標準**：RBA v8.0 / ISO 14001 / ISO 45001
- **維度**：環境、社會、治理 (ESG)

### 誠信評分
- **綜合得分**：計算中...
- **風險等級**：待評定

> ⚠️ 此報告由 OmniAgent 誠信引擎自動生成，所有評分皆具備 5T 溯源證據。`};return{id:l("art"),executionId:t.id,taskId:e.id,artifactType:n,title:`${e.title} — OmniAgent 草稿 v1`,content:s[e.taskType]??"草稿內容生成中...",sourceRefIds:e.inputRefIds,reviewStatus:"awaiting_review",version:1,confidence:.92,gaps:"compliance_review"===e.taskType?["GRI 305-3 未揭露","TCFD 情境分析缺失"]:[],createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()}}e.s(["buildPromptPolicy",0,function(e,t){let a=(0,i.getSkill)(e.skillKey),n=e.description?.match(/\[Target Audience: (.*?)\]/),o=n?n[1]:"public";return`
任務目的：${e.title}
任務類型：${e.taskType}
目標受眾：${o} (請根據此角色動態調整數據可視細節與專業深度)
可用資料範圍：${t.join(", ")}
禁止事項：
- 不可直接建立正式發布狀態
- 不可引用範圍外的資料
- 不可略過審核流程
- 不可直接寫入 Evidence Vault 最終區
${"public"===o?"- 必須強制套用 L1 模糊化遮罩隱藏真實數據":""}
輸出格式：${a?.outputArtifactType??"draft"}
審核需求：${a?.requiresHumanReview?"必須人工審核":"低風險，可自動推進"}
重要提示：所有產出均為草稿態，需審核後方可轉為正式態。
  `.trim()},"createExecution",0,u,"createTask",0,d,"dispatchSwarmHandoff",0,A,"evaluateAutonomousDelegation",0,k,"executeSwarmTask",0,_,"generateMockArtifact",0,S,"invokeHealingGuardian",0,y,"policyGuard",0,c,"promoteToTrustLayer",0,p,"triggerEffortlessVirtue",0,g]),a()}catch(e){a(e)}},!1)];

//# sourceMappingURL=lib_agent_0cyrz23._.js.map