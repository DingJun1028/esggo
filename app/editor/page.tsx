'use client';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  FileText, ChevronRight, ChevronDown, Check, X,
  Sparkles, Shield, BookOpen, Upload, BarChart3,
  RefreshCw, Save, Download, Eye, Edit3, Plus,
  AlertTriangle, CheckCircle, Clock, Lock,
  FileCheck, Users, Leaf, Building2, Zap,
} from 'lucide-react';
import { logAudit, simpleHash } from '../../lib/db';

// ── GRI Chapter Data ───────────────────────────────────────────────────────
interface DocItem { id: string; name: string; department: string; required: boolean; uploaded?: boolean; }
interface DataField { id: string; label: string; unit: string; gri: string; value?: string; }
interface Chapter {
  id: string;
  num: string;
  title: string;
  titleEn: string;
  gri: string;
  category: 'G' | 'E' | 'S';
  estPages: number;
  docs: DocItem[];
  fields: DataField[];
  expertTemplates: { persona: 'compliance' | 'harmony' | 'innovation'; text: string }[];
  benchmark: { company: string; excerpt: string };
}

const CHAPTERS: Chapter[] = [
  {
    id: 'general',
    num: '01',
    title: '組織概況與治理架構',
    titleEn: 'General Disclosures',
    gri: 'GRI 2-1 ~ 2-5',
    category: 'G',
    estPages: 18,
    docs: [
      { id: 'd1', name: '公司組織章程', department: '法務部', required: true },
      { id: 'd2', name: '年度財務報告（稽核後）', department: '財務部', required: true },
      { id: 'd3', name: '報告書範疇說明書', department: 'ESG 辦公室', required: true },
      { id: 'd4', name: '永續政策聲明書', department: '高層管理', required: true },
      { id: 'd5', name: '主要子公司清單', department: '財務部', required: false },
    ],
    fields: [
      { id: 'f1', label: '公司名稱', unit: '', gri: 'GRI 2-1', value: '' },
      { id: 'f2', label: '員工人數', unit: '人', gri: 'GRI 2-7', value: '' },
      { id: 'f3', label: '營業收入', unit: '新台幣千元', gri: 'GRI 2-5', value: '' },
      { id: 'f4', label: '資本額', unit: '新台幣千元', gri: 'GRI 2-5', value: '' },
      { id: 'f5', label: '服務據點數', unit: '處', gri: 'GRI 2-1', value: '' },
    ],
    expertTemplates: [
      { persona: 'compliance', text: '本公司依據 GRI 2021《一般揭露》標準，就組織基本資訊進行完整說明。本報告書範疇涵蓋台灣總部及所有合併子公司，報告期間為 {YEAR} 年度（1月1日至12月31日）。本公司資本額為新台幣 {CAPITAL} 元，全球員工人數共計 {EMPLOYEES} 人，提供 {LOCATIONS} 處服務據點，業務範圍涵蓋 {INDUSTRY}。報告書依照 GRI 2021 全套框架編製，並取得第三方確信（ISSA 5000）。' },
      { persona: 'harmony', text: '本公司成立以來，秉持「善向永續、共創共榮」的核心理念，將 ESG 治理融入企業文化的每一個層面。我們深信，企業的長期競爭力不僅來自財務績效，更來自對利害關係人、社區與環境的正向貢獻。本年度報告書揭示公司在永續發展路徑上的具體行動與成果，並承諾持續透明揭露，與所有利害關係人建立長期信任關係。' },
      { persona: 'innovation', text: '面對全球供應鏈 ESG 盡職調查浪潮、CBAM 碳邊境機制及 ISSB 氣候揭露標準的多重壓力，本公司超前部署永續轉型策略，建立以數位化 5T 誠信協議為核心的 ESG 數據治理體系。透過整合 ISO 14064-1 溫室氣體盤查、SBTi 科學基礎目標設定及第三方 ZKP 零知識驗算，確保每一筆揭露數據的可溯源性與不可篡改性，為企業創造差異化的信任資產。' },
    ],
    benchmark: {
      company: '台積電 2023 年永續報告書',
      excerpt: '本公司依GRI 2021標準揭露，報告期間涵蓋台灣、美國、日本及歐洲所有主要營運單位，並取得安侯建業會計師事務所有限確信聲明。',
    },
  },
  {
    id: 'materiality',
    num: '02',
    title: '重大性評估與利害關係人議合',
    titleEn: 'Materiality & Stakeholders',
    gri: 'GRI 2-29 / GRI 3-1~3-3',
    category: 'G',
    estPages: 20,
    docs: [
      { id: 'd6', name: '利害關係人問卷調查結果', department: 'ESG 辦公室', required: true },
      { id: 'd7', name: '深度訪談紀錄', department: 'ESG 辦公室', required: true },
      { id: 'd8', name: '重大議題決策會議紀錄', department: '永續委員會', required: true },
      { id: 'd9', name: '利害關係人識別與參與紀錄', department: 'ESG 辦公室', required: false },
    ],
    fields: [
      { id: 'f6', label: '識別之利害關係人群體數', unit: '個', gri: 'GRI 2-29', value: '' },
      { id: 'f7', label: '問卷回收率', unit: '%', gri: 'GRI 3-1', value: '' },
      { id: 'f8', label: '確認之重大議題數', unit: '項', gri: 'GRI 3-2', value: '' },
    ],
    expertTemplates: [
      { persona: 'compliance', text: '本公司依 GRI 3-1 至 3-3 雙重重大性評估方法，識別對公司財務績效具有重大影響，及本公司對經濟、環境、社會造成重大衝擊的 ESG 議題。評估流程分為四階段：（1）議題盤點、（2）利害關係人議合、（3）重大性評分矩陣分析、（4）董事會審議確認。本年度共識別 {TOPICS} 項重大議題，其中 E/S/G 各占 {DISTRIBUTION}。' },
      { persona: 'harmony', text: '本公司透過多元管道與利害關係人進行深度對話，包含員工滿意度調查、客戶焦點訪談、供應商議合會議及社區說明會。本年度共觸及 {STAKEHOLDERS} 個利害關係人群體，問卷有效回收 {RESPONSES} 份，回收率達 {RATE}%。透過聆聽各方聲音，我們確保重大議題的識別真實反映社會期待，而非企業單向定義。' },
      { persona: 'innovation', text: '本公司導入 AI 輔助重大性分析工具，整合 ESG 評分機構數據、媒體輿情監測及國際法規趨勢，動態更新議題重要性排序。結合 GRI 3-1 雙重重大性矩陣與 ISSB S1 財務重大性框架，建立跨框架的統一重大性評估方法論，有效降低揭露遺漏風險達 40%。' },
    ],
    benchmark: {
      company: '鴻海 2023 年永續報告書',
      excerpt: '本公司採GRI雙重重大性評估，識別17項重大ESG議題，並透過全球員工、客戶、供應商及非政府組織的多方議合，確保評估結果的代表性與完整性。',
    },
  },
  {
    id: 'ghg',
    num: '03',
    title: '溫室氣體盤查與排放管理',
    titleEn: 'GHG Emissions',
    gri: 'GRI 305-1 ~ 305-5',
    category: 'E',
    estPages: 24,
    docs: [
      { id: 'd10', name: 'ISO 14064-1 盤查清冊', department: '環安衛', required: true },
      { id: 'd11', name: '查證聲明書', department: '環安衛', required: true },
      { id: 'd12', name: '冷媒填充紀錄', department: '廠務', required: true },
      { id: 'd13', name: '燃料採購發票', department: '廠務', required: true },
    ],
    fields: [
      { id: 'f9', label: '範疇一直接排放', unit: 'tCO₂e', gri: 'GRI 305-1', value: '' },
      { id: 'f10', label: '範疇二間接排放', unit: 'tCO₂e', gri: 'GRI 305-2', value: '' },
      { id: 'f11', label: '範疇三排放量（已揭露項目）', unit: 'tCO₂e', gri: 'GRI 305-3', value: '' },
      { id: 'f12', label: '碳排放強度', unit: 'tCO₂e/百萬營收', gri: 'GRI 305-4', value: '' },
      { id: 'f13', label: '碳排放減少量（相較基準年）', unit: 'tCO₂e', gri: 'GRI 305-5', value: '' },
    ],
    expertTemplates: [
      { persona: 'compliance', text: '本公司依照 ISO 14064-1:2018 標準進行溫室氣體盤查，並委託第三方驗證機構取得有限確信聲明。{YEAR} 年度溫室氣體排放量如下：範疇一直接排放 {SCOPE1} 公噸二氧化碳當量（tCO₂e）、範疇二間接排放 {SCOPE2} tCO₂e（市場基礎法）、範疇三已揭露項目排放 {SCOPE3} tCO₂e。所有計算採用最新版 IPCC 全球暖化潛勢值（GWP），電力排放係數採用台電年度公告值。' },
      { persona: 'harmony', text: '氣候變遷是本公司面臨的最重大永續課題之一。我們積極推動全價值鏈的減碳行動，不僅管理自身的範疇一與範疇二排放，更攜手供應鏈夥伴共同盤查範疇三排放。透過設定科學基礎減碳目標（SBTi），我們承諾於 2030 年前將溫室氣體排放強度較基準年降低 46%，與 1.5°C 氣候目標保持一致。' },
      { persona: 'innovation', text: '本公司率先業界導入即時碳排監測系統，透過 IoT 感測器串接生產設備，實現範疇一排放的逐日追蹤。結合 AI 預測模型，系統可提前 30 天預測月度碳排超標風險，並自動觸發節能應急措施。此外，本公司已完成 CBAM 影響評估，對歐盟出口產品的產品碳足跡均取得 ISO 14067 認證，確保零關稅壁壘風險。' },
    ],
    benchmark: {
      company: '台達電子 2023 年永續報告書',
      excerpt: '台達電2023年合併範疇一+範疇二排放量為315,876 tCO₂e，碳排放強度為0.027 tCO₂e/千美元，已完成SBTi驗證並設定2030減碳46%目標。',
    },
  },
  {
    id: 'energy',
    num: '04',
    title: '能源管理',
    titleEn: 'Energy Management',
    gri: 'GRI 302-1 ~ 302-4',
    category: 'E',
    estPages: 16,
    docs: [
      { id: 'd14', name: '台電帳單（12個月）', department: '總務/廠務', required: true },
      { id: 'd15', name: '綠電採購憑證（T-REC）', department: '廠務', required: false },
      { id: 'd16', name: '油資發票或採購單', department: '廠務', required: true },
    ],
    fields: [
      { id: 'f14', label: '總用電量', unit: 'kWh', gri: 'GRI 302-1', value: '' },
      { id: 'f15', label: '化石燃料使用量', unit: 'GJ', gri: 'GRI 302-1', value: '' },
      { id: 'f16', label: '再生能源使用比例', unit: '%', gri: 'GRI 302-1', value: '' },
      { id: 'f17', label: '能源強度', unit: 'kWh/百萬營收', gri: 'GRI 302-3', value: '' },
      { id: 'f18', label: '能源節約量', unit: 'GJ', gri: 'GRI 302-4', value: '' },
    ],
    expertTemplates: [
      { persona: 'compliance', text: '本公司依 GRI 302 能源標準揭露各類能源使用情況。{YEAR} 年度總用電量為 {ELECTRICITY} 度（kWh），其中再生能源比例達 {RENEWABLE}%，已採購 T-REC 綠電憑證 {TREC} 度。化石燃料使用量折合 {FOSSIL} GJ，涵蓋天然氣、柴油及汽油。能源強度較去年改善 {IMPROVEMENT}%，達到年度節能目標。' },
      { persona: 'harmony', text: '能源效率提升不僅降低碳排放，更直接節省企業營運成本。本公司推動全員節能文化，從辦公室照明改採 LED、製程設備導入變頻馬達，到建立能源管理系統（ISO 50001），每一項措施都源自員工自主提案。{YEAR} 年度員工節能提案共計 {PROPOSALS} 件，實現節電 {SAVINGS} 度，折合節省電費新台幣 {COST_SAVINGS} 萬元。' },
      { persona: 'innovation', text: '本公司建置智慧能源管理平台（SEMS），整合廠區所有用電設備的即時數據，透過機器學習演算法識別能耗異常並自動優化生產排程。{YEAR} 年度透過 SEMS 實現節電 {SMART_SAVINGS} 度，較傳統人工管理提升效率 35%。此外，屋頂太陽能裝置容量已達 {SOLAR} kWp，年度自發電量約 {SELF_POWER} 萬度，自給率提升至 {SELF_RATE}%。' },
    ],
    benchmark: {
      company: '友達光電 2023 年永續報告書',
      excerpt: '友達2023年再生能源使用比例達75.3%，能源強度較2017基準年降低33%，獲RE100成員資格，目標2050年100%再生能源。',
    },
  },
  {
    id: 'water',
    num: '05',
    title: '水資源管理',
    titleEn: 'Water & Effluents',
    gri: 'GRI 303-1 ~ 303-5',
    category: 'E',
    estPages: 14,
    docs: [
      { id: 'd17', name: '自來水帳單', department: '廠務/環安衛', required: true },
      { id: 'd18', name: '水權狀', department: '廠務', required: false },
      { id: 'd19', name: '廢水處理廠水質檢測報告', department: '環安衛', required: true },
    ],
    fields: [
      { id: 'f19', label: '總取水量', unit: 'm³', gri: 'GRI 303-3', value: '' },
      { id: 'f20', label: '廢水排放量', unit: 'm³', gri: 'GRI 303-4', value: '' },
      { id: 'f21', label: '水資源回收再利用率', unit: '%', gri: 'GRI 303-5', value: '' },
    ],
    expertTemplates: [
      { persona: 'compliance', text: '本公司依 GRI 303 水資源標準進行揭露，評估水資源壓力地區的取水風險。{YEAR} 年度總取水量為 {WATER_INTAKE} 立方公尺，廢水排放量 {WATER_DISCHARGE} 立方公尺，水資源回收再利用率達 {RECYCLE_RATE}%。廠區廢水處理達到放流水標準，定期委託環保局認可實驗室檢測，全年度無違規事件。' },
      { persona: 'harmony', text: '水是生命之源，也是台灣日益珍貴的資源。本公司在生產過程中積極推動節水措施，包含製程用水循環再利用、雨水收集系統及員工節水行為宣導。我們關注廠區所在地的水資源壓力，並與地方政府及社區共同規劃永續水資源管理策略。' },
      { persona: 'innovation', text: '本公司投入新台幣 {INVESTMENT} 萬元建置先進廢水處理回收系統，採用薄膜生物反應器（MBR）技術，將廢水回收率提升至 {RECYCLE_RATE}%。結合數位水錶及 AI 漏水預警系統，有效降低管線水損率至 {LOSS_RATE}% 以下，年度節水效益達 {WATER_SAVINGS} 噸。' },
    ],
    benchmark: {
      company: '台灣大哥大 2023 年永續報告書',
      excerpt: '台灣大哥大2023年取水強度較2019基準年降低18%，新北市機房導入雨水回收系統，年節水量達1,500公噸。',
    },
  },
  {
    id: 'waste',
    num: '06',
    title: '廢棄物管理',
    titleEn: 'Waste',
    gri: 'GRI 306-1 ~ 306-5',
    category: 'E',
    estPages: 14,
    docs: [
      { id: 'd20', name: '廢棄物清運聯單', department: '環安衛', required: true },
      { id: 'd21', name: '回收商合法執照', department: '環安衛', required: true },
      { id: 'd22', name: '處理廠過磅單', department: '環安衛', required: true },
    ],
    fields: [
      { id: 'f22', label: '有害廢棄物總量', unit: '公噸', gri: 'GRI 306-3', value: '' },
      { id: 'f23', label: '一般廢棄物總量', unit: '公噸', gri: 'GRI 306-4', value: '' },
      { id: 'f24', label: '資源回收率', unit: '%', gri: 'GRI 306-5', value: '' },
    ],
    expertTemplates: [
      { persona: 'compliance', text: '{YEAR} 年度本公司廢棄物管理依 GRI 306 標準揭露。有害廢棄物總量 {HAZARDOUS} 公噸，委託合法廢棄物清除處理機構處理，全程追蹤清除處理流程；一般廢棄物總量 {GENERAL} 公噸，資源回收率 {RECYCLE_RATE}%，其中廢紙、金屬、塑膠等主要品項均達到主管機關規定之最低回收比例。全年度無違反廢棄物相關法規事件。' },
      { persona: 'harmony', text: '本公司推動「零廢棄物」願景，從源頭減量、再使用、回收到妥善處置，建立完整廢棄物管理階層。員工廢棄物分類意識逐年提升，{YEAR} 年辦公室一般廢棄物回收率達 {OFFICE_RECYCLE}%，較前年提升 {IMPROVEMENT}個百分點。我們與在地社區合作，推動廢棄物資源化，讓廢料成為他人的原料。' },
      { persona: 'innovation', text: '本公司導入工業共生概念，與鄰近廠商建立廢棄物交換平台，將生產過程產生的廢熱、廢溶劑及廢金屬轉化為其他企業的原料或能源。{YEAR} 年度透過工業共生實現廢棄物資源化 {SYMBIOSIS} 公噸，避免掩埋或焚化，估計減少碳排放 {CO2_AVOID} 公噸。' },
    ],
    benchmark: {
      company: '南亞塑膠 2023 年永續報告書',
      excerpt: '南亞塑膠2023年廢棄物資源化率達87.3%，有害廢棄物全程追蹤，無重大環保違規事件，廢棄物強度較2016年基準年降低15%。',
    },
  },
  {
    id: 'workforce',
    num: '07',
    title: '員工結構與勞動實踐',
    titleEn: 'Employment & Labor',
    gri: 'GRI 2-7 / GRI 401 / GRI 405',
    category: 'S',
    estPages: 22,
    docs: [
      { id: 'd23', name: '人資系統匯出報表', department: '人資部', required: true },
      { id: 'd24', name: '員工名冊（含性別/職級）', department: '人資部', required: true },
      { id: 'd25', name: '育嬰留停及復職率統計表', department: '人資部', required: true },
    ],
    fields: [
      { id: 'f25', label: '全職員工總人數', unit: '人', gri: 'GRI 2-7', value: '' },
      { id: 'f26', label: '女性員工比例', unit: '%', gri: 'GRI 405-1', value: '' },
      { id: 'f27', label: '員工自願離職率', unit: '%', gri: 'GRI 401-1', value: '' },
      { id: 'f28', label: '男女薪酬比（中位數）', unit: '比', gri: 'GRI 405-2', value: '' },
    ],
    expertTemplates: [
      { persona: 'compliance', text: '截至 {YEAR} 年 12 月 31 日，本公司全球員工人數共計 {EMPLOYEES} 人，其中正職員工 {FULL_TIME} 人，兼職員工 {PART_TIME} 人。依性別分析，女性員工占 {FEMALE_RATE}%；依職級分析，管理職中女性比例為 {FEMALE_MGMT}%。全年度新進員工 {NEW_HIRE} 人，離職員工 {TURNOVER} 人，自願離職率 {TURNOVER_RATE}%。' },
      { persona: 'harmony', text: '本公司深信多元包容的工作環境是企業永續發展的基石。我們積極推動 DEI（多元、公平、包容）政策，提供友善職場環境，包含彈性上班制度、家庭照顧假、心理健康支援方案及無障礙工作環境。{YEAR} 年度員工敬業度調查滿意度達 {ENGAGEMENT}%，連續三年位居業界前 25%。' },
      { persona: 'innovation', text: '面對人才競爭白熱化，本公司打造「AI 輔助職涯發展系統」，透過大數據分析員工職能缺口，客製化推薦學習資源，實現個人化職涯成長路徑。{YEAR} 年度內部晉升比例達 {INTERNAL_PROMO}%，有效降低關鍵職位外部招募成本，同時激勵高潛力員工長期投入。' },
    ],
    benchmark: {
      company: '聯發科技 2023 年永續報告書',
      excerpt: '聯發科2023年全球員工24,038人，女性比例27%，管理職女性比例22%，獲CDP人力資本評比A-評級，推行全球薪酬公平審查機制。',
    },
  },
  {
    id: 'safety',
    num: '08',
    title: '職業安全衛生',
    titleEn: 'Occupational Health & Safety',
    gri: 'GRI 403-1 ~ 403-10',
    category: 'S',
    estPages: 18,
    docs: [
      { id: 'd26', name: 'ISO 45001 證書', department: '環安衛/人資', required: false },
      { id: 'd27', name: '勞保局職災申報單', department: '環安衛', required: true },
      { id: 'd28', name: '工安事件調查報告', department: '環安衛', required: true },
    ],
    fields: [
      { id: 'f29', label: '失能傷害頻率（FR）', unit: '次/百萬工時', gri: 'GRI 403-9', value: '' },
      { id: 'f30', label: '總工時', unit: '小時', gri: 'GRI 403-9', value: '' },
      { id: 'f31', label: '職業病件數', unit: '件', gri: 'GRI 403-10', value: '' },
    ],
    expertTemplates: [
      { persona: 'compliance', text: '{YEAR} 年度本公司依 GRI 403 職業安全衛生標準進行揭露。全年總工時 {TOTAL_HOURS} 小時，失能傷害頻率（FR）為 {FR}（次/百萬工時），失能傷害嚴重率（SR）為 {SR}（損失工時/百萬工時），職業病件數 {OCC_DISEASE} 件。所有廠區均建立符合 ISO 45001 要求之職業安全衛生管理系統，定期辦理稽核與改善。' },
      { persona: 'harmony', text: '零職災是本公司最莊嚴的承諾。我們建立「安全文化金字塔」，從最高層的安全願景到基層員工的日常安全行為，形成全員參與的安全文化。每月辦理職安委員會議，員工可透過匿名管道通報不安全行為或環境，確保每一項風險都被即時識別與消除。' },
      { persona: 'innovation', text: '本公司引入工業 AI 視覺辨識系統，即時監控製程區域的人員行為安全合規性，包含個人防護裝備佩戴偵測及危險區域入侵預警。{YEAR} 年系統辨識不安全行為 {ALERT} 次，及時介入率達 {RESPONSE_RATE}%，有效防止潛在職災發生。' },
    ],
    benchmark: {
      company: '台灣化學纖維 2023 年永續報告書',
      excerpt: '台化2023年失能傷害頻率FR為0.34，低於石化業平均值0.89，推行行為安全觀察計畫，完成觀察12,345次，安全行為符合率99.2%。',
    },
  },
  {
    id: 'training',
    num: '09',
    title: '人才培育與發展',
    titleEn: 'Training & Education',
    gri: 'GRI 404-1 ~ 404-3',
    category: 'S',
    estPages: 14,
    docs: [
      { id: 'd29', name: '教育訓練簽到表', department: '人資部', required: true },
      { id: 'd30', name: '線上課程完課紀錄', department: '人資部', required: true },
      { id: 'd31', name: '績效考核系統紀錄', department: '人資部', required: true },
    ],
    fields: [
      { id: 'f32', label: '平均每人年受訓時數', unit: '小時/人', gri: 'GRI 404-1', value: '' },
      { id: 'f33', label: '績效考核覆蓋率', unit: '%', gri: 'GRI 404-3', value: '' },
      { id: 'f34', label: '訓練總投資金額', unit: '新台幣千元', gri: 'GRI 404-1', value: '' },
    ],
    expertTemplates: [
      { persona: 'compliance', text: '{YEAR} 年度本公司員工訓練總時數達 {TOTAL_TRAINING_HOURS} 小時，平均每人每年受訓時數 {AVG_TRAINING} 小時，訓練總投資金額新台幣 {TRAINING_INVESTMENT} 千元。績效考核制度涵蓋 {PERFORMANCE_RATE}% 之正職員工，評核項目包含工作績效（60%）及核心職能（40%），並與薪酬調整及晉升決策連動。' },
      { persona: 'harmony', text: '本公司視人才為最重要的競爭資產，投入大量資源建構完整的學習生態系。從新進員工的 Onboarding 計畫、中階主管領導力培訓，到高階主管的策略思維工作坊，每一位員工都能獲得量身打造的學習資源。{YEAR} 年度員工主動學習時數達 {SELF_LEARNING} 小時，自主學習意願持續提升。' },
      { persona: 'innovation', text: '本公司打造企業大學（Corporate University）平台，整合實體課程、線上微學習（Microlearning）及 AI 個人化推薦引擎，建構 70-20-10 學習框架。{YEAR} 年度透過 AI 學習推薦系統，員工平均學習完成率提升至 {COMPLETION_RATE}%，較傳統課程安排提高 {IMPROVEMENT}個百分點。' },
    ],
    benchmark: {
      company: '統一企業 2023 年永續報告書',
      excerpt: '統一企業2023年員工平均受訓時數達45.2小時，ESG及永續相關訓練占比23%，建置數位學習平台，線上課程完成率達91%。',
    },
  },
  {
    id: 'supply_chain',
    num: '10',
    title: '供應鏈永續管理',
    titleEn: 'Supply Chain Management',
    gri: 'GRI 308 / GRI 414',
    category: 'S',
    estPages: 16,
    docs: [
      { id: 'd32', name: '供應商行為準則簽署書', department: '採購部', required: true },
      { id: 'd33', name: '供應商 ESG 稽核評分表', department: '採購部', required: true },
    ],
    fields: [
      { id: 'f35', label: '在地採購比例', unit: '%', gri: 'GRI 204-1', value: '' },
      { id: 'f36', label: '簽署永續承諾書供應商比例', unit: '%', gri: 'GRI 308-1', value: '' },
      { id: 'f37', label: '已接受 ESG 評估之供應商比例', unit: '%', gri: 'GRI 308-2', value: '' },
    ],
    expertTemplates: [
      { persona: 'compliance', text: '本公司建立嚴謹之供應商永續管理制度，要求所有策略供應商簽署《供應商行為準則》，承諾遵守人權、勞工、環境及商業倫理相關規範。截至 {YEAR} 年底，已有 {SIGNED_RATE}% 的策略供應商完成簽署。本年度對前 {AUDITED} 大供應商進行 ESG 實地稽核，識別高風險供應商 {HIGH_RISK} 家並完成改善追蹤。' },
      { persona: 'harmony', text: '供應商是本公司價值鏈不可或缺的夥伴。我們不僅要求供應商遵守最低標準，更積極提供 ESG 能力建置資源，包含免費的永續培訓課程、碳足跡計算輔導及 ESG 評鑑工具。{YEAR} 年度協助 {SUPPORT_SUPPLIER} 家中小型供應商完成首次碳盤查，共同推進供應鏈減碳。' },
      { persona: 'innovation', text: '本公司建置「供應鏈永續透明化平台」，整合供應商 ESG 數據、風險評分及改善軌跡，實現供應鏈永續績效的即時可視化。運用 AI 供應鏈風險模型，分析地緣政治、氣候、勞工及法規風險，提前預警高風險事件，供應鏈韌性指數較前年提升 {RESILIENCE}%。' },
    ],
    benchmark: {
      company: '華碩電腦 2023 年永續報告書',
      excerpt: '華碩2023年100%策略供應商簽署供應商行為準則，對237家高風險供應商完成ESG稽核，導入供應鏈碳盤查，協助80家供應商完成碳盤查。',
    },
  },
  {
    id: 'board',
    num: '11',
    title: '董事會治理與薪酬連結',
    titleEn: 'Board Governance',
    gri: 'GRI 2-9 ~ 2-20',
    category: 'G',
    estPages: 18,
    docs: [
      { id: 'd34', name: '董事會名冊', department: '董事會秘書室', required: true },
      { id: 'd35', name: '董事會績效評估報告', department: '董事會秘書室', required: true },
      { id: 'd36', name: '高階主管薪酬連結 ESG 說明', department: '董事會', required: true },
    ],
    fields: [
      { id: 'f38', label: '獨立董事比例', unit: '%', gri: 'GRI 2-9', value: '' },
      { id: 'f39', label: '女性董事比例', unit: '%', gri: 'GRI 405-1', value: '' },
      { id: 'f40', label: 'ESG 連結薪酬比例（高管）', unit: '%', gri: 'GRI 2-19', value: '' },
    ],
    expertTemplates: [
      { persona: 'compliance', text: '本公司董事會由 {BOARD_SIZE} 位董事組成，其中獨立董事 {IND_DIRECTORS} 位，比例達 {IND_RATE}%，符合法規最低要求。女性董事 {FEMALE_DIRECTORS} 位，占 {FEMALE_BOARD_RATE}%。董事會設有審計委員會、薪酬委員會及永續委員會，每季定期召開會議，監督公司 ESG 策略執行。{YEAR} 年度董事會共召開 {BOARD_MEETINGS} 次，平均出席率 {ATTENDANCE_RATE}%。' },
      { persona: 'harmony', text: '多元化的董事會組成是優質治理的基礎。本公司致力於提升董事會的多元性，不僅追求性別平衡，更重視產業背景、國際視野及 ESG 專業的多元組合。 {YEAR} 年度完成董事會整體績效評估，針對 ESG 議題的治理效能進行專項評估，並將評估結果公開揭露，接受利害關係人監督。' },
      { persona: 'innovation', text: '本公司率先將 ESG 關鍵績效指標（KPIs）系統性納入高階主管薪酬計算機制。ESG 績效指標占短期激勵（STI）計算基礎的 {ESG_STI}%，涵蓋碳排放減量、員工敬業度及供應鏈永續評分三大面向。此一「薪酬 ESG 連結」設計，有效驅動管理層將永續思維落實於日常決策。' },
    ],
    benchmark: {
      company: '中信金融 2023 年永續報告書',
      excerpt: '中信金控2023年董事會獨立董事比例62.5%，女性董事比例37.5%，高階主管薪酬與ESG目標連結，永續績效占年度短期激勵計算25%。',
    },
  },
  {
    id: 'ethics',
    num: '12',
    title: '商業倫理與反貪腐',
    titleEn: 'Business Ethics & Anti-Corruption',
    gri: 'GRI 205 / GRI 206 / GRI 207',
    category: 'G',
    estPages: 14,
    docs: [
      { id: 'd37', name: '內部稽核報告', department: '稽核/法務', required: true },
      { id: 'd38', name: '申訴管道紀錄', department: '法務部', required: true },
      { id: 'd39', name: '稅務策略聲明書', department: '財務部', required: true },
    ],
    fields: [
      { id: 'f41', label: '貪腐相關調查事件數', unit: '件', gri: 'GRI 205-3', value: '' },
      { id: 'f42', label: '因違反法規被罰款總額', unit: '新台幣千元', gri: 'GRI 2-27', value: '' },
      { id: 'f43', label: '有效稅率', unit: '%', gri: 'GRI 207-1', value: '' },
      { id: 'f44', label: '申訴件數', unit: '件', gri: 'GRI 2-25', value: '' },
    ],
    expertTemplates: [
      { persona: 'compliance', text: '本公司恪守商業誠信與反貪腐原則，建立完整之廉潔文化制度架構。{YEAR} 年度反貪腐相關訓練涵蓋率達 {TRAINING_RATE}%，申訴管道共受理 {COMPLAINTS} 件，均依程序完成調查與處置。無重大貪腐事件、無裁罰、無法律訴訟案件，符合 GRI 205 及金管會法遵要求。有效稅率為 {EFFECTIVE_TAX}%，稅務策略透明揭露。' },
      { persona: 'harmony', text: '誠信是本公司最珍貴的資產。我們在全體員工中推動「誠信文化工程」，透過案例分析研討、誠信行為守則宣導及吹哨者保護制度，建立全員共識。每位員工每年完成反貪腐線上課程，管理職人員額外參加情境模擬研討，確保誠信理念內化為日常行為準則。' },
      { persona: 'innovation', text: '本公司運用 AI 法遵監控系統，即時掃描交易數據中的異常模式，自動標記潛在利益衝突或不尋常支出。{YEAR} 年度 AI 系統主動識別疑似異常交易 {AI_ALERTS} 筆，經人工複核後 {CONFIRMED} 筆確認為需關注案件，有效提升內控效率，降低法遵風險。' },
    ],
    benchmark: {
      company: '富邦金控 2023 年永續報告書',
      excerpt: '富邦金控2023年反貪腐訓練覆蓋率100%，吹哨者保護案件處理完成率100%，有效稅率18.3%，連續5年零重大貪腐事件。',
    },
  },
];

const PERSONA_META = {
  compliance: { label: '合規守衛', color: 'var(--blue-700)', bg: 'var(--blue-50)', border: 'var(--blue-100)' },
  harmony:    { label: '共榮引導', color: 'var(--green-700)', bg: 'var(--green-50)', border: 'var(--green-100)' },
  innovation: { label: '創新先行', color: 'var(--purple-600)', bg: 'var(--purple-50)', border: 'var(--purple-100)' },
};

const CATEGORY_META = {
  G: { label: '治理', color: 'var(--blue-700)', bg: 'var(--blue-50)' },
  E: { label: '環境', color: 'var(--green-700)', bg: 'var(--green-50)' },
  S: { label: '社會', color: 'var(--purple-600)', bg: 'var(--purple-50)' },
};

// ── Helpers ────────────────────────────────────────────────────────────────
function timeAgo(ts: string): string {
  const diff = (Date.now() - new Date(ts).getTime()) / 1000;
  if (diff < 60) return '剛剛';
  if (diff < 3600) return `${Math.floor(diff / 60)} 分鐘前`;
  return `${Math.floor(diff / 3600)} 小時前`;
}

// ── Main Component ─────────────────────────────────────────────────────────
export default function EditorPage() {
  const [selectedChapterId, setSelectedChapterId] = useState<string>('general');
  const [content, setContent] = useState<Record<string, string>>({});
  const [fields, setFields] = useState<Record<string, Record<string, string>>>({});
  const [docStatus, setDocStatus] = useState<Record<string, Record<string, boolean>>>({});
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [selectedPersona, setSelectedPersona] = useState<'compliance' | 'harmony' | 'innovation'>('compliance');
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [sealing, setSealing] = useState(false);
  const [sealedChapters, setSealedChapters] = useState<Record<string, string>>({});
  const [activePanel, setActivePanel] = useState<'write' | 'data' | 'docs' | 'benchmark'>('write');
  const [navCollapsed, setNavCollapsed] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [showBenchmark, setShowBenchmark] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const chapter = CHAPTERS.find(c => c.id === selectedChapterId) ?? CHAPTERS[0];

  const showToast = useCallback((msg: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2800);
  }, []);

  // Load from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('esggo_editor_state');
      if (saved) {
        const state = JSON.parse(saved);
        if (state.content) setContent(state.content);
        if (state.fields) setFields(state.fields);
        if (state.docStatus) setDocStatus(state.docStatus);
        if (state.notes) setNotes(state.notes);
        if (state.sealedChapters) setSealedChapters(state.sealedChapters);
      }
    } catch { /* ignore */ }
  }, []);

  const saveToLocal = useCallback((newContent?: Record<string, string>, newFields?: Record<string, Record<string, string>>, newDocs?: Record<string, Record<string, boolean>>, newNotes?: Record<string, string>, newSealed?: Record<string, string>) => {
    try {
      localStorage.setItem('esggo_editor_state', JSON.stringify({
        content: newContent ?? content,
        fields: newFields ?? fields,
        docStatus: newDocs ?? docStatus,
        notes: newNotes ?? notes,
        sealedChapters: newSealed ?? sealedChapters,
        savedAt: new Date().toISOString(),
      }));
    } catch { /* ignore */ }
  }, [content, fields, docStatus, notes, sealedChapters]);

  const handleGenerate = async () => {
    const template = chapter.expertTemplates.find(t => t.persona === selectedPersona);
    if (!template) return;
    setGenerating(true);
    await new Promise(r => setTimeout(r, 1200));
    const chFields = fields[chapter.id] ?? {};
    let generated = template.text;
    chapter.fields.forEach(f => {
      const val = chFields[f.id] || `[${f.label}]`;
      generated = generated.replace(new RegExp(`\\{${f.id}\\}`, 'g'), val);
    });
    const updated = { ...content, [chapter.id]: generated };
    setContent(updated);
    saveToLocal(updated);
    setGenerating(false);
    showToast(`${PERSONA_META[selectedPersona].label} 草稿生成完成 ✓`);
    setActivePanel('write');
  };

  const handleSave = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 600));
    saveToLocal();
    await logAudit({
      action: 'SAVE_DRAFT',
      resource: `永續撰寫 - ${chapter.title}`,
      user_name: 'User',
      t5_tag: 'T5',
      details: `章節 ${chapter.num} 草稿儲存，字數: ${(content[chapter.id] ?? '').length}`,
    });
    setSaving(false);
    showToast('草稿已儲存 ✓');
  };

  const handleSeal = async () => {
    if (!content[chapter.id]?.trim()) {
      showToast('請先完成內容撰寫再進行 5T 封印', 'error');
      return;
    }
    setSealing(true);
    await new Promise(r => setTimeout(r, 1800));
    const hash = simpleHash(chapter.id + content[chapter.id] + Date.now().toString());
    const updatedSealed = { ...sealedChapters, [chapter.id]: hash };
    setSealedChapters(updatedSealed);
    saveToLocal(undefined, undefined, undefined, undefined, updatedSealed);
    await logAudit({
      action: 'ZKP_SEAL',
      resource: `章節封印 - ${chapter.title}`,
      user_name: 'User',
      t5_tag: 'T4',
      details: `SHA-256: ${hash}`,
    });
    setSealing(false);
    showToast(`5T 封印完成 · Hash: ${hash.slice(0, 8)}...`);
  };

  const toggleDoc = (docId: string) => {
    const updated = {
      ...docStatus,
      [chapter.id]: {
        ...(docStatus[chapter.id] ?? {}),
        [docId]: !(docStatus[chapter.id]?.[docId]),
      },
    };
    setDocStatus(updated);
    saveToLocal(undefined, undefined, updated);
  };

  const updateField = (fieldId: string, value: string) => {
    const updated = {
      ...fields,
      [chapter.id]: { ...(fields[chapter.id] ?? {}), [fieldId]: value },
    };
    setFields(updated);
    saveToLocal(undefined, updated);
  };

  const updateContent = (val: string) => {
    const updated = { ...content, [chapter.id]: val };
    setContent(updated);
  };

  const updateNote = (val: string) => {
    const updated = { ...notes, [chapter.id]: val };
    setNotes(updated);
    saveToLocal(undefined, undefined, undefined, updated);
  };

  // Stats
  const totalDocs = CHAPTERS.reduce((s, c) => s + c.docs.length, 0);
  const uploadedDocs = CHAPTERS.reduce((s, c) => s + c.docs.filter(d => docStatus[c.id]?.[d.id]).length, 0);
  const filledChapters = CHAPTERS.filter(c => content[c.id]?.trim()).length;
  const sealedCount = Object.keys(sealedChapters).length;
  const totalPages = CHAPTERS.reduce((s, c) => s + c.estPages, 0);

  const chDocs = chapter.docs;
  const uploadedChDocs = chDocs.filter(d => docStatus[chapter.id]?.[d.id]).length;
  const chFieldsFilled = chapter.fields.filter(f => fields[chapter.id]?.[f.id]?.trim()).length;
  const chCompletion = Math.round(
    ((content[chapter.id] ? 50 : 0) +
      (uploadedChDocs / chDocs.length) * 30 +
      (chFieldsFilled / chapter.fields.length) * 20)
  );

  const catMeta = CATEGORY_META[chapter.category];
  const isSealed = !!sealedChapters[chapter.id];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', top: 20, right: 20, zIndex: 9999,
          background: toast.type === 'error' ? 'var(--red-700)' : toast.type === 'info' ? 'var(--blue-700)' : 'var(--green-700)',
          color: '#fff', padding: '10px 18px', borderRadius: 'var(--radius-xl)',
          fontSize: 13, fontWeight: 600, boxShadow: 'var(--shadow-xl)',
          animation: 'fade-in 0.2s var(--ease)', display: 'flex', alignItems: 'center', gap: 8,
        }}>
          {toast.type === 'success' ? <CheckCircle size={14} /> : toast.type === 'error' ? <AlertTriangle size={14} /> : <Zap size={14} />}
          {toast.msg}
        </div>
      )}

      {/* Top Header */}
      <div style={{
        flexShrink: 0, background: 'var(--surface-card)',
        borderBottom: '1px solid var(--border-default)',
        padding: '0 var(--space-5)', height: 56,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-4)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <div style={{
            width: 32, height: 32, borderRadius: 'var(--radius-lg)',
            background: 'var(--blue-700)', display: 'flex', alignItems: 'center',
            justifyContent: 'center', color: '#fff', flexShrink: 0,
          }}>
            <FileText size={16} />
          </div>
          <div>
            <h1 style={{ fontSize: 'var(--font-size-base)', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.2 }}>
              SustainWrite™ 永續撰寫工作台
            </h1>
            <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)', marginTop: 1 }}>
              GRI 2021 全套 · 5T 誠信協議 · {CHAPTERS.length} 章節 · 預計 {totalPages}+ 頁
            </p>
          </div>
        </div>

        {/* Summary Stats */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
          {[
            { label: '章節完成', value: `${filledChapters}/${CHAPTERS.length}`, color: 'var(--blue-700)' },
            { label: '文件就緒', value: `${uploadedDocs}/${totalDocs}`, color: 'var(--green-700)' },
            { label: '已封印', value: `${sealedCount}/${CHAPTERS.length}`, color: 'var(--gold-600)' },
          ].map(s => (
            <div key={s.label} style={{ textAlign: 'center', minWidth: 56 }}>
              <p style={{ fontSize: 'var(--font-size-base)', fontWeight: 700, color: s.color, lineHeight: 1 }}>{s.value}</p>
              <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)', marginTop: 2 }}>{s.label}</p>
            </div>
          ))}

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
            <button
              className="btn btn-ghost btn-sm flex items-center gap-2"
              onClick={handleSave}
              disabled={saving}
              aria-label="儲存草稿"
            >
              {saving ? <RefreshCw size={13} className="spin" /> : <Save size={13} />}
              儲存
            </button>
            <button
              className="btn btn-primary btn-sm flex items-center gap-2"
              onClick={handleSeal}
              disabled={sealing || !content[chapter.id]?.trim() || isSealed}
              aria-label="5T 封印"
            >
              {sealing ? <RefreshCw size={13} className="spin" /> : <Lock size={13} />}
              {isSealed ? '已封印' : '5T 封印'}
            </button>
            <button className="btn btn-ghost btn-sm" aria-label="匯出報告">
              <Download size={13} />
            </button>
          </div>
        </div>
      </div>

      {/* Global Doc Collection Status */}
      <div style={{
        flexShrink: 0, background: 'var(--surface-section)',
        borderBottom: '1px solid var(--border-subtle)',
        padding: 'var(--space-3) var(--space-5)',
        display: 'flex', alignItems: 'center', gap: 'var(--space-4)',
      }}>
        <span style={{ fontSize: 'var(--font-size-xs)', fontWeight: 700, color: 'var(--text-secondary)', flexShrink: 0 }}>
          總單據收集狀況：
        </span>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <div className="progress-track" style={{ flex: 1, height: 8 }}>
            <div className="progress-fill" style={{ width: `${totalDocs > 0 ? Math.round((uploadedDocs / totalDocs) * 100) : 0}%`, background: 'var(--green-500)' }} />
          </div>
          <span style={{ fontSize: 'var(--font-size-xs)', fontWeight: 700, color: 'var(--green-700)', flexShrink: 0 }}>
            {uploadedDocs}/{totalDocs} ({totalDocs > 0 ? Math.round((uploadedDocs / totalDocs) * 100) : 0}%)
          </span>
        </div>
        {/* Chapter pills */}
        <div style={{ display: 'flex', gap: 4, flexShrink: 0, flexWrap: 'wrap' }}>
          {CHAPTERS.map(c => {
            const chUploaded = c.docs.filter(d => docStatus[c.id]?.[d.id]).length;
            const pct = Math.round((chUploaded / c.docs.length) * 100);
            const hasContent = !!content[c.id]?.trim();
            const sealed = !!sealedChapters[c.id];
            return (
              <div
                key={c.id}
                title={`${c.num}. ${c.title} — 文件 ${chUploaded}/${c.docs.length}，${hasContent ? '已填寫' : '未填寫'}${sealed ? '，已封印' : ''}`}
                style={{
                  width: 18, height: 18, borderRadius: 4,
                  background: sealed ? 'var(--gold-100)' : hasContent ? 'var(--blue-100)' : pct > 0 ? 'var(--green-100)' : 'var(--neutral-200)',
                  border: `1.5px solid ${sealed ? 'var(--gold-400)' : hasContent ? 'var(--blue-300)' : pct > 0 ? 'var(--green-300)' : 'var(--neutral-300)'}`,
                  cursor: 'pointer',
                  transition: 'transform var(--duration-fast)',
                }}
                onClick={() => setSelectedChapterId(c.id)}
              />
            );
          })}
        </div>
        <div style={{ display: 'flex', gap: 12, flexShrink: 0 }}>
          {[
            { color: 'var(--gold-300)', label: '已封印' },
            { color: 'var(--blue-200)', label: '已撰寫' },
            { color: 'var(--green-200)', label: '有文件' },
            { color: 'var(--neutral-200)', label: '未開始' },
          ].map(l => (
            <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <div style={{ width: 10, height: 10, borderRadius: 2, background: l.color, border: '1px solid rgba(0,0,0,0.1)' }} />
              <span style={{ fontSize: 10, color: 'var(--text-tertiary)' }}>{l.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Body */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

        {/* Chapter Navigation */}
        <div style={{
          width: navCollapsed ? 52 : 220,
          flexShrink: 0,
          borderRight: '1px solid var(--border-default)',
          background: 'var(--surface-card)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          transition: 'width var(--duration-normal) var(--ease)',
        }}>
          <div style={{
            display: 'flex', alignItems: 'center',
            justifyContent: navCollapsed ? 'center' : 'space-between',
            padding: navCollapsed ? 'var(--space-3)' : 'var(--space-3) var(--space-3) var(--space-2)',
            borderBottom: '1px solid var(--border-subtle)',
          }}>
            {!navCollapsed && (
              <span style={{ fontSize: 'var(--font-size-xs)', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                章節導覽
              </span>
            )}
            <button
              className="btn btn-ghost btn-icon btn-xs"
              onClick={() => setNavCollapsed(p => !p)}
              aria-label={navCollapsed ? '展開章節導覽' : '收合章節導覽'}
            >
              {navCollapsed ? <ChevronRight size={13} /> : <ChevronLeft size={13} />}
            </button>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '6px 4px' }}>
            {['G', 'E', 'S'].map(cat => {
              const catChapters = CHAPTERS.filter(c => c.category === cat);
              const catMeta2 = CATEGORY_META[cat as 'G' | 'E' | 'S'];
              return (
                <div key={cat}>
                  {!navCollapsed && (
                    <div style={{
                      padding: '6px 8px 4px',
                      fontSize: 10, fontWeight: 700,
                      color: catMeta2.color,
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                    }}>
                      {catMeta2.label}
                    </div>
                  )}
                  {catChapters.map(c => {
                    const active = c.id === selectedChapterId;
                    const hasContent = !!content[c.id]?.trim();
                    const sealed = !!sealedChapters[c.id];
                    const chUploaded2 = c.docs.filter(d => docStatus[c.id]?.[d.id]).length;
                    return (
                      <button
                        key={c.id}
                        onClick={() => setSelectedChapterId(c.id)}
                        title={navCollapsed ? `${c.num}. ${c.title}` : undefined}
                        style={{
                          width: '100%', display: 'flex', alignItems: 'center',
                          gap: 8, padding: navCollapsed ? '8px' : '7px 10px',
                          borderRadius: 'var(--radius-lg)', border: 'none',
                          background: active ? 'var(--blue-50)' : 'transparent',
                          cursor: 'pointer', textAlign: 'left',
                          fontFamily: 'var(--font-sans)',
                          borderLeft: `2px solid ${active ? 'var(--blue-700)' : 'transparent'}`,
                          marginBottom: 2,
                          transition: 'all var(--duration-fast) var(--ease)',
                          minHeight: 40,
                          justifyContent: navCollapsed ? 'center' : 'flex-start',
                        }}
                        aria-current={active ? 'page' : undefined}
                      >
                        {/* Status dot */}
                        <div style={{
                          width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
                          background: sealed ? 'var(--gold-500)' : hasContent ? 'var(--blue-500)' : chUploaded2 > 0 ? 'var(--green-400)' : 'var(--neutral-300)',
                        }} />
                        {!navCollapsed && (
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{
                              fontSize: 11, lineHeight: 1.3,
                              color: active ? 'var(--blue-700)' : 'var(--text-secondary)',
                              fontWeight: active ? 600 : 400,
                              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                            }}>
                              {c.num}. {c.title}
                            </p>
                            <p style={{ fontSize: 9, color: 'var(--text-tertiary)', marginTop: 1 }}>
                              {c.gri}
                            </p>
                          </div>
                        )}
                        {!navCollapsed && sealed && (
                          <Lock size={10} style={{ color: 'var(--gold-500)', flexShrink: 0 }} />
                        )}
                      </button>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>

        {/* Main Editor Area */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

          {/* Chapter Header */}
          <div style={{
            flexShrink: 0,
            padding: 'var(--space-4) var(--space-5)',
            borderBottom: '1px solid var(--border-subtle)',
            background: 'var(--surface-card)',
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-3)' }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 'var(--radius-lg)',
                  background: catMeta.bg, color: catMeta.color,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0, fontWeight: 700, fontSize: 14,
                  fontFamily: 'var(--font-mono)',
                }}>
                  {chapter.num}
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                    <h2 style={{ fontSize: 'var(--font-size-md)', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {chapter.title}
                    </h2>
                    <span className="badge badge-sm" style={{ background: catMeta.bg, color: catMeta.color, borderColor: 'transparent' }}>
                      {catMeta.label}
                    </span>
                    <span className="gri-tag">{chapter.gri}</span>
                    {isSealed && (
                      <span className="badge badge-sm" style={{ background: 'var(--gold-100)', color: 'var(--gold-700)', borderColor: 'var(--gold-200)' }}>
                        <Lock size={9} /> 已封印
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)', marginTop: 4 }}>
                    {chapter.titleEn} · 預計 {chapter.estPages} 頁 · {chapter.docs.length} 份佐證文件
                  </p>
                </div>
              </div>

              {/* Chapter Completion */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)' }}>本章完成度</p>
                  <p style={{ fontSize: 'var(--font-size-lg)', fontWeight: 700, color: chCompletion >= 80 ? 'var(--green-600)' : chCompletion >= 40 ? 'var(--amber-600)' : 'var(--text-secondary)' }}>
                    {chCompletion}%
                  </p>
                </div>
                <div style={{ width: 52, height: 52, position: 'relative' }}>
                  <svg viewBox="0 0 52 52" style={{ transform: 'rotate(-90deg)' }}>
                    <circle cx="26" cy="26" r="22" fill="none" stroke="var(--neutral-200)" strokeWidth="4" />
                    <circle cx="26" cy="26" r="22" fill="none"
                      stroke={chCompletion >= 80 ? 'var(--green-500)' : chCompletion >= 40 ? 'var(--amber-500)' : 'var(--blue-400)'}
                      strokeWidth="4"
                      strokeDasharray={`${138.2 * chCompletion / 100} 138.2`}
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Chapter sub-panels tabs */}
            <div className="tabs-nav" style={{ marginTop: 'var(--space-3)', borderBottom: 'none' }}>
              {([
                { id: 'write', label: '✍ 撰寫內容', icon: <Edit3 size={13} /> },
                { id: 'data', label: `📊 核心數據 (${chFieldsFilled}/${chapter.fields.length})`, icon: <BarChart3 size={13} /> },
                { id: 'docs', label: `📎 佐證文件 (${uploadedChDocs}/${chDocs.length})`, icon: <FileCheck size={13} /> },
                { id: 'benchmark', label: '🏆 標竿比較', icon: <Eye size={13} /> },
              ] as const).map(t => (
                <button
                  key={t.id}
                  onClick={() => setActivePanel(t.id as typeof activePanel)}
                  className={`tab-btn tab-btn-pill btn-sm ${activePanel === t.id ? 'active' : ''}`}
                  style={{ marginRight: 4 }}
                >
                  {t.icon}
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Panel Content */}
          <div style={{ flex: 1, overflow: 'auto' }}>

            {/* ── Write Panel ── */}
            {activePanel === 'write' && (
              <div style={{ display: 'flex', height: '100%' }}>
                {/* Left: Persona + Generate */}
                <div style={{
                  width: 260, flexShrink: 0,
                  borderRight: '1px solid var(--border-subtle)',
                  padding: 'var(--space-4)',
                  background: 'var(--surface-section)',
                  display: 'flex', flexDirection: 'column', gap: 'var(--space-4)',
                }}>
                  <div>
                    <p className="text-overline" style={{ marginBottom: 'var(--space-3)' }}>選擇專家人格</p>
                    {(['compliance', 'harmony', 'innovation'] as const).map(p => {
                      const meta = PERSONA_META[p];
                      return (
                        <button
                          key={p}
                          onClick={() => setSelectedPersona(p)}
                          style={{
                            width: '100%', display: 'flex', alignItems: 'flex-start',
                            gap: 'var(--space-2)', padding: 'var(--space-3)',
                            borderRadius: 'var(--radius-lg)', border: `1.5px solid ${selectedPersona === p ? meta.color : 'var(--border-default)'}`,
                            background: selectedPersona === p ? meta.bg : 'var(--surface-card)',
                            cursor: 'pointer', textAlign: 'left',
                            fontFamily: 'var(--font-sans)',
                            marginBottom: 8,
                            transition: 'all var(--duration-fast) var(--ease)',
                            minHeight: 44,
                          }}
                          aria-pressed={selectedPersona === p}
                        >
                          <div style={{ width: 8, height: 8, borderRadius: '50%', background: meta.color, marginTop: 5, flexShrink: 0 }} />
                          <div>
                            <p style={{ fontSize: 12, fontWeight: 700, color: meta.color }}>{meta.label}</p>
                            <p style={{ fontSize: 10, color: 'var(--text-tertiary)', marginTop: 2, lineHeight: 1.5 }}>
                              {p === 'compliance' ? 'GRI/SASB 指標對齊、合規缺口、綠漂偵測' :
                               p === 'harmony' ? '利害關係人視角、社會影響、文化融合' :
                               '淨零技術路徑、ESG 創新轉型策略'}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <button
                    className="btn btn-primary w-full flex items-center gap-2"
                    onClick={handleGenerate}
                    disabled={generating}
                    aria-label="AI 生成草稿"
                  >
                    {generating ? (
                      <><RefreshCw size={14} className="spin" /> 生成中...</>
                    ) : (
                      <><Sparkles size={14} /> AI 自動生成草稿</>
                    )}
                  </button>

                  {/* Preview of template */}
                  <div style={{ padding: 'var(--space-3)', background: 'var(--surface-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)' }}>
                    <p className="text-overline" style={{ marginBottom: 'var(--space-2)' }}>模板預覽</p>
                    <p style={{ fontSize: 10, color: 'var(--text-tertiary)', lineHeight: 1.6 }}>
                      {chapter.expertTemplates.find(t => t.persona === selectedPersona)?.text.slice(0, 120)}...
                    </p>
                  </div>

                  {/* Word count */}
                  <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)' }}>
                    字數：{(content[chapter.id] ?? '').length} 字 · 預計 {chapter.estPages} 頁
                  </div>
                </div>

                {/* Right: Editor */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: 'var(--space-4)' }}>
                  {isSealed && (
                    <div className="alert alert-warning" style={{ marginBottom: 'var(--space-3)', flexShrink: 0 }}>
                      <Lock size={14} style={{ flexShrink: 0 }} />
                      <span style={{ fontSize: 'var(--font-size-xs)' }}>
                        此章節已完成 5T 封印，Hash: <code style={{ fontFamily: 'var(--font-mono)', fontSize: 10 }}>{sealedChapters[chapter.id]?.slice(0, 16)}...</code>
                        ，如需修改請先解除封印。
                      </span>
                    </div>
                  )}
                  <textarea
                    ref={textareaRef}
                    className="input textarea"
                    value={content[chapter.id] ?? ''}
                    onChange={e => updateContent(e.target.value)}
                    disabled={isSealed}
                    placeholder={`在此撰寫「${chapter.title}」章節內容...\n\n您可以：\n1. 點擊左側「AI 自動生成草稿」快速填充\n2. 手動輸入或貼上已有內容\n3. 先填寫「核心數據」再生成更精確的草稿`}
                    style={{
                      flex: 1, minHeight: 0, resize: 'none',
                      fontFamily: 'var(--font-sans)',
                      fontSize: 'var(--font-size-base)',
                      lineHeight: 1.8,
                      background: isSealed ? 'var(--neutral-50)' : 'var(--surface-card)',
                    }}
                    aria-label={`${chapter.title} 內容編輯`}
                    aria-readonly={isSealed}
                  />

                  {/* Notes */}
                  <div style={{ marginTop: 'var(--space-3)', flexShrink: 0 }}>
                    <label style={{ fontSize: 'var(--font-size-xs)', fontWeight: 700, color: 'var(--text-tertiary)', display: 'block', marginBottom: 6 }}>
                      📌 備註 / 上傳說明（不納入正式報告）
                    </label>
                    <textarea
                      className="input textarea"
                      value={notes[chapter.id] ?? ''}
                      onChange={e => updateNote(e.target.value)}
                      placeholder="可記錄數據來源說明、待確認事項、審核意見..."
                      style={{ minHeight: 72, resize: 'vertical', fontSize: 'var(--font-size-xs)' }}
                      aria-label="章節備註"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ── Data Panel ── */}
            {activePanel === 'data' && (
              <div style={{ padding: 'var(--space-5)' }}>
                <div className="alert alert-info" style={{ marginBottom: 'var(--space-4)' }}>
                  <BarChart3 size={14} style={{ flexShrink: 0 }} />
                  <span style={{ fontSize: 'var(--font-size-xs)' }}>
                    填入核心數據後，AI 生成的草稿將自動帶入這些數值，確保報告書數據精確一致。
                  </span>
                </div>
                <div className="form-grid">
                  {chapter.fields.map(field => (
                    <div key={field.id} className="field-group">
                      <label className="field-label" htmlFor={`field-${field.id}`}>
                        {field.label}
                        <span className="gri-tag" style={{ fontSize: 9, marginLeft: 6 }}>{field.gri}</span>
                      </label>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                        <input
                          id={`field-${field.id}`}
                          className="input"
                          value={fields[chapter.id]?.[field.id] ?? ''}
                          onChange={e => updateField(field.id, e.target.value)}
                          placeholder={`請輸入${field.label}`}
                          aria-describedby={`field-unit-${field.id}`}
                        />
                        {field.unit && (
                          <span
                            id={`field-unit-${field.id}`}
                            style={{ flexShrink: 0, fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)', whiteSpace: 'nowrap' }}
                          >
                            {field.unit}
                          </span>
                        )}
                        {fields[chapter.id]?.[field.id] && (
                          <CheckCircle size={14} style={{ color: 'var(--green-500)', flexShrink: 0 }} />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 'var(--space-5)', padding: 'var(--space-4)', background: 'var(--surface-section)', borderRadius: 'var(--radius-lg)' }}>
                  <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)' }}>
                    已填 {chFieldsFilled} / {chapter.fields.length} 項 · 填寫完畢後回到「撰寫內容」頁再次點擊「AI 自動生成草稿」即可帶入數據
                  </p>
                </div>
              </div>
            )}

            {/* ── Docs Panel ── */}
            {activePanel === 'docs' && (
              <div style={{ padding: 'var(--space-5)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-4)' }}>
                  <h3 className="text-card-title">佐證文件清單</h3>
                  <span className="badge badge-sm" style={{
                    background: uploadedChDocs === chDocs.length ? 'var(--green-50)' : 'var(--amber-50)',
                    color: uploadedChDocs === chDocs.length ? 'var(--green-700)' : 'var(--amber-700)',
                    borderColor: 'transparent',
                  }}>
                    {uploadedChDocs}/{chDocs.length} 就緒
                  </span>
                </div>

                <div className="progress-track" style={{ marginBottom: 'var(--space-4)', height: 8 }}>
                  <div className="progress-fill progress-green" style={{ width: `${chDocs.length > 0 ? Math.round((uploadedChDocs / chDocs.length) * 100) : 0}%` }} />
                </div>

                {!chDocs.every(d => docStatus[chapter.id]?.[d.id]) && (
                  <div className="alert alert-warning" style={{ marginBottom: 'var(--space-4)' }}>
                    <AlertTriangle size={14} style={{ flexShrink: 0 }} />
                    <span style={{ fontSize: 'var(--font-size-xs)' }}>
                      尚有 {chDocs.filter(d => !docStatus[chapter.id]?.[d.id]).length} 份必要文件未確認，5T 封印後審計師將要求補件。
                    </span>
                  </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                  {chDocs.map(doc => {
                    const uploaded = !!docStatus[chapter.id]?.[doc.id];
                    return (
                      <div
                        key={doc.id}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 'var(--space-3)',
                          padding: 'var(--space-3) var(--space-4)',
                          borderRadius: 'var(--radius-lg)',
                          border: `1.5px solid ${uploaded ? 'var(--green-200)' : doc.required ? 'var(--border-default)' : 'var(--border-subtle)'}`,
                          background: uploaded ? 'var(--green-50)' : 'var(--surface-card)',
                          transition: 'all var(--duration-fast) var(--ease)',
                        }}
                      >
                        <button
                          onClick={() => toggleDoc(doc.id)}
                          style={{
                            width: 22, height: 22, borderRadius: 6,
                            border: `2px solid ${uploaded ? 'var(--green-500)' : 'var(--border-strong)'}`,
                            background: uploaded ? 'var(--green-500)' : 'transparent',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            cursor: 'pointer', flexShrink: 0, transition: 'all var(--duration-fast) var(--ease)',
                          }}
                          aria-pressed={uploaded}
                          aria-label={`${uploaded ? '取消標記' : '標記'} ${doc.name}`}
                        >
                          {uploaded && <Check size={12} color="#fff" />}
                        </button>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ fontSize: 'var(--font-size-sm)', fontWeight: 500, color: uploaded ? 'var(--green-700)' : 'var(--text-primary)' }}>
                            {doc.name}
                          </p>
                          <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)', marginTop: 2 }}>
                            負責部門：{doc.department}
                          </p>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                          {doc.required && (
                            <span className="badge badge-error badge-sm">必備</span>
                          )}
                          {uploaded ? (
                            <span className="badge badge-success badge-sm">✓ 已就緒</span>
                          ) : (
                            <span className="badge badge-default badge-sm">待收集</span>
                          )}
                          <button className="btn btn-ghost btn-icon btn-xs" aria-label="上傳文件">
                            <Upload size={12} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ── Benchmark Panel ── */}
            {activePanel === 'benchmark' && (
              <div style={{ padding: 'var(--space-5)' }}>
                <div style={{ marginBottom: 'var(--space-4)' }}>
                  <h3 className="text-card-title" style={{ marginBottom: 'var(--space-2)' }}>標竿企業寫法參考</h3>
                  <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)' }}>
                    參考業界領先企業在同一章節的揭露寫法，提升報告書品質。
                  </p>
                </div>

                <div className="card card-body" style={{ marginBottom: 'var(--space-4)', borderLeft: '3px solid var(--gold-500)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-3)' }}>
                    <span className="badge badge-sm" style={{ background: 'var(--gold-100)', color: 'var(--gold-700)', borderColor: 'var(--gold-200)' }}>
                      🏆 標竿企業
                    </span>
                    <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {chapter.benchmark.company}
                    </span>
                  </div>
                  <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)', lineHeight: 1.7, borderLeft: '2px solid var(--gold-300)', paddingLeft: 12 }}>
                    {chapter.benchmark.excerpt}
                  </p>
                </div>

                <div>
                  <h4 style={{ fontSize: 'var(--font-size-sm)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 'var(--space-3)' }}>
                    三種專家視角完整範本
                  </h4>
                  {chapter.expertTemplates.map(t => {
                    const meta = PERSONA_META[t.persona];
                    return (
                      <div key={t.persona} className="card" style={{ marginBottom: 'var(--space-3)', borderLeft: `3px solid ${meta.color}` }}>
                        <div className="card-header" style={{ minHeight: 44 }}>
                          <span className="badge badge-sm" style={{ background: meta.bg, color: meta.color, borderColor: 'transparent' }}>
                            {meta.label}
                          </span>
                          <button
                            className="btn btn-ghost btn-xs flex items-center gap-1"
                            onClick={() => {
                              const updated = { ...content, [chapter.id]: t.text };
                              setContent(updated);
                              saveToLocal(updated);
                              setActivePanel('write');
                              showToast(`已套用 ${meta.label} 範本`, 'info');
                            }}
                            aria-label={`套用 ${meta.label} 範本`}
                          >
                            <Plus size={11} /> 套用此範本
                          </button>
                        </div>
                        <div className="card-body">
                          <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-secondary)', lineHeight: 1.8 }}>
                            {t.text}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}