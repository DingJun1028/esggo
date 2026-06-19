import { PrivacyLevel } from "./ncb-types";

export type UserRole =
    | 'internal_board'
    | 'internal_cso'
    | 'internal_staff'
    | 'external_auditor'
    | 'external_financier'
    | 'supply_chain'
    | 'public';

export type EsgDataType =
    | 'carbon_emission'      // 碳盤查數據
    | 'employee_salary'      // 員工薪資與性別平等
    | 'supplier_contracts'   // 供應商鏈敏感資安
    | 'general_content'      // 一般一般文本
    | 'board_governance';    // 董事會治理敏感資訊

/**
 * Dynamic Masking Rules Matrix (5T + ZKP Protocol)
 * 
 * Maps User Roles to their maximum allowed Privacy Level (Visibility).
 * 'Open' = Full Visibility
 * 'L1' = Fuzzy Masking (Range/Bucket)
 * 'L2' = Pseudonymization (ID Mask)
 * 'L3' = Irreversible De-ID (Hash Only)
 */
export const MaskingRules: Record<EsgDataType, Record<UserRole, PrivacyLevel>> = {
    carbon_emission: {
        internal_board: 'Open',
        internal_cso: 'Open',
        internal_staff: 'Open',
        external_auditor: 'L1', // Range-based check
        external_financier: 'L1',
        supply_chain: 'L2',
        public: 'L3'
    },
    employee_salary: {
        internal_board: 'Open',
        internal_cso: 'Open',
        internal_staff: 'L2', // Staff sees IDs instead of names
        external_auditor: 'L1', // Auditors see ranges
        external_financier: 'L2',
        supply_chain: 'L3',
        public: 'L3'
    },
    supplier_contracts: {
        internal_board: 'Open',
        internal_cso: 'Open',
        internal_staff: 'L2',
        external_auditor: 'L2',
        external_financier: 'L2',
        supply_chain: 'L3',
        public: 'L3'
    },
    board_governance: {
        internal_board: 'Open',
        internal_cso: 'Open',
        internal_staff: 'L3',
        external_auditor: 'L1',
        external_financier: 'L3',
        supply_chain: 'L3',
        public: 'L3'
    },
    general_content: {
        internal_board: 'Open',
        internal_cso: 'Open',
        internal_staff: 'Open',
        external_auditor: 'Open',
        external_financier: 'Open',
        supply_chain: 'Open',
        public: 'Open'
    }
};

/**
 * Utility to check if a specific role should see masked data.
 */
export function getRequiredPrivacy(dataType: EsgDataType, role: UserRole): PrivacyLevel {
    return MaskingRules[dataType]?.[role] || 'L3';
}
