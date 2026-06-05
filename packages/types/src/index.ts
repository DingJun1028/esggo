// Shared types for the ESGGO monorepo

/**
 * OmniCoreDataEntity defines the base properties for all data entities
 * in the ESGGO system, ensuring Data Sovereignty as per OmniCore Constitution.
 * Write operations must automatically attach these properties.
 */
export interface OmniCoreDataEntity {
  /** Unique identifier for the entity. */
  uuid: string;
  /** Version number, incremented on each significant update. */
  version: number;
  /** Timestamp of creation (ISO 8601 format). */
  createdAt: string;
  /** Timestamp of last update (ISO 8601 format). */
  updatedAt: string;
}

/**
 * NCBDBProtocolEntity extends OmniCoreDataEntity, adding specific
 * inscription fields required by the NCBDB_PROTOCOL.md for all data writes.
 */
export interface NCBDBProtocolEntity extends OmniCoreDataEntity {
  /** Email of the user who performed the operation. */
  user_email: string;
  /** Hash Lock corresponding to the original Supabase data for immutability verification. */
  integrity_hash: string;
}

export interface SharedUser extends OmniCoreDataEntity {
  id: string; // Keeping existing 'id' for compatibility/primary key notion
  name: string;
  email: string;
  role: 'admin' | 'user' | 'auditor';
}

export interface SharedESGReport extends NCBDBProtocolEntity {
  reportId: string; // Keeping existing 'reportId'
  companyName: string;
  year: number;
  status: 'draft' | 'submitted' | 'verified';
  score: number;
}
