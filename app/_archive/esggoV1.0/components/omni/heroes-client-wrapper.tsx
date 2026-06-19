"use client";

import { useRouter } from "next/navigation";
import { GenesisHeroesPanel } from "./genesis-heroes-panel";
import { useOmniSkills } from "@/hooks/use-omni-skills";
import { OmniRole } from "@/lib/omni-skill-engine";

export function HeroesClientWrapper() {
    const router = useRouter();
    const { setRole } = useOmniSkills();

    const handleSelectHero = (heroId: string) => {
        let newRole: OmniRole = "ReportScribe"; // default fallback

        switch (heroId) {
            case "hero-scribe":
                newRole = "ReportScribe";
                break;
            case "hero-alchemist":
                newRole = "DataAlchemist";
                break;
            case "hero-oracle":
                newRole = "ComplianceOracle";
                break;
            case "hero-strategist":
                newRole = "StrategyMaestro" as OmniRole;
                break;
            case "hero-sentinel":
                newRole = "AuditSentinel";
                break;
        }

        setRole(newRole);
        // After selection, navigate to the main dashboard or where appropriate
        router.push("/");
    };

    return <GenesisHeroesPanel onSelectHero={handleSelectHero} />;
}
