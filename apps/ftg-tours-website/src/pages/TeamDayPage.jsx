/* 5T-Traceable: imports below restore the bundle-scope bindings the lifted
 * function body relied on. A/A.jsx = JSX runtime, k = Link, lr = useLanguage,
 * x = React hooks, yr/Ar/kr/wr/M = the shared components. Source bodies are
 * otherwise untouched. */
import * as A from 'react/jsx-runtime'
import { Link as k } from 'react-router-dom'
import { useLanguage as lr } from '../i18n'
import Seo as yr from '../components/Seo'
import ContactSection as wr from '../components/ContactSection'

function ti(){let{t:e}=lr(),
t=[e(`esgTeamDay.ctaFeature1`),
e(`esgTeamDay.ctaFeature2`),
e(`esgTeamDay.ctaFeature3`),
e(`esgTeamDay.ctaFeature4`)];return yr({title:e(`products.esgTeamDay`),
description:e(`esgTeamDay.metaDesc`),
path:`/esg-team-day`,keywords:[`ESG 戶外團隊日`,`企業活動`,`團隊凝聚`,`無痕山林`,`永續行動`]}),


  (0,A.jsxs)(`div`,{children:[
  (0,A.jsxs)(`section`,{className:`subpage-hero`,children:[
  (0,A.jsx)(`img`,{src:`/images/esg-team-day/team-day-頁首大橫幅.webp`,alt:e(`products.esgTeamDay`),
className:`subpage-hero__img`,loading:`lazy`}),


  (0,A.jsx)(`div`,{className:`subpage-hero__overlay`}),


  (0,A.jsx)(`div`,{className:`subpage-hero__dim`}),


  (0,A.jsxs)(`div`,{className:`subpage-hero__content`,children:[
  (0,A.jsx)(k,{to:`/`,className:`text-ftg-orange hover:underline mb-4 inline-block font-medium inline-flex items-center min-h-[44px] min-w-[44px] -my-2`,children:e(`nav.backHome`)}),


  (0,A.jsx)(`h1`,{className:`subpage-hero__title`,children:e(`products.esgTeamDay`)}),


  (0,A.jsx)(`p`,{className:`subpage-hero__subtitle`,children:e(`esgTeamDay.sub`)})]})]}),


  (0,A.jsx)(`section`,{className:`py-12 sm:py-16`,children:
  (0,A.jsxs)(`div`,{className:`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`,children:[
  (0,A.jsx)(ei,{title:e(`esgTeamDay.benefitsTitle`)}),


  (0,A.jsx)(`div`,{className:`grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 mb-14 sm:mb-20`,children:Ur.map((t,n)=>
  (0,A.jsx)(Zr,{src:t.src,title:e(t.tKey),
desc:e(t.tKey+`Desc`)},n))}),


  (0,A.jsx)(ei,{title:e(`esgTeamDay.designTitle`)}),


  (0,A.jsx)(`div`,{className:`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 mb-14 sm:mb-20`,children:Gr.map(t=>
  (0,A.jsx)(Qr,{icon:t.icon,title:e(`esgTeamDay.design${t.n}Title`),
desc:e(`esgTeamDay.design${t.n}Desc`)},t.n))}),


  (0,A.jsx)(ei,{title:e(`esgTeamDay.targetTitle`)}),


  (0,A.jsx)(`div`,{className:`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-5 mb-14 sm:mb-20`,children:Kr.map(t=>
  (0,A.jsx)(Qr,{icon:t.icon,title:e(`esgTeamDay.target${t.n}Title`),
desc:e(`esgTeamDay.target${t.n}Desc`)},t.n))}),


  (0,A.jsx)(ei,{title:e(`esgTeamDay.journeyTitle`)}),


  (0,A.jsx)(`div`,{className:`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 mb-14 sm:mb-20`,children:Wr.map((t,n)=>
  (0,A.jsx)(Zr,{src:t.src,title:e(t.tKey),
desc:e(t.tKey+`Desc`)},n))}),


  (0,A.jsx)(ei,{title:e(`esgTeamDay.leaveTitle`)}),


  (0,A.jsx)(`div`,{className:`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 mb-14 sm:mb-20`,children:qr.map(t=>
  (0,A.jsx)(Qr,{icon:t.icon,title:e(`esgTeamDay.leave${t.n}Title`),
desc:e(`esgTeamDay.leave${t.n}Desc`)},t.n))}),


  (0,A.jsx)(ei,{title:e(`esgTeamDay.processTitle`)}),


  (0,A.jsx)(`div`,{className:`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-5 mb-14 sm:mb-20`,children:Jr.map(t=>
  (0,A.jsx)($r,{num:t.n,title:e(`esgTeamDay.process${t.n}Title`),
desc:e(`esgTeamDay.process${t.n}Desc`)},t.n))}),


  (0,A.jsx)(ei,{title:e(`esgTeamDay.safetyTitle`)}),


  (0,A.jsx)(`div`,{className:`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-5 mb-14 sm:mb-20`,children:Yr.map(t=>
  (0,A.jsx)(Qr,{icon:t.icon,title:e(`esgTeamDay.safety${t.n}Title`),
desc:e(`esgTeamDay.safety${t.n}Desc`)},t.n))}),


  (0,A.jsx)(ei,{title:e(`esgTeamDay.valueAddTitle`)}),


  (0,A.jsx)(`div`,{className:`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 mb-14 sm:mb-20`,children:Xr.map(t=>
  (0,A.jsx)(Qr,{icon:t.icon,title:e(`esgTeamDay.valueAdd${t.n}Title`),
desc:e(`esgTeamDay.valueAdd${t.n}Desc`)},t.n))}),


  (0,A.jsx)(`div`,{className:`mb-14 sm:mb-20`,children:
  (0,A.jsx)(wr,{ctaTitle:e(`esgTeamDay.ctaBlockTitle`),
ctaSub:e(`esgTeamDay.ctaBlockSub`),
features:t})})]})})]})}

export default ti;
