import pool from '../db/index.js';

const migrate = async () => {
    const client = await pool.connect();
    try {
        console.log('Migrating: Adding l1_assessments table...');

        await client.query(`
      CREATE TABLE IF NOT EXISTS l1_assessments (
        id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id uuid,
        company_name text,
        industry text,
        employee_count integer,
        
        -- Compliance Flags
        has_gh_inventory boolean DEFAULT false,
        has_code_of_conduct boolean DEFAULT false,
        has_sustainability_report boolean DEFAULT false,
        supply_chain_policy boolean DEFAULT false,
        
        -- Score & Status
        score integer,
        overall_status varchar(20),
        
        -- Contact
        contact_person text,
        contact_email text,
        
        created_at timestamp NOT NULL DEFAULT current_timestamp
      );
    `);

        console.log('Success: l1_assessments table created.');
    } catch (err) {
        console.error('Migration failed:', err);
    } finally {
        client.release();
        process.exit();
    }
};

migrate();
