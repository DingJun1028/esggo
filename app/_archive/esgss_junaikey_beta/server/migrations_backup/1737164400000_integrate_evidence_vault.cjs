exports.shorthands = undefined;

exports.up = pgm => {
  // Enable UUID extension if not already enabled
  pgm.sql('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');

  // 1. Create blockchain_anchors table
  pgm.createTable('blockchain_anchors', {
    id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('uuid_generate_v4()'),
    },
    data_hash: {
      type: 'varchar(64)',
      notNull: true,
      comment: '4T Protocol: Calculable - SHA256 hash of data',
    },
    transaction_id: {
      type: 'varchar(255)',
      comment: 'Blockchain transaction ID',
    },
    block_number: {
      type: 'integer',
      comment: 'Block number on blockchain',
    },
    network: {
      type: 'varchar(50)',
      default: 'ethereum',
      comment: 'Blockchain network (ethereum, polygon, etc.)',
    },
    status: {
      type: 'varchar(20)',
      notNull: true,
      default: 'pending',
      check: "status IN ('pending', 'confirmed', 'failed')",
    },
    confirmations: {
      type: 'integer',
      default: 0,
    },
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
    updated_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });

  pgm.createIndex('blockchain_anchors', 'data_hash');
  pgm.createIndex('blockchain_anchors', 'transaction_id');

  // 2. Create zkp_proofs table
  pgm.createTable('zkp_proofs', {
    id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('uuid_generate_v4()'),
    },
    proof_type: {
      type: 'varchar(20)',
      notNull: true,
      default: 'groth16',
      comment: 'ZKP proof type',
    },
    proof_data: {
      type: 'text',
      notNull: true,
      comment: 'JSON stringified proof',
    },
    public_inputs: {
      type: 'jsonb',
      notNull: true,
      comment: 'Public inputs for verification',
    },
    qr_code: {
      type: 'text',
      comment: 'Base64 encoded QR code for verification',
    },
    valid_until: {
      type: 'timestamp',
      notNull: true,
      comment: 'Proof expiration date',
    },
    verification_key: {
      type: 'text',
      comment: 'Verification key',
    },
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });

  // 3. Create evidence_vault table
  pgm.createTable('evidence_vault', {
    id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('uuid_generate_v4()'),
    },
    user_id: {
      type: 'uuid',
      notNull: true,
      comment: 'User who uploaded the evidence',
    },
    storage_path: {
      type: 'text',
      notNull: true,
      comment: 'GCS path to original document',
    },
    data_type: {
      type: 'varchar(50)',
      notNull: true,
      comment: 'Type of evidence (utility_bill, training_record, etc.)',
    },
    status: {
      type: 'varchar(20)',
      notNull: true,
      default: 'pending',
      check: "status IN ('pending', 'approved', 'rejected')",
    },
    assignee_id: {
      type: 'uuid',
      comment: 'User assigned to review this evidence',
    },

    // Our system: 4T Protocol fields
    trace_id: {
      type: 'uuid',
      notNull: true,
      default: pgm.func('uuid_generate_v4()'),
      comment: '4T Protocol: Traceable - unique trace ID',
    },
    data_hash: {
      type: 'varchar(64)',
      notNull: true,
      comment: '4T Protocol: Calculable - SHA256 hash',
    },

    // Our system: Trust layer integration
    blockchain_anchor_id: {
      type: 'uuid',
      references: 'blockchain_anchors',
      comment: '4T Protocol: Immutable - blockchain anchor',
    },
    zkp_proof_id: {
      type: 'uuid',
      references: 'zkp_proofs',
      comment: 'Zero-knowledge proof for this evidence',
    },

    // Our system: Awakening system integration
    awakening_impact: {
      type: 'jsonb',
      comment: 'Impact on 4 pillars: selfAwareness, enlightenment, selfReliance, altruism',
    },

    // Audit fields
    approved_by: {
      type: 'uuid',
      comment: 'User who approved/rejected',
    },
    approved_at: {
      type: 'timestamp',
      comment: 'When was it approved/rejected',
    },
    rejection_reason: {
      type: 'text',
      comment: 'Reason for rejection if rejected',
    },

    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
    updated_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });

  // Indexes for evidence_vault
  pgm.createIndex('evidence_vault', 'user_id');
  pgm.createIndex('evidence_vault', 'status');
  pgm.createIndex('evidence_vault', 'assignee_id');
  pgm.createIndex('evidence_vault', 'trace_id');
  pgm.createIndex('evidence_vault', 'data_hash');
  pgm.createIndex('evidence_vault', 'created_at');

  // 4. Create extracted_metrics table
  pgm.createTable('extracted_metrics', {
    id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('uuid_generate_v4()'),
    },
    evidence_id: {
      type: 'uuid',
      notNull: true,
      references: 'evidence_vault',
      onDelete: 'CASCADE',
      comment: 'Link to evidence vault',
    },
    metric_key: {
      type: 'varchar(100)',
      notNull: true,
      comment: 'e.g., electricity_usage, employee_training_hours',
    },
    category: {
      type: 'char(1)',
      notNull: true,
      check: "category IN ('E', 'S', 'G')",
      comment: 'ESG category',
    },

    // Support multiple data types
    numeric_value: {
      type: 'numeric',
      comment: 'For numeric metrics',
    },
    text_value: {
      type: 'text',
      comment: 'For text metrics',
    },
    date_value: {
      type: 'date',
      comment: 'For date metrics',
    },
    unit: {
      type: 'varchar(20)',
      comment: 'e.g., kWh, hours, USD',
    },

    // Additional metadata
    confidence_score: {
      type: 'numeric(3,2)',
      comment: 'AI extraction confidence (0.00-1.00)',
    },
    extraction_method: {
      type: 'varchar(50)',
      default: 'ai',
      comment: 'How was this extracted: ai, manual, ocr',
    },

    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });

  // Indexes for extracted_metrics
  pgm.createIndex('extracted_metrics', 'evidence_id');
  pgm.createIndex('extracted_metrics', ['category', 'metric_key']);
  pgm.createIndex('extracted_metrics', 'created_at');

  // 5. Create comments table
  pgm.createTable('evidence_comments', {
    id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('uuid_generate_v4()'),
    },
    evidence_id: {
      type: 'uuid',
      notNull: true,
      references: 'evidence_vault',
      onDelete: 'CASCADE',
    },
    user_id: {
      type: 'uuid',
      notNull: true,
      comment: 'User who wrote the comment',
    },
    comment_text: {
      type: 'text',
      notNull: true,
    },
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });

  pgm.createIndex('evidence_comments', 'evidence_id');
  pgm.createIndex('evidence_comments', 'user_id');
  pgm.createIndex('evidence_comments', 'created_at');

  // 6. Create updated_at trigger function
  pgm.sql(`
    CREATE OR REPLACE FUNCTION update_updated_at_column()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.updated_at = CURRENT_TIMESTAMP;
      RETURN NEW;
    END;
    $$ language 'plpgsql';
  `);

  // Apply trigger
  pgm.sql(`
    CREATE TRIGGER update_evidence_vault_updated_at
    BEFORE UPDATE ON evidence_vault
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
  `);

  pgm.sql(`
    CREATE TRIGGER update_blockchain_anchors_updated_at
    BEFORE UPDATE ON blockchain_anchors
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
  `);
};

exports.down = pgm => {
  pgm.dropTable('evidence_comments', { ifExists: true, cascade: true });
  pgm.dropTable('extracted_metrics', { ifExists: true, cascade: true });
  pgm.dropTable('evidence_vault', { ifExists: true, cascade: true });
  pgm.dropTable('zkp_proofs', { ifExists: true });
  pgm.dropTable('blockchain_anchors', { ifExists: true });
  pgm.sql('DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE');
};
