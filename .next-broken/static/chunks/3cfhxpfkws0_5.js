(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,762756,e=>{"use strict";var r=e.i(843476),a=e.i(271645);e.s(["default",0,function(){let[e,s]=(0,a.useState)([]),[i,d]=(0,a.useState)(null),[t,o]=(0,a.useState)(!0),[n,l]=(0,a.useState)(null),c=(0,a.useCallback)(async()=>{o(!0);try{let e=await fetch("/api/omni-table/status"),r=await e.json();r.success&&(s(r.data.modules),d(r.data.summary),l(new Date))}catch(e){console.error("Status fetch failed",e)}finally{o(!1)}},[]);return(0,a.useEffect)(()=>{c()},[c]),(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)("style",{children:`
        :root {
          --primary: #63a6b0;
          --accent: #ffd700;
          --bg: #0d1117;
          --bg2: #161b22;
          --bg3: #21262d;
          --border: #30363d;
          --text: #e6edf3;
          --text-dim: #8b949e;
          --status-active: #3fb950;
          --status-error: #f85149;
          --status-unconfigured: #6e7681;
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Inter', system-ui, sans-serif; background: var(--bg); color: var(--text); }

        .admin-page { min-height: 100vh; padding: 2rem; max-width: 1200px; margin: 0 auto; }

        /* Header */
        .header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem; }
        .header-title { display: flex; align-items: center; gap: 0.75rem; }
        .header-title h1 { font-size: 1.5rem; font-weight: 700; }
        .header-title .badge { background: var(--primary); color: #fff; padding: 2px 10px; border-radius: 20px; font-size: 0.7rem; font-weight: 600; }
        .header-meta { color: var(--text-dim); font-size: 0.85rem; margin-top: 0.25rem; }

        .btn-refresh { background: var(--bg3); border: 1px solid var(--border); color: var(--text); padding: 0.5rem 1.25rem; border-radius: 8px; cursor: pointer; font-size: 0.875rem; transition: all 0.2s; display: flex; align-items: center; gap: 0.5rem; }
        .btn-refresh:hover { background: var(--primary); border-color: var(--primary); }
        .btn-refresh.spinning svg { animation: spin 1s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* Summary Cards */
        .summary-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem; margin-bottom: 2rem; }
        .summary-card { background: var(--bg2); border: 1px solid var(--border); border-radius: 12px; padding: 1.25rem 1.5rem; }
        .summary-card .value { font-size: 2rem; font-weight: 700; }
        .summary-card .label { color: var(--text-dim); font-size: 0.8rem; margin-top: 0.25rem; }
        .summary-card.active .value { color: var(--status-active); }
        .summary-card.error .value  { color: var(--status-error); }
        .summary-card.warn .value   { color: var(--accent); }

        /* Config Status */
        .config-row { display: flex; gap: 0.75rem; margin-bottom: 2rem; flex-wrap: wrap; }
        .config-pill { display: flex; align-items: center; gap: 0.5rem; background: var(--bg2); border: 1px solid var(--border); border-radius: 20px; padding: 0.4rem 1rem; font-size: 0.8rem; }
        .config-pill .dot { width: 8px; height: 8px; border-radius: 50%; }
        .config-pill .dot.ok  { background: var(--status-active); }
        .config-pill .dot.bad { background: var(--status-error); }

        /* Modules Grid */
        .modules-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 1rem; }

        .module-card { background: var(--bg2); border: 1px solid var(--border); border-radius: 12px; padding: 1.5rem; transition: border-color 0.2s, transform 0.2s; }
        .module-card:hover { border-color: var(--primary); transform: translateY(-2px); }
        .module-card.active { border-left: 3px solid var(--status-active); }
        .module-card.error   { border-left: 3px solid var(--status-error); }
        .module-card.unconfigured { border-left: 3px solid var(--status-unconfigured); opacity: 0.7; }

        .card-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem; }
        .card-icon-label { display: flex; align-items: center; gap: 0.75rem; }
        .card-icon { font-size: 1.5rem; }
        .card-label { font-weight: 600; font-size: 0.95rem; }
        .card-key { font-size: 0.75rem; color: var(--text-dim); margin-top: 2px; font-family: monospace; }

        .status-badge { padding: 3px 10px; border-radius: 20px; font-size: 0.75rem; font-weight: 600; white-space: nowrap; }
        .status-badge.active        { background: rgba(63,185,80,0.15); color: var(--status-active); }
        .status-badge.error         { background: rgba(248,81,73,0.15); color: var(--status-error); }
        .status-badge.unconfigured  { background: rgba(110,118,129,0.15); color: var(--text-dim); }

        .card-body { display: flex; flex-direction: column; gap: 0.6rem; }
        .info-row { display: flex; justify-content: space-between; align-items: center; font-size: 0.82rem; }
        .info-key { color: var(--text-dim); }
        .info-val { font-family: monospace; color: var(--text); max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .info-val.na { color: var(--text-dim); font-style: italic; font-family: inherit; }
        .record-count { font-size: 1.25rem; font-weight: 700; color: var(--primary); }

        .error-msg { margin-top: 0.75rem; padding: 0.5rem 0.75rem; background: rgba(248,81,73,0.08); border: 1px solid rgba(248,81,73,0.2); border-radius: 6px; font-size: 0.78rem; color: var(--status-error); }

        /* Setup hint */
        .setup-hint { margin-top: 2rem; background: var(--bg2); border: 1px solid var(--border); border-radius: 12px; padding: 1.5rem; }
        .setup-hint h3 { margin-bottom: 0.75rem; font-size: 0.95rem; }
        .setup-hint code { display: block; background: var(--bg3); padding: 0.75rem 1rem; border-radius: 8px; font-size: 0.85rem; color: var(--accent); margin-top: 0.5rem; }

        /* Loading skeleton */
        .skeleton { background: linear-gradient(90deg, var(--bg3) 25%, var(--bg2) 50%, var(--bg3) 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; border-radius: 6px; }
        @keyframes shimmer { to { background-position: -200% 0; } }
      `}),(0,r.jsxs)("div",{className:"admin-page",children:[(0,r.jsxs)("div",{className:"header",children:[(0,r.jsxs)("div",{children:[(0,r.jsxs)("div",{className:"header-title",children:[(0,r.jsx)("h1",{children:"OmniTable Admin"}),(0,r.jsx)("span",{className:"badge",children:"5T Protocol"})]}),(0,r.jsxs)("div",{className:"header-meta",children:["ESGGO 善向永續 × OmniBlueTable 模組狀態儀表板",n&&` \xb7 最後更新: ${n.toLocaleTimeString("zh-TW")}`]})]}),(0,r.jsxs)("button",{className:`btn-refresh${t?" spinning":""}`,onClick:c,disabled:t,children:[(0,r.jsxs)("svg",{width:"14",height:"14",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[(0,r.jsx)("path",{d:"M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"}),(0,r.jsx)("path",{d:"M21 3v5h-5"}),(0,r.jsx)("path",{d:"M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"}),(0,r.jsx)("path",{d:"M3 21v-5h5"})]}),"重新整理"]})]}),(0,r.jsxs)("div",{className:"config-row",children:[(0,r.jsxs)("div",{className:"config-pill",children:[(0,r.jsx)("div",{className:`dot ${i?.apiConfigured?"ok":"bad"}`}),"OMNITABLE_API_KEY: ",i?.apiConfigured?"已設定":"未設定"]}),(0,r.jsxs)("div",{className:"config-pill",children:[(0,r.jsx)("div",{className:`dot ${i?.spaceConfigured?"ok":"bad"}`}),"OMNITABLE_SPACE_ID: ",i?.spaceConfigured?"已設定":"未設定 (使用預設)"]})]}),i&&(0,r.jsxs)("div",{className:"summary-grid",children:[(0,r.jsxs)("div",{className:"summary-card",children:[(0,r.jsx)("div",{className:"value",children:i.total}),(0,r.jsx)("div",{className:"label",children:"核心模組總數"})]}),(0,r.jsxs)("div",{className:"summary-card active",children:[(0,r.jsx)("div",{className:"value",children:i.active}),(0,r.jsx)("div",{className:"label",children:"運行中模組"})]}),(0,r.jsxs)("div",{className:"summary-card warn",children:[(0,r.jsx)("div",{className:"value",children:i.unconfigured}),(0,r.jsx)("div",{className:"label",children:"待設定模組"})]}),(0,r.jsxs)("div",{className:"summary-card error",children:[(0,r.jsx)("div",{className:"value",children:i.error}),(0,r.jsx)("div",{className:"label",children:"連線失敗模組"})]})]}),t&&!i?(0,r.jsx)("div",{className:"modules-grid",children:Array.from({length:8}).map((e,a)=>(0,r.jsxs)("div",{className:"module-card",children:[(0,r.jsx)("div",{className:"skeleton",style:{height:"24px",width:"60%",marginBottom:"1rem"}}),(0,r.jsx)("div",{className:"skeleton",style:{height:"16px",marginBottom:"0.5rem"}}),(0,r.jsx)("div",{className:"skeleton",style:{height:"16px",width:"80%"}})]},a))}):(0,r.jsx)("div",{className:"modules-grid",children:e.map(e=>(0,r.jsxs)("div",{className:`module-card ${e.status}`,children:[(0,r.jsxs)("div",{className:"card-header",children:[(0,r.jsxs)("div",{className:"card-icon-label",children:[(0,r.jsx)("span",{className:"card-icon",children:e.icon}),(0,r.jsxs)("div",{children:[(0,r.jsx)("div",{className:"card-label",children:e.label}),(0,r.jsx)("div",{className:"card-key",children:e.key})]})]}),(0,r.jsx)("span",{className:`status-badge ${e.status}`,children:(e=>{switch(e){case"active":return"● 運行中";case"error":return"✕ 連線失敗";case"unconfigured":return"○ 未設定"}})(e.status)})]}),(0,r.jsxs)("div",{className:"card-body",children:[(0,r.jsxs)("div",{className:"info-row",children:[(0,r.jsx)("span",{className:"info-key",children:"Datasheet ID"}),e.datasheetId?(0,r.jsx)("span",{className:"info-val",title:e.datasheetId,children:e.datasheetId}):(0,r.jsx)("span",{className:"info-val na",children:"未設定"})]}),(0,r.jsxs)("div",{className:"info-row",children:[(0,r.jsx)("span",{className:"info-key",children:"Env Key"}),(0,r.jsx)("span",{className:"info-val",style:{fontSize:"0.72rem"},children:e.envKey})]}),(0,r.jsxs)("div",{className:"info-row",children:[(0,r.jsx)("span",{className:"info-key",children:"記錄總筆數"}),(0,r.jsx)("span",{className:"record-count",children:"active"===e.status?e.recordCount.toLocaleString():"—"})]})]}),e.error&&(0,r.jsx)("div",{className:"error-msg",children:e.error})]},e.key))}),i&&i.unconfigured>0&&(0,r.jsxs)("div",{className:"setup-hint",children:[(0,r.jsxs)("h3",{children:["🚀 有 ",i.unconfigured," 個模組尚未初始化"]}),(0,r.jsx)("p",{style:{color:"var(--text-dim)",fontSize:"0.85rem",marginTop:"0.25rem"},children:"執行以下指令建立所有 OmniBlueTable Datasheet，並將 ID 填入 .env.local："}),(0,r.jsx)("code",{children:"npm run omni:setup"}),(0,r.jsx)("p",{style:{color:"var(--text-dim)",fontSize:"0.8rem",marginTop:"0.75rem"},children:"僅執行特定模組："}),(0,r.jsx)("code",{children:"npm run omni:setup:esg-risk   # ESG 風險稽核"}),(0,r.jsx)("code",{style:{marginTop:"0.5rem"},children:"npm run omni:setup:compliance   # 合規引擎"})]})]})]})}])}]);