# 驗證模式 (verify-patterns.md)

## 型別守門
```bash
cd apps/universal-translator
npx --no-install tsc -p tsconfig.ut.json --noEmit   # 期望 0 error
node --check server.mjs && node --check translate.mjs
```

## 行為實測（Python subprocess 控制 server 最穩）
Git-Bash 子 shell 下 `terminal(background=true)` 起的 node 會被 SIGHUP 殺掉；用 Python `subprocess.Popen` 起 server 並在同源程控測：

```python
import subprocess, time, json, threading, os
os.chdir(r"C:\Project\esggo\apps\universal-translator")
env = dict(os.environ, PORT="8799")
proc = subprocess.Popen(["node","server.mjs"], env=env, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True)
time.sleep(3)
# 寫 payload 檔 (UTF-8) 避免 subprocess stdin bytes/str 問題
with open("/tmp/speak.json","w",encoding="utf-8") as f:
    json.dump({"text":"大家好歡迎來到會議","from":"zh-TW","to":"en","targets":["en","ja","es"],"room":"tr","speaker":"studio"}, f, ensure_ascii=False)
# SSE 客戶端執行緒
out=[]
def sse():
    p=subprocess.Popen(["curl","-sN","--max-time","6","http://localhost:8799/stream?room=tr"],stdout=subprocess.PIPE,stderr=subprocess.STDOUT,text=True)
    for line in p.stdout: out.append(line.rstrip("\n"))
t=threading.Thread(target=sse,daemon=True); t.start(); time.sleep(1.2)
# POST /speak
subprocess.run(["curl","-sS","-X","POST","http://localhost:8799/speak","-H","Content-Type: application/json; charset=utf-8","--data-binary","@/tmp/speak.json"],capture_output=True,text=True,timeout=12)
t.join(timeout=7)
# 過濾 SSE: 只取 data: 開頭且含 translations 的行
evs=[l for l in out if l.startswith("data:") and "translations" in l]
if evs:
    d=json.loads(evs[0][5:].strip())
    print("text:",d.get("text"),"| en:",d.get("translations",{}).get("en"),"| room:",d.get("room"))
proc.terminate()
```

注意：SSE 流有 `id:` / `event: heartbeat` / `data: {"room":"tr"}` 等非翻譯行，解析時要濾掉，只取 `event: translation` 後的 `data:` 行（或 `data:` 含 `translations` 鍵）。

## 對外實測
用 browser 工具開 `https://translate.esggo.co/`，填入繁中文字 → 點「連線即時流」(WebSocket) → 譯文框出現正確簡/繁中結果。這條路徑最貼近使用者。

### ⚠️ 對外 REST 驗證的 UTF-8 正確姿勢（關鍵）
- **永遠用 `--data-binary @file.json`，不要把中文內嵌進 `-d '{"text":"中文"}'`**：Windows Git-Bash 終端機會把 UTF-8 多 byte 字元錯誤編碼送給 curl → 發出損壞 bytes → 對外回 `U+FFFD`（`ef bf bd`）自欺看到「亂碼」。這是終端 artifact，**不是 Cloudflare bug**（檔案法打對外回正確）。
- 寫檔用 `printf '%s' '...' > C:/tmp/x.json`（注意 Git-Bash 下 `/c/tmp/...` 路徑 curl 解析會錯，改用 `C:/tmp/x.json` 或 `C:\\tmp\\x.json`）。
- 對外 STT：先 `espeak-ng -v zh '...' -w /tmp/zh_test.wav` 生成測試音，再 `curl -sS --max-time 30 -X POST 'https://translate.esggo.co/transcribe?lang=zh-TW' --data-binary @/tmp/zh_test.wav`。

### STT 端到端（中文→英文鏈）
`/speak targets:['en']` → 回 `translations:{en:'...'}`；並行 SSE `/stream?room=xxx` 觀眾端收 `text` + `translations`。實測腳本模式同上方 Python 模板，把 `/speak` body 的 `targets` 設成 `['en']` 即可（目標語已可控，預設只翻英文）。
