import{omniKnowledge as a}from"./omniKnowledge-ex8FiET1.js";import{o as l}from"./index-B3siCJzx.js";import"./vendor-EOarmDJT.js";import"./utils-C6WEzr3H.js";import"./ui-libs-DWWEjL6X.js";class g{async retrieve(e,t={}){const n=t.limit||5,o=t.knowledgeBases||[];return a.query({limit:n*5}).filter(r=>{if(o.length===0)return!0;const i=r.metadata.knowledgeBase;return o.includes(i)}).map(r=>({id:r.id,content:r.content,relevance_score:this.calculateRelevance(e,r.content),source:r.evidence.source,timestamp:r.metadata.timestamp,knowledgeBase:r.metadata.knowledgeBase})).sort((r,i)=>i.relevance_score-r.relevance_score).slice(0,n)}async augmentPrompt(e,t={}){const n=await this.retrieve(e,t);return n.length===0?e:`請根據以下 ESG 專業知識庫背景資訊回應該問題：

---
${n.map((s,c)=>`[資料集: ${s.knowledgeBase}] [來源: ${s.source}]
${s.content}`).join(`

`)}
---

問題：${e}

請在回答中根據上述資訊進行事實對齊 (Fact Alignment)，並在適當處引用來源。`}async ask(e,t={}){const n=await this.retrieve(e,t);return this.generate(e,n)}async generate(e,t){const n=t.map(r=>`[KB: ${r.knowledgeBase}] [Source: ${r.source}]
${r.content}`).join(`

`),o=await this.generateWithContext(e,n),s=this.extractCitations(o,t),c=this.calculateConfidence(t,s);return l.info("RAG","RAG response generated",{query:e,confidence:c,citations_count:s.length}),{answer:o,citations:s,confidence:c,retrieved_knowledge:t}}calculateRelevance(e,t){const n=this.tokenize(e.toLowerCase()),o=this.tokenize(t.toLowerCase());let s=0;for(const c of n)o.includes(c)&&s++;return n.length>0?s/n.length:0}async generateWithContext(e,t){return t.length===0?`I don't have enough specific ESG context for "${e}".`:`根據智庫檢索結果：

${t.substring(0,500)}...

針對您的問題「${e}」，這涉及到 ESG 標準中的核心原則... (模擬增強回答)`}extractCitations(e,t){const n=[];for(const o of t)this.isUsedInAnswer(e,o.content)&&n.push({text:o.content.substring(0,100)+"...",source:o.source,confidence:o.relevance_score});return n}calculateConfidence(e,t){if(e.length===0)return .2;const n=e.reduce((s,c)=>s+c.relevance_score,0)/e.length,o=e.length>0?t.length/e.length:0;return Math.min(1,n*.6+o*.4+.1)}isUsedInAnswer(e,t){const n=this.tokenize(t.toLowerCase()),o=e.toLowerCase();let s=0;for(const c of n)o.includes(c)&&s++;return n.length>0?s/n.length>.2:!1}tokenize(e){return e.split(/[\s,，。！？；：、]+/).filter(t=>t.length>0)}}const p=new g;export{p as ragEngine};
