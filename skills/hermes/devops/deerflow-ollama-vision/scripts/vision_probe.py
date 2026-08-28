"""DeerFlow vision endpoint probe (local Windows Docker).

Usage:
  python3 vision_probe.py <model_name> <image_path> [poll_seconds=560]

- Logs into DeerFlow (admin creds below — change if rotated),
  creates a thread, uploads the image, runs the model, polls
  GET /api/threads/{tid}/state for the AI reply.

Endpoints assumed: nginx at http://127.0.0.1:2026/api/* forwarding to gateway :8001.
Adjust BASE if your external port differs.
"""
import sys, json, time, urllib.request, urllib.parse

BASE = "http://127.0.0.1:2026"
USER, PASS = "admin@esggo.io", "OmniBee2026!"  # local-dev creds; rotate if changed


def _req(method, path, body=None, headers=None, cookie=None, data=None, ctype=None):
    if data is not None:
        h = {"Content-Type": ctype} if ctype else {}
    else:
        data = json.dumps(body).encode() if body is not None else None
        h = {"Content-Type": "application/json"}
    if headers:
        h.update(headers)
    if cookie:
        h["Cookie"] = cookie
    r = urllib.request.Request(BASE + path, data=data, headers=h, method=method)
    try:
        resp = urllib.request.urlopen(r, timeout=120)
        return resp.getcode(), resp.read().decode(), resp.headers.get_all("Set-Cookie") or []
    except urllib.error.HTTPError as e:
        return e.code, e.read().decode(), e.headers.get_all("Set-Cookie") or []
    except Exception as e:  # noqa: BLE001
        return 0, str(e), []


def main():
    model = sys.argv[1] if len(sys.argv) > 1 else "qwen3-vl-local"
    img = sys.argv[2] if len(sys.argv) > 2 else "C:/Users/dingj/AppData/Local/Temp/vision_tiny.png"
    window = int(sys.argv[3]) if len(sys.argv) > 3 else 560

    lr = urllib.request.Request(
        BASE + "/api/v1/auth/login/local",
        data=urllib.parse.urlencode({"username": USER, "password": PASS}).encode(),
        headers={"Content-Type": "application/x-www-form-urlencoded"}, method="POST")
    r = urllib.request.urlopen(lr, timeout=30)
    ck = {}
    for s in (r.headers.get_all("Set-Cookie") or []):
        k = s.split(";")[0].split("=")[0]
        v = s.split(";")[0].split("=", 1)[1]
        ck[k] = v
    cookie = "; ".join(f"{k}={v}" for k, v in ck.items())
    csrf = ck.get("csrf_token", "")
    print("login OK, csrf_token present:", bool(csrf))

    sc, tb, _ = _req("POST", "/api/threads", body={}, headers={"X-CSRF-Token": csrf}, cookie=cookie)
    tid = json.loads(tb).get("thread_id", "")
    print("THREAD:", sc, tid[:8])

    boundary = "----DeerFlowProbeBoundary"
    with open(img, "rb") as f:
        img_data = f.read()
    body = (b"--" + boundary.encode() + b"\r\n"
            + b'Content-Disposition: form-data; name="files"; filename="img.png"\r\n'
            + b"Content-Type: image/png\r\n\r\n" + img_data + b"\r\n"
            + b"--" + boundary.encode() + b"--\r\n")
    sc, ub, _ = _req("POST", f"/api/threads/{tid}/uploads", data=body,
                     ctype=f"multipart/form-data; boundary={boundary}",
                     headers={"X-CSRF-Token": csrf}, cookie=cookie)
    up = json.loads(ub) if sc == 200 else {}
    files = up.get("files", [up]) if isinstance(up, dict) else []
    file_url = files[0].get("path", "") if files else ""
    print("UPLOAD:", sc, "url:", file_url[:50])

    sc, rb, _ = _req("POST", f"/api/threads/{tid}/runs",
        body={"assistant_id": "default",
              "config": {"configurable": {"model_name": model}},
              "input": {"messages": [{"role": "user", "content": [
                  {"type": "text", "text": "用繁體中文回答：這張圖寫了什麼字母？"},
                  {"type": "image_url", "image_url": {"url": file_url}}]}]}},
        headers={"X-CSRF-Token": csrf}, cookie=cookie)
    print("RUN:", sc, "(model:", model, ")")

    steps = max(1, window // 8)
    for i in range(steps):
        time.sleep(8)
        sc, sb, _ = _req("GET", f"/api/threads/{tid}/state", cookie=cookie, headers={"X-CSRF-Token": csrf})
        if sc != 200:
            print(f"poll {i}: HTTP {sc}")
            continue
        st = json.loads(sb)
        msgs = st.get("values", {}).get("messages", []) if isinstance(st.get("values"), dict) else []
        for m in msgs:
            if m.get("type") == "ai" and m.get("content"):
                c = m["content"]
                if isinstance(c, list):
                    c = " ".join(str(x.get("text", "")) for x in c if isinstance(x, dict))
                if c.strip():
                    print(f"=== AI REPLY @{(i + 1) * 8}s ===\n{c[:800]}")
                    return
        print(f"poll {i}: {(i + 1) * 8}s")


if __name__ == "__main__":
    main()
