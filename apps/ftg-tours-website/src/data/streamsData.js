// 六流體系資料 —— 本檔為文案的唯一真實來源 (SSOT)
//
// 5T-Transparent: 刻意不放進 src/i18n/translations.js。
// 這個 repo 其他頁面用 t('wellbeing.xxx')，但那成立的前提是「文案只存在
// translations.js 一處」。六流的文案本來就以 title/titleEn 成對存在本檔，
// 若再複製一份進 translations.js，就會產生兩個真實來源 —— 正是本季修掉
// 的 no-dupe-key 靜默覆蓋同一類風險（改了一處、忘了另一處，譯文默默不同步）。
// 因此這裡以 lang 欄位直接選字串，不做第二次複製。
//
// 每流皆包含: id, icon (FTGIcon 名稱), title/desc (zh) + titleEn/descEn (en)

export const streamsPage = {
  title: '六流體系',
  titleEn: 'Six Streams',
  // 副標題刻意拆成「前綴 + 由 streams 陣列組裝」，不寫成一整行字串。
  // 原因：整行字串在手機 390px 下會在「覺曉」「凝聚」等專有名詞中間斷行
  // （實測斷成「…循環：覺」/「曉 • 凝聚…」），中文排版視為缺陷。
  // 由陣列組裝並對每個名稱加 whitespace-nowrap，兩個問題一起消失，
  // 而且名稱只有一份真實來源，不會與 streams[].title 漂移。
  subPrefix: '墾趣永續旅程設計哲學 — 六流循環：',
  subPrefixEn: 'FTG sustainable journey design — six streams in cycle: ',
  sep: ' • ',
  sepEn: ' · ',
  metaDesc:
    '墾趣以六流體系設計企業永續旅程：覺曉流凝聚 ESG 共識，復元流照顧員工身心，共好流連結家庭與地方',
  metaDescEn:
    'FTG designs corporate sustainability journeys with six streams: awareness builds ESG consensus, restoration supports employee wellbeing, mutuality connects families and local communities.',
  keywords: ['六流體系', '永續旅程設計', 'ESG 戶外', '企業永續', '團隊共識'],
  keywordsEn: ['six streams', 'sustainable journey design', 'ESG outdoor', 'corporate sustainability', 'team consensus'],
};

export const streams = [
  { id: 'awareness', icon: 'leaf', title: '覺曉流', desc: 'ESG 戶外團隊日', titleEn: 'Awareness Stream', descEn: 'ESG Outdoor Team Day' },
  { id: 'cohesion', icon: 'users', title: '凝聚流', desc: '高階主管共識營', titleEn: 'Cohesion Stream', descEn: 'Executive Consensus Retreat' },
  { id: 'restoration', icon: 'tree', title: '復元流', desc: '員工身心平衡', titleEn: 'Restoration Stream', descEn: 'Employee Wellbeing Program' },
  { id: 'mutuality', icon: 'users', title: '共好流', desc: '企業家庭日', titleEn: 'Mutuality Stream', descEn: 'Corporate Family Day' },
  { id: 'memorial', icon: 'clipboard', title: '留念流', desc: 'ESG Impact Note', titleEn: 'Memorial Stream', descEn: 'ESG Impact Documentation' },
  { id: 'foundation', icon: 'mountain', title: '基礎流', desc: '企業員工旅遊', titleEn: 'Foundation Stream', descEn: 'Team Travel Program' },
];

/** 依語言取出該流的中/英文欄位。 */
export const pickLang = (item, lang) => (lang === 'en' ? item.titleEn : item.title);
export const pickDesc = (item, lang) => (lang === 'en' ? item.descEn : item.desc);

// P-type: 單一頁面布局 (6 卡片 + 流動關係圖)
export const streamsLayout = {
  type: 'p-type', // single page
  cardsPerRow: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8',
  diagram: 'flex flex-wrap justify-center items-center gap-4',
};
