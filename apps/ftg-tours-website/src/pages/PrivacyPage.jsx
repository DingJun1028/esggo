/* 5T-Traceable: imports below restore the bundle-scope bindings the lifted
 * function body relied on. A/A.jsx = JSX runtime, k = Link, lr = useLanguage,
 * x = React hooks, yr/Ar/kr/wr/M = the shared components. Source bodies are
 * otherwise untouched. */
import * as A from 'react/jsx-runtime'
import { Link as k } from 'react-router-dom'
import { useLanguage as lr } from '../i18n'
import { default as yr } from '../components/Seo'

function Li(){let{t:e}=lr();yr({title:e(`privacy.title`),
description:e(`privacy.metaDesc`),
path:`/privacy`,keywords:[`隱私權政策`,`個人資料`,`個資法`,`FTG TOURS`,`墾趣旅遊`]});let t=`text-2xl font-bold text-ftg-forest mt-10 mb-4`,n=`text-gray-700 leading-relaxed mb-4`,r=`text-gray-700 leading-relaxed mb-2 ml-5 list-disc`;return
  (0,A.jsxs)(`div`,{children:[
  (0,A.jsx)(`section`,{className:`relative py-20 bg-ftg-sand`,children:
  (0,A.jsxs)(`div`,{className:`max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center`,children:[
  (0,A.jsx)(k,{to:`/`,className:`text-ftg-green hover:underline mb-4 inline-block inline-flex items-center min-h-[44px] min-w-[44px] -my-2`,children:e(`nav.backHome`)}),


  (0,A.jsx)(`h1`,{className:`section-title`,children:e(`privacy.title`)}),


  (0,A.jsx)(`p`,{className:`section-subtitle`,children:e(`privacy.sub`)})]})}),


  (0,A.jsx)(`section`,{className:`py-16`,children:
  (0,A.jsxs)(`div`,{className:`max-w-3xl mx-auto px-4 sm:px-6 lg:px-8`,children:[
  (0,A.jsxs)(`div`,{className:`bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-10`,children:[
  (0,A.jsx)(`h2`,{className:`text-lg font-bold text-ftg-forest mb-4`,children:e(`privacy.controllerTitle`)}),


  (0,A.jsxs)(`ul`,{className:`space-y-1 text-gray-700 text-sm`,children:[
  (0,A.jsxs)(`li`,{children:[e(`privacy.companyName`),
`：`,j.legalName]}),


  (0,A.jsxs)(`li`,{children:[e(`privacy.taxId`),
`：`,j.taxId]}),


  (0,A.jsxs)(`li`,{children:[e(`privacy.representative`),
`：`,j.representative]}),


  (0,A.jsxs)(`li`,{children:[e(`privacy.address`),
`：`,j.address]}),


  (0,A.jsxs)(`li`,{children:[e(`privacy.phone`),
`：`,j.phone]}),


  (0,A.jsxs)(`li`,{children:[e(`privacy.email`),
`：`,j.email]}),


  (0,A.jsxs)(`li`,{children:[e(`privacy.licenseNo`),
`：`,j.licenseNo]})]}),


  (0,A.jsxs)(`p`,{className:`text-xs text-gray-500 mt-4`,children:[e(`privacy.effective`),
dr]})]}),


  (0,A.jsx)(`h2`,{className:t,children:e(`privacy.s1Title`)}),


  (0,A.jsx)(`p`,{className:n,children:e(`privacy.s1Body`,{name:j.legalName})}),


  (0,A.jsx)(`h2`,{className:t,children:e(`privacy.s2Title`)}),


  (0,A.jsx)(`p`,{className:n,children:e(`privacy.s2Body`)}),


  (0,A.jsxs)(`ul`,{className:`mb-4`,children:[
  (0,A.jsxs)(`li`,{className:r,children:[
  (0,A.jsx)(`strong`,{children:e(`privacy.dataContact`)}),

`：`,e(`privacy.dataContactVal`)]}),


  (0,A.jsxs)(`li`,{className:r,children:[
  (0,A.jsx)(`strong`,{children:e(`privacy.dataContact2`)}),

`：`,e(`privacy.dataContact2Val`)]}),


  (0,A.jsxs)(`li`,{className:r,children:[
  (0,A.jsx)(`strong`,{children:e(`privacy.dataRequest`)}),

`：`,e(`privacy.dataRequestVal`)]}),


  (0,A.jsxs)(`li`,{className:r,children:[
  (0,A.jsx)(`strong`,{children:e(`privacy.dataTech`)}),

`：`,e(`privacy.dataTechVal`)]}),


  (0,A.jsxs)(`li`,{className:r,children:[
  (0,A.jsx)(`strong`,{children:e(`privacy.dataIp`)}),

`：`,e(`privacy.dataIpVal`)]}),


  (0,A.jsx)(`li`,{className:r,children:e(`privacy.dataOptional`)})]}),


  (0,A.jsx)(`p`,{className:n,children:e(`privacy.s2Note`)}),


  (0,A.jsx)(`h2`,{className:t,children:e(`privacy.s3Title`)}),


  (0,A.jsx)(`p`,{className:n,children:e(`privacy.s3Body`)}),


  (0,A.jsxs)(`ul`,{className:`mb-4`,children:[
  (0,A.jsxs)(`li`,{className:r,children:[
  (0,A.jsx)(`strong`,{children:e(`privacy.purposeService`)}),

`：`,e(`privacy.purposeServiceVal`)]}),


  (0,A.jsxs)(`li`,{className:r,children:[
  (0,A.jsx)(`strong`,{children:e(`privacy.purposeContract`)}),

`：`,e(`privacy.purposeContractVal`)]}),


  (0,A.jsxs)(`li`,{className:r,children:[
  (0,A.jsx)(`strong`,{children:e(`privacy.purposeStatute`)}),

`：`,e(`privacy.purposeStatuteVal`)]})]}),


  (0,A.jsx)(`h2`,{className:t,children:e(`privacy.s4Title`)}),


  (0,A.jsx)(`p`,{className:n,children:e(`privacy.s4Body`)}),


  (0,A.jsxs)(`div`,{className:`bg-amber-50 border border-amber-200 rounded-xl p-5 mb-4`,children:[
  (0,A.jsx)(`h3`,{className:`font-bold text-amber-900 mb-2`,children:e(`privacy.recaptchaTitle`)}),


  (0,A.jsx)(`p`,{className:`text-sm text-amber-900 leading-relaxed mb-2`,children:e(`privacy.recaptchaBody`)}),


  (0,A.jsx)(`p`,{className:`text-sm text-amber-900 leading-relaxed`,children:e(`privacy.recaptchaBody2`)})]}),


  (0,A.jsx)(`h2`,{className:t,children:e(`privacy.s5Title`)}),


  (0,A.jsx)(`p`,{className:n,children:e(`privacy.s5Body`)}),


  (0,A.jsxs)(`ul`,{className:`mb-4`,children:[
  (0,A.jsxs)(`li`,{className:r,children:[
  (0,A.jsx)(`strong`,{children:e(`privacy.shareCloud`)}),

`：`,e(`privacy.shareCloudVal`)]}),


  (0,A.jsxs)(`li`,{className:r,children:[
  (0,A.jsx)(`strong`,{children:e(`privacy.sharePartner`)}),

`：`,e(`privacy.sharePartnerVal`)]})]}),


  (0,A.jsx)(`h2`,{className:t,children:e(`privacy.s6Title`)}),


  (0,A.jsx)(`p`,{className:n,children:e(`privacy.s6Body`,{email:j.email})}),


  (0,A.jsx)(`h2`,{className:t,children:e(`privacy.s7Title`)}),


  (0,A.jsx)(`p`,{className:n,children:e(`privacy.s7Body`)}),


  (0,A.jsx)(`h2`,{className:t,children:e(`privacy.s8Title`)}),


  (0,A.jsx)(`p`,{className:n,children:e(`privacy.s8Body`)}),


  (0,A.jsx)(`div`,{className:`bg-ftg-sand rounded-2xl p-6 md:p-8 mt-10`,children:
  (0,A.jsxs)(`p`,{className:`text-sm text-gray-700 leading-relaxed`,children:[e(`privacy.contactUs`),
`：`,j.legalName,`（`,e(`privacy.taxId`),
` `,j.taxId,`）`,
  (0,A.jsx)(`br`,{}),

e(`privacy.address`),
`：`,j.address,
  (0,A.jsx)(`br`,{}),

e(`privacy.phone`),
`：`,j.phone,`　`,e(`privacy.email`),
`：`,j.email]})})]})})]})}

export default Li;
