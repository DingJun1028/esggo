#!/usr/bin/env python3
"""ESGGO VPS Relay Server - standalone"""
import json
import os
import sys
from http.server import HTTPServer, BaseHTTPRequestHandler
from datetime import datetime, timezone

TOKEN = os.environ.get("ESGGO_RELAY_TOKEN")
if not TOKEN:
    raise SystemExit("ESGGO_RELAY_TOKEN environment variable is required")
HOST = os.environ.get("ESGGO_RELAY_HOST", "127.0.0.1")
PORT = int(os.environ.get("ESGGO_RELAY_PORT", "9999"))

cmds = {}

class Handler(BaseHTTPRequestHandler):
    def _auth_fail(self):
        self.send_response(403)
        self.end_headers()
        self.wfile.write(b'{"error":"forbidden"}')

    def _json(self, obj, code=200):
        self.send_response(code)
        self.send_header("Content-Type","application/json")
        self.end_headers()
        self.wfile.write(json.dumps(obj, ensure_ascii=False).encode("utf-8"))

    def do_GET(self):
        if self.headers.get("X-Auth-Token") != TOKEN:
            return self._auth_fail()
        if self.path == "/status":
            return self._json({"status":"ok","ts":datetime.now(timezone.utc).isoformat()})
        return self._json({"error":"not_found"}, 404)

    def do_POST(self):
        if self.headers.get("X-Auth-Token") != TOKEN:
            return self._auth_fail()
        length = int(self.headers.get("Content-Length","0"))
        body = self.rfile.read(length).decode("utf-8","replace")
        try:
            data = json.loads(body) if body else {}
        except Exception:
            data = {}
        if self.path == "/cmd":
            cmd_id = data.get("id") or ("cmd_"+str(id(body))[-12:])
            cmds[cmd_id] = data
            return self._json({"status":"queued","id":cmd_id,"command":data.get("command")})
        if self.path == "/result":
            print("RESULT", json.dumps(data, ensure_ascii=False)[:2000], flush=True)
            return self._json({"status":"ok"})
        return self._json({"error":"not_found"}, 404)

    def log_message(self, fmt, *args):
        sys.stderr.write(f"{datetime.now(timezone.utc).isoformat()} {fmt%args}\n")

def main():
    server = HTTPServer((HOST, PORT), Handler)
    print(f"ESGGO VPS Relay Server\nPort: {PORT}\nAuth: {TOKEN}\nListening on {HOST}:{PORT}\nEndpoints: /status /cmd /result", flush=True)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()

if __name__ == "__main__":
    main()
