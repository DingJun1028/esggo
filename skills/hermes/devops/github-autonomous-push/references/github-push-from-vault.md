# GitHub Push from Secret Vault — 實證 Recipe（2026-08-22 實測）

適用：沙箱有 git + 秘密聖櫃 ENV20230818.env，但無 gh / 無 SSH 私鑰。
目標：自主製作 → 推 esggo 新分支 → API 複驗。

## 前置確認（先探再動，不假設）
```bash
grep -c 'GITHUB' /c/Users/dingj/secret-vault/ENV20230818.env
TOK=$(grep -E '^(GITHUB_TOKEN|GH_TOKEN|GITHUB_PAT)=' /c/Users/dingj/secret-vault/ENV20230818.env | head -1 | cut -d= -f2-)
echo "token_len=${#TOK}"
curl -s -o /dev/null -w "repo HTTP=%{http_code}\n" -H "Authorization: Bearer $TOK" https://api.github.com/repos/DingJun1028/esggo
curl -s -o /dev/null -w "branch HTTP=%{http_code}\n" -H "Authorization: Bearer $TOK" https://api.github.com/repos/DingJun1028/esggo/branches/<branch>
curl -s -H "Authorization: Bearer $TOK" https://api.github.com/repos/DingJun1028/esggo \
  | python3 -c "import sys,json;d=json.load(sys.stdin);print('size_kb',d.get('size'),'default',d.get('default_branch'),'lang',d.get('language'))"
```

## 執行
```bash
cd /tmp
git clone --depth 1 "https://${TOK}@github.com/DingJun1028/esggo.git" esggo
cd esggo && git checkout -b <branch>
# ... 製作 apps/<branch>/ 下檔案 ...
node --check apps/<branch>/app.js
PORT=8789 node apps/<branch>/server.mjs &   # terminal background=true
# curl 驗證後 kill
git config user.email "agent@esggo.co"; git config user.name "Hermes Agent"
git add apps/<branch>; git commit -m "feat(<branch>): ..."
git push "https://${TOK}@github.com/DingJun1028/esggo.git" <branch>
```

## 本地靜態驗證（無頭環境可驗部分）
```bash
curl -s -o /tmp/i.html -w "HTTP=%{http_code} bytes=%{size_download}\n" http://localhost:8789/
curl -s -o /dev/null -w "js HTTP=%{http_code} type=%{content_type}\n" http://localhost:8789/app.js
grep -c 'id="srcText"' /tmp/i.html
curl -s -o /dev/null -w "traversal=%{http_code}\n" "http://localhost:8789/../secret-vault/ENV20230818.env"  # 應 404
```
首頁 200 + 正確 bytes、JS 正確 MIME、掛載點計數 >0、路徑穿越 404 = 服務可正確託管。

## 回推複驗（關鍵）
```bash
curl -s -o /dev/null -w "branch HTTP=%{http_code}\n" -H "Authorization: Bearer $TOK" \
  https://api.github.com/repos/DingJun1028/esggo/branches/<branch>
curl -s -H "Authorization: Bearer $TOK" \
  https://api.github.com/repos/DingJun1028/esggo/contents/apps/<branch>?ref=<branch> \
  | python3 -c "import sys,json;d=json.load(sys.stdin);print([x['name'] for x in d])"
rm -rf /tmp/esggo; unset TOK
```

## 實測結果（translate 分支）
- clone 成功、checkout -b translate 成功
- push 回傳 `[new branch] translate -> translate`
- API：branch HTTP=200，contents 列出 5 檔（README.md/app.js/index.html/package.json/server.mjs）
- 結論：遠端分支真實建立並入庫，非自述。

## 注意
- GitHub push 回傳附 Dependabot 漏洞摘要（70 vulns 等）——指 default branch，與新分支無關，勿當成本次 push 的錯。
- rm 自身 cwd 後 shell 報 getcwd 錯誤屬正常，後續 cd 即恢復。
- 永遠不 echo / 不印 token 值；用完 unset。
