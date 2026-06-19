# Impact Nexus: AI RPG Card Game Design Specification (v1.0.0)

## 🎮 Overview
"Goodward Sustainability Village" is an AI-driven RPG where players restore a digital ecosystem by practicing real-world ESG (Environmental, Social, Governance) values. Using a "Liquid Glass" aesthetic, players mint cards, fight "Entropy Devourers," and build a "Soul Resonance" (Rs) score.

## 🏛️ Core Design Principles (5T & Anti-Gravity)
- **Tangible**: Cards are digital assets representing real impact.
- **Traceable**: Every card has a source origin (e.g., ISO-14064-1 data).
- **Trackable**: Player progression is stored as a timeline of achievements.
- **Transparent**: Game mechanics and Rs calculations are open.
- **Trustworthy**: Completed achievements and cards are sealed with a Hash Lock.

## 🧬 System Architecture

### 1. Data Contract (IComponentCore)
All game entities (cards, NPCs, village nodes) must implement the core contract.
```typescript
interface IImpactCard extends IComponentCore {
  readonly element: 'Environment' | 'Social' | 'Governance';
  readonly powerValue: number; // Calculated from Rs
  readonly isMinted: boolean;
  metadata: {
    name: string;
    description: string;
    rarity: 'Common' | 'Rare' | 'Aria';
    visuals: string; // CSS/Shader reference
  };
}
```

### 2. Game Logic (SustainabilityVillageService)
- **Minting**: Creates new cards based on system activities (e.g., reading reports).
- **Purification**: The "Healing Agent" scans for data gaps and resolves them.
- **Resonance**: Calculates the current village health and player impact.

## ⚔️ Gameplay Mechanics

### Battle System: 5T Resonance Cycle
1. **Scoping**: Identify "Entropy Nodes" (red jittering elements).
2. **Entanglement**: Play cards to link with the node (Gooey Effect).
3. **Purification**: Use "Zero-Hallucination" skills to clean data.
4. **Engraving**: Finalize the battle with a Hash Lock.

### Village NPCs
- **Dr. Thoth**: The Mentor (Philosophy & Wisdom).
- **Carbon Explorer**: Environment Auditor (Shanwei Tech).
- **Goodward Pioneer**: Social Practitioner (Kentu).
- **Voice of Transparency**: Governance Liaison (Language Steps).
- **Soul Metric Auditor**: Traceability Expert (Quanren).

## 🎨 Visual Aesthetics: Liquid Glass
- **Color Palette**: Aqua Cyan (#63a6b0) as primary, with Eternal Gold accents.
- **Effects**: Gaussian Blur (20px),饱和 (180%), backdrop-filter.
- **Transitions**: Spring-based scales, magnetic attraction for cards.

## 📜 Soul Resonance (Rs) Formula
$$Rs = \frac{\sum (Truth \times Goodness)}{Entropy} \times \log(Trust + 1)$$
- **Truth**: ISO metadata compliance.
- **Goodness**: Impact metrics value.
- **Entropy**: Unverified data or tech debt.
- **Trust**: History of successful engravings.
