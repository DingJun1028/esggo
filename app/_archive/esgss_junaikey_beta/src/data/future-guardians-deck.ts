import { IESCardCore } from '../types/cards';

export const FUTURE_GUARDIANS_DECK: readonly IESCardCore[] = Object.freeze([
  {
    uuid: 'ESGSS-CARD-2026-001-ENV',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    category: 'Character',
    metadata: {
      title: '環境修復者 (The Environmental Restorer)',
      subTitle: '瑪莉娜博士 - 首席海洋AI生態學家',
      visualStyle:
        'Cyberpunk-Eco, Female Scientist in Bio-Sensor Dive Suit, Manta-ray Cleaner Drones, Deep Blue & Coral Neon',
    },
    stats: { E: 98, S: 85, G: 88 },
    logicGate: {
      source_origin: 'prompt_ref_future_guardians_001',
      lifecycle_hooks: ['created', 'verified_by_biomimicry_module'],
      formula_ref: '[UN-SDG-14-Life-Below-Water]',
    },
    evidence: {
      calculation_logic: 'Microplastic_Removal_Rate * Coral_Regeneration_Index',
      verification_status: 'Verified',
    },
    hash_lock: 'a1b2c3d4e5...placeholder',
  },
  {
    uuid: 'ESGSS-CARD-2026-002-SOC',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    category: 'Character',
    metadata: {
      title: '社群構築師 (The Community Architect)',
      subTitle: '陳雷歐 - 城市農業技術官',
      visualStyle:
        'Urban-Agritech, Male Leader with Tablet, Vertical Farming Skyscraper, Warm Green & Sunlight Gold',
    },
    stats: { E: 85, S: 98, G: 90 },
    logicGate: {
      source_origin: 'prompt_ref_future_guardians_002',
      lifecycle_hooks: ['created', 'verified_by_social_equity_impact'],
      formula_ref: '[UN-SDG-11-Sustainable-Cities]',
    },
    evidence: {
      calculation_logic: 'Food_Miles_Saved + Community_Engagement_Score',
      verification_status: 'Verified',
    },
    hash_lock: 'f6g7h8i9j0...placeholder',
  },
  {
    uuid: 'ESGSS-CARD-2026-003-CIR',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    category: 'Character',
    metadata: {
      title: '循環煉金術士 (The Circular Alchemist)',
      subTitle: '田中健二 - 材料再生工程師',
      visualStyle:
        'Industrial-Futurism, Male Engineer with Goggles, Molecular Reassembler, Metallic Silver & Recycled Polymer Colors',
    },
    stats: { E: 95, S: 80, G: 92 },
    logicGate: {
      source_origin: 'prompt_ref_future_guardians_003',
      lifecycle_hooks: ['created', 'verified_by_circular_economy_standard'],
      formula_ref: '[UN-SDG-12-Responsible-Consumption]',
    },
    evidence: {
      calculation_logic: 'Material_Recovery_Rate * Energy_Efficiency_Factor',
      verification_status: 'Verified',
    },
    hash_lock: 'k1l2m3n4o5...placeholder',
  },
  {
    uuid: 'ESGSS-CARD-2026-004-NRG',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    category: 'Character',
    metadata: {
      title: '能源領航者 (The Energy Navigator)',
      subTitle: '安雅·沙瑪 - 分佈式能源系統架構師',
      visualStyle:
        'Solar-Punk, Female Architect in Desert Oasis, Solar Array Background, Bright Amber & Clean White',
    },
    stats: { E: 92, S: 95, G: 85 },
    logicGate: {
      source_origin: 'prompt_ref_future_guardians_004',
      lifecycle_hooks: ['created', 'verified_by_energy_access_protocol'],
      formula_ref: '[UN-SDG-7-Affordable-Clean-Energy]',
    },
    evidence: {
      calculation_logic: 'Renewable_Capacity_Added + Energy_Poverty_Reduction',
      verification_status: 'Verified',
    },
    hash_lock: 'p6q7r8s9t0...placeholder',
  },
  // --- EVENT CARDS ---
  {
    uuid: 'ESGSS-EVENT-2026-001-ENV',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    category: 'Event',
    metadata: {
      title: '深藍復甦行動 (Op. Deep Blue Revival)',
      subTitle: 'PACIFIC PURIFICATION ZONE',
      visualStyle:
        'Underwater Cinematic, Glowing Nanobots Swarm, Clean Ocean Gradient, Futuristic HUD Overlay',
    },
    stats: { E: 99, S: 70, G: 80 },
    logicGate: {
      source_origin: 'event_ref_001_deep_blue',
      lifecycle_hooks: ['activated', 'outcome_verified'],
      formula_ref: '[Metric: Microplastic_Reduction_Tonnes]',
    },
    evidence: {
      calculation_logic: 'Total_Plastic_Removed / Ocean_Volume_Index',
      verification_status: 'Success (90% Removal)',
    },
    hash_lock: 'ev1_hash_lock_secured',
  },
  {
    uuid: 'ESGSS-EVENT-2026-002-SOC',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    category: 'Event',
    metadata: {
      title: '在地豐收節 (Local Harvest Festival)',
      subTitle: 'NEO-TAIPEI SKY FARM',
      visualStyle:
        'Community Celebration, Vertical Farm Harvest, Warm Sunset Lighting, VR/AR Overlay',
    },
    stats: { E: 80, S: 99, G: 85 },
    logicGate: {
      source_origin: 'event_ref_002_harvest',
      lifecycle_hooks: ['organized', 'distributed'],
      formula_ref: '[Metric: Food_Security_Index_Boost]',
    },
    evidence: {
      calculation_logic: 'Households_Fed * Nutrient_Density_Score',
      verification_status: 'Verified (Zero Waste)',
    },
    hash_lock: 'ev2_hash_lock_secured',
  },
  {
    uuid: 'ESGSS-EVENT-2026-003-CIR',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    category: 'Event',
    metadata: {
      title: '物質重生協議 (Matter Rebirth Protocol)',
      subTitle: 'INFINITY LOOP CENTER',
      visualStyle:
        'High-Tech Factory, Molecular Reassembly Process, Silver & Neon Green, Holographic Schematics',
    },
    stats: { E: 95, S: 75, G: 98 },
    logicGate: {
      source_origin: 'event_ref_003_rebirth',
      lifecycle_hooks: ['processing', 'output_certified'],
      formula_ref: '[Metric: Circularity_Rate_Percentage]',
    },
    evidence: {
      calculation_logic: 'Waste_Input - Raw_Material_Output ~= 0',
      verification_status: 'Loop Closed (100%)',
    },
    hash_lock: 'ev3_hash_lock_secured',
  },
  {
    uuid: 'ESGSS-EVENT-2026-004-NRG',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    category: 'Event',
    metadata: {
      title: '光點連結之夜 (Night of Connected Light)',
      subTitle: 'SAHARA OASIS MICROGRID',
      visualStyle:
        'Desert Night, Constellation of Lights, Golden Glow, Satellite Connectivity Visualization',
    },
    stats: { E: 90, S: 98, G: 88 },
    logicGate: {
      source_origin: 'event_ref_004_light_connect',
      lifecycle_hooks: ['grid_online', 'stable_upload'],
      formula_ref: '[Metric: Energy_Access_Tier_Level]',
    },
    evidence: {
      calculation_logic: 'Villages_Connected * Stability_Uptime',
      verification_status: 'Grid Stable',
    },
    hash_lock: 'ev4_hash_lock_secured',
  },
]);
