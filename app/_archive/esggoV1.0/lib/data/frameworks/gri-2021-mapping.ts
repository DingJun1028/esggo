import { TFrameworkRequirement, TReportingFramework } from "@/lib/schemas/framework-mapping-schemas";

export const GRI_2021_FRAMEWORK: TReportingFramework = {
    id: "GRI-2021",
    name: "Global Reporting Initiative",
    version: "2021",
    description: "The global standard for sustainability reporting.",
    url: "https://www.globalreporting.org/standards/",
};

export const GRI_2021_REQUIREMENTS: TFrameworkRequirement[] = [
    {
        id: "GRI-302-1",
        frameworkId: "GRI-2021",
        title: "Energy consumption within the organization",
        description: "Report total fuel consumption within the organization, including non-renewable and renewable sources.",
        mandate: "Mandatory",
    },
    {
        id: "GRI-305-1",
        frameworkId: "GRI-2021",
        title: "Direct (Scope 1) GHG emissions",
        description: "Gross direct (Scope 1) GHG emissions in metric tons of CO2 equivalent.",
        mandate: "Mandatory",
    },
    {
        id: "GRI-305-2",
        frameworkId: "GRI-2021",
        title: "Energy indirect (Scope 2) GHG emissions",
        description: "Gross location-based energy indirect (Scope 2) GHG emissions in metric tons of CO2 equivalent.",
        mandate: "Mandatory",
    },
    {
        id: "GRI-305-3",
        frameworkId: "GRI-2021",
        title: "Other indirect (Scope 3) GHG emissions",
        description: "Gross other indirect (Scope 3) GHG emissions in metric tons of CO2 equivalent.",
        mandate: "Voluntary",
    },
    {
        id: "GRI-303-1",
        frameworkId: "GRI-2021",
        title: "Interactions with water as a shared resource",
        description: "A description of how the organization interacts with water, including how and where water is withdrawn, consumed, and discharged, and the water-related impacts the organization has caused or contributed to.",
        mandate: "Mandatory",
    },
    {
        id: "GRI-306-3",
        frameworkId: "GRI-2021",
        title: "Waste generated",
        description: "Total weight of waste generated in metric tons, and a breakdown of this total by composition of the waste.",
        mandate: "Mandatory",
    },
    {
        id: "GRI-405-1",
        frameworkId: "GRI-2021",
        title: "Diversity of governance bodies and employees",
        description: "Percentage of individuals within the organization's governance bodies and employees per employee category by gender, age group, and other indicators of diversity.",
        mandate: "Mandatory",
    },
    {
        id: "GRI-401-1",
        frameworkId: "GRI-2021",
        title: "New employee hires and employee turnover",
        description: "Total number and rate of new employee hires during the reporting period, by age group, gender and region.",
        mandate: "Mandatory",
    }
];
