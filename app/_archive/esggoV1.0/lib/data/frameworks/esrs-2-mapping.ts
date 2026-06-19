import { TFrameworkRequirement, TReportingFramework } from "@/lib/schemas/framework-mapping-schemas";

export const ESRS_2_FRAMEWORK: TReportingFramework = {
    id: "ESRS-2",
    name: "European Sustainability Reporting Standards",
    version: "BP-2024",
    description: "European standards for corporate sustainability reporting (CSRD).",
};

export const ESRS_2_REQUIREMENTS: TFrameworkRequirement[] = [
    {
        id: "ESRS-2-BP-1",
        frameworkId: "ESRS-2",
        title: "Preparation of sustainability statements",
        description: "Description of the basis of preparation of the sustainability statements.",
        mandate: "Mandatory",
    },
    {
        id: "ESRS-2-BP-2",
        frameworkId: "ESRS-2",
        title: "Disclosures in relation to specific circumstances",
        description: "Disclosures on time horizons, value chain estimation, and sources of estimation uncertainty.",
        mandate: "Mandatory",
    },
    {
        id: "ESRS-E1-1",
        frameworkId: "ESRS-2", // Part of Environmental Standards but aligned via ESRS 2 general core
        title: "Transition plan for climate change mitigation",
        description: "The undertaking shall disclose its transition plan for climate change mitigation.",
        mandate: "Mandatory",
    }
];
