// esggo 本地 AI 備用端點 — 走 VPS 自託管 Ollama (Gemma 免費無限算力, 資料不出 VPS)
import { NextRequest, NextResponse } from "next/server";

const OLLAMA_URL = process.env.OLLAMA_URL || "http://127.0.0.1:11434";
const LOCAL_MODEL = process.env.LOCAL_MODEL || "gemma3:4b";

export async function POST(req: NextRequest) {
  if (process.env.USE_LOCAL_AI !== "true") {
    return NextResponse.json({ success: false, error: "本地 AI 未啟用 (設 USE_LOCAL_AI=true)", code: "LOCAL_AI_DISABLED" }, { status: 503 });
  }
  let prompt = "";
  try {
    const body = await req.json();
    prompt = (body.prompt || body.message || "").toString().slice(0, 4000);
  } catch {
    return NextResponse.json({ success: false, error: "無效請求主體", code: "BAD_REQUEST" }, { status: 400 });
  }
  if (!prompt.trim()) {
    return NextResponse.json({ success: false, error: "prompt 不可為空", code: "EMPTY_PROMPT" }, { status: 400 });
  }
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 120000);
    const res = await fetch(OLLAMA_URL + "/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model: LOCAL_MODEL, prompt, stream: false }),
      signal: controller.signal,
    });
    clearTimeout(timer);
    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      return NextResponse.json({ success: false, error: "Ollama 錯誤 " + res.status + ": " + errText.slice(0, 200), code: "OLLAMA_ERR" }, { status: 502 });
    }
    const data = (await res.json()) as { response?: string };
    return NextResponse.json({ success: true, model: LOCAL_MODEL, source: "local-ollama", text: data.response ?? "" });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ success: false, error: "本地 AI 呼叫失敗: " + msg.slice(0, 200), code: "LOCAL_AI_FAIL" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ endpoint: "local-ai/chat", enabled: process.env.USE_LOCAL_AI === "true", model: LOCAL_MODEL, backend: OLLAMA_URL, note: "VPS 自託管 Ollama (Gemma 免費無限算力, 資料不出 VPS)" });
}
