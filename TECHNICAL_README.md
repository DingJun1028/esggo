# Technical Documentation: Ultimate Minimalist Edition Migration 🌌

This document outlines the technical architecture, design standards, and migration methodology implemented during the transition to the **Ultimate Minimalist Edition** of the ESG GO platform.

## 🏛️ Design System Architecture

The "Ultimate Minimalist Edition" is built on **Rational Geometry** and **Mechanical Feedback** principles.

### 1. Semantic Design Tokens
All components now utilize a centralized set of semantic CSS variables defined in `app/globals.css`:
- `--color-bg-base`: Primary background (Cream/Charcoal).
- `--color-bg-surface`: Card and surface backgrounds.
- `--color-text-main`: High-contrast primary text.
- `--color-text-muted`: Low-contrast secondary text.
- `--color-primary`: Branding color (Zap/Action).
- `--color-border`: Standardized hairline borders (1px).

### 2. Unified Component Patterns
The following base components are used across all migrated views to ensure consistency:
- **`ViewHeader`**: Centralized branding and navigation header. Adapts dynamically based on `aiProxyMode`.
- **`GlassCard`**: Standardized container with 1px borders, subtle backdrop blur, and "Flat" shadow profiles.
- **`Badge`**: Status indicators with `optimal`, `warning`, and `lethal` variants.
- **`Button`**: Available in `solid`, `wireframe`, and `ghost` styles, using consistent tracking and uppercase typography.

## 🔄 Migration Methodology

### 1. View Standardization
Every sector-specific view was refactored into a unified container structure:
```tsx
<div className="view-container animate-in fade-in duration-500">
  <ViewHeader {...branding} />
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
    {/* Content Grid */}
  </div>
</div>
```

### 2. Sectors Migrated
- **Truthful (Verification)**: `ReportsView`, `OmniTruthView`, `ReconnaissanceView`.
- **Trustful (Evidence)**: `VaultView`, `ImpactNexusView`, `MaterialityMatrixView`, `BestPracticeView`.
- **Tasteful (Analytics)**: `DashboardView`, `EsgMetricsView`.
- **Thankful (Community)**: `NewsletterView`, `ThankfulDashboardView`.
- **System (Infrastructure)**: `OmniKnowledgeHub`, `SettingsView`.

### 3. Cause-Effect Repair (果因修復)
A specialized methodology to ensure data visibility:
- **Traceability Chain**: Implemented deep-linking between Dashboard metrics and raw evidence in `VaultView`.
- **Logic Surfacing**: Diagnostic terminals and "Architectural Notes" are embedded in views to explain the "Why" behind AI-generated "What".

## 🛡️ Technical Standards & Verification

### 1. Build Compliance
The project is configured for strict production builds:
- **Image Optimization**: All legacy `<img>` tags were replaced with `next/image` to satisfy LCP requirements.
- **ESLint Strictness**: Resolved all unescaped entity (`&quot;`) and hook dependency warnings.
- **Type Safety**: Formalized all prop types for `framer-motion` variants and `recharts` attributes.

### 2. Performance & Interaction
- **Animations**: Standardized `framer-motion` variants (`itemVariants`) for consistent staggered entry.
- **Responsiveness**: All cards utilize CSS Grid / Flexbox with `lg:grid-cols-3` or similar patterns for desktop optimization.

## 🛠️ How to Extend

To add a new view following this standard:
1.  **Define Branding**: Use the `aiProxyMode` to set dynamic titles/icons.
2.  **Use Semantic Tokens**: Avoid hardcoded hex/slate colors; use `var(--color-*)`.
3.  **Standardize Cards**: Wrap all logical sections in `<GlassCard>`.
4.  **Verify Build**: Always run `npm run build` to ensure no regression in type safety or optimization.

---

**ESG GO Technical Protocol** — *Precision, Transparency, and Minimalist Excellence.*
