# OA 三層整合驗證清單 (2026-08-09 用戶強制 "三層都要")

每次宣告 OA 體系「實體化完成」前，三層都必須綠燈。複製下列指令分別執行。

## ① OA-Local 層
```bash
# Ollama 本機模型可達 (注意: 用 api/tags, 不是 /api/health)
curl -sf -m 5 http://localhost:11434/api/tags >/dev/null && echo "OLLAMA_OK" || echo "OLLAMA_FAIL"
# 追蹤通知實測
python3 "$LOCALAPPDATA/hermes/scripts/notify_via_tracker.py" "🐝 三層驗證探針"   # 期望 SENT: HTTP 200
```

## ② OA-Team 蜂群層 (CrewAI)
```bash
cd C:/Project/esggo-learning-center/oa-team-crewai
CREWAI_PY="$(cygpath -u 'C:/Users/dingj/AppData/Roaming/uv/tools/crewai/Scripts/python.exe')"
# 結構驗證 (不連網)
env -u PYTHONPATH OPENAI_API_KEY=dummy OPENAI_API_BASE=http://127.0.0.1:9 "$CREWAI_PY" -c \
  "from crewai.project import load_crew; from pathlib import Path; c,_=load_crew(Path('crew.jsonc')); print('agents=%d tasks=%d'%(len(c.agents),len(c.tasks)))"
# 完整結構 + llm 欄位檢查
env -u PYTHONPATH "$CREWAI_PY" "C:/Users/dingj/AppData/Local/hermes/skills/oa-team-swarm/scripts/verify_oa_team_structure.py" --crew-dir .
```

## ③ OA-VPS 雲端層
```bash
# SSH 可達 + WebUI 健康 (注意 port 8799, 非 8787)
ssh -o ConnectTimeout=10 esggo-vps "curl -sf -m 5 http://127.0.0.1:8799/health >/dev/null && echo WEBUI_OK || echo WEBUI_DOWN"
# CrewAI 已裝 + load_crew 通過
ssh -o ConnectTimeout=20 esggo-vps "source \$HOME/.local/bin/env; CREWAI_PY=\$HOME/.local/share/uv/tools/crewai/bin/python; cd /home/ubuntu/oa-team-crewai/oa-team-crewai; env -u PYTHONPATH OPENAI_API_KEY=dummy OPENAI_API_BASE=http://127.0.0.1:9 \"\$CREWAI_PY\" -c \"from crewai.project import load_crew; from pathlib import Path; c,_=load_crew(Path('crew.jsonc')); print('VPS agents=%d tasks=%d'%(len(c.agents),len(c.tasks)))\""
```

## 常見失敗模式
- ① Ollama `api/health` 回 FAIL → 這是端點名錯（Ollama 無 `/api/health`），改用 `api/tags`。
- ② load_crew 報 `gpt-4.1-mini not found` → agent jsonc 缺 `llm` 欄位（見 SKILL.md §5b）。
- ③ WebUI 連 8787 失敗 → 該 port 被 omni-blueprint-hub 佔用，改用 8799。
