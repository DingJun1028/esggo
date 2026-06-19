export interface DataSource {
  id: string;
  group: string;
  groupCode: string;
  institution: string;
  url: string;
  contentType: string;
  updateFreq: string;
  tags: string[];
}

export interface IntelModule {
  id: string;
  code: string;
  name: string;
  nameZh: string;
  purpose: string;
  inputs: string[];
  outputs: string[];
  primaryUsers: string[];
  esgLink: string;
  color: string;
}

export const DATA_SOURCES: DataSource[] = [
  // A. UN / 政府間組織
  { id: 'A01', group: 'UN/政府間組織', groupCode: 'A', institution: 'UN SDGs Knowledge Platform', url: 'https://sdgs.un.org', contentType: '全球 SDG 政策、會議、國家報告', updateFreq: 'Weekly', tags: ['SDG','Policy','Global'] },
  { id: 'A02', group: 'UN/政府間組織', groupCode: 'A', institution: 'UNEP（聯合國環境規劃署）', url: 'https://www.unep.org', contentType: '氣候、污染、自然、生物多樣性專題', updateFreq: 'Daily–Weekly', tags: ['Climate','Environment','Biodiversity'] },
  { id: 'A03', group: 'UN/政府間組織', groupCode: 'A', institution: 'UNFCCC', url: 'https://unfccc.int', contentType: '氣候談判、COP 文稿、政策更新', updateFreq: 'Daily–During COP', tags: ['Climate','COP','Policy'] },
  { id: 'A04', group: 'UN/政府間組織', groupCode: 'A', institution: 'IPCC', url: 'https://www.ipcc.ch', contentType: '氣候科學評估（AR 系列）', updateFreq: '固定大型發布', tags: ['Climate Science','Assessment'] },
  { id: 'A05', group: 'UN/政府間組織', groupCode: 'A', institution: 'UNDP', url: 'https://www.undp.org', contentType: '再生發展、治理、減貧、永續專案', updateFreq: 'Weekly', tags: ['Development','Governance'] },
  { id: 'A06', group: 'UN/政府間組織', groupCode: 'A', institution: 'WHO', url: 'https://www.who.int', contentType: '健康、公共衛生、全球風險', updateFreq: 'Daily–Weekly', tags: ['Health','Risk'] },
  { id: 'A07', group: 'UN/政府間組織', groupCode: 'A', institution: 'World Bank', url: 'https://www.worldbank.org', contentType: '氣候投資、政策貸款、國別分析', updateFreq: 'Weekly', tags: ['Finance','Climate','Policy'] },
  { id: 'A08', group: 'UN/政府間組織', groupCode: 'A', institution: 'OECD', url: 'https://www.oecd.org', contentType: '永續政策、碳定價、企業治理', updateFreq: 'Weekly', tags: ['Policy','Carbon','Governance'] },
  { id: 'A09', group: 'UN/政府間組織', groupCode: 'A', institution: 'IEA', url: 'https://www.iea.org', contentType: '能源轉型、能源市場與政策', updateFreq: 'Weekly', tags: ['Energy','Market','Policy'] },
  { id: 'A10', group: 'UN/政府間組織', groupCode: 'A', institution: 'IMF', url: 'https://www.imf.org', contentType: '宏觀、轉型金融、國別風險', updateFreq: 'Weekly', tags: ['Finance','Risk','Macro'] },
  // B. 國際智庫/NGO
  { id: 'B01', group: '國際智庫/NGO/研究機構', groupCode: 'B', institution: 'WRI（世界資源研究所）', url: 'https://www.wri.org', contentType: '氣候、土地利用、能源政策', updateFreq: 'Daily–Weekly', tags: ['Climate','Energy','Land'] },
  { id: 'B02', group: '國際智庫/NGO/研究機構', groupCode: 'B', institution: 'WWF', url: 'https://www.worldwildlife.org', contentType: '生物多樣性、自然資本、倡議', updateFreq: 'Weekly', tags: ['Biodiversity','Nature'] },
  { id: 'B03', group: '國際智庫/NGO/研究機構', groupCode: 'B', institution: 'IUCN', url: 'https://www.iucn.org', contentType: '物種名錄、自然政策、研究', updateFreq: 'Weekly', tags: ['Species','Nature','Research'] },
  { id: 'B04', group: '國際智庫/NGO/研究機構', groupCode: 'B', institution: 'Nature Conservancy', url: 'https://www.nature.org', contentType: '自然保育、自然解方（NbS）', updateFreq: 'Weekly', tags: ['Conservation','NbS'] },
  { id: 'B05', group: '國際智庫/NGO/研究機構', groupCode: 'B', institution: 'Climate Policy Initiative (CPI)', url: 'https://www.climatepolicyinitiative.org', contentType: '氣候金融、政策分析、投資趨勢', updateFreq: 'Weekly', tags: ['Climate Finance','Policy'] },
  { id: 'B06', group: '國際智庫/NGO/研究機構', groupCode: 'B', institution: 'Carbon Tracker', url: 'https://carbontracker.org', contentType: '化石資產風險、轉型風險研究', updateFreq: 'Monthly', tags: ['Carbon','Risk','Transition'] },
  { id: 'B07', group: '國際智庫/NGO/研究機構', groupCode: 'B', institution: 'World Economic Forum (WEF)', url: 'https://www.weforum.org', contentType: '全球趨勢、產業倡議、治理議題', updateFreq: 'Daily–Weekly', tags: ['Global Trends','Governance'] },
  { id: 'B08', group: '國際智庫/NGO/研究機構', groupCode: 'B', institution: 'Ellen MacArthur Foundation', url: 'https://ellenmacarthurfoundation.org', contentType: '循環經濟、材料與設計策略', updateFreq: 'Weekly', tags: ['Circular Economy','Materials'] },
  // C. 揭露/標準
  { id: 'C01', group: '揭露/標準/評等與框架', groupCode: 'C', institution: 'IFRS Foundation / ISSB', url: 'https://www.ifrs.org', contentType: '永續揭露標準（S1/S2）、全球準則', updateFreq: 'Weekly', tags: ['ISSB','S1','S2','Standards'] },
  { id: 'C02', group: '揭露/標準/評等與框架', groupCode: 'C', institution: 'CDP', url: 'https://www.cdp.net', contentType: '氣候、水、森林揭露資料與報告', updateFreq: 'Daily–Weekly', tags: ['Disclosure','Climate','Water'] },
  { id: 'C03', group: '揭露/標準/評等與框架', groupCode: 'C', institution: 'GRI', url: 'https://www.globalreporting.org', contentType: '全球永續報告準則、主題標準', updateFreq: 'Weekly', tags: ['GRI','Standards','Reporting'] },
  { id: 'C04', group: '揭露/標準/評等與框架', groupCode: 'C', institution: 'SBTi', url: 'https://sciencebasedtargets.org', contentType: '科學基礎減量目標（SBT）', updateFreq: 'Weekly', tags: ['SBTi','Net-Zero','Targets'] },
  { id: 'C05', group: '揭露/標準/評等與框架', groupCode: 'C', institution: 'TNFD', url: 'https://tnfd.global', contentType: '自然相關財務揭露框架', updateFreq: 'Monthly', tags: ['TNFD','Nature','Finance'] },
  { id: 'C06', group: '揭露/標準/評等與框架', groupCode: 'C', institution: 'PRI', url: 'https://www.unpri.org', contentType: '機構投資人 ESG 原則、報告', updateFreq: 'Weekly', tags: ['Investment','ESG','Principles'] },
  // D. 政策執行端
  { id: 'D01', group: '政策執行端', groupCode: 'D', institution: 'European Commission – Climate Action', url: 'https://climate.ec.europa.eu/index_en', contentType: 'EU ETS、CBAM、碳市場、氣候政策更新', updateFreq: 'Daily–Weekly', tags: ['EU','ETS','CBAM','Policy'] },
  { id: 'D02', group: '政策執行端', groupCode: 'D', institution: 'U.S. SEC', url: 'https://www.sec.gov', contentType: '美國上市公司揭露、監理、公告', updateFreq: 'Daily', tags: ['SEC','Disclosure','Regulation'] },
  { id: 'D03', group: '政策執行端', groupCode: 'D', institution: 'U.S. EPA', url: 'https://www.epa.gov', contentType: '氣候風險、揭露、環境監管資訊', updateFreq: 'Weekly', tags: ['EPA','Environment','Regulation'] },
  { id: 'D04', group: '政策執行端', groupCode: 'D', institution: 'California CARB', url: 'https://ww2.arb.ca.gov', contentType: '加州氣候揭露、GHG 申報、州級規範', updateFreq: 'Weekly', tags: ['California','GHG','Climate'] },
  // E. 市場價格端
  { id: 'E01', group: '市場價格端', groupCode: 'E', institution: 'EEX – EU ETS', url: 'https://www.eex.com/en/markets/environmental-markets/eu-ets-spot-futures-options', contentType: 'EUA/EUAA 現貨與期貨交易資訊', updateFreq: 'Daily', tags: ['ETS','Carbon Price','Futures'] },
  { id: 'E02', group: '市場價格端', groupCode: 'E', institution: 'ICE – EUA Futures', url: 'https://www.ice.com/products/197/eua-futures', contentType: 'EUA 期貨契約與交易規格', updateFreq: 'Daily', tags: ['EUA','Futures','Carbon'] },
  { id: 'E03', group: '市場價格端', groupCode: 'E', institution: 'U.S. EIA', url: 'https://www.eia.gov', contentType: '官方能源統計、油氣電價格與展望', updateFreq: 'Daily–Weekly', tags: ['Energy','Oil','Gas','Price'] },
  { id: 'E04', group: '市場價格端', groupCode: 'E', institution: "Lloyd's – Emerging Risk", url: 'https://www.lloyds.com/insights/news/emerging-risk', contentType: '新興風險、保險市場洞察', updateFreq: 'Weekly', tags: ['Insurance','Risk','Emerging'] },
  // F. 產業治理端
  { id: 'F01', group: '產業治理端', groupCode: 'F', institution: 'Responsible Business Alliance (RBA)', url: 'https://www.responsiblebusiness.org', contentType: '責任供應鏈、行為準則、稽核資源', updateFreq: 'Weekly', tags: ['Supply Chain','Audit','Conduct'] },
  { id: 'F02', group: '產業治理端', groupCode: 'F', institution: 'Sedex', url: 'https://www.sedex.com', contentType: '供應鏈風險評估、SMETA', updateFreq: 'Weekly', tags: ['Supply Chain','SMETA','Risk'] },
  { id: 'F03', group: '產業治理端', groupCode: 'F', institution: 'SA8000', url: 'https://sa-intl.org/programs/sa8000/', contentType: '社會責任標準、勞工與工作條件框架', updateFreq: 'Monthly', tags: ['Labor','Social','Standards'] },
  // G. 風險事件端
  { id: 'G01', group: '風險事件端', groupCode: 'G', institution: 'IMO – Maritime Security', url: 'https://www.imo.org/en/ourwork/security', contentType: '海事安全、國際海運安全規範與指引', updateFreq: 'Weekly', tags: ['Maritime','Security','Shipping'] },
  // H. 地緣與供應鏈端
  { id: 'H01', group: '地緣與供應鏈端', groupCode: 'H', institution: 'OFAC – U.S. Treasury', url: 'https://ofac.treasury.gov', contentType: '制裁名單、國家/產業限制', updateFreq: 'Daily', tags: ['Sanctions','Trade','Compliance'] },
  { id: 'H02', group: '地緣與供應鏈端', groupCode: 'H', institution: 'EU Sanctions Map', url: 'https://www.sanctionsmap.eu', contentType: 'EU 制裁地圖與措施查詢', updateFreq: 'Daily', tags: ['EU','Sanctions','Map'] },
  { id: 'H03', group: '地緣與供應鏈端', groupCode: 'H', institution: 'UN Comtrade', url: 'https://comtrade.un.org', contentType: '全球貿易統計、商品流向、國別數據', updateFreq: 'Monthly', tags: ['Trade','Statistics','Global'] },
  { id: 'H04', group: '地緣與供應鏈端', groupCode: 'H', institution: 'WTO Data Portal', url: 'https://data.wto.org', contentType: 'WTO 關稅與貿易數據平台', updateFreq: 'Weekly', tags: ['WTO','Trade','Tariff'] },
  // I. 社創/社企
  { id: 'I01', group: '社創／社企類', groupCode: 'I', institution: 'Ashoka', url: 'https://www.ashoka.org', contentType: '社會創業家案例、系統變革', updateFreq: 'Weekly', tags: ['Social Innovation','Cases'] },
  { id: 'I02', group: '社創／社企類', groupCode: 'I', institution: 'GIIN', url: 'https://thegiin.org', contentType: '影響力投資市場、研究、數據', updateFreq: 'Weekly', tags: ['Impact Investing','Market'] },
  { id: 'I03', group: '社創／社企類', groupCode: 'I', institution: 'B Lab / B Corporation', url: 'https://www.bcorporation.net', contentType: 'B Corp 標準、企業影響力、治理', updateFreq: 'Daily–Weekly', tags: ['B Corp','Governance','Standards'] },
  { id: 'I04', group: '社創／社企類', groupCode: 'I', institution: 'Stanford Social Innovation Review', url: 'https://ssir.org', contentType: '社會創新研究、跨部門解方', updateFreq: 'Daily–Weekly', tags: ['Research','Social','Innovation'] },
];

export const INTEL_MODULES: IntelModule[] = [
  {
    id: 'M1', code: 'M1', name: 'Signal Radar', nameZh: '多源信號雷達',
    purpose: '從海量外部資訊中找出高價值信號，轉成值得決策的情資',
    inputs: ['新聞資訊流', '政策公告', '市場價格', '供應鏈數據', '標準機構更新'],
    outputs: ['Top Signals 清單', '信號分類與優先級', '分派建議', '置信度評分'],
    primaryUsers: ['高管', 'ESG 團隊', '分析師'],
    esgLink: '把外部變化轉成「值得決策的信號」，對應 E/S/G 指標群組',
    color: '#003262'
  },
  {
    id: 'M2', code: 'M2', name: 'Entity Watchlist', nameZh: '實體監測清單',
    purpose: '追蹤用戶真正關心的客戶、競品、供應商、法規、港口等關鍵實體',
    inputs: ['Watchlist 名單', '公司/法規/地區/航線實體資料', '公告/IR', 'ESG 報告', '採購標案'],
    outputs: ['實體變更提醒', '事件摘要', '關聯實體警示', '影響分數'],
    primaryUsers: ['業務', '採購', 'ESG', '法務', '高管'],
    esgLink: '從「世界發生什麼」變成「我的關鍵對象發生什麼」',
    color: '#3b7ea1'
  },
  {
    id: 'M3', code: 'M3', name: 'Impact Scoring', nameZh: '影響評分',
    purpose: '將事件轉成可比較、可排序的影響分數（財務/合規/供應/聲譽）',
    inputs: ['M1/M2 篩選後事件', '產業/地區/角色資訊', '歷史事件基線'],
    outputs: ['風險分數 0-100', '機會分數', '急迫度燈號', '影響說明（可追溯來源）'],
    primaryUsers: ['董事會', 'CFO', 'ESG', '顧問'],
    esgLink: '不只看風險，也看價值與投資優先序；寫入資料字典 Impact_score 欄位',
    color: '#FDB515'
  },
  {
    id: 'M4', code: 'M4', name: 'Anomaly Detection', nameZh: '異常偵測',
    purpose: '從時間序列與事件流中找出「不正常」的變化，抓早期信號',
    inputs: ['EUA 碳價', '油價/電價/運價', '事件頻率', '關鍵字激增', '內部 ESG KPI'],
    outputs: ['異常警報', '偏離幅度', '原因分析', '建議送往對應模組'],
    primaryUsers: ['分析師', '財務', 'ESG', '供應鏈'],
    esgLink: '連結 Raw Data Summary 的 Frequency，做不同閾值模型與資料品質檢查',
    color: '#e74c3c'
  },
  {
    id: 'M5', code: 'M5', name: 'Policy Timeline Tracker', nameZh: '政策節點雷達',
    purpose: '將法規政策轉成時程、適用性與行動待辦，讓法規從新聞變成責任',
    inputs: ['EU/US/UK/TW 監管公告', 'FAQ', '裁罰案例', '諮詢文件', '正式文本'],
    outputs: ['政策時程甘特', '適用性判讀', '90天合規待辦', '責任部門分派'],
    primaryUsers: ['ESG', '法務', '財務', '採購', '高管'],
    esgLink: '直接生成任務與證據鏈需求，對應 Responsible Dept 欄位',
    color: '#27ae60'
  },
  {
    id: 'M6', code: 'M6', name: 'Supply Chain & Logistics Risk', nameZh: '供應鏈/航運風險偵測',
    purpose: '把地緣、航道、港口壅塞變成交期與成本預警，評估供應鏈韌性',
    inputs: ['AIS 船舶', '港口公告', '運價指數', '保險風險報告', '制裁/出口管制', '關鍵礦產供需'],
    outputs: ['航線風險評級', '替代路徑建議', '庫存/採購策略', '合約條款提醒'],
    primaryUsers: ['採購', '供應鏈', 'CFO', 'ESG', '高管'],
    esgLink: '連結 S 面供應鏈責任與 E 面運輸排放，形成「風險–成本–排放」三合一建議',
    color: '#8e44ad'
  },
  {
    id: 'M7', code: 'M7', name: 'Opportunity Finder', nameZh: '機會偵測',
    purpose: '不只報風險，也要報可拿到的資源：補助/標案/轉型金融/市場機會',
    inputs: ['政府補助/投資計畫', '綠色採購/標案', '銀行轉型金融方案', '企業採購需求'],
    outputs: ['機會清單', '適配分數', '截止日提醒', '30天行動'],
    primaryUsers: ['BD', '策略', '財務', '產品', 'ESG'],
    esgLink: '把機會→對應指標（節能/再生能源/設備汰換）→形成專案 KPI',
    color: '#16a085'
  },
  {
    id: 'M8', code: 'M8', name: 'Competitor & Market Moves', nameZh: '競品與市場動向',
    purpose: '追蹤競品與市場玩家動向，判讀市場標準與競爭位置',
    inputs: ['競品 ESG 報告', '專利/論文', '募資/M&A', '產品發布', '職缺（job postings）'],
    outputs: ['競品動向摘要', '市場 shift 判讀', '競品對標雷達', '策略回應建議'],
    primaryUsers: ['高管', '策略', '產品', '顧問', '業務'],
    esgLink: '用 Master Indicator List 對標，比較指標群組下成熟度與證據完整度',
    color: '#d35400'
  },
  {
    id: 'M9', code: 'M9', name: 'Risk Events Monitor', nameZh: '風險事件監測',
    purpose: '監測已發生的事故、裁罰、訴訟、召回、資安等事件，提供治理升級建議',
    inputs: ['裁罰公告', '法院/訴訟資料', '召回公告', '資安通報/CVE', '供應鏈事件'],
    outputs: ['事件警報', '嚴重度評級', '關聯暴露分析', '內控清單', '治理升級建議'],
    primaryUsers: ['法務', 'ESG', '採購', '高管', '顧問'],
    esgLink: 'G 面治理與內控、S 面產品責任直接接軌，把他人事故變自身升級機會',
    color: '#c0392b'
  },
  {
    id: 'M10', code: 'M10', name: '90-Day Playbook', nameZh: '90天行動包',
    purpose: '把商情偵測做成「可交辦」，從訊號到行動一鍵生成',
    inputs: ['M1–M9 的信號與評分', '企業現有 ESG 指標', '責任部門設定'],
    outputs: ['What changed', 'Why it matters', 'What to do (90天分部門)', 'Evidence pack'],
    primaryUsers: ['所有部門', 'ESG 辦公室', '高管'],
    esgLink: '直接生成任務、資料需求、報告段落草稿（週報/董事會一頁式）',
    color: '#2c3e50'
  },
];

export const GROUP_COLORS: Record<string, string> = {
  A: '#003262', B: '#3b7ea1', C: '#FDB515',
  D: '#27ae60', E: '#e74c3c', F: '#8e44ad',
  G: '#d35400', H: '#16a085', I: '#2c3e50'
};

export const GROUP_LABELS: Record<string, string> = {
  A: 'UN/政府間組織',
  B: '國際智庫/NGO',
  C: '揭露/標準框架',
  D: '政策執行端',
  E: '市場價格端',
  F: '產業治理端',
  G: '風險事件端',
  H: '地緣供應鏈端',
  I: '社創/社企類'
};

export const CASE_STUDY = {
  title: '中東衝突升溫下的能源與航運風險偵測',
  subtitle: 'Full-stack Demo｜M1–M9 完整演示',
  modules: [
    {
      module: 'M1',
      finding: 'Brent 盤中一度接近 119 美元，油價累計上升約 20%；150+ 艘船舶下錨等待，保險人取消戰爭風險承保，中東空域與航班大亂。',
      signals: ['油價大幅上行 +20%', 'Hormuz 航運受阻', '超過 200 艘船舶滯留', '海事保險承保收縮', '中東空域限制']
    },
    {
      module: 'M2',
      finding: 'Watchlist 關鍵實體：Strait of Hormuz、Jebel Ali 港、主要油輪承運商、石化原料供應商、海事保險人',
      signals: ['Jebel Ali 暫停港口作業', '油輪受損', '船舶滯留警示', '保險取消通知']
    },
    {
      module: 'M3',
      finding: '台灣出口導向製造企業評分：財務高、供應鏈高、合規中、聲譽中高、機會中高',
      signals: ['財務面：油價+運價+保費同步上行', '供應鏈：Hormuz 受阻/主要航線停滯', '機會：能源韌性、供應鏈分散需求升高']
    },
    {
      module: 'M4',
      finding: '多信號共振：價格+航運+保險+空域四大異常同步出現，是 cross-signal resonance 的典型案例',
      signals: ['油價跳升（超出正常波動範圍）', '200+ 艘船停泊（歷史異常）', '保險取消（極強異常信號）', '中東航班大亂（疫情以來最嚴重）']
    },
    {
      module: 'M5',
      finding: '後續政策節點：制裁生效日、保險條款調整、港口安全指引、戰略儲備釋放、各國能源安全評估',
      signals: ['美國海事管理機構警示', '保險取消通知生效日確定', '各國庫存盤點啟動']
    },
    {
      module: 'M6',
      finding: 'Hormuz 承載全球五分之一石油；VLCC 費率突破 40 萬美元/日，LNG 運價大漲；部分航線繞道好望角',
      signals: ['超級油輪費率飆歷史高位', 'LNG 運價大漲', '繞道好望角增加交期+成本', '單點故障風險極高']
    },
    {
      module: 'M7',
      finding: '市場更願意為「韌性」付費：能源韌性、節能、電氣化、供應鏈分散、董事會風險情境版',
      signals: ['Geo-Energy Risk Radar 需求升高', '供應鏈韌性工作坊機會', '能源風險轉型投資方案']
    },
    {
      module: 'M8',
      finding: '市場玩家：油氣公司暫停出貨、航運保險快速收縮、旅遊航空股大跌、船東不願進入區域',
      signals: ['市場把「韌性」定為新標準', '先行者重新配置能源+航線+庫存', '落後者面臨客戶交期風險']
    },
    {
      module: 'M9',
      finding: '已落地事件：至少三艘油輪受損、一名船員死亡、Jebel Ali 暫停、戰區外溢風險升高',
      signals: ['油輪受攻擊事件', '港口暫停公告', '海運事故記錄', '治理內控升級建議觸發']
    }
  ]
};