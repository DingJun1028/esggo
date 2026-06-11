import React from 'react';
import OmniAgentCard from './OmniAgentCard';

export default function OmniCardsDemo() {
  return (
    <div className="flex flex-col gap-6">
      <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 shadow-2xl relative overflow-hidden">
        {/* Background ambient light */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-2xl bg-cyan-500/5 blur-[120px] pointer-events-none"></div>
        
        <div className="relative z-10 mb-8">
          <h2 className="text-2xl font-black text-white tracking-wider flex items-center gap-3">
            <span className="w-2 h-8 bg-cyan-500 rounded-sm"></span>
            萬能卡牌展示區 (Omni Agent Cards)
          </h2>
          <p className="text-slate-400 mt-2 font-medium">
            3D 視差、懸停特效、破框立繪與全息翻轉技術展示。
          </p>
        </div>

        <div className="relative z-10 flex flex-wrap gap-10 justify-center p-8">
          <OmniAgentCard
            id="agt-001"
            name="OmniGuardian"
            role="Security Enforcer"
            rarity="awakened"
            confidenceScore={98}
            fiveTStatus={[true, true, true, true, true]}
            skills={['Zero-Knowledge Proofs', 'Threat Intelligence', 'Row-Level Security']}
            jsonSchema={'{\n  "version": "2.0.1",\n  "protocol": "5T",\n  "status": "Awakened"\n}'}
            imageUrl="/assets/agents/omni_guardian.webp" // placeholder path, assuming you'll add the image later
          />
          
          <OmniAgentCard
            id="agt-002"
            name="DataSynthesizer"
            role="Analytics Engine"
            rarity="verified"
            confidenceScore={89}
            fiveTStatus={[true, true, true, false, true]}
            skills={['BigQuery ETL', 'Dataform Pipelines', 'Predictive Analysis']}
            jsonSchema={'{\n  "version": "1.5.0",\n  "protocol": "5T",\n  "status": "Verified"\n}'}
            imageUrl="/assets/agents/data_synthesizer.webp"
          />

          <OmniAgentCard
            id="agt-003"
            name="HermesNode"
            role="Data Ingestion"
            rarity="experimental"
            confidenceScore={65}
            fiveTStatus={[true, false, false, false, false]}
            skills={['Web Scraping', 'Unstructured Parsing']}
            jsonSchema={'{\n  "version": "0.9.0-beta",\n  "protocol": "5T",\n  "status": "Experimental"\n}'}
            imageUrl="/assets/agents/hermes_node.webp"
          />
        </div>
      </div>
    </div>
  );
}
