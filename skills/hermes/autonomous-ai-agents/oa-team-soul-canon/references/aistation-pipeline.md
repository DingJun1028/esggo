# AI Station 7 模組生產線 — 技術實作卡 (aistation-pipeline)

> 對應靈魂聖典 §九。壽司博士 Dr. Source 專案：腳本 → 帶品牌開場 + 逐字字幕 + 可立即分發影片。
> 預設零雲端成本（edge-tts + Pillow + ffmpeg），需更高品質再插雲端金鑰（ElevenLabs / Runway / GPT-4o / S3）。
> 優雅回落：任一金鑰失效自動回免費路徑，不中斷生產。

## 架構總覽 (IDEA)

| # | 模組 | IDEA 階段 | 預設（免費） | 雲端增強 | 負責代理 |
| --- | --- | --- | --- | --- | --- |
| 1 | 編排中心 | Input | FastAPI + 背景執行緒池 | — | 07 |
| 2 | 文字解析 | Input/Design | 內建句法解析 + DNA 標記 | OpenAI GPT-4o | 08,15 |
| 3 | 語音合成 | Design | edge-tts | ElevenLabs | 16 |
| 4 | 視覺生成 | Design | Pillow 品牌漸層 | Runway B-roll | 13,14 |
| 5 | 渲染引擎 | Execution | ffmpeg + 同步字幕 | — | 11 |
| 6 | 雲端儲存 | Execution/Auto | 本地 /storage | S3 | 22,23 |
| 7 | 溯源/作業庫 | Automation | SQLite + 指標 | NoCodeBackend | 10 |

## 模組 1 + 7：編排中心與溯源庫 (FastAPI)

```python
# aistation/main.py
from fastapi import FastAPI, BackgroundTasks, HTTPException, Request
from pydantic import BaseModel
import uuid, os, sqlite3, hmac, hashlib
from pathlib import Path

app = FastAPI()
STORAGE = Path(os.getenv("STORAGE_DIR", "/storage")).resolve()
WEBHOOK_SECRET = os.getenv("WEBHOOK_SECRET", "")
DB = STORAGE / "jobs.db"

def init_db():
    con = sqlite3.connect(DB)
    con.execute("""CREATE TABLE IF NOT EXISTS jobs(
        id TEXT PRIMARY KEY, script TEXT, status TEXT,
        created_at INTEGER, metrics TEXT)""")
    con.commit(); con.close()

init_db()

class ScriptInput(BaseModel):
    script: str
    brand: str = "sushi-doctor"

@app.post("/generate")
async def generate(req: ScriptInput, bg: BackgroundTasks):
    job_id = uuid.uuid4().hex[:8]
    con = sqlite3.connect(DB)
    con.execute("INSERT INTO jobs VALUES(?,?,?,?,?)",
                (job_id, req.script, "queued", __import__("time").time_ns(), "{}"))
    con.commit(); con.close()
    bg.add_task(run_pipeline, job_id, req.script)   # 5T: Trackable 生命週期 Hook
    return {"job_id": job_id, "status": "queued"}   # 5T: Traceable 回傳 id
```

## 模組 2：文字解析 + 腳本 DNA 標記

```python
# aistation/text_parse.py
DNA_TAGS = ["場景", "衝突", "洞察", "方法", "反思"]

def tag_dna(script: str) -> dict:
    """預設：規則解析。雲端增強：GPT-4o 回傳同結構 JSON，失敗自動回落此函。"""
    segments = {t: "" for t in DNA_TAGS}
    for tag in DNA_TAGS:
        marker = f"【{tag}】"
        if marker in script:
            rest = script.split(marker, 1)[1]
            nxt = min([rest.find(f"【{t}】") for t in DNA_TAGS if f"【{t}】" in rest] or [len(rest)])
            segments[tag] = rest[:nxt].strip()
    return segments   # 5T: Transparent 標記來源可查
```

## 模組 3：語音合成 (edge-tts 優先)

```python
# aistation/tts.py
import asyncio
import edge_tts

async def synth(text: str, out_wav: str):
    voice = "zh-TW-HsiaoChenNeural"
    comm = edge_tts.Communicate(text, voice)
    await comm.save(out_wav)
    return out_wav

def synth_sync(text: str, out_wav: str):
    return asyncio.run(synth(text, out_wav))
```

## 模組 4：視覺生成 (Pillow 品牌漸層)

```python
# aistation/visual.py
from PIL import Image, ImageDraw

BRAND = {  # 5T: Tangible 視覺識別
    "navy": (16, 36, 63),      # #10243f
    "gold": (201, 162, 75),    # #c9a24b
    "cream": (243, 237, 225),  # #f3ede1
    "green": (60, 110, 71),    # #3c6e47
}

def brand_gradient(w: int, h: int, top="#10243f", bottom="#c9a24b") -> Image.Image:
    img = Image.new("RGB", (w, h))
    t = tuple(int(top[l:l+2], 16) for l in (1, 3, 5))
    b = tuple(int(bottom[l:l+2], 16) for l in (1, 3, 5))
    for y in range(h):
        r = tuple(int(t[i] + (b[i]-t[i])*y/h) for i in range(3))
        ImageDraw.Draw(img).line([(0, y), (w, y)], fill=r)
    return img   # 5T: Trustworthy 禁用藍紫霓虹/機器人大腦/漂浮數據
```

## 模組 5：渲染引擎 (ffmpeg + 同步字幕)

```python
# aistation/render.py
import subprocess

def render(video_in: str, subtitle_srt: str, out_mp4: str):
    cmd = [
        "ffmpeg", "-y", "-i", video_in,
        "-vf", f"subtitles='{subtitle_srt}':force_style='Fontsize=24'",
        "-c:v", "libx264", "-preset", "veryfast", "-c:a", "aac",
        "-movflags", "+faststart", out_mp4,
    ]
    subprocess.run(cmd, check=True, capture_output=True)   # 5T: Trackable 渲染可重現
    return out_mp4
```

## 模組 6：雲端儲存 (本地優先，S3 增強)

```python
# aistation/store.py
from pathlib import Path

def safe_path(p: str, root: Path) -> Path:
    """路徑穿越防護：resolve 後必須在 root 內。"""
    resolved = (root / p).resolve()
    if not str(resolved).startswith(str(root.resolve())):
        raise PermissionError(f"path traversal blocked: {p}")
    return resolved   # 5T: Trustworthy

def store(local_path: str, root: Path):
    dest = safe_path(local_path, root)
    dest.parent.mkdir(parents=True, exist_ok=True)
    return dest
```

## 安全：Webhook 認證 + 路徑防護 (跨模組共用)

```python
# aistation/security.py
import hmac, hashlib
from fastapi import Request, HTTPException

def verify_webhook(secret: str, body: bytes, signature: str) -> bool:
    """常數時間比對，防時序攻擊。"""
    expected = hmac.new(secret.encode(), body, hashlib.sha256).hexdigest()
    return hmac.compare_digest(signature, expected)   # 5T: Trustworthy

async def require_auth(req: Request):
    sig = req.headers.get("X-AI-Station-Key", "")
    body = await req.body()
    if not verify_webhook(WEBHOOK_SECRET, body, sig):
        raise HTTPException(401, "invalid signature")
```

## 優雅回落原則 (Graceful Degradation)

```python
def with_fallback(primary, fallback, *args):
    try:
        return primary(*args)
    except Exception:
        # 任一雲端整合失敗 → 自動回免費路徑，不中斷生產
        return fallback(*args)
```

> 品牌預設見靈魂聖典 §九。禁用視覺由 BRAND 常數與質控蜂(30) 驗證把關。
