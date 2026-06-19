# InfoOne UI/UX Specification

**Version**: 1.0.0
**Theme**: Aqua & Sovereign
**Philosophy**: 上善若水 (Highest virtue is like water)

---

## 🎨 Color Palette

| Category | Token | HEX | Usage |
|----------|-------|-----|-------|
| Primary  | `aqua.DEFAULT` | `#00FFFF` | Brand primary, main buttons, active states. |
| Accent   | `aqua.gold` | `#FFD700` | Sovereign accents, special highlights, "Trustworthy". |
| Success  | `aqua.emerald` | `#52C41A` | Positive states, "Traceable". |
| Background | `void` | `#050C14` | Main page background. |
| Surface  | `glass` | `rgba(255,255,255,0.05)` | Bento cards, panels. |

## 📐 Layout System (Bento Grid)

- **Base Unit**: 8px (4px micro-spacing).
- **Radius**: `card` (16px), `button` (8px), `input` (12px).
- **Glassmorphism**: 
  - `backdrop-blur`: 12px.
  - `border`: `1px solid rgba(255,255,255,0.1)`.
  - `shadow`: `0 8px 32px 0 rgba(0,0,0,0.37)`.

## 🛡️ 5T Protocol UI Indicators

Visualizing the 5 pillars of data integrity:

1. **Tangible (可感知)**: Aqua Blue pulse.
2. **Traceable (可溯源)**: Emerald Green line.
3. **Trackable (可追蹤)**: Deep Aqua path.
4. **Transparent (可驗算)**: Ice White transparency.
5. **Trustworthy (不可篡改)**: Sovereign Gold seal.

## 🧱 Atomic Components

### Buttons (`AquaButton`)
- Glass backgrounds with hover glows.
- Minimalist typography (Lexend).

### Inputs (`AquaInput`)
- Translucent input fields.
- Glowing focus states (Cyan blur).

### Bento Cards (`BentoCard`)
- Container for all content.
- Supports variable sizes (1x1, 2x1, 2x2).
