/* 5T-Traceable: imports below restore the bundle-scope bindings the lifted
 * function body relied on. A/A.jsx = JSX runtime, k = Link, lr = useLanguage,
 * x = React hooks, yr/Ar/kr/wr/M = the shared components. Source bodies are
 * otherwise untouched. */
import * as A from 'react/jsx-runtime'
import { Link as k } from 'react-router-dom'
import { useLanguage as lr } from '../i18n'
import Seo as yr from '../components/Seo'
import ContactSection as wr from '../components/ContactSection'

function hi(){let{t:e}=lr();yr({title:e(`products.wellbeing`),
description:e(`wellbeing.metaDesc`),
path:`/wellbeing-retreat`,keywords:[`員工身心平衡旅程`,`員工福祉`,`高壓紓壓`,`團隊對話`,`自然休養`]});let t=ni.slice(1).slice
  (0,4),
n=[`target1`,`target2`,`target3`,`target4`],r=ni.slice(1).slice(4,8),
i=[`valueAdd1`,`valueAdd2`,`valueAdd3`,`valueAdd4`];return
  (0,A.jsxs)(`div`,{children:[
  (0,A.jsxs)(`section`,{className:`subpage-hero`,children:[
  (0,A.jsx)(`img`,{src:`/images/wellbeing-retreat/員工身心平衡-頁首大橫幅.webp`,alt:e(`products.wellbeing`),
className:`subpage-hero__img`,loading:`lazy`}),


  (0,A.jsx)(`div`,{className:`subpage-hero__overlay`}),


  (0,A.jsx)(`div`,{className:`subpage-hero__dim`}),


  (0,A.jsxs)(`div`,{className:`subpage-hero__content`,children:[
  (0,A.jsx)(k,{to:`/`,className:`text-ftg-orange hover:underline mb-4 inline-block font-medium inline-flex items-center min-h-[44px] min-w-[44px] -my-2`,children:e(`nav.backHome`)}),


  (0,A.jsx)(`h1`,{className:`subpage-hero__title`,children:e(`products.wellbeing`)}),


  (0,A.jsx)(`p`,{className:`subpage-hero__subtitle`,children:e(`wellbeing.sub`)})]})]}),


  (0,A.jsxs)(`div`,{className:`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`,children:[
  (0,A.jsxs)(`section`,{className:`section-padding`,children:[
  (0,A.jsx)(`h2`,{className:`section-title text-center`,children:e(`wellbeing.benefitsTitle`)}),


  (0,A.jsx)(`div`,{className:`grid grid-5-responsive gap-5 sm:gap-6 mt-8`,children:ci.map((t,n)=>
  (0,A.jsx)(mi,{icon:ii[n],title:e(`wellbeing.${t}Title`),
desc:e(`wellbeing.${t}Desc`)},t))})]}),


  (0,A.jsxs)(`section`,{className:`section-padding bg-ftg-sand rounded-3xl`,children:[
  (0,A.jsx)(`h2`,{className:`section-title text-center`,children:e(`wellbeing.designTitle`)}),


  (0,A.jsx)(`div`,{className:`grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mt-8`,children:li.map((t,n)=>
  (0,A.jsx)(mi,{icon:ai[n],title:e(`wellbeing.${t}Title`),
desc:e(`wellbeing.${t}Desc`)},t))})]}),


  (0,A.jsxs)(`section`,{className:`section-padding`,children:[
  (0,A.jsx)(`h2`,{className:`section-title text-center`,children:e(`wellbeing.targetTitle`)}),


  (0,A.jsx)(`div`,{className:`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 mt-8`,children:t.map((t,r)=>
  (0,A.jsx)(ri,{src:t.src,title:e(`wellbeing.${n[r]}Title`),
desc:e(`wellbeing.${n[r]}Desc`)},r))})]}),


  (0,A.jsxs)(`section`,{className:`section-padding bg-ftg-cream rounded-3xl`,children:[
  (0,A.jsx)(`h2`,{className:`section-title text-center`,children:e(`wellbeing.journeyTitle`)}),


  (0,A.jsxs)(`ol`,{className:`relative mt-10 max-w-3xl mx-auto pl-12`,children:[
  (0,A.jsx)(`span`,{className:`absolute left-4 top-2 bottom-2 w-0.5 bg-ftg-green/30`,"aria-hidden":`true`}),

fi.map((t,n)=>
  (0,A.jsxs)(`li`,{className:`relative mb-8 last:mb-0`,children:[
  (0,A.jsx)(`span`,{className:`absolute -left-12 top-0 w-8 h-8 rounded-full bg-ftg-green text-white flex items-center justify-center font-bold text-sm shadow`,children:n+1}),


  (0,A.jsx)(`h3`,{className:`font-bold text-ftg-forest text-lg mb-1`,children:e(`wellbeing.${t}Title`)}),


  (0,A.jsx)(`p`,{className:`text-gray-600 text-sm leading-relaxed`,children:e(`wellbeing.${t}Desc`)})]},t))]})]}),


  (0,A.jsxs)(`section`,{className:`section-padding`,children:[
  (0,A.jsx)(`h2`,{className:`section-title text-center`,children:e(`wellbeing.leaveTitle`)}),


  (0,A.jsx)(`div`,{className:`grid grid-5-responsive gap-5 sm:gap-6 mt-8`,children:ui.map((t,n)=>
  (0,A.jsx)(mi,{icon:oi[n],title:e(`wellbeing.${t}Title`),
desc:e(`wellbeing.${t}Desc`)},t))})]}),


  (0,A.jsxs)(`section`,{className:`section-padding bg-ftg-sand rounded-3xl`,children:[
  (0,A.jsx)(`h2`,{className:`section-title text-center`,children:e(`wellbeing.processTitle`)}),


  (0,A.jsx)(`div`,{className:`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mt-8`,children:pi.map((t,n)=>
  (0,A.jsxs)(`div`,{className:`relative text-center`,children:[
  (0,A.jsx)(`div`,{className:`w-14 h-14 mx-auto mb-4 rounded-full bg-ftg-green text-white flex items-center justify-center text-xl font-bold`,children:n+1}),


  (0,A.jsx)(`h3`,{className:`font-bold text-ftg-forest mb-2 text-lg leading-snug`,children:e(`wellbeing.${t}Title`)}),


  (0,A.jsx)(`p`,{className:`text-gray-600 text-sm leading-relaxed`,children:e(`wellbeing.${t}Desc`)})]},t))})]}),


  (0,A.jsxs)(`section`,{className:`section-padding`,children:[
  (0,A.jsx)(`h2`,{className:`section-title text-center`,children:e(`wellbeing.safetyTitle`)}),


  (0,A.jsx)(`div`,{className:`grid grid-5-responsive gap-5 sm:gap-6 mt-8`,children:di.map((t,n)=>
  (0,A.jsx)(mi,{icon:si[n],title:e(`wellbeing.${t}Title`),
desc:e(`wellbeing.${t}Desc`)},t))})]}),


  (0,A.jsxs)(`section`,{className:`section-padding bg-ftg-cream rounded-3xl`,children:[
  (0,A.jsx)(`h2`,{className:`section-title text-center`,children:e(`wellbeing.valueAddTitle`)}),


  (0,A.jsx)(`div`,{className:`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 mt-8`,children:r.map((t,n)=>
  (0,A.jsx)(ri,{src:t.src,title:e(`wellbeing.${i[n]}Title`),
desc:e(`wellbeing.${i[n]}Desc`)},n))})]}),


  (0,A.jsx)(`section`,{className:`section-padding`,children:
  (0,A.jsx)(`div`,{className:`max-w-5xl mx-auto`,children:
  (0,A.jsx)(wr,{ctaTitle:e(`wellbeing.ctaBlockTitle`),
ctaSub:e(`wellbeing.ctaBlockSub`),
features:[`ctaFeature1`,`ctaFeature2`,`ctaFeature3`,`ctaFeature4`].map(t=>e(`wellbeing.${t}`))})})})]})]})}

export default hi;
