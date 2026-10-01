/* 5T-Traceable: imports below restore the bundle-scope bindings the lifted
 * function body relied on. A/A.jsx = JSX runtime, k = Link, lr = useLanguage,
 * x = React hooks, yr/Ar/kr/wr/M = the shared components. Source bodies are
 * otherwise untouched. */
import * as A from 'react/jsx-runtime'
import { Link as k } from 'react-router-dom'
import { useLanguage as lr } from '../i18n'
import Seo as yr from '../components/Seo'

function Ri(){let{t:e}=lr();yr({title:e(`terms.title`),
description:e(`terms.metaDesc`),
path:`/terms`,keywords:[`服務條款`,`定型化契約`,`旅行社`,`FTG TOURS`,`墾趣旅遊`]});let t=`text-2xl font-bold text-ftg-forest mt-10 mb-4`,n=`text-gray-700 leading-relaxed mb-4`,r=`text-gray-700 leading-relaxed mb-2 ml-5 list-disc`;return
  (0,A.jsxs)(`div`,{children:[
  (0,A.jsx)(`section`,{className:`relative py-20 bg-ftg-sand`,children:
  (0,A.jsxs)(`div`,{className:`max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center`,children:[
  (0,A.jsx)(k,{to:`/`,className:`text-ftg-green hover:underline mb-4 inline-block inline-flex items-center min-h-[44px] min-w-[44px] -my-2`,children:e(`nav.backHome`)}),


  (0,A.jsx)(`h1`,{className:`section-title`,children:e(`terms.title`)}),


  (0,A.jsx)(`p`,{className:`section-subtitle`,children:e(`terms.sub`)})]})}),


  (0,A.jsx)(`section`,{className:`py-16`,children:
  (0,A.jsxs)(`div`,{className:`max-w-3xl mx-auto px-4 sm:px-6 lg:px-8`,children:[
  (0,A.jsxs)(`div`,{className:`bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-10`,children:[
  (0,A.jsx)(`h2`,{className:`text-lg font-bold text-ftg-forest mb-4`,children:e(`terms.companyTitle`)}),


  (0,A.jsxs)(`ul`,{className:`space-y-1 text-gray-700 text-sm`,children:[
  (0,A.jsxs)(`li`,{children:[e(`privacy.companyName`),
`：`,j.legalName]}),


  (0,A.jsxs)(`li`,{children:[e(`privacy.taxId`),
`：`,j.taxId]}),


  (0,A.jsxs)(`li`,{children:[e(`privacy.registryNo`),
`：`,j.registryNo]}),


  (0,A.jsxs)(`li`,{children:[e(`privacy.licenseNo`),
`：`,j.licenseNo]}),


  (0,A.jsxs)(`li`,{children:[e(`privacy.assuranceNo`),
`：`,j.assuranceNo]}),


  (0,A.jsxs)(`li`,{children:[e(`privacy.representative`),
`：`,j.representative]}),


  (0,A.jsxs)(`li`,{children:[e(`privacy.address`),
`：`,j.address]}),


  (0,A.jsxs)(`li`,{children:[e(`privacy.phone`),
`：`,j.phone,`　`,e(`terms.fax`),
`：`,j.fax]}),


  (0,A.jsxs)(`li`,{children:[e(`privacy.email`),
`：`,j.email,`　`,e(`terms.line`),
`：`,j.lineId]})]}),


  (0,A.jsxs)(`p`,{className:`text-xs text-gray-500 mt-4`,children:[e(`privacy.effective`),
dr]})]}),


  (0,A.jsx)(`h2`,{className:t,children:e(`terms.s1Title`)}),


  (0,A.jsx)(`p`,{className:n,children:e(`terms.s1Body`,{name:j.legalName})}),


  (0,A.jsx)(`h2`,{className:t,children:e(`terms.s2Title`)}),


  (0,A.jsx)(`p`,{className:n,children:e(`terms.s2Body`)}),


  (0,A.jsxs)(`ul`,{className:`mb-4`,children:[
  (0,A.jsx)(`li`,{className:r,children:e(`terms.s2i1`)}),


  (0,A.jsx)(`li`,{className:r,children:e(`terms.s2i2`)}),


  (0,A.jsx)(`li`,{className:r,children:e(`terms.s2i3`)}),


  (0,A.jsx)(`li`,{className:r,children:e(`terms.s2i4`)})]}),


  (0,A.jsx)(`h2`,{className:t,children:e(`terms.s3Title`)}),


  (0,A.jsx)(`p`,{className:n,children:e(`terms.s3Body`)}),


  (0,A.jsx)(`h2`,{className:t,children:e(`terms.s4Title`)}),


  (0,A.jsx)(`p`,{className:n,children:e(`terms.s4Body`)}),


  (0,A.jsx)(`h2`,{className:t,children:e(`terms.s5Title`)}),


  (0,A.jsx)(`p`,{className:n,children:e(`terms.s5Body`)}),


  (0,A.jsxs)(`ul`,{className:`mb-4`,children:[
  (0,A.jsx)(`li`,{className:r,children:e(`terms.s5i1`)}),


  (0,A.jsx)(`li`,{className:r,children:e(`terms.s5i2`)})]}),


  (0,A.jsx)(`h2`,{className:t,children:e(`terms.s6Title`)}),


  (0,A.jsx)(`p`,{className:n,children:e(`terms.s6Body`)}),


  (0,A.jsx)(`h2`,{className:t,children:e(`terms.s7Title`)}),


  (0,A.jsx)(`p`,{className:n,children:e(`terms.s7Body`,{email:j.email})}),


  (0,A.jsx)(`div`,{className:`bg-ftg-sand rounded-2xl p-6 md:p-8 mt-10`,children:
  (0,A.jsxs)(`p`,{className:`text-sm text-gray-700 leading-relaxed`,children:[e(`terms.acknowledge`),

  (0,A.jsx)(`br`,{}),

j.legalName,`　`,e(`privacy.representative`),
`：`,j.representative]})})]})})]})}

export default Ri;
