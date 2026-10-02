/* 5T-Traceable: imports restore the bundle-scope bindings this lifted function
 * depended on. Resolved against the deployed bundle by definition body, not by
 * guesswork: A = react/jsx-runtime, x = react hooks, k = Link,
 * xt = useLocation, lr = useLanguage. Function body is otherwise untouched.
 */
import * as A from 'react/jsx-runtime';
import * as x from 'react';
import { Link as k } from 'react-router-dom';
import { useLocation as xt } from 'react-router-dom';
import { useLanguage as lr } from '../i18n';

function ur(){
let [e,t]=
  (0,x.useState)(!1),
[n,r]=
  (0,x.useState)(!1),
i=xt(),
{t:a,lang:o,setLang:s}=lr(),
c=[{path:`/corporate-travel`,label:a(`products.corpTravel`)},{path:`/family-day`,label:a(`products.familyDay`)},{path:`/esg-team-day`,label:a(`products.esgTeamDay`)},{path:`/wellbeing-retreat`,label:a(`products.wellbeing`)},{path:`/executive-retreat`,label:a(`products.executive`)},{path:`/esg-impact-note`,label:a(`products.impactNote`)}];return
  (0,A.jsx)(`nav`,{className:`bg-white shadow-sm sticky top-0 z-50`,children:
  (0,A.jsxs)(`div`,{className:`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`,children:[
  (0,A.jsxs)(`div`,{className:`flex justify-between items-center h-16 md:h-20`,children:[
  (0,A.jsx)(k,{to:`/`,className:`flex items-center min-h-[44px] min-w-[44px]`,children:
  (0,A.jsx)(`img`,{src:`/images/logo.webp`,alt:`墾趣旅遊 FTG TOURS`,className:`h-10 md:h-14 w-auto`})}),


  (0,A.jsxs)(`div`,{className:`hidden lg:flex items-center space-x-1`,children:[
  (0,A.jsx)(k,{to:`/`,className:`px-3 py-2 min-h-[44px] inline-flex items-center rounded-md text-sm font-medium ${i.pathname===`/`?`text-ftg-green bg-ftg-sand`:`text-gray-700 hover:text-ftg-green`}`,children:a(`nav.home`)}),


  (0,A.jsxs)(`div`,{className:`relative group`,children:[
  (0,A.jsxs)(`button`,{className:`px-3 py-2 min-h-[44px] min-w-[44px] inline-flex items-center rounded-md text-sm font-medium text-gray-700 hover:text-ftg-green`,children:[a(`nav.products`),

  (0,A.jsx)(`svg`,{className:`ml-1 h-4 w-4 transition-transform group-hover:rotate-180`,fill:`none`,stroke:`currentColor`,viewBox:`0 0 24 24`,children:
  (0,A.jsx)(`path`,{strokeLinecap:`round`,strokeLinejoin:`round`,strokeWidth:2,d:`M19 9l-7 7-7-7`})})]}),


  (0,A.jsx)(`div`,{className:`absolute top-full left-0 mt-1 w-60 bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 border border-gray-100`,children:
  (0,A.jsx)(`div`,{className:`py-2`,children:c.map(e=>
  (0,A.jsx)(k,{to:e.path,className:`block px-4 py-2.5 min-h-[44px] inline-flex items-center text-sm ${i.pathname===e.path?`text-ftg-green bg-ftg-sand font-semibold`:`text-gray-700 hover:bg-ftg-sand hover:text-ftg-green`}`,children:e.label},e.path))})})]}),


  (0,A.jsxs)(`div`,{className:`flex items-center ml-2 border border-gray-200 rounded-full overflow-hidden text-xs font-semibold`,children:[
  (0,A.jsx)(`button`,{onClick:()=>s(`zh`),
className:`px-3 min-h-[44px] min-w-[44px] inline-flex items-center justify-center transition-colors ${o===`zh`?`bg-ftg-green text-white`:`text-gray-600 hover:bg-ftg-sand`}`,children:a(`lang.zh`)}),


  (0,A.jsx)(`button`,{onClick:()=>s(`en`),
className:`px-3 min-h-[44px] min-w-[44px] inline-flex items-center justify-center transition-colors ${o===`en`?`bg-ftg-green text-white`:`text-gray-600 hover:bg-ftg-sand`}`,children:a(`lang.en`)})]}),


  (0,A.jsx)(k,{to:`/contact`,className:`bg-ftg-orange text-white px-5 py-2 min-h-[44px] min-w-[44px] inline-flex items-center rounded-full text-sm font-medium hover:bg-orange-600 transition-colors ml-2 shadow-sm`,children:a(`nav.contact`)})]}),


  (0,A.jsx)(`button`,{onClick:()=>t(!e),
className:`lg:hidden min-w-[44px] min-h-[44px] inline-flex items-center justify-center rounded-md text-gray-700 hover:text-ftg-green hover:bg-ftg-sand transition-colors`,"aria-label":`選單`,"aria-expanded":e,children:
  (0,A.jsxs)(`div`,{className:`w-6 h-5 relative flex flex-col justify-between`,children:[
  (0,A.jsx)(`span`,{className:`block h-0.5 w-6 bg-current transform transition-all duration-300 ${e?`rotate-45 translate-y-2`:``}`}),


  (0,A.jsx)(`span`,{className:`block h-0.5 w-6 bg-current transition-all duration-300 ${e?`opacity-0 scale-0`:``}`}),


  (0,A.jsx)(`span`,{className:`block h-0.5 w-6 bg-current transform transition-all duration-300 ${e?`-rotate-45 -translate-y-2`:``}`})]})})]}),


  (0,A.jsx)(`div`,{className:`lg:hidden transition-all duration-300 ${e?`max-h-[80vh] opacity-100 overflow-y-auto overscroll-contain`:`max-h-0 opacity-0 overflow-hidden`}`,children:
  (0,A.jsxs)(`div`,{className:`pb-4 pt-2 border-t border-gray-100`,children:[
  (0,A.jsx)(k,{to:`/`,className:`block px-4 py-3 rounded-lg text-base font-medium text-gray-700 hover:text-ftg-green hover:bg-ftg-sand`,onClick:()=>t(!1),
children:a(`nav.home`)}),


  (0,A.jsxs)(`div`,{children:[
  (0,A.jsxs)(`button`,{onClick:()=>r(!n),
className:`w-full flex items-center justify-between px-4 py-3 rounded-lg text-base font-medium text-gray-700 hover:text-ftg-green hover:bg-ftg-sand`,children:[a(`nav.products`),

  (0,A.jsx)(`svg`,{className:`h-4 w-4 transition-transform duration-200 ${n?`rotate-180`:``}`,fill:`none`,stroke:`currentColor`,viewBox:`0 0 24 24`,children:
  (0,A.jsx)(`path`,{strokeLinecap:`round`,strokeLinejoin:`round`,strokeWidth:2,d:`M19 9l-7 7-7-7`})})]}),


  (0,A.jsx)(`div`,{className:`transition-all duration-300 ${n?`max-h-[60vh] opacity-100 overflow-y-auto`:`max-h-0 opacity-0 overflow-hidden`}`,children:
  (0,A.jsx)(`div`,{className:`pl-4 py-1`,children:c.map(e=>
  (0,A.jsx)(k,{to:e.path,className:`block px-4 py-2.5 min-h-[44px] inline-flex items-center rounded-lg text-sm ${i.pathname===e.path?`text-ftg-green bg-ftg-sand font-semibold`:`text-gray-600 hover:text-ftg-green hover:bg-ftg-sand`}`,onClick:()=>t(!1),
children:e.label},e.path))})})]}),


  (0,A.jsxs)(`div`,{className:`flex items-center gap-2 px-4 mt-3`,children:[
  (0,A.jsxs)(`span`,{className:`text-sm text-gray-500`,children:[a(`lang.label`),
`：`]}),


  (0,A.jsxs)(`div`,{className:`flex border border-gray-200 rounded-full overflow-hidden`,children:[
  (0,A.jsx)(`button`,{onClick:()=>s(`zh`),
className:`px-3 min-h-[44px] min-w-[44px] inline-flex items-center justify-center text-sm font-medium ${o===`zh`?`bg-ftg-green text-white`:`text-gray-600`}`,children:a(`lang.zh`)}),


  (0,A.jsx)(`button`,{onClick:()=>s(`en`),
className:`px-3 min-h-[44px] min-w-[44px] inline-flex items-center justify-center text-sm font-medium ${o===`en`?`bg-ftg-green text-white`:`text-gray-600`}`,children:a(`lang.en`)})]})]}),


  (0,A.jsx)(k,{to:`/contact`,className:`block mx-4 mt-4 bg-ftg-orange text-white px-6 py-3 rounded-full text-sm font-medium text-center shadow-sm`,onClick:()=>t(!1),
children:a(`nav.contact`)})]})})]})})}

export default ur;
