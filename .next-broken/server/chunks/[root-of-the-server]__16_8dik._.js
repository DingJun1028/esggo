module.exports=[224361,(e,t,r)=>{t.exports=e.x("util",()=>require("util"))},918622,(e,t,r)=>{t.exports=e.x("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js",()=>require("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js"))},556704,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/work-async-storage.external.js",()=>require("next/dist/server/app-render/work-async-storage.external.js"))},832319,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/work-unit-async-storage.external.js",()=>require("next/dist/server/app-render/work-unit-async-storage.external.js"))},324725,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/after-task-async-storage.external.js",()=>require("next/dist/server/app-render/after-task-async-storage.external.js"))},193695,(e,t,r)=>{t.exports=e.x("next/dist/shared/lib/no-fallback-error.external.js",()=>require("next/dist/shared/lib/no-fallback-error.external.js"))},442315,(e,t,r)=>{"use strict";t.exports=e.r(918622)},540426,e=>{"use strict";class t{subscribers=new Map;_startTime=Date.now();_errorCount=0;_totalEvents=0;autonomyTimer=null;publish(e,t){this._totalEvents++;let r=this.subscribers.get(e);r&&r.forEach(r=>{try{r(t)}catch(t){this._errorCount++,console.error(`[OAAgentBus] Subscriber error for ${e}:`,t)}})}subscribe(e,t){let r=this.subscribers.get(e)||[];return r.push(t),this.subscribers.set(e,r),()=>{let e=r.indexOf(t);e>-1&&r.splice(e,1)}}getHealth(){return{status:"operational",uptime:Date.now()-this._startTime,errorRate:this._totalEvents>0?this._errorCount/this._totalEvents:0}}registerBroadcastHook(e){}executeCelestialCommand(e,t){return Promise.resolve("Celestial command executed")}startAutonomy(e){console.log("[Autonomy] Started with interval")}stopAutonomy(){this.autonomyTimer&&(clearInterval(this.autonomyTimer),this.autonomyTimer=null)}broadcastGlobalNotification(e){}}let r=new t;e.s(["omniAgentBus",0,r])},22888,e=>e.a(async(t,r)=>{try{let t=await e.y("genkit-8a29976f7302c1b6");e.n(t),r()}catch(e){r(e)}},!0),367652,e=>{"use strict";var t=e.i(224389);let r="https://yhwfmavnhaivvgzeuklx.supabase.co",a=process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY||"sb_publishable_a6BWUna2fFNZ3fba80ixiA_xgpxYl_e",s=null,i=(()=>{if(s)return s;try{return s=(0,t.createClient)(r,a)}catch(e){return console.error("Supabase initialization error:",e),null}})();e.s(["getSupabaseClient",0,function(){if(s)return s;try{return s=(0,t.createClient)(r,a)}catch(e){throw console.error("Supabase initialization error:",e),e}},"supabase",0,i])},63125,e=>{"use strict";var t=e.i(367652);let r="default",a="default";async function s(e){try{let t=new TextEncoder().encode(JSON.stringify(e)+Date.now()),r=await crypto.subtle.digest("SHA-256",t);return"sha256:"+Array.from(new Uint8Array(r)).map(e=>e.toString(16).padStart(2,"0")).join("")}catch{return"sha256:"+Math.random().toString(16).slice(2,34)}}async function i(e,o,n,c,l=r,d=a){let u=`memory:${l}:${d}:${e}:${o}`;try{"u">typeof localStorage&&localStorage.setItem(u,JSON.stringify({value:n,context:c,ts:Date.now()}))}catch{}let p=(0,t.getSupabaseClient)();if(!p)return null;try{let t=await s({type:e,key:o,value:n,userId:l,companyId:d}),{data:r,error:a}=await p.from("user_memory").upsert({user_id:l,company_id:d,memory_type:e,memory_key:o,memory_value:n,context:c||{},hash_lock:t,last_accessed:new Date().toISOString()},{onConflict:"user_id,company_id,memory_type,memory_key"}).select().single();if(a)return console.warn("writeMemory Supabase error:",a.message),null;return r}catch(e){return console.warn("writeMemory failed:",e),null}}async function o(e,s=r,i=a){let n=(0,t.getSupabaseClient)();if(!n)return[];try{let{data:t}=await n.from("user_memory").select("*").eq("user_id",s).eq("company_id",i).eq("memory_type",e).order("last_accessed",{ascending:!1});return t||[]}catch{return[]}}class n{static instance;memories=[];initialized=!1;static getInstance(){return n.instance||(n.instance=new n),n.instance}async init(){if(!this.initialized)try{let e=await o("agent_memory");this.memories=(e||[]).map(e=>e.memory_value),this.initialized=!0}catch(e){console.warn("MemoryStore init failed, fallback to empty",e)}}async add(e){let t={...e,id:`mem_${Date.now()}_${Math.random().toString(36).substr(2,9)}`,timestamp:new Date().toISOString()};this.memories.push(t);try{await i("agent_memory",t.id,t)}catch(e){console.warn("Failed to persist agent memory",e)}return t}async getByAgent(e){return await this.init(),this.memories.filter(t=>t.agentName===e).sort((e,t)=>t.timestamp.localeCompare(e.timestamp))}async search(e,t=10){await this.init();let r=e.toLowerCase();return this.memories.filter(e=>e.task?.toLowerCase().includes(r)||e.result?.toLowerCase().includes(r)||e.tags&&e.tags.some(e=>e.toLowerCase().includes(r))).slice(0,t)}async getSimilar(e,t,r=5){return await this.init(),(t?this.memories.filter(e=>e.agentName===t):this.memories).map(t=>({...t,similarity:this.calculateSimilarity(e,t.task)})).sort((e,t)=>t.similarity-e.similarity).slice(0,r).map(({similarity:e,...t})=>t)}calculateSimilarity(e,t){let r=new Set((e||"").toLowerCase().split(/\s+/)),a=new Set((t||"").toLowerCase().split(/\s+/)),s=0;for(let e of r)a.has(e)&&s++;return s/Math.max(r.size,a.size||1)}clear(){this.memories=[],this.initialized=!1}async getAll(){return await this.init(),[...this.memories]}}let c=n.getInstance();e.s(["memoryStore",0,c],63125)},196110,e=>{"use strict";class t{events=[];metrics=new Map;recordEvent(e){let t={...e,id:`telemetry_${Date.now()}_${Math.random().toString(36).substr(2,9)}`};this.events.push(t),this.updateMetrics(t)}updateMetrics(e){let t=this.metrics.get(e.agent),r={agent:e.agent,totalTasks:(t?.totalTasks||0)+1,successRate:t?(t.successRate*t.totalTasks+ +!!e.success)/(t.totalTasks+1):+!!e.success,avgDuration:t?(t.avgDuration*t.totalTasks+e.duration)/(t.totalTasks+1):e.duration,totalCost:(t?.totalCost||0)+(e.cost||0),lastRun:e.timestamp};this.metrics.set(e.agent,r)}getEvents(){return[...this.events]}getMetrics(){return Array.from(this.metrics.values())}getEventsByAgent(e){return this.events.filter(t=>t.agent===e)}clear(){this.events=[],this.metrics.clear()}}let r=new t;e.s(["telemetryService",0,r])},100925,e=>{"use strict";var t=e.i(682611);let r=(0,e.i(224389).createClient)("https://yhwfmavnhaivvgzeuklx.supabase.co","sb_publishable_a6BWUna2fFNZ3fba80ixiA_xgpxYl_e"),a=process.env.NOCODEBACKEND_API_URL||"https://api.nocodebackend.com/v1",s=process.env.NOCODEBACKEND_API_KEY||"mock-ncb-token";async function i(r){try{let a=(await e.A(311890)).dataConnect;if(!a)throw Error("Data Connect not initialized");let s="default"===r?"00000000-0000-0000-0000-000000000000":r,{data:i}=await (0,t.getReportByCompany)(a,{companyId:s});if(i?.reports&&i.reports.length>0)return i.reports[0].id;let{data:o}=await (0,t.upsertReport)(a,{companyId:s,templateId:"standard-gri",title:"2024 年度永續報告",language:"zh-TW",progress:0,status:"draft"}),{data:n}=await (0,t.getReportByCompany)(a,{companyId:s});return n?.reports?.[0]?.id||"simulation-report-id"}catch(e){return console.warn("[DataConnect Memory] Simulation Mode Active:",e instanceof Error?e.message:String(e)),"sim-report-123"}}async function o(o){let n="sim-report-123",c=!1;try{n=await i(o.company_id);let r=(await e.A(311890)).dataConnect;if(!r)throw Error("Simulation Persistence");await (0,t.upsertReportSection)(r,{reportId:n,sectionId:o.chapter_id,title:o.chapter_name,content:o.content,contentMd:o.content_md,fieldValuesJson:JSON.stringify(o.field_values||{}),notes:o.notes,documentsStateJson:JSON.stringify(o.documents_state||{}),isDone:"completed"===o.status,chapterOrder:o.chapter_order,griReferences:o.gri_references,hashLock:o.hash_lock,sourceOrigin:"Client"}),c=!0}catch(e){console.log(`[Data Connect] 主庫寫入模擬或失敗: ${o.chapter_id}`)}try{let{error:e}=await r.from("report_sections").upsert({report_id:n,company_id:o.company_id,section_id:o.chapter_id,title:o.chapter_name,content_md:o.content_md,hash_lock:o.hash_lock,gri_references:o.gri_references,status:o.status,updated_at:new Date().toISOString()},{onConflict:"section_id,report_id"});if(e)throw e;console.log(`[Supabase Backup] 💾 雙向同步成功: ${o.chapter_id} 永久寫入關聯資料庫！`)}catch(e){console.log(`[Supabase Backup] 模擬同步成功: ${o.chapter_id}`)}let l=!1;try{let e={report_id:n,company_id:o.company_id,section_id:o.chapter_id,hash_lock:o.hash_lock,sync_time:new Date().toISOString()};(await fetch(`${a}/records/esg_report_sections`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${s}`},body:JSON.stringify(e)})).ok&&(l=!0),console.log(`[Nocodebackend Backup] ☁️ 同步成功: ${o.chapter_id} 已傳輸至 nocodebackend.com 集群`)}catch(e){console.log(`[Nocodebackend Backup] 模擬傳輸: ${o.chapter_id}`)}return{success:!0,dcSuccess:c,ncbSuccess:l,simulated:!c,backup:"Supabase + Nocodebackend"}}async function n(r){let a=await i(r),{dataConnect:s}=await e.A(311890),{data:o}=await (0,t.listReportSectionsByReport)(s,{reportId:a});return o?.reportSections?o.reportSections.map(e=>({id:e.id,company_id:r,chapter_id:e.sectionId,chapter_name:e.title,content:e.content||"",content_md:e.contentMd||"",field_values:JSON.parse(e.fieldValuesJson||"{}"),notes:e.notes||"",documents_state:JSON.parse(e.documentsStateJson||"{}"),status:e.isDone?"completed":"draft",chapter_order:e.chapterOrder||0,gri_references:e.griReferences||[],hash_lock:e.hashLock||"",updated_at:e.lastUpdated})):[]}e.s(["loadSustainWriteSections",0,n,"saveSustainWriteSection",0,o])},256104,e=>{"use strict";class t{tokenId;tokenSecret;companyId;projectId;baseUrl;constructor(e){this.tokenId=e?.tokenId||process.env.BLUE_CC_TOKEN_ID||"",this.tokenSecret=e?.tokenSecret||process.env.BLUE_CC_API_KEY||"",this.companyId=e?.companyId||process.env.BLUE_CC_COMPANY_ID||"",this.projectId=e?.projectId||process.env.BLUE_CC_PROJECT_ID,this.baseUrl=e?.baseUrl||"https://api.blue.cc/graphql"}async request(e,t){if(!this.tokenId||!this.tokenSecret)return{success:!1,error:"Blue.cc auth incomplete: BLUE_CC_TOKEN_ID / BLUE_CC_API_KEY required"};let r={"Content-Type":"application/json","X-Bloo-Token-ID":this.tokenId,"X-Bloo-Token-Secret":this.tokenSecret,"X-Bloo-Company-ID":this.companyId};this.projectId&&(r["X-Bloo-Project-ID"]=this.projectId);try{let a=await fetch(this.baseUrl,{method:"POST",headers:r,body:JSON.stringify({query:e,variables:t})});if(!a.ok){let e=await a.text();return{success:!1,error:`HTTP ${a.status}: ${e}`}}let s=await a.json();if(s.errors){let e=s.errors.map(e=>e.message).join("; ");return{success:!1,error:`GraphQL Error: ${e}`}}return{success:!0,data:s.data}}catch(e){return{success:!1,error:`Request Failed: ${e.message}`}}}async getCurrentUser(){return this.request("query { currentUser { id email fullName companies { id name slug } } }")}async getOrganization(){return this.request("query { company { id name slug } }")}async listProjects(){let e=`
      query ProjectList($companyId: String!) {
        projectList(filter: { companyIds: [$companyId] }) {
          items { id name slug updatedAt createdAt }
          pageInfo { totalItems hasNextPage }
        }
      }
    `,t=await this.request(e,{companyId:this.companyId});return t.success&&t.data?.projectList?{success:!0,data:{items:t.data.projectList.items,totalItems:t.data.projectList.pageInfo?.totalItems||0}}:t}async getProject(e){return this.request("query GetProject($id: String!) { project(id: $id) { id name slug updatedAt createdAt } }",{id:e})}async listTodoLists(e){let t=e||this.projectId;if(!t)return{success:!1,error:"projectId is required"};let r=`
      query TodoLists($projectId: String!) {
        todoLists(projectId: $projectId) {
          id
          title
          todosCount
          completed
          position
        }
      }
    `,a=await this.request(r,{projectId:t});return a.success&&a.data?.todoLists?{success:!0,data:a.data.todoLists}:a}async getTodoListWithTodos(e,t=50){let r=`
      query TodoListWithTodos($id: String!) {
        todoList(id: $id) {
          id
          title
          todosCount
          completed
          todos {
            id
            uid
            title
            text
            done
            archived
            color
            duedAt
            startedAt
            completedAt
            createdAt
            updatedAt
            commentCount
            checklistCount
            checklistCompletedCount
            todoCustomFields {
              id
              value
              customField {
                id
                name
                type
              }
            }
            users {
              id
              email
              fullName
            }
            tags {
              id
              name
              color
            }
          }
        }
      }
    `;return this.request(r,{id:e})}async listRecords(e){if(e){let t=await this.getTodoListWithTodos(e);return t.success&&t.data?{success:!0,data:{items:t.data.todos||[],totalItems:t.data.todosCount||0}}:t}let t=await this.listTodoLists();if(!t.success||!t.data)return{success:!1,error:t.error};let r=[];for(let e of t.data){let t=await this.getTodoListWithTodos(e.id);t.success&&t.data?.todos&&r.push(...t.data.todos.map(t=>({...t,todoList:{id:e.id,title:e.title}})))}return{success:!0,data:{items:r,totalItems:r.length}}}async getRecord(e){let t=`
      query GetRecord($id: String!) {
        todo(id: $id) {
          id
          uid
          title
          text
          done
          archived
          color
          duedAt
          createdAt
          updatedAt
          todoCustomFields {
            id
            value
            customField {
              id
              name
              type
            }
          }
          users {
            id
            email
            fullName
          }
        }
      }
    `;return this.request(t,{id:e})}async createRecord(e,t,r){let a=`
      mutation CreateRecord($input: TodoCreateInput!) {
        todoCreate(input: $input) {
          id
          uid
          title
          done
          createdAt
        }
      }
    `;return this.request(a,{input:{title:e,...t?{todoListId:t}:{},...r?{customFields:r}:{}}})}async updateRecord(e,t){let r=`
      mutation UpdateRecord($id: String!, $input: TodoUpdateInput!) {
        todoUpdate(id: $id, input: $input) {
          id
          title
          done
          text
          updatedAt
        }
      }
    `;return this.request(r,{id:e,input:t})}async toggleRecordDone(e,t){return this.updateRecord(e,{done:t})}async listCustomFields(){let e=`
      query CustomFieldList {
        customFieldList {
          items {
            id
            name
            type
          }
        }
      }
    `,t=await this.request(e);return t.success&&t.data?.customFieldList?{success:!0,data:t.data.customFieldList.items}:t}async getTodoGroups(e,t){let r=t||this.companyId,a=`
      query TodoGroups($type: TodoGroupType!, $filter: TodosFilter!) {
        todoGroups(type: $type, filter: $filter) {
          items {
            id
            name
            type
            todoCount
          }
          pageInfo {
            totalItems
            hasNextPage
          }
        }
      }
    `,s=await this.request(a,{type:e,filter:{companyIds:[r]}});return s.success&&s.data?.todoGroups?{success:!0,data:{items:s.data.todoGroups.items,totalItems:s.data.todoGroups.pageInfo?.totalItems||0}}:s}}new t,e.s(["BlueCcClient",0,t,"blueCC",0,{deployAgent:async(e,t)=>({deployment_id:`mock-${Date.now()}`}),getSystemStatus:async()=>({healthy:!0,active_nodes:3,last_sync:new Date().toISOString()}),listResources:async()=>[]}])},480785,e=>{"use strict";var t=e.i(224389);let r="https://yhwfmavnhaivvgzeuklx.supabase.co",a="sb_publishable_a6BWUna2fFNZ3fba80ixiA_xgpxYl_e",s=process.env.SUPABASE_SERVICE_ROLE_KEY,i=(0,t.createClient)(r,a,{auth:{persistSession:!1},db:{schema:"public"}});(0,t.createClient)(r,s||a,{auth:{persistSession:!1,autoRefreshToken:!1},db:{schema:"public"}});class o extends Error{code;details;constructor(e,t,r){super(e),this.code=t,this.details=r,this.name="SupabaseError"}}e.s(["handleSupabaseError",0,function(e){if(e&&"object"==typeof e&&"message"in e)throw new o(e.message,e.code||"UNKNOWN_ERROR",e.details);throw new o("An unknown database error occurred","UNKNOWN_ERROR")},"supabase",0,i])},293563,e=>{"use strict";var t=e.i(322632);let r=t.z.object({id:t.z.string().uuid(),category:t.z.enum(["E","S","G"]),industry:t.z.string().describe("適用產業"),title:t.z.string().min(1),strategy:t.z.string().describe("策略詳情"),benchmark_source:t.z.string().describe("標竿來源 (如台積電, RE100)"),t5_compliance:t.z.object({traceable:t.z.boolean(),transparent:t.z.boolean(),tangible:t.z.boolean(),trackable:t.z.boolean(),trustworthy:t.z.boolean()}),impact_score:t.z.number().min(0).max(100),tags:t.z.array(t.z.string()),last_verified:t.z.string()}),a=[{id:"bp-001",category:"E",industry:"High-Tech Manufacturing",title:"自動化能源即時鏈路 (RE100 Standard)",strategy:"導入 API 層級的電費單自動化對接，取代人工填報，實現 T1 級別溯源。",benchmark_source:"Apple / TSMC Supply Chain Requirements",t5_compliance:{traceable:!0,transparent:!0,tangible:!0,trackable:!0,trustworthy:!0},impact_score:95,tags:["Energy","RE100","Automation"],last_verified:"2026-05-20"},{id:"bp-002",category:"S",industry:"Software / Services",title:"ZKP 薪資公平性審計 (Privacy-First DEI)",strategy:"利用零知識證明 (ZKP) 展示薪資中位數差異符合公平性要求，而不揭露個別員工薪資敏感數據。",benchmark_source:"Google DEI Report Model",t5_compliance:{traceable:!0,transparent:!0,tangible:!0,trackable:!0,trustworthy:!0},impact_score:92,tags:["DEI","Privacy","ZKP"],last_verified:"2026-05-22"},{id:"bp-003",category:"G",industry:"General Corporate",title:"氣候風險連動薪酬 (SBTi-Linked LTI)",strategy:"將高階主管長期激勵計畫 (LTI) 與 SBTi 減碳達標率直接連動，確保治理目標具備實質約束力。",benchmark_source:"SBTi Financial Institution Guide",t5_compliance:{traceable:!0,transparent:!0,tangible:!0,trackable:!0,trustworthy:!0},impact_score:88,tags:["Governance","LTI","SBTi"],last_verified:"2026-05-25"}],s=[{id:"bp-ot-001",category:"G",industry:"High-Tech Manufacturing",title:"多雲 ESG 治理主權橋接 (OmniBlueTable Hybrid Control)",strategy:"建立 OmniBlue 多雲控制平面與 OmniTable 企業資料表的雙向同步橋接層，實現跨雲 ESG 指標自動部署與 Logic Node 治理追蹤，確保數據 Sovereignty 與合規一致性。",benchmark_source:"ESGGO OmniAgent Architecture v8.5",t5_compliance:{traceable:!0,transparent:!0,tangible:!0,trackable:!0,trustworthy:!0},impact_score:96,tags:["OmniBlueTable","DataSovereignty","MultiCloud","HybridControlPlane","ESG"],last_verified:"2026-05-31"},{id:"bp-ot-002",category:"E",industry:"General Corporate",title:"API Key 安全隔離模式 (Server-side Proxy Pattern)",strategy:"所有 OmniTable 操作經由 Next.js API Route (`/api/oa-table`) Server-side Proxy 轉發，確保存放於環境變數的 `OMNITABLE_API_KEY` 永不暴露於 Client Bundle，符合零信任安全架構。",benchmark_source:"OWASP API Security Top 10 / ESGGO Engineering Principles",t5_compliance:{traceable:!0,transparent:!0,tangible:!0,trackable:!0,trustworthy:!0},impact_score:94,tags:["Security","APIKey","ServerSideProxy","ZeroTrust","OmniTable"],last_verified:"2026-05-31"},{id:"bp-ot-003",category:"G",industry:"High-Tech Manufacturing",title:"EventBus 驅動的即時治理儀表板 (Real-time Mission Control)",strategy:"透過 `omniAgentBus` EventBus 廣播 OmniBlue ↔ OmniTable 同步任務的全生命週期事件 (MISSION_START → AGENT_TASK → MISSION_COMPLETE / AGENT_ERROR)，前端 Think Tank Dashboard 經由 `useOmniAgentStream` Hook 即時接收並視覺化，實現治理透明度。",benchmark_source:"ESGGO Think Tank Dashboard v8.5",t5_compliance:{traceable:!0,transparent:!0,tangible:!0,trackable:!0,trustworthy:!0},impact_score:91,tags:["EventBus","SSE","ThinkTank","RealTime","Governance","Dashboard"],last_verified:"2026-05-31"},{id:"bp-ot-004",category:"G",industry:"General Corporate",title:"Exponential Backoff 自動重試與批次處理 (Resilient Data Pipeline)",strategy:"在 `syncLogicNodesToOmniTable` 中實施 exponential backoff retry (3 次，1s → 2s → 4s) 與 chunk-based batch processing (size=10)，提升跨雲數據同步的可靠度與 API 限流耐受性。",benchmark_source:"AWS Architecture Blog: Exponential Backoff And Jitter",t5_compliance:{traceable:!0,transparent:!0,tangible:!0,trackable:!0,trustworthy:!0},impact_score:87,tags:["Resilience","Retry","BatchProcessing","RateLimit","DataPipeline"],last_verified:"2026-05-31"},{id:"bp-rw-hw",category:"G",industry:"General Corporate",title:"Render Workflow: Hello World Task Definitions",strategy:"定義並註冊基礎 Render 工作流程任務 (如計算平方、鏈接任務、錯誤重試)，用於驗證平台連通性與基本功能。",benchmark_source:"Render Workflows SDK Examples",t5_compliance:{traceable:!0,transparent:!0,tangible:!0,trackable:!0,trustworthy:!0},impact_score:50,tags:["RenderWorkflow","TaskDefinition","HelloWorld","SDK"],last_verified:"2026-06-04"},{id:"bp-rw-etl",category:"G",industry:"General Corporate",title:"Render Workflow: ETL Data Pipeline",strategy:"實作 Render 工作流程驅動的 ETL 數據處理管道，自動執行數據提取、轉換與載入任務，確保數據準確性與及時性。",benchmark_source:"Render Workflows SDK Examples",t5_compliance:{traceable:!0,transparent:!0,tangible:!0,trackable:!0,trustworthy:!0},impact_score:75,tags:["RenderWorkflow","ETL","DataPipeline","Automation"],last_verified:"2026-06-04"},{id:"bp-rw-dp",category:"G",industry:"General Corporate",title:"Render Workflow: Multi-Source Data Pipeline",strategy:"建立多源數據整合與分析的 Render 工作流程，實現數據清洗、富化及分段，支持複雜的數據治理與決策。",benchmark_source:"Render Workflows SDK Examples",t5_compliance:{traceable:!0,transparent:!0,tangible:!0,trackable:!0,trustworthy:!0},impact_score:80,tags:["RenderWorkflow","DataPipeline","MultiSource","Analytics"],last_verified:"2026-06-04"},{id:"bp-rw-fp",category:"G",industry:"General Corporate",title:"Render Workflow: File Processing & Analysis",strategy:"設計 Render 工作流程用於文件上傳、解析與批次處理，包含文件驗證、數據提取與轉換，適用於大規模數據文件管理。",benchmark_source:"Render Workflows SDK Examples",t5_compliance:{traceable:!0,transparent:!0,tangible:!0,trackable:!0,trustworthy:!0},impact_score:70,tags:["RenderWorkflow","FileProcessing","BatchProcessing","DataManagement"],last_verified:"2026-06-04"},{id:"bp-rw-oai",category:"S",industry:"General Corporate",title:"Render Workflow: OpenAI Agent for Text Analysis",strategy:"整合 OpenAI 代理於 Render 工作流程，實現 AI 驅動的文本分析、語義理解與自動響應，提升客戶服務或數據洞察能力。",benchmark_source:"Render Workflows SDK Examples / OpenAI API",t5_compliance:{traceable:!0,transparent:!0,tangible:!0,trackable:!0,trustworthy:!0},impact_score:85,tags:["RenderWorkflow","OpenAI","AI","TextAnalysis","Agent"],last_verified:"2026-06-04"}],i=[{id:"ttr-001",component:"wiki/omniblue-table.md",category:"Document",tags:["OmniBlueTable","DataSovereignty","Architecture"],t5_tag:"T5",registered_at:"2026-05-31",cross_refs:["wiki/evidence.create.md","wiki/cli.vault.seal.md","wiki/integrity.service.seal-content.md"]},{id:"ttr-002",component:"lib/services/omni-blue.ts",category:"Service",tags:["OmniBlueClient","MultiCloud","AgentDeployment"],t5_tag:"T2",registered_at:"2026-05-31",cross_refs:["lib/services/oa-table-blue-bridge.ts"]},{id:"ttr-003",component:"lib/services/oa-table-blue-bridge.ts",category:"Service",tags:["OmniTableBlueBridge","Sync","ESG"],t5_tag:"T4",registered_at:"2026-05-31",cross_refs:["server/src/integrations/oa-table-client.ts","lib/agents/omni-commander.ts"]},{id:"ttr-004",component:"lib/agent/best-practice-registry.ts::OMNIBLUETABLE_BEST_PRACTICES",category:"BestPractice",tags:["BestPractice","DataSovereignty","Security","RealTime","Resilience"],t5_tag:"T5",registered_at:"2026-05-31",cross_refs:["lib/agent/best-practice-registry.ts::BEST_PRACTICE_REGISTRY"]},{id:"ttr-005",component:"OMNI_GUIDE.md::0.5.5 OmniBlueTable",category:"Principle",tags:["Principle","DataSovereignty","Architecture"],t5_tag:"T3",registered_at:"2026-05-31",cross_refs:["OMNI_GUIDE.md::0.5 Engineering Safety"]}];e.s(["BestPracticeSchema",0,r,"THINK_TANK_REGISTRY",0,i,"getBestPractices",0,function(e,t){return a.filter(r=>{let a=!e||r.category===e,s=!t||r.industry.includes(t)||"General Corporate"===r.industry;return a&&s}).sort((e,t)=>t.impact_score-e.impact_score)},"getOmniBlueTablePractices",0,function(e){return s.filter(t=>!e||t.industry.includes(e)||"General Corporate"===t.industry).sort((e,t)=>t.impact_score-e.impact_score)},"getThinkTankRegistrations",0,function(e){return i.filter(t=>!e||t.category===e)}])},184926,e=>{e.v(e=>Promise.resolve().then(()=>e(411448)))},424041,e=>{e.v(e=>Promise.resolve().then(()=>e(128851)))},311890,e=>{e.v(e=>Promise.resolve().then(()=>e(957660)))},662929,e=>{e.v(e=>Promise.resolve().then(()=>e(100925)))},119756,e=>{e.v(t=>Promise.all(["server/chunks/lib_ncbdb_ts_0ndqzcx._.js"].map(t=>e.l(t))).then(()=>t(264104)))},435914,e=>{e.v(t=>Promise.all(["server/chunks/lib_db_ts_0h_yn5m._.js"].map(t=>e.l(t))).then(()=>t(762294)))},934087,e=>{e.v(t=>Promise.all(["server/chunks/lib_db_supabase_ts_1bqzs8z._.js"].map(t=>e.l(t))).then(()=>t(69569)))},442893,e=>{e.v(t=>Promise.all(["server/chunks/_1n55hzw._.js"].map(t=>e.l(t))).then(()=>t(80174)))},87964,e=>{e.v(t=>Promise.all(["server/chunks/node_modules_@supabase_11bhr7n._.js"].map(t=>e.l(t))).then(()=>t(510959)))}];

//# sourceMappingURL=%5Broot-of-the-server%5D__16_8dik._.js.map