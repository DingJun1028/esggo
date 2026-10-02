/* 5T-Traceable: imports below restore the bundle-scope bindings the lifted
 * function body relied on. A/A.jsx = JSX runtime, k = Link, lr = useLanguage,
 * x = React hooks, yr/Ar/kr/wr/M = the shared components. Source bodies are
 * otherwise untouched. */
import * as A from 'react/jsx-runtime'
import { Link as k } from 'react-router-dom'
import { useLanguage as lr } from '../i18n'
import { default as yr } from '../components/Seo'
import * as x from 'react'

/* 5T-Traceable: `Ai` in the deployed bundle is the reCAPTCHA v3 site key.
 * Deployed it ships as a `REPLACE…` placeholder, and the effect below
 * short-circuits on `Ai.startsWith('REPLACE')`, so the widget is
 * deliberately inert in production. Restored as a placeholder rather
 * than a key — supplying a real one here would change behaviour and
 * require a credential. */
const Ai = 'REPLACE_WITH_RECAPTCHA_SITE_KEY';

function ji(){let{t:e}=lr();yr({title:e(`contact.title`),
description:e(`contact.metaDesc`),
path:`/contact`,keywords:[`聯絡`,`洽詢`,`企業方案`,`FTG TOURS`,`墾趣旅遊`]}),


  (0,x.useEffect)(()=>{if(Ai.startsWith(`REPLACE`)||document.querySelector(`script[src*="recaptcha/api.js"]`))return;let e=document.createElement(`script`);e.src=`https://www.google.com/recaptcha/api.js?render=${Ai}`,e.async=!0,document.head.appendChild(e)},[]);let t=[e(`products.corpTravel`),
e(`products.familyDay`),
e(`products.esgTeamDay`),
e(`products.wellbeing`),
e(`products.executive`),
e(`products.impactNote`),
e(`contact.otherOption`)],[n,r]=
  (0,x.useState)({company:``,contact_name:``,email:``,phone:``,participants:``,activity_type:``,preferred_date:``,message:``,hp:``}),

[i,a]=
  (0,x.useState)(`idle`),
[o,s]=
  (0,x.useState)(``),
c=e=>{let{name:t,value:n}=e.target;r(e=>({...e,[t]:n}))},l=async t=>{if(t.preventDefault(),
a(`sending`),
s(``),
n.hp){console.warn(`honeypot triggered, likely bot`),
a(`success`);return}let i=``;try{!Ai.startsWith(`REPLACE`)&&window.grecaptcha&&(i=await window.grecaptcha.execute(Ai,{action:`submit_contact`}))}catch(e){console.warn(`reCAPTCHA skipped:`,e)}try{let t=await(await fetch(`/api/contact`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify({...n,recaptchaToken:i})})).json();t.ok?(a(`success`),
r({company:``,contact_name:``,email:``,phone:``,participants:``,activity_type:``,preferred_date:``,message:``})):(a(`error`),
s(t.error||e(`contact.submitFailed`)))}catch{a(`error`),
s(e(`contact.networkError`))}},u=`w-full px-4 py-3 text-base rounded-xl border border-gray-300 focus:ring-2 focus:ring-ftg-green focus:border-ftg-green outline-none transition`,d=`block text-sm font-semibold text-ftg-forest mb-2`;return
  (0,A.jsxs)(`div`,{children:[
  (0,A.jsx)(`section`,{className:`relative py-20 bg-ftg-sand`,children:
  (0,A.jsxs)(`div`,{className:`max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center`,children:[
  (0,A.jsx)(k,{to:`/`,className:`text-ftg-green hover:underline mb-4 inline-block inline-flex items-center min-h-[44px] min-w-[44px] -my-2`,children:e(`nav.backHome`)}),


  (0,A.jsx)(`h1`,{className:`section-title`,children:e(`contact.title`)}),


  (0,A.jsx)(`p`,{className:`section-subtitle`,children:e(`contact.sub`)})]})}),


  (0,A.jsx)(`section`,{className:`py-16`,children:
  (0,A.jsxs)(`div`,{className:`max-w-3xl mx-auto px-4 sm:px-6 lg:px-8`,children:[
  (0,A.jsxs)(`div`,{className:`grid grid-cols-1 md:grid-cols-3 gap-6 text-center mb-12`,children:[
  (0,A.jsxs)(`div`,{className:`rounded-2xl bg-white shadow-lg p-8`,children:[
  (0,A.jsx)(`h3`,{className:`text-lg font-bold text-ftg-green mb-2`,children:e(`contact.phone`)}),


  (0,A.jsx)(`p`,{className:`text-gray-700`,children:j.phone})]}),


  (0,A.jsxs)(`div`,{className:`rounded-2xl bg-white shadow-lg p-8`,children:[
  (0,A.jsx)(`h3`,{className:`text-lg font-bold text-ftg-green mb-2`,children:e(`contact.email`)}),


  (0,A.jsx)(`p`,{className:`text-gray-700`,children:j.email})]}),


  (0,A.jsxs)(`div`,{className:`rounded-2xl bg-white shadow-lg p-8`,children:[
  (0,A.jsx)(`h3`,{className:`text-lg font-bold text-ftg-green mb-2`,children:e(`contact.address`)}),


  (0,A.jsx)(`p`,{className:`text-gray-700`,children:j.address})]})]}),


  (0,A.jsxs)(`div`,{className:`bg-white rounded-2xl shadow-xl p-8 md:p-12`,children:[
  (0,A.jsx)(`h2`,{className:`text-2xl font-bold text-ftg-forest mb-6 text-center`,children:e(`contact.formTitle`)}),

i===`success`&&
  (0,A.jsx)(`div`,{className:`mb-6 rounded-xl bg-green-50 border border-green-200 text-green-800 px-4 py-3 text-center`,children:e(`contact.successMsg`)}),

i===`error`&&
  (0,A.jsxs)(`div`,{className:`mb-6 rounded-xl bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-center`,children:[e(`contact.failPrefix`),
o]}),


  (0,A.jsxs)(`form`,{onSubmit:l,className:`space-y-6`,children:[
  (0,A.jsxs)(`div`,{className:`absolute left-[-9999px] top-[-9999px] w-px h-px overflow-hidden`,"aria-hidden":`true`,children:[
  (0,A.jsx)(`label`,{htmlFor:`hp-field`,children:`請勿填寫此欄`}),


  (0,A.jsx)(`input`,{id:`hp-field`,name:`hp`,type:`text`,tabIndex:-1,autoComplete:`off`,value:n.hp,onChange:c})]}),


  (0,A.jsxs)(`div`,{className:`grid grid-cols-1 md:grid-cols-2 gap-6`,children:[
  (0,A.jsxs)(`div`,{children:[
  (0,A.jsx)(`label`,{className:d,children:e(`contact.company`)}),


  (0,A.jsx)(`input`,{name:`company`,value:n.company,onChange:c,className:u,placeholder:e(`contact.companyPh`)})]}),


  (0,A.jsxs)(`div`,{children:[
  (0,A.jsx)(`label`,{className:d,children:e(`contact.contactName`)}),


  (0,A.jsx)(`input`,{name:`contact_name`,value:n.contact_name,onChange:c,className:u,placeholder:e(`contact.contactNamePh`),
required:!0})]}),


  (0,A.jsxs)(`div`,{children:[
  (0,A.jsx)(`label`,{className:d,children:e(`contact.email`)}),


  (0,A.jsx)(`input`,{type:`email`,name:`email`,value:n.email,onChange:c,className:u,placeholder:`name@company.com`,required:!0})]}),


  (0,A.jsxs)(`div`,{children:[
  (0,A.jsx)(`label`,{className:d,children:e(`contact.phone`)}),


  (0,A.jsx)(`input`,{name:`phone`,value:n.phone,onChange:c,className:u,placeholder:e(`contact.phonePh`)})]}),


  (0,A.jsxs)(`div`,{children:[
  (0,A.jsx)(`label`,{className:d,children:e(`contact.participants`)}),


  (0,A.jsx)(`input`,{type:`number`,name:`participants`,value:n.participants,onChange:c,className:u,placeholder:e(`contact.participantsPh`),
min:`1`})]}),


  (0,A.jsxs)(`div`,{children:[
  (0,A.jsx)(`label`,{className:d,children:e(`contact.preferredDate`)}),


  (0,A.jsx)(`input`,{name:`preferred_date`,value:n.preferred_date,onChange:c,className:u,placeholder:e(`contact.preferredDatePh`)})]})]}),


  (0,A.jsxs)(`div`,{children:[
  (0,A.jsx)(`label`,{className:d,children:e(`contact.activityType`)}),


  (0,A.jsxs)(`select`,{name:`activity_type`,value:n.activity_type,onChange:c,className:u,required:!0,children:[
  (0,A.jsx)(`option`,{value:``,children:e(`contact.activityTypePh`)}),

t.map(e=>
  (0,A.jsx)(`option`,{value:e,children:e},e))]})]}),


  (0,A.jsxs)(`div`,{children:[
  (0,A.jsx)(`label`,{className:d,children:e(`contact.message`)}),


  (0,A.jsx)(`textarea`,{name:`message`,value:n.message,onChange:c,rows:4,className:u,placeholder:e(`contact.messagePh`)})]}),


  (0,A.jsx)(`div`,{className:`text-center`,children:
  (0,A.jsx)(`button`,{type:`submit`,disabled:i===`sending`,className:`inline-block bg-ftg-orange text-white px-10 py-4 rounded-full font-semibold text-lg hover:bg-orange-600 transition-colors disabled:opacity-60`,children:e(i===`sending`?`contact.sending`:`contact.submitBtn`)})})]})]})]})})]})}

export default ji;
