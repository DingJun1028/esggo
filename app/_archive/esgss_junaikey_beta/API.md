# ESGss API Documentation

## ??????GeminiService

The primary gateway to the Sentient AI (Google Gemini).

### `generateStrategy(params)`

Generates high-level ESG strategies based on knowledge nodes.

- **Caching**: Enabled by default (in-memory).
- **Output**: Bilingual (Traditional Chinese & English) JSON.

### `ask(prompt, complexity)`

A generic conversational interface for specific AI tasks.

---

## ?? SovereignLedger

The truth layer of the ESGss ecosystem.

### `recordImpact(entry)`

Records a 5T-validated impact component.

- **Validation**: Requires `FiveTValidator` pass.
- **Persistence**: Crystallized into `OmniCrystal`.
- **Integrity**: Input must be `Object.freeze()`.

---

## ???FiveTValidator

The gatekeeper of data integrity.

### `validate5T(component)`

Checks for:

1. **Tangible**: Metrics presence.
2. **Traceable**: Source origin.
3. **Trackable**: Lifecycle hooks.
4. **Transparent**: Logic formula.
5. **Trustworthy**: Hash lock & Immutable state.

---

## ?? OmniElement

The "God Particle" of the Trinity architecture.

### `createInfoOne(label, attrs)`

Creates a new atomic piece of information, tagged and crystallized.

