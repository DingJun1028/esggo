# 完全代主自行 CLI 工具

> 命令列工具 for 管理完全代主自行授權

## 安裝

```bash
cd cli
npm install
npm run build
```

## 使用方法

### 創建授權

```bash
# 創建基本授權
esggo-delegation create --principal user-001

# 創建帶權限的授權
esggo-delegation create --principal user-001 --permissions read,write,execute

# 創建永久授權
esggo-delegation create --principal user-001 --valid-until infinity

# 創建帶描述的授權
esggo-delegation create --principal user-001 --description "ESG 合規代理"
```

### 列出授權

```bash
# 列出所有活躍授權
esggo-delegation list

# 篩選特定主體的授權
esggo-delegation list --principal user-001
```

### 獲取授權詳情

```bash
esggo-delegation get <delegation-id>
```

### 終止授權

```bash
# 基本終止
esggo-delegation terminate <delegation-id>

# 帶原因終止
esggo-delegation terminate <delegation-id> --reason "任務完成"
```

### 執行任務

```bash
# 基本執行
esggo-delegation execute <delegation-id> --intent "generate-report"

# 帶上下文執行
esggo-delegation execute <delegation-id> --intent "generate-report" --context '{"period":"2024Q1"}'
```

### 驗證授權

```bash
esggo-delegation validate <delegation-id> --permission read
```

## 權限類型

| 權限 | 描述 |
|------|------|
| `read` | 讀取資料 |
| `write` | 寫入資料 |
| `execute` | 執行操作 |
| `decide` | 做出決策 |
| `full` | 完全授權 |

## 限制類型

| 類型 | 描述 |
|------|------|
| `scope` | 範圍限制 |
| `time` | 時間限制 |
| `resource` | 資源限制 |
