# Windows Terminal CWD Lock 工作區

> 發生於：2026-08-16  
> 環境：Windows + Hermes terminal backend  
> 症狀：所有 `terminal` 呼叫皆返回 `cd: C:\c\Users\dingj: No such file or directory`

---

## 真實錯誤輸出

```
bash: line 3: cd: C:\c\Users\dingj: No such file or directory
bash: line 3: cd: C:\Users\dingj\OneDrive\Documents\Default Project: No such file or directory
```

所有 `terminal`、`git`、`gh`、`pnpm` 透過 terminal 呼叫皆失敗。

---

## 診斷步驟

```python
import subprocess, shutil
git = shutil.which('git')
gh = shutil.which('gh')
print('git=', git)
print('gh=', gh)

# Try git with -C flag
subprocess.run(['git', '-C', r'C:\Project\esggo', 'status', '--short'], capture_output=True, text=True)
```

---

## 解法記錄

### 解法 A：切換 terminal backend（最優）
```bash
hermes config set terminal.backend local
# 完全重啟 Hermes
```

### 解法 B：execute_code bypass
見上方診斷步驟。

### 解法 C：修復 cwd
```bash
cd /c/Project/esggo
```

---

## 預防措施

- 避免在 Hermes session 中切換到不存在的目錄
- 若發生鎖死，優先用解法 A
