# InfoOne Sentient Design System (UI/UX Best Practices)

Version: v9.2.0-SENTIENT
Core Theme: Aqua Cyan (#63A6B0) & Eternal Gold (#FFD700)
Philosophy: "上善若水" (Being like water) & "服務即教學" (Service as Teaching)

## 1. The Sun & Moon System (Daylight/Nightlight)

All UI components must adapt to the global `--omni-time-mode`. 

- **MOON (Default)**: Use deep backgrounds (`#051110`) with glowing glass borders. Lower brightness (`0.8`) and subtle contrast.
- **SUN**: Use high-contrast pearl-colored backgrounds. Increased brightness (`1.1`) and vivid saturation for daylight readability.

### CSS Var Usage
```css
.card {
  background: var(--omni-bg);
  filter: brightness(var(--omni-time-brightness)) contrast(var(--omni-time-contrast));
}
```

## 2. Automatic Palette Derivation

The 5T Protocol requires all colors to be Derived, not Hardcoded.
Use `generateAutoPalette()` in `paletteGenerator.ts` to ensure harmony.

- **Primary**: The Soul Color.
- **Secondary**: The Complementary/Analogous highlight.
- **Surface**: Glassmorphism layer (`rgba(255,255,255,0.05)`).
- **Aura**: Radial glow matching the Soul Color.

## 3. RPG Visual Standards (Mana Tribute)

When designing RPG-centric grids or maps:

- **World Pillar (Mana Tree)**: Always center-aligned. Use the `MANA` node type with `Flower2` icon. Use `amber-400` overrides.
- **Isometric Shadows**: Every node must have a `translate-y-8` drop shadow for depth.
- **Magical Particles**: Use `motion.div` to emit "Mana Dust" rising from the bottom.
- **Entropy Jitter**: Corrupted nodes must "shiver" using subtle x/y keyframe animations.

## 4. 5T Protocol Feedback

- **Traceable**: Tooltips must show `source_origin`.
- **Trackable**: Use `Gantt` or `Heatmap` for historical paths.
- **Transparent**: Formulas like `E = Σ(A * D)` must be visible on hover.
- **Trustworthy**: Locked assets (100% health) must display the 🔒 `Hash Lock` variant.
- **Tangible**: Use "Liquid Glass" (backdrop-blur + opacity) to make data feel like a physical fluid.

---

**System Status**: TRANSCENDED & NIRVANA ♾️
