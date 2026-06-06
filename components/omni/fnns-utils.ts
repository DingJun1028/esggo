import { FnnsData } from './types';

/**
 * Parses a Unified FNNS (Function-Naming-Naming-Syntax) node name into its components.
 * Unified v4 format: [MECE前綴]-[序號]_[真實元件名稱]__[實體]__[動作/狀態]--[5T協定]
 * Example: ENV-001_OmniButton__CarbonScope1__Submit--Trustworthy
 * 
 * @param nodeName - The FNNS formatted string
 * @returns FnnsData object or null if invalid
 */
export const parseFnnsNodeName = (nodeName: string | undefined): FnnsData | null => {
  if (!nodeName) return null;
  
  // Try parsing Unified v4 (1 underscore before __)
  const matchV4 = nodeName.match(/^([A-Z]{3}-\d{3})_([a-zA-Z0-9]+)__([a-zA-Z0-9]+)__([a-zA-Z0-9]+)--([a-zA-Z0-9]+)$/);
  if (matchV4) {
    return {
      id: matchV4[1],
      affiliation: 'Omni', // Default affiliation for v4
      type: matchV4[2], // The actual component name, e.g., OmniButton
      entity: matchV4[3],
      action: matchV4[4],
      protocol: matchV4[5]
    };
  }

  // Fallback to legacy v3 format: ENV-001_Omni_Btn__CarbonScope1__Submit--Trustworthy
  const matchV3 = nodeName.match(/^([A-Z]{3}-\d{3})_([a-zA-Z0-9]+)_([a-zA-Z0-9]+)__([a-zA-Z0-9]+)__([a-zA-Z0-9]+)--([a-zA-Z0-9]+)$/);
  
  if (matchV3) {
    return {
      id: matchV3[1],
      affiliation: matchV3[2],
      type: matchV3[3],
      entity: matchV3[4],
      action: matchV3[5],
      protocol: matchV3[6]
    };
  }
  
  return null;
};
