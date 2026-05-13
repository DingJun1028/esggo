'use client';

import { useState } from 'react';
import {
  FileEdit, CheckCircle, AlertTriangle, Brain, Shield, Save, Download,
  ChevronRight, ChevronDown, BookOpen, FileText, Upload, BarChart2,
  Plus, X, TrendingUp, StickyNote, Hash, Clock, Tag, Layers,
  MessageSquare, Activity, AlignLeft, Trash2, RefreshCw, PieChart as PieIcon
} from 'lucide-react';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer
} from 'recharts';

type ChartType = 'line' | 'bar' | 'pie' | 'area';
interface ChartKey { key: string; label: string; color: string; }
interface ChartPreset {
  id: string; name: string; type: ChartType; gri: string; xKey: string;
  data: Record<string, string | number | null>[];
  keys: ChartKey[];
}
interface InsertedChart { uid: string; presetId: string; sectionId: string; }
interface NoteItem {
  id: string; type: 'note' | 'question' | 'todo' | 'done';
  text: string; gri_tag: string; timestamp: string;
}
interface UploadItem { id: string; name: string; size: string; type: string; timestamp: string; }

// ─── CHAPTERS (208 pages total) ──────────────────────────────────────────────
const CHAPTERS = [
  {
    id: 'cover', title: '封面、目錄與永續摘要', gri: '通用', estimatedPages: 8, color: '#64748B',
    sections: [
      { id: 'cv1', title: '1.1 封面與 CEO 聲明', fields: ['企業名稱、LOGO、報告期間', '董事長/CEO 永續聲明書', 'ESG 委員會主席聲明', '確信機構名稱'], docs: ['公司 LOGO 高解析度檔案', '董事長親筆簽名掃描件', '永續委員會核准記錄'], formula: '—' },
      { id: 'cv2', title: '1.2 目錄與 GRI/ISSB 索引', fields: ['章節目錄與頁碼對應', 'GRI 2021 內容索引表', 'ISSB S1/S2 對照表', 'TCFD 對照表', 'SDGs 對應摘要'], docs: ['最終頁碼確認表', 'GRI 索引草稿', 'ISSB 對照工作表'], formula: '—' },
      { id: 'cv3', title: '1.3 永續績效亮點摘要', fields: ['五大 ESG 亮點（量化）', '關鍵指標年度對比表', 'UN SDGs 重點貢獻說明', '年度目標達成情況'], docs: ['年度 ESG 亮點彙整', 'KPI 對比統計表'], formula: '—' },
    ]
  },
  {
    id: 'general', title: '第一章：基礎治理與重大性評估', gri: 'GRI 2', estimatedPages: 28, color: '#003262',
    sections: [
      { id: 'g1', title: '2.1 組織基本資料（GRI 2-1 ~ 2-6）', fields: ['公司名稱、組織型態（GRI 2-1）', '主要活動、品牌、產品及服務（GRI 2-6）', '員工總人數（性別/職類/地區）（GRI 2-7）', '工人總人數（非員工）（GRI 2-8）', '供應鏈概述', '重大市場與客戶所在地', '所有權結構與法律型態', '子公司及關聯企業清單'], docs: ['公司登記證明書', '最新年報', '股東結構資料', '組織架構圖', '子公司清單'], formula: '員工人數 = 全職 + 兼職 + 定期契約（依實際在職日數加權計算）' },
      { id: 'g2', title: '2.2 報告書基礎架構（GRI 2-2 ~ 2-5）', fields: ['報告期間與截止日（GRI 2-3）', '組織邊界/財務控制邊界（GRI 2-2）', '外部確信情況（GRI 2-5）', '報告書聯絡人資訊', '與前期報告書之重述說明', '採用之 GRI 版本'], docs: ['前期報告書', '外部確信合約', 'ISAE 3000 確信聲明書'], formula: '—' },
      { id: 'g3', title: '2.3 治理架構（GRI 2-9 ~ 2-21）', fields: ['最高治理機構組成（GRI 2-9）', '董事會名義主席（GRI 2-11）', '最高治理機構永續角色（GRI 2-13）', '永續報告書評估批准（GRI 2-14）', '利益衝突迴避（GRI 2-15）', '最高治理機構之知識與技能（GRI 2-17）', '高階主管薪酬與永續績效連結（GRI 2-19）', '永續委員會組成與職責', '獨立董事人數與比例（≥3人或1/3）'], docs: ['董事會名冊', '董事會績效評估報告', '薪酬委員會報告', '永續委員會章程'], formula: '獨立董事比例 = 獨立董事人數 / 董事總人數 × 100%' },
      { id: 'g4', title: '2.4 策略、政策與實踐（GRI 2-22 ~ 2-28）', fields: ['永續發展聲明（GRI 2-22）', '人權政策承諾（GRI 2-23）', '環境政策承諾（GRI 2-23）', '損害之補救機制（GRI 2-25）', '申訴機制設立（GRI 2-26）', '外部倡議遵守情況（GRI 2-27）', '行業協會成員資格（GRI 2-28）'], docs: ['永續政策文件集', '人權聲明書', '環境政策', '供應商行為準則', '申訴管道說明'], formula: '—' },
      { id: 'g5', title: '2.5 利害關係人參與（GRI 2-29 ~ 2-30）', fields: ['利害關係人識別方法', '各群組參與方式與頻率', '關鍵關注議題彙整', '回應機制說明', '集體協商涵蓋之員工比例（GRI 2-30）'], docs: ['利害關係人問卷原始資料', '深度訪談紀錄', '參與活動記錄', '集體協商協議'], formula: '集體協商比例 = 受集體協商協議涵蓋人數 / 員工總數 × 100%' },
      { id: 'g6', title: '2.6 雙重重大性評估（GRI 3-1 ~ 3-3）', fields: ['重大議題確認過程（GRI 3-1）', '重大議題清單（GRI 3-2）', '各重大議題管理方針（GRI 3-3）', '雙重重大性矩陣（衝擊度 × 關注度 1-10分）', '董事會審議與確認記錄', '與前期議題變化說明'], docs: ['重大性評估報告', '利害關係人問卷統計', '董事會決議記錄', '重大性矩陣圖'], formula: '重大性分數 = (衝擊度 × 0.5) + (關注度 × 0.5)；分數 ≥ 7 視為重大議題' },
    ]
  },
  {
    id: 'environment', title: '第二章：環境面揭露 Environment (E)', gri: 'GRI 300', estimatedPages: 52, color: '#2E8B57',
    sections: [
      { id: 'e1', title: '3.1 溫室氣體盤查（GRI 305）', fields: ['範疇一：固定燃燒源直接排放量（tCO₂e）', '範疇一：移動燃燒源直接排放量（tCO₂e）', '範疇一：工業製程排放量（tCO₂e）', '範疇二：購買電力（位置基礎法）（tCO₂e）', '範疇二：購買電力（市場基礎法）（tCO₂e）', '範疇三 Cat.1：採購商品與服務', '範疇三 Cat.3：燃料與能源相關活動', '範疇三 Cat.4：上游運輸', '範疇三 Cat.6：商務旅行', '範疇三 Cat.7：員工通勤', 'GHG 排放密度（tCO₂e/NT$百萬元）', 'GHG 減少量（tCO₂e）', 'SBTi 科學基礎減量目標設定與進度', 'ISO 14064-1 第三方查證聲明'], docs: ['ISO 14064-1 盤查清冊', 'GHG 第三方查證聲明書', '冷媒填充紀錄', '燃油消耗紀錄', '範疇三計算工作表', '供應商碳足跡調查'], formula: '範疇一 = Σ(活動數據 × 排放係數 × GWP)；依 IPCC AR6 / 環保署最新排放係數' },
      { id: 'e2', title: '3.2 能源管理（GRI 302）', fields: ['組織內能源消耗總量（GJ）', '化石燃料消耗量（GJ）——天然氣/柴油/汽油', '再生能源消耗量（GJ）——太陽能/風能', '購買電力消耗量（kWh）', '自發電量（kWh）', '綠電憑證 T-REC 採購數量（MWh）', '再生能源使用比例（%）', '能源密度（GJ/NT$百萬元）', '能源節省量（GJ）', 'ISO 50001 認證狀況', '低碳能源技術投資（NT$）'], docs: ['台電帳單（12個月）', 'T-REC 綠電採購憑證', '天然氣/油資帳單', 'ISO 50001 證書', '太陽能發電紀錄'], formula: '再生能源比例 = (自發再生能源 kWh + T-REC kWh) / 總用電 kWh × 100%\n能源密度 = 總能源消耗(GJ) / 年度營收(NT$百萬元)' },
      { id: 'e3', title: '3.3 水資源管理（GRI 303）', fields: ['水資源管理方針（GRI 303-1）', '用水相關影響管理（GRI 303-2）', '各來源取水量（m³）——自來水/地下水/雨水/回收水', '缺水地區取水量', '各目的地廢水排放量（m³）（GRI 303-4）', '廢水水質指標（BOD/COD/SS/TP）', '水資源消耗量（m³）（GRI 303-5）', '水資源密度（m³/NT$百萬元）', '水資源回收再利用量與比例', '缺水地區風險評估（WRI Aqueduct）'], docs: ['自來水帳單（12個月）', '水權狀', '廢水水質月報', '廢水排放許可', '用水效率改善計畫'], formula: '水資源消耗量 = 總取水量 - 總廢水排放量\n水資源密度 = 消耗量(m³) / 年度營收(NT$百萬元)' },
      { id: 'e4', title: '3.4 廢棄物管理（GRI 306）', fields: ['廢棄物管理方針（GRI 306-1）', '廢棄物相關顯著影響（GRI 306-2）', '廢棄物產生總量（公噸）（GRI 306-3）', '轉移廢棄物——有害/一般（GRI 306-4）', '再利用比例（%）', '回收比例（%）', '能源回收比例（%）', '焚化比例（%）', '掩埋比例（%）', '有害廢棄物處理方式說明', '廢棄物密度（公噸/NT$百萬元）', '循環經濟成果'], docs: ['廢棄物清運聯單（全年）', '回收商合法執照', '過磅單', '有害廢棄物處理合約'], formula: '廢棄物回收率 = 回收量(公噸) / 廢棄物總量(公噸) × 100%' },
      { id: 'e5', title: '3.5 生物多樣性（GRI 304）', fields: ['各據點鄰近保護區情況（GRI 304-1）', '對生物多樣性有顯著影響之活動（GRI 304-2）', '受保護或復育物種（GRI 304-4）', 'TNFD LEAP 方法論應用', '自然相關財務揭露（TNFD Beta）', '生態補償或復育措施'], docs: ['環境影響評估報告', 'TNFD 評估報告', '生態復育計畫'], formula: '—' },
      { id: 'e6', title: '3.6 環境合規與投資（GRI 307）', fields: ['環保違規罰款總金額（NT$）', '非金融環境處罰數量', '環境裁罰案件說明', '環保投資金額（NT$）', 'ISO 14001 認證狀況', '環境教育訓練時數'], docs: ['ISO 14001 證書', '環保局裁處書', '環保設備採購合約'], formula: '—' },
      { id: 'e7', title: '3.7 TCFD 氣候相關財務揭露', fields: ['治理：董事會氣候風險監督機制', '治理：管理層氣候風險管理角色', '策略：已識別氣候相關風險與機會', '策略：1.5°C 情境對業務影響', '策略：4°C 情境對業務影響', '策略：氣候韌性評估', '風險管理：識別與評估流程', '風險管理：整合至整體企業風險', '指標：溫室氣體排放量（S1+S2+S3）', '指標：碳強度與2025目標', '物理風險財務影響量化（NT$M）', '轉型風險財務影響量化（NT$M）'], docs: ['TCFD 報告', '氣候情境分析報告', '碳定價影響評估', '氣候韌性評估'], formula: '碳強度 = (S1 + S2 市場基礎) tCO₂e / 年度營收 NT$百萬元' },
    ]
  },
  {
    id: 'social', title: '第三章：社會面揭露 Social (S)', gri: 'GRI 400', estimatedPages: 48, color: '#3B7EA1',
    sections: [
      { id: 's1', title: '4.1 就業與員工結構（GRI 401）', fields: ['員工總人數（全職/兼職/定期契約）', '各性別員工人數與比例', '各年齡層分布（<30/30-50/>50）', '各地區員工人數', '新進員工人數與比率（按性別/年齡）', '員工離職人數與比率（按性別/年齡）', '育嬰留停申請人數（按性別）', '育嬰留停後復職率（按性別）', '全職員工福利項目清單'], docs: ['人資系統匯出報表', '員工名冊（保密版）', '新進/離職統計表', '育嬰留停申請/復職記錄'], formula: '新進率 = 年度新進人數 / 期初員工總數 × 100%\n離職率 = 年度離職人數 / 期初員工總數 × 100%' },
      { id: 's2', title: '4.2 職業安全衛生（GRI 403）', fields: ['職安衛管理體系（ISO 45001）（GRI 403-1）', '危害識別與風險評估（GRI 403-2）', '職業健康服務（GRI 403-3）', '工作者在職安衛中的參與（GRI 403-4）', '職安衛訓練（GRI 403-5）', '工作相關傷害——員工（GRI 403-9）', '工作相關傷害——工人（GRI 403-10）', '失能傷害頻率 FR', '失能傷害嚴重率 SR', '職業疾病發生率', '工作相關死亡人數', '零職災月份統計'], docs: ['ISO 45001 證書', '勞保局職災申報單', '工安事件調查報告', '職安衛委員會會議記錄'], formula: 'FR = 傷害次數 × 1,000,000 / 總工時\nSR = 損失工時 × 1,000,000 / 總工時\n職業疾病率 = 職業疾病案例數 × 1,000,000 / 總工時' },
      { id: 's3', title: '4.3 訓練與教育（GRI 404）', fields: ['平均受訓時數（按性別/員工類別）（GRI 404-1）', '技能提升及轉換計畫（GRI 404-2）', '績效考核覆蓋率（按性別）（GRI 404-3）', '訓練費用總額（NT$）', '領導力發展計畫', '數位技能培訓投資', '因應 AI/自動化再培訓計畫', '內部晉升比率'], docs: ['教育訓練簽到表', '線上課程完課記錄', '績效考核系統報告', '訓練費用統計'], formula: '平均受訓時數 = 訓練總時數 / 受訓人數\n績效考核覆蓋率 = 完成考核人數 / 員工總數 × 100%' },
      { id: 's4', title: '4.4 多元化與平等機會（GRI 405）', fields: ['治理機構成員多元性（性別/年齡）（GRI 405-1）', '女性主管比例（高/中/基層）', '薪酬比率——女性/男性（按職類）（GRI 405-2）', '身心障礙員工人數與比例', 'DEI 政策與倡議', '反歧視政策與案件統計'], docs: ['薪資結算表（保密）', 'DEI 政策文件', '身心障礙員工統計', '反歧視事件記錄'], formula: '薪酬比率 = 女性平均薪酬 / 男性平均薪酬 × 100%（按職類計算）' },
      { id: 's5', title: '4.5 供應鏈社會責任（GRI 414）', fields: ['新供應商社會影響評估（GRI 414-1）', '供應鏈社會影響及採取行動（GRI 414-2）', '供應商行為準則簽署比例', '供應商稽核覆蓋率', '因社會考量終止之供應商', '衝突礦物政策', '供應商能力建設計畫'], docs: ['供應商行為準則簽署書', '供應商 ESG 稽核評分表', '稽核結果報告', '衝突礦物聲明'], formula: '供應商稽核率 = 完成稽核供應商數 / 重大供應商總數 × 100%' },
      { id: 's6', title: '4.6 人權管理（GRI 412）', fields: ['人權盡職調查涵蓋業務（GRI 412-1）', '顯著投資協議人權條款（GRI 412-2）', '員工人權政策訓練比率（GRI 412-3）', '人權風險識別與評估', '供應鏈人權風險管理', '強迫勞動/童工預防政策', '結社自由保障措施'], docs: ['人權盡職調查報告', '人權政策文件', '人權訓練記錄', '供應商人權問卷'], formula: '—' },
      { id: 's7', title: '4.7 在地社區影響（GRI 413）', fields: ['具在地社區參與之營運（GRI 413-1）', '顯著負面社區影響之營運（GRI 413-2）', '社會責任投資總額（NT$）', '公益活動類別與參與人次', '在地採購比例', '地方就業機會創造'], docs: ['社區參與評估報告', '公益活動紀錄', '在地採購統計', '社區意見調查'], formula: '在地採購比例 = 在地採購金額 / 總採購金額 × 100%' },
    ]
  },
  {
    id: 'governance', title: '第四章：公司治理揭露 Governance (G)', gri: 'GRI 200', estimatedPages: 32, color: '#4B0082',
    sections: [
      { id: 'gv1', title: '5.1 經濟績效（GRI 201）', fields: ['直接創造並分配的經濟價值（GRI 201-1）', '氣候變遷財務衝擊（GRI 201-2）', '確定福利計畫義務（GRI 201-3）', '政府提供的財務補助（GRI 201-4）', '年度營收、成本、薪酬、社區投資、股利分配表'], docs: ['財務報告', '氣候財務影響評估', '退休金精算報告', '政府補助申請文件'], formula: '經濟價值 = 營收 - (採購成本 + 薪酬 + 稅款 + 社區投資 + 股利)' },
      { id: 'gv2', title: '5.2 採購實踐（GRI 204）', fields: ['在地供應商採購比例（GRI 204-1）', '在地採購政策說明', '前 10 大供應商在地/國際比例', '在地採購促進計畫'], docs: ['採購系統報告', '在地採購統計表', '供應商名冊'], formula: '在地採購比例 = 在地供應商採購金額 / 總採購金額 × 100%' },
      { id: 'gv3', title: '5.3 反貪腐（GRI 205）', fields: ['貪腐風險評估業務數量（GRI 205-1）', '反貪腐政策訓練人數（GRI 205-2）', '已確認貪腐事件數（GRI 205-3）', '廉政申訴管道運作情況', '舉報件數與處理結果', '貪腐相關法律訴訟'], docs: ['反貪腐政策文件', '內部稽核報告', '申訴管道記錄', '法務裁罰通知書'], formula: '反貪腐訓練覆蓋率 = 完成訓練人數 / 適用人員總數 × 100%' },
      { id: 'gv4', title: '5.4 稅務透明度（GRI 207）', fields: ['稅務管理方針（GRI 207-1）', '利害關係人溝通稅務（GRI 207-2）', '國家稅務倡議（GRI 207-3）', '國家別報告（GRI 207-4）：各地稅前盈利/實際稅率/員工', '移轉訂價政策說明', '有效稅率 vs 法定稅率差異'], docs: ['稅務申報書', '移轉訂價報告', '國家別稅務揭露文件'], formula: '有效稅率 = 實際應繳稅款 / 稅前盈利 × 100%' },
      { id: 'gv5', title: '5.5 資訊安全與客戶隱私（GRI 418）', fields: ['客戶隱私違規投訴（GRI 418-1）', '個資外洩事件數及影響人數', 'ISO 27001 認證', '資安事件應對計畫（CSIRP）', '員工資安訓練覆蓋率', '供應商資安管理', '資安漏洞掃描覆蓋率', 'GDPR/個資法合規'], docs: ['ISO 27001 證書', '資安演練紀錄', '系統弱點掃描報告', '個資保護政策', 'CSIRP 文件'], formula: '—' },
    ]
  },
  {
    id: 'issb', title: '第五章：ISSB S1/S2 永續財務揭露', gri: 'ISSB S1/S2', estimatedPages: 22, color: '#1B4F8A',
    sections: [
      { id: 'i1', title: '6.1 ISSB S1 永續相關財務資訊通用要求', fields: ['治理：最高治理機構監督機制', '治理：管理層角色', '策略：重大永續相關風險與機會', '策略：短中長期財務影響', '策略：韌性評估與情境分析', '風險管理：識別評估排序過程', '風險管理：整合至整體風險管理', '指標：衡量和監測所用指標', '目標：設定的永續目標與進度'], docs: ['ISSB S1 評估報告', '董事會批准記錄', '風險管理政策文件'], formula: '—' },
      { id: 'i2', title: '6.2 ISSB S2 氣候相關揭露', fields: ['氣候治理：董事會監督機制', '氣候治理：管理層角色', '氣候情境分析（1.5°C/2°C/4°C）', '物理風險：急性風險（極端天氣）', '物理風險：慢性風險（海平面上升）', '轉型風險：政策法規/技術/市場', '氣候相關機會識別', '氣候財務影響量化', 'S1+S2 溫室氣體排放量', '範疇三適用類別排放量', '碳強度指標（tCO₂e/NT$百萬元）', 'SBTi 目標認定'], docs: ['ISSB S2 評估報告', 'SBTi 認定文件', '氣候情境分析', '物理風險地圖', '轉型風險評估'], formula: '碳強度 = (S1 + S2 市場基礎) tCO₂e / 年度營收 NT$百萬元' },
    ]
  },
  {
    id: 'appendix', title: '附錄：索引、對照表與確信聲明', gri: 'Appendix', estimatedPages: 18, color: '#64748B',
    sections: [
      { id: 'a1', title: '附錄 A：GRI 2021 完整內容索引', fields: ['GRI 2 通用揭露索引（2-1 至 2-30）', 'GRI 3 重大議題索引（3-1 至 3-3）', 'GRI 300 環境系列全部指標', 'GRI 400 社會系列全部指標'], docs: ['GRI 內容索引完整表', '外部確信確認表'], formula: '—' },
      { id: 'a2', title: '附錄 B：SASB 產業標準對照', fields: ['SICS 產業識別', '適用 SASB 主題與指標', 'SASB 與 GRI/ISSB 對照表'], docs: ['SASB 對照分析文件'], formula: '—' },
      { id: 'a3', title: '附錄 C：外部確信聲明', fields: ['確信範圍說明', '確信標準（ISAE 3000/AA1000AS）', '確信等級（有限/合理）', '確信師獨立性聲明'], docs: ['外部確信報告全文', 'ISAE 3000 聲明書'], formula: '—' },
      { id: 'a4', title: '附錄 D：UN SDGs 對應矩陣', fields: ['ESG 活動與 17 個 SDGs 對應', '重點 SDGs 說明', 'SDGs 指標貢獻量化'], docs: ['SDGs 對應分析表'], formula: '—' },
    ]
  },
];

// ─── PRESET CHARTS ─────────────────────────────────────────────────────────
const PRESET_CHARTS: ChartPreset[] = [
  {
    id: 'ghg_trend', name: 'GHG 三範疇排放趨勢（tCO₂e）', type: 'line', gri: 'GRI 305', xKey: 'name',
    data: [{ name: '2022', s1: 1450, s2: 1020, total: 5800 }, { name: '2023', s1: 1380, s2: 950, total: 5540 }, { name: '2024', s1: 1310, s2: 920, total: 5320 }, { name: '2025', s1: 1250, s2: 890, total: 5140 }],
    keys: [{ key: 's1', label: '範疇一', color: '#2E8B57' }, { key: 's2', label: '範疇二', color: '#3B7EA1' }, { key: 'total', label: '三範疇合計', color: '#003262' }]
  },
  {
    id: 'energy_mix', name: '能源結構分布（%）', type: 'pie', gri: 'GRI 302', xKey: 'name',
    data: [{ name: '購買電力', value: 58, color: '#3B7EA1' }, { name: '天然氣', value: 22, color: '#B8860B' }, { name: '再生能源', value: 15, color: '#2E8B57' }, { name: '燃油', value: 5, color: '#CC4400' }],
    keys: [{ key: 'value', label: '比例', color: '' }]
  },
  {
    id: 'water_trend', name: '水資源消耗趨勢（m³）', type: 'area', gri: 'GRI 303', xKey: 'year',
    data: [{ year: '2022', intake: 48500, consume: 16500 }, { year: '2023', intake: 46200, consume: 14700 }, { year: '2024', intake: 44800, consume: 13600 }, { year: '2025', intake: 42100, consume: 11600 }],
    keys: [{ key: 'intake', label: '取水量 m³', color: '#3B7EA1' }, { key: 'consume', label: '消耗量 m³', color: '#B8860B' }]
  },
  {
    id: 'waste_dist', name: '廢棄物處理方式分布（%）', type: 'pie', gri: 'GRI 306', xKey: 'name',
    data: [{ name: '資源回收', value: 45, color: '#2E8B57' }, { name: '能源回收', value: 28, color: '#B8860B' }, { name: '焚化', value: 18, color: '#CC4400' }, { name: '掩埋', value: 9, color: '#94A3B8' }],
    keys: [{ key: 'value', label: '比例 %', color: '' }]
  },
  {
    id: 'gender_dept', name: '各部門性別分布（人數）', type: 'bar', gri: 'GRI 401', xKey: 'dept',
    data: [{ dept: '生產部', male: 120, female: 45 }, { dept: '工程部', male: 85, female: 22 }, { dept: '業務部', male: 38, female: 52 }, { dept: '管理部', male: 25, female: 38 }],
    keys: [{ key: 'male', label: '男性', color: '#003262' }, { key: 'female', label: '女性', color: '#FDB515' }]
  },
  {
    id: 'safety_kpi', name: '職安衛 KPI 趨勢', type: 'line', gri: 'GRI 403', xKey: 'year',
    data: [{ year: '2022', FR: 0.68, SR: 18.5 }, { year: '2023', FR: 0.55, SR: 15.2 }, { year: '2024', FR: 0.48, SR: 13.1 }, { year: '2025', FR: 0.42, SR: 12.8 }],
    keys: [{ key: 'FR', label: '失能傷害頻率 FR', color: '#DC2626' }, { key: 'SR', label: '嚴重率 SR', color: '#D97706' }]
  },
  {
    id: 'training_hrs', name: '平均受訓時數（小時/年）', type: 'bar', gri: 'GRI 404', xKey: 'category',
    data: [{ category: '高階主管', male: 28, female: 26 }, { category: '中階主管', male: 34, female: 32 }, { category: '基層人員', male: 38, female: 36 }, { category: '技術人員', male: 42, female: 40 }],
    keys: [{ key: 'male', label: '男性（h）', color: '#003262' }, { key: 'female', label: '女性（h）', color: '#3B7EA1' }]
  },
  {
    id: 'carbon_path', name: '碳排放減量路徑（SBTi）', type: 'area', gri: 'TCFD / ISSB S2', xKey: 'year',
    data: [{ year: '2022', actual: 5800, target: 5800 }, { year: '2023', actual: 5540, target: 5510 }, { year: '2024', actual: 5320, target: 5220 }, { year: '2025', actual: 5140, target: 4930 }, { year: '2028E', actual: null, target: 4060 }, { year: '2030E', actual: null, target: 2668 }],
    keys: [{ key: 'actual', label: '實際排放量', color: '#DC2626' }, { key: 'target', label: 'SBTi 目標路徑', color: '#2E8B57' }]
  },
];

const GRI_TAGS = ['GRI 2', 'GRI 302', 'GRI 303', 'GRI 305', 'GRI 306', 'GRI 401', 'GRI 403', 'GRI 404', 'GRI 405', 'TCFD', 'ISSB S2', 'SBTi'];
const NOTE_TYPES = [
  { id: 'note' as const, label: '備註', color: '#3B7EA1', bg: '#EBF5FB' },
  { id: 'question' as const, label: '待確認', color: '#D97706', bg: '#FEF3C7' },
  { id: 'todo' as const, label: '待辦', color: '#DC2626', bg: '#FEF2F2' },
  { id: 'done' as const, label: '已完成', color: '#16A34A', bg: '#DCFCE7' },
];

// ─── CHART RENDERER ────────────────────────────────────────────────────────
function ChartRenderer({ chart }: { chart: ChartPreset }) {
  if (chart.type === 'pie') {
    return (
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie data={chart.data} dataKey="value" cx="50%" cy="50%" outerRadius={80}
            label={({ name, value }) => `${name}: ${value}%`} labelLine={false}>
            {chart.data.map((entry, i) => (
              <Cell key={i} fill={('color' in entry && typeof entry.color === 'string') ? entry.color : '#003262'} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    );
  }
  if (chart.type === 'bar') {
    return (
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={chart.data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
          <XAxis dataKey={chart.xKey} tick={{ fontSize: 10 }} />
          <YAxis tick={{ fontSize: 10 }} />
          <Tooltip />
          <Legend />
          {chart.keys.map(k => (
            <Bar key={k.key} dataKey={k.key} fill={k.color} name={k.label} radius={[3, 3, 0, 0]} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    );
  }
  if (chart.type === 'area') {
    return (
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={chart.data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
          <XAxis dataKey={chart.xKey} tick={{ fontSize: 10 }} />
          <YAxis tick={{ fontSize: 10 }} />
          <Tooltip />
          <Legend />
          {chart.keys.map(k => (
            <Area key={k.key} type="monotone" dataKey={k.key} stroke={k.color}
              fill={k.color + '20'} name={k.label} connectNulls={false} />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    );
  }
  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={chart.data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
        <XAxis dataKey={chart.xKey} tick={{ fontSize: 10 }} />
        <YAxis tick={{ fontSize: 10 }} />
        <Tooltip />
        <Legend />
        {chart.keys.map(k => (
          <Line key={k.key} type="monotone" dataKey={k.key} stroke={k.color}
            strokeWidth={2} name={k.label} dot={{ r: 3 }} />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}

// ─── MAIN PAGE ─────────────────────────────────────────────────────────────
const BLUE = '#003262';
const GOLD = '#FDB515';
const TOTAL_PAGES = CHAPTERS.reduce((a, c) => a + c.estimatedPages, 0);

export default function EditorPage() {
  const [activeChapterId, setActiveChapterId] = useState('general');
  const [activeSectionId, setActiveSectionId] = useState('g1');
  const [content, setContent] = useState('本公司依據 GRI 2021 準則，以雙重重大性評估方法，識別並揭露對環境、社會及公司治理層面具顯著影響之核心議題。本章節提供完整的組織背景、治理架構與重大性評估結果。\n\n本報告書涵蓋期間為 2025 年 1 月 1 日至 12 月 31 日，報告邊界為母公司合併財務控制範圍內之所有營運實體，共涵蓋台灣本島 3 個主要生產基地及 2 個海外子公司。\n\n報告書依循 GRI 2021 核心選項編製，並已取得 KPMG Taiwan 有限確信（ISAE 3000）。本報告書已獲永續委員會及董事會審閱並核准發布。');
  const [selectedTags, setSelectedTags] = useState<string[]>(['GRI 2']);
  const [tab, setTab] = useState<'write' | 'preview'>('write');
  const [showChartModal, setShowChartModal] = useState(false);
  const [insertedCharts, setInsertedCharts] = useState<InsertedChart[]>([]);
  const [checkedDocs, setCheckedDocs] = useState<Record<string, boolean>>({});
  const [showDocs, setShowDocs] = useState(true);
  const [showNotes, setShowNotes] = useState(true);
  const [notesTab, setNotesTab] = useState<'notes' | 'upload'>('notes');
  const [notes, setNotes] = useState<NoteItem[]>([
    { id: 'n1', type: 'question', text: '確認 GRI 2-7 員工人數是否包含派遣員工', gri_tag: 'GRI 2', timestamp: '2026-05-13 10:30' },
    { id: 'n2', type: 'todo', text: '請人資部門於 6/15 前提供 2025 年育嬰留停復職數據', gri_tag: 'GRI 401', timestamp: '2026-05-13 11:20' },
  ]);
  const [uploads, setUploads] = useState<UploadItem[]>([
    { id: 'u1', name: '董事會名冊_2025.pdf', size: '1.2 MB', type: 'PDF', timestamp: '2026-05-13 09:15' },
    { id: 'u2', name: '重大性評估問卷統計.xlsx', size: '0.8 MB', type: 'Excel', timestamp: '2026-05-12 16:40' },
  ]);
  const [newNoteText, setNewNoteText] = useState('');
  const [newNoteType, setNewNoteType] = useState<'note' | 'question' | 'todo' | 'done'>('note');
  const [newNoteTag, setNewNoteTag] = useState('GRI 2');
  const [saved, setSaved] = useState(false);
  const [sectionContents, setSectionContents] = useState<Record<string, string>>({});
  const [expandedChapters, setExpandedChapters] = useState<Record<string, boolean>>({ general: true });

  const activeChapter = CHAPTERS.find(c => c.id === activeChapterId)!;
  const activeSection = activeChapter?.sections.find(s => s.id === activeSectionId)
    || activeChapter?.sections[0];

  const sectionKey = `${activeChapterId}-${activeSectionId}`;
  const currentContent = sectionContents[sectionKey] ?? content;

  const chartsForSection = insertedCharts.filter(c => c.sectionId === activeSectionId);

  const totalDocs = CHAPTERS.reduce((a, c) => a + c.sections.reduce((b, s) => b + s.docs.length, 0), 0);
  const completedDocs = Object.values(checkedDocs).filter(Boolean).length;
  const completionPct = Math.round((completedDocs / totalDocs) * 100);

  const handleSave = () => {
    setSectionContents(prev => ({ ...prev, [sectionKey]: currentContent }));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleInsertChart = (presetId: string) => {
    setInsertedCharts(prev => [...prev, { uid: Date.now().toString(), presetId, sectionId: activeSectionId }]);
    setShowChartModal(false);
  };

  const handleRemoveChart = (uid: string) => {
    setInsertedCharts(prev => prev.filter(c => c.uid !== uid));
  };

  const handleAddNote = () => {
    if (!newNoteText.trim()) return;
    const note: NoteItem = {
      id: Date.now().toString(), type: newNoteType,
      text: newNoteText, gri_tag: newNoteTag,
      timestamp: new Date().toLocaleString('zh-TW', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })
    };
    setNotes(prev => [note, ...prev]);
    setNewNoteText('');
  };

  const handleRemoveNote = (id: string) => setNotes(prev => prev.filter(n => n.id !== id));

  const handleSimulateUpload = () => {
    const fakeFiles = ['Q1_能源數據.xlsx', '廢水水質報告_2025.pdf', '供應商問卷統計.xlsx', 'ISO14064查證聲明.pdf'];
    const f = fakeFiles[Math.floor(Math.random() * fakeFiles.length)];
    const newFile: UploadItem = {
      id: Date.now().toString(), name: f,
      size: `${(Math.random() * 3 + 0.3).toFixed(1)} MB`,
      type: f.endsWith('.pdf') ? 'PDF' : 'Excel',
      timestamp: new Date().toLocaleString('zh-TW', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })
    };
    setUploads(prev => [newFile, ...prev]);
  };

  const handleRemoveUpload = (id: string) => setUploads(prev => prev.filter(u => u.id !== id));

  const toggleTag = (t: string) => setSelectedTags(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]);
  const toggleDoc = (key: string) => setCheckedDocs(prev => ({ ...prev, [key]: !prev[key] }));

  return (
    <div style={{ background: '#F4F6F9', minHeight: '100vh' }}>
      {/* Header */}
      <div className="page-header">
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <FileEdit size={20} color={GOLD} />
            <span style={{ color: '#A8C8E8', fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase' }}>
              SustainWrite · 5T Protocol · ZKP Seal · 208 Pages
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <h1 style={{ color: '#fff', fontSize: 'clamp(1.1rem,2.5vw,1.5rem)', fontWeight: 800, margin: 0 }}>
              永續撰寫 SustainWrite Editor
            </h1>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {[
                { l: '總頁數', v: `${TOTAL_PAGES} 頁` },
                { l: '章節數', v: `${CHAPTERS.reduce((a, c) => a + c.sections.length, 0)}` },
                { l: '文件就緒', v: `${completedDocs}/${totalDocs}` },
                { l: '完成度', v: `${completionPct}%` }
              ].map(s => (
                <div key={s.l} style={{ background: 'rgba(255,255,255,0.12)', borderRadius: 8, padding: '5px 12px', display: 'flex', gap: 6, alignItems: 'center' }}>
                  <span style={{ color: GOLD, fontWeight: 800, fontSize: 14 }}>{s.v}</span>
                  <span style={{ color: '#A8C8E8', fontSize: 11 }}>{s.l}</span>
                </div>
              ))}
            </div>
          </div>
          {/* Overall Progress */}
          <div style={{ marginTop: 10, height: 6, background: 'rgba(255,255,255,0.15)', borderRadius: 3, overflow: 'hidden', maxWidth: 400 }}>
            <div style={{ height: '100%', width: `${completionPct}%`, background: GOLD, borderRadius: 3, transition: 'width 0.6s' }} />
          </div>
        </div>
      </div>

      {/* Main 3-column layout */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '20px 16px', display: 'grid', gridTemplateColumns: '220px 1fr 290px', gap: 14, alignItems: 'start' }}>

        {/* ── LEFT: Chapter Nav ── */}
        <div style={{ background: '#fff', borderRadius: 12, border: '1.5px solid #E2E8F0', overflow: 'hidden', position: 'sticky', top: 16 }}>
          <div style={{ padding: '11px 14px', background: BLUE, color: '#fff', fontSize: 12, fontWeight: 700 }}>章節導覽</div>
          {/* Doc Collection Status */}
          <div style={{ padding: '10px 14px', borderBottom: '1px solid #F1F5F9', background: '#FFFBEB' }}>
            <div style={{ fontSize: 10, color: '#92400E', fontWeight: 700, marginBottom: 5 }}>總單據收集狀況</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#78350F', marginBottom: 4 }}>
              <span>已收集</span><span style={{ fontWeight: 800 }}>{completedDocs}/{totalDocs}</span>
            </div>
            <div style={{ height: 4, background: '#FEF3C7', borderRadius: 2, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${completionPct}%`, background: GOLD, borderRadius: 2 }} />
            </div>
          </div>
          {/* Chapter List */}
          <div style={{ maxHeight: 'calc(100vh - 260px)', overflowY: 'auto' }}>
            {CHAPTERS.map(ch => {
              const isExpanded = expandedChapters[ch.id];
              const isActiveChapter = activeChapterId === ch.id;
              return (
                <div key={ch.id}>
                  <button
                    onClick={() => {
                      setExpandedChapters(prev => ({ ...prev, [ch.id]: !prev[ch.id] }));
                      setActiveChapterId(ch.id);
                      setActiveSectionId(ch.sections[0].id);
                    }}
                    style={{ width: '100%', padding: '9px 12px', background: isActiveChapter ? '#EBF2FF' : '#fff', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'flex-start', gap: 7, borderLeft: `3px solid ${isActiveChapter ? ch.color : 'transparent'}`, textAlign: 'left' }}
                  >
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: ch.color, flexShrink: 0, marginTop: 4 }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: isActiveChapter ? ch.color : '#374151', lineHeight: 1.3 }}>{ch.title}</div>
                      <div style={{ fontSize: 9, color: '#94A3B8', marginTop: 2 }}>{ch.gri} · 約 {ch.estimatedPages} 頁</div>
                    </div>
                    {isExpanded ? <ChevronDown size={11} color="#94A3B8" /> : <ChevronRight size={11} color="#94A3B8" />}
                  </button>
                  {isExpanded && ch.sections.map(sec => (
                    <button
                      key={sec.id}
                      onClick={() => { setActiveChapterId(ch.id); setActiveSectionId(sec.id); }}
                      style={{ width: '100%', padding: '7px 12px 7px 24px', background: activeSectionId === sec.id ? `${ch.color}10` : '#fff', border: 'none', cursor: 'pointer', borderLeft: `3px solid ${activeSectionId === sec.id ? ch.color : 'transparent'}`, textAlign: 'left' }}
                    >
                      <div style={{ fontSize: 10, color: activeSectionId === sec.id ? ch.color : '#64748B', fontWeight: activeSectionId === sec.id ? 700 : 500, lineHeight: 1.3 }}>{sec.title}</div>
                    </button>
                  ))}
                </div>
              );
            })}
          </div>
        </div>

        {/* ── CENTER: Editor ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {/* Section Header */}
          <div style={{ background: '#fff', borderRadius: 12, border: `2px solid ${activeChapter.color}30`, padding: '14px 18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ background: activeChapter.color, color: '#fff', borderRadius: 5, padding: '2px 9px', fontSize: 10, fontWeight: 800 }}>{activeChapter.gri}</span>
                  <span style={{ background: `${activeChapter.color}15`, color: activeChapter.color, borderRadius: 5, padding: '2px 8px', fontSize: 10, fontWeight: 700 }}>約 {activeChapter.estimatedPages} 頁</span>
                </div>
                <div style={{ fontWeight: 700, color: '#111', fontSize: 15, marginTop: 4 }}>{activeSection?.title}</div>
                <div style={{ fontSize: 11, color: '#64748B', marginTop: 2 }}>{activeChapter.title}</div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                {(['write', 'preview'] as const).map(t => (
                  <button key={t} onClick={() => setTab(t)} style={{ padding: '6px 14px', borderRadius: 7, border: `1.5px solid ${tab === t ? BLUE : '#E2E8F0'}`, background: tab === t ? BLUE : '#fff', color: tab === t ? '#fff' : '#64748B', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                    {t === 'write' ? '撰寫' : '預覽'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Data Fields */}
          <div style={{ background: '#fff', borderRadius: 12, border: '1.5px solid #E2E8F0', padding: '14px 18px' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: BLUE, marginBottom: 10 }}>
              核心數據欄位（{activeSection?.fields.length} 項）
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 7 }}>
              {activeSection?.fields.map((f, i) => (
                <div key={i} style={{ background: '#F8FAFC', borderRadius: 7, padding: '7px 10px', fontSize: 11, color: '#374151', lineHeight: 1.4, border: '1px solid #F1F5F9', display: 'flex', alignItems: 'flex-start', gap: 7 }}>
                  <div style={{ width: 5, height: 5, borderRadius: '50%', background: activeChapter.color, flexShrink: 0, marginTop: 3 }} />
                  <span>{f}</span>
                </div>
              ))}
            </div>
            {activeSection?.formula && activeSection.formula !== '—' && (
              <div style={{ marginTop: 10, background: '#EBF2FF', borderRadius: 8, padding: '9px 12px', borderLeft: `3px solid ${BLUE}` }}>
                <div style={{ fontSize: 10, color: BLUE, fontWeight: 700, marginBottom: 3 }}>計算公式</div>
                <pre style={{ fontSize: 11, color: '#374151', margin: 0, fontFamily: 'monospace', whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>{activeSection.formula}</pre>
              </div>
            )}
          </div>

          {/* GRI Standard Tags */}
          <div style={{ background: '#fff', borderRadius: 12, border: '1.5px solid #E2E8F0', padding: '12px 18px' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: BLUE, marginBottom: 8 }}>標準標籤（點擊標記）</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {GRI_TAGS.map(t => (
                <button key={t} onClick={() => toggleTag(t)} style={{ padding: '3px 10px', borderRadius: 6, cursor: 'pointer', fontSize: 11, fontWeight: 600, background: selectedTags.includes(t) ? BLUE : '#F1F5F9', color: selectedTags.includes(t) ? '#fff' : '#64748B', border: `1.5px solid ${selectedTags.includes(t) ? BLUE : '#E2E8F0'}`, transition: 'all 0.15s' }}>{t}</button>
              ))}
            </div>
          </div>

          {/* Text Editor + Chart Toolbar */}
          <div style={{ background: '#fff', borderRadius: 12, border: '1.5px solid #E2E8F0', overflow: 'hidden' }}>
            {/* Toolbar */}
            <div style={{ padding: '8px 14px', borderBottom: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', gap: 8, background: '#FAFAFA', flexWrap: 'wrap' }}>
              <span style={{ fontSize: 11, color: '#64748B', fontWeight: 600 }}>工具列</span>
              <div style={{ width: 1, height: 16, background: '#E2E8F0' }} />
              <button onClick={() => setShowChartModal(true)} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 12px', borderRadius: 7, border: `1.5px solid ${activeChapter.color}`, background: `${activeChapter.color}10`, color: activeChapter.color, fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>
                <BarChart2 size={13} />插入圖表
              </button>
              <button style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 12px', borderRadius: 7, border: '1.5px solid #E2E8F0', background: '#fff', color: '#64748B', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>
                <Layers size={13} />數據表格
              </button>
              <div style={{ marginLeft: 'auto', fontSize: 10, color: '#94A3B8' }}>
                {currentContent.length} 字元 · {tab === 'write' ? '撰寫中' : '預覽中'}
              </div>
            </div>
            {/* Editor */}
            {tab === 'write' ? (
              <textarea
                value={currentContent}
                onChange={e => setSectionContents(prev => ({ ...prev, [sectionKey]: e.target.value }))}
                placeholder={`在此撰寫「${activeSection?.title}」的內容...\n\n提示：可搭配左側「核心數據欄位」逐一填寫揭露內容，每個欄位建議2-4段說明文字，並引用佐證文件數據。`}
                style={{ width: '100%', minHeight: 320, padding: '16px', fontSize: 13, lineHeight: 1.9, outline: 'none', resize: 'vertical', fontFamily: 'inherit', border: 'none', boxSizing: 'border-box', color: '#1F2937' }}
              />
            ) : (
              <div style={{ padding: '16px', minHeight: 320, fontSize: 13, lineHeight: 1.9, color: '#374151', whiteSpace: 'pre-wrap', background: '#FAFAFA' }}>
                {currentContent || <span style={{ color: '#94A3B8', fontStyle: 'italic' }}>尚無內容預覽</span>}
              </div>
            )}
          </div>

          {/* Inserted Charts Section */}
          {chartsForSection.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: BLUE, display: 'flex', alignItems: 'center', gap: 7 }}>
                <BarChart2 size={14} color={BLUE} />本節圖表（{chartsForSection.length} 張）
              </div>
              {chartsForSection.map(ic => {
                const preset = PRESET_CHARTS.find(p => p.id === ic.presetId);
                if (!preset) return null;
                return (
                  <div key={ic.uid} style={{ background: '#fff', borderRadius: 12, border: '1.5px solid #E2E8F0', overflow: 'hidden' }}>
                    <div style={{ padding: '11px 16px', borderBottom: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div>
                        <span style={{ fontWeight: 700, color: '#111', fontSize: 13 }}>{preset.name}</span>
                        <span style={{ marginLeft: 8, background: '#EBF2FF', color: BLUE, borderRadius: 4, padding: '1px 7px', fontSize: 10, fontWeight: 700 }}>{preset.gri}</span>
                      </div>
                      <button onClick={() => handleRemoveChart(ic.uid)} style={{ background: '#FEF2F2', border: 'none', borderRadius: 6, padding: '4px 8px', cursor: 'pointer', color: '#DC2626', display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 600 }}>
                        <X size={12} />移除
                      </button>
                    </div>
                    <div style={{ padding: '12px 16px 16px' }}>
                      <ChartRenderer chart={preset} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Actions */}
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button onClick={handleSave} className="btn-primary">
              <Save size={14} />{saved ? '已儲存 ✓' : '儲存本節'}
            </button>
            <button className="btn-gold">
              <Shield size={14} />5T 封印
            </button>
            <button onClick={() => setShowChartModal(true)} style={{ padding: '10px 18px', borderRadius: 8, border: `1.5px solid ${activeChapter.color}`, background: `${activeChapter.color}10`, fontSize: 12, fontWeight: 700, cursor: 'pointer', color: activeChapter.color, display: 'flex', alignItems: 'center', gap: 6 }}>
              <BarChart2 size={14} />插入圖表
            </button>
            <button style={{ padding: '10px 18px', borderRadius: 8, border: '1.5px solid #E2E8F0', background: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer', color: '#64748B', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Download size={14} />匯出本章
            </button>
          </div>
        </div>

        {/* ── RIGHT: Panels ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, position: 'sticky', top: 16 }}>

          {/* Compliance Scan */}
          <div style={{ background: '#fff', borderRadius: 12, border: '1.5px solid #E2E8F0', padding: '14px 16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: BLUE, display: 'flex', alignItems: 'center', gap: 6 }}>
                <Shield size={13} color={BLUE} />合規性即時掃描
              </div>
              <span style={{ fontSize: 18, fontWeight: 800, color: '#D97706' }}>62%</span>
            </div>
            <div style={{ height: 7, background: '#F1F5F9', borderRadius: 4, overflow: 'hidden', marginBottom: 12 }}>
              <div style={{ height: '100%', width: '62%', background: 'linear-gradient(90deg, #D97706 0%, #FDB515 100%)', borderRadius: 4 }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
              {[
                { icon: CheckCircle, color: '#16A34A', text: 'GRI 2-7 員工數據揭露完整' },
                { icon: CheckCircle, color: '#16A34A', text: 'GRI 3-1 重大議題確認' },
                { icon: AlertTriangle, color: '#D97706', text: 'GRI 2-9 需補充獨立董事年齡分布' },
                { icon: AlertTriangle, color: '#D97706', text: 'ISSB S1 韌性評估說明待補充' },
                { icon: AlertTriangle, color: '#DC2626', text: '偵測「致力於」等模糊用語（綠漂風險）' },
              ].map((r, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 7 }}>
                  <r.icon size={13} color={r.color} style={{ marginTop: 1, flexShrink: 0 }} />
                  <span style={{ fontSize: 11, color: '#374151', lineHeight: 1.4 }}>{r.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Evidence Docs Checklist */}
          <div style={{ background: '#fff', borderRadius: 12, border: '1.5px solid #E2E8F0', overflow: 'hidden' }}>
            <button onClick={() => setShowDocs(!showDocs)} style={{ width: '100%', padding: '11px 14px', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: BLUE, display: 'flex', alignItems: 'center', gap: 6 }}>
                <FileText size={13} color={BLUE} />佐證文件清單
                <span style={{ background: '#EBF2FF', color: BLUE, borderRadius: 10, padding: '1px 6px', fontSize: 10, fontWeight: 800 }}>
                  {activeSection?.docs.length}
                </span>
              </div>
              {showDocs ? <ChevronDown size={13} color="#94A3B8" /> : <ChevronRight size={13} color="#94A3B8" />}
            </button>
            {showDocs && (
              <div style={{ padding: '0 14px 12px' }}>
                {activeSection?.docs.map((d, i) => {
                  const docKey = `${sectionKey}-doc-${i}`;
                  return (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 0', borderBottom: i < (activeSection.docs.length - 1) ? '1px solid #F8FAFC' : 'none' }}>
                      <button onClick={() => toggleDoc(docKey)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, flexShrink: 0 }}>
                        <CheckCircle size={15} color={checkedDocs[docKey] ? '#16A34A' : '#E2E8F0'} />
                      </button>
                      <span style={{ fontSize: 11, color: checkedDocs[docKey] ? '#16A34A' : '#374151', lineHeight: 1.4, textDecoration: checkedDocs[docKey] ? 'line-through' : 'none' }}>{d}</span>
                    </div>
                  );
                })}
                <button style={{ marginTop: 8, width: '100%', padding: '7px', borderRadius: 7, border: '1.5px dashed #E2E8F0', background: '#F8FAFC', fontSize: 11, color: '#64748B', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
                  <Upload size={11} />上傳佐證文件
                </button>
              </div>
            )}
          </div>

          {/* ── NEW: 備註與上傳 Panel ── */}
          <div style={{ background: '#fff', borderRadius: 12, border: `2px solid ${GOLD}30`, overflow: 'hidden' }}>
            <button onClick={() => setShowNotes(!showNotes)} style={{ width: '100%', padding: '11px 14px', background: showNotes ? '#FFFBEB' : '#fff', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#92400E', display: 'flex', alignItems: 'center', gap: 6 }}>
                <StickyNote size={13} color="#D97706" />備註與上傳
                <span style={{ background: '#FEF3C7', color: '#D97706', borderRadius: 10, padding: '1px 6px', fontSize: 10, fontWeight: 800 }}>
                  {notes.length + uploads.length}
                </span>
              </div>
              {showNotes ? <ChevronDown size={13} color="#94A3B8" /> : <ChevronRight size={13} color="#94A3B8" />}
            </button>

            {showNotes && (
              <div>
                {/* Sub Tabs */}
                <div style={{ display: 'flex', borderBottom: '1px solid #F1F5F9' }}>
                  {(['notes', 'upload'] as const).map(t => (
                    <button key={t} onClick={() => setNotesTab(t)} style={{ flex: 1, padding: '8px', background: 'none', border: 'none', cursor: 'pointer', fontSize: 11, fontWeight: 600, color: notesTab === t ? '#D97706' : '#64748B', borderBottom: notesTab === t ? `2px solid ${GOLD}` : '2px solid transparent' }}>
                      {t === 'notes' ? `備註 (${notes.length})` : `上傳 (${uploads.length})`}
                    </button>
                  ))}
                </div>

                {/* Notes Tab */}
                {notesTab === 'notes' && (
                  <div style={{ padding: '12px 14px' }}>
                    {/* Add Note Form */}
                    <div style={{ background: '#FFFBEB', borderRadius: 9, padding: '10px 12px', marginBottom: 10 }}>
                      <div style={{ display: 'flex', gap: 5, marginBottom: 7 }}>
                        {NOTE_TYPES.map(nt => (
                          <button key={nt.id} onClick={() => setNewNoteType(nt.id)} style={{ flex: 1, padding: '4px 4px', borderRadius: 5, border: `1.5px solid ${newNoteType === nt.id ? nt.color : '#E2E8F0'}`, background: newNoteType === nt.id ? nt.bg : '#fff', color: newNoteType === nt.id ? nt.color : '#94A3B8', fontSize: 10, fontWeight: 700, cursor: 'pointer' }}>
                            {nt.label}
                          </button>
                        ))}
                      </div>
                      <textarea
                        value={newNoteText}
                        onChange={e => setNewNoteText(e.target.value)}
                        placeholder="輸入備註、問題或待辦事項..."
                        style={{ width: '100%', height: 62, padding: '7px', borderRadius: 7, border: '1.5px solid #E2E8F0', fontSize: 11, outline: 'none', resize: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
                      />
                      <div style={{ display: 'flex', gap: 6, marginTop: 6, alignItems: 'center' }}>
                        <select value={newNoteTag} onChange={e => setNewNoteTag(e.target.value)} style={{ flex: 1, padding: '5px 8px', borderRadius: 6, border: '1.5px solid #E2E8F0', fontSize: 10, outline: 'none' }}>
                          {GRI_TAGS.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                        <button onClick={handleAddNote} style={{ padding: '5px 12px', borderRadius: 6, border: 'none', background: GOLD, color: BLUE, fontSize: 11, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                          <Plus size={11} />新增
                        </button>
                      </div>
                    </div>
                    {/* Notes List */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 7, maxHeight: 250, overflowY: 'auto' }}>
                      {notes.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '16px 0', fontSize: 11, color: '#94A3B8' }}>尚無備註</div>
                      )}
                      {notes.map(n => {
                        const nt = NOTE_TYPES.find(t => t.id === n.type)!;
                        return (
                          <div key={n.id} style={{ background: nt.bg, borderRadius: 8, padding: '9px 11px', border: `1px solid ${nt.color}20` }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                                <span style={{ background: nt.color, color: '#fff', borderRadius: 4, padding: '1px 6px', fontSize: 9, fontWeight: 700 }}>{nt.label}</span>
                                <span style={{ background: '#EBF2FF', color: BLUE, borderRadius: 4, padding: '1px 5px', fontSize: 9, fontWeight: 600 }}>{n.gri_tag}</span>
                              </div>
                              <button onClick={() => handleRemoveNote(n.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                                <X size={12} color="#94A3B8" />
                              </button>
                            </div>
                            <div style={{ fontSize: 11, color: '#374151', lineHeight: 1.5 }}>{n.text}</div>
                            <div style={{ fontSize: 9, color: '#94A3B8', marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                              <Clock size={9} />{n.timestamp}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Upload Tab */}
                {notesTab === 'upload' && (
                  <div style={{ padding: '12px 14px' }}>
                    {/* Upload Area */}
                    <button
                      onClick={handleSimulateUpload}
                      style={{ width: '100%', border: '2px dashed #FDB515', borderRadius: 9, padding: '16px', textAlign: 'center', cursor: 'pointer', background: '#FFFBEB', marginBottom: 10 }}
                    >
                      <Upload size={22} color={GOLD} style={{ margin: '0 auto 6px', display: 'block' }} />
                      <div style={{ fontSize: 12, fontWeight: 700, color: '#92400E' }}>點擊上傳檔案</div>
                      <div style={{ fontSize: 10, color: '#B45309', marginTop: 2 }}>支援 PDF、Excel、Word、圖片</div>
                    </button>
                    {/* File List */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 7, maxHeight: 250, overflowY: 'auto' }}>
                      {uploads.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '12px 0', fontSize: 11, color: '#94A3B8' }}>尚無上傳檔案</div>
                      )}
                      {uploads.map(f => (
                        <div key={f.id} style={{ background: '#F8FAFC', borderRadius: 8, padding: '9px 11px', border: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', gap: 9 }}>
                          <div style={{ width: 32, height: 32, borderRadius: 7, background: f.type === 'PDF' ? '#FEF2F2' : '#EAFAF1', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <FileText size={16} color={f.type === 'PDF' ? '#DC2626' : '#2E8B57'} />
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 11, fontWeight: 600, color: '#111', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{f.name}</div>
                            <div style={{ fontSize: 9, color: '#94A3B8', marginTop: 2, display: 'flex', alignItems: 'center', gap: 5 }}>
                              <span>{f.size}</span>
                              <span>·</span>
                              <Clock size={9} />
                              <span>{f.timestamp}</span>
                            </div>
                          </div>
                          <button onClick={() => handleRemoveUpload(f.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, flexShrink: 0 }}>
                            <X size={13} color="#94A3B8" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* AI Writing Suggestions */}
          <div style={{ background: '#EBF2FF', borderRadius: 12, border: `1.5px solid ${BLUE}20`, padding: '14px' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: BLUE, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Brain size={13} />AI 撰寫建議
            </div>
            {[
              '加入量化指標（如：女性主管比例 32%）可提升合規率至 92%',
              '建議引用 ISSB S1 para.B6 強化策略揭露',
              '已偵測模糊用語「致力於」——建議改為具體目標與時程',
              '可插入「GHG 三範疇排放趨勢」圖表增強視覺效果',
            ].map((s, i) => (
              <div key={i} style={{ fontSize: 11, color: '#374151', marginBottom: 7, paddingLeft: 10, borderLeft: `3px solid ${BLUE}`, lineHeight: 1.5 }}>{s}</div>
            ))}
          </div>

        </div>
      </div>

      {/* ── CHART INSERT MODAL ── */}
      {showChartModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 300, padding: 16 }}>
          <div style={{ background: '#fff', borderRadius: 16, width: '100%', maxWidth: 760, maxHeight: '85vh', overflow: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.25)' }}>
            {/* Modal Header */}
            <div style={{ padding: '18px 24px', borderBottom: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: BLUE, borderRadius: '16px 16px 0 0' }}>
              <div>
                <div style={{ color: '#fff', fontWeight: 800, fontSize: 16 }}>插入 ESG 圖表</div>
                <div style={{ color: '#A8C8E8', fontSize: 12, marginTop: 2 }}>選擇預設 ESG 圖表，一鍵插入至「{activeSection?.title}」</div>
              </div>
              <button onClick={() => setShowChartModal(false)} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: 8, padding: '6px 10px', cursor: 'pointer', color: '#fff' }}>
                <X size={18} />
              </button>
            </div>
            {/* Chart Grid */}
            <div style={{ padding: '20px 24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 14 }}>
              {PRESET_CHARTS.map(preset => (
                <div key={preset.id} style={{ background: '#F8FAFC', borderRadius: 12, border: '1.5px solid #E2E8F0', overflow: 'hidden', transition: 'all 0.2s' }}>
                  <div style={{ padding: '12px 14px', borderBottom: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontWeight: 700, color: '#111', fontSize: 12 }}>{preset.name}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 3 }}>
                        <span style={{ background: '#EBF2FF', color: BLUE, borderRadius: 4, padding: '1px 6px', fontSize: 10, fontWeight: 700 }}>{preset.gri}</span>
                        <span style={{ background: '#F1F5F9', color: '#64748B', borderRadius: 4, padding: '1px 6px', fontSize: 10 }}>
                          {preset.type === 'line' ? '折線圖' : preset.type === 'bar' ? '長條圖' : preset.type === 'pie' ? '圓餅圖' : '面積圖'}
                        </span>
                      </div>
                    </div>
                    <button onClick={() => handleInsertChart(preset.id)} className="btn-primary" style={{ fontSize: 11, padding: '5px 12px' }}>
                      <Plus size={12} />插入
                    </button>
                  </div>
                  <div style={{ padding: '8px 10px' }}>
                    <ChartRenderer chart={preset} />
                  </div>
                </div>
              ))}
            </div>
            <div style={{ padding: '14px 24px', borderTop: '1px solid #F1F5F9', background: '#FAFAFA', borderRadius: '0 0 16px 16px', display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={() => setShowChartModal(false)} style={{ padding: '9px 20px', borderRadius: 8, border: '1.5px solid #E2E8F0', background: '#fff', fontSize: 13, cursor: 'pointer', fontWeight: 600 }}>關閉</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}