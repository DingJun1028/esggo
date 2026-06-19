export const shorthands = undefined;

export async function up(pgm) {
  pgm.createTable('emission_factors', {
    id: 'id',
    source_name: { type: 'text', notNull: true },
    category: { type: 'text', notNull: true },
    region: { type: 'text', notNull: true },
    year: { type: 'integer', notNull: true },
    activity_type: { type: 'text', notNull: true },
    unit: { type: 'text', notNull: true },
    co2e_per_unit: { type: 'numeric', notNull: true },
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });

  pgm.addConstraint('emission_factors', 'unique_factor_constraint', {
    unique: ['source_name', 'region', 'year', 'activity_type', 'unit'],
  });
}

export async function down(pgm) {
  pgm.dropTable('emission_factors');
}
