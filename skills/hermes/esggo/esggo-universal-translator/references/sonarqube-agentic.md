# SonarQube CLI — Agentic Workflow 整合 (universal-translator)

將 SonarQube CLI 的 **agentic loop** 接入「萬能即時翻譯」開發週期。
適用條件：需具備 SonarQube Cloud 組織（啟用 agentic analysis）與 `SONAR_TOKEN`。

## 安裝（一次性）
```bash
npm i -g sonarqube-cli        # 或依官網發行方式
sonar integrate hermes        # 掛載 secret-detect hook + MCP server + Vortex context
```

## 三循環模型（對齊 OA-Team 5T）
1. **編輯後（agentic loop）**：`sonar analyze agentic` 自動跑（hook 觸發）→ 對齊 Traceable/Trackable。
2. **發 PR 前（CI verify loop）**：CI `sonar-agentic` job 以 `--staged` 掃描，失敗則阻擋 merge（需 `SONAR_TOKEN`）。
3. **長壽分支（maintenance loop）**：`sonar remediate --project universal-translator` 週期性修補（Hunter / AI CodeFix）。

## 本專案預置指令 (package.json scripts)
| 指令 | 作用 |
| --- | --- |
| `node --test test/ut.test.mjs` (或 `pnpm test`) | 零依賴權威閘門（Sonar 缺席時的同等品質門；CI `ut-tests` job 實跑 `node --test test/ut.test.mjs`，6/6 通過含真實 google-gtx） |
| `pnpm sonar:analyze` | `sonar analyze agentic --staged` |
| `pnpm sonar:issues` | `sonar list issues --project universal-translator --format toon` 拉回問題清單 |
| `pnpm sonar:remediate` | `sonar remediate --project universal-translator` |

⚠️ **實際驗證命令**（不要臆測）：UT 測試在 `apps/universal-translator` 目錄下跑 `node --test test/ut.test.mjs`。`pnpm test` 若未定義則用 `node --test`。 |

## CI 接線（選用閘門）
`.github/workflows/ci.yml` 加：
```yaml
sonar-agentic:
  name: SonarQube Agentic Analysis (UT)
  runs-on: ubuntu-latest
  timeout-minutes: 10
  if: ${{ env.SONAR_TOKEN != '' }}      # 無 token 整 job 跳過 → 不違反「只用免費算立」
  steps:
    - uses: actions/checkout@v4
      with: { fetch-depth: 0 }
    - uses: actions/setup-node@v4
      with: { node-version: ${{ env.NODE_VERSION }} }
    - run: npm i -g sonarqube-cli
    - name: Analyze staged changes (agentic)
      working-directory: apps/universal-translator
      run: sonar analyze agentic --staged
      env:
        SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
        SONAR_PROJECT_KEY: universal-translator
```

## 免費算立替代
未配置 Sonar 組織時，本專案以 `node --test test/*.test.mjs` + `tsc` 作為同等品質閘門（CI `ut-tests` job）。
Sonar 為**選用增強**，不影響既有零依賴驗證鏈。切勿為啟用此 job 擅自產生付費 token。

## 🆕 自託 SonarQube CE 實證 (2026-08-11, VPS)
- VPS Docker: `/opt/sonarqube/docker-compose.yml`（postgres + `sonarqube:community`，publish `19000:9000`）。
- 啟動後 admin 密碼改法：`curl -X POST .../api/users/change_password -u admin:admin --data-urlencode previousPassword=admin --data-urlencode password=<new>`（需 `previousPassword` 參數，非 `login`）。
- Token：`curl -X POST .../api/user_tokens/generate -u admin:<new> --data-urlencode name=esggo-ut-ci` → `squ_...`（44 字）。
- 掃描（**必須在 VPS 本機跑**，OCI 安全組未開 19000 且本地 SSH 隧道在 MSYS 下 ECONNRESET）：`scp -i ci_deploy_key -r . ubuntu@161.118.248.180:/tmp/ut-scan` 後 `cd /tmp/ut-scan && npx sonarqube-scanner -Dsonar.host.url=http://localhost:19000 -Dsonar.token=<tok> -Dsonar.projectKey=universal-translator -Dsonar.sources=server.mjs,translate.mjs,stt_client.mjs` → **ANALYSIS SUCCESSFUL**。
- `scripts/sonar-smoke.mjs`（免費、無 token）驗證工件：`node scripts/sonar-smoke.mjs` → 7/7 pass。CI `sonar-smoke` job 每次 push 跑。
- **⚠️ 硬限制**：SonarQube **CE 無 agentic 自動修復**（那是 SonarCloud/Enterprise 付費功能）。`sonar:analyze agentic` / `sonar:remediate` 是 Cloud CLI 指令，CE 不適用。免費算立下以「CE 靜態掃描 + sonar-smoke + 單元測試」為真實閘門；不要對 CE 宣稱 agentic 修復。
