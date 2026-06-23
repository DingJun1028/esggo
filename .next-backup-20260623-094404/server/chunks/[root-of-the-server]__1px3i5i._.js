module.exports=[918622,(e,t,r)=>{t.exports=e.x("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js",()=>require("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js"))},556704,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/work-async-storage.external.js",()=>require("next/dist/server/app-render/work-async-storage.external.js"))},832319,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/work-unit-async-storage.external.js",()=>require("next/dist/server/app-render/work-unit-async-storage.external.js"))},324725,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/after-task-async-storage.external.js",()=>require("next/dist/server/app-render/after-task-async-storage.external.js"))},193695,(e,t,r)=>{t.exports=e.x("next/dist/shared/lib/no-fallback-error.external.js",()=>require("next/dist/shared/lib/no-fallback-error.external.js"))},442315,(e,t,r)=>{"use strict";t.exports=e.r(918622)},256104,e=>{"use strict";class t{tokenId;tokenSecret;companyId;projectId;baseUrl;constructor(e){this.tokenId=e?.tokenId||process.env.BLUE_CC_TOKEN_ID||"",this.tokenSecret=e?.tokenSecret||process.env.BLUE_CC_API_KEY||"",this.companyId=e?.companyId||process.env.BLUE_CC_COMPANY_ID||"",this.projectId=e?.projectId||process.env.BLUE_CC_PROJECT_ID,this.baseUrl=e?.baseUrl||"https://api.blue.cc/graphql"}async request(e,t){if(!this.tokenId||!this.tokenSecret)return{success:!1,error:"Blue.cc auth incomplete: BLUE_CC_TOKEN_ID / BLUE_CC_API_KEY required"};let r={"Content-Type":"application/json","X-Bloo-Token-ID":this.tokenId,"X-Bloo-Token-Secret":this.tokenSecret,"X-Bloo-Company-ID":this.companyId};this.projectId&&(r["X-Bloo-Project-ID"]=this.projectId);try{let s=await fetch(this.baseUrl,{method:"POST",headers:r,body:JSON.stringify({query:e,variables:t})});if(!s.ok){let e=await s.text();return{success:!1,error:`HTTP ${s.status}: ${e}`}}let a=await s.json();if(a.errors){let e=a.errors.map(e=>e.message).join("; ");return{success:!1,error:`GraphQL Error: ${e}`}}return{success:!0,data:a.data}}catch(e){return{success:!1,error:`Request Failed: ${e.message}`}}}async getCurrentUser(){return this.request("query { currentUser { id email fullName companies { id name slug } } }")}async getOrganization(){return this.request("query { company { id name slug } }")}async listProjects(){let e=`
      query ProjectList($companyId: String!) {
        projectList(filter: { companyIds: [$companyId] }) {
          items { id name slug updatedAt createdAt }
          pageInfo { totalItems hasNextPage }
        }
      }
    `,t=await this.request(e,{companyId:this.companyId});return t.success&&t.data?.projectList?{success:!0,data:{items:t.data.projectList.items,totalItems:t.data.projectList.pageInfo?.totalItems||0}}:t}async getProject(e){return this.request("query GetProject($id: String!) { project(id: $id) { id name slug updatedAt createdAt } }",{id:e})}async listTodoLists(e){let t=e||this.projectId;if(!t)return{success:!1,error:"projectId is required"};let r=`
      query TodoLists($projectId: String!) {
        todoLists(projectId: $projectId) {
          id
          title
          todosCount
          completed
          position
        }
      }
    `,s=await this.request(r,{projectId:t});return s.success&&s.data?.todoLists?{success:!0,data:s.data.todoLists}:s}async getTodoListWithTodos(e,t=50){let r=`
      query TodoListWithTodos($id: String!) {
        todoList(id: $id) {
          id
          title
          todosCount
          completed
          todos {
            id
            uid
            title
            text
            done
            archived
            color
            duedAt
            startedAt
            completedAt
            createdAt
            updatedAt
            commentCount
            checklistCount
            checklistCompletedCount
            todoCustomFields {
              id
              value
              customField {
                id
                name
                type
              }
            }
            users {
              id
              email
              fullName
            }
            tags {
              id
              name
              color
            }
          }
        }
      }
    `;return this.request(r,{id:e})}async listRecords(e){if(e){let t=await this.getTodoListWithTodos(e);return t.success&&t.data?{success:!0,data:{items:t.data.todos||[],totalItems:t.data.todosCount||0}}:t}let t=await this.listTodoLists();if(!t.success||!t.data)return{success:!1,error:t.error};let r=[];for(let e of t.data){let t=await this.getTodoListWithTodos(e.id);t.success&&t.data?.todos&&r.push(...t.data.todos.map(t=>({...t,todoList:{id:e.id,title:e.title}})))}return{success:!0,data:{items:r,totalItems:r.length}}}async getRecord(e){let t=`
      query GetRecord($id: String!) {
        todo(id: $id) {
          id
          uid
          title
          text
          done
          archived
          color
          duedAt
          createdAt
          updatedAt
          todoCustomFields {
            id
            value
            customField {
              id
              name
              type
            }
          }
          users {
            id
            email
            fullName
          }
        }
      }
    `;return this.request(t,{id:e})}async createRecord(e,t,r){let s=`
      mutation CreateRecord($input: TodoCreateInput!) {
        todoCreate(input: $input) {
          id
          uid
          title
          done
          createdAt
        }
      }
    `;return this.request(s,{input:{title:e,...t?{todoListId:t}:{},...r?{customFields:r}:{}}})}async updateRecord(e,t){let r=`
      mutation UpdateRecord($id: String!, $input: TodoUpdateInput!) {
        todoUpdate(id: $id, input: $input) {
          id
          title
          done
          text
          updatedAt
        }
      }
    `;return this.request(r,{id:e,input:t})}async toggleRecordDone(e,t){return this.updateRecord(e,{done:t})}async listCustomFields(){let e=`
      query CustomFieldList {
        customFieldList {
          items {
            id
            name
            type
          }
        }
      }
    `,t=await this.request(e);return t.success&&t.data?.customFieldList?{success:!0,data:t.data.customFieldList.items}:t}async getTodoGroups(e,t){let r=t||this.companyId,s=`
      query TodoGroups($type: TodoGroupType!, $filter: TodosFilter!) {
        todoGroups(type: $type, filter: $filter) {
          items {
            id
            name
            type
            todoCount
          }
          pageInfo {
            totalItems
            hasNextPage
          }
        }
      }
    `,a=await this.request(s,{type:e,filter:{companyIds:[r]}});return a.success&&a.data?.todoGroups?{success:!0,data:{items:a.data.todoGroups.items,totalItems:a.data.todoGroups.pageInfo?.totalItems||0}}:a}}new t,e.s(["BlueCcClient",0,t,"blueCC",0,{deployAgent:async(e,t)=>({deployment_id:`mock-${Date.now()}`}),getSystemStatus:async()=>({healthy:!0,active_nodes:3,last_sync:new Date().toISOString()}),listResources:async()=>[]}])},623849,e=>{"use strict";var t=e.i(747909),r=e.i(174017),s=e.i(996250),a=e.i(759756),o=e.i(561916),i=e.i(174677),n=e.i(869741),d=e.i(316795),u=e.i(487718),l=e.i(995169),c=e.i(47587),p=e.i(666012),h=e.i(570101),m=e.i(626937),y=e.i(10372),g=e.i(193695);e.i(52474);var C=e.i(257297),R=e.i(89171),x=e.i(256104);async function I(){try{let e=new x.BlueCcClient,t=await e.listProjects();if(!t.success)return R.NextResponse.json({ok:!1,error:t.error},{status:502});return R.NextResponse.json({ok:!0,workspaces:t.data?.items||[],total:t.data?.totalItems||0})}catch(e){return R.NextResponse.json({ok:!1,error:e.message},{status:500})}}e.s(["GET",0,I],510473);var f=e.i(510473);let v=new t.AppRouteRouteModule({definition:{kind:r.RouteKind.APP_ROUTE,page:"/api/bluecc/workspaces/route",pathname:"/api/bluecc/workspaces",filename:"route",bundlePath:""},distDir:".next",relativeProjectDir:"",resolvedPagePath:"[project]/app/api/bluecc/workspaces/route.ts",nextConfigOutput:"",userland:f,...{}}),{workAsyncStorage:w,workUnitAsyncStorage:E,serverHooks:T}=v;async function A(e,t,s){s.requestMeta&&(0,a.setRequestMeta)(e,s.requestMeta),v.isDev&&(0,a.addRequestMeta)(e,"devRequestTimingInternalsEnd",process.hrtime.bigint());let R="/api/bluecc/workspaces/route";R=R.replace(/\/index$/,"")||"/";let x=await v.prepare(e,t,{srcPage:R,multiZoneDraftMode:!1});if(!x)return t.statusCode=400,t.end("Bad Request"),null==s.waitUntil||s.waitUntil.call(s,Promise.resolve()),null;let{buildId:I,deploymentId:f,params:w,nextConfig:E,parsedUrl:T,isDraftMode:A,prerenderManifest:q,routerServerContext:j,isOnDemandRevalidate:k,revalidateOnlyGenerated:_,resolvedPathname:b,clientReferenceManifest:S,serverActionsManifest:P}=x,N=(0,n.normalizeAppPath)(R),L=!!(q.dynamicRoutes[N]||q.routes[b]),$=async()=>((null==j?void 0:j.render404)?await j.render404(e,t,T,!1):t.end("This page could not be found"),null);if(L&&!A){let e=!!q.routes[b],t=q.dynamicRoutes[N];if(t&&!1===t.fallback&&!e){if(E.adapterPath)return await $();throw new g.NoFallbackError}}let U=null;!L||v.isDev||A||(U="/index"===(U=b)?"/":U);let O=!0===v.isDev||!L,D=L&&!O;P&&S&&(0,i.setManifestsSingleton)({page:R,clientReferenceManifest:S,serverActionsManifest:P});let B=e.method||"GET",F=(0,o.getTracer)(),H=F.getActiveScopeSpan(),M=!!(null==j?void 0:j.isWrappedByNextServer),G=!!(0,a.getRequestMeta)(e,"minimalMode"),K=(0,a.getRequestMeta)(e,"incrementalCache")||await v.getIncrementalCache(e,E,q,G);null==K||K.resetRequestCache(),globalThis.__incrementalCache=K;let W={params:w,previewProps:q.preview,renderOpts:{experimental:{authInterrupts:!!E.experimental.authInterrupts},cacheComponents:!!E.cacheComponents,supportsDynamicResponse:O,incrementalCache:K,cacheLifeProfiles:E.cacheLife,waitUntil:s.waitUntil,onClose:e=>{t.on("close",e)},onAfterTaskError:void 0,onInstrumentationRequestError:(t,r,s,a)=>v.onRequestError(e,t,s,a,j)},sharedContext:{buildId:I,deploymentId:f}},X=new d.NodeNextRequest(e),V=new d.NodeNextResponse(t),Y=u.NextRequestAdapter.fromNodeNextRequest(X,(0,u.signalFromNodeResponse)(t));try{let a,i=async e=>v.handle(Y,W).finally(()=>{if(!e)return;e.setAttributes({"http.status_code":t.statusCode,"next.rsc":!1});let r=F.getRootSpanAttributes();if(!r)return;if(r.get("next.span_type")!==l.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${r.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let s=r.get("next.route");if(s){let t=`${B} ${s}`;e.setAttributes({"next.route":s,"http.route":s,"next.span_name":t}),e.updateName(t),a&&a!==e&&(a.setAttribute("http.route",s),a.updateName(t))}else e.updateName(`${B} ${R}`)}),n=async a=>{var o,n;let d=async({previousCacheEntry:r})=>{try{if(!G&&k&&_&&!r)return t.statusCode=404,t.setHeader("x-nextjs-cache","REVALIDATED"),t.end("This page could not be found"),null;let o=await i(a);e.fetchMetrics=W.renderOpts.fetchMetrics;let n=W.renderOpts.pendingWaitUntil;n&&s.waitUntil&&(s.waitUntil(n),n=void 0);let d=W.renderOpts.collectedTags;if(!L)return await (0,p.sendResponse)(X,V,o,W.renderOpts.pendingWaitUntil),null;{let e=await o.blob(),t=(0,h.toNodeOutgoingHttpHeaders)(o.headers);d&&(t[y.NEXT_CACHE_TAGS_HEADER]=d),!t["content-type"]&&e.type&&(t["content-type"]=e.type);let r=void 0!==W.renderOpts.collectedRevalidate&&!(W.renderOpts.collectedRevalidate>=y.INFINITE_CACHE)&&W.renderOpts.collectedRevalidate,s=void 0===W.renderOpts.collectedExpire||W.renderOpts.collectedExpire>=y.INFINITE_CACHE?void 0:W.renderOpts.collectedExpire;return{value:{kind:C.CachedRouteKind.APP_ROUTE,status:o.status,body:Buffer.from(await e.arrayBuffer()),headers:t},cacheControl:{revalidate:r,expire:s}}}}catch(t){throw(null==r?void 0:r.isStale)&&await v.onRequestError(e,t,{routerKind:"App Router",routePath:R,routeType:"route",revalidateReason:(0,c.getRevalidateReason)({isStaticGeneration:D,isOnDemandRevalidate:k})},!1,j),t}},u=await v.handleResponse({req:e,nextConfig:E,cacheKey:U,routeKind:r.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:q,isRoutePPREnabled:!1,isOnDemandRevalidate:k,revalidateOnlyGenerated:_,responseGenerator:d,waitUntil:s.waitUntil,isMinimalMode:G});if(!L)return null;if((null==u||null==(o=u.value)?void 0:o.kind)!==C.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==u||null==(n=u.value)?void 0:n.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});G||t.setHeader("x-nextjs-cache",k?"REVALIDATED":u.isMiss?"MISS":u.isStale?"STALE":"HIT"),A&&t.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let l=(0,h.fromNodeOutgoingHttpHeaders)(u.value.headers);return G&&L||l.delete(y.NEXT_CACHE_TAGS_HEADER),!u.cacheControl||t.getHeader("Cache-Control")||l.get("Cache-Control")||l.set("Cache-Control",(0,m.getCacheControlHeader)(u.cacheControl)),await (0,p.sendResponse)(X,V,new Response(u.value.body,{headers:l,status:u.value.status||200})),null};M&&H?await n(H):(a=F.getActiveScopeSpan(),await F.withPropagatedContext(e.headers,()=>F.trace(l.BaseServerSpan.handleRequest,{spanName:`${B} ${R}`,kind:o.SpanKind.SERVER,attributes:{"http.method":B,"http.target":e.url}},n),void 0,!M))}catch(t){if(t instanceof g.NoFallbackError||await v.onRequestError(e,t,{routerKind:"App Router",routePath:N,routeType:"route",revalidateReason:(0,c.getRevalidateReason)({isStaticGeneration:D,isOnDemandRevalidate:k})},!1,j),L)throw t;return await (0,p.sendResponse)(X,V,new Response(null,{status:500})),null}}e.s(["handler",0,A,"patchFetch",0,function(){return(0,s.patchFetch)({workAsyncStorage:w,workUnitAsyncStorage:E})},"routeModule",0,v,"serverHooks",0,T,"workAsyncStorage",0,w,"workUnitAsyncStorage",0,E],623849)}];

//# sourceMappingURL=%5Broot-of-the-server%5D__1px3i5i._.js.map