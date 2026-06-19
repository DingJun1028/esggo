import { StoryChapter, NewsArticle, CaseStudy } from '@/types';

class ContentService {
  // ========================================================================
  // Story Mode
  // ========================================================================

  async getStoryChapters(level: number): Promise<StoryChapter[]> {
    // Mock Data
    return [
      {
        id: 'ch1_awakening',
        title: 'Chapter 1: The Awakening',
        description: 'In the ocean of data, you hear the cry of the Earth...',
        unlockLevel: 1,
        isUnlocked: true,
        isCompleted: false,
        rewards: { gsc: 100, exp: 50 },
        scenes: [
          {
            id: 's1_intro',
            background: 'bg-space-dark',
            characters: [],
            dialogue: {
              speaker: 'System',
              text: 'System Initializing... Neural Link Established... Sync Rate 100%...',
            },
          },
          {
            id: 's2_gaia',
            background: 'bg-space-dark',
            characters: [{ name: 'Gaia', avatar: '🤖', position: 'center' }],
            dialogue: {
              speaker: 'Gaia',
              text: 'Good morning, Architect. I am Gaia, your navigator. We have detected severe ecological imbalance signals.',
            },
            choices: [
              { text: 'What happened?', nextSceneId: 's3_explain' },
              { text: 'Open Tactical Panel', nextSceneId: 's3_explain' },
            ],
          },
          {
            id: 's3_explain',
            background: 'bg-ruined-city',
            characters: [{ name: 'Gaia', avatar: '🤖', position: 'center' }],
            dialogue: {
              speaker: 'Gaia',
              text: 'Human industrial activities have breached planetary boundaries. We need your ESG knowledge to restore balance.',
            },
          },
        ],
      },
      {
        id: 'ch2_carbon',
        title: 'Chapter 2: Black Sky',
        description: 'First stop is an industrial city shrouded in smog...',
        unlockLevel: 5,
        isUnlocked: level >= 5,
        isCompleted: false,
        rewards: { gsc: 200, exp: 100 },
        scenes: [],
      },
      {
        id: 'ch3_ocean',
        title: 'Chapter 3: Silent Sea',
        description: 'Microplastics exceed limits, the whales are weeping...',
        unlockLevel: 10,
        isUnlocked: level >= 10,
        isCompleted: false,
        rewards: { gsc: 300, exp: 150 },
        scenes: [],
      },
    ];
  }

  // ========================================================================
  // News Center
  // ========================================================================

  async getLatestNews(): Promise<NewsArticle[]> {
    return [
      {
        id: 'news_001',
        title: 'EU CBAM Pilot Begins, Exporters Take Note',
        summary:
          'The EU Carbon Border Adjustment Mechanism (CBAM) pilot starts this month, covering steel, aluminum, cement, etc.',
        content: `
            <p>The highly anticipated <strong>Carbon Border Adjustment Mechanism (CBAM)</strong> pilot phase officially marks the beginning of a new era in global trade. This regulation, designed to counter carbon leakage, will initially apply to imports of specific goods whose production is carbon intensive.</p>
            <h3>Key Sectors Impacted</h3>
            <ul>
                <li>Iron and Steel</li>
                <li>Aluminum</li>
                <li>Cement</li>
                <li>Fertilizers</li>
                <li>Hydrogen</li>
            </ul>
            <p>During the transitional phase, importers will only have to report emissions embedded in their goods without paying any financial adjustment. This period is intended to serve as a learning phase for all stakeholders (importers, producers and authorities) and to collect useful information on embedded emissions to refine the methodology.</p>
            <h3>What This Means for Asian Exporters</h3>
            <p>For manufacturers in Taiwan and wider Asia, the urgency to implement robust carbon accounting systems has never been higher. Failure to comply with reporting standards could result in fines even during this pilot phase.</p>
        `,
        source: 'EU Commission',
        date: '2025-10-01',
        category: 'Policy',
        impactScore: 9,
        imageUrl: 'https://placehold.co/600x400/10b981/ffffff?text=CBAM',
      },
      {
        id: 'news_002',
        title: 'Breakthrough Solid-State Battery Announced',
        summary: 'New solid-state battery increases EV range by 50% and is safer.',
        content: `
            <p>In a press conference that stunned the automotive industry, <strong>QuantumVolt</strong> announced the successful commercial scalability of their proprietary solid-state battery technology.</p>
            <p>Unlike conventional lithium-ion batteries which use liquid electrolytes, solid-state batteries use solid electrolytes, making them safer and more energy-dense.</p>
            <h3>Performance Stats</h3>
            <ul>
                <li><strong>Range:</strong> +50% vs comparable Li-ion</li>
                <li><strong>Charging Speed:</strong> 0-80% in 9 minutes</li>
                <li><strong>Cycle Life:</strong> >2000 cycles</li>
            </ul>
            <p>This breakthrough is expected to accelerate the global transition to electric vehicles by eliminating range anxiety once and for all.</p>
        `,
        source: 'TechCrunch',
        date: '2025-09-28',
        category: 'Tech',
        impactScore: 8,
        imageUrl: 'https://placehold.co/600x400/3b82f6/ffffff?text=Battery+Tech',
      },
      {
        id: 'news_003',
        title: 'Patagonia Donates Profits to Earth',
        summary:
          'Founder announces Earth is now the only shareholder, setting a new CSR benchmark.',
        content: `
            <p>Patagonia founder <strong>Yvon Chouinard</strong> has given away the company. All voting stock has been transferred to the <strong>Patagonia Purpose Trust</strong>, created to protect the company's values; and all nonvoting stock has been given to the <strong>Holdfast Collective</strong>, a nonprofit dedicated to fighting the environmental crisis and defending nature.</p>
            <blockquote>"Earth is now our only shareholder." - Yvon Chouinard</blockquote>
            <p>This unprecedented move sets a new standard for corporate social responsibility, challenging other billionaire founders to rethink the purpose of their wealth and their companies.</p>
        `,
        source: 'BBC News',
        date: '2025-09-15',
        category: 'Social',
        impactScore: 10,
        imageUrl: 'https://placehold.co/600x400/f43f5e/ffffff?text=Patagonia',
      },
    ];
  }

  // ========================================================================
  // Case Studies
  // ========================================================================

  async getCaseStudies(): Promise<CaseStudy[]> {
    return [
      {
        id: 'case_unilever',
        companyName: 'Unilever',
        industry: 'FMCG',
        title: 'Sustainable Living Plan (USLP)',
        challenge: 'How to decouple growth from environmental footprint?',
        solution: 'Commitment to 100% sustainable sourcing and plastic reduction.',
        result: 'Sustainable living brands grew 69% faster than others.',
        tags: ['Supply Chain', 'Plastic Reduction', 'Sourcing'],
      },
      {
        id: 'case_orsted',
        companyName: 'Ørsted',
        industry: 'Energy',
        title: 'Black to Green',
        challenge: 'Originally DONG Energy, heavily reliant on fossil fuels.',
        solution: 'Complete transformation to offshore wind leader, divest oil business.',
        result: 'Carbon reduced by 86%, market cap doubled.',
        tags: ['Energy Transition', 'Business Transformation'],
      },
      {
        id: 'case_interface',
        companyName: 'Interface',
        industry: 'Manufacturing (Carpet)',
        title: 'Mission Zero',
        challenge: 'Carpet manufacturing is pollution-heavy.',
        solution: 'Founder Ray Anderson set Mission Zero 2020 goal, biomimicry design.',
        result: 'Carbon footprint reduced by 96%, saved $400M costs.',
        tags: ['Circular Economy', 'Biomimicry'],
      },
    ];
  }
}

export const contentService = new ContentService();
