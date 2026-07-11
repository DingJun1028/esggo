/* ============================================================
 *  i18n 引擎 — 繁體中文 / 簡體中文 / 美式英文
 *  策略：
 *   - 繁體(zh-Hant) 為原文基準
 *   - 簡體(zh-Hans) 由繁體經內建 OpenCC 映射自動轉換
 *   - 英文(en) 由 DICT 手譯（靜態 UI 文案；健檢題庫保持原繁中）
 *   - 切換：遍歷 [data-i18n] 元素，以其繁體原文查表
 *   - 動態文字（進度/結果）由專屬 key 處理
 * ============================================================ */
(function () {
  "use strict";

  // ---- 繁 -> 簡 映射表（高頻字，覆蓋本頁用字）----
  var F2S = {
    "課": "课", "程": "程", "資": "资", "訊": "讯", "處": "处", "實": "实", "學": "学",
    "員": "员", "點": "点", "線": "线", "覽": "览", "網": "网", "頁": "页", "際": "际",
    "與": "与", "這": "这", "開": "开", "關": "关", "體": "体", "專": "专", "時": "时",
    "間": "间", "顧": "顾", "問": "问", "項": "项", "對": "对", "話": "话", "題": "题",
    "產": "产", "業": "业", "會": "会", "費": "费", "師": "师", "庫": "库", "據": "据",
    "報": "报", "導": "导", "務": "务", "試": "试", "驗": "验", "證": "证", "書": "书",
    "進": "进", "場": "场", "錄": "录", "劃": "划", "區": "区", "當": "当", "總": "总",
    "給": "给", "進": "进", "雲": "云", "協": "协", "執": "执", "單": "单", "強": "强",
    "說": "说", "們": "们", "來": "来", "將": "将", "從": "从", "認": "认", "設": "设",
    "許": "许", "參": "参", "觀": "观", "諸": "诸", "個": "个", "欄": "栏", "歡": "欢",
    "應": "应", "歷": "历", "經": "经", "圖": "图", "標": "标", "擇": "择", "擬": "拟",
    "製": "制", "勝": "胜", "勢": "势", "團": "团", "隊": "队", "聯": "联", "選": "选",
    "擇": "择", "負": "负", "責": "责", "責": "责", "軍": "军", "農": "农", "動": "动",
    "價": "价", "創": "创", "義": "义", "勞": "劳", "動": "动", "環": "环", "確": "确",
    "號": "号", "碼": "码", "備": "备", "註": "注", "議": "议", "題": "题", "類": "类",
    "輯": "辑", "權": "权", "獎": "奖", "勵": "励", "審": "审", "補": "补", "充": "充",
    "閱": "阅", "讀": "读", "載": "载", "遠": "远", "連": "连", "幫": "帮", "助": "助",
    "簡": "简", "稱": "称", "職": "职", "災": "灾", "監": "监", "獨": "独", "寫": "写",
    "變": "变", "遷": "迁", "氣": "气", "溫": "温", "穩": "稳", "繳": "缴", "繫": "系",
    "統": "统", "納": "纳", "織": "织", "組": "组", "絡": "络", "繩": "绳", "約": "约",
    "細": "细", "終": "终", "結": "结", "構": "构", "測": "测", "評": "评", "賽": "赛",
    "輪": "轮", "轉": "转", "輕": "轻", "輸": "输", "遠": "远", "郵": "邮", "件": "件",
    "評": "评", "論": "论", "隱": "隐", "私": "私", "傳": "传", "輸": "输", "護": "护",
    "術": "术", "雜": "杂", "醫": "医", "療": "疗", "兒": "儿", "頭": "头", "賣": "卖",
    "場": "场", "廣": "广", "東": "东", "語": "语", "話": "话", "講": "讲", "課": "课",
    "該": "该", "詳": "详", "護": "护", "適": "适", "辦": "办", "處": "处", "豐": "丰",
    "監": "监", "視": "视", "頻": "频", "點": "点", "擊": "击", "錯": "错", "誤": "误",
    "預": "预", "約": "约", "顧": "顾", "問": "问", "諮": "咨", "詢": "询", "廳": "厅",
    "櫃": "柜", "檯": "台", "墊": "垫", "獎": "奖", "勵": "励", "綜": "综", "覈": "核",
    "檢": "检", "診": "诊", "斷": "断", "幫": "帮", "鎖": "锁", "鏈": "链", "靈": "灵",
    "灣": "湾", "豐": "丰", "軟": "软", "體": "体", "麥": "麦", "剋": "克", "週": "周",
    "圍": "围", "塊": "块", "壇": "坛", "壞": "坏", "寶": "宝", "導": "导", "層": "层",
    "屬": "属", "數": "数", "據": "据", "遞": "递", "橋": "桥", "機": "机", "關": "关",
    "優": "优", "異": "异", "禮": "礼", "儀": "仪", "繼": "继", "續": "续", "織": "织",
    "習": "习", "慣": "惯", "練": "练", "營": "营", "舊": "旧", "幟": "帜", "幫": "帮",
    "餘": "余", "園": "园", "醫": "医", "礙": "碍", "盡": "尽", "層": "层", "顛": "颠",
    "覆": "覆", "齡": "龄", "雙": "双", "雙": "双", "證": "证", "譽": "誉", "讓": "让",
    "購": "购", "銷": "销", "銀": "银", "門": "门", "間": "间", "閒": "闲", "閉": "闭",
    "開": "开", "闢": "辟", "關": "关", "隨": "随", "隊": "队", "階": "阶", "陸": "陆",
    "際": "际", "離": "离", "難": "难", "電": "电", "腦": "脑", "邏": "逻", "輯": "辑",
    "廠": "厂", "縣": "县", "鄉": "乡", "鎮": "镇", "號": "号", "豐": "丰", "灣": "湾",
    "劃": "划", "則": "则", "別": "别", "劇": "剧", "劍": "剑", "歲": "岁", "縣": "县",
    "廳": "厅", "廚": "厨", "廢": "废", "廟": "庙", "廣": "广", "闊": "阔", "閱": "阅",
    "關": "关", "隴": "陇", "雲": "云", "專": "专", "塊": "块", "聖": "圣", "堅": "坚",
    "賢": "贤", "嘗": "尝", "學": "学", "覺": "觉", "覽": "览", "觀": "观", "親": "亲",
    "雜": "杂", "義": "义", "譯": "译", "識": "识", "讓": "让", "賴": "赖", "贊": "赞",
    "財": "财", "貢": "贡", "貴": "贵", "買": "买", "賣": "卖", "賺": "赚", "贈": "赠",
    "贏": "赢", "讀": "读", "變": "变", "顯": "显", "類": "类", "願": "愿", "顧": "顾",
    "慮": "虑", "攜": "携", "帶": "带", "據": "据", "擊": "击", "權": "权", "歡": "欢",
    "欠": "欠", "決": "决", "況": "况", "凍": "冻", "凈": "净", "淨": "净", "準": "准",
    "凜": "凛", "減": "减", "湊": "凑", "溪": "溪", "滾": "滚", "漲": "涨", "濕": "湿",
    "審": "审", "寶": "宝", "尋": "寻", "對": "对", "導": "导", "層": "层", "屬": "属",
    "幫": "帮", "廣": "广", "廳": "厅", "應": "应", "徵": "征", "態": "态", "戲": "戏",
    "戶": "户", "房": "房", "所": "所", "展": "展", "屆": "届", "山": "山", "歲": "岁",
    "峽": "峡", "嶼": "屿", "州": "州", "巢": "巢", "巖": "岩", "巾": "巾", "市": "市",
    "布": "布", "師": "师", "帳": "帐", "帶": "带", "常": "常", "幅": "幅", "帽": "帽",
    "幀": "帧", "幕": "幕", "幣": "币", "年": "年", "併": "并", "幾": "几", "形": "形",
    "衫": "衫", "參": "参", "須": "须", "耐": "耐", "者": "者", "而": "而", "耕": "耕",
    "耗": "耗", "耳": "耳", "聖": "圣", "聘": "聘", "聚": "聚", "聞": "闻", "聲": "声",
    "聰": "聪", "肅": "肃", "腸": "肠", "腫": "肿", "脫": "脱", "腳": "脚", "腦": "脑",
    "莊": "庄", "處": "处", "虛": "虚", "號": "号", "術": "术", "視": "视", "規": "规",
    "診": "诊", "詞": "词", "評": "评", "證": "证", "譜": "谱", "豐": "丰", "貝": "贝",
    "負": "负", "財": "财", "貢": "贡", "貨": "货", "販": "贩", "貪": "贪", "貧": "贫",
    "貼": "贴", "貴": "贵", "買": "买", "貸": "贷", "費": "费", "資": "资", "賊": "贼",
    "賓": "宾", "賢": "贤", "賣": "卖", "質": "质", "賴": "赖", "贈": "赠", "贊": "赞",
    "轉": "转", "邊": "边", "邏": "逻", "還": "还", "這": "这", "進": "进", "週": "周",
    "遊": "游", "運": "运", "遍": "遍", "過": "过", "道": "道", "達": "达", "違": "违",
    "遠": "远", "適": "适", "選": "选", "遷": "迁", "遺": "遗", "都": "都", "醒": "醒",
    "醫": "医", "採": "采", "釋": "释", "鐵": "铁", "鍊": "炼", "長": "长", "門": "门",
    "閃": "闪", "閉": "闭", "開": "开", "間": "间", "関": "关", "闊": "阔", "阜": "阜",
    "陽": "阳", "陰": "阴", "陳": "陈", "陸": "陆", "陽": "阳", "際": "际", "障": "障",
    "雲": "云", "電": "电", "零": "零", "需要": "需要", "顏": "颜", "題": "题", "類": "类",
    "顯": "显", "風": "风", "飛": "飞", "飼": "饲", "馬": "马", "驗": "验", "髓": "髓",
    "體": "体", "髮": "发", "鬆": "松", "魚": "鱼", "鳥": "鸟", "鹽": "盐", "麥": "麦",
    "麻": "麻", "黃": "黄", "點": "点", "默": "默"
  };

  function toSimplified(s) {
    if (!s) return s;
    var out = "";
    for (var i = 0; i < s.length; i++) {
      var ch = s[i];
      out += F2S[ch] || ch;
    }
    return out;
  }

  // ---- 英文譯表（繁體原文 -> English）靜態 UI 文案 ----
  var EN = {
    "2026 Berkeley國際永續策略人才培訓課程": "2026 Berkeley International Sustainability Strategy Talent Training Program",
    "一站式入口平台｜整合 Berkeley Haas 永續策略創新、TSISDA 與台灣尤努斯基金會在地轉型實務模組，提供學員、TA、導師最完整的線上學習協作網絡。":
      "One-stop portal integrating Berkeley Haas sustainability innovation, TSISDA, and Taiwan Yunus Foundation local transformation modules — the complete online learning collaboration network for students, TAs, and mentors.",
    "進入線上課程": "Enter Online Courses",
    "學員雲端共享": "Student Cloud Share",
    "支援與工具": "Support & Tools",
    "週六主課程 (08:00-12:00)": "Sat Main Course (08:00-12:00)",
    "週日 Consulting Lab": "Sun Consulting Lab",
    "AI 即時同步翻譯": "AI Live Translation",
    "課後 Replay 複習庫": "Post-class Replay Library",
    "雙證資格審查 (出席率 80%)": "Dual-Certificate Review (80% Attendance)",
    "最新公告 (Announcements)": "Latest Announcements",
    "重要行動": "Action Required",
    "[填寫預約表單]": "[Fill Reservation Form]",
    "Consulting Time (週日顧問諮詢時段)": "Consulting Time (Sun Advisory Slot)",
    "填寫 Consulting Time 意願表單": "Fill Consulting Time Preference Form",
    "姓名": "Name",
    "Email": "Email",
    "偏好顧問時段": "Preferred Advisory Slot",
    "請選擇週日 Consulting Lab 時段與組別": "Select Sun Consulting Lab slot & track",
    "A. 轉型實務組": "A. Transformation Practice Track",
    "B. 策略創新組": "B. Strategy Innovation Track",
    "彈性 / 待協調": "Flexible / TBD",
    "備註 / 想討論的主題": "Notes / Topics to discuss",
    "選填：您的產業、關心的 ESG 議題或希望 Mentor 協助的方向": "Optional: your industry, ESG topics of interest, or direction for Mentor support",
    "送出意願": "Submit Preference",
    "系統通知": "System Notice",
    "[權限開通]": "[Access Granted]",
    "2026 學年度線上 Live 教室入口與學員專區 Google Drive 皆已全數部署完畢。請留意您註冊信箱是否收到權限開通邀請。":
      "The 2026 online Live classroom entry and student Google Drive are fully deployed. Check your registered email for the access invitation.",
    "課程資訊大綱": "Course Info Outline",
    "目標：": "Goal: ",
    "合規底盤與創價轉型。": "Compliance foundation & value-creation transformation.",
    "架構：": "Structure: ",
    "6 週 / 72 小時高密度設計。": "6 weeks / 72 hours high-density design.",
    "時程：": "Schedule: ",
    "週六主課　週日顧問諮詢。": "Sat lectures, Sun advisory consulting.",
    "修業：": "Completion: ",
    "出席率 80% 可獲官方雙證書。": "80% attendance earns official dual certificates.",
    "包含重大性分析與數據治理。": "Includes materiality analysis & data governance.",
    "查閱雙軌並列排程": "View Dual-Track Schedule",
    "線上課程大廳": "Online Course Lobby",
    "週六主課程：": "Sat main course: ",
    "線上 Live 學習同步口譯。": "Online Live with simultaneous interpretation.",
    "週日諮詢：": "Sun consulting: ",
    "Mentor Office Hours 輔導。": "Mentor Office Hours coaching.",
    "專題研討：": "Seminars: ",
    "策略創新房 & 轉型實務房。": "Strategy-innovation & transformation-practice rooms.",
    "課堂常規：": "Class norms: ",
    "線上互動、改名與驗證。": "Online interaction, rename & verification.",
    "提供全線上與混合軌道交付彈性。": "Fully online & hybrid delivery flexibility.",
    "進入線上 Live 教室": "Enter Live Classroom",
    "進入 Office-Hour 諮詢室": "Enter Office-Hour Room",
    "學員共享雲端": "Student Shared Cloud",
    "2026 最新官方學員手冊。": "2026 latest official student handbook.",
    "Cohort Summer 通訊名單。": "Cohort Summer mailing list.",
    "開課正式通知與每週提醒信。": "Official opening notice & weekly reminders.",
    "每週課堂精華包與補充閱讀。": "Weekly highlights & supplementary reading.",
    "學員反思筆記與個人矩陣模板。": "Student reflection notes & personal matrix template.",
    "打開學員 Google Drive": "Open Student Google Drive",
    "課堂教材資產": "Course Material Assets",
    "Berkeley 教授簡報原始 PDF。": "Berkeley professors' original slide PDFs.",
    "在地實務模組操作手冊。": "Local practice module manuals.",
    "協作公版素材與簡報框架。": "Collaborative public assets & slide frameworks.",
    "線上課程 / 協作中心虛擬背景。": "Virtual backgrounds for class / collaboration hub.",
    "精選隨堂問答整理與 FAQ 庫。": "Curated Q&A & FAQ library.",
    "進入教材數據資產庫": "Enter Material Asset Library",
    "作業成果提交": "Assignment Submission",
    "每週要求：": "Weekly: ",
    "反思筆記與階段成果。": "Reflection notes & stage deliverables.",
    "最終 Capstone：": "Final Capstone: ",
    "永續執行矩陣。": "Sustainability Execution Matrix.",
    "規格：": "Spec: ",
    "PDF 格式與指定命名原則。": "PDF format & naming convention.",
    "反饋：": "Feedback: ",
    "產學 Mentor 與助教回饋。": "Industry-academic Mentor & TA feedback.",
    "嚴格追蹤各階段截止時間點。": "Strict tracking of stage deadlines.",
    "提交每週矩陣成果": "Submit Weekly Matrix",
    "線上回放複習": "Online Replay Review",
    "週六主課程全程錄影剪輯。": "Full Sat lecture recordings edited.",
    "週日精選諮詢與小組討論存檔。": "Sun curated consulting & group discussion archives.",
    "安全性：": "Security: ",
    "觀看權限與加密密碼。": "Viewing rights & encrypted password.",
    "時效：": "Retention: ",
    "本學年度全程保留回放。": "Replays retained for the full academic year.",
    "課後精簡核心筆記與技術要點。": "Post-class concise core notes & tech highlights.",
    "前往視訊重播資源庫": "Go to Replay Library",
    "技術支援與工具": "Tech Support & Tools",
    "AI 即時同步翻譯工具設定指南。": "AI live translation tool setup guide.",
    "AnyDesk 遠端桌面控制工具下載。": "AnyDesk remote desktop tool download.",
    "隱私傳輸：": "Private transfer: ",
    "企業敏感數據專屬通道。": "Dedicated channel for sensitive corporate data.",
    "遠距連線異常快速排除手冊。": "Remote connection troubleshooting manual.",
    "即時串流與聲音異常排除聯絡。": "Live stream & audio issue escalation contact.",
    "企業高隱私傳輸 (文叔叔)": "Enterprise Private Transfer (Wenshushu)",
    "下載遠端支持工具 (AnyDesk)": "Download Remote Tool (AnyDesk)",
    "TA 助教專區": "TA Assistant Zone",
    "線上課程主持口條、收場引導流程。": "Online hosting script & wrap-up flow.",
    "AI 翻譯平台與錄影權限管理。": "AI translation platform & recording rights mgmt.",
    "助教每週排班、點名與催交規範。": "TA weekly shifts, attendance & chase rules.",
    "行政庶務與突發危機呈報流程。": "Admin chores & crisis escalation flow.",
    "學員永續矩陣作業初審對照表。": "Student matrix first-review checklist.",
    "進入 TA 管理控制台": "Enter TA Console",
    "企業健檢與影響力": "ESG Checkup & Impact",
    "高階企業 ESG 健檢與診斷服務。": "Executive ESG checkup & diagnosis service.",
    "一對一永續轉型顧問客製化建議。": "1-on-1 sustainability transition advisory.",
    "社會影響力專案 (ESG Sunshine) 對接。": "Social impact project (ESG Sunshine) matchmaking.",
    "協助企業梳理產學資源與政府補助。": "Map industry-academic resources & gov grants.",
    "建構企業永續策略藍圖實地延伸。": "Build corporate sustainability blueprint extension.",
    "開始線上 ESG 健檢": "Start Online ESG Checkup",
    "了解 ESG Sunshine 專案": "About ESG Sunshine Project",
    "企業 ESG 線上健檢（3 模組 / 54 題）": "Online Corporate ESG Checkup (3 modules / 54 questions)",
    "依據「永續健檢-合規創價策略藍圖」題庫設計。每題 0–4 分，各模組滿分 72 分。填完即時判讀成熟度，並可預約顧問進一步診斷。":
      "Based on the Sustainability Checkup compliance-value strategy blueprint question bank. 0–4 pts per question, 72 max per module. Instant maturity readout; book an advisor for diagnosis.",
    "① 一般組織基礎": "① General Org Basics",
    "② 創價型 ESG": "② Value-Creating ESG",
    "③ 藍圖準備度": "③ Blueprint Readiness",
    "已答": "Answered",
    "查看健檢結果": "View Checkup Result",
    "清空重填": "Clear & Restart",
    "6週核心培力：雙軌並列排程對照": "6-Week Core Empowerment: Dual-Track Schedule",
    "6週 Lecture Syllabus 主題": "6-Week Lecture Syllabus Topics",
    "6週 Consulting Time 交付成果": "6-Week Consulting Time Deliverables",
    "組織永續戰略挑戰陳述書草案": "Org sustainability challenge statement draft",
    "重大性矩陣與治理擁有者地圖初稿": "Materiality matrix & governance owner map draft",
    "ESG 能力缺口評估與變革準備度盤點": "ESG capability gap & change-readiness inventory",
    "ESG 創新原型概念與循環經濟機會掃描": "ESG innovation prototype & circular-economy scan",
    "導入 Owners / Metrics / Milestones 執行矩陣 V2": "Adoption Owners/Metrics/Milestones matrix V2",
    "最終永續執行矩陣 (Final Matrix) 與溝通計畫": "Final Sustainability Matrix & comms plan",
    "一站式綜效公約：": "One-Stop Synergy Charter: ",
    "本服務中心旨在將「課程入口、線上教學、教材資產、複習錄影、AI 翻譯、成果繳交、TA 營運」整合成互斥且窮盡（MECE）的清晰架構，協助學員高效率將合規指標轉化為企業競爭力。":
      "This service center integrates course entry, online teaching, material assets, replay recordings, AI translation, assignment submission, and TA ops into a mutually-exclusive, collectively-exhaustive (MECE) structure — helping students efficiently convert compliance metrics into corporate competitiveness.",
    "起步期": "Starting",
    "建置期": "Building",
    "管理期": "Managing",
    "策略期": "Strategic",
    "即將開放": "Coming soon",
    "跳至主要內容": "Skip to main content",
    "主要功能": "Main Features"
  };

  var LANGS = ["zh-Hant", "zh-Hans", "en"];
  var LANG_LABEL = { "zh-Hant": "繁", "zh-Hans": "簡", "en": "EN" };

  function getStored() {
    try { return localStorage.getItem("portal_lang") || "zh-Hant"; } catch (e) { return "zh-Hant"; }
  }
  function setStored(l) { try { localStorage.setItem("portal_lang", l); } catch (e) {} }

  function applyLang(lang) {
    var nodes = document.querySelectorAll("[data-i18n]");
    nodes.forEach(function (el) {
      var key = el.getAttribute("data-i18n"); // 繁體基準
      var txt;
      if (lang === "zh-Hant") txt = key;
      else if (lang === "zh-Hans") txt = toSimplified(key);
      else txt = EN[key] || key;
      // 只替換「純文字」元素（無子元素）或 data-i18n-text 標記的
      if (el.dataset.i18nMode === "html") {
        // 保留內部結構：僅替換首文字節點
        replaceFirstText(el, txt);
      } else {
        el.textContent = txt;
      }
    });
    // 動態：進度文字
    var pt = document.getElementById("esgProgressText");
    if (pt) {
      var m = pt.textContent.match(/(\d+)\s*\/\s*(\d+)/);
      if (m) {
        pt.textContent = (lang === "en" ? "Answered " : (lang === "zh-Hans" ? "已答 " : "已答 ")) + m[1] + " / " + m[2];
      }
    }
    // placeholder 屬性
    document.querySelectorAll("[data-i18n-ph]").forEach(function (el) {
      var key = el.getAttribute("data-i18n-ph");
      var v = (lang === "zh-Hant") ? key : (lang === "zh-Hans") ? toSimplified(key) : (EN[key] || key);
      el.setAttribute("placeholder", v);
    });
    // optgroup label
    document.querySelectorAll("[data-i18n-group]").forEach(function (el) {
      var key = el.getAttribute("data-i18n-group");
      var v = (lang === "zh-Hant") ? key : (lang === "zh-Hans") ? toSimplified(key) : (EN[key] || key);
      el.setAttribute("label", v);
    });
    // 刷新動態健檢區（題目/進度/結果）若開啟
    if (window.__esgRefreshLang) { try { window.__esgRefreshLang(); } catch (e) {} }
    document.documentElement.lang = (lang === "en" ? "en" : "zh-Hant");
    // 更新開關 UI
    var btns = document.querySelectorAll(".lang-switch button");
    btns.forEach(function (b) { b.classList.toggle("active", b.dataset.lang === lang); });
    setStored(lang);
  }

  function replaceFirstText(el, txt) {
    // 找第一個文字節點替換（保留 icon 等子元素）
    for (var i = 0; i < el.childNodes.length; i++) {
      if (el.childNodes[i].nodeType === 3) { el.childNodes[i].nodeValue = txt; return; }
    }
    el.insertBefore(document.createTextNode(txt), el.firstChild);
  }

  // 供動態結果區使用
  window.__i18nCurrent = getStored;
  window.__i18nT = function (key, en) {
    var lang = getStored();
    if (lang === "zh-Hant") return key;
    if (lang === "zh-Hans") return toSimplified(key);
    return (en != null ? en : (EN[key] || key));
  };
  window.__i18nLevelEN = { "起步期":"Starting","建置期":"Building","管理期":"Managing","策略期":"Strategic" };

  function init() {
    var bar = document.querySelector(".lang-switch");
    if (!bar) return;
    applyLang(getStored());
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else { init(); }

  // 暴露給開關按鈕
  window.__applyLang = applyLang;
})();
