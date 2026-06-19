exports.shorthands = undefined;

exports.up = pgm => {
  pgm.addColumns('evidence_vault', {
    calculated_co2e: {
      type: 'numeric',
      notNull: false,
    },
    emission_factor_id: {
      type: 'integer',
      notNull: false,
      references: 'emission_factors',
      onDelete: 'SET NULL',
    },
  });

  pgm.createIndex('evidence_vault', 'emission_factor_id');
};

exports.down = pgm => {
  pgm.dropIndex('evidence_vault', 'emission_factor_id');
  pgm.dropColumns('evidence_vault', ['calculated_co2e', 'emission_factor_id']);
};
