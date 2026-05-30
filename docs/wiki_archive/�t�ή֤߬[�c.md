# 系統核心架構

## 架構總覽
系統由六大層構成：

1. **前端體驗層**
   - Next.js
   - React
   - TypeScript
   - RWD 與 Mobile Bottom Navigation

2. **治理應用層**
   - Dashboard
   - SustainWrite
   - Digital Twin
   - Health Check
   - Advisory
   - Intelligence

3. **ESG 數據層**
   - Environmental
   - Social
   - Governance
   - Materiality
   - Finance
   - Supply Chain
   - Stakeholders

4. **治理確信層**
   - Audit Log
   - Evidence Vault
   - Hash Lock
   - ZKP 驗證
   - 5T 標籤

5. **AI 協作層**
   - Gemini 2.0
   - Genkit 流程
   - OmniHermes 合規掃描
   - SPIRIT 三大 AI 人格
   - Digital Twin RAG

6. **基礎設施層**
   - Supabase PostgreSQL
   - BlueCC Hybrid Control Plane
   - API Connectors
   - Resend Email
   - Hermes Gateway

## 核心設計思想
本平台的架構不是以單一頁面為核心，而是以「治理流程」為核心。  
也就是說，每個頁面不是孤立功能，而是共同參與以下流程：

**資料輸入 → 結構化治理 → AI 協作 → 證據追溯 → 稽核驗證 → 報告發佈 → 外部查核**

這使平台具備從內部治理到外部揭露的完整生命週期。