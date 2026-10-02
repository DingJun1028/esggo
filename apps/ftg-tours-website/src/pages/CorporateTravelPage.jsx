/* 5T-Traceable: imports below restore the bundle-scope bindings the lifted
 * function body relied on. A/A.jsx = JSX runtime, k = Link, lr = useLanguage,
 * x = React hooks, yr/Ar/kr/wr/M = the shared components. Source bodies are
 * otherwise untouched. */
import * as A from 'react/jsx-runtime'
import { Link as k } from 'react-router-dom'
import { useLanguage as lr } from '../i18n'
import { default as yr } from '../components/Seo'
import { default as M } from '../components/Icon'
import { default as Ar } from '../components/FeatureCard'
import { default as kr } from '../components/PhotoCard'
import { default as wr } from '../components/ContactSection'
import { DATA_Dr as Dr } from '../data/siteData'

function jr(){let{t:e}=lr();yr({title:e(`products.corpTravel`),
description:e(`corporateTravel.metaDesc`),
path:`/corporate-travel`,keywords:[`企業員工旅遊`,`Team Building`,`戶外體驗`,`ESG 活動`,`公司旅遊`]});let t=[{icon:`compass`,title:e(`corporateTravel.design1Title`),
desc:e(`corporateTravel.design1Desc`)},{icon:`mountain`,title:e(`corporateTravel.design2Title`),
desc:e(`corporateTravel.design2Desc`)},{icon:`utensils`,title:e(`corporateTravel.design3Title`),
desc:e(`corporateTravel.design3Desc`)},{icon:`leaf`,title:e(`corporateTravel.design4Title`),
desc:e(`corporateTravel.design4Desc`)},{icon:`sun`,title:e(`corporateTravel.design5Title`),
desc:e(`corporateTravel.design5Desc`)},{icon:`users`,title:e(`corporateTravel.design6Title`),
desc:e(`corporateTravel.design6Desc`)}],n=[{icon:`calendar`,title:e(`corporateTravel.target1Title`),
desc:e(`corporateTravel.target1Desc`)},{icon:`users`,title:e(`corporateTravel.target2Title`),
desc:e(`corporateTravel.target2Desc`)},{icon:`gift`,title:e(`corporateTravel.target3Title`),
desc:e(`corporateTravel.target3Desc`)},{icon:`leaf`,title:e(`corporateTravel.target4Title`),
desc:e(`corporateTravel.target4Desc`)},{icon:`link`,title:e(`corporateTravel.target5Title`),
desc:e(`corporateTravel.target5Desc`)}],r=[{title:e(`corporateTravel.leave1Title`),
desc:e(`corporateTravel.leave1Desc`)},{title:e(`corporateTravel.leave2Title`),
desc:e(`corporateTravel.leave2Desc`)},{title:e(`corporateTravel.leave3Title`),
desc:e(`corporateTravel.leave3Desc`)},{title:e(`corporateTravel.leave4Title`),
desc:e(`corporateTravel.leave4Desc`)},{title:e(`corporateTravel.leave5Title`),
desc:e(`corporateTravel.leave5Desc`)}],i=[{title:e(`corporateTravel.process1Title`),
desc:e(`corporateTravel.process1Desc`)},{title:e(`corporateTravel.process2Title`),
desc:e(`corporateTravel.process2Desc`)},{title:e(`corporateTravel.process3Title`),
desc:e(`corporateTravel.process3Desc`)},{title:e(`corporateTravel.process4Title`),
desc:e(`corporateTravel.process4Desc`)},{title:e(`corporateTravel.process5Title`),
desc:e(`corporateTravel.process5Desc`)}],a=[{icon:`shield`,title:e(`corporateTravel.safety1Title`),
desc:e(`corporateTravel.safety1Desc`)},{icon:`navigation`,title:e(`corporateTravel.safety2Title`),
desc:e(`corporateTravel.safety2Desc`)},{icon:`compass`,title:e(`corporateTravel.safety3Title`),
desc:e(`corporateTravel.safety3Desc`)},{icon:`award`,title:e(`corporateTravel.safety4Title`),
desc:e(`corporateTravel.safety4Desc`)},{icon:`users`,title:e(`corporateTravel.safety5Title`),
desc:e(`corporateTravel.safety5Desc`)}],o=Dr,s=[e(`corporateTravel.ctaFeature1`),
e(`corporateTravel.ctaFeature2`),
e(`corporateTravel.ctaFeature3`),
e(`corporateTravel.ctaFeature4`)];return
  (0,A.jsxs)(`div`,{children:[
  (0,A.jsxs)(`section`,{className:`subpage-hero`,children:[
  (0,A.jsx)(`img`,{src:`/images/corporate-travel/企業員工旅遊-頁首大橫幅.webp`,alt:e(`products.corpTravel`),
className:`subpage-hero__img`,loading:`lazy`}),


  (0,A.jsx)(`div`,{className:`subpage-hero__overlay`}),


  (0,A.jsx)(`div`,{className:`subpage-hero__dim`}),


  (0,A.jsxs)(`div`,{className:`subpage-hero__content`,children:[
  (0,A.jsx)(k,{to:`/`,className:`text-ftg-orange hover:underline mb-3 md:mb-4 inline-block font-medium text-sm md:text-base inline-flex items-center min-h-[44px] min-w-[44px] -my-2`,children:e(`nav.backHome`)}),


  (0,A.jsx)(`h1`,{className:`subpage-hero__title`,children:e(`products.corpTravel`)}),


  (0,A.jsx)(`p`,{className:`subpage-hero__subtitle`,children:e(`corporateTravel.sub`)})]})]}),


  (0,A.jsx)(`section`,{className:`section-padding px-4`,children:
  (0,A.jsxs)(`div`,{className:`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`,children:[
  (0,A.jsx)(`h2`,{className:`text-2xl md:text-3xl font-bold text-ftg-forest mb-5 md:mb-8 text-center`,children:e(`corporateTravel.benefitsTitle`)}),


  (0,A.jsx)(`div`,{className:`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-12 md:mb-16`,children:Er.map((t,n)=>
  (0,A.jsx)(kr,{src:t.src,title:e(t.tKey),
desc:e(t.tKey+`Desc`)},n))}),


  (0,A.jsx)(`h2`,{className:`text-2xl md:text-3xl font-bold text-ftg-forest mb-5 md:mb-8 text-center`,children:e(`corporateTravel.designTitle`)}),


  (0,A.jsx)(`div`,{className:`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-12 md:mb-16`,children:t.map((e,t)=>
  (0,A.jsx)(Ar,{icon:e.icon,title:e.title,desc:e.desc},t))}),


  (0,A.jsx)(`h2`,{className:`text-2xl md:text-3xl font-bold text-ftg-forest mb-5 md:mb-8 text-center`,children:e(`corporateTravel.targetTitle`)}),


  (0,A.jsx)(`div`,{className:`grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6 mb-12 md:mb-16`,children:n.map((e,t)=>
  (0,A.jsx)(Ar,{icon:e.icon,title:e.title,desc:e.desc},t))}),


  (0,A.jsx)(`h2`,{className:`text-2xl md:text-3xl font-bold text-ftg-forest mb-5 md:mb-8 text-center`,children:e(`corporateTravel.journeyTitle`)}),


  (0,A.jsx)(`div`,{className:`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-12 md:mb-16`,children:Or.map((t,n)=>
  (0,A.jsx)(kr,{src:t.src,title:e(t.tKey),
desc:e(t.tKey+`Desc`)},n))}),


  (0,A.jsx)(`h2`,{className:`text-2xl md:text-3xl font-bold text-ftg-forest mb-5 md:mb-8 text-center`,children:e(`corporateTravel.leaveTitle`)}),


  (0,A.jsx)(`div`,{className:`grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6 mb-12 md:mb-16`,children:r.map((e,t)=>
  (0,A.jsxs)(`div`,{className:`bg-ftg-cream border border-gray-100 rounded-2xl card-responsive hover:shadow-lg transition-shadow`,children:[
  (0,A.jsx)(`h3`,{className:`text-base md:text-lg font-bold text-ftg-forest mb-2`,children:e.title}),


  (0,A.jsx)(`p`,{className:`text-gray-600 text-xs md:text-sm leading-relaxed`,children:e.desc})]},t))}),


  (0,A.jsx)(`h2`,{className:`text-2xl md:text-3xl font-bold text-ftg-forest mb-5 md:mb-8 text-center`,children:e(`corporateTravel.processTitle`)}),


  (0,A.jsx)(`div`,{className:`grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6 mb-12 md:mb-16`,children:i.map((e,t)=>
  (0,A.jsxs)(`div`,{className:`bg-white border border-gray-200 rounded-2xl card-responsive text-center hover:shadow-lg transition-shadow`,children:[
  (0,A.jsx)(`div`,{className:`w-10 h-10 md:w-12 md:h-12 bg-ftg-green text-white rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4 text-lg md:text-xl font-bold`,children:t+1}),


  (0,A.jsx)(`h3`,{className:`text-base md:text-lg font-bold text-ftg-forest mb-2`,children:e.title}),


  (0,A.jsx)(`p`,{className:`text-gray-600 text-xs md:text-sm leading-relaxed`,children:e.desc})]},t))}),


  (0,A.jsx)(`h2`,{className:`text-2xl md:text-3xl font-bold text-ftg-forest mb-5 md:mb-8 text-center`,children:e(`corporateTravel.safetyTitle`)}),


  (0,A.jsx)(`div`,{className:`grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6 mb-12 md:mb-16`,children:a.map((e,t)=>
  (0,A.jsxs)(`div`,{className:`bg-white border border-gray-200 rounded-2xl card-responsive text-center hover:shadow-lg transition-shadow`,children:[
  (0,A.jsx)(`div`,{className:`w-12 h-12 md:w-14 md:h-14 bg-ftg-green/10 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4`,children:
  (0,A.jsx)(M,{name:e.icon,size:28,className:`text-ftg-green`})}),


  (0,A.jsx)(`h3`,{className:`text-base md:text-lg font-bold text-ftg-forest mb-2`,children:e.title}),


  (0,A.jsx)(`p`,{className:`text-gray-600 text-xs md:text-sm leading-relaxed`,children:e.desc})]},t))}),


  (0,A.jsx)(`h2`,{className:`text-2xl md:text-3xl font-bold text-ftg-forest mb-5 md:mb-8 text-center`,children:e(`corporateTravel.valueAddTitle`)}),


  (0,A.jsx)(`div`,{className:`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-12 md:mb-16`,children:o.map((t,n)=>
  (0,A.jsx)(kr,{src:t.src,title:e(t.tKey),
desc:e(t.tKey+`Desc`)},n))}),


  (0,A.jsx)(wr,{ctaTitle:e(`corporateTravel.ctaBlockTitle`),
ctaSub:e(`corporateTravel.ctaBlockSub`),
features:s})]})})]})}

export default jr;
