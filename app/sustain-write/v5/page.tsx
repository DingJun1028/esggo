'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

// ═══════════════════════════════════════════════════════════════════════════
// ESGGO v5.0 — Solid Card Style Frontend (RWD Optimized)
// Design: High contrast, no gradients, glass blur(12px)
// Colors: Teal #009EB0, Gold #D4AF37, ZKP Blue #3B82F6, Purple #8B5CF6, Lethal #FF4D6D
// Radii: Atom 8px, Molecule 12px, Organism 16px
// ═══════════════════════════════════════════════════════════════════════════

// ─── Color Tokens ────────────────────────────────────────────────────────
// ─── Color Tokens ────────────────────────────────────────────────────────
const COLORS = {
  teal: 'var(--accent-teal)',
  gold: 'var(--accent-gold)',
  zkpBlue: 'var(--accent-blue)',
  purple: 'var(--accent-purple)',
  lethal: 'var(--accent-red)',
  darkBg: 'var(--bg-color)',
  cardBg: 'var(--card-bg)',
  cardBorder: 'var(--card-border)',
  textPrimary: 'var(--text-color)',
  textSecondary: 'var(--muted-color)',
  surface: 'var(--surface-bg)',
  surfaceLight: 'var(--surface-bg)',
} as const;

type FiveTGate = 'traceable' | 'transparent' | 'tangible' | 'trustworthy' | 'trackable';

const FIVE_T_COLORS: Record<FiveTGate, string> = {
  traceable: '#3B82F6',
  transparent: '#009EB0',
  tangible: '#D4AF37',
  trustworthy: '#8B5CF6',
  trackable: '#FF4D6D',
};

const FIVE_T_LABELS: Record<FiveTGate, string> = {
  traceable: '可追溯',
  transparent: '透明化',
  tangible: '具體化',
  trustworthy: '可信賴',
  trackable: '可追蹤',
};

// ─── Traditional Chinese Conversion Utility ────────────────────────────────
function convertToTraditional(text: string): string {
  if (!text) return '';
  const wordMap: Record<string, string> = {
    '可持续发展': '永續發展',
    '可持续': '永續',
    '报告': '報告',
    '企业': '企業',
    '数据': '數據',
    '环境': '環境',
    '社会': '社會',
    '信息': '資訊',
    '披露': '揭露',
    '指标': '指標',
    '关系人': '關係人',
    '利害关系人': '利害關係人',
    '重大性': '重大性',
    '双重重大性': '雙重重大性',
    '准则': '準則',
    '标准': '標準',
    '规范': '規範',
    '指引': '指引',
    '供应链': '供應鏈',
    '员工': '員工',
    '总人数': '總人數',
    '计算': '計算',
    '阶段': '階段',
    '规划': '規劃',
    '气候': '氣候',
    '碳排放': '碳排放',
    '温室气体': '溫室氣體',
    '废弃物': '廢棄物',
    '水资源': '水資源',
    '生物多样性': '生物多樣性',
    '循环经济': '循環經濟',
    '职业安全': '職業安全',
    '人权': '人權',
    '隐私': '隱私',
    '董事会': '董事會',
    '风险': '風險',
    '情境': '情境',
    '定价': '定價',
    '市场': '市場',
    '金融': '金融',
    '创新': '創新',
    '参与': '參與',
    '权益': '權益',
    '贪腐': '貪腐',
    '确信': '確信',
    '承诺': '承諾',
    '组织': '組織',
    '经合': '經合',
    '联合国': '聯合國',
    '编制': '編製',
    '指南': '指南',
    '目标': '目標',
    '评估': '評估',
    '分析': '分析',
    '框架': '框架',
    '绩效': '績效',
    '运营': '營運',
    '管理': '管理',
    '策略': '策略',
    '治理': '治理',
    '报告书': '報告書',
    '绿色': '綠色',
    '低碳': '低碳',
    '转型': '轉型',
    '网络': '網路',
    '数字化': '數位化',
    '人工智能': '人工智慧',
    '研发': '研發',
    '知识产权': '智慧財產權',
    '沟通': '溝通',
    '对话': '對話',
    '建议': '建議',
    '合规': '合規',
    '审查': '審查',
    '发布': '發布',
    '审计': '審計',
    '保证': '保證',
    '独立性': '獨立性',
    '多样化': '多元化',
    '包容性': '包容性',
    '公平': '公平',
    '培训': '培訓',
    '安全卫生': '安全衛生',
    '急救': '急救',
    '职业病': '職業病',
    '健康管理': '健康管理',
    '供应商': '供應商',
    '采购': '採購',
    '责任采购': '責任採購',
    '碳足迹': '碳足跡',
    '碳中和': '碳中和',
    '净零': '淨零',
    '零碳': '零碳',
    '核查': '核查',
    '鉴证': '確信',
    '第三方': '第三方',
    '可持续性': '永續性',
  };

  const charMap: Record<string, string> = {
    '万': '萬', '与': '與', '专': '專', '业': '業', '东': '東', '丝': '絲', '丢': '丟', '两': '兩', '严': '嚴',
    '丧': '喪', '个': '個', '丫': '丫', '丰': '豐', '临': '臨', '为': '為', '丽': '麗', '乃': '乃', '久': '久',
    '义': '義', '乌': '烏', '乐': '樂', '乔': '喬', '习': '習', '乡': '鄉', '书': '書', '买': '買', '乱': '亂',
    '争': '爭', '于': '於', '亏': '虧', '云': '雲', '亚': '亞', '产': '產', '亩': '畝', '亲': '親', '亿': '億',
    '仅': '僅', '仆': '僕', '仇': '仇', '介': '介', '仍': '仍', '从': '從', '仑': '侖', '仓': '倉', '仪': '儀',
    '们': '們', '价': '價', '众': '眾', '优': '優', '会': '會', '伛': '傴', '伞': '傘', '伟': '偉', '传': '傳',
    '伤': '傷', '伥': '倀', '伦': '倫', '伧': '傖', '伪': '偽', '伫': '佇', '体': '體', '余': '餘', '佣': '傭',
    '佥': '僉', '侠': '俠', '侣': '侶', '侥': '僥', '侦': '偵', '侧': '側', '侨': '僑', '侩': '儈', '侪': '儕',
    '侬': '儂', '俦': '儔', '俨': '儼', '俩': '倆', '俪': '儷', '俭': '儉', '债': '債', '倾': '傾', '傯': '傯',
    '偻': '僂', '僨': '僨', '偿': '償', '傥': '儻', '儐': '儐', '储': '儲', '傩': '儺', '儿': '兒', '兑': '兌',
    '兖': '兗', '党': '黨', '兰': '蘭', '关': '關', '兴': '興', '兹': '茲', '养': '養', '兽': '獸', '冁': '儳',
    '内': '內', '冈': '岡', '册': '冊', '写': '寫', '军': '軍', '农': '農', '冯': '馮', '冲': '沖', '决': '決',
    '况': '況', '冻': '凍', '净': '淨', '凄': '淒', '凉': '涼', '凌': '凌', '减': '減', '凑': '湊', '凛': '凜',
    '凝': '凝', '几': '幾', '凤': '鳳', '凭': '憑', '凯': '凱', '击': '擊', '凿': '鑿', '划': '劃', '刘': '劉',
    '列': '列', '创': '創', '刚': '剛', '利': '利', '别': '別', '刿': '劌', '剀': '剴', '剂': '劑', '剐': '剮',
    '剑': '劍', '剧': '劇', '劝': '勸', '办': '辦', '务': '務', '劢': '勱', '动': '動', '励': '勵', '劲': '勁',
    '劳': '勞', '势': '勢', '勋': '勳', '勐': '猛', '勚': '勩', '匀': '勻', '匦': '匭', '匮': '匱', '区': '區',
    '医': '醫', '华': '華', '协': '協', '单': '單', '卖': '賣', '卢': '盧', '卤': '鹵', '卧': '臥', '卫': '衛',
    '却': '卻', '厅': '廳', '历': '歷', '厉': '厲', '压': '壓', '厌': '厭', '厍': '厙', '厕': '廁', '厢': '廂',
    '厣': '厴', '厦': '廈', '厨': '廚', '厩': '廄', '县': '縣', '双': '雙', '发': '發', '变': '變', '叙': '敘',
    '叠': '疊', '叶': '葉', '号': '號', '叹': '嘆', '叽': '嘰', '吁': '籲', '后': '後', '吓': '嚇', '吕': '呂',
    '吗': '嗎', '吣': '唚', '吨': '噸', '听': '聽', '启': '啟', '吴': '吳', '呐': '吶', '呒': '嘸', '呓': '囈',
    '呕': '嘔', '呖': '嚦', '呗': '唄', '员': '員', '咴': '噅', '呛': '嗆', '呜': '嗚', '咏': '詠', '咙': '嚨',
    '咛': '嚀', '咝': '噝', '响': '響', '哑': '啞', '哒': '噠', '哓': '曉', '哔': '嗶', '哕': '噦', '哗': '嘩',
    '哙': '噲', '哜': '嚌', '哝': '噥', '哟': '喲', '唛': '嘜', '唠': '嘮', '唢': '嗩', '唤': '喚', '唧': '唧',
    '唾': '唾', '唯': '唯', '唰': '唰', '唱': '唱', '小': '小', '少': '少', '尔': '爾', '尕': '尕', '尖': '尖',
    '尘': '塵', '尚': '尚', '尝': '嘗', '尤': '尤', '尧': '堯', '尽': '盡', '局': '局', '屁': '屁', '层': '層',
    '居': '居', '屈': '屈', '屏': '屏', '展': '展', '属': '屬', '屯': '屯', '山': '山', '岁': '歲', '岂': '豈',
    '岚': '嵐', '岛': '島', '岭': '嶺', '岳': '岳', '峡': '峽', '娆': '嬈', '峥': '崢', '峦': '巒', '崂': '嶗',
    '巅': '巔', '己': '己', '已': '已', '巳': '巳', '巴': '巴', '巷': '巷', '巾': '巾', '币': '幣', '市': '市',
    '布': '布', '帅': '帥', '帆': '帆', '师': '師', '希': '希', '帐': '帳', '带': '帶', '帧': '幀', '席': '席',
    '帮': '幫', '帷': '帷', '常': '常', '幅': '幅', '幕': '幕', '干': '幹', '平': '平', '年': '年', '并': '並',
    '幸': '幸', '广': '廣', '庄': '莊', '庆': '慶', '庇': '庇', '床': '床', '序': '序', '库': '庫', '应': '應',
    '底': '底', '店': '店', '庙': '廟', '府': '府', '庞': '龐', '废': '廢', '度': '度', '座': '座', '庭': '庭',
    '康': '康', '庸': '庸', '廉': '廉', '廊': '廊', '延': '延', '廷': '廷', '建': '建', '开': '開', '异': '異',
    '弃': '棄', '弄': '弄', '弊': '弊', '式': '式', '弓': '弓', '引': '引', '弗': '弗', '弘': '弘', '弛': '弛',
    '弟': '弟', '张': '張', '弥': '彌', '弦': '弦', '弯': '彎', '弱': '弱', '弹': '彈', '强': '強', '归': '歸',
    '当': '當', '录': '錄', '彦': '彥', '彩': '彩', '彬': '彬', '彭': '彭', '彰': '彰', '影': '影', '役': '役',
    '彻': '徹', '彼': '彼', '往': '往', '征': '征', '径': '徑', '待': '待', '很': '很', '律': '律', '後': '後',
    '徐': '徐', '徒': '徒', '得': '得', '御': '御', '循': '循', '微': '微', '德': '德', '徽': '徽', '心': '心',
    '必': '必', '忆': '憶', '忏': '懺', '忙': '忙', '忧': '憂', '快': '快', '念': '念', '忽': '忽', '忿': '忿',
    '怀': '懷', '态': '態', '怎': '怎', '怒': '怒', '怕': '怕', '怜': '憐', '思': '思', '怠': '怠', '怡': '怡',
    '急': '急', '性': '性', '怨': '怨', '怪': '怪', '总': '總', '恶': '惡', '恸': '慟', '恺': '愷', '恻': '惻',
    '恼': '惱', '恪': '恪', '恳': '懇', '悬': '懸', '悲': '悲', '悴': '悴', '悸': '悸', '悼': '悼', '情': '情',
    '惊': '驚', '惑': '惑', '惕': '惕', '惜': '惜', '惟': '惟', '惠': '惠', '惧': '懼', '惨': '慘', '惩': '懲',
    '惫': '憊', '惬': '愜', '惭': '慚', '惮': '憚', '惯': '慣', '惰': '惰', '想': '想', '惶': '惶', '惹': '惹',
    '惺': '惺', '愁': '愁', '愆': '愆', '愈': '愈', '愉': '愉', '愍': '愍', '意': '意', '愚': '愚', '爱': '愛',
    '感': '感', '愧': '愧', '愫': '愫', '愿': '願', '慈': '慈', '慎': '慎', '慑': '懾', '慕': '慕', '慢': '慢',
    '慧': '慧', '慰': '慰', '慵': '慵', '慷': '慷', '憋': '憋', '憎': '憎', '憔': '憔', '憧': '憧', '憨': '憨',
    '憩': '憩', '憬': '憬', '懂': '懂', '懈': '懈', '懊': '懊', '懒': '懶', '懔': '懍', '懦': '懦', '懵': '懵',
    '懿': '懿', '戈': '戈', '戊': '戊', '戌': '戌', '戍': '戍', '戒': '戒', '或': '或', '战': '戰', '戚': '戚',
    '戴': '戴', '户': '戶', '房': '房', '所': '所', '扁': '扁', '扇': '扇', '手': '手', '才': '才', '扑': '撲',
    '扒': '扒', '打': '打', '扔': '扔', '托': '托', '扣': '扣', '执': '執', '扩': '擴', '扫': '掃', '扬': '揚',
    '扭': '扭', '扮': '扮', '扯': '扯', '扰': '擾', '扶': '扶', '批': '批', '找': '找', '承': '承', '技': '技',
    '抄': '抄', '抉': '抉', '把': '把', '抑': '抑', '抓': '抓', '投': '投', '抗': '抗', '折': '折', '抚': '撫',
    '抛': '拋', '拔': '拔', '择': '擇', '抠': '摳', '抡': '掄', '抢': '搶', '护': '護', '报': '報', '抬': '抬',
    '抱': '抱', '抵': '抵', '抹': '抹', '抽': '抽', '拂': '拂', '担': '擔', '拆': '拆', '拉': '拉', '拌': '拌',
    '拍': '拍', '拎': '拎', '拐': '拐', '拒': '拒', '拓': '拓', '拖': '拖', '拘': '拘', '拙': '拙', '拼': '拼',
    '招': '招', '拜': '拜', '拟': '擬', '拢': '攏', '拣': '揀', '拥': '擁', '拦': '攔', '拧': '擰', '拨': '撥',
    '括': '括', '拭': '拭', '拯': '拯', '拱': '拱', '拴': '拴', '拷': '拷', '拽': '拽', '拾': '拾', '拿': '拿',
    '持': '持', '挂': '掛', '指': '指', '按': '按', '挑': '挑', '挖': '挖', '挚': '摯', '挛': '攣', '挝': '撾',
    '挞': '撻', '挟': '挾', '挠': '撓', '挡': '擋', '挣': '掙', '挤': '擠', '挥': '揮', '捞': '撈', '损': '損',
    '捡': '撿', '换': '換', '捣': '搗', '捧': '捧', '据': '據', '掳': '擄', '掷': '擲', '掸': '撣', '掺': '摻',
    '提': '提', '插': '插', '揖': '揖', '握': '握', '揣': '揣', '揩': '揩', '揪': '揪', '揭': '揭', '援': '援',
    '搂': '摟', '搅': '攪', '搏': '搏', '搬': '搬', '搭': '搭', '携': '攜', '摄': '攝', '摆': '擺', '摇': '搖',
    '摊': '攤', '撑': '撐', '撵': '攆', '撸': '擼', '攒': '攢', '敌': '敵', '敛': '斂', '数': '數', '斋': '齋',
    '斓': '斕', '斩': '斬', '断': '斷', '无': '無', '旧': '舊', '时': '時', '旷': '曠', '昼': '晝', '显': '顯',
    '晋': '晉', '晒': '曬', '晓': '曉', '晕': '暈', '晖': '暉', '暂': '暫', '暧': '曖', '札': '札', '术': '術',
    '朱': '朱', '朴': '朴', '朵': '朵', '机': '機', '杀': '殺', '杂': '雜', '权': '權', '条': '條', '来': '來',
    '杨': '楊', '极': '極', '构': '構', '枢': '樞', '枪': '槍', '枫': '楓', '枭': '梟', '枯': '枯', '架': '架',
    '柄': '柄', '染': '染', '柔': '柔', '查': '查', '栈': '棧', '栖': '棲', '栓': '栓', '栀': '梔', '梦': '夢',
    '梨': '梨', '梭': '梭', '梯': '梯', '械': '械', '梳': '梳', '检': '檢', '棉': '棉', '棋': '棋', '棍': '棍',
    '棒': '棒', '棕': '棕', '棚': '棚', '森': '森', '棱': '稜', '棵': '棵', '椅': '椅', '植': '植', '椎': '椎',
    '椒': '椒', '椰': '椰', '椭': '橢', '模': '模', '横': '橫', '樱': '櫻', '橱': '櫥', '橹': '櫓', '檐': '檐',
    '欧': '歐', '欲': '欲', '欺': '欺', '款': '款', '歆': '歆', '歇': '歇', '歌': '歌', '歉': '歉', '欢': '歡',
    '残': '殘', '殒': '殞', '殇': '殤', '殚': '殫', '僵': '僵', '殡': '殯', '歼': '殲', '壳': '殼', '毁': '毀',
    '毅': '毅', '母': '母', '每': '每', '毒': '毒', '比': '比', '毕': '畢', '毖': '毖', '毗': '毗', '毙': '斃',
    '毛': '毛', '毡': '氈', '毫': '毫', '毯': '毯', '气': '氣', '氢': '氫', '氟': '氟', '氯': '氯', '氦': '氦',
    '氧': '氧', '氨': '氨', '氮': '氮', '氲': '氳', '水': '水', '永': '永', '求': '求', '汇': '匯', '汉': '漢',
    '汕': '汕', '汗': '汗', '汛': '汛', '江': '江', '池': '池', '污': '污', '汤': '湯', '汪': '汪', '汰': '汰',
    '汲': '汲', '汶': '汶', '汹': '洶', '汽': '汽', '汾': '汾', '沁': '沁', '沂': '沂', '沃': '沃', '沅': '沅',
    '沈': '沈', '沉': '沉', '沐': '沐', '沙': '沙', '沛': '沛', '沟': '溝', '没': '沒', '沦': '淪', '沧': '滄',
    '沪': '滬', '沫': '沫', '沮': '沮', '沱': '沱', '河': '河', '沸': '沸', '油': '油', '治': '治', '沼': '沼',
    '沾': '沾', '沿': '沿', '泄': '洩', '泉': '泉', '泊': '泊', '法': '法', '泗': '泗', '泛': '泛', '泞': '濘',
    '泡': '泡', '波': '波', '泣': '泣', '泥': '泥', '注': '注', '泪': '淚', '泰': '泰', '泳': '泳', '泵': '泵',
    '泷': '瀧', '泸': '瀘', '泻': '瀉', '泼': '潑', '泽': '澤', '泾': '涇', '洁': '潔', '洋': '洋', '洒': '灑',
    '洗': '洗', '洛': '洛', '洞': '洞', '津': '津', '洪': '洪', '洲': '洲', '活': '活', '洼': '窪', '洽': '洽',
    '派': '派', '流': '流', '浅': '淺', '浆': '漿', '浇': '澆', '浊': '濁', '测': '測', '济': '濟', '浏': '瀏',
    '浑': '渾', '浒': '滸', '浓': '濃', '浔': '潯', '浙': '浙', '浚': '浚', '浦': '浦', '浩': '浩', '浪': '浪',
    '浮': '浮', '浴': '浴', '海': '海', '浸': '浸', '涂': '塗', '涅': '涅', '消': '消', '涉': '涉', '涌': '湧',
    '涎': '涎', '涕': '涕', '涛': '濤', '涝': '澇', '涞': '淶', '涟': '漣', '涡': '渦', '涣': '渙', '涤': '滌',
    '润': '潤', '涧': '澗', '涨': '漲', '涩': '澀', '游': '游', '渺': '渺', '湃': '湃', '湄': '湄', '湿': '濕',
    '溃': '潰', '溅': '濺', '湾': '灣', '渡': '渡', '渣': '渣', '温': '溫', '渴': '渴', '港': '港', '湍': '湍',
    '湖': '湖', '湘': '湘', '湛': '湛', '溉': '溉', '水源': '水資源',
  };

  // 1. Replace multi-character terms first
  let result = text;
  const sortedKeys = Object.keys(wordMap).sort((a, b) => b.length - a.length);
  for (const key of sortedKeys) {
    result = result.split(key).join(wordMap[key]);
  }

  // 2. Replace remaining single characters
  let charResult = '';
  for (let i = 0; i < result.length; i++) {
    const char = result[i];
    charResult += charMap[char] || char;
  }

  return charResult;
}

// ─── Expert Templates Definitions ──────────────────────────────────────────
interface TemplateDef {
  id: string;
  name: string;
  desc: string;
  icon: string;
  color: string;
  focus: string;
  badge: string;
}

const TEMPLATES: TemplateDef[] = [
  {
    id: 'gri-full',
    name: 'GRI 萬能完整年報模板',
    desc: '全面符合 GRI 2021 與 ISSB 最新準則，適用於需要完整揭露 ESG 三大面向績效之上市櫃企業。',
    icon: 'fa-book-open',
    color: '#009EB0', // Teal
    focus: 'GRI 揭露項目、重大性分析、多方利益相關者溝通機制',
    badge: '熱門推薦',
  },
  {
    id: 'tcfd-climate',
    name: 'TCFD 氣候轉型專利模板',
    desc: '深度聚焦於氣候風險與機遇、淨零碳排路徑及範疇一二三溫室氣體盤查。',
    icon: 'fa-cloud-sun',
    color: '#D4AF37', // Gold
    focus: '氣候情境模擬、碳盤查數據、範疇 1-3 排放細節',
    badge: '科技/製造業首選',
  },
  {
    id: 'sme-lean',
    name: 'SME 輕量精簡模板',
    desc: '專為中小型企業與初創公司設計，精簡繁複指標，專注於核心業務與重大性議題之快速落地。',
    icon: 'fa-seedling',
    color: '#8B5CF6', // Purple
    focus: '核心指標揭露、輕量級碳盤查、ESG 基礎合規',
    badge: '快速落地',
  },
];

// ─── 28 Chapter Definitions ─────────────────────────────────────────────
interface ChapterDef {
  num: number;
  title: string;
  gate: FiveTGate;
}

const CHAPTERS: ChapterDef[] = [
  { num: 1, title: '組織挑戰與報告邊界', gate: 'traceable' },
  { num: 2, title: '永續治理架構與委員會', gate: 'transparent' },
  { num: 3, title: '重大性分析與利害關係人議合', gate: 'transparent' },
  { num: 4, title: '經濟績效與誠信經營守則', gate: 'tangible' },
  { num: 5, title: '氣候策略與淨零轉型路徑', gate: 'tangible' },
  { num: 6, title: '能源管理與碳排放盤查', gate: 'tangible' },
  { num: 7, title: '水資源資源化與廢棄物管理', gate: 'tangible' },
  { num: 8, title: '生物多樣性與自然資本保育', gate: 'tangible' },
  { num: 9, title: '循環經濟與產品生命週期評估', gate: 'tangible' },
  { num: 10, title: '員工結構與多元化人才發展', gate: 'tangible' },
  { num: 11, title: '職業安全健康與人權盡職調查', gate: 'trustworthy' },
  { num: 12, title: '供應鏈永續風險評估與管理', gate: 'trackable' },
  { num: 13, title: '產品責任與客戶隱私保護', gate: 'trustworthy' },
  { num: 14, title: '資訊安全防護與數據隱私機制', gate: 'trustworthy' },
  { num: 15, title: '董事會多元化與薪酬連結指標', gate: 'transparent' },
  { num: 16, title: '風險管理機制與TCFD治理架構', gate: 'trustworthy' },
  { num: 17, title: '氣候情境分析與財務潛在衝擊', gate: 'transparent' },
  { num: 18, title: '內部碳定價策略與碳交易市場', gate: 'tangible' },
  { num: 19, title: '綠色金融工具與ESG投資評估', gate: 'transparent' },
  { num: 20, title: '數位轉型布局與AI低碳創新', gate: 'tangible' },
  { num: 21, title: '智慧財產權與研發創新動能', gate: 'tangible' },
  { num: 22, title: '客戶關係管理與滿意度提升', gate: 'trustworthy' },
  { num: 23, title: '社區參與行動與在地社會影響', gate: 'tangible' },
  { num: 24, title: '勞動權益保障與多元平等職場', gate: 'trustworthy' },
  { num: 25, title: '反貪腐政策與法規遵循實踐', gate: 'transparent' },
  { num: 26, title: 'GRI內容索引與第三方確信聲明', gate: 'traceable' },
  { num: 27, title: 'SDGs指標對應與永續發展路徑', gate: 'trackable' },
  { num: 28, title: '未來展望期許與長期永續承諾', gate: 'trackable' },
];

// ─── Interfaces ──────────────────────────────────────────────────────────
interface Company {
  id: string;
  name: string;
  shortName: string;
  industry: string;
}

interface Chapter {
  id: string;
  num: number;
  title: string;
  griCodes: string[];
  fiveTGate: FiveTGate;
  content: string;
  paragraphs: Array<{ content: string }>;
  wordCount: number;
  zkpHash: string;
  omniTagUuid: string;
  evidenceCount: number;
}

interface FiveTStatus {
  traceable: boolean;
  transparent: boolean;
  tangible: boolean;
  trustworthy: boolean;
  trackable: boolean;
}

interface V5Report {
  companyId: string;
  companyName: string;
  industry: string;
  chapters: Chapter[];
  totalWords: number;
  totalParagraphs: number;
  totalOmniTags: number;
  totalEvidence: number;
  fiveTStatus: FiveTStatus;
  trinityHash: string;
  generatedAt: string;
  reportVersion: '5.0';
}

interface TrinityData {
  vaultSeals: number;
  userMilestones: number;
  agentGates: number;
  allPassed: boolean;
}

type ViewportSize = 'mobile' | 'tablet' | 'desktop';

// ─── Hook: Viewport Detection ────────────────────────────────────────────
function useViewport(): ViewportSize {
  const [vp, setVp] = useState<ViewportSize>('desktop');

  useEffect(() => {
    const check = () => {
      const w = window.innerWidth;
      if (w < 640) setVp('mobile');
      else if (w < 1024) setVp('tablet');
      else setVp('desktop');
    };
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  return vp;
}

// ─── Component: TopNavBar ────────────────────────────────────────────────
interface TopNavProps {
  companies: Company[];
  selectedCompany: string;
  onSelectCompany: (id: string) => void;
  report: V5Report | null;
  onToggleSidebar: () => void;
  sidebarOpen: boolean;
}

function TopNav({ companies, selectedCompany, onSelectCompany, report, onToggleSidebar, sidebarOpen }: TopNavProps) {
  return (
    <nav
      role="navigation"
      aria-label="主導覽列"
      style={{
        position: 'sticky',
        top: 52,
        zIndex: 100,
        background: 'var(--nav-bg)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: `1px solid var(--nav-border)`,
        padding: '10px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
        height: 56,
      }}
    >
      {/* Left: Breadcrumb + Hamburger */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {/* Hamburger — visible on mobile/tablet */}
        <button
          onClick={onToggleSidebar}
          aria-label={sidebarOpen ? '關閉章節選單' : '開啟章節選單'}
          aria-expanded={sidebarOpen}
          style={{
            background: 'transparent',
            border: `1px solid var(--nav-border)`,
            borderRadius: 8,
            color: COLORS.teal,
            width: 36,
            height: 36,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            fontSize: 16,
          }}
          className="hamburger-btn"
        >
          <i className={`fas ${sidebarOpen ? 'fa-times' : 'fa-bars'}`} />
        </button>

        <span
          style={{
            fontFamily: "var(--font-serif)",
            fontWeight: 600,
            fontSize: 15,
            color: 'var(--text-color)',
            whiteSpace: 'nowrap',
          }}
        >
          永續報告撰寫
        </span>
        <span
          style={{
            background: 'rgba(0, 158, 176, 0.1)',
            color: COLORS.teal,
            padding: '2px 8px',
            borderRadius: 6,
            fontFamily: "'Fira Code', monospace",
            fontSize: 10,
            fontWeight: 600,
          }}
        >
          V5.0
        </span>
      </div>

      {/* Right: Company Selector + Word Count */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
        <i className="fas fa-building" style={{ color: COLORS.textSecondary, fontSize: 13, flexShrink: 0 }} />
        <select
          value={selectedCompany}
          onChange={(e) => onSelectCompany(e.target.value)}
          aria-label="選擇公司"
          style={{
            background: 'var(--card-bg)',
            color: 'var(--text-color)',
            border: `1px solid var(--card-border)`,
            borderRadius: 8,
            padding: '6px 12px',
            fontFamily: "'Noto Sans TC', sans-serif",
            fontSize: 13,
            cursor: 'pointer',
            outline: 'none',
            maxWidth: 200,
            minWidth: 0,
            boxShadow: 'var(--card-shadow)',
          }}
        >
          {companies.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name || c.shortName}
            </option>
          ))}
        </select>
        {report && (
          <span
            style={{
              fontFamily: "'Fira Code', monospace",
              fontSize: 11,
              color: COLORS.textSecondary,
              whiteSpace: 'nowrap',
              display: 'none',
            }}
            className="word-count-badge"
          >
            {report.totalWords.toLocaleString()} 字
          </span>
        )}
      </div>
    </nav>
  );
}

// ─── Component: ProgressBar ──────────────────────────────────────────────
function ProgressBar({ progress, loading }: { progress: number; loading: boolean }) {
  if (!loading) return null;
  return (
    <div style={{ height: 3, background: COLORS.surface, width: '100%' }}>
      <div
        role="progressbar"
        aria-valuenow={Math.round(progress)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="報告產生進度"
        style={{
          height: '100%',
          width: `${progress}%`,
          background: COLORS.teal,
          transition: 'width 0.3s ease',
        }}
      />
    </div>
  );
}

// ─── Component: ChapterSidebar ───────────────────────────────────────────
interface SidebarProps {
  activeChapter: number;
  onScrollToChapter: (num: number) => void;
  chapterRefs: React.MutableRefObject<Record<number, HTMLDivElement | null>>;
  open: boolean;
  onClose: () => void;
}

function ChapterSidebar({ activeChapter, onScrollToChapter, chapterRefs, open, onClose }: SidebarProps) {
  return (
    <>
      {/* Mobile overlay backdrop */}
      {open && (
        <div
          onClick={onClose}
          aria-hidden="true"
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.6)',
            zIndex: 90,
          }}
          className="sidebar-backdrop"
        />
      )}
      <aside
        role="complementary"
        aria-label="章節導航"
        style={{
          width: 220,
          minWidth: 220,
          background: 'var(--card-bg)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderRight: `1px solid var(--card-border)`,
          overflowY: 'auto',
          padding: '16px 0',
          maxHeight: 'calc(100vh - 60px)',
          position: 'sticky',
          top: 60,
          transition: 'transform 0.3s ease',
          zIndex: 95,
          boxShadow: 'var(--card-shadow)',
        }}
        className={`chapter-sidebar ${open ? 'sidebar-open' : ''}`}
      >
        <div
          style={{
            padding: '0 12px 12px',
            fontFamily: "'Montserrat', sans-serif",
            fontSize: 11,
            fontWeight: 600,
            color: COLORS.textSecondary,
            textTransform: 'uppercase',
            letterSpacing: 1,
          }}
        >
          28 章節導航
        </div>
        {CHAPTERS.map((ch) => {
          const gateColor = FIVE_T_COLORS[ch.gate];
          const isActive = activeChapter === ch.num - 1;
          return (
            <button
              key={ch.num}
              onClick={() => {
                onScrollToChapter(ch.num);
                onClose();
              }}
              ref={(el) => {
                // We use a wrapper div ref approach for scroll targets
                if (el) {
                  // Store reference for scroll
                }
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                width: '100%',
                padding: '8px 12px',
                background: isActive ? `${gateColor}15` : 'transparent',
                border: 'none',
                borderLeft: `3px solid ${isActive ? gateColor : 'transparent'}`,
                color: isActive ? gateColor : COLORS.textSecondary,
                fontFamily: "'Noto Sans TC', sans-serif",
                fontSize: 12,
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              <span
                style={{
                  fontFamily: "'Fira Code', monospace",
                  fontSize: 10,
                  opacity: 0.6,
                  width: 20,
                  flexShrink: 0,
                }}
              >
                {String(ch.num).padStart(2, '0')}
              </span>
              <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {ch.title}
              </span>
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: gateColor,
                  flexShrink: 0,
                }}
              />
            </button>
          );
        })}
      </aside>
    </>
  );
}

// ─── Component: StatsCards ───────────────────────────────────────────────
function StatsCards({ report }: { report: V5Report }) {
  const stats = [
    { label: '章節數', value: '28', icon: 'fa-book', color: COLORS.teal },
    { label: '5T 協議', value: '5', icon: 'fa-layer-group', color: COLORS.gold },
    { label: 'ZKP 封印', value: report.totalEvidence, icon: 'fa-lock', color: COLORS.zkpBlue },
    { label: 'GRI 指標', value: report.totalOmniTags, icon: 'fa-tags', color: COLORS.purple },
  ];

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
        gap: 12,
        marginBottom: 20,
      }}
    >
      {stats.map((s) => (
        <div
          key={s.label}
          style={{
            background: COLORS.cardBg,
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: `1px solid ${COLORS.cardBorder}`,
            borderRadius: 12,
            padding: '14px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <i className={`fas ${s.icon}`} style={{ color: s.color, fontSize: 18 }} />
          <div>
            <div
              style={{
                fontFamily: "'Fira Code', monospace",
                fontSize: 20,
                fontWeight: 700,
                color: s.color,
                lineHeight: 1.2,
              }}
            >
              {s.value}
            </div>
            <div style={{ color: COLORS.textSecondary, fontSize: 11 }}>{s.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Component: ReportHeader ─────────────────────────────────────────────
function ReportHeader({ report }: { report: V5Report }) {
  return (
    <div
      style={{
        background: COLORS.cardBg,
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: `1px solid ${COLORS.cardBorder}`,
        borderRadius: 16,
        padding: '20px 24px',
        marginBottom: 20,
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: 14,
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        <div>
          <h1
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: 22,
              fontWeight: 700,
              color: COLORS.teal,
              margin: 0,
            }}
          >
            {report.companyName}
          </h1>
          <span style={{ color: COLORS.textSecondary, fontSize: 12 }}>
            {report.industry} | ESGGO v5.0 | {report.generatedAt?.slice(0, 10)}
          </span>
        </div>
        {/* 5T Status Badges */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {(Object.entries(report.fiveTStatus) as [FiveTGate, boolean][]).map(([gate, passed]) => (
            <span
              key={gate}
              style={{
                background: passed ? FIVE_T_COLORS[gate] : COLORS.lethal,
                color: '#fff',
                padding: '3px 8px',
                borderRadius: 8,
                fontFamily: "'Fira Code', monospace",
                fontSize: 10,
                fontWeight: 600,
              }}
            >
              {FIVE_T_LABELS[gate]} {passed ? '✓' : '✗'}
            </span>
          ))}
        </div>
      </div>
      {/* Stats Row */}
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        {[
          { label: '總字數', value: report.totalWords.toLocaleString(), icon: 'fa-align-left' },
          { label: '段落', value: report.totalParagraphs, icon: 'fa-paragraph' },
          { label: 'OmniTags', value: report.totalOmniTags, icon: 'fa-tags' },
          { label: '證據', value: report.totalEvidence, icon: 'fa-shield-alt' },
        ].map((stat) => (
          <div key={stat.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <i className={`fas ${stat.icon}`} style={{ color: COLORS.gold, fontSize: 12 }} />
            <span
              style={{
                fontFamily: "'Fira Code', monospace",
                fontSize: 13,
                color: COLORS.textPrimary,
              }}
            >
              {stat.value}
            </span>
            <span style={{ color: COLORS.textSecondary, fontSize: 11 }}>{stat.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Component: ChapterCard ──────────────────────────────────────────────
interface ChapterCardProps {
  ch: Chapter;
  idx: number;
  chapterRefs: React.MutableRefObject<Record<number, HTMLDivElement | null>>;
}

function ChapterCard({ ch, idx, chapterRefs }: ChapterCardProps) {
  const gateColor = FIVE_T_COLORS[ch.fiveTGate] || COLORS.teal;

  return (
    <div
      ref={(el) => {
        chapterRefs.current[idx] = el;
      }}
      id={`chapter-${idx}`}
      style={{
        background: COLORS.cardBg,
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: `1px solid ${COLORS.cardBorder}`,
        borderRadius: 16,
        padding: '20px 24px',
        marginBottom: 16,
        transition: 'border-color 0.3s',
      }}
    >
      {/* Chapter Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 14,
          flexWrap: 'wrap',
          gap: 8,
        }}
      >
        <h2
          style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: 16,
            fontWeight: 600,
            color: gateColor,
            margin: 0,
          }}
        >
          CH.{String(ch.num).padStart(2, '0')} {ch.title}
        </h2>
        <span
          style={{
            background: gateColor,
            color: '#000',
            padding: '3px 10px',
            borderRadius: 8,
            fontFamily: "'Fira Code', monospace",
            fontSize: 10,
            fontWeight: 600,
          }}
        >
          {FIVE_T_LABELS[ch.fiveTGate]}
        </span>
      </div>

      {/* GRI Codes */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
        {ch.griCodes.map((gri) => (
          <span
            key={gri}
            style={{
              background: COLORS.surface,
              border: `1px solid ${COLORS.cardBorder}`,
              color: COLORS.textSecondary,
              padding: '2px 8px',
              borderRadius: 8,
              fontFamily: "'Fira Code', monospace",
              fontSize: 11,
            }}
          >
            {gri}
          </span>
        ))}
      </div>

      {/* Content */}
      <div
        style={{
          fontSize: 14,
          lineHeight: 1.8,
          color: COLORS.textPrimary,
          whiteSpace: 'pre-wrap',
          marginBottom: 14,
        }}
      >
        {ch.content || '（本章內容產生中...）'}
      </div>

      {/* Footer: ZKP Hash + OmniTag */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderTop: `1px solid ${COLORS.cardBorder}`,
          paddingTop: 10,
          flexWrap: 'wrap',
          gap: 8,
        }}
      >
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <span
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              fontFamily: "'Fira Code', monospace",
              fontSize: 10,
              color: COLORS.zkpBlue,
            }}
          >
            <i className="fas fa-lock" style={{ fontSize: 10 }} />
            ZKP: {ch.zkpHash}
          </span>
          <span
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              fontFamily: "'Fira Code', monospace",
              fontSize: 10,
              color: COLORS.purple,
            }}
          >
            <i className="fas fa-tag" style={{ fontSize: 10 }} />
            OmniTag: {ch.omniTagUuid}
          </span>
        </div>
        <span style={{ color: COLORS.textSecondary, fontSize: 10 }}>
          {ch.wordCount} 字 | {ch.paragraphs?.length || 0} 段落
        </span>
      </div>
    </div>
  );
}

// ─── Component: TrinityPanel ─────────────────────────────────────────────
interface TrinityPanelProps {
  trinity: TrinityData;
  simulating: boolean;
  onRunSimulator: () => void;
}

function TrinityPanel({ trinity, simulating, onRunSimulator }: TrinityPanelProps) {
  return (
    <aside
      role="complementary"
      aria-label="OmniBase 三庫面板"
      style={{
        width: 260,
        minWidth: 260,
        background: 'var(--card-bg)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderLeft: `1px solid var(--card-border)`,
        padding: '16px',
        maxHeight: 'calc(100vh - 60px)',
        position: 'sticky',
        top: 60,
        overflowY: 'auto',
        boxShadow: 'var(--card-shadow)',
      }}
      className="trinity-panel"
    >
      <div
        style={{
          fontFamily: "'Montserrat', sans-serif",
          fontSize: 11,
          fontWeight: 600,
          color: COLORS.textSecondary,
          textTransform: 'uppercase',
          letterSpacing: 1,
          marginBottom: 14,
        }}
      >
        OmniBase 三庫
      </div>

      {/* Vault Seals */}
      <div
        style={{
          background: COLORS.cardBg,
          border: `1px solid ${COLORS.cardBorder}`,
          borderRadius: 12,
          padding: 14,
          marginBottom: 10,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
          <i className="fas fa-vault" style={{ color: COLORS.gold, fontSize: 14 }} />
          <span
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: 12,
              fontWeight: 600,
              color: COLORS.gold,
            }}
          >
            金庫封印
          </span>
        </div>
        <div
          style={{
            fontFamily: "'Fira Code', monospace",
            fontSize: 24,
            fontWeight: 700,
            color: COLORS.gold,
          }}
        >
          {trinity.vaultSeals}
        </div>
        <div style={{ color: COLORS.textSecondary, fontSize: 10, marginTop: 2 }}>/ 28 章節已封印</div>
        <div
          style={{
            height: 4,
            borderRadius: 2,
            background: COLORS.surface,
            marginTop: 6,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${(trinity.vaultSeals / 28) * 100}%`,
              background: COLORS.gold,
              transition: 'width 0.5s ease',
            }}
          />
        </div>
      </div>

      {/* User Milestones */}
      <div
        style={{
          background: COLORS.cardBg,
          border: `1px solid ${COLORS.cardBorder}`,
          borderRadius: 12,
          padding: 14,
          marginBottom: 10,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
          <i className="fas fa-flag-checkered" style={{ color: COLORS.purple, fontSize: 14 }} />
          <span
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: 12,
              fontWeight: 600,
              color: COLORS.purple,
            }}
          >
            用戶里程碑
          </span>
        </div>
        <div
          style={{
            fontFamily: "'Fira Code', monospace",
            fontSize: 24,
            fontWeight: 700,
            color: COLORS.purple,
          }}
        >
          {trinity.userMilestones}
        </div>
        <div style={{ color: COLORS.textSecondary, fontSize: 10, marginTop: 2 }}>已達成里程碑</div>
      </div>

      {/* Agent Gates */}
      <div
        style={{
          background: COLORS.cardBg,
          border: `1px solid ${COLORS.cardBorder}`,
          borderRadius: 12,
          padding: 14,
          marginBottom: 10,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
          <i className="fas fa-robot" style={{ color: COLORS.zkpBlue, fontSize: 14 }} />
          <span
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: 12,
              fontWeight: 600,
              color: COLORS.zkpBlue,
            }}
          >
            智能閘門
          </span>
        </div>
        <div
          style={{
            fontFamily: "'Fira Code', monospace",
            fontSize: 24,
            fontWeight: 700,
            color: COLORS.zkpBlue,
          }}
        >
          {trinity.agentGates}
        </div>
        <div style={{ color: COLORS.textSecondary, fontSize: 10, marginTop: 2 }}>/ 5T 閘門已通過</div>
        {/* Gate indicators */}
        <div style={{ display: 'flex', gap: 4, marginTop: 6 }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                height: 6,
                borderRadius: 3,
                background: i < trinity.agentGates ? COLORS.zkpBlue : COLORS.surface,
                transition: 'background 0.3s',
              }}
            />
          ))}
        </div>
      </div>

      {/* Simulator Button */}
      <button
        onClick={onRunSimulator}
        disabled={simulating}
        aria-label="執行三庫聯動模擬"
        style={{
          width: '100%',
          background: simulating ? COLORS.surface : COLORS.lethal,
          color: '#fff',
          border: 'none',
          borderRadius: 12,
          padding: '10px 14px',
          fontFamily: "'Montserrat', sans-serif",
          fontSize: 12,
          fontWeight: 600,
          cursor: simulating ? 'not-allowed' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          transition: 'all 0.2s',
          opacity: simulating ? 0.7 : 1,
        }}
      >
        <i className={`fas ${simulating ? 'fa-spinner fa-spin' : 'fa-play'}`} style={{ fontSize: 12 }} />
        {simulating ? '模擬中...' : '三庫聯動模擬'}
      </button>

      {/* Trinity Status */}
      <div
        style={{
          marginTop: 10,
          padding: 10,
          background: trinity.allPassed ? 'rgba(0, 158, 176, 0.1)' : 'rgba(255, 77, 109, 0.1)',
          border: `1px solid ${trinity.allPassed ? COLORS.teal : COLORS.lethal}`,
          borderRadius: 12,
          textAlign: 'center',
        }}
      >
        <div
          style={{
            fontFamily: "'Fira Code', monospace",
            fontSize: 10,
            color: trinity.allPassed ? COLORS.teal : COLORS.lethal,
          }}
        >
          {trinity.allPassed ? '◈ 三庫已同步' : '◈ 三庫同步中'}
        </div>
      </div>
    </aside>
  );
}

// ─── Component: BottomFooter ─────────────────────────────────────────────
interface FooterProps {
  report: V5Report | null;
  onDownloadHtml: () => void;
  onDownloadMarkdown: () => void;
}

function BottomFooter({ report, onDownloadHtml, onDownloadMarkdown }: FooterProps) {
  return (
    <footer
      role="contentinfo"
      style={{
        position: 'sticky',
        bottom: 0,
        background: 'var(--nav-bg)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderTop: `1px solid var(--nav-border)`,
        padding: '8px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
        flexWrap: 'wrap',
      }}
    >
      {/* 5T Status */}
      <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
        <span
          style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: 10,
            color: COLORS.textSecondary,
            fontWeight: 600,
          }}
        >
          5T:
        </span>
        {(Object.entries(FIVE_T_COLORS) as [FiveTGate, string][]).map(([gate, color]) => (
          <div key={gate} style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: report?.fiveTStatus?.[gate] ? color : COLORS.surface,
                boxShadow: report?.fiveTStatus?.[gate] ? `0 0 6px ${color}` : 'none',
              }}
            />
            <span
              style={{
                fontFamily: "'Fira Code', monospace",
                fontSize: 9,
                color: report?.fiveTStatus?.[gate] ? color : COLORS.textSecondary,
              }}
            >
              {FIVE_T_LABELS[gate]}
            </span>
          </div>
        ))}
      </div>

      {/* Trinity Hash */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          fontFamily: "'Fira Code', monospace",
          fontSize: 10,
          color: COLORS.textSecondary,
          minWidth: 0,
          flex: 1,
          justifyContent: 'center',
        }}
      >
        <i className="fas fa-fingerprint" style={{ color: COLORS.teal, fontSize: 11 }} />
        <span style={{ color: COLORS.teal }}>Trinity:</span>
        <span
          style={{
            maxWidth: 160,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {report?.trinityHash || '---'}
        </span>
      </div>

      {/* Download Buttons */}
      <div style={{ display: 'flex', gap: 6 }}>
        <button
          onClick={onDownloadHtml}
          disabled={!report}
          aria-label="下載 HTML 報告"
          style={{
            background: 'transparent',
            border: `1px solid ${COLORS.teal}`,
            color: COLORS.teal,
            borderRadius: 8,
            padding: '5px 12px',
            fontFamily: "'Fira Code', monospace",
            fontSize: 10,
            cursor: report ? 'pointer' : 'not-allowed',
            opacity: report ? 1 : 0.4,
            display: 'flex',
            alignItems: 'center',
            gap: 4,
          }}
        >
          <i className="fas fa-file-code" style={{ fontSize: 10 }} />
          HTML
        </button>
        <button
          onClick={onDownloadMarkdown}
          disabled={!report}
          aria-label="下載 Markdown 報告"
          style={{
            background: 'transparent',
            border: `1px solid ${COLORS.gold}`,
            color: COLORS.gold,
            borderRadius: 8,
            padding: '5px 12px',
            fontFamily: "'Fira Code', monospace",
            fontSize: 10,
            cursor: report ? 'pointer' : 'not-allowed',
            opacity: report ? 1 : 0.4,
            display: 'flex',
            alignItems: 'center',
            gap: 4,
          }}
        >
          <i className="fas fa-file-alt" style={{ fontSize: 10 }} />
          Markdown
        </button>
      </div>
    </footer>
  );
}

// ─── Component: TemplateGate ─────────────────────────────────────────────
interface TemplateGateProps {
  templates: TemplateDef[];
  onSelectTemplate: (t: TemplateDef) => void;
  loading: boolean;
}

function TemplateGate({ templates, onSelectTemplate, loading }: TemplateGateProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '70vh',
        padding: '40px 24px',
        gap: 40,
      }}
    >
      {/* Header */}
      <div style={{ textAlign: 'center', maxWidth: 640 }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 10,
            background: 'rgba(0, 158, 176, 0.08)',
            border: '1px solid rgba(0, 158, 176, 0.25)',
            borderRadius: 100,
            padding: '6px 18px',
            marginBottom: 20,
          }}
        >
          <i className="fas fa-layer-group" style={{ color: COLORS.teal, fontSize: 13 }} />
          <span
            style={{
              fontFamily: "'Fira Code', monospace",
              fontSize: 11,
              color: COLORS.teal,
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: 1,
            }}
          >
            Step 1 — 套用專家模板
          </span>
        </div>
        <h1
          style={{
            fontFamily: "'Noto Serif TC', serif",
            fontSize: 'clamp(22px, 4vw, 32px)',
            fontWeight: 700,
            color: COLORS.textPrimary,
            lineHeight: 1.4,
            marginBottom: 12,
          }}
        >
          請選擇適合貴公司的
          <br />
          <span style={{ color: COLORS.teal }}>永續報告專家模板</span>
        </h1>
        <p
          style={{
            color: COLORS.textSecondary,
            fontSize: 14,
            lineHeight: 1.8,
            fontFamily: "'Noto Sans TC', sans-serif",
          }}
        >
          套用模板後，ESGGO AI 將依據所選框架，為您生成完整的 28 章節永續報告書，
          <br className="hide-mobile" />
          全程繁體中文輸出，符合 GRI 2021 / ISSB 最新準則。
        </p>
      </div>

      {/* Template Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: 20,
          width: '100%',
          maxWidth: 900,
        }}
      >
        {templates.map((tpl) => {
          const isHovered = hoveredId === tpl.id;
          return (
            <button
              key={tpl.id}
              id={`template-btn-${tpl.id}`}
              disabled={loading}
              onClick={() => onSelectTemplate(tpl)}
              onMouseEnter={() => setHoveredId(tpl.id)}
              onMouseLeave={() => setHoveredId(null)}
              aria-label={`套用 ${tpl.name}`}
              style={{
                background: isHovered ? `${tpl.color}08` : 'var(--card-bg)',
                border: `2px solid ${isHovered ? tpl.color : 'var(--card-border)'}`,
                borderRadius: 16,
                padding: '28px 24px',
                cursor: loading ? 'not-allowed' : 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s ease',
                transform: isHovered ? 'translateY(-4px)' : 'none',
                boxShadow: isHovered
                  ? `0 12px 32px -8px ${tpl.color}30`
                  : 'var(--card-shadow)',
                opacity: loading ? 0.6 : 1,
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Badge */}
              {tpl.badge && (
                <div
                  style={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    background: tpl.color,
                    color: '#fff',
                    fontSize: 10,
                    fontWeight: 700,
                    fontFamily: "'Fira Code', monospace",
                    padding: '3px 10px',
                    borderRadius: 100,
                    letterSpacing: 0.5,
                  }}
                >
                  {tpl.badge}
                </div>
              )}

              {/* Icon */}
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  background: `${tpl.color}18`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 16,
                }}
              >
                <i className={`fas ${tpl.icon}`} style={{ fontSize: 22, color: tpl.color }} />
              </div>

              {/* Title */}
              <div
                style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: 15,
                  fontWeight: 700,
                  color: tpl.color,
                  marginBottom: 10,
                  lineHeight: 1.3,
                }}
              >
                {tpl.name}
              </div>

              {/* Description */}
              <div
                style={{
                  fontFamily: "'Noto Sans TC', sans-serif",
                  fontSize: 13,
                  color: COLORS.textSecondary,
                  lineHeight: 1.8,
                  marginBottom: 16,
                }}
              >
                {tpl.desc}
              </div>

              {/* Focus tags */}
              <div
                style={{
                  borderTop: `1px solid var(--card-border)`,
                  paddingTop: 12,
                  fontFamily: "'Noto Sans TC', sans-serif",
                  fontSize: 11,
                  color: COLORS.textSecondary,
                  lineHeight: 1.6,
                }}
              >
                <span style={{ color: tpl.color, fontWeight: 600 }}>核心焦點：</span>
                {tpl.focus}
              </div>

              {/* Apply CTA */}
              <div
                style={{
                  marginTop: 16,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: 12,
                  fontWeight: 700,
                  color: tpl.color,
                  opacity: isHovered ? 1 : 0.7,
                  transition: 'opacity 0.2s',
                }}
              >
                <i className="fas fa-arrow-right" style={{ fontSize: 11 }} />
                {loading ? '生成中...' : '套用此模板，開始生成'}
              </div>
            </button>
          );
        })}
      </div>

      {/* Footnote */}
      <p
        style={{
          fontFamily: "'Fira Code', monospace",
          fontSize: 11,
          color: COLORS.textSecondary,
          textAlign: 'center',
          letterSpacing: 0.5,
        }}
      >
        ◈ 5T Protocol · OmniBase ZKP Vault · GRI 2021 / ISSB Compliant · 繁體中文輸出
      </p>
    </div>
  );
}

// ─── Main Page Component ─────────────────────────────────────────────────
export default function SustainWriteV5Page() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<string>('');
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateDef | null>(null);
  const [report, setReport] = useState<V5Report | null>(null);
  const [activeChapter, setActiveChapter] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [trinity, setTrinity] = useState<TrinityData>({
    vaultSeals: 0,
    userMilestones: 0,
    agentGates: 0,
    allPassed: false,
  });
  const [simulating, setSimulating] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const chapterRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const viewport = useViewport();

  // Fetch companies on mount
  useEffect(() => {
    fetch('/api/sustain-write/v5')
      .then((r) => r.json())
      .then((data: { companies?: Company[] }) => {
        setCompanies(data.companies || []);
        if (data.companies && data.companies.length > 0) {
          setSelectedCompany(data.companies[0].id);
        }
      })
      .catch(() => {
        /* silent fail */
      });
  }, []);

  // Generate report
  const generateReport = useCallback(
    async (companyId: string) => {
      if (!companyId) return;
      setLoading(true);
      setProgress(0);
      setReport(null);

      const progressInterval = setInterval(() => {
        setProgress((prev) => Math.min(prev + Math.random() * 15, 90));
      }, 200);

      try {
        const res = await fetch('/api/sustain-write/v5', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ companyId, format: 'json', mode: 'full' }),
        });
        const data: V5Report = await res.json();
        if ('error' in data) {
          console.error(data);
        } else {
          setReport(data);
          setProgress(100);
          setTrinity({
            vaultSeals: data.totalEvidence || 28,
            userMilestones: Math.floor(data.totalParagraphs / 3) || 9,
            agentGates: 5,
            allPassed: true,
          });
        }
      } catch (err) {
        console.error('產生報告失敗:', err);
      } finally {
        clearInterval(progressInterval);
        setTimeout(() => setProgress(100), 100);
        setTimeout(() => setLoading(false), 500);
      }
    },
    []
  );

  // Auto-generate only after BOTH company and template are selected
  useEffect(() => {
    if (selectedCompany && selectedTemplate) {
      generateReport(selectedCompany);
    }
  }, [selectedCompany, selectedTemplate, generateReport]);

  // Handle template selection — useEffect will trigger generateReport automatically
  const handleSelectTemplate = useCallback((tpl: TemplateDef) => {
    setSelectedTemplate(tpl);
    setReport(null);
  }, []);

  // Scroll to chapter
  const scrollToChapter = useCallback((num: number) => {
    setActiveChapter(num - 1);
    chapterRefs.current[num - 1]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  // Download handlers
  const downloadHtml = useCallback(() => {
    if (!report) return;
    fetch('/api/sustain-write/v5', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ companyId: selectedCompany, format: 'html' }),
    })
      .then((r) => r.blob())
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `esggo-v5-${selectedCompany}.html`;
        a.click();
        URL.revokeObjectURL(url);
      });
  }, [report, selectedCompany]);

  const downloadMarkdown = useCallback(() => {
    if (!report) return;
    fetch('/api/sustain-write/v5', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ companyId: selectedCompany, format: 'markdown' }),
    })
      .then((r) => r.blob())
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `esggo-v5-${selectedCompany}.md`;
        a.click();
        URL.revokeObjectURL(url);
      });
  }, [report, selectedCompany]);

  // Simulator animation
  const runSimulator = useCallback(() => {
    setSimulating(true);
    let step = 0;
    const interval = setInterval(() => {
      step++;
      setTrinity((prev) => ({
        vaultSeals: Math.min(prev.vaultSeals + 1, 28),
        userMilestones: Math.min(prev.userMilestones + 1, 12),
        agentGates: Math.min(prev.agentGates + (step % 2 === 0 ? 1 : 0), 5),
        allPassed: step >= 5,
      }));
      if (step >= 10) {
        clearInterval(interval);
        setSimulating(false);
      }
    }, 300);
  }, []);

  // Determine layout mode
  const isMobile = viewport === 'mobile';
  const isTablet = viewport === 'tablet';
  const showSidebar = !isMobile && !isTablet; // Desktop always shows sidebar
  const showTrinity = !isMobile; // Trinity panel hidden on mobile

  return (
    <div
      style={{
        minHeight: '100vh',
        background: COLORS.darkBg,
        color: COLORS.textPrimary,
        fontFamily: "'Noto Sans TC', sans-serif",
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* ═══ 1. TOP NAVIGATION BAR ═══ */}
      <TopNav
        companies={companies}
        selectedCompany={selectedCompany}
        onSelectCompany={setSelectedCompany}
        report={report}
        onToggleSidebar={() => setSidebarOpen((p) => !p)}
        sidebarOpen={sidebarOpen}
      />

      {/* Progress Bar */}
      <ProgressBar progress={progress} loading={loading} />

      {/* ═══ MAIN LAYOUT ═══ */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* ═══ 2. LEFT SIDEBAR — 28 Chapter Navigation ═══ */}
        {/* On mobile/tablet: overlay sidebar; on desktop: always visible */}
        {(showSidebar || sidebarOpen) && (
          <ChapterSidebar
            activeChapter={activeChapter}
            onScrollToChapter={scrollToChapter}
            chapterRefs={chapterRefs}
            open={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />
        )}

        {/* ═══ 3. CENTER — Report Content ═══ */}
        <main
          ref={contentRef}
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: isMobile ? '16px 12px' : '20px 24px',
            maxHeight: 'calc(100vh - 60px)',
            minWidth: 0,
          }}
        >
          {/* Template Gate: show until template is selected */}
          {!selectedTemplate ? (
            <TemplateGate
              templates={TEMPLATES}
              onSelectTemplate={handleSelectTemplate}
              loading={loading}
            />
          ) : !report && !loading ? (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '60vh',
                gap: 16,
              }}
            >
              <i
                className="fas fa-spinner fa-spin"
                style={{ fontSize: 40, color: COLORS.teal }}
              />
              <span style={{ color: COLORS.textSecondary, fontSize: 15 }}>
                正在初始化 AI 報告引擎...
              </span>
            </div>
          ) : report ? (
            <>
              {/* Active Template Badge */}
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  background: `${selectedTemplate.color}10`,
                  border: `1px solid ${selectedTemplate.color}40`,
                  borderRadius: 100,
                  padding: '5px 14px',
                  marginBottom: 16,
                  cursor: 'pointer',
                }}
                onClick={() => { setSelectedTemplate(null); setReport(null); }}
                title="點擊重新選擇模板"
              >
                <i className={`fas ${selectedTemplate.icon}`} style={{ color: selectedTemplate.color, fontSize: 11 }} />
                <span style={{ fontFamily: "'Fira Code', monospace", fontSize: 11, color: selectedTemplate.color, fontWeight: 600 }}>
                  {selectedTemplate.name}
                </span>
                <i className="fas fa-times" style={{ color: selectedTemplate.color, fontSize: 9, marginLeft: 4, opacity: 0.7 }} />
              </div>

              {/* Stats Cards */}
              <StatsCards report={report} />

              {/* Report Header Card */}
              <ReportHeader report={report} />

              {/* Chapter Cards */}
              {report.chapters.map((ch, idx) => (
                <ChapterCard key={ch.id} ch={ch} idx={idx} chapterRefs={chapterRefs} />
              ))}
            </>
          ) : null}
        </main>

        {/* ═══ 4. RIGHT SIDEBAR — OmniBase Trinity Panel ═══ */}
        {showTrinity && (
          <TrinityPanel
            trinity={trinity}
            simulating={simulating}
            onRunSimulator={runSimulator}
          />
        )}
      </div>

      {/* ═══ 5. BOTTOM STATUS BAR ═══ */}
      <BottomFooter
        report={report}
        onDownloadHtml={downloadHtml}
        onDownloadMarkdown={downloadMarkdown}
      />

      {/* ═══ Global Styles for RWD ═══ */}
      <style jsx global>{`
        /* Mobile hamburger button visible on < 1024px */
        @media (max-width: 1023px) {
          .hamburger-btn {
            display: flex !important;
          }
          .hide-mobile {
            display: none !important;
          }
        }

        /* Chapter sidebar: overlay on mobile/tablet */
        @media (max-width: 1023px) {
          .chapter-sidebar {
            position: fixed !important;
            top: 60px !important;
            left: 0 !important;
            bottom: 0 !important;
            transform: translateX(-100%) !important;
            width: 260px !important;
            min-width: 260px !important;
            border-right: 1px solid var(--card-border) !important;
            max-height: none !important;
          }
          .chapter-sidebar.sidebar-open {
            transform: translateX(0) !important;
          }
          .sidebar-backdrop {
            display: block !important;
          }
        }

        @media (min-width: 1024px) {
          .sidebar-backdrop {
            display: none !important;
          }
        }

        /* Trinity panel: hide on mobile */
        @media (max-width: 639px) {
          .trinity-panel {
            display: none !important;
          }
        }

        /* Word count badge: show on tablet+ */
        @media (min-width: 640px) {
          .word-count-badge {
            display: inline !important;
          }
        }

        /* Chapter Card hover effect */
        .chapter-card:hover {
          border-color: var(--accent-teal) !important;
          box-shadow: 0 8px 24px -4px rgba(0, 158, 176, 0.15) !important;
        }

        /* Smooth scrolling */
        html {
          scroll-behavior: smooth;
        }

        /* Scrollbar styling — use CSS tokens */
        ::-webkit-scrollbar {
          width: 5px;
        }
        ::-webkit-scrollbar-track {
          background: var(--scroll-track);
        }
        ::-webkit-scrollbar-thumb {
          background: var(--scroll-thumb);
          border-radius: 3px;
          opacity: 0.6;
        }

        /* Selection color */
        ::selection {
          background: rgba(0, 158, 176, 0.2);
          color: var(--text-color);
        }
      `}</style>
    </div>
  );
}
