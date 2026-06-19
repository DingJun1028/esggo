# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: triple-layer.spec.ts >> Triple Layer Ascension Visual Regression >> full page snapshot
- Location: tests\vrt\triple-layer.spec.ts:4:3

# Error details

```
TimeoutError: page.waitForSelector: Timeout 10000ms exceeded.
Call log:
  - waiting for locator('text=Triple Layer Ascension Validation') to be visible

```

# Page snapshot

```yaml
- generic [ref=e1]:
  - generic [active]:
    - generic [ref=e4]:
      - generic [ref=e5]:
        - generic [ref=e6]:
          - navigation [ref=e7]:
            - button "previous" [disabled] [ref=e8]:
              - img "previous" [ref=e9]
            - generic [ref=e11]:
              - generic [ref=e12]: 1/
              - text: "3"
            - button "next" [ref=e13] [cursor=pointer]:
              - img "next" [ref=e14]
          - img
        - generic [ref=e16]:
          - generic [ref=e17]:
            - img [ref=e18]
            - generic "Latest available version is detected (16.2.9)." [ref=e20]: Next.js 16.2.9
            - generic [ref=e21]: Turbopack
          - img
      - dialog "Runtime Error" [ref=e23]:
        - generic [ref=e26]:
          - generic [ref=e27]:
            - generic [ref=e28]:
              - generic [ref=e30]: Runtime Error
              - generic [ref=e31]:
                - button "Copy Error Info" [ref=e32] [cursor=pointer]:
                  - img [ref=e33]
                - button "No related documentation found" [disabled] [ref=e35]:
                  - img [ref=e36]
                - button "Attach Node.js inspector" [ref=e38] [cursor=pointer]:
                  - img [ref=e39]
            - generic [ref=e48]: "Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: undefined. You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports. Check the render method of `ToastContainer`."
          - generic [ref=e49]:
            - generic [ref=e50]:
              - paragraph [ref=e52]:
                - img [ref=e54]
                - generic [ref=e57]: app\layout.tsx (76:11) @ RootLayout
                - button "Open in editor" [ref=e58] [cursor=pointer]:
                  - img [ref=e60]
              - generic [ref=e63]:
                - generic [ref=e64]: 74 | <body suppressHydrationWarning>
                - generic [ref=e65]: "75 | <Suspense fallback={<LoadingFallback />}>"
                - generic [ref=e66]: "> 76 | <ClientLayout>{children}</ClientLayout>"
                - generic [ref=e67]: "| ^"
                - generic [ref=e68]: 77 | </Suspense>
                - generic [ref=e69]: 78 | </body>
                - generic [ref=e70]: 79 | </html>
            - generic [ref=e71]:
              - paragraph [ref=e73]:
                - text: Call Stack
                - generic [ref=e74]: "20"
              - generic [ref=e75]:
                - generic [ref=e76]: createFiberFromTypeAndProps
                - text: .next\dev\static\chunks\01ho_next_dist_compiled_react-dom_0adj4wp._.js (3167:32)
              - generic [ref=e77]:
                - generic [ref=e78]: createFiberFromElement
                - text: .next\dev\static\chunks\01ho_next_dist_compiled_react-dom_0adj4wp._.js (3178:16)
              - generic [ref=e79]:
                - generic [ref=e80]: reconcileChildFibersImpl
                - text: .next\dev\static\chunks\01ho_next_dist_compiled_react-dom_0adj4wp._.js (4206:421)
              - generic [ref=e81]:
                - generic [ref=e82]: <unknown>
                - text: .next\dev\static\chunks\01ho_next_dist_compiled_react-dom_0adj4wp._.js (4261:39)
              - generic [ref=e83]:
                - generic [ref=e84]: reconcileChildren
                - text: .next\dev\static\chunks\01ho_next_dist_compiled_react-dom_0adj4wp._.js (5898:51)
              - generic [ref=e85]:
                - generic [ref=e86]: beginWork
                - text: .next\dev\static\chunks\01ho_next_dist_compiled_react-dom_0adj4wp._.js (6758:1573)
              - generic [ref=e87]:
                - generic [ref=e88]: runWithFiberInDEV
                - text: .next\dev\static\chunks\01ho_next_dist_compiled_react-dom_0adj4wp._.js (965:74)
              - generic [ref=e89]:
                - generic [ref=e90]: performUnitOfWork
                - text: .next\dev\static\chunks\01ho_next_dist_compiled_react-dom_0adj4wp._.js (9555:97)
              - generic [ref=e91]:
                - generic [ref=e92]: workLoopSync
                - text: .next\dev\static\chunks\01ho_next_dist_compiled_react-dom_0adj4wp._.js (9449:40)
              - generic [ref=e93]:
                - generic [ref=e94]: renderRootSync
                - text: .next\dev\static\chunks\01ho_next_dist_compiled_react-dom_0adj4wp._.js (9433:13)
              - generic [ref=e95]:
                - generic [ref=e96]: performWorkOnRoot
                - text: .next\dev\static\chunks\01ho_next_dist_compiled_react-dom_0adj4wp._.js (9098:47)
              - generic [ref=e97]:
                - generic [ref=e98]: performSyncWorkOnRoot
                - text: .next\dev\static\chunks\01ho_next_dist_compiled_react-dom_0adj4wp._.js (10263:9)
              - generic [ref=e99]:
                - generic [ref=e100]: flushSyncWorkAcrossRoots_impl
                - text: .next\dev\static\chunks\01ho_next_dist_compiled_react-dom_0adj4wp._.js (10179:316)
              - generic [ref=e101]:
                - generic [ref=e102]: flushPassiveEffects
                - text: .next\dev\static\chunks\01ho_next_dist_compiled_react-dom_0adj4wp._.js (10008:13)
              - generic [ref=e103]:
                - generic [ref=e104]: <unknown>
                - text: .next\dev\static\chunks\01ho_next_dist_compiled_react-dom_0adj4wp._.js (9724:13)
              - generic [ref=e105]:
                - generic [ref=e106]: MessagePort.performWorkUntilDeadline
                - text: .next\dev\static\chunks\01ho_next_dist_compiled_055bvsu._.js (2647:64)
              - generic [ref=e107]:
                - generic [ref=e108]: ToastContainer
                - text: .next\dev\static\chunks\_1-b56y8._.js (2902:332)
              - generic [ref=e109]:
                - generic [ref=e110]: AppContent
                - text: .next\dev\static\chunks\_1-b56y8._.js (9131:330)
              - generic [ref=e111]:
                - generic [ref=e112]: ClientLayout
                - text: .next\dev\static\chunks\_1-b56y8._.js (9216:348)
              - generic [ref=e113]:
                - generic [ref=e114]:
                  - text: RootLayout
                  - button "Open RootLayout in editor" [ref=e115] [cursor=pointer]:
                    - img [ref=e116]
                - text: app\layout.tsx (76:11)
        - generic [ref=e118]: "1"
        - generic [ref=e119]: "2"
    - generic [ref=e124] [cursor=pointer]:
      - button "Open Next.js Dev Tools" [ref=e125]:
        - img [ref=e126]
      - generic [ref=e129]:
        - button "Open issues overlay" [ref=e130]:
          - generic [ref=e131]:
            - generic [ref=e132]: "2"
            - generic [ref=e133]: "3"
          - generic [ref=e134]:
            - text: Issue
            - generic [ref=e135]: s
        - button "Collapse issues badge" [ref=e136]:
          - img [ref=e137]
  - generic [ref=e139]:
    - img [ref=e141]
    - generic [ref=e143]:
      - heading "系統發生未預期錯誤" [level=1] [ref=e144]
      - paragraph [ref=e145]: 系統已自動觸發 5T 治理保護機制，您的資料安全無虞。OmniAgent 已記錄此錯誤以進行根因分析。
    - paragraph [ref=e147]: "Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: undefined. You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports. Check the render method of `ToastContainer`."
    - generic [ref=e148]:
      - button "返回主控台" [ref=e149]
      - button "嘗試自動修復 (Auto-Heal)" [ref=e150]:
        - img [ref=e152]
        - text: 嘗試自動修復 (Auto-Heal)
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Triple Layer Ascension Visual Regression', () => {
  4  |   test('full page snapshot', async ({ page }) => {
  5  |     await page.goto('http://localhost:3001/test-triple');
> 6  |     await page.waitForSelector('text=Triple Layer Ascension Validation', { timeout: 10000 });
     |                ^ TimeoutError: page.waitForSelector: Timeout 10000ms exceeded.
  7  |     // Wait for the components to load
  8  |     await page.waitForTimeout(1000);
  9  |     expect(await page.screenshot({ fullPage: true })).toMatchSnapshot('triple-layer-full.png');
  10 |   });
  11 | 
  12 |   test('Alliance Hub component snapshot', async ({ page }) => {
  13 |     await page.goto('http://localhost:3001/test-triple');
  14 |     const allianceHub = page.locator('section').filter({ hasText: 'Alliance Hub' });
  15 |     await allianceHub.waitFor({ state: 'visible' });
  16 |     expect(await allianceHub.screenshot()).toMatchSnapshot('alliance-hub.png');
  17 |   });
  18 | });
  19 | 
```