#!/usr/bin/env python3
"""Streaming Ollama benchmark: TTFT, tok/s, total time.

Measures whether a CPU-only / self-hosted Ollama box is fast enough for
interactive LLM use. Rule of thumb: <1 tok/s is unusable for chat.

Usage:
    python3 bench_ollama_stream.py [base_url] [model ...]

Defaults:
    base_url = http://localhost:11435/v1/chat/completions  (SSH-tunnel to VPS)
    models   = qwen2.5:3b gemma4:e4b
"""
import json, sys, time, urllib.request

BASE = sys.argv[1] if len(sys.argv) > 1 else "http://localhost:11435/v1/chat/completions"
MODELS = sys.argv[2:] or ["qwen2.5:3b", "gemma4:e4b"]
PROMPT = "你好，請用一句話回應。"
MAX_TOKENS = 30


def bench(model: str) -> dict:
    payload = {
        "model": model,
        "messages": [{"role": "user", "content": PROMPT}],
        "stream": True,
        "max_tokens": MAX_TOKENS,
    }
    req = urllib.request.Request(
        BASE,
        data=json.dumps(payload).encode(),
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    t0 = time.time()
    ttft = None
    parts = []
    n = 0
    with urllib.request.urlopen(req, timeout=120) as resp:
        for raw in resp:
            line = raw.decode().strip()
            if not line.startswith("data:"):
                continue
            d = line[5:].strip()
            if d == "[DONE]":
                break
            try:
                obj = json.loads(d)
            except json.JSONDecodeError:
                continue
            c = ((obj.get("choices") or [{}])[0].get("delta") or {}).get("content")
            if c:
                if ttft is None:
                    ttft = time.time() - t0
                parts.append(c)
                n += 1
    total = time.time() - t0
    return {
        "ttft": round(ttft, 2) if ttft else None,
        "total": round(total, 2),
        "tokens": n,
        "tps": round(n / total, 2) if total else 0,
        "text": "".join(parts).strip()[:200],
    }


for m in MODELS:
    print(f"\n===== {m} =====", flush=True)
    try:
        r = bench(m)
        print(f"TTFT={r['ttft']}s  total={r['total']}s  {r['tokens']}tok  {r['tps']}tok/s", flush=True)
        print(f"回應: {r['text']}", flush=True)
    except Exception as e:
        print(f"錯誤: {e}", flush=True)
