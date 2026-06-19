import { TSupplier } from "../schemas/supply-chain-schemas";

const generateId = () => Math.random().toString(36).substring(2, 9);

export const MOCK_SUPPLIERS: TSupplier[] = [
    {
        id: generateId(),
        name: "Global_Foundries_Asia",
        region: "Asia_Pacific",
        industry: "Semicondutor",
        emissions: {
            scope3Emissions: 12500,
            reductionTarget: 85,
            dataConfidence: 0.98,
            lastAuditDate: "2024-03-15T10:00:00Z",
        },
        riskScore: 12,
        status: "Strategic_Partner",
        coordinates: { lat: 1.3521, lng: 103.8198 } // Singapore
    },
    {
        id: generateId(),
        name: "Eco_Logistics_EU",
        region: "Europe",
        industry: "Logistics",
        emissions: {
            scope3Emissions: 4200,
            reductionTarget: 92,
            dataConfidence: 0.95,
            lastAuditDate: "2024-02-28T14:30:00Z",
        },
        riskScore: 8,
        status: "Strategic_Partner",
        coordinates: { lat: 52.3676, lng: 4.9041 } // Amsterdam
    },
    {
        id: generateId(),
        name: "Shenzhen_Precision_Tech",
        region: "Greater_China",
        industry: "Industrial_Manufacturing",
        emissions: {
            scope3Emissions: 8900,
            reductionTarget: 45,
            dataConfidence: 0.72,
            lastAuditDate: "2024-01-10T09:00:00Z",
        },
        riskScore: 45,
        status: "Under_Review",
        coordinates: { lat: 22.5431, lng: 114.0579 } // Shenzhen
    },
    {
        id: generateId(),
        name: "Texas_Energy_Solutions",
        region: "North_America",
        industry: "Energy",
        emissions: {
            scope3Emissions: 22000,
            reductionTarget: 30,
            dataConfidence: 0.88,
            lastAuditDate: "2024-03-01T11:00:00Z",
        },
        riskScore: 65,
        status: "High_Risk",
        coordinates: { lat: 31.9686, lng: -99.9018 } // Texas
    },
    {
        id: generateId(),
        name: "Chile_Copper_Corp",
        region: "South_America",
        industry: "Raw_Materials",
        emissions: {
            scope3Emissions: 18400,
            reductionTarget: 60,
            dataConfidence: 0.82,
            lastAuditDate: "2024-03-20T16:00:00Z",
        },
        riskScore: 28,
        status: "Qualified",
        coordinates: { lat: -33.4489, lng: -70.6693 } // Santiago
    },
    {
        id: generateId(),
        name: "Nordic_Wind_Steel",
        region: "Europe",
        industry: "Raw_Materials",
        emissions: {
            scope3Emissions: 3100,
            reductionTarget: 98,
            dataConfidence: 0.99,
            lastAuditDate: "2024-04-01T08:30:00Z",
        },
        riskScore: 5,
        status: "Strategic_Partner",
        coordinates: { lat: 59.3293, lng: 18.0686 } // Stockholm
    },
    {
        id: generateId(),
        name: "Vietnam_Assembly_Plus",
        region: "Asia_Pacific",
        industry: "Industrial_Manufacturing",
        emissions: {
            scope3Emissions: 7200,
            reductionTarget: 55,
            dataConfidence: 0.68,
            lastAuditDate: "2023-12-15T13:00:00Z",
        },
        riskScore: 38,
        status: "Under_Review",
        coordinates: { lat: 10.8231, lng: 106.6297 } // Ho Chi Minh City
    },
    {
        id: generateId(),
        name: "Mumbai_Logistics_Hub",
        region: "Asia_Pacific",
        industry: "Logistics",
        emissions: {
            scope3Emissions: 15400,
            reductionTarget: 40,
            dataConfidence: 0.75,
            lastAuditDate: "2024-01-20T10:00:00Z",
        },
        riskScore: 52,
        status: "High_Risk",
        coordinates: { lat: 19.0760, lng: 72.8777 } // Mumbai
    },
    {
        id: generateId(),
        name: "Sao_Paulo_Components",
        region: "South_America",
        industry: "Semicondutor",
        emissions: {
            scope3Emissions: 6800,
            reductionTarget: 75,
            dataConfidence: 0.88,
            lastAuditDate: "2024-03-10T11:00:00Z",
        },
        riskScore: 15,
        status: "Strategic_Partner",
        coordinates: { lat: -23.5505, lng: -46.6333 } // Sao Paulo
    },
    {
        id: generateId(),
        name: "Australian_Mining_Group",
        region: "Asia_Pacific",
        industry: "Raw_Materials",
        emissions: {
            scope3Emissions: 32000,
            reductionTarget: 20,
            dataConfidence: 0.92,
            lastAuditDate: "2024-02-15T09:00:00Z",
        },
        riskScore: 58,
        status: "High_Risk",
        coordinates: { lat: -31.9505, lng: 115.8605 } // Perth
    },
    {
        id: generateId(),
        name: "Toronto_System_Integrators",
        region: "North_America",
        industry: "Industrial_Manufacturing",
        emissions: {
            scope3Emissions: 2400,
            reductionTarget: 95,
            dataConfidence: 0.98,
            lastAuditDate: "2024-04-05T14:00:00Z",
        },
        riskScore: 4,
        status: "Strategic_Partner",
        coordinates: { lat: 43.6532, lng: -79.3832 } // Toronto
    }
];
