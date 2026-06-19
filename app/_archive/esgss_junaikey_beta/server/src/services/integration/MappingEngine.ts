import omniLogger, { LogCategory } from '../../../utils/omniLogger.js';

export interface IMappingStrategy<TSource, TTarget> {
    map(source: TSource): TTarget;
}

/**
 * L1 Assessment Mapping Strategy
 * Maps internal L1 Assessment result to OmniSpace "Company Record" format.
 */
export const L1AssessmentToOmniMap: IMappingStrategy<any, any> = {
    map: (source: any) => {
        return {
            company_name: source.companyName,
            industry_sector: source.industry,
            employee_count: source.employeeCount,
            esg_score: source.score,
            compliance_status: source.overallStatus, // 'Green', 'Yellow', 'Red'
            contact_email: source.email,
            contact_person: source.contactPerson,
            ghg_inventory: source.hasGhInventory ? 'Yes' : 'No',
            code_of_conduct: source.hasCodeOfConduct ? 'Yes' : 'No',
            last_assessed_at: new Date().toISOString(),
            source_system: 'JunAiKey Genesis'
        };
    }
};

/**
 * User Contact Mapping Strategy
 * Maps internal User to OmniSpace "Contact" format.
 */
export const UserToOmniContactMap: IMappingStrategy<any, any> = {
    map: (user: any) => {
        return {
            external_id: user.id,
            email: user.email,
            full_name: user.name || 'Unknown',
            role: user.role || 'User',
            signup_date: user.created_at
        };
    }
};

export class MappingEngine {
    /**
     * Transforms data using a specific strategy.
     */
    public static transform<TSource, TTarget>(
        data: TSource,
        strategy: IMappingStrategy<TSource, TTarget>
    ): TTarget {
        try {
            return strategy.map(data);
        } catch (error: any) {
            omniLogger.error(LogCategory.INTEGRATION, 'Mapping failed', { error: error.message });
            throw new Error('Data mapping failed');
        }
    }
}
