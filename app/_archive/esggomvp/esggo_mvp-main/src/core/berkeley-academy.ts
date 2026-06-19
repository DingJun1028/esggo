/**
 * 🎓 Berkeley Certification Academy — Core Engine
 * "Service as Teaching, Knowledge as Asset"
 */

import { OmniOne } from "@/core/omni-one";
import { v4 as uuidv4 } from "uuid";

export enum CourseCategory {
    ENVIRONMENTAL = "Environmental Sustainable",
    SOCIAL = "Social Responsibility",
    GOVERNANCE = "Corporate Governance",
    ENERGY = "Energy Management",
    CARBON = "Carbon Accounting"
}

export enum CourseLevel {
    BEGINNER = "Beginner",
    INTERMEDIATE = "Intermediate",
    ADVANCED = "Advanced",
    PROFESSIONAL = "Professional Master"
}

export interface ICourse {
    id: string;
    title: string;
    description: string;
    category: CourseCategory;
    level: CourseLevel;
    duration: string;
    xpReward: number;
    skills: string[];
    price?: number; // In credits or assets
}

export interface ICertificate {
    uuid: string;
    courseId: string;
    userId: string;
    issuedAt: number;
    hashLock: string;
    status: "Trustworthy";
}

export const BERKELEY_COURSES: ICourse[] = [
    {
        id: "env-101",
        title: "ESG Fundamentals & GRI Standards",
        description: "Introduction to ESG reporting and the Global Reporting Initiative framework.",
        category: CourseCategory.ENVIRONMENTAL,
        level: CourseLevel.BEGINNER,
        duration: "4 Hours",
        xpReward: 1000,
        skills: ["GRI Reporting", "Stakeholder Engagement"]
    },
    {
        id: "carbon-201",
        title: "ISO 14064-1 Carbon Accounting",
        description: "Deep dive into greenhouse gas quantification and reporting at the organization level.",
        category: CourseCategory.CARBON,
        level: CourseLevel.INTERMEDIATE,
        duration: "12 Hours",
        xpReward: 2500,
        skills: ["Carbon Management", "Scope 1-3 Calculation"]
    },
    {
        id: "gov-301",
        title: "Supply Chain Due Diligence (CSDDD)",
        description: "Mastering corporate sustainability governance in global supply chains.",
        category: CourseCategory.GOVERNANCE,
        level: CourseLevel.ADVANCED,
        duration: "8 Hours",
        xpReward: 3000,
        skills: ["Governance", "Risk Management"]
    }
];

export class BerkeleyAcademy {
    /**
     * enrollment logic
     */
    static async enroll(courseId: string, userId: string) {
        // Log enrollment as a Traceable event
        console.log(`[Berkeley Academy] User ${userId} enrolled in ${courseId}`);
        return { success: true, timestamp: Date.now() };
    }

    /**
     * Issue a 5T-compliant certificate
     */
    static async issueCertificate(courseId: string, userId: string): Promise<ICertificate> {
        const course = BERKELEY_COURSES.find(c => c.id === courseId);
        if (!course) throw new Error("Course not found");

        const uuid = uuidv4();

        // Manifest as an Eternal Asset via OmniOne
        const atom = await OmniOne.manifest({
            intent: `Certificate Issuance: ${course.title}`,
            type: "Accomplishment",
            domainRef: "BerkeleyAcademy_Hub",
            payload: {
                courseId,
                courseTitle: course.title,
                userId,
                level: course.level
            },
            impactMetric: `Certified ${course.title}`,
            sourceOrigin: "BerkeleyAcademy_V1"
        });

        return {
            uuid: atom.uuid,
            courseId,
            userId,
            issuedAt: atom.timestamp,
            hashLock: atom.hash_lock,
            status: "Trustworthy"
        };
    }
}
