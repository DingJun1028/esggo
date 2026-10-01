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

function ki(){let{t:e}=lr();yr({title:e(`products.impactNote`),
description:e(`impactNote.metaDesc`),
path:`/esg-impact-note`,keywords:[`ESG Impact Note`,`活動成果`,`雇主品牌`,`永續溝通`,`ESG 素材`]});let t=[1,2,3].map(t=>({src:wi[t-1].src,title:e(`impactNote.benefit${t}Title`),
desc:e(`impactNote.benefit${t}Desc`)})),
n=[`compass`,`puzzle`,`clipboard`,`pencil`,`refresh`,`star`],r=[1,2,3,4,5,6].map(t=>({icon:n[t-1],title:e(`impactNote.design${t}Title`),
desc:e(`impactNote.design${t}Desc`)})),
i=[`clipboard`,`tag`,`users`,`folder`,`users`],a=[1,2,3,4,5].map(t=>({icon:i[t-1],title:e(`impactNote.target${t}Title`),
desc:e(`impactNote.target${t}Desc`)})),
o=[1,2,3,4,5].map(t=>({title:e(`impactNote.leave${t}Title`),
desc:e(`impactNote.leave${t}Desc`)})),
s=[1,2,3,4,5].map(t=>({title:e(`impactNote.process${t}Title`),
desc:e(`impactNote.process${t}Desc`)})),
c=[`users`,`check`,`clipboard`,`shield`,`safety`],l=[1,2,3,4,5].map(t=>({icon:c[t-1],title:e(`impactNote.safety${t}Title`),
desc:e(`impactNote.safety${t}Desc`)})),
u=[`compass`,`star`,`calendar`,`tool`],d=[1,2,3,4].map(t=>({icon:u[t-1],title:e(`impactNote.valueAdd${t}Title`),
desc:e(`impactNote.valueAdd${t}Desc`)})),
f=[1,2,3,4].map(t=>e(`impactNote.ctaFeature${t}`));return
  (0,A.jsxs)(`div`,{children:[
  (0,A.jsxs)(`section`,{className:`subpage-hero`,children:[
  (0,A.jsx)(`img`,{src:`/images/esg-impact-note/ESG-Impact-Note-頁首大橫幅.webp`,alt:e(`products.impactNote`),
className:`subpage-hero__img`,loading:`lazy`}),


  (0,A.jsx)(`div`,{className:`subpage-hero__overlay`}),


  (0,A.jsx)(`div`,{className:`subpage-hero__dim`}),


  (0,A.jsxs)(`div`,{className:`subpage-hero__content`,children:[
  (0,A.jsx)(k,{to:`/`,className:`text-ftg-orange hover:underline mb-3 sm:mb-4 inline-block font-medium inline-flex items-center min-h-[44px] min-w-[44px] -my-2`,children:e(`nav.backHome`)}),


  (0,A.jsx)(`h1`,{className:`subpage-hero__title`,children:e(`products.impactNote`)}),


  (0,A.jsx)(`p`,{className:`subpage-hero__subtitle`,children:e(`impactNote.sub`)})]})]}),


  (0,A.jsx)(`section`,{className:`py-12 md:py-16 bg-white`,children:
  (0,A.jsxs)(`div`,{className:`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`,children:[
  (0,A.jsx)(Oi,{children:e(`impactNote.benefitsTitle`)}),


  (0,A.jsx)(`div`,{className:`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8`,children:t.map((e,t)=>
  (0,A.jsx)(Ei,{src:e.src,title:e.title,desc:e.desc},t))})]})}),


  (0,A.jsx)(`section`,{className:`py-12 md:py-16 bg-ftg-cream`,children:
  (0,A.jsxs)(`div`,{className:`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`,children:[
  (0,A.jsx)(Oi,{children:e(`impactNote.designTitle`)}),


  (0,A.jsx)(`div`,{className:`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6`,children:r.map((e,t)=>
  (0,A.jsx)(Di,{icon:e.icon,title:e.title,desc:e.desc},t))})]})}),


  (0,A.jsx)(`section`,{className:`py-12 md:py-16 bg-white`,children:
  (0,A.jsxs)(`div`,{className:`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`,children:[
  (0,A.jsx)(Oi,{children:e(`impactNote.targetTitle`)}),


  (0,A.jsx)(`div`,{className:`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6`,children:a.map((e,t)=>
  (0,A.jsx)(Di,{icon:e.icon,title:e.title,desc:e.desc},t))})]})}),


  (0,A.jsx)(`section`,{className:`py-12 md:py-16 bg-ftg-cream`,children:
  (0,A.jsxs)(`div`,{className:`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`,children:[
  (0,A.jsx)(Oi,{children:e(`impactNote.journeyTitle`)}),


  (0,A.jsx)(`div`,{className:`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6`,children:Ti.map((t,n)=>
  (0,A.jsx)(Ei,{src:t.src,title:e(t.tKey),
desc:e(t.tKey+`Desc`)},n))})]})}),


  (0,A.jsx)(`section`,{className:`py-12 md:py-16 bg-white`,children:
  (0,A.jsxs)(`div`,{className:`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`,children:[
  (0,A.jsx)(Oi,{children:e(`impactNote.leaveTitle`)}),


  (0,A.jsx)(`div`,{className:`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6`,children:o.map((e,t)=>
  (0,A.jsxs)(`div`,{className:`bg-ftg-cream rounded-2xl p-6 shadow-sm hover:shadow-lg transition-shadow flex items-start gap-4 h-full`,children:[
  (0,A.jsx)(`span`,{className:`text-ftg-green shrink-0`,children:
  (0,A.jsx)(M,{name:`check`,size:24})}),


  (0,A.jsxs)(`div`,{children:[
  (0,A.jsx)(`h3`,{className:`text-lg font-bold text-ftg-forest mb-1 leading-snug`,children:e.title}),


  (0,A.jsx)(`p`,{className:`text-gray-600 text-sm leading-relaxed`,children:e.desc})]})]},t))})]})}),


  (0,A.jsx)(`section`,{className:`py-12 md:py-16 bg-ftg-cream`,children:
  (0,A.jsxs)(`div`,{className:`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`,children:[
  (0,A.jsx)(Oi,{children:e(`impactNote.processTitle`)}),


  (0,A.jsx)(`div`,{className:`grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-4`,children:s.map((e,t)=>
  (0,A.jsxs)(`div`,{className:`relative flex flex-col items-center text-center`,children:[
  (0,A.jsx)(`div`,{className:`w-14 h-14 rounded-full bg-ftg-green text-white flex items-center justify-center text-xl font-bold mb-4 shadow-md shrink-0`,children:t+1}),


  (0,A.jsx)(`h3`,{className:`text-base md:text-lg font-bold text-ftg-forest mb-2 leading-snug`,children:e.title}),


  (0,A.jsx)(`p`,{className:`text-gray-600 text-sm leading-relaxed`,children:e.desc})]},t))})]})}),


  (0,A.jsx)(`section`,{className:`py-12 md:py-16 bg-white`,children:
  (0,A.jsxs)(`div`,{className:`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`,children:[
  (0,A.jsx)(Oi,{children:e(`impactNote.safetyTitle`)}),


  (0,A.jsx)(`div`,{className:`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6`,children:l.map((e,t)=>
  (0,A.jsx)(Di,{icon:e.icon,title:e.title,desc:e.desc},t))}),


  (0,A.jsxs)(`div`,{className:`mt-8 md:mt-10 bg-yellow-50 border border-yellow-200 rounded-2xl p-6 md:p-8`,children:[
  (0,A.jsx)(`h3`,{className:`text-base sm:text-lg font-bold text-gray-800 mb-2`,children:e(`impactNote.disclaimerTitle`)}),


  (0,A.jsx)(`p`,{className:`text-gray-700 text-sm leading-relaxed`,children:e(`impactNote.disclaimer`)})]})]})}),


  (0,A.jsx)(`section`,{className:`py-12 md:py-16 bg-ftg-cream`,children:
  (0,A.jsxs)(`div`,{className:`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`,children:[
  (0,A.jsx)(Oi,{children:e(`impactNote.valueAddTitle`)}),


  (0,A.jsx)(`div`,{className:`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6`,children:d.map((e,t)=>
  (0,A.jsx)(Di,{icon:e.icon,title:e.title,desc:e.desc},t))})]})}),


  (0,A.jsx)(`section`,{className:`py-12 md:py-16 lg:py-20 bg-ftg-cream`,children:
  (0,A.jsx)(`div`,{className:`max-w-4xl mx-auto px-4 sm:px-6 lg:px-8`,children:
  (0,A.jsx)(wr,{ctaTitle:e(`impactNote.ctaBlockTitle`),
ctaSub:e(`impactNote.ctaBlockSub`),
features:f})})})]})}

export default ki;
