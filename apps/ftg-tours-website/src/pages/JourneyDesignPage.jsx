/* 5T-Traceable: imports below restore the bundle-scope bindings the lifted
 * function body relied on. A/A.jsx = JSX runtime, k = Link, lr = useLanguage,
 * x = React hooks, yr/Ar/kr/wr/M = the shared components. Source bodies are
 * otherwise untouched. */
import * as A from 'react/jsx-runtime'
import { useLanguage as lr } from '../i18n'
import { default as yr } from '../components/Seo'
import { default as M } from '../components/Icon'
import { STREAMS_COPY as N, SIX_STREAMS as Ni } from '../data/siteData'

/* 5T-Traceable: `Pi` in the deployed bundle is this one-line locale picker,
 * assigned as an arrow const (not `function`), which is why a
 * declaration-only extractor misses it. */
const Pi = (stream, lang) => (lang === 'en' ? stream.titleEn : stream.title);
const Fi = (stream, lang) => (lang === 'en' ? stream.descEn : stream.desc);

function Ii(){let{lang:e}=lr(),
t=e===`en`;return yr({title:t?N.titleEn:N.title,description:t?N.metaDescEn:N.metaDesc,path:`/streams`,keywords:t?N.keywordsEn:N.keywords}),


  (0,A.jsxs)(`div`,{className:`min-h-screen pt-20 bg-ftg-deepgreen text-ftg-cream`,children:[
  (0,A.jsxs)(`section`,{className:`py-16 px-4 text-center`,children:[
  (0,A.jsx)(`h1`,{className:`text-4xl font-bold text-ftg-cream text-balance`,children:t?N.titleEn:`${N.title} / ${N.titleEn}`}),


  (0,A.jsxs)(`p`,{className:`mt-4 text-lg text-ftg-cream max-w-3xl mx-auto text-balance`,children:[t?N.subPrefixEn:N.subPrefix,Ni.map((n,r)=>
  (0,A.jsxs)(`span`,{children:[
  (0,A.jsx)(`span`,{className:`whitespace-nowrap`,children:Pi(n,e)}),

r<Ni.length-1?t?N.sepEn:N.sep:null]},n.id))]})]}),


  (0,A.jsx)(`section`,{className:`py-16 px-4 max-w-7xl mx-auto`,children:
  (0,A.jsx)(`div`,{className:`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8`,children:Ni.map(t=>
  (0,A.jsxs)(`div`,{className:`bg-ftg-forest rounded-xl p-6 text-center shadow-lg transition-all hover:scale-105`,children:[
  (0,A.jsx)(`div`,{className:`w-14 h-14 rounded-full bg-ftg-cream/10 flex items-center justify-center mx-auto mb-4 text-ftg-cream`,"aria-hidden":`true`,children:
  (0,A.jsx)(M,{name:t.icon,size:28})}),


  (0,A.jsx)(`h3`,{className:`text-xl font-bold mb-2 text-ftg-cream`,children:Pi(t,e)}),


  (0,A.jsx)(`p`,{className:`text-sm text-ftg-cream`,children:Fi(t,e)})]},t.id))})})]})}

export default Ii;
