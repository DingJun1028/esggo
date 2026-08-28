---
name: output-language-hygiene
description: "Chinese output free of Japanese/Korean leaks."
version: 1.0.0
author: Hermes Agent
license: MIT
metadata:
  hermes:
    tags: [style, language, zh-hant, output-hygiene, multilingual-leak]
    category: software-development
    related_skills: [esggo-style, hermes-usage-best-practices, reporting-hygiene]
---

# Output Language Hygiene

## Overview

For this user, output language defaults to **Traditional Chinese**. When the agent produces technical replies, reasoning blocks, audit summaries, or any inline text in Chinese, it must not leak Japanese, Korean, or Simplified Chinese fragments into that text.

Two failure modes seen in this workspace:

1. **Reasoning-layer leak** — the internal chain-of-thought or intermediate block drifts into Japanese (particles の・に・を・は・が・から・で・て) or Korean morphemes, then gets sent as part of the reply.
2. **Mixed-language summary** — a Chinese summary paragraph contains short Korean/ Japanese fragments or Simplified Chinese bits (e.g. 跑 的), making the output look broken even though the surrounding text is Traditional Chinese.

This skill exists so the next session starts fixed on this class of defect — it is not about "one bad reply"; it is about the repeatable pattern.

## When to Use

- Producing any reply, report, or reasoning text primarily in Traditional Chinese.
- After drafting a Chinese reply, before sending: scan for non-target-language fragments.
- After a user points out Japanese/Korean/Simplified fragments in a reply: treat it as a style defect and patch the draft.

Do not use for: English-first tasks where English is the explicit target.

## Core Rule

If the agreed output language is Traditional Chinese, every visible character in the deliverable must belong to that language (plus necessary English technical keywords/names). No Japanese particles, no Korean morphemes, no Simplified Chinese fragments.

Forbidden excuses that must not be used to justify sending mixed text:
- "It's just reasoning noise."
- "It came from context contamination."
- "It's only in the intermediate block."

If a draft contains mixed fragments, rewrite before sending.

## Detection Heuristics

Run a quick scan over candidate output before sending. Look for:

### Japanese markers
- Particles: の・に・を・は・が・から・で・て・し・れ・ない・ある・する・しまう・けど・ので・かも・なら・いずれか
- Common verbs/adjectives in Japanese conjugation: 排除中, 衝突する, 確認して, 検出されてない, 侵入, 読んで, 影響

### Korean markers
- Morphemes/words: 파크한, 다음, 저리 (and similar short Korean forms)
- Note: Korean can be short and easy to miss — scan for any Hangul syllables (가-힣 range) in Chinese-context text

### Simplified Chinese markers
- 跑, 的 and similar simplified forms that conflict with a Traditional Chinese context

### Practical check
- When text is mostly Traditional Chinese, any isolated Japanese/ Korean syllable or Simplified form is a flag.
- If unsure whether a fragment is "just a technical term," err toward rewriting unless the term is a known English loanword or an established proper noun.

## Handling Workflow

1. Draft the reply in the target language.
2. Scan for the markers above.
3. If found, rewrite the affected sentences fully in the target language.
4. If the user flags a mix after sending, acknowledge it directly and correct — do not rationalize.

## Relationship to Other Skills

- **esggo-style** — Traditional Chinese output preference, concise factual delivery.
- **hermes-usage-best-practices** — goal-first instructions, finishing-the-job discipline.
- **reporting-hygiene** — numbered-step reporting discipline (parallel concern; both can apply to the same reply).

## Verification Checklist

- [ ] Final reply and any shown reasoning block are in the agreed language.
- [ ] No Japanese particles or Korean morphemes present.
- [ ] No Simplified Chinese fragments in a Traditional Chinese reply.
- [ ] English technical keywords are allowed only when they are genuine terms/names.
- [ ] If mixed text was caught after sending, it is acknowledged and corrected.

## References

- `references/multilingual-leak-patterns.md` — observed leak patterns from this workspace.
