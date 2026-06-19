import { supabase } from '../db/supabaseClient.js';
import blockchainService from './EvidenceBlockchainService.js';
import carbonService from './CarbonService.js';
import { EvidenceVaultService } from './EvidenceVaultService.js';
import { logicGateService } from './LogicGateService.js';
import fs from 'fs';
import path from 'path';

// Type definitions
interface EvidenceData {
  storage_path: string;
  data_type: string;
  [key: string]: unknown;
}

interface OCRResult {
  key: string;
  value: number;
  [key: string]: unknown;
}

interface EvidenceRecord {
  id: number;
  storage_path: string;
  data_type: string;
  metric_key: string;
  metric_value_numeric: number;
  status: string;
  awakening_impact: Record<string, unknown>;
  [key: string]: unknown;
}

type EvidenceStatus = 'approved' | 'rejected';

/**
 * Adds a new piece of evidence to the database.
 */
export async function addEvidence(evidenceData: EvidenceData, ocrResult: OCRResult | null = null): Promise<EvidenceRecord> {
  const { storage_path, data_type, user_id, description } = evidenceData;
  const key = ocrResult?.key || 'manual_upload';
  const value = ocrResult?.value || 0;

  // Calculate File Hash (if local file exists)
  let fileHash = '';
  // Assuming storage_path might be local for now or we download it if needed.
  // In our evidenceRoutes, we have access to localFilePath. 
  // Let's assume evidenceData might carry the hash or path.
  if (evidenceData.local_path && fs.existsSync(evidenceData.local_path as string)) {
    const buffer = fs.readFileSync(evidenceData.local_path as string);
    fileHash = EvidenceVaultService.calculateFileHash(buffer);
  }

  try {
    const { data, error } = await supabase
      .from('evidence_vault')
      .insert({
        storage_path,
        data_type,
        metric_key: key,
        metric_value_numeric: value,
        status: 'pending_validation',
        awakening_impact: { pillar: "利他", impact: "Universal Service", verified: false },
        user_id,
        description: description || '',
        data_hash: fileHash || undefined // Support existing column
      })
      .select()
      .single();

    if (error) throw error;

    console.log('Successfully added evidence to the database:', data);
    return data as EvidenceRecord;
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    console.error('Error adding evidence to the database:', err);
    throw err;
  }
}

/**
 * Retrieves all evidence uploaded by a specific user.
 */
export async function getUserEvidence(userId: number): Promise<EvidenceRecord[]> {
  try {
    const { data, error } = await supabase
      .from('evidence_vault')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as EvidenceRecord[];
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    console.error(`Error fetching evidence for user ${userId}:`, err);
    throw err;
  }
}

/**
 * Retrieves all evidence records that are pending validation.
 */
export async function getPendingEvidence(): Promise<EvidenceRecord[]> {
  try {
    // Attempting to join with emission_factors
    // If FK is not named standardly, this might need adjustment.
    // Assuming 'emission_factors' is the table name and relationship is detectable.
    const { data, error } = await supabase
      .from('evidence_vault')
      .select('*, emission_factors(source_name, co2e_per_unit)')
      .eq('status', 'pending_validation')
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Flatten the result to match EvidenceRecord structure expected by frontend usually
    // But EvidenceRecord interface above doesn't explicitly have them.
    // The original query returned `emission_factor_source` and `emission_factor_value`.
    const mappedData = data.map((record: any) => {
      const ef = Array.isArray(record.emission_factors) ? record.emission_factors[0] : record.emission_factors;
      return {
        ...record,
        emission_factor_source: ef?.source_name,
        emission_factor_value: ef?.co2e_per_unit,
      };
    });

    return mappedData as EvidenceRecord[];
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    console.error('Error fetching pending evidence:', err);
    throw err;
  }
}

/**
 * Updates the status of an evidence record.
 */
export async function updateEvidenceStatus(
  id: number,
  newStatus: EvidenceStatus,
  validatorUserId?: number
): Promise<EvidenceRecord> {
  if (newStatus !== 'approved' && newStatus !== 'rejected') {
    throw new Error("Invalid status. Must be 'approved' or 'rejected'.");
  }

  try {
    // Must fetch current data (especially awakening_impact) to update JSONB safely if not using specialized query?
    // Supabase doesn't support jsonb_set directly in .update() easily without rpc
    // However, we can fetch, modify, and update.
    // OR we can trust the client to send the full object? No, this is backend service.
    // Original query: awakening_impact = jsonb_set(awakening_impact, '{verified}', 'true')

    // Fetched current record
    const { data: fullRecord, error: fetchFullError } = await supabase
      .from('evidence_vault')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchFullError) throw fetchFullError;
    if (!fullRecord) throw new Error(`Evidence with ID ${id} not found.`);

    // 1. Perform Logic Gate Inspection (Transparent/Trackable/Traceable)
    const inspectionData = {
      ...fullRecord,
      impactScore: (fullRecord.metric_value_numeric || 0) / 100, // Normalized score placeholder
      evidenceVerified: true,
      aestheticSignature: true, // Placeholder for 5T Beauty
      sourceChain: fullRecord.storage_path,
      isHashedOnChain: !!fullRecord.blockchain_tx_id
    };

    const logicStatus = logicGateService.inspectPacket(id.toString(), inspectionData);

    // 2. Perform Hash Locking if Trustworthy
    let lockProof = '';
    let metadataHash = '';

    if (logicStatus.isTrustworthy && newStatus === 'approved') {
      metadataHash = EvidenceVaultService.calculateMetadataHash({
        fileName: path.basename(fullRecord.storage_path),
        fileType: fullRecord.data_type,
        fileSizeBytes: 0, // Should be fetched from storage info
        category: fullRecord.data_type,
        uploadedBy: fullRecord.user_id,
      } as any);

      const lockResult = EvidenceVaultService.performHashLock(
        id.toString(),
        fullRecord.data_hash || '',
        metadataHash
      );
      lockProof = lockResult.lockProof;
    }

    const newImpact = {
      ...(fullRecord.awakening_impact as object),
      verified: true,
      logic_gate_status: logicStatus
    };

    const { data, error } = await supabase
      .from('evidence_vault')
      .update({
        status: newStatus,
        validated_at: new Date().toISOString(),
        validator_user_id: validatorUserId,
        awakening_impact: newImpact,
        metadata_hash: metadataHash || undefined,
        lock_proof: lockProof || undefined,
        is_locked: logicStatus.isTrustworthy && newStatus === 'approved'
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    console.log(`Successfully updated status for evidence ID ${id} to ${newStatus}`);
    const updatedRecord = data as EvidenceRecord;

    // --- Trigger Background Tasks (Fire-and-forget) ---
    if (newStatus === 'approved') {
      // 1. Blockchain Anchoring
      blockchainService
        .anchorEvidence(updatedRecord)
        .then(async (proof) => {
          // Update DB with proof
          await supabase
            .from('evidence_vault')
            .update({
              onchain_anchor_hash: proof.anchorHash,
              blockchain_tx_id: proof.txId
            })
            .eq('id', id);
        })
        .then(() => console.log(`[Evidence Service] Anchored evidence ${id} on-chain.`))
        .catch(err =>
          console.error(`[Evidence Service] Blockchain anchoring failed for evidence ${id}:`, err)
        );

      // 2. Carbon Calculation
      carbonService
        .calculateAndStoreEmissions(updatedRecord)
        .catch(err =>
          console.error(`[Evidence Service] Carbon calculation failed for evidence ${id}:`, err)
        );
    }

    return updatedRecord;
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    console.error(`Error updating status for evidence ID ${id}:`, err);
    throw err;
  }
}

export default {
  addEvidence,
  getPendingEvidence,
  updateEvidenceStatus,
  getUserEvidence,
};
