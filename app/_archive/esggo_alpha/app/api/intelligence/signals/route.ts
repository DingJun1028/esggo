import { NextResponse } from 'next/server';

const SIGNAL_TEMPLATES = [
  { title: "GRI 2025 Draft Leaked", desc: "Early draft of GRI 2025 shows stricter Scope 3 requirements for Asian SMEs.", category: "Policy", impact: "High" },
  { title: "New Green Tax in EU", desc: "EU parliament proposes carbon border adjustment tax for steel imports.", category: "Market", impact: "Medium" },
  { title: "Renewable Energy Spike", desc: "Global solar panel prices drop by 15% due to oversupply in manufacturing.", category: "Market", impact: "Low" },
  { title: "ISSB S1/S2 Adoption", desc: "More than 20 countries announce mandatory ISSB-aligned disclosures for 2026.", category: "Policy", impact: "High" },
  { title: "ESG Fund Inflow", desc: "Global ESG funds see first positive net inflow in 6 months.", category: "Market", impact: "Medium" },
  { title: "Climate Lawsuit Alert", desc: "Major energy company faces lawsuit over greenwashing in advertisement.", category: "Risk", impact: "High" },
  { title: "Biodiversity Framework", desc: "UN Kunming-Montreal Global Biodiversity Framework gains implementation support.", category: "Policy", impact: "Medium" },
  { title: "Sustainable Aviation Fuel", desc: "Airlines increase SAF blending targets to meet CORSIA requirements.", category: "Market", impact: "Medium" },
];

export async function GET() {
  // Simulate a random signal
  const randomSignal = SIGNAL_TEMPLATES[Math.floor(Math.random() * SIGNAL_TEMPLATES.length)];
  
  const signal = {
    ...randomSignal,
    id: `sig-${Math.random().toString(36).substring(2, 9)}`,
    timestamp: new Date().toISOString(),
    trustScore: 0.95 + Math.random() * 0.04,
  };

  return NextResponse.json(signal);
}
