exports.shorthands = undefined;

exports.up = pgm => {
  pgm.addColumns('evidence_vault', {
    onchain_anchor_hash: {
      type: 'text',
      notNull: false,
    },
    blockchain_tx_id: {
      type: 'text',
      notNull: false,
    },
  });

  pgm.createIndex('evidence_vault', 'onchain_anchor_hash');
};

exports.down = pgm => {
  pgm.dropIndex('evidence_vault', 'onchain_anchor_hash');
  pgm.dropColumns('evidence_vault', ['onchain_anchor_hash', 'blockchain_tx_id']);
};
