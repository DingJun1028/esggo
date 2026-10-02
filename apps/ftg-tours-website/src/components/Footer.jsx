/* 5T-Traceable: imports restore the bundle-scope bindings this lifted function
 * depended on. Resolved against the deployed bundle by definition body, not by
 * guesswork: A = react/jsx-runtime, k = Link, lr = useLanguage,
 * j = COMPANY. Function body is otherwise untouched.
 */
import * as A from 'react/jsx-runtime';
import { Link as k } from 'react-router-dom';
import { useLanguage as lr } from '../i18n';
import { COMPANY as j } from '../data/siteData';

function fr(){let{t:e}=lr();return
  (0,A.jsx)(`footer`,{className:`bg-ftg-forest text-white`,children:
  (0,A.jsxs)(`div`,{className:`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14`,children:[
  (0,A.jsxs)(`div`,{className:`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8`,children:[
  (0,A.jsxs)(`div`,{className:`sm:col-span-2 lg:col-span-1`,children:[
  (0,A.jsx)(`img`,{src:`/images/logo.webp`,alt:`墾趣旅遊 FTG TOURS`,className:`h-10 md:h-12 w-auto mb-4`}),


  (0,A.jsx)(`p`,{className:`text-gray-300 text-sm leading-relaxed`,children:e(`footer.brandTagline`)})]}),


  (0,A.jsxs)(`div`,{children:[
  (0,A.jsx)(`h4`,{className:`text-base font-semibold mb-3 md:mb-4`,children:e(`footer.corpPrograms`)}),


  (0,A.jsxs)(`ul`,{className:`space-y-2 text-sm`,children:[
  (0,A.jsx)(`li`,{children:
  (0,A.jsx)(k,{to:`/corporate-travel`,className:`text-gray-300 hover:text-white transition-colors inline-flex items-center min-h-[44px] min-w-[44px] px-2 -mx-2`,children:e(`products.corpTravel`)})}),


  (0,A.jsx)(`li`,{children:
  (0,A.jsx)(k,{to:`/family-day`,className:`text-gray-300 hover:text-white transition-colors inline-flex items-center min-h-[44px] min-w-[44px] px-2 -mx-2`,children:e(`products.familyDay`)})}),


  (0,A.jsx)(`li`,{children:
  (0,A.jsx)(k,{to:`/esg-team-day`,className:`text-gray-300 hover:text-white transition-colors inline-flex items-center min-h-[44px] min-w-[44px] px-2 -mx-2`,children:e(`products.esgTeamDay`)})}),


  (0,A.jsx)(`li`,{children:
  (0,A.jsx)(k,{to:`/wellbeing-retreat`,className:`text-gray-300 hover:text-white transition-colors inline-flex items-center min-h-[44px] min-w-[44px] px-2 -mx-2`,children:e(`products.wellbeing`)})})]})]}),


  (0,A.jsxs)(`div`,{children:[
  (0,A.jsx)(`h4`,{className:`text-base font-semibold mb-3 md:mb-4`,children:e(`footer.advancedPrograms`)}),


  (0,A.jsxs)(`ul`,{className:`space-y-2 text-sm`,children:[
  (0,A.jsx)(`li`,{children:
  (0,A.jsx)(k,{to:`/executive-retreat`,className:`text-gray-300 hover:text-white transition-colors inline-flex items-center min-h-[44px] min-w-[44px] px-2 -mx-2`,children:e(`products.executive`)})}),


  (0,A.jsx)(`li`,{children:
  (0,A.jsx)(k,{to:`/esg-impact-note`,className:`text-gray-300 hover:text-white transition-colors inline-flex items-center min-h-[44px] min-w-[44px] px-2 -mx-2`,children:e(`products.impactNote`)})}),


  (0,A.jsx)(`li`,{children:
  (0,A.jsx)(k,{to:`/journey-design`,className:`text-gray-300 hover:text-white transition-colors inline-flex items-center min-h-[44px] min-w-[44px] px-2 -mx-2`,children:e(`nav.journeyDesign`)})})]})]}),


  (0,A.jsxs)(`div`,{children:[
  (0,A.jsx)(`h4`,{className:`text-base font-semibold mb-3 md:mb-4`,children:e(`footer.contactUs`)}),


  (0,A.jsxs)(`ul`,{className:`space-y-2 text-sm text-gray-300`,children:[
  (0,A.jsxs)(`li`,{children:[e(`footer.phone`),
`：`,j.phone]}),


  (0,A.jsxs)(`li`,{children:[e(`footer.email`),
`：`,j.email]}),


  (0,A.jsxs)(`li`,{children:[e(`footer.address`),
`：`,j.address]}),


  (0,A.jsxs)(`li`,{children:[e(`footer.line`),
`：`,j.lineId]})]})]})]}),


  (0,A.jsx)(`div`,{className:`border-t border-green-500 mt-8 pt-6 text-sm text-gray-400`,children:
  (0,A.jsxs)(`div`,{className:`flex flex-col md:flex-row items-center justify-between gap-4`,children:[
  (0,A.jsxs)(`div`,{className:`flex items-center gap-3`,children:[
  (0,A.jsx)(`img`,{src:`/images/logo.webp`,alt:`墾趣旅遊 FTG TOURS`,className:`h-8 w-auto`}),


  (0,A.jsxs)(`p`,{children:[`© 2026 FTG TOURS 墾趣旅遊. `,e(`footer.rights`)]})]}),


  (0,A.jsxs)(`div`,{className:`space-x-4`,children:[
  (0,A.jsx)(k,{to:`/about`,className:`hover:text-white transition-colors inline-flex items-center min-h-[44px] min-w-[44px] px-2 -mx-2`,children:e(`footer.about`)}),


  (0,A.jsx)(k,{to:`/privacy`,className:`hover:text-white transition-colors inline-flex items-center min-h-[44px] min-w-[44px] px-2 -mx-2`,children:e(`footer.privacy`)}),


  (0,A.jsx)(k,{to:`/terms`,className:`hover:text-white transition-colors inline-flex items-center min-h-[44px] min-w-[44px] px-2 -mx-2`,children:e(`footer.terms`)})]})]})})]})})}

export default fr;
