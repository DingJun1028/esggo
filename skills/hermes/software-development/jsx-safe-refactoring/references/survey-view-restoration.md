# esggo-learning-center survey view restoration

## Symptom
- `t.survey.title`, `t.survey.subtitle`, and all `t.survey.questions` text existed in `src/i18n/translations.js`.
- In `dist/assets/index-<hash>.js`, those strings were present in the bundle.
- Online, the satisfaction survey page rendered only generic form fields (`file`, `textarea`, submit); no ratings, meta fields, or open feedback questions appeared.

## Root cause
- `App.jsx` rendered `['upload','booking','question','survey']` through one shared generic form block.
- Only `question` had a special branch; `survey` therefore used the generic placeholders and never submitted structured survey data.

## Fix shape
- Split the generic block into explicit view branches: `booking|question` keep the old form, `upload` is removed from that block, and `survey` gets its own branch.
- Add a dedicated `SurveyForm` component for the survey view, wired to `handleSurveySubmit`.
- Preserve i18n through `t.survey.*` and `t.common.*` without hardcoded strings.

## Verification
- `pnpm run build` passed after the structural change.
- `vitest` worker startup timed out on this Windows host; the failure was environmental, not caused by the JSX change.
- Next session: user smoke test the online survey page and confirm ratings/feedback/attachments render.

## Lesson for skill
See `jsx-safe-refactoring` main skill for the general rule: distinct form views should not be collapsed into one generic JSX block.
