# UIUX Best-Practice 標準 — 萬能語音轉字幕平台

用戶反覆要求「美感提升 / 全部最佳實踐設計 / UIUX 提升」。以下是本 app 三頁（studio / overlay / stream / index）統一採用的設計 token 與元件樣板，新頁直接抄。

## 設計 Token（:root CSS 變數，全頁共用）

```css
:root{
  --bg:#070b12;
  --panel:rgba(20,27,41,.72);     /* 玻璃面板 */
  --panel2:rgba(14,22,35,.6);     /* 次面板 / 輸入框底 */
  --accent:#36e0c0;               /* 主青綠（全站唯一主色）*/
  --accent2:#5b8cff;              /* 輔藍（漸層用）*/
  --txt:#eaf1fb;
  --muted:#8a97ad;
  --danger:#ff5d6c;
  --rec:#ff4d5e;                  /* 錄音態 */
  --line:rgba(255,255,255,.09);
  --radius:18px;
  --gap:clamp(12px,2.6vw,18px);
  --font:"Segoe UI",system-ui,-apple-system,"PingFang TC","Microsoft JhengHei",sans-serif;
}
```

## 背景（雙 radial-gradient 疊深色，固定）

```css
body{
  background:
    radial-gradient(900px 500px at 85% -5%,rgba(91,140,255,.18),transparent 60%),
    radial-gradient(700px 500px at 10% 110%,rgba(54,224,192,.16),transparent 55%),
    var(--bg);
  background-attachment:fixed;
}
```

## 玻璃面板

```css
.wrap{
  background:var(--panel);border:1px solid var(--line);border-radius:var(--radius);
  box-shadow:0 18px 50px rgba(0,0,0,.4),inset 0 1px 0 rgba(255,255,255,.05);
  backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px);
}
```

## 主按鈕（漸層 + 微光）

```css
.start-btn{
  background:linear-gradient(135deg,var(--accent),var(--accent2));color:#04130f;border:0;
  box-shadow:0 8px 26px rgba(54,224,192,.32);font-weight:800;border-radius:14px;
}
.start-btn:hover{filter:brightness(1.06);transform:translateY(-1px);}
```

## 語言膠囊 chips（取代隱藏 multi-select）

```css
.chip{padding:8px 15px;border-radius:999px;border:1px solid var(--line);
  background:var(--panel2);color:var(--muted);cursor:pointer;font-weight:600;transition:.18s}
.chip.on{background:linear-gradient(135deg,var(--accent),var(--accent2));color:#04130f;border-color:transparent;
  box-shadow:0 4px 16px rgba(54,224,192,.35)}
```
JS：點擊 toggle active Set，至少保留 1 個；onText/appendPreview 用 Array.from(active) 作 targets。

## 錄音態視覺回饋（脈動紅點 + 均衡器）

```css
.dot.rec{background:var(--rec);animation:pulse 1.1s infinite}
@keyframes pulse{0%{box-shadow:0 0 0 0 rgba(255,77,94,.6)}70%{box-shadow:0 0 0 9px rgba(255,77,94,0)}100%{box-shadow:0 0 0 0 rgba(255,77,94,0)}}
.eq{display:none;gap:3px;align-items:flex-end;height:20px}
.start-btn.recording .eq{display:flex}
.eq i{width:3px;background:#fff;border-radius:2px;animation:eq .9s ease-in-out infinite}
.eq i:nth-child(1){animation-delay:0s}.eq i:nth-child(2){animation-delay:.15s}.eq i:nth-child(3){animation-delay:.3s}.eq i:nth-child(4){animation-delay:.45s}
@keyframes eq{0%,100%{height:5px}50%{height:20px}}
```
JS：錄音中給按鈕加 .recording class（切換文字 + 顯示 .eq）。

## 字幕卡 / 浮層進場動畫

```css
.utter{animation:slideIn .35s cubic-bezier(.2,.8,.2,1)}
@keyframes slideIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
.caption{opacity:0;transition:opacity .3s ease}
.caption.show{opacity:1;animation:pop .3s cubic-bezier(.2,.8,.2,1)}
@keyframes pop{from{opacity:0;transform:translateX(-50%) translateY(14px) scale(.97)}to{opacity:1;transform:translateX(-50%) translateY(0) scale(1)}}
```

## 半透明浮層字幕（疊 Zoom，pointer-events 穿透）

```css
#stage{position:fixed;inset:0;pointer-events:none;z-index:1}
#caption{position:absolute;left:50%;bottom:7vh;transform:translateX(-50%);
  background:linear-gradient(135deg,rgba(12,18,30,.7),rgba(8,12,20,.55));
  backdrop-filter:blur(14px) saturate(140%);border:1px solid rgba(255,255,255,.16);
  border-radius:20px;padding:16px 26px;box-shadow:0 16px 50px rgba(0,0,0,.55);
  text-align:center;opacity:0;transition:opacity .3s ease;pointer-events:none}
.caption .src{font-size:clamp(1.15rem,2.7vw,1.7rem);color:#fff;font-weight:700;text-shadow:0 2px 8px rgba(0,0,0,.8)}
.caption .trs{margin-top:6px;display:flex;flex-wrap:wrap;gap:4px 18px;justify-content:center}
.caption .trs .pair{font-size:clamp(.95rem,2.2vw,1.28rem);color:var(--trs)}
.caption .trs .lbl{color:#9fb0c7;font-size:.78em;font-weight:600;margin-right:7px;text-transform:uppercase}
```
工具列平時 transform:translateY(-100%) 隱藏，滑鼠移到頂部 (e.clientY<60) 或按 H 喚出，3 秒後自動收起。

## 入口導覽卡片（index.html）

```css
.card{background:var(--panel);border:1px solid var(--line);border-radius:var(--radius);padding:20px;
  box-shadow:0 18px 50px rgba(0,0,0,.4),inset 0 1px 0 rgba(255,255,255,.05);
  backdrop-filter:blur(18px);text-decoration:none;color:inherit;transition:.2s}
.card:hover{transform:translateY(-3px);border-color:var(--accent)}
.card .badge{position:absolute;top:14px;right:14px;font-size:.68rem;padding:3px 9px;border-radius:999px;
  background:rgba(54,224,192,.15);color:var(--accent);border:1px solid rgba(54,224,192,.3)}
```
網格用 grid-template-columns:repeat(auto-fit,minmax(260px,1fr)) 自適應。

## 深色/淺色切換（全頁通用）

```js
const themeBtn=document.getElementById('themeBtn');
function applyTheme(t){document.documentElement.dataset.theme=t;themeBtn.textContent=t==='light'?'☀️':'🌙';localStorage.setItem('ut-theme',t);}
applyTheme(localStorage.getItem('ut-theme')||'dark');
themeBtn.onclick=()=>applyTheme(document.documentElement.dataset.theme==='light'?'dark':'light');
```
淺色用 html[data-theme="light"]{--bg:#eef2f7;--panel:rgba(255,255,255,.85);--txt:#16202e;...} 覆寫變數即可。
