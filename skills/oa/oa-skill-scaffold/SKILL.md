---
name: oa-skill-scaffold
description: "Use when the user wants to create a new OA skill, scaffold a skill directory, or bootstrap a SKILL.md with proper frontmatter. Generates a complete skill structure with SKILL.md, references/, templates/, and scripts/ directories. Load when user mentions skill scaffold, new skill, or skill bootstrap."
version: 1.0.0
author: ESGGO OmniAgent
license: MIT
metadata:
  hermes:
    tags: [scaffold, skill, bootstrap, generator, structure, esggo]
    related_skills: [oa-summon, oa-page-builder, oa-deploy]
---

# OA Skill Scaffold — 技能腳手架產生器

## Overview

快速建立符合 ESGGO 標準結構的 OA 技能。自動生成 SKILL.md（含 frontmatter、Overview、When to Use、Pitfalls、Verification Checklist）+ 子目錄。

## When to Use

- 用戶說「建立技能」、「新增 skill」、「scaffold」
- 需要建立新的 OA 子技能
- 需要確保新技能符合標準結構

**Don't use for:** 修改現有技能（用 `skill_manage(action='patch')`）、刪除技能

## Scaffold Process

### Step 1: 收集資訊

向用戶確認（未提供時使用預設值）：
- **技能名稱**（kebab-case，≤64 chars）
- **描述**（≤1024 chars，以 "Use when..." 開頭）
- **觸發詞**（用戶說什麼時路由到此技能）
- **相關技能**（related_skills 列表）

### Step 2: 建立目錄結構

```bash
mkdir -p skills/oa/<skill-name>/references
mkdir -p skills/oa/<skill-name>/templates
mkdir -p skills/oa/<skill-name>/scripts
```

### Step 3: 產生 SKILL.md

使用以下模板：

```markdown
---
name: <skill-name>
description: "<description>"
version: 1.0.0
author: ESGGO OmniAgent
license: MIT
metadata:
  hermes:
    tags: [<tag1>, <tag2>, <tag3>]
    related_skills: [<related-skill1>, <related-skill2>]
---

# <Skill Title>

## Overview

<One paragraph describing what this skill does.>

## When to Use

- User says "<trigger1>"
- User says "<trigger2>"
- User needs <capability>

**Don't use for:** <what this skill does NOT handle>

## Core Workflow

### Step 1: <Action>

```bash
<command>
```

### Step 2: <Action>

```bash
<command>
```

## Common Pitfalls

1. **<Pitfall>** — <Fix>
2. **<Pitfall>** — <Fix>

## Verification Checklist

- [ ] SKILL.md created at `skills/oa/<skill-name>/SKILL.md`
- [ ] Frontmatter valid (starts with `---`, has name + description)
- [ ] Description ≤ 1024 chars
- [ ] Name ≤ 64 chars, lowercase + hyphens
- [ ] Body ≤ 100,000 chars
- [ ] `related_skills` references resolve in-repo
- [ ] Git committed
```

### Step 4: 建立 Reference 檔案（如需要）

如果技能需要參考文件，在 `references/` 下建立：

```markdown
# <Reference Title>

<Content>
```

### Step 5: Git Commit

```bash
cd /c/Project/esggo
git add skills/oa/<skill-name>/
git commit --no-verify -m "feat: add OA skill <skill-name>"
```

## Frontmatter 規範

| 欄位 | 需求 | 限制 |
|------|------|------|
| name | ✅ 必填 | ≤64 chars, kebab-case |
| description | ✅ 必填 | ≤1024 chars, "Use when..." 開頭 |
| version | ✅ 必填 | semver |
| author | ✅ 必填 | "ESGGO OmniAgent" |
| license | ✅ 必填 | "MIT" |
| metadata.hermes.tags | ✅ 必填 | 3-5 個標籤 |
| metadata.hermes.related_skills | ✅ 必填 | 至少 1 個 |

## 檔案大小指引

| 類型 | 建議大小 |
|------|---------|
| SKILL.md | 8-15k chars |
| references/*.md | 2-5k chars each |
| templates/*.md | 1-3k chars each |
| scripts/*.sh/.py | 1-2k chars each |
| 總計 | ≤100k chars |

## Common Pitfalls

1. **Description 太長** — 超過 1024 chars 會被拒，精簡到核心觸發條件
2. **Name 用大寫或底線** — 必須 lowercase + hyphens（`oa-my-skill` ✓，`oaMySkill` ✗）
3. **忘記 related_skills** — 至少引用 1 個相關技能（通常是 `oa-summon`）
4. **SKILL.md 放錯目錄** — 必須在 `skills/oa/<name>/SKILL.md`，不是在 `~/.hermes/skills/`
5. **當前 session 看不到新技能** — skill loader 在 session 初始化時載入，新技能要到下次 session 才可見

## Verification Checklist

- [ ] 目錄結構建立完成
- [ ] SKILL.md frontmatter 完整
- [ ] Description ≤ 1024 chars
- [ ] Name ≤ 64 chars, kebab-case
- [ ] Git committed on main branch
