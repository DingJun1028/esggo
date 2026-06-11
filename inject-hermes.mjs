import fs from 'fs';

let content = fs.readFileSync('app/omni-agent/page.tsx', 'utf8');

// Replace Nous Research stuff
content = content.replace(/@nousresearch\/omniagent/g, '@esggo/omniagent');
content = content.replace(/Nous Research/g, 'ESGGO Core');
content = content.replace(/https:\/\/omniagent-agent.nousresearch.com\/docs\//g, 'https://esggo.com/omniagent-docs');
content = content.replace(/https:\/\/discord.gg\/NousResearch/g, 'https://esggo.com/community');
content = content.replace(/OMNIAGENT-AGENT SYSTEM/g, 'ESGGO OMNIAGENT SYSTEM');
content = content.replace(/OmniAgent Agent 系統/g, 'OmniAgent / OmniJules 系統');

// Replace specific sentences to include Hermes and Google Jules history
content = content.replace(
    `subtitle: '超越單純對話的自主代理：具備閉環學習、記憶固化與跨平台調度的 ESG 治理核心。',`,
    `subtitle: '超越單純對話的自主代理：以開源 Hermes 為原型進化的 OmniAgent，與承襲自 Google Jules 的 OmniJules，雙核驅動的 ESG 治理核心。',`
);

content = content.replace(
    `<h3 className="text-2xl font-black text-berkeley-blue mb-2 tracking-tight">OmniAgent Agent \+ ESG GO Quickstart</h3>`,
    `<h3 className="text-2xl font-black text-berkeley-blue mb-2 tracking-tight">OmniAgent (Hermes Core) & OmniJules (Jules Core)</h3>`
);

content = content.replace(
    `<p className="text-sm text-slate-500 font-medium">從零開始構建您的 5T 誠信代理蜂群</p>`,
    `<p className="text-sm text-slate-500 font-medium">將開源 Hermes 與 Google Jules 轉化為 ESGGO 專屬的萬能代理蜂群</p>`
);

content = content.replace(
    `整合 Nous Research 認證體系，每一筆指令均附帶 Actor ID 與 Policy Guard 決策雜湊，`,
    `繼承開源架構並轉化為 ESGGO 專屬體系。我們將 Hermes 的跨平台特性與 Google Jules 的萬能果因邏輯完美融合，每一筆指令均附帶 5T 決策雜湊，`
);

content = content.replace(
    `1. Install OmniAgent Agent`,
    `1. 載入 OmniAgent (Hermes 原型)`
);

content = content.replace(
    `4. Activate Agent Zero`,
    `4. 喚醒 OmniJules (Google Jules)`
);

content = content.replace(
    `Enable system-level execution and sub-agent spawning for autonomous ops.`,
    `啟動具備萬能果因協議 (Karma Protocol) 的 OmniJules，執行底層修復與演化。`
);

content = content.replace(
    `import { createAgent } from '@google/adk';\\n\\nconst esgResearcher = createAgent({\\n  name: 'ESG_Researcher_Agent',\\n  role: 'Sustainability Data Analyst'\\n});`,
    `import { createOmniAgent } from '@esggo/omniagent';\\n\\nconst omniAgent = createOmniAgent({\\n  core: 'hermes',\\n  role: 'OmniAgent (ESG Master)'\\n});`
);

content = content.replace(
    `docker run -it -v $(pwd):/workspace agent0ai/agent-zero\\n# AgentZ0 will now monitor and execute autonomously.`,
    `docker run -it -v $(pwd):/workspace esggo/omni-jules\\n# OmniJules (Google Jules Core) will now self-heal autonomously.`
);

fs.writeFileSync('app/omni-agent/page.tsx', content);
console.log('OmniAgent concepts injected!');
