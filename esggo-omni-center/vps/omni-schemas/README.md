# ESGGO OmniDB — Deployment Runbook

Files:
- 01-create-omni-schemas.sql
- 02-base-metadata.sql
- 03-profile-vector.sql
- 04-lifecycle-log.sql
- 05-trust-ledger.sql

## Prerequisites
1. Autonomous Database created (Data Warehouse / Always Free).
2. Wallet downloaded and `tnsnames.ora` available.
3. ADMIN password set.

## Steps
1. Connect as ADMIN using wallet.
2. Run 01-create-omni-schemas.sql
3. Run 02-base-metadata.sql as OMNI_BASE_METADATA
4. Run 03-profile-vector.sql as OMNI_PROFILE_VECTOR
5. Run 04-lifecycle-log.sql as OMNI_LIFECYCLE_LOG
6. Run 05-trust-ledger.sql as OMNI_TRUST_LEDGER
7. Verify:
   - SELECT COUNT(*) FROM base_emission_factors;
   - SELECT COUNT(*) FROM lifecycle_events;
   - SELECT COUNT(*) FROM omni_points_ledger;
