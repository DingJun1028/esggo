import { supabase } from '../db/supabaseClient.js';

interface Evidence {
  id: number | string;
  metric_key: string;
  metric_value_numeric: number;
  status: string;
  [key: string]: any;
}

interface EmissionFactor {
  id: number;
  co2e_per_unit: number;
  [key: string]: any;
}

/**
 * Calculates CO2e emissions for a given piece of evidence and stores the result.
 * @param {Evidence} evidence - The full evidence record from the database.
 */
async function calculateAndStoreEmissions(evidence: Evidence): Promise<void> {
  if (!evidence || evidence.status !== 'approved' || !evidence.metric_value_numeric) {
    console.log(
      `[Carbon Service] Skipping calculation for evidence ID: ${evidence.id} (not approved or no numeric value).`
    );
    return;
  }

  try {
    // 1. Find the appropriate emission factor
    // This logic can be expanded to be more sophisticated (e.g., based on region, year)
    let factor: EmissionFactor | undefined;

    // Heuristic Matching for now
    if (evidence.metric_key.includes('electricity') || evidence.metric_key.includes('kwh')) {
      const { data, error } = await supabase
        .from('emission_factors')
        .select('*')
        .eq('activity_type', 'electricity')
        .eq('unit', 'kWh')
        .order('year', { ascending: false })
        .limit(1)
        .single();

      if (!error && data) {
        factor = data;
      }
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
    const { error: updateError } = await supabase
      .from('evidence_vault')
      .update({
        calculated_co2e: calculatedCo2e,
        emission_factor_id: factor.id
      })
      .eq('id', evidence.id);

    if (updateError) throw updateError;

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
