#!/usr/bin/env bash
set -euo pipefail

: "${ADB_OCID:?set ADB_OCID (the oci:database:autonomousdatabase:id)}"
: "${WALLET_PASSWORD:?set WALLET_PASSWORD}"
: "${FN_APP:?set FN_APP (OCI Functions application name)}"
: "${DB_USER:?set DB_USER}"
: "${DB_PASSWORD:?set DB_PASSWORD}"

cd "$(dirname "$0")/adb-wallet-fn"

WALLET_ZIP="/tmp/adb_wallet.zip"
rm -rf wallet && mkdir -p wallet

oci db autonomous-database generate-wallet \
  --autonomous-database-id "$ADB_OCID" \
  --password "$WALLET_PASSWORD" \
  --file "$WALLET_ZIP"

unzip -o "$WALLET_ZIP" -d wallet

export WALLET_PASSWORD DB_USER DB_PASSWORD
fn -v deploy --app "$FN_APP"
