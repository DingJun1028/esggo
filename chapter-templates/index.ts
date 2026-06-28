/**
 * Expert Chapter Templates for ESG Report Generation
 * 
 * Each chapter has a specialized prompt template that guides AI generation
 * for a 280K-word sustainability report. Templates are optimized for
 * professional ESG reporting compliance (GRI, TCFD, TNFD, SDGs).
 */

export interface ChapterTemplate {
  chapterNum: number;
  title: string;
  fiveTGate: 'traceable' | 'transparent' | 'tangible' | 'trustworthy' | 'trackable';
  griCodes: string[];
  expertPrompt: string;
  keySections: string[];
  wordCount: number; // target ~10K words per chapter for 280K total
}

export const CHAPTER_TEMPLATES: ChapterTemplate[] = [
  {
    chapterNum: 1,
    title: '組織溯源與報告邊界',
    fiveTGate: 'traceable',
    griCodes: ['GRI 2-1', 'GRI 2-2', 'GRI 2-3', 'GRI 2-4', 'GRI 2-5', 'GRI 2-6', 'GRI 2-7', 'GRI 2-8', 'GRI 1'],
    expertPrompt: '撰寫組織溯源與報告邊界章節。包含：公司歷史沿革、股權結構、組織規模、營運據點、報告編製期間、報告邊界說明。要求：完整揭露集團架構、子公司列表、主要產品服務、供應鏈概述。',
    keySections: ['公司歷史與沿革', '股權結構與集團架構', '組織規模與人力', '營運據點分布', '報告編製期間與邊界', '主要產品與服務', '供應鏈概述'],
    wordCount: 10000,
  },
  {
    chapterNum: 2,
    title: '永續治理架構',
    fiveTGate: 'transparent',
    griCodes: ['GRI 2-9', 'GRI 2-10', 'GRI 2-11', 'GRI 2-12', 'GRI 2-13', 'GRI 2-14', 'GRI 2-15', 'GRI 2-16', 'GRI 2-17', 'GRI 2-18', 'GRI 2-19', 'GRI 2-20', 'GRI 2-21'],
    expertPrompt: '撰寫永續治理架構章節。包含：董事會永續治理委員會設置、永續長/CSO權責、ESG治理架構圖、董事多元化、獨立董事比例、永續績效與薪酬連結。要求：揭露治理層級、決策流程、內稽內控機制。',
    keySections: ['董事會永續治理組織', '永續長/CSO設置與權責', 'ESG治理架構', '董事多元化政策', '獨立董事組成', '永續績效與薪酬連結', '內部稽核與內控制度'],
    wordCount: 10000,
  },
  {
    chapterNum: 3,
    title: '重大性分析與利害關係人',
    fiveTGate: 'transparent',
    griCodes: ['GRI 2-29', 'GRI 2-30', 'GRI 3-1', 'GRI 3-2', 'GRI 3-3'],
    expertPrompt: '撰寫重大性分析與利害關係人章節。包含：利害關係人辨識（AA1000SES）、重大性評估流程、重大主題矩陣、雙重重要性原則應用、利害關係人溝通管道。要求：具體說明7類利害關係人、議合頻率、關注議題與回應機制。',
    keySections: ['利害關係人辨識與分類', '重大性評估方法與流程', '重大主題矩陣分析', '雙重重要性原則', '利害關係人議合機制', '關注議題與組織回應', '重大主題優先順序'],
    wordCount: 10000,
  },
  {
    chapterNum: 4,
    title: '經濟績效與誠信經營',
    fiveTGate: 'tangible',
    griCodes: ['GRI 201-1', 'GRI 201-2', 'GRI 201-3', 'GRI 201-4', 'GRI 205-1', 'GRI 205-2', 'GRI 205-3', 'GRI 206-1'],
    expertPrompt: '撰寫經濟績效與誠信經營章節。包含：直接經濟價值產生與分配、財務績效摘要、政府補助、反貪腐政策、公平競爭、法規遵循。要求：揭露經濟增加值、稅務透明度、反腐機制、訴訟案件。',
    keySections: ['直接經濟價值產生與分配', '財務績效摘要與分析', '政府補助與獎勵', '反貪腐與反賄賂政策', '公平競爭與市場行為', '法規遵循與訴訟', '稅務透明度'],
    wordCount: 10000,
  },
  {
    chapterNum: 5,
    title: '氣候策略與淨零轉型',
    fiveTGate: 'tangible',
    griCodes: ['GRI 201-2', 'TCFD-G', 'TCFD-S', 'TCFD-R', 'SBTi', 'GRI 102-1', 'GRI 102-2', 'GRI 102-3', 'GRI 102-4'],
    expertPrompt: '撰寫氣候策略與淨零轉型章節。包含：TCFD治理/策略/風險管理/目標指標四大支柱、SBTi承諾、淨零路徑圖、氣候風險評估、轉型計畫。要求：揭露董事會氣候治理、情境分析、減排目標與進度。',
    keySections: ['TCFD治理', '氣候策略與情境分析', '氣候風險管理流程', '減排目標與績效', 'SBTi承諾與進度', '淨零轉型路徑', '碳定價機制'],
    wordCount: 10000,
  },
  {
    chapterNum: 6,
    title: '能源管理與碳排放',
    fiveTGate: 'tangible',
    griCodes: ['GRI 302-1', 'GRI 302-2', 'GRI 302-3', 'GRI 302-4', 'GRI 305-1', 'GRI 305-2', 'GRI 305-3', 'GRI 305-4', 'GRI 305-5'],
    expertPrompt: '撰寫能源管理與碳排放章節。包含：能源消耗總量（直接/間接）、能源強度、再生能源比例、溫室氣體排放（範疇一/二/三）、碳強度、減排成效。要求：揭露能源管理政策、節能措施、碳排放計算方法論。',
    keySections: ['能源消耗與管理政策', '直接能源消耗（範疇一）', '間接能源消耗（範疇二）', '能源強度與效率', '溫室氣體排放盤查', '碳排放強度', '減排措施與成效'],
    wordCount: 10000,
  },
  {
    chapterNum: 7,
    title: '水資源與廢棄物管理',
    fiveTGate: 'tangible',
    griCodes: ['GRI 303-1', 'GRI 303-2', 'GRI 303-3', 'GRI 303-4', 'GRI 303-5', 'GRI 306-1', 'GRI 306-2', 'GRI 306-3'],
    expertPrompt: '撰寫水資源與廢棄物管理章節。包含：水資源取用、排水品質、水資源效率、廢棄物產生量、回收率、有害廢棄物管理、零廢棄目標。要求：揭露水風險評估、循環經濟作為、廢棄物減量成效。',
    keySections: ['水資源管理政策', '水資源取用與排水', '水資源效率與回收', '廢棄物管理與減量', '回收與再利用', '有害廢棄物處理', '零廢棄路徑'],
    wordCount: 10000,
  },
  {
    chapterNum: 8,
    title: '生物多樣性與自然資本',
    fiveTGate: 'tangible',
    griCodes: ['GRI 304-1', 'GRI 304-2', 'GRI 304-3', 'GRI 304-4', 'TNFD', 'GRI 101-1', 'GRI 101-2', 'GRI 101-3', 'GRI 101-4', 'GRI 101-5'],
    expertPrompt: '撰寫生物多樣性與自然資本章節。包含：營運據點生態評估、生物多樣性影響分析、TNFD揭露、自然資本評估、生態復育計畫。要求：揭露生態敏感區保護、物種保育作為、自然資源依賴性。',
    keySections: ['生態系統與生物多樣性評估', 'TNFD揭露與分析', '自然資本評價', '營運對生態影響', '生態復育與保育', '敏感區管理', '物種保育計畫'],
    wordCount: 10000,
  },
  {
    chapterNum: 9,
    title: '循環經濟與產品生命週期',
    fiveTGate: 'tangible',
    griCodes: ['GRI 301-1', 'GRI 301-2', 'GRI 301-3', 'GRI 306-4', 'GRI 306-5'],
    expertPrompt: '撰寫循環經濟與產品生命週期章節。包含：產品生命週期評估（LCA）、循環經濟策略、材料效率、包裝減量、產品回收計畫。要求：揭露從搖籃到搖籃設計、延伸生產者責任、循環商業模式。',
    keySections: ['產品生命週期評估', '循環經濟策略', '材料使用效率', '包裝減量與回收', '產品回收與再利用', '延伸生產者責任', '循環商業模式創新'],
    wordCount: 10000,
  },
  {
    chapterNum: 10,
    title: '員工結構與人才發展',
    fiveTGate: 'tangible',
    griCodes: ['GRI 401-1', 'GRI 401-2', 'GRI 401-3', 'GRI 404-1', 'GRI 404-2', 'GRI 404-3'],
    expertPrompt: '撰寫員工結構與人才發展章節。包含：人力結構、招募與留任、人才培訓與發展、員工敬業度、福利制度、勞資關係。要求：揭露人力統計、訓練時數、離職率、薪酬平等。',
    keySections: ['人力結構與統計', '招募與留任策略', '人才培訓與發展', '員工敬業度調查', '福利制度與照顧', '勞資溝通與關係', '薪酬平等與公平'],
    wordCount: 10000,
  },
  {
    chapterNum: 11,
    title: '職業安全與人權',
    fiveTGate: 'trustworthy',
    griCodes: ['GRI 403-1', 'GRI 403-2', 'GRI 403-3', 'GRI 403-4', 'GRI 403-5', 'GRI 403-6', 'GRI 403-7', 'GRI 403-8', 'GRI 403-9', 'GRI 403-10', 'GRI 406', 'GRI 407', 'GRI 408', 'GRI 409', 'GRI 410', 'GRI 411'],
    expertPrompt: '撰寫職業安全與人權章節。包含：職業安全衛生管理系統、工傷統計、人權政策與盡職調查、供應商人權評估、多元包容、禁止強迫勞動。要求：揭露OHSA統計、人權風險評估、補救機制。',
    keySections: ['職業安全衛生管理', '工傷與職業病統計', '安全訓練與演練', '人權政策與承諾', '人權盡職調查', '多元包容與平等', '禁止強迫勞動與童工'],
    wordCount: 10000,
  },
  {
    chapterNum: 12,
    title: '供應鏈永續管理',
    fiveTGate: 'trackable',
    griCodes: ['GRI 308-1', 'GRI 308-2', 'GRI 414-1', 'GRI 414-2', 'GRI 204-1'],
    expertPrompt: '撰寫供應鏈永續管理章節。包含：供應商ESG評估、供應商準則、供應鏈風險管理、在地採購、供應商稽核。要求：揭露供應商數量與分級、ESG風險評估方法、改善計畫。',
    keySections: ['供應鏈結構與複雜性', '供應商ESG評估準則', '供應商風險分級管理', '供應商稽核與改善', '在地採購策略', '供應鏈透明度', '負責任採購'],
    wordCount: 10000,
  },
  {
    chapterNum: 13,
    title: '產品責任與客戶關係',
    fiveTGate: 'trustworthy',
    griCodes: ['GRI 416-1', 'GRI 416-2', 'GRI 417-1', 'GRI 417-2', 'GRI 417-3', 'GRI 418'],
    expertPrompt: '撰寫產品責任與客戶關係章節。包含：產品安全與品質管理、客戶滿意度、客戶服務機制、產品標示與行銷、客戶投訴處理。要求：揭露產品召回事件、客戶滿意度數據、服務改善計畫。',
    keySections: ['產品安全與品質管理', '客戶滿意度調查', '客戶服務與溝通', '產品標示與資訊透明', '客戶投訴處理機制', '負責任行銷', '售後服務與保固'],
    wordCount: 10000,
  },
  {
    chapterNum: 14,
    title: '資訊安全與隱私保護',
    fiveTGate: 'trustworthy',
    griCodes: ['GRI 418-1', 'ISO 27001', 'PDPA', 'GDPR'],
    expertPrompt: '撰寫資訊安全與隱私保護章節。包含：資訊安全管理制度（ISO 27001）、個資保護（PDPA/GDPR）、資安事件統計、員工資安訓練、業務連續性。要求：揭露資安投資、事件回應、客戶資料保護。',
    keySections: ['資訊安全管理系統', '個資保護與隱私', '資安事件統計與回應', '員工資安意識訓練', '業務連續性計畫', '網路安全防護', '客戶資料保護'],
    wordCount: 10000,
  },
  {
    chapterNum: 15,
    title: '董事會治理與薪酬',
    fiveTGate: 'transparent',
    griCodes: ['GRI 2-9', 'GRI 2-10', 'GRI 2-18', 'GRI 2-19', 'GRI 2-20', 'GRI 2-21'],
    expertPrompt: '撰寫董事會治理與薪酬章節。包含：董事會組成與運作、委員會設置、董事薪酬、薪酬政策、股東權益。要求：揭露董事多元化、獨立性評估、薪酬與ESG連結。',
    keySections: ['董事會組成與結構', '董事會運作與效能', '委員會設置與功能', '董事薪酬政策', '薪酬與永續績效連結', '股東權益保護', '獨立董事角色'],
    wordCount: 10000,
  },
  {
    chapterNum: 16,
    title: '風險管理與TCFD',
    fiveTGate: 'trustworthy',
    griCodes: ['GRI 201-2', 'TCFD-G', 'TCFD-R', 'TCFD-S', 'TCFD-M', 'GRI 102-1'],
    expertPrompt: '撰寫風險管理與TCFD章節。包含：ERM風險管理框架、TCFD風險治理、實體風險與轉型風險、風險評估流程、風險減緩策略。要求：揭露風險熱圖、情境分析、策略韌性。',
    keySections: ['企業風險管理框架', 'TCFD風險治理', '實體風險評估', '轉型風險評估', '風險情境分析', '風險減緩與調適', '策略韌性評估'],
    wordCount: 10000,
  },
  {
    chapterNum: 17,
    title: '氣候情境分析與機會',
    fiveTGate: 'transparent',
    griCodes: ['GRI 201-2', 'TCFD-S', 'TCFD-O', 'GRI 102-2', 'GRI 102-5'],
    expertPrompt: '撰寫氣候情境分析與機會章節。包含：NGFS情境分析（1.5°C/2°C/3°C）、實體與轉型機會、低碳產品服務創新、綠色營收占比。要求：揭露情境假設、財務影響評估、機會把握策略。',
    keySections: ['NGFS情境設定', '1.5°C情境分析', '實體機會評估', '轉型機會評估', '低碳創新策略', '綠色營收占比', '氣候相關財務影響'],
    wordCount: 10000,
  },
  {
    chapterNum: 18,
    title: '內部碳定價與碳市場',
    fiveTGate: 'tangible',
    griCodes: ['GRI 305', 'ICP', 'Article 6', 'GRI 102-10', 'GRI 102-9'],
    expertPrompt: '撰寫內部碳定價與碳市場章節。包含：內部碳定價機制、碳費徵收與使用、碳權購買策略、自願性碳市場參與、碳抵換專案。要求：揭露碳定價方法論、收入運用、減碳誘因設計。',
    keySections: ['內部碳定價機制', '碳費徵收與分配', '碳權管理策略', '自願性碳市場參與', '碳抵換專案投資', '碳定價成效評估', 'Article 6合作'],
    wordCount: 10000,
  },
  {
    chapterNum: 19,
    title: '綠色金融與ESG投資',
    fiveTGate: 'transparent',
    griCodes: ['GRI 201-1', 'EU Taxonomy', 'GRI 201-3'],
    expertPrompt: '撰寫綠色金融與ESG投資章節。包含：ESG評比結果、綠色債券發行、永續連結貸款、責任投資原則、EU Taxonomy符合性。要求：揭露ESG評級、綠色金融商品、永續投資作為。',
    keySections: ['ESG評比與評級', '綠色債券發行', '永續連結貸款', '責任投資原則', 'EU Taxonomy符合性', 'ESG投資績效', '永續金融策略'],
    wordCount: 10000,
  },
  {
    chapterNum: 20,
    title: '數位轉型與AI創新',
    fiveTGate: 'tangible',
    griCodes: ['GRI 404', 'GRI 201', 'ISO 27001', 'GRI 404-2'],
    expertPrompt: '撰寫數位轉型與AI創新章節。包含：數位轉型策略、AI應用場景、負責任AI治理、數位包容、創新研發投資。要求：揭露AI倫理準則、數位服務創新、研發支出。',
    keySections: ['數位轉型策略', 'AI應用與場景', '負責任AI治理', '數位包容與近用', '創新研發投資', '數位服務成效', '技術人才培育'],
    wordCount: 10000,
  },
  {
    chapterNum: 21,
    title: '智財權與研發創新',
    fiveTGate: 'tangible',
    griCodes: ['GRI 201-1', 'GRI 404-1', 'GRI 201-3'],
    expertPrompt: '撰寫智財權與研發創新章節。包含：專利佈局、智財權管理、研發投入與產出、技術壁壘、創新文化。要求：揭露專利數量、研發占比、技術優勢、智財風險管理。',
    keySections: ['專利佈局與智財權', '研發投入與資源', '研發產出與創新', '技術壁壘與優勢', '智財風險管理', '創新文化與激勵', '產學合作'],
    wordCount: 10000,
  },
  {
    chapterNum: 22,
    title: '客戶關係與數據隱私',
    fiveTGate: 'trustworthy',
    griCodes: ['GRI 417', 'GRI 418', 'PDPA', 'GDPR', 'GRI 416'],
    expertPrompt: '撰寫客戶關係與數據隱私章節。包含：客戶數據管理、隱私保護措施、客戶信任機制、數據治理、負責任數據使用。要求：揭露隱私政策、數據事件、客戶信任度。',
    keySections: ['客戶數據管理政策', '隱私保護與合規', '數據治理架構', '客戶信任機制', '負責任數據使用', '數據安全投資', '客戶權益保障'],
    wordCount: 10000,
  },
  {
    chapterNum: 23,
    title: '社區參與與社會影響',
    fiveTGate: 'tangible',
    griCodes: ['GRI 413-1', 'GRI 413-2', 'SROI', 'GRI 203-1', 'GRI 203-2'],
    expertPrompt: '撰寫社區參與與社會影響章節。包含：社區投資策略、社會影響評估（SROI）、慈善捐贈、志工活動、在地發展計畫。要求：揭露社區投資金額、SROI計算、社會影響力。',
    keySections: ['社區投資策略', '社會影響評估（SROI）', '慈善捐贈與贊助', '員工志工活動', '在地發展計畫', '社區夥伴關係', '社會影響力報告'],
    wordCount: 10000,
  },
  {
    chapterNum: 24,
    title: '勞動權益與多元平等',
    fiveTGate: 'trustworthy',
    griCodes: ['GRI 405-1', 'GRI 405-2', 'GRI 406-1', 'GRI 202-1', 'GRI 202-2'],
    expertPrompt: '撰寫勞動權益與多元平等章節。包含：性別平等、同工同酬、多元包容（DEI）、勞動權益保障、工會協商、禁止歧視。要求：揭露性別薪酬比、管理階層多元性、DEI訓練。',
    keySections: ['性別平等與同工同酬', '多元包容政策（DEI）', '勞動權益保障', '工會與勞資協商', '反歧視與平等機會', '多元性統計與目標', '包容性訓練'],
    wordCount: 10000,
  },
  {
    chapterNum: 25,
    title: '反貪腐與法規遵循',
    fiveTGate: 'transparent',
    griCodes: ['GRI 205-1', 'GRI 205-2', 'GRI 205-3', 'GRI 206-1', 'GRI 207-1', 'GRI 207-2', 'GRI 207-3', 'GRI 207-4', 'GRI 2-26'],
    expertPrompt: '撰寫反貪腐與法規遵循章節。包含：反貪腐風險評估、反腐政策與訓練、吹哨人機制、法規遵循系統、公平競爭。要求：揭露貪腐事件統計、訓練涵蓋率、法規裁罰。',
    keySections: ['反貪腐風險評估', '反腐政策與制度', '吹哨人保護機制', '法規遵循系統', '公平競爭與反腐', '貪腐事件統計', '法規裁罰與改善'],
    wordCount: 10000,
  },
  {
    chapterNum: 26,
    title: 'GRI內容索引與確信',
    fiveTGate: 'traceable',
    griCodes: ['GRI 1', 'ISAE 3000', 'AA1000', 'GRI 3-3'],
    expertPrompt: '撰寫GRI內容索引與確信章節。包含：GRI準則遵循聲明、GRI內容索引表、第三方確信報告、確信範圍與結論、AA1000確信標準。要求：揭露遵循選項、確信機構、確信結論。',
    keySections: ['GRI準則遵循聲明', 'GRI內容索引', '第三方確信聲明', '確信範圍與方法', '確信結論', 'AA1000應用', '歷史遵循情形'],
    wordCount: 10000,
  },
  {
    chapterNum: 27,
    title: 'SDGs對應與永續路徑',
    fiveTGate: 'trackable',
    griCodes: ['SDG 1', 'SDG 4', 'SDG 5', 'SDG 7', 'SDG 8', 'SDG 9', 'SDG 12', 'SDG 13', 'SDG 16', 'SDG 17', 'SBTi'],
    expertPrompt: '撰寫SDGs對應與永續路徑章節。包含：UN SDGs對應分析、永續目標連結、貢獻度評估、2030路徑圖、永續策略整合。要求：揭露SDGs優先順序、貢獻指標、長期目標。',
    keySections: ['UN SDGs對應分析', '優先SDGs與貢獻', '永續目標連結', '2030路徑圖', '貢獻度評估', '永續策略整合', '全球永續倡議參與'],
    wordCount: 10000,
  },
  {
    chapterNum: 28,
    title: '未來展望與承諾',
    fiveTGate: 'trackable',
    griCodes: ['SBTi', 'TCFD-R', 'GRI 2-22', '路線圖'],
    expertPrompt: '撰寫未來展望與承諾章節。包含：未來3-5年永續目標、承諾事項、行動路線圖、資源投入規劃、利害關係人溝通計畫。要求：揭露量化目標、里程碑、資源承諾。',
    keySections: ['未來永續目標', '量化承諾事項', '行動路線圖', '資源投入規劃', '里程碑設定', '利害關係人溝通', '永續願景'],
    wordCount: 10000,
  },
];

/**
 * Get template for a specific chapter number (1-28)
 */
export function getChapterTemplate(chapterNum: number): ChapterTemplate | undefined {
  return CHAPTER_TEMPLATES.find(t => t.chapterNum === chapterNum);
}

/**
 * Get all chapter templates
 */
export function getAllChapterTemplates(): ChapterTemplate[] {
  return CHAPTER_TEMPLATES;
}

/**
 * Get total target word count across all chapters
 */
export function getTotalTargetWordCount(): number {
  return CHAPTER_TEMPLATES.reduce((sum, t) => sum + t.wordCount, 0);
}

export default {
  CHAPTER_TEMPLATES,
  getChapterTemplate,
  getAllChapterTemplates,
  getTotalTargetWordCount,
};
