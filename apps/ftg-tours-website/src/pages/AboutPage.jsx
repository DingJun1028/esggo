/* 5T-Traceable: imports below restore the bundle-scope bindings the lifted
 * function body relied on. A/A.jsx = JSX runtime, k = Link, lr = useLanguage,
 * x = React hooks, yr/Ar/kr/wr/M = the shared components. Source bodies are
 * otherwise untouched. */
import * as A from 'react/jsx-runtime'
import { Link as k } from 'react-router-dom'
import { useLanguage as lr } from '../i18n'
import { default as yr } from '../components/Seo'
import { default as M } from '../components/Icon'
import { default as wr } from '../components/ContactSection'

function P(){let{t:e}=lr();yr({title:e(`about.title`),
description:e(`about.metaDesc`),
path:`/about`,keywords:[`關於我們`,`墾趣國際`,`永續`,`ESG`,`FTG TOURS`,`墾趣旅遊`]});let t=[{icon:`award`,title:e(`about.goal1Title`),
desc:e(`about.goal1Desc`)},{icon:`users`,title:e(`about.goal2Title`),
desc:e(`about.goal2Desc`)},{icon:`sustainable`,title:e(`about.goal3Title`),
desc:e(`about.goal3Desc`)}];return
  (0,A.jsxs)(`div`,{children:[
  (0,A.jsx)(`section`,{className:`relative bg-ftg-forest text-white py-20 md:py-28`,children:
  (0,A.jsxs)(`div`,{className:`max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center`,children:[
  (0,A.jsx)(k,{to:`/`,className:`inline-flex items-center text-ftg-orange hover:text-white transition-colors mb-6 text-sm min-h-[44px] min-w-[44px] -my-2`,children:e(`nav.backHome`)}),


  (0,A.jsx)(`h1`,{className:`text-3xl md:text-5xl font-bold font-serif mb-4`,children:e(`footer.about`)}),


  (0,A.jsx)(`p`,{className:`text-lg text-gray-200`,children:e(`about.title`)})]})}),


  (0,A.jsx)(`section`,{className:`section-padding bg-white`,children:
  (0,A.jsxs)(`div`,{className:`max-w-3xl mx-auto px-4 sm:px-6 lg:px-8`,children:[
  (0,A.jsx)(`p`,{className:`text-gray-700 leading-relaxed mb-6 text-base md:text-lg`,children:e(`about.p1`)}),


  (0,A.jsx)(`p`,{className:`text-gray-700 leading-relaxed mb-6 text-base md:text-lg`,children:e(`about.p2`)})]})}),


  (0,A.jsx)(`section`,{className:`section-padding bg-ftg-sand`,children:
  (0,A.jsxs)(`div`,{className:`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`,children:[
  (0,A.jsx)(`div`,{className:`text-center mb-12 md:mb-16`,children:
  (0,A.jsx)(`h2`,{className:`section-title`,children:e(`about.goalsTitle`)})}),


  (0,A.jsx)(`div`,{className:`grid grid-cols-1 md:grid-cols-3 gap-8`,children:t.map((e,t)=>
  (0,A.jsxs)(`div`,{className:`text-center p-6 bg-white rounded-2xl shadow-sm`,children:[
  (0,A.jsx)(`div`,{className:`w-16 h-16 mx-auto mb-4 rounded-full bg-ftg-green/10 flex items-center justify-center`,children:
  (0,A.jsx)(M,{name:e.icon,size:32,className:`text-ftg-green`})}),


  (0,A.jsx)(`h3`,{className:`text-xl font-bold text-ftg-forest mb-3`,children:e.title}),


  (0,A.jsx)(`p`,{className:`text-gray-600 leading-relaxed`,children:e.desc})]},t))})]})}),


  (0,A.jsx)(`section`,{className:`py-20 bg-ftg-forest text-white`,children:
  (0,A.jsx)(`div`,{className:`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`,children:
  (0,A.jsxs)(`div`,{className:`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center`,children:[
  (0,A.jsxs)(`div`,{children:[
  (0,A.jsx)(`p`,{className:`text-lg md:text-xl text-gray-200 leading-relaxed mb-8`,children:e(`about.closing`)}),


  (0,A.jsxs)(`div`,{className:`flex items-center gap-4 text-gray-300 text-sm`,children:[
  (0,A.jsxs)(`div`,{className:`flex items-center gap-2`,children:[
  (0,A.jsx)(M,{name:`shield`,size:20}),

` `,e(`nav.products`)]}),


  (0,A.jsxs)(`div`,{className:`flex items-center gap-2`,children:[
  (0,A.jsx)(M,{name:`sustainable`,size:20}),

` `,e(`about.goalsTitle`)]})]})]}),


  (0,A.jsx)(`div`,{className:`bg-white rounded-2xl shadow-2xl p-8 text-gray-800`,children:
  (0,A.jsx)(wr,{})})]})})})]})}

export default P;
