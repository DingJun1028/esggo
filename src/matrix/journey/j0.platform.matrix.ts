/**
 * J0 平台層 Platform · 產品功能終始矩陣 canonical
 * 產物形態：身分驗證與基礎設施（非永續產物，故不屬六流）
 * source_origin: apps/ftg-journey-server/server.js:283-442 實掃（2026-10-01）
 */

import type { JourneyCell } from './types';

export const J0_PLATFORM: JourneyCell[] = [
  {
    pillar: 'memory',
    endState: 'users / journeys_members / badges / user_badges 四張表構成單一帳號與權限模型，無第二套使用者來源。',
    startChain: '維持 Google OAuth 為唯一登入途徑；確認無遗留的本地密碼帳號路徑。',
    probe: 'apps/ftg-journey-web/src/pages/LoginPage.jsx 存在',
  },
  {
    pillar: 'time',
    endState: 'token 有明確過期與 refresh 流程；過期時前端自動 refresh，不必讓使用者重新登入。',
    startChain: 'POST /api/refresh 已存在；確認 AuthContext 在 401 時自動重試一次。',
    probe: 'apps/ftg-journey-web/src/contexts/AuthContext.jsx 存在',
  },
  {
    pillar: 'space',
    endState: '本機 PORT/DB_PATH 與 JWT_SECRET 可用環境變數覆寫，VPS 與本機跑同一份程式碼。',
    startChain: '維持現況（JWT_SECRET 未設即 exit 1 的 fail-fast 閘門），並把該行為寫入 README。',
    probe: 'apps/ftg-journey-server/jwt-gate.test.js 存在',
  },
  {
    pillar: 'causality',
    endState: '每個業務端點有 requireAccess 檢查；無「知道 id 就能讀別人旅程」的越權路徑。',
    startChain: '逐一盤點 42 條端點的授權覆蓋率，缺 requireAccess 的補上。',
    probe: 'apps/ftg-journey-server/server.js 存在',
  },
  {
    pillar: 'immortal',
    endState: 'JWT_SECRET 與 OAuth 憑證只存在 VPS 環境變數與 secret vault，不進 git、不進前端 bundle。',
    startChain: '以 secret 掃描確認 repo 無憑證；前端只讀 VITE_API_BASE。',
    probe: 'apps/ftg-journey-server/esg-tasks.test.js 存在',
  },
  {
    pillar: 'circular',
    endState: '健康檢查（GET /health）回報服務狀態，部署後可機器驗證而非人工開瀏覽器試。',
    startChain: '/health 已有；擴充為回報 DB 可寫入與版本號，部署守門直接打這支。',
    probe: 'apps/ftg-journey-server/Dockerfile 存在',
  },
];

export default J0_PLATFORM;
