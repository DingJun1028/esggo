/* 5T-Traceable: imports below restore the bundle-scope bindings the lifted
 * function body relied on. A/A.jsx = JSX runtime, k = Link, lr = useLanguage,
 * x = React hooks, yr/Ar/kr/wr/M = the shared components. Source bodies are
 * otherwise untouched. */
import * as A from 'react/jsx-runtime'
import { Link as k } from 'react-router-dom'
import { useLanguage as lr } from '../i18n'

function F(){let{t:e}=lr();return
  (0,A.jsxs)(`main`,{style:{minHeight:`70vh`,display:`flex`,flexDirection:`column`,alignItems:`center`,justifyContent:`center`,padding:`40px 20px`,textAlign:`center`},children:[
  (0,A.jsx)(`div`,{style:{fontSize:72,fontWeight:900,color:`#10243f`,lineHeight:1},children:`404`}),


  (0,A.jsx)(`h1`,{style:{color:`#3c6e47`,margin:`16px 0 8px`,fontSize:24},children:e(`notFound.title`)||`找不到這個頁面`}),


  (0,A.jsx)(`p`,{style:{color:`#5b6b7b`,maxWidth:420,marginBottom:24},children:e(`notFound.desc`)||`您要找的旅程頁面可能已移動或網址有誤`}),


  (0,A.jsx)(k,{to:`/`,style:{background:`#c9a24b`,color:`#1a1205`,padding:`12px 28px`,borderRadius:999,fontWeight:700,textDecoration:`none`},children:e(`notFound.back`)||`返回首頁`})]})}

export default F;
