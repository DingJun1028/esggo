import { useLanguage } from '../../i18n/LanguageContext';
import { usePageSeo } from '../../utils/seo';
import { streams, streamsPage, pickLang, pickDesc } from '../../data/streamsData';
import FTGIcon from '../../components/FTGIcon';

export default function Streams() {
  const { lang } = useLanguage();
  const en = lang === 'en';

  usePageSeo({
    // usePageSeo 會自動補上 ` | ${BRAND}`（見 utils/seo.js:16），
    // 這裡再自行加一次會變成 "X | FTG TOURS | FTG TOURS 墾趣旅遊"。
    title: en ? streamsPage.titleEn : streamsPage.title,
    description: en ? streamsPage.metaDescEn : streamsPage.metaDesc,
    path: '/streams',
    keywords: en ? streamsPage.keywordsEn : streamsPage.keywords,
  });

  return (
    <div className="min-h-screen pt-20 bg-ftg-deepgreen text-ftg-cream">
      {/* Hero */}
      <section className="py-16 px-4 text-center">
        <h1 className="text-4xl font-bold text-ftg-cream text-balance">
          {/* 中文頁並列中英，英文頁不重複顯示 "Six Streams / Six Streams"。
              text-balance 避免手機版把 "Streams" 孤零零丟到第二行。 */}
          {en ? streamsPage.titleEn : `${streamsPage.title} / ${streamsPage.titleEn}`}
        </h1>
        <p className="mt-4 text-lg text-ftg-cream max-w-3xl mx-auto text-balance">
          {en ? streamsPage.subPrefixEn : streamsPage.subPrefix}
          {streams.map((s, i) => (
            <span key={s.id}>
              <span className="whitespace-nowrap">{pickLang(s, lang)}</span>
              {i < streams.length - 1 ? (en ? streamsPage.sepEn : streamsPage.sep) : null}
            </span>
          ))}
        </p>
      </section>

      {/* 六流卡片 (P-type) */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {streams.map((s) => (
            <div
              key={s.id}
              className="bg-ftg-forest rounded-xl p-6 text-center shadow-lg transition-all hover:scale-105"
            >
              <div
                className="w-14 h-14 rounded-full bg-ftg-cream/10 flex items-center justify-center mx-auto mb-4 text-ftg-cream"
                aria-hidden="true"
              >
                <FTGIcon name={s.icon} size={28} />
              </div>
              <h3 className="text-xl font-bold mb-2 text-ftg-cream">
                {pickLang(s, lang)}
              </h3>
              <p className="text-sm text-ftg-cream">{pickDesc(s, lang)}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
