/* 5T-Traceable: imports below restore the bundle-scope bindings the lifted
 * function body relied on. A/A.jsx = JSX runtime, k = Link, lr = useLanguage,
 * x = React hooks, yr/Ar/kr/wr/M = the shared components. Source bodies are
 * otherwise untouched. */
import * as A from 'react/jsx-runtime'
import { Link as k } from 'react-router-dom'
import { useLanguage as lr } from '../i18n'
import Seo as yr from '../components/Seo'
import Icon as M from '../components/Icon'
import ContactSection as wr from '../components/ContactSection'
import * as x from 'react'

function Tr(){let{t:e}=lr();yr({title:e(`home.h1`)||`ESG 戶外健康旅遊方案`,description:e(`home.metaDesc`),
path:`/`,keywords:[`ESG 旅遊`,`企業員工旅遊`,`團隊日`,`家庭日`,`身心平衡旅程`]});let t=[{title:e(`home.p1Title`),
desc:e(`home.p1Desc`),
link:`/corporate-travel`,img:`/images/corporate-travel/企業員工旅遊-頁首大橫幅.webp`},{title:e(`home.p2Title`),
desc:e(`home.p2Desc`),
link:`/family-day`,img:`/images/family-day/企業家庭日-頁首大橫幅.webp`},{title:e(`home.p3Title`),
desc:e(`home.p3Desc`),
link:`/esg-team-day`,img:`/images/esg-team-day/team-day-頁首大橫幅.webp`},{title:e(`home.p4Title`),
desc:e(`home.p4Desc`),
link:`/wellbeing-retreat`,img:`/images/wellbeing-retreat/員工身心平衡-頁首大橫幅.webp`},{title:e(`home.p5Title`),
desc:e(`home.p5Desc`),
link:`/executive-retreat`,img:`/images/executive-retreat/高階主管共識-頁首橫幅.webp`},{title:e(`home.p6Title`),
desc:e(`home.p6Desc`),
link:`/esg-impact-note`,img:`/images/esg-impact-note/ESG-Impact-Note-頁首大橫幅.webp`}];return
  (0,A.jsxs)(`div`,{children:[
  (0,A.jsxs)(`section`,{className:`relative flex items-center justify-center bg-ftg-forest overflow-hidden min-h-[52vh] sm:min-h-[58vh] md:min-h-[64vh] lg:min-h-[68vh] max-h-[760px] py-16 sm:py-20 md:py-24`,children:[
  (0,A.jsx)(`img`,{src:`/images/hero-banner.webp`,alt:`FTG TOURS 墾趣旅遊 企業員工旅遊戶外旅程橫幅`,className:`absolute inset-0 w-full h-full object-cover`,fetchPriority:`high`,decoding:`async`,loading:`eager`}),

    (0,A.jsx)(`div`,{className:`relative z-10 text-center text-white px-4 max-w-5xl mx-auto`,children:
  (0,A.jsxs)(`div`,{className:`bg-black/25 rounded-2xl px-4 py-6 md:px-8 md:py-8 -m-1 md:-m-2`,children:[
  (0,A.jsx)(`h1`,{className:`text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 font-serif leading-tight text-balance break-words px-2`,children:e(`home.heroTitle`)}),


  (0,A.jsx)(`p`,{className:`text-base md:text-lg lg:text-xl mb-6 md:mb-8 text-gray-100 max-w-3xl mx-auto leading-relaxed`,children:e(`home.heroSub`)}),


  (0,A.jsxs)(`div`,{className:`flex flex-col sm:flex-row gap-3 md:gap-4 justify-center`,children:[
  (0,A.jsx)(k,{to:`/corporate-travel`,className:`bg-ftg-green text-white px-6 py-3 md:px-8 md:py-4 rounded-full font-semibold text-base md:text-lg hover:bg-ftg-forest transition-colors`,children:e(`home.exploreBtn`)}),


  (0,A.jsx)(k,{to:`/journey-design`,className:`bg-white/10 backdrop-blur-sm text-white border-2 border-white px-6 py-3 md:px-8 md:py-4 rounded-full font-semibold text-base md:text-lg hover:bg-white/20 transition-colors`,children:e(`home.designBtn`)})]}),


  (0,A.jsx)(`div`,{className:`mt-6 sm:mt-8 flex flex-wrap justify-center gap-2 sm:gap-3`,children:[1,2,3,4].map(t=>
  (0,A.jsx)(`span`,{className:`px-3 sm:px-4 py-1.5 sm:py-2 bg-white/15 backdrop-blur-sm rounded-full text-xs sm:text-sm font-medium border border-white/20 whitespace-nowrap`,children:e(`home.heroTag${t}`)},t))})]})})]}),


  (0,A.jsx)(`section`,{id:`esg-section`,className:`section-padding bg-white`,children:
  (0,A.jsxs)(`div`,{className:`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`,children:[
  (0,A.jsxs)(`div`,{className:`text-center mb-10 md:mb-16`,children:[
  (0,A.jsx)(`h2`,{className:`section-title`,children:`為什麼是墾趣`}),


  (0,A.jsx)(`p`,{className:`section-subtitle`,children:`五大優勢，讓旅程與眾不同`})]}),


  (0,A.jsx)(`div`,{className:`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8`,children:[{icon:`mountain`,title:`深耕戶外生活的品牌經驗`,desc:`多年戶外導覽與旅遊經營經驗`},{icon:`map`,title:`戶外路線與難度設計`,desc:`依據需求規劃最適合的旅程難度`},{icon:`clipboard`,title:`完整的旅行專業執行`,desc:`合法旅行社、保險、交通一站式`},{icon:`users`,title:`與地方共同完成旅程`,desc:`在地夥伴合作，共創地方價值`},{icon:`sustainable`,title:`讓永續成為旅程中的實際行動`,desc:`ESG Impact Note 成果摘要`}].map((e,t)=>
  (0,A.jsxs)(`div`,{className:`text-center`,children:[
  (0,A.jsx)(`div`,{className:`w-16 h-16 mx-auto mb-4 rounded-full bg-ftg-green/10 flex items-center justify-center`,children:
  (0,A.jsx)(M,{name:e.icon,size:32,className:`text-ftg-green`})}),


  (0,A.jsx)(`h3`,{className:`font-bold text-ftg-forest mb-2 text-sm`,children:e.title}),


  (0,A.jsx)(`p`,{className:`text-gray-600 text-xs`,children:e.desc})]},t))})]})}),


  (0,A.jsx)(`section`,{id:`esg-section`,className:`section-padding bg-ftg-sand`,children:
  (0,A.jsxs)(`div`,{className:`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`,children:[
  (0,A.jsxs)(`div`,{className:`text-center mb-10 md:mb-16`,children:[
  (0,A.jsx)(`h2`,{className:`section-title`,children:e(`home.valuesTitle`)}),


  (0,A.jsx)(`p`,{className:`section-subtitle`,children:e(`home.valuesSub`)})]}),


  (0,A.jsxs)(`div`,{className:`grid grid-cols-1 md:grid-cols-3 gap-8`,children:[
  (0,A.jsxs)(`div`,{className:`bg-white rounded-2xl p-8 shadow-lg`,children:[
  (0,A.jsx)(`div`,{className:`w-16 h-16 bg-ftg-green/10 rounded-full flex items-center justify-center mb-6`,children:
  (0,A.jsx)(M,{name:`leaf`,size:32,className:`text-ftg-green`})}),


  (0,A.jsx)(`h3`,{className:`text-2xl font-bold text-ftg-forest mb-4`,children:e(`home.v1Title`)}),


  (0,A.jsx)(`p`,{className:`text-gray-600 leading-relaxed`,children:e(`home.v1Desc`)})]}),


  (0,A.jsxs)(`div`,{className:`bg-white rounded-2xl p-8 shadow-lg`,children:[
  (0,A.jsx)(`div`,{className:`w-16 h-16 bg-ftg-green/10 rounded-full flex items-center justify-center mb-6`,children:
  (0,A.jsx)(M,{name:`users`,size:32,className:`text-ftg-green`})}),


  (0,A.jsx)(`h3`,{className:`text-2xl font-bold text-ftg-forest mb-4`,children:e(`home.v2Title`)}),


  (0,A.jsx)(`p`,{className:`text-gray-600 leading-relaxed`,children:e(`home.v2Desc`)})]}),


  (0,A.jsxs)(`div`,{className:`bg-white rounded-2xl p-8 shadow-lg`,children:[
  (0,A.jsx)(`div`,{className:`w-16 h-16 bg-ftg-green/10 rounded-full flex items-center justify-center mb-6`,children:
  (0,A.jsx)(M,{name:`heart`,size:32,className:`text-ftg-green`})}),


  (0,A.jsx)(`h3`,{className:`text-2xl font-bold text-ftg-forest mb-4`,children:e(`home.v3Title`)}),


  (0,A.jsx)(`p`,{className:`text-gray-600 leading-relaxed`,children:e(`home.v3Desc`)})]})]})]})}),


  (0,A.jsx)(`section`,{className:`section-padding bg-white`,children:
  (0,A.jsxs)(`div`,{className:`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`,children:[
  (0,A.jsxs)(`div`,{className:`text-center mb-10 md:mb-16`,children:[
  (0,A.jsx)(`h2`,{className:`section-title`,children:e(`home.featuresTitle`)}),


  (0,A.jsx)(`p`,{className:`section-subtitle`,children:`五大特色，讓旅程與眾不同`})]}),


  (0,A.jsx)(`div`,{className:`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6`,children:[{icon:`leaf`,title:`自然慢行`,desc:`大自然是最好的教室`},{icon:`utensils`,title:`地方餐食`,desc:`品嚐在地好味`},{icon:`users`,title:`親子共學`,desc:`寓教於樂`},{icon:`star`,title:`團隊互動`,desc:`互動遊戲分組競賽`},{icon:`sustainable`,title:`永續行動`,desc:`親近淨山淨灘`}].map((e,t)=>
  (0,A.jsxs)(`div`,{className:`text-center p-6 rounded-2xl bg-ftg-sand hover:shadow-lg transition-shadow`,children:[
  (0,A.jsx)(`div`,{className:`w-14 h-14 mx-auto mb-4 rounded-full bg-ftg-green/10 flex items-center justify-center`,children:
  (0,A.jsx)(M,{name:e.icon,size:28,className:`text-ftg-green`})}),


  (0,A.jsx)(`h3`,{className:`font-bold text-ftg-forest mb-2 text-sm`,children:e.title}),


  (0,A.jsx)(`p`,{className:`text-gray-600 text-xs`,children:e.desc})]},t))})]})}),


  (0,A.jsx)(`section`,{className:`section-padding bg-ftg-sand`,children:
  (0,A.jsxs)(`div`,{className:`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`,children:[
  (0,A.jsxs)(`div`,{className:`text-center mb-10 md:mb-16`,children:[
  (0,A.jsx)(`h2`,{className:`section-title`,children:e(`home.processTitle`)}),


  (0,A.jsx)(`p`,{className:`section-subtitle`,children:`五步驟，讓企業旅程更完整`})]}),


  (0,A.jsx)(`div`,{className:`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6`,children:[{icon:`users`,title:`需求了解與策略設計`,desc:`了解企業文化、目標與期待`},{icon:`link`,title:`在地資源與專業整合`,desc:`在地資源與專業整合`},{icon:`shield`,title:`安全與風險管理`,desc:`安全與風險管理`},{icon:`heart`,title:`暖心關懷與細節管理`,desc:`暖心關懷與細節管理`},{icon:`star`,title:`成效追蹤與後續鏈接`,desc:`成效追蹤與後續鏈接`}].map((e,t)=>
  (0,A.jsxs)(`div`,{className:`text-center`,children:[
  (0,A.jsx)(`div`,{className:`w-14 h-14 mx-auto mb-4 rounded-full bg-ftg-green text-white flex items-center justify-center shadow-lg`,children:
  (0,A.jsx)(M,{name:e.icon,size:24,className:`text-white`})}),


  (0,A.jsx)(`div`,{className:`w-8 h-8 mx-auto mb-2 rounded-full bg-ftg-forest text-white flex items-center justify-center text-xs font-bold`,children:t+1}),


  (0,A.jsx)(`h3`,{className:`font-bold text-ftg-forest mb-2 text-sm`,children:e.title}),


  (0,A.jsx)(`p`,{className:`text-gray-600 text-xs`,children:e.desc})]},t))})]})}),


  (0,A.jsx)(`section`,{className:`section-padding bg-white`,children:
  (0,A.jsxs)(`div`,{className:`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`,children:[
  (0,A.jsxs)(`div`,{className:`text-center mb-10 md:mb-16`,children:[
  (0,A.jsx)(`h2`,{className:`section-title`,children:e(`home.productsTitle`)}),


  (0,A.jsx)(`p`,{className:`section-subtitle`,children:e(`home.productsSub`)})]}),


  (0,A.jsx)(`div`,{className:`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`,children:t.map((t,n)=>
  (0,A.jsxs)(k,{to:t.link,className:`group bg-ftg-cream rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300`,children:[
  (0,A.jsx)(`div`,{className:`aspect-[16/9] overflow-hidden`,children:
  (0,A.jsx)(`img`,{src:t.img,alt:t.title,className:`w-full h-full object-cover transition-transform group-hover:scale-105`,loading:`lazy`})}),


  (0,A.jsxs)(`div`,{className:`p-6`,children:[
  (0,A.jsx)(`div`,{className:`flex items-center justify-center w-10 h-10 bg-ftg-green text-white rounded-full font-bold text-sm mb-3 group-hover:scale-110 transition-transform`,children:n+1}),


  (0,A.jsx)(`h3`,{className:`text-xl font-bold text-ftg-forest mb-2`,children:t.title}),


  (0,A.jsx)(`p`,{className:`text-gray-600 text-sm mb-4 leading-relaxed`,children:t.desc}),


  (0,A.jsxs)(`span`,{className:`text-ftg-green font-semibold flex items-center text-sm group-hover:translate-x-2 transition-transform`,children:[e(`home.learnMore`),

  (0,A.jsx)(`svg`,{className:`ml-1 h-4 w-4`,fill:`none`,stroke:`currentColor`,viewBox:`0 0 24 24`,children:
  (0,A.jsx)(`path`,{strokeLinecap:`round`,strokeLinejoin:`round`,strokeWidth:2,d:`M9 5l7 7-7 7`})})]})]})]},n))})]})}),


  (0,A.jsx)(`section`,{className:`section-padding bg-ftg-sand`,children:
  (0,A.jsxs)(`div`,{className:`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`,children:[
  (0,A.jsxs)(`div`,{className:`text-center mb-10 md:mb-16`,children:[
  (0,A.jsx)(`h2`,{className:`section-title`,children:`適合這些企業時刻`}),


  (0,A.jsx)(`p`,{className:`section-subtitle`,children:`五個常見的企業情境`})]}),


  (0,A.jsx)(`div`,{className:`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6`,children:[{icon:`sun`,title:`年度員工旅遊`},{icon:`users`,title:`家庭日`},{icon:`star`,title:`部門同樂`},{icon:`heart`,title:`身心平衡與福利活動`},{icon:`award`,title:`高階主管共識鏈接`}].map((e,t)=>
  (0,A.jsxs)(`div`,{className:`text-center p-6 rounded-2xl bg-white hover:shadow-lg transition-shadow`,children:[
  (0,A.jsx)(`div`,{className:`w-14 h-14 mx-auto mb-4 rounded-full bg-ftg-green/10 flex items-center justify-center`,children:
  (0,A.jsx)(M,{name:e.icon,size:28,className:`text-ftg-green`})}),


  (0,A.jsx)(`h3`,{className:`font-bold text-ftg-forest text-sm`,children:e.title})]},t))})]})}),


  (0,A.jsx)(`section`,{className:`section-padding bg-white`,children:
  (0,A.jsxs)(`div`,{className:`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`,children:[
  (0,A.jsxs)(`div`,{className:`text-center mb-10 md:mb-16`,children:[
  (0,A.jsx)(`h2`,{className:`section-title`,children:`從需求到成行，墾趣陪你一起完成`}),


  (0,A.jsx)(`p`,{className:`section-subtitle`,children:`五個步驟，從需求到完成`})]}),


  (0,A.jsx)(`div`,{className:`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6`,children:[{icon:`compass`,title:`需求了解與諮詢`,desc:`深入了解企業需求`},{icon:`map`,title:`行程提案與精選`,desc:`依需求精選行程`},{icon:`users`,title:`細節規劃與確認`,desc:`細節規劃與確認`},{icon:`navigation`,title:`安心出遊與執行`,desc:`安心出遊與執行`},{icon:`clipboard`,title:`成果整理與延伸`,desc:`成果整理與延伸`}].map((e,t)=>
  (0,A.jsxs)(`div`,{className:`text-center`,children:[
  (0,A.jsx)(`div`,{className:`w-14 h-14 mx-auto mb-4 rounded-full bg-ftg-green text-white flex items-center justify-center shadow-lg`,children:
  (0,A.jsx)(M,{name:e.icon,size:24,className:`text-white`})}),


  (0,A.jsx)(`div`,{className:`w-8 h-8 mx-auto mb-2 rounded-full bg-ftg-forest text-white flex items-center justify-center text-xs font-bold`,children:t+1}),


  (0,A.jsx)(`h3`,{className:`font-bold text-ftg-forest mb-2 text-sm`,children:e.title}),


  (0,A.jsx)(`p`,{className:`text-gray-600 text-xs`,children:e.desc})]},t))})]})}),


  (0,A.jsx)(`section`,{className:`section-padding bg-ftg-sand`,children:
  (0,A.jsxs)(`div`,{className:`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`,children:[
  (0,A.jsxs)(`div`,{className:`text-center mb-10 md:mb-16`,children:[
  (0,A.jsx)(`h2`,{className:`section-title`,children:e(`home.safetyTitle`)}),


  (0,A.jsx)(`p`,{className:`section-subtitle`,children:`六大安全保障，放心走進自然`})]}),


  (0,A.jsx)(`div`,{className:`grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6`,children:[{icon:`heart`,title:`安全第一`},{icon:`navigation`,title:`交通報險安排`},{icon:`shield`,title:`旅遊保險完善`},{icon:`award`,title:`戶外專業帶領`},{icon:`users`,title:`在地夥伴合作`},{icon:`leaf`,title:`ESG Impact Note`}].map((e,t)=>
  (0,A.jsxs)(`div`,{className:`text-center p-4`,children:[
  (0,A.jsx)(`div`,{className:`w-12 h-12 mx-auto mb-3 rounded-full bg-ftg-green/10 flex items-center justify-center`,children:
  (0,A.jsx)(M,{name:e.icon,size:24,className:`text-ftg-green`})}),


  (0,A.jsx)(`p`,{className:`text-sm font-medium text-ftg-forest`,children:e.title})]},t))})]})}),


  (0,A.jsx)(`section`,{className:`section-padding bg-white`,children:
  (0,A.jsxs)(`div`,{className:`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`,children:[
  (0,A.jsxs)(`div`,{className:`text-center mb-10 md:mb-16`,children:[
  (0,A.jsx)(`h2`,{className:`section-title`,children:`讓旅程留下值得分享的成果`}),


  (0,A.jsx)(`p`,{className:`section-subtitle`,children:`三種成果延伸`})]}),


  (0,A.jsx)(`div`,{className:`grid grid-cols-1 sm:grid-cols-3 gap-6`,children:[{title:`ESG Impact Note`,desc:`彙整旅程亮點`},{title:`年度活動規劃`,desc:`整合年度旅遊活動`},{title:`新聞報導與資源整合`,desc:`提供 ESG 題材`}].map((e,t)=>
  (0,A.jsxs)(`div`,{className:`bg-ftg-sand rounded-2xl p-6 hover:shadow-lg transition-shadow`,children:[
  (0,A.jsx)(`h3`,{className:`font-bold text-ftg-forest mb-2`,children:e.title}),


  (0,A.jsx)(`p`,{className:`text-gray-600 text-sm`,children:e.desc})]},t))})]})}),


  (0,A.jsx)(`section`,{className:`py-20 bg-ftg-forest text-white`,children:
  (0,A.jsx)(`div`,{className:`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`,children:
  (0,A.jsx)(`div`,{className:`max-w-3xl mx-auto`,children:
  (0,A.jsx)(wr,{ctaTitle:e(`home.ctaTitle`),
ctaSub:e(`home.ctaSub`),
features:[e(`home.ctaFeature1`),
e(`home.ctaFeature2`),
e(`home.ctaFeature3`)]})})})})]})}

export default Tr;
