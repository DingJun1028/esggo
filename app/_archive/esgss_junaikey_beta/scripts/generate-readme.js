const fs = require('fs');
const path = require('path');

const readme = `# ESGss x JunAiKey Beta - 以終為始，止於至善的永續智慧系統

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Version](https://img.shields.io/badge/version-v7.0.0--sentient-brightgreen)](https://github.com/DingJun1028/esgss_junaikey_beta)
[![Status](https://img.shields.io/badge/Status-Production-success)](https://esg-dashboard-c3ytffo5qq-de.a.run.app)

> **以終為始，止於至善** - "Begin with the End in Mind, Goodness towards Sustainability"

ESGss x JunAiKey Beta 是新一代 ESG（環境、社會、治理）轉型平台，整合 AI 智能模組、區塊鏈信任機制、覺醒體驗，為企業和個人打造永續發展的智慧系統。

**🌐 Live Demo:** https://esg-dashboard-c3ytffo5qq-de.a.run.app

---

## 📑 目錄

- [核心特色](#-核心特色)
- [系統演進](#-系統演進)
- [5T 不可篡改協議](#-5t-不可篡改協議)
- [功能模組](#-功能模組)
- [Omni 系統](#-omni-系統)
- [AI 智能層](#-ai-智能層)
- [覺醒系統](#-覺醒系統)
- [去中心化信任](#-去中心化信任)
- [技術棧](#-技術棧)
- [快速開始](#-快速開始)
- [部署指南](#-部署指南)
- [API 文件](#-api-文件)

---

## 🌟 核心特色

### 🏛️ 四大支柱

1. **簡單 (Simple)** - 低學習曲線、直覺操作
2. **快速 (Fast)** - 高效運算、智能異步處理
3. **好玩 (Fun)** - 遊戲化體驗、成就系統、社交互動
4. **實用 (Practical)** - 貼近真實世界、符合法規、可追溯

### 🎯 關鍵亮點

- 🌱 **智能 ESG 數據分析** - AI 驅動的 ZKP 驗證區塊鏈存證
- 🎮 **遊戲化永續轉型** - ESG Go! 任務系統與成就解鎖
- 🔐 **去中心化信任機制** - 區塊鏈錨定零知識證明的 5T 協議
- 🤖 **高效 AI 智能** - Gemini 2.0、LangGraph Swarm、RAG

---

## 🚀 系統演進

### Roadmap V6.0 - Universe 🌌

- ✅ Redis + BullMQ 任務基礎設施
- ✅ Gemini 2.0 Flash + LangGraph Swarm
- ✅ 區塊鏈錨定 + ZKP 驗證
- ✅ OmniUI 1.0 設計系統

### Roadmap V7.0 - Sentient 🧠

- ✅ 雙側同步覺醒（Bilateral Synchronization）
- ✅ 智能意圖引擎
- ✅ 超個性化推薦
- ✅ 自主網絡協作

---

## 🔒 5T 不可篡改協議

### 可溯源 (Traceable)
- UUID 追蹤每個數據
- 完整數據流路徑記錄

### 可追蹤 (Trackable)
- 實時實作監控
- OmniLogger 4T 日誌

### 可透明驗算 (Transparent)
- 公開算法驗證
- ESG 計算公式

### 可感知 (Tangible)
- 具體影響指標
- 視覺化呈現

### 不可篡改 (Trustworthy)
- 區塊鏈錨定
- 永恆宮殿存儲

**實現示例 (TypeScript)**:
\`\`\`typescript
import { omniLogger } from '@/omni/infrastructure/logging/omniLogger';

// 5T 協議日誌
omniLogger.info('ESG 數據記錄', {
  traceId: 'uuid-12345',           // Traceable
  source: 'ESGReportService',      // Trackable
  hash: 'sha256-abc123',           // Transparent
  blockchainAnchor: 'txn-xyz789'   // Trustworthy
});
\`\`\`

---

## 📦 功能模組

### 1️⃣ 身份管理
- **Omni-Alliance** - 跨平台身份系統
- **Omni-Village** - 部落社群
- **Onboarding Tour** - 引導導覽

### 2️⃣ 行為激勵
- **ESG Go!** - 遊戲化任務系統
- **成就系統** - 徽章與行為獎勵

### 3️⃣ 數據產生工具
- **Omni-Tools** - 浮動工具套件
- **Bento Dashboard** - 高密度儀表板
- **War Room** - 戰情室監控

### 4️⃣ 治理機制
- **合規管理** - 法規檢查
- **智能報告** - AI 自動撰寫

---

## 🔮 Omni 系統

### OmniLogger
**用途**: 5T 協議日誌系統

\`\`\`typescript
import { omniLogger } from '@/omni/infrastructure/logging/omniLogger';

omniLogger.info('用戶操作', {
  userId: 'user-123',
  action: 'login',
  timestamp: new Date().toISOString()
});
\`\`\`

### OmniCrystal
**用途**: 數據主權加密引擎

\`\`\`typescript
import { OmniCrystal } from '@/omni/core/OmniCrystal';

const crystal = new OmniCrystal();
const encrypted = await crystal.encrypt(sensitiveData);
\`\`\`

---

## 🤖 AI 智能層

### Gemini 2.0 Flash

\`\`\`typescript
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!);
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

const result = await model.generateContent('分析 ESG 報告');
\`\`\`

### LangGraph Swarm

\`\`\`typescript
interface ESGAgent {
  id: string;
  specialty: 'E' | 'S' | 'G';
  analyze(data: ESGData): Promise<Analysis>;
}

class EnvironmentAgent implements ESGAgent {
  id = 'e-specialist';
  specialty: 'E' = 'E';
  
  async analyze(data: ESGData): Promise<Analysis> {
    // 環境分析邏輯
    return { category: 'E', insights: [...] };
  }
}
\`\`\`

---

## 🧘 覺醒系統

### 四大支柱

\`\`\`typescript
interface AwakeningPillars {
  selfAwareness: number;    // 自覺 0-100
  enlightenment: number;    // 覺醒 0-100
  selfReliance: number;     // 自立 0-100
  altruism: number;         // 利他 0-100
}

interface AwakeningEvent {
  id: string;
  type: string;
  pillars: AwakeningPillars;
  timestamp: Date;
}
\`\`\`

---

## 🔐 去中心化信任

### 零知識證明 (ZKP)

\`\`\`typescript
import { ZKPService } from '@/services/blockchain/ZKPService';

const zkpService = new ZKPService();

// 生成證明
const proof = await zkpService.generateProof({
  data: esgData,
  publicInputs: ['hash-abc']
});

// 驗證證明
const isValid = await zkpService.verifyProof(proof);
\`\`\`

### 區塊鏈錨定

\`\`\`typescript
import { BlockchainAnchorService } from '@/services/blockchain/BlockchainAnchorService';

const anchorService = new BlockchainAnchorService();

// 錨定數據
const anchor = await anchorService.anchor({
  dataHash: 'sha256-abc123',
  timestamp: new Date()
});

console.log(\`Blockchain TX: \${anchor.transactionId}\`);
\`\`\`

---

## 🛠 技術棧

### 前端
- **React** 18.3.1 + **TypeScript** 5.3.3
- **Vite** 5.0.8 + **TailwindCSS** 3.4.0
- **Zustand** (狀態管理)
- **React Router** v6

### 後端
- **Node.js** 20+ + **Express.js**
- **PostgreSQL** 15 + **Redis** 7
- **BullMQ** (任務佇列)
- **TypeScript** (全棧類型安全)

### AI & ML
- **Google Generative AI** (Gemini 2.0)
- **LangGraph** + **LangChain**
- **pgvector** (向量檢索)

### 區塊鏈
- **snarkjs** + **circom** (ZKP)
- **crypto** (加密)

### 基礎設施
- **Docker** + **Docker Compose**
- **Google Cloud Run**
- **Vercel**

---

## 🚀 快速開始

### 安裝

\`\`\`bash
# 複製專案庫
git clone https://github.com/DingJun1028/esgss_junaikey_beta.git
cd esgss_junaikey_beta

# 安裝依賴
npm install
cd server && npm install && cd ..

# 配置環境
cp .env.example .env
\`\`\`

### 環境變數

\`\`\`bash
# .env
NODE_ENV=development
PORT=8080

# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/esg_db

# Redis
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your-secret-key

# Google AI
GOOGLE_AI_API_KEY=your-api-key
\`\`\`

### 啟動服務

\`\`\`bash
# 使用 Docker Compose (推薦)
docker-compose up

# 或本地開發
npm run dev
\`\`\`

訪問: http://localhost:5173

---

## 🚢 部署指南

### Google Cloud Run

\`\`\`bash
# 使用腳本部署
.\\deploy-cloudrun.ps1

# 或手動部署
gcloud run deploy esg-dashboard \\
  --image gcr.io/PROJECT_ID/esg-dashboard \\
  --platform managed \\
  --region asia-east1
\`\`\`

### Vercel

\`\`\`bash
# 安裝 Vercel CLI
npm i -g vercel

# 部署
vercel --prod
\`\`\`

---

## 📚 API 文件

### 認證 API

\`\`\`typescript
// POST /api/auth/register
interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  organization: string;
}

interface RegisterResponse {
  success: boolean;
  data: {
    user: User;
    token: string;
  };
}
\`\`\`

### ESG API

\`\`\`typescript
// GET /api/esg/reports
interface ESGReportQuery {
  page?: number;
  limit?: number;
  status?: 'draft' | 'published' | 'archived';
}

interface ESGReportResponse {
  success: boolean;
  data: {
    reports: ESGReport[];
    total: number;
    page: number;
  };
}
\`\`\`

### 覺醒 API

\`\`\`typescript
// GET /api/awakening/score
interface AwakeningScoreResponse {
  success: boolean;
  data: {
    selfAwareness: number;
    enlightenment: number;
    selfReliance: number;
    altruism: number;
    total: number;
    level: string;
  };
}
\`\`\`

完整 API 文件: [API_REFERENCE.md](./API_REFERENCE.md)

---

## 👨‍💻 開發者指南

### 專案結構

\`\`\`
src/
├── components/          # React 組件
├── services/           # 服務層 (TypeScript)
├── omni/               # Omni 模組
├── store/              # Zustand Store
├── types/              # TypeScript 類型定義

server/
├── src/
│   ├── routes/         # API 路由 (TypeScript)
│   ├── services/       # 業務邏輯
│   ├── middleware/     # 中介軟體
\`\`\`

### 新建組件範例

\`\`\`typescript
// src/components/MyComponent.tsx
import React from 'react';

interface MyComponentProps {
  title: string;
  data: ESGData;
}

export const MyComponent: React.FC<MyComponentProps> = ({ title, data }) => {
  return (
    <div className="my-component">
      <h2>{title}</h2>
      {/* 組件邏輯 */}
    </div>
  );
};
\`\`\`

### 新建服務

\`\`\`typescript
// src/services/myService.ts
import { omniLogger } from '@/omni/infrastructure/logging/omniLogger';

export class MyService {
  async fetchData(): Promise<ESGData> {
    omniLogger.info('Fetching data');
    
    const response = await fetch('/api/data');
    return response.json();
  }
}
\`\`\`

### 新建 API 端點

\`\`\`typescript
// server/src/routes/myapi.ts
import express, { Request, Response } from 'express';

const router = express.Router();

interface MyRequest extends Request {
  body: {
    data: string;
  };
}

router.post('/endpoint', async (req: MyRequest, res: Response) => {
  try {
    const { data } = req.body;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
\`\`\`

---

## 📄 License

MIT License - 詳見 [LICENSE](LICENSE) 文件

---

## 🤝 Contributing

歡迎貢獻！請閱讀 [CONTRIBUTING.md](./CONTRIBUTING.md) 了解詳情。

---

## 📞 Contact

- **Email:** support@esgss.com
- **Website:** https://esgss.com
- **GitHub:** https://github.com/DingJun1028/esgss_junaikey_beta

---

> 以終為始，止於至善 - Begin with the End in Mind, Goodness towards Sustainability
`;

// Write README
const readmePath = path.join(__dirname, '..', 'README.md');
fs.writeFileSync(readmePath, readme, 'utf8');
console.log('README.md generated successfully!');
