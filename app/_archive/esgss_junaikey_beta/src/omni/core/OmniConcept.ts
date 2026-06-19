/**
 * ?’¡ OmniConcept (å¥§ç?æ¦‚å¿µ)
 * =========================================
 * [?¬è³ª] ?¬è³ª?·è±¡ Â· ?å?æ¨¡å? Â· ?ºæ…§çµæ™¶
 * [EN] Essence Embodiment. The Idea Model.
 *
 * OmniConcept represents the "Abstract Layer" of the system.
 * It defines the schemas, logic, and "Platonic Forms" that the OmniCrew executes.
 *
 * @concept
 * @version 1.0.0-Concept
 */

export interface IOmniConcept {
    /** å®šç¾© (Define): Structure the abstract idea */
    define(schema: any): void;

    /** æ¼”ç¹¹ (Deduce): Derive logic from the concept */
    deduce(context: any): any;

    /** çµæ™¶ (Crystallize): Solidify into specific form */
    crystallize(): any;
}

export const OmniConceptDefinition = {
    philosophy: "?¬è³ª?·è±¡",
    color: "#00E5FF", // Cyan
    element: "Air"
};
