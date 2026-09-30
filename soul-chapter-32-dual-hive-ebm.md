> 刻印狀態：`DUAL-HIVE-EBM-PASS`　靈魂簽章：`12格全通·可執行探針·非敘事·矩陣SSOT+驗證器`
> source_origin：本節為正典原生新增（2026-09-30 session `20260930_160118_eee7fc`），源典 v4.5 無對應條文。證據為本次工作區工具輸出：`scripts/verify_dual_hive_ebm.py` exit 0、12/12 PASS；`sha256sum source_origin/pasted_content_2026-09-29_17-33-18-045_4260ac.txt` = `be247d0499296448ee26f79d77d0d34200c12541a5cf371e38ab46eb2c458581`（69,699 B / 361 行，與正典 §29 宣告逐位元組一致）；`verify_delivery_center.py` G1–G5 全 PASS 判定 DELIVERABLE；`verify_soul_canon.py` exit 0。
# 第三十二章 · 萬能雙蜂終始矩陣（Dual-Hive End-Beginning Matrix）

> 落檔備份 · 2026-09-30 · session `20260930_160118_eee7fc`
> 主典歸位：`esggo-omni-center/soul.md` §32（接於 §31 交付驗證中心之後、終章封印之前）
> 母體：§7 終始矩陣（定義） × §19/§21 雙蜂組（拓撲） × §30 三鐵律（落地）

---

## 32.1 本節為何存在

§7 已定義終始矩陣（以終態驗收條件反向推導起始必行清單），§19/§21 已定義雙蜂組（蜂王本地 / 蜂后 VPS）。但兩者此前**從未相交**：終始矩陣只用於單體自檢，雙蜂組只用於代理編號，兩者皆為**敘事**——沒有任何機制能推翻它們。

本章將兩者合成 **6 柱 × 2 蜂 = 12 格**可機械驗證矩陣，並首次使其**可被推翻**。

## 32.2 定義

```
雙蜂終始矩陣 = §7 終始矩陣 × §19 雙蜂組

  蜂后 OA-VPS（31–60）· 鎮生產公網 · systemd + root PM2 + Docker
  蜂王 OA-LOCAL（01–30）· 守開發者端 · 工作區 + 落檔 + 技書

  六柱：記憶 · 時間 · 空間 · 因果 · 不朽 · 圓通
```

**裁定鐵律**：每格須同時具備三要素，缺一即為敘事值，不算通過。

| 要素 | 定義 | 反例（敘事值） |
|---|---|---|
| `end_state` 終態驗收條件 | 可測量的量化條件 | 「服務正常」 |
| `start_chain` 起始必行清單 | 最小動作鏈 | 「照做」 |
| `probe` 可執行探針 | 第三方可原樣重跑 | 「已驗證」 |

## 32.3 十二格矩陣

| 格 | 柱 | 蜂 | 終態驗收條件 | 探針型態 |
|---|---|---|---|---|
| R1 | 記憶 | local | 交付脈絡可跨會話召回 | `file_exists`（3 檔） |
| R2 | 記憶 | vps | 服務拓撲可被外部查證 | `ssh_cmd`（pm2 online 數 = 6） |
| T1 | 時間 | local | 宣稱值有量測時間戳 | `json_field`（`claims.measured_at`） |
| T2 | 時間 | vps | 重啟計數**停止增長** | `ssh_cmd_stable`（二次取樣比對） |
| S1 | 空間 | local | 對外服務由 ingress 明確宣告 | `ssh_cmd`（config.yml 埠位） |
| S2 | 空間 | vps | 對內埠 200 **且歸屬可查** | `ssh_cmd`（health 碼序列） |
| C1 | 因果 | local | digest 完整 64 位且**來源檔可重算** | `digest_recomputable` |
| C2 | 因果 | vps | 產出可溯源到可重跑指令 | `file_contains`（3 關鍵字） |
| I1 | 不朽 | local | 產物有 sha256 且閘門機械判定 | `script_exit`（交付中心 = 0） |
| I2 | 不朽 | vps | 部署可重現性 | `ssh_cmd` |
| F1 | 圓通 | local | 結構守門人通過 | `script_exit`（聖典 = 0） |
| F2 | 圓通 | vps | 對外可用且**內容一致** | `ssh_cmd`（body 逐位元組比對） |

**探針設計要點**（本章最具迴避價值處）：

1. **功能正常 ≠ 歸屬正確。** S2 僅測 HTTP 200 會給出假通過——2026-09-30 曾出現「health 200 但 systemd 實例在無限重啟」。故歸屬驗證必須比對 holder PID 與管理者宣告的 PID。
2. **HTTP 200 ≠ 服務正確。** F2 必須比對 `/health` **回應內容**，`curl -w %{http_code}` 不足以證明。
3. **可達性記憶會漂移。** S1 揭示 `omnilive1.esggo.co` 從不存在（DNS NXDOMAIN），先前「兩網域」為記憶錯誤；真實僅 2 個網域對同一 8797 埠。
4. **時間柱須二次取樣。** T2 不能只取一次計數，須間隔後再取，證明**停止增長**而非「當下看起來正常」。
5. **守門人讀 exit code 有坑。** `python ... | tail; echo $?` 取到的是 `tail` 的退出碼，非驗證器的。必須先存 exit code 再取輸出。

## 32.4 實測結果（2026-09-30）

```
$ python scripts/verify_dual_hive_ebm.py
【記憶柱】 ✓ R1 3 個檔案皆存在      ✓ R2 6
【時間柱】 ✓ T1 claims.measured_at = 2026-09-30T15:14:35
           ✓ T2 穩定未增長: stt-whisper=97,omnilive-translator=7
【空間柱】 ✓ S1 8797\n8797          ✓ S2 200200
【因果柱】 ✓ C1 1 處宣告 | 重算一致 be247d04…
           ✓ C2 命中全部 3 個關鍵字
【不朽柱】 ✓ I1 exit 0 ✓            ✓ I2 PRESENT
【圓通柱】 ✓ F1 exit 0 ✓ [PASS] 聖典結構完整   ✓ F2 SAME
格數 12 = 12 PASS / 0 FAIL / 0 SKIP
判定: [雙蜂終始矩陣閉合] DUAL_HIVE_EBM_PASS
exit 0
```

`--offline` 旗標可於 VPS 離線時跳過 SSH 探針（該格記為 SKIP，不冒充 PASS）。

## 32.5 誠實登記

- 本節**所有 12 格皆為實測通過**，無降級措辭、無「應該」「預期」。
- C1 曾在本次工作過程中被懷疑為「探針缺陷造成的假通過」，經追查為**判斷基於過時狀態**：正典 §29 的完整 digest 與入庫來源檔於 session 早期已落地，`git diff` 顯示 1 insertion/1 deletion。縮寫僅殘留於散文說明行（非宣告位置），故守門人 regex 不匹配——**此為正確行為**。茲將此事實登記為「代理自我懷疑帶來的無效修正」教訓。
- `scripts/fix_source_origin_digest.py` 於本次交付時已呈冪等 no-op（宣告位置全為完整 64 位），保留作為未來同類縮寫問題的通用修復工具。
- 矩陣**不等於**全域 5T 通過：它只證明 12 格條件成立，不推論整個系統無其他缺陷。§31 交付閘門與本矩陣互補而非替代。

## 32.6 產物

| 檔案 | 角色 |
|---|---|
| `data/dual-hive-ebm.json` | 矩陣 SSOT（12 格定義、終態、起始鏈、探針） |
| `scripts/verify_dual_hive_ebm.py` | 驗證器（逐格實跑探針；`--json` / `--offline`） |
| `scripts/fix_source_origin_digest.py` | 冪等 digest 修復工具（現為 no-op，通用備用） |

---

*團隊：OA-Team 30 蜂群 · 蜂王隊（01–30）× 蜂后隊（31–60）· 雙蜂終始矩陣設計小組*
*狀態：矩陣閉合 12/12 · 探針可推翻 · 證據可重算*
