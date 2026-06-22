# Skill Patterns & Conventions

Reference guide for creating well-structured, discoverable skills in the Hermes ecosystem.

---

## 1. Skill Naming Conventions

All skill names follow **kebab-case** formatting:

```
✅  data-transformer
✅  pdf-extractor
✅  slack-notifications
✅  oa-skill-scaffold

❌  DataTransformer      (PascalCase)
❌  data_transformer     (snake_case)
❌  dataTransformer      (camelCase)
❌  DATA-TRANSFORMER     (uppercase)
❌  data--transformer    (double hyphen)
❌  -data-transformer    (leading hyphen)
❌  data-transformer-    (trailing hyphen)
```

### Rules

| Rule                        | Constraint                                                            |
| --------------------------- | --------------------------------------------------------------------- |
| Character set               | Lowercase letters, digits, hyphens only (`[a-z0-9-]`)                 |
| Maximum length              | 64 characters                                                         |
| Format                      | kebab-case (words separated by single hyphens)                        |
| No leading/trailing hyphens | Name must start and end with `[a-z0-9]`                               |
| Semantic prefix             | Use a category prefix for namespacing (e.g., `oa-`, `pdf-`, `slack-`) |

---

## 2. Frontmatter Template

Every `SKILL.md` file **must** include YAML frontmatter with the following structure:

```yaml
---
name: your-skill-name
description: A concise description of what this skill does. Should be a single paragraph, no more than 1024 characters. This is displayed in skill listings and search results.
version: 1.0.0
author: your-name-or-org
license: MIT

metadata:
  hermes:
    tags:
      - utility
      - data
      - automation
    related_skills:
      - other-skill-name
      - another-skill-name
---
```

### Field Descriptions

| Field                            | Required | Type         | Description                                                                                  |
| -------------------------------- | -------- | ------------ | -------------------------------------------------------------------------------------------- |
| `name`                           | ✅ Yes   | string       | Kebab-case skill name (max 64 chars). Must match the skill directory name.                   |
| `description`                    | ✅ Yes   | string       | Human-readable summary of the skill's purpose (max 1024 chars). Used in search and listings. |
| `version`                        | ✅ Yes   | string       | Semantic versioning (`MAJOR.MINOR.PATCH`).                                                   |
| `author`                         | ✅ Yes   | string       | Name of the skill creator or organization.                                                   |
| `license`                        | ✅ Yes   | string       | SPDX license identifier (e.g., `MIT`, `Apache-2.0`, `GPL-3.0`).                              |
| `metadata.hermes.tags`           | ✅ Yes   | list[string] | Categorization tags for search/discovery. Use lowercase, hyphenated tags.                    |
| `metadata.hermes.related_skills` | ✅ Yes   | list[string] | Names of related skills (kebab-case). Can be empty list if none exist.                       |

### Optional Fields

| Field                             | Type         | Description                                       |
| --------------------------------- | ------------ | ------------------------------------------------- |
| `metadata.hermes.deprecated`      | bool         | Mark a skill as deprecated.                       |
| `metadata.hermes.min_cli_version` | string       | Minimum Hermes CLI version required.              |
| `metadata.hermes.platforms`       | list[string] | Supported platforms: `linux`, `macos`, `windows`. |

---

## 3. Size Limits

Adhere to these limits to ensure fast loading and proper indexing:

| Element               | Limit                | Notes                              |
| --------------------- | -------------------- | ---------------------------------- |
| `name`                | ≤ 64 characters      | Enforced at registration           |
| `description`         | ≤ 1024 characters    | Truncated in listings if longer    |
| Total SKILL.md file   | ≤ 100,000 characters | Includes frontmatter + all content |
| `tags` list           | ≤ 20 tags            | Each tag ≤ 64 chars                |
| `related_skills` list | ≤ 20 entries         | Each must be a valid skill name    |

> ⚠️ **Hard limit**: Files exceeding 100k characters will be rejected during indexing. Keep instructions concise; use the `references/` directory for supplementary material.

---

## 4. Common Mistakes Checklist

Before publishing a skill, verify none of these apply:

- [ ] **Name uses invalid characters** — Must be `[a-z0-9-]` only, no underscores, spaces, or uppercase
- [ ] **Name exceeds 64 characters** — Abbreviate or use a shorter semantic name
- [ ] **Description is too long** — Trim to 1024 characters; put detailed docs in `references/`
- [ ] **Missing required frontmatter fields** — All 7 required fields must be present
- [ ] **Version doesn't follow semver** — Use `MAJOR.MINOR.PATCH` format
- [ ] **Tags are not lowercase or use spaces** — Tags must be kebab-case: `data-transform` not `Data Transform`
- [ ] **Related skills reference non-existent names** — Every entry must be a registered skill
- [ ] **SKILL.md exceeds 100k characters** — Split long content into `references/` files
- [ ] **Frontmatter is not valid YAML** — Test with a YAML parser before committing
- [ ] **Name doesn't match directory name** — The skill directory and `name` field must be identical
- [ ] **License is not a valid SPDX identifier** — Use https://spdx.org/licenses/ for reference
- [ ] **Duplicate tags in the list** — Each tag should appear only once

---

## 5. Real-World Example: ESGGO Skill Frontmatter

Below is a well-structured `SKILL.md` frontmatter from the ESGGO project:

```yaml
---
name: oa-skill-scaffold
description: >
  Scaffolds new Hermes skills with a standardized directory structure,
  reference templates, and validation rules. Generates SKILL.md with
  proper frontmatter, a references/ folder for supplementary docs,
  and a tests/ directory for skill verification. Use when creating
  a new skill from scratch or bootstrapping a skill project.
version: 1.2.0
author: ESGGO
license: MIT

metadata:
  hermes:
    tags:
      - scaffolding
      - skill-management
      - developer-tools
      - templates
    related_skills:
      - oa-skill-validator
      - oa-skill-publisher
      - oa-skill-linter
---
```

### Why This Example Works

| Aspect             | What it does right                                                                |
| ------------------ | --------------------------------------------------------------------------------- |
| **Name**           | `oa-skill-scaffold` — kebab-case, semantic `oa-` prefix, 18 chars (well under 64) |
| **Description**    | 310 characters, clearly states purpose, when to use it, and what it generates     |
| **Version**        | `1.2.0` — proper semver                                                           |
| **Author**         | `ESGGO` — matches the organization                                                |
| **License**        | `MIT` — valid SPDX identifier                                                     |
| **Tags**           | 4 relevant, lowercase, hyphenated tags; no duplicates                             |
| **Related skills** | 3 related skills that exist in the ESGGO ecosystem                                |

---

## Quick Reference: Minimal Valid Frontmatter

```yaml
---
name: my-skill
description: Does one thing well.
version: 0.1.0
author: your-name
license: MIT

metadata:
  hermes:
    tags:
      - utility
    related_skills: []
---
```

---

_Last updated: 2026-06-22 | Hermes Skill Development Reference_
