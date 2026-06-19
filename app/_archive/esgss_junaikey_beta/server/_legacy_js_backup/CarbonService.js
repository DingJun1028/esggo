import pool from '../db/index.js';
/**
 * Calculates CO2e emissions for a given piece of evidence and stores the result.
 * @param {Evidence} evidence - The full evidence record from the database.
 */
async function calculateAndStoreEmissions(evidence) {
  if (!evidence || evidence.status !== 'approved' || !evidence.metric_value_numeric) {
    console.log(
      `[Carbon Service] Skipping calculation for evidence ID: ${evidence.id} (not approved or no numeric value).`
    );
    return;
  }
  try {
    // 1. Find the appropriate emission factor
    // This logic can be expanded to be more sophisticated (e.g., based on region, year)
    let factor;
    // Heuristic Matching for now
    if (evidence.metric_key.includes('electricity') || evidence.metric_key.includes('kwh')) {
      const factorResult = await pool.query(`SELECT * FROM emission_factors 
         WHERE activity_type = 'electricity' AND unit = 'kWh' 
         ORDER BY year DESC 
         LIMIT 1`);
      factor = factorResult.rows[0];
    }
    if (!factor) {
      console.warn(
        `[Carbon Service] No matching emission factor found for metric "${evidence.metric_key}" (Evidence ID: ${evidence.id}). Skipping calculation.`
      );
      return;
    }
    // 2. Perform the calculation
    const calculatedCo2e = Number(evidence.metric_value_numeric) * Number(factor.co2e_per_unit);
    // 3. Store the result back in the evidence_vault
    await pool.query(
      `UPDATE evidence_vault 
       SET calculated_co2e = $1, emission_factor_id = $2 
       WHERE id = $3`,
      [calculatedCo2e, factor.id, evidence.id]
    );
    console.log(
      `[Carbon Service] Successfully calculated and stored CO2e for evidence ID: ${evidence.id}. Value: ${calculatedCo2e.toFixed(4)} kgCO2e.`
    );
  } catch (error) {
    console.error(
      `[Carbon Service] ??Error calculating emissions for evidence ID ${evidence.id}:`,
      error
    );
    // We don't re-throw here, as this is a background process.
  }
}
export default { calculateAndStoreEmissions };
