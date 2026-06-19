import pool from './index.js';

const factors = [
  {
    source_name: 'Taiwan Power Company',
    category: 'Scope 2',
    region: 'TW',
    year: 2023,
    activity_type: 'electricity',
    unit: 'kWh',
    co2e_per_unit: 0.495, // Example 2023 value
  },
  {
    source_name: 'Taiwan Power Company',
    category: 'Scope 2',
    region: 'TW',
    year: 2022,
    activity_type: 'electricity',
    unit: 'kWh',
    co2e_per_unit: 0.495,
  },
];

async function seed() {
  console.log('Seeding Emission Factors...');
  try {
    for (const factor of factors) {
      const exists = await pool.query(
        `SELECT id FROM emission_factors 
         WHERE source_name = $1 AND region = $2 AND year = $3 AND activity_type = $4 AND unit = $5`,
        [factor.source_name, factor.region, factor.year, factor.activity_type, factor.unit]
      );

      if (exists.rows.length === 0) {
        await pool.query(
          `INSERT INTO emission_factors 
           (source_name, category, region, year, activity_type, unit, co2e_per_unit)
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [
            factor.source_name,
            factor.category,
            factor.region,
            factor.year,
            factor.activity_type,
            factor.unit,
            factor.co2e_per_unit,
          ]
        );
        console.log(`Added factor: ${factor.source_name} ${factor.year}`);
      } else {
        console.log(`Factor already exists: ${factor.source_name} ${factor.year}`);
      }
    }
    console.log('Emission Factors Seeding Complete.');
  } catch (error) {
    console.error('Seeding failed:', error);
  } finally {
    // Don't close pool if imported, but if run standalone, we might need to.
    // pool.end();
  }
}

// Execute if run directly
// Execute if run directly
const isMainModule =
  process.argv[1] === import.meta.url.replace('file:///', '').replace('file://', '');
// Or simpler: just run it if we know we are invoking it.
// For now, let's just run it.
seed()
  .then(() => {
    console.log('Seed finished');
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });

export default seed;
