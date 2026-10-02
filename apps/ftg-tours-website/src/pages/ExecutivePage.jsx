/* 5T-Traceable: imports below restore the bundle-scope bindings the lifted
 * function body relied on. A/A.jsx = JSX runtime, k = Link, lr = useLanguage,
 * x = React hooks, yr/Ar/kr/wr/M = the shared components. Source bodies are
 * otherwise untouched. */
import * as A from 'react/jsx-runtime'
import { Link as k } from 'react-router-dom'
import { useLanguage as lr } from '../i18n'
import { default as yr } from '../components/Seo'
import { default as wr } from '../components/ContactSection'
import { DATA__i as _i } from '../data/siteData'

function Ci(){let{t:e}=lr();yr({title:e(`products.executive`),
description:e(`executive.metaDesc`),
path:`/executive-retreat`,keywords:[`共識營`,`高階主管`,`永續轉型`,`策略對話`,`主管共識旅程`]});let t=_i.map(t=>({src:t.src,title:e(t.tKey),
desc:e(t.tKey+`Desc`)})),
n=[`compass`,`map`,`shield`,`users`,`leaf`,`clipboard`],r=[1,2,3,4,5,6].map(t=>({icon:n[t-1],title:e(`executive.design${t}Title`),
desc:e(`executive.design${t}Desc`)})),
i=[`compass`,`refresh`,`leaf`,`users`,`users`],a=[1,2,3,4,5].map(t=>({icon:i[t-1],title:e(`executive.target${t}Title`),
desc:e(`executive.target${t}Desc`)})),
o=[1,2,3,4,5].map(t=>({title:e(`executive.leave${t}Title`),
desc:e(`executive.leave${t}Desc`)})),
s=[1,2,3,4,5].map(t=>({title:e(`executive.process${t}Title`),
desc:e(`executive.process${t}Desc`)})),
c=[`users`,`navigation`,`mountain`,`mail`,`users`],l=[1,2,3,4,5].map(t=>({icon:c[t-1],title:e(`executive.safety${t}Title`),
desc:e(`executive.safety${t}Desc`)})),
u=[1,2,3,4].map(t=>({title:e(`executive.valueAdd${t}Title`),
desc:e(`executive.valueAdd${t}Desc`)})),
d=[1,2,3,4].map(t=>e(`executive.ctaFeature${t}`));return
  (0,A.jsxs)(`div`,{children:[
  (0,A.jsxs)(`section`,{className:`subpage-hero`,children:[
  (0,A.jsx)(`img`,{src:`/images/executive-retreat/高階主管共識-頁首橫幅.webp`,alt:e(`products.executive`),
className:`subpage-hero__img`,loading:`lazy`}),


  (0,A.jsx)(`div`,{className:`subpage-hero__overlay`}),


  (0,A.jsx)(`div`,{className:`subpage-hero__dim`}),


  (0,A.jsxs)(`div`,{className:`subpage-hero__content`,children:[
  (0,A.jsx)(k,{to:`/`,className:`text-ftg-orange hover:underline mb-4 inline-block font-medium inline-flex items-center min-h-[44px] min-w-[44px] -my-2`,children:e(`nav.backHome`)}),


  (0,A.jsx)(`h1`,{className:`subpage-hero__title`,children:e(`products.executive`)}),


  (0,A.jsx)(`p`,{className:`subpage-hero__subtitle`,children:e(`executive.sub`)})]})]}),


  (0,A.jsx)(`section`,{className:`py-12 md:py-16 bg-white`,children:
  (0,A.jsxs)(`div`,{className:`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`,children:[
  (0,A.jsx)(yi,{children:e(`executive.benefitsTitle`)}),


  (0,A.jsx)(`div`,{className:`grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6`,children:t.map((e,t)=>
  (0,A.jsx)(vi,{src:e.src,title:e.title,desc:e.desc},t))})]})}),


  (0,A.jsx)(`section`,{className:`py-12 md:py-16 bg-ftg-cream`,children:
  (0,A.jsxs)(`div`,{className:`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`,children:[
  (0,A.jsx)(yi,{children:e(`executive.designTitle`)}),


  (0,A.jsx)(`div`,{className:`grid grid-cols-2 md:grid-cols-3 gap-5 sm:gap-6`,children:r.map((e,t)=>
  (0,A.jsx)(bi,{icon:e.icon,title:e.title,desc:e.desc},t))})]})}),


  (0,A.jsx)(`section`,{className:`py-12 md:py-16 bg-white`,children:
  (0,A.jsxs)(`div`,{className:`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`,children:[
  (0,A.jsx)(yi,{children:e(`executive.targetTitle`)}),


  (0,A.jsx)(`div`,{className:`grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5`,children:a.map((e,t)=>
  (0,A.jsx)(bi,{icon:e.icon,title:e.title,desc:e.desc},t))})]})}),


  (0,A.jsx)(`section`,{className:`py-12 md:py-16 bg-ftg-cream`,children:
  (0,A.jsxs)(`div`,{className:`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`,children:[
  (0,A.jsx)(yi,{children:e(`executive.journeyTitle`)}),


  (0,A.jsx)(`div`,{className:`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6`,children:gi.map((t,n)=>
  (0,A.jsx)(vi,{src:t.src,title:e(t.tKey),
desc:e(t.tKey+`Desc`)},n))})]})}),


  (0,A.jsx)(`section`,{className:`py-12 md:py-16 bg-white`,children:
  (0,A.jsxs)(`div`,{className:`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`,children:[
  (0,A.jsx)(yi,{children:e(`executive.leaveTitle`)}),


  (0,A.jsx)(`div`,{className:`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6`,children:o.map((e,t)=>
  (0,A.jsx)(xi,{title:e.title,desc:e.desc},t))})]})}),


  (0,A.jsx)(`section`,{className:`py-12 md:py-16 bg-ftg-cream`,children:
  (0,A.jsxs)(`div`,{className:`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`,children:[
  (0,A.jsx)(yi,{children:e(`executive.processTitle`)}),


  (0,A.jsx)(`div`,{className:`grid grid-cols-1 md:grid-cols-5 gap-6 sm:gap-8`,children:s.map((e,t)=>
  (0,A.jsx)(Si,{num:t+1,title:e.title,desc:e.desc},t))})]})}),


  (0,A.jsx)(`section`,{className:`py-12 md:py-16 bg-white`,children:
  (0,A.jsxs)(`div`,{className:`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`,children:[
  (0,A.jsx)(yi,{children:e(`executive.safetyTitle`)}),


  (0,A.jsx)(`div`,{className:`grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5`,children:l.map((e,t)=>
  (0,A.jsx)(bi,{icon:e.icon,title:e.title,desc:e.desc},t))})]})}),


  (0,A.jsx)(`section`,{className:`py-12 md:py-16 bg-ftg-cream`,children:
  (0,A.jsxs)(`div`,{className:`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`,children:[
  (0,A.jsx)(yi,{children:e(`executive.valueAddTitle`)}),


  (0,A.jsx)(`div`,{className:`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6`,children:u.map((e,t)=>
  (0,A.jsx)(xi,{title:e.title,desc:e.desc},t))})]})}),


  (0,A.jsx)(`section`,{className:`py-12 md:py-16 bg-ftg-green`,children:
  (0,A.jsx)(`div`,{className:`max-w-5xl mx-auto px-4 sm:px-6 lg:px-8`,children:
  (0,A.jsx)(wr,{ctaTitle:e(`executive.ctaBlockTitle`),
ctaSub:e(`executive.ctaBlockSub`),
features:d})})})]})}

export default Ci;
