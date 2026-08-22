// 即時萬能語音翻譯 — 英文 ⇄ 繁中，自動雙向偵測 + 即時同步分享字幕
// 一體化漂浮式 RWD 極簡影音字幕撥放面板
// 技術：Google Web Speech API (SpeechRecognition + SpeechSynthesis) + MyMemory 免費翻譯
// 分享：BroadcastChannel（同源多標籤即時同步）+ 可選 WebSocket 房間（?room=跨裝置）
// 約束：純免費算力，零付費 API 金鑰。無手動語言切換。

const $ = (id) => document.getElementById(id);
const srcText = $('srcText'), dstText = $('dstText');
const srcK = $('srcK'), dstK = $('dstK'), dirTag = $('dirTag'), roomTag = $('roomTag');
const dot = $('dot'), statusEl = $('status'), warnEl = $('warn'), stage = $('stage');

const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
const synth = window.speechSynthesis;

// ── 房間 / 分享機制 ──
const params = new URLSearchParams(location.search);
let room = params.get('room') || Math.random().toString(36).slice(2, 7);
roomTag.textContent = '房 #' + room;
// 同源即時同步
const bc = ('BroadcastChannel' in window) ? new BroadcastChannel('translate-' + room) : null;
// 可選 WebSocket：若部署端提供 ws://host/ws?room= 則自動連接，否則降級 BroadcastChannel
let ws = null;
function connectWS() {
  const wsUrl = params.get('ws');
  if (!wsUrl) return;
  try {
    ws = new WebSocket(wsUrl + (wsUrl.includes('?') ? '&' : '?') + 'room=' + room);
    ws.onmessage = (e) => applyRemote(JSON.parse(e.data));
    ws.onopen = () => { dot.classList.add('share'); statusEl.textContent = '已連接分享房（跨裝置）'; };
    ws.onclose = () => { ws = null; statusEl.textContent = '分享房斷線，降級同源同步'; };
  } catch (_) { ws = null; }
}
function broadcast(payload) {
  if (ws && ws.readyState === 1) ws.send(JSON.stringify(payload));
  else if (bc) bc.postMessage(payload);
}
if (bc) bc.onmessage = (e) => applyRemote(e.data);

function applyRemote(p) {
  if (!p || !p.src) return;
  srcK.textContent = p.srcK; dstK.textContent = p.dstK;
  dirTag.textContent = p.dir;
  srcText.textContent = p.src; dstText.textContent = p.dst;
  if (p.speak) speak(p.dst, p.dst === '繁中' ? 'zh-TW' : 'en');
  statusEl.textContent = '收到分享字幕（房 #' + room + '）';
}

function warn(msg) {
  if (!msg) { warnEl.classList.remove('show'); warnEl.textContent = ''; return; }
  warnEl.classList.add('show'); warnEl.textContent = msg;
}
if (!SR) { warn('此瀏覽器不支援 Web Speech API，請用 Chrome / Edge（且需 HTTPS）。'); $('startBtn').disabled = true; }

let recog = null, listening = false, sharing = false;

function isCJK(ch) { return /[　-〿぀-ヿ㐀-䶿一-鿿가-힯]/.test(ch); }
function detectLang(t) { return [...t].some(isCJK) ? 'zh-TW' : 'en'; }

async function translate(text, src, dst) {
  const clean = text.trim();
  if (!clean || src === dst) return clean;
  try {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(clean)}&langpair=${src}|${dst}`; 
    const r = await fetch(url);
    if (!r.ok) throw new Error('http ' + r.status);
    const d = await r.json();
    if (d.responseStatus === 200 && d.responseData?.translatedText) return d.responseData.translatedText;
    throw new Error(d.responseDetails || 'failed');
  } catch (e) { statusEl.textContent = '翻譯失敗（' + e.message + '），回退原文。'; return clean; }
}

function speak(text, lang) {
  if (!synth || !text) return;
  const u = new SpeechSynthesisUtterance(text); u.lang = lang; u.rate = 1; u.pitch = 1;
  synth.cancel(); synth.speak(u);
}

async function onResult(ev) {
  const t = ev.results[ev.results.length - 1][0].transcript.trim();
  if (!t) return;
  const src = detectLang(t), dst = src === 'zh-TW' ? 'en' : 'zh-TW';
  const srcLabel = src === 'zh-TW' ? '中文' : 'English';
  const dstLabel = dst === 'zh-TW' ? '繁中' : 'English';
  srcK.textContent = srcLabel; dstK.textContent = dstLabel;
  dirTag.textContent = '自動 · ' + (src === 'zh-TW' ? '中→英' : '英→繁中');
  srcText.textContent = t;
  const out = await translate(t, src, dst);
  dstText.textContent = out;
  statusEl.textContent = '已翻譯';
  speak(out, dst);
  if (sharing) broadcast({ src: t, srcK: srcLabel, dst: out, dstK: dstLabel, dir: dirTag.textContent, speak: true });
}

function start() {
  if (!SR) return;
  recog = new SR();
  recog.continuous = true; recog.interimResults = true; recog.lang = '';
  recog.onresult = onResult;
  recog.onerror = (e) => { statusEl.textContent = '語音錯誤：' + e.error; if (e.error === 'not-allowed') warn('麥克風權限被拒，請允許後重試。'); };
  recog.onend = () => { if (listening) { try { recog.start(); } catch (_) {} } };
  try { recog.start(); listening = true; $('startBtn').disabled = true; $('stopBtn').disabled = false; dot.classList.add('live'); statusEl.textContent = '聆聽中…自動判斷中/英'; }
  catch (e) { statusEl.textContent = '無法啟動：' + e.message; }
}
function stop() {
  listening = false; if (recog) try { recog.stop(); } catch (_) {}
  $('startBtn').disabled = false; $('stopBtn').disabled = true; dot.classList.remove('live'); statusEl.textContent = '已停止。';
}

// 分享開關
function toggleShare() {
  sharing = !sharing;
  $('shareBtn').classList.toggle('on', sharing);
  $('shareBtn').textContent = sharing ? '🔗 分享中' : '🔗 分享字幕';
  if (sharing) { connectWS(); dot.classList.add('share'); statusEl.textContent = '分享字幕開啟（房 #' + room + '）— 複製網址 ?room=' + room + ' 給他人'; }
  else { if (ws) try { ws.close(); } catch(_){} ws = null; dot.classList.remove('share'); statusEl.textContent = '分享字幕關閉。'; }
}

// 浮貼（拖曳）
let pinned = false, drag = null;
function pin() {
  pinned = !pinned; stage.classList.toggle('pinned', pinned);
  $('pinBtn').textContent = pinned ? '⤡ 解除' : '⤢ 浮貼';
  statusEl.textContent = pinned ? '浮貼模式：可拖曳面板至影音上方' : '就緒';
}
stage.addEventListener('pointerdown', (e) => {
  if (!pinned || e.target.closest('button')) return;
  const r = stage.getBoundingClientRect(); drag = { dx: e.clientX - r.left, dy: e.clientY - r.top };
  stage.style.transform = 'none'; stage.setPointerCapture(e.pointerId);
});
stage.addEventListener('pointermove', (e) => {
  if (!pinned || !drag) return;
  stage.style.left = (e.clientX - drag.dx) + 'px'; stage.style.top = (e.clientY - drag.dy) + 'px';
});
stage.addEventListener('pointerup', () => { drag = null; });

$('startBtn').addEventListener('click', start);
$('stopBtn').addEventListener('click', stop);
$('speakBtn').addEventListener('click', () => speak(dstText.textContent, dstK.textContent === '繁中' ? 'zh-TW' : 'en'));
$('pinBtn').addEventListener('click', pin);
$('shareBtn').addEventListener('click', toggleShare);

statusEl.textContent = '就緒 · 英文 ⇄ 繁中 · 自動雙向';
