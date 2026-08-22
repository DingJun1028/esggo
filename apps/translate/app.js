// 即時萬能語音翻譯 — 純前端實作
// 技術：Google Web Speech API (SpeechRecognition + SpeechSynthesis) + MyMemory 免費翻譯
// 約束：純免費算力，零付費 API 金鑰。

const $ = (id) => document.getElementById(id);
const srcText = $('srcText');
const dstText = $('dstText');
const statusEl = $('status');
const warnEl = $('warn');

const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
const synth = window.speechSynthesis;

function showWarn(msg) {
  if (!msg) { warnEl.hidden = true; warnEl.textContent = ''; return; }
  warnEl.hidden = false;
  warnEl.textContent = msg;
}

if (!SR) {
  showWarn('此瀏覽器不支援 Web Speech API。請使用 Chrome / Edge 以獲得即時語音辨識。');
  $('startBtn').disabled = true;
}

let recog = null;
let translating = false;

// MyMemory 免費翻譯（無金鑰，限額 500 字/次，每日 5000 字）
async function translate(text, src, dst) {
  const clean = text.trim();
  if (!clean) return '';
  // 若來源=目標語言（例如自動偵測同語），原樣回傳
  if (src === dst) return clean;
  try {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(clean)}&langpair=${src}|${dst}`;
    const r = await fetch(url);
    if (!r.ok) throw new Error('translate http ' + r.status);
    const data = await r.json();
    if (data.responseStatus === 200 && data.responseData && data.responseData.translatedText) {
      return data.responseData.translatedText;
    }
    throw new Error(data.responseDetails || 'translate failed');
  } catch (e) {
    statusEl.textContent = '翻譯失敗（' + e.message + '），回退原文。';
    return clean;
  }
}

function langCodeToMyMemory(lang) {
  // MyMemory 用 zh-TW / en / ja / ko 等簡碼
  if (lang === 'zh-TW' || lang === 'zh-CN') return 'zh-TW';
  return lang.split('-')[0];
}

function speak(text, lang) {
  if (!synth || !text) return;
  const u = new SpeechSynthesisUtterance(text);
  u.lang = lang || 'zh-TW';
  synth.cancel();
  synth.speak(u);
}

async function onResult(ev) {
  const transcript = ev.results[ev.results.length - 1][0].transcript;
  srcText.textContent = transcript;
  const src = $('srcLang').value || 'auto';
  const dst = $('dstLang').value;
  const srcMM = src === 'auto' ? 'zh-TW' : langCodeToMyMemory($('srcLang').value);
  const out = await translate(transcript, srcMM, dst);
  dstText.textContent = out;
  statusEl.textContent = '已翻譯。';
  // 若目標為中文，自動朗讀
  if (dst.startsWith('zh')) speak(out, 'zh-TW');
}

function start() {
  if (!SR) return;
  recog = new SR();
  recog.continuous = true;
  recog.interimResults = true;
  recog.lang = $('srcLang').value || 'zh-TW';
  recog.onresult = onResult;
  recog.onerror = (e) => {
    statusEl.textContent = '語音辨識錯誤：' + e.error;
    if (e.error === 'not-allowed') showWarn('麥克風權限被拒。請允許麥克風後重試。');
  };
  recog.onend = () => {
    if (translating) { try { recog.start(); } catch (_) {} }
  };
  try {
    recog.start();
    translating = true;
    $('startBtn').disabled = true;
    $('stopBtn').disabled = false;
    statusEl.textContent = '聆聽中…';
  } catch (e) {
    statusEl.textContent = '無法啟動：' + e.message;
  }
}

function stop() {
  translating = false;
  if (recog) try { recog.stop(); } catch (_) {}
  $('startBtn').disabled = false;
  $('stopBtn').disabled = true;
  statusEl.textContent = '已停止。';
}

$('startBtn').addEventListener('click', start);
$('stopBtn').addEventListener('click', stop);
$('speakBtn').addEventListener('click', () => speak(dstText.textContent, $('dstLang').value));

statusEl.textContent = '就緒。點擊「開始聆聽」並授權麥克風。';
