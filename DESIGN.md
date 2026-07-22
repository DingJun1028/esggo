# Design Document: Thankful (Sustainable) Dashboard

## Overview
The **Thankful Dashboard** is a core component of the ESG GO platform, serving as the primary interface for the "Thankful (善)" dimension of the 5T protocol. It focuses on transparency, stakeholder resonance, and zero-hallucination computation.

## Key Architectures

### 1. 5T Protocol Integration
The dashboard implements the **JunAiKey 3.1.0** specification. Data is spiritually sealed via the `HolyLinter` pattern:
- **Immutability**: Every data node is frozen using `Object.freeze`.
- **Traceability**: Every interaction is logged in the **Omni Index**.
- **Truth Anchoring**: Real-time verification of computation logic.

### 2. Omni Index Lifecycle
The component utilizes the `useOmniIndex` hook for automated tracking:
- **CREATED**: Node initialization with metadata.
- **RENDERED**: Visual verification of data display.
- **INTERACTED**: User interaction (e.g., tab switching) tracking.
- **UNMOUNTED**: Clean-up and final sealing of the lifecycle node.

## UI Design System: Ultimate Minimalist
The dashboard follows a premium design aesthetic defined by:
- **Primary Color**: Cream White (`#FDFCFB`) - representing clarity and truth.
- **Text Color**: Deep Charcoal (`#1A1A1A`) - representing authority and grounding.
- **Accent Color**: Soft Amber - representing warmth and resonance.
- **Glassmorphism**: Subtle backdrops for complex data visualizations.

## Components
- **ViewHeader**: Contextual information and 3.1.0 versioning.
- **KPI Cards**: Standardized metrics with 5T score badges.
- **Algorithm Transparency Core**: A dynamic tabbed interface for status monitoring and logic inspection.
- **Stakeholder Resonance**: Sentiment-analyzed feedback feed.
- **JunAiKey Certificate Action**: Premium CTA for certificate generation.

## Responsive Strategy
- **Breakpoints**: 1024px (LG), 768px (MD), 640px (SM).
- **Transitions**: Smooth grid-to-stack transitions with zero layout shift.
- **Mobile UX**: Simplified navigation and information density reduction.
