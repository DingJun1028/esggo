---
uuid: FACTORY-UNIVERSAL-001-FULL
version: 1.0.0
timestamp: 2026-06-08T17:00:00Z
evidence: "docs/wiki/00-SYS/universal-factory.md"
category: "00-SYS"
sequence: 001
tags: ["萬能工廠", "完整模板", "MECE", "IComponentCore", "5T", "自動化"]
---

# 🏭 **00-SYS-FACTORY-001: 萬能工廠 (Universal Factory)**

> **Purpose**: Consolidate requirements, theme, and config templates into one master generation system that can output **truthful**, **good**, **beautiful**, **trustworthy**, and **transferable** artifacts following **IComponentCore** and **MECE** principles.

---

## 🎯 Core Factory Blueprint

The Universal Factory operates as a **single source of truth** that can generate any of the following artifact types:

| Artifact Type | Trigger Command | Output Path | IComponentCore Header |
|--------------|---------------|-------------|---------------------|
| **需求文件** (REQ) | `npm run ufactory -- --type=req --id=AUTH-001` | `docs/wiki/02-DEV/REQ-AUTH-001.md` | ✅ Auto-filled |
| **主題標準** (THM) | `npm run ufactory -- --type=thm --id=CYAN-SOVEREIGN` | `src/styles/theme-tokens-cyan.json` + `docs/wiki/03-PRO/themes/THEME-CYAN-SOVEREIGN.md` | ✅ Auto-filled |
| **配置清單** (CFG) | `npm run ufactory -- --type=cfg --id=MECE-FULL` | `docs/wiki/00-SYS/universal-config-mece.md` | ✅ Auto-filled |

---

## 🔧 Integrated Templates

### 1️⃣ Universal Requirements Template (REQ)
```markdown
---
uuid: {{uuid}}
version: "{{version}}"
timestamp: "{{timestamp}}"
evidence: "{{evidence}}"
category: "02-DEV"
sequence: "{{seq}}"
tags: ["需求", "{{feature}}"]
---

# 📋 **{{category}}-REQ-{{seq}}-{{name}}**

## 需求描述
{{description}}

## 5T 對應
{{5t-table}}

## 依賴
{{dependencies}}
```

### 2️⃣ Universal Theme Template (THM)
```markdown
---
uuid: {{uuid}}
version: "{{version}}"
timestamp: "{{timestamp}}"
evidence: "src/styles/theme-tokens-{{themeId}}.json"
category: "03-PRO"
sequence: "{{seq}}"
tags: ["主題", "{{themeName}}"]
---

# 🎨 **{{category}}-THEME-{{seq}}-{{themeName}}**

## 5T 對應
{{5t-table}}

## 主題 JSON
{{theme-json}}
```

### 3️⃣ Universal Config Template (CFG)
```markdown
---
uuid: {{uuid}}
version: "{{version}}"
timestamp: "{{timestamp}}"
evidence: "docs/wiki/{{category}}/{{filename}}"
category: "{{category}}"
sequence: "{{seq}}"
tags: ["配置", "MECE"]
---

# 📐 **{{category}}-CFG-{{seq}}: MECE Configuration**

## 子類別清單
{{subcategories}}

## 5T 映射
{{5t-table}}
```

---

## 🔄 Factory Workflow

1. **Input Validation** → Ensure parameters follow MECE naming (`[CATEGORY]-[SUB]-[SEQ]-[NAME]`).
2. **Template Selection** → Route to REQ/THM/CFG generator.
3. **IComponentCore Injection** → Auto-generate UUID, timestamp, evidence link.
4. **File Creation** → Write to correct `docs/wiki/` subfolder.
5. **Hash Lock** → Run SHA-256 seal via `seal:doc`.
6. **Index Update** → Auto-append entry to `WIKI_INDEX.md`.

---

## 🚀 Quick Commands (npm)

```bash
# Generate Auth Requirement
npm run ufactory -- --type=req --id=AUTH-001 --name="User Login and JWT" --desc="Secure login flow with OIDC and JWT generation"

# Generate Cyan Theme
npm run ufactory -- --type=thm --id=CYAN-SOVEREIGN --name="ESGGO Cyan Sovereignty"

# Generate MECE Config Snapshot
npm run ufactory -- --type=cfg --id=MECE-FULL
```

---

## 🔐 Security & Traceability Guarantees

- **Truth**: Each artifact links back to its source code evidence via `evidence` field.
- **Goodness**: All generated files include publicly verifiable public fields and standards.
- **Beauty**: Theme artifacts include WCAG contrast validation and design token JSON.
- **Trust**: Every file is Hash-Locked at creation time (`seal:doc` runs automatically).
- **Transfer**: All schemas are JSON/YAML with TS types exported for programmatic consumption.

---

## 📚 Related Documents

- [00-SYS-000-PREFACE](00-SYS/00-SYS-000-PREFACE.md)
- [01-GOV-ZKP-001](01-GOV/ZKP-implementation.md)
- [02-DEV-100-TEMPLATE](02-DEV/template-universal-requirements.md)
- [03-PRO-THEME-001](03-PRO/themes/universal-theme.md)

---

## ✅ Usage Example

To generate a **Carbon Tracking Report Requirement**:

```bash
npm run ufactory -- --type=req --id=CARBON-002 --name="Carbon Data Ingestion API" --desc="Ingest carbon emission data from IoT sensors and store in ESG Data Layer" --deps="07-DAT-001-EMISSIONS"
```

This creates `docs/wiki/02-DEV/REQ-CARBON-002-Carbon-Data-Ingestion-API.md` with full IComponentCore metadata and updates `WIKI_INDEX.md`.

---

> This factory is designed to scale without entropy creep. All new features must flow through here first.