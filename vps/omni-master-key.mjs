// vps/omni-master-key.mjs
// ============================================================
// 🔑 OmniMasterKey (萬能鑰匙) — Root Secret-Vault Manager
// ============================================================
//
// This is the management definition that GOVERNS the secret vault:
//   1. 管理秘密倉庫裡的鑰匙密碼  → VAULT registry (every key/password)
//   2. 管各項認證              → AUTH resolvers (gateway / agent / db / cloud)
//   3. 管各種邏輯              → LOGIC registry + cooperation/execution helpers
//
// Hierarchy (最高層 → 管理層):
//   OmniKey      (萬能元鑰, OMNI_KEY)        = SUPREME master key, highest layer.
//   OmniMasterKey(萬能鑰匙, OMNI_MASTER_KEY) = vault-management key, operates
//                                              UNDER OmniKey's authority.
//
// All values are read from process.env, populated on the VPS by sourcing the
// gitignored .env.secrets (see vps/deploy-after-merge.sh). Neither key must
// ever be logged or committed.
//
// Usage:
//   import { gatewayKey, audit, OmniMasterKey } from './omni-master-key.mjs';
// ============================================================

// OmniKey (萬能元鑰) — SUPREME, highest layer. Root of all authority.
const SUPREME_KEY = process.env.OMNI_KEY || '';
// OmniMasterKey (萬能鑰匙) — vault-management key, governed by OmniKey.
const VAULT_KEY = process.env.OMNI_MASTER_KEY || '';

// ──────────────────────────────────────────────────────────────
// 1. VAULT — every key/password the master key governs
// ──────────────────────────────────────────────────────────────
const VAULT = {
  ai: {
    GEMINI_API_KEY: { required: true, desc: 'Google Gemini (VPS-native inference)' },
    AGNES_API: { required: false, desc: 'Agnes AI gateway key' },
    NEXT_PUBLIC_AGNES_API_KEY: { required: false, desc: 'Agnes key exposed to client' },
    GROQ_API_KEY: { required: false, desc: 'Groq free-tier inference' },
    OPENROUTER_API_KEY: { required: false, desc: 'OpenRouter free-tier inference' },
  },
  auth: {
    OMNI_KEY: { required: true, desc: 'SUPREME master key — highest layer (萬能元鑰)' },
    OMNI_MASTER_KEY: { required: true, desc: 'Vault-management key (萬能鑰匙), under OmniKey' },
    GATEWAY_API_KEY: { required: false, desc: 'Alias of OMNI_KEY (backward compat)' },
    GATEWAY_KEY: { required: false, desc: 'Legacy alias of OMNI_KEY' },
    SUPABASE_SERVICE_ROLE_KEY: { required: false, desc: 'Supabase admin auth' },
    NEXT_PUBLIC_SUPABASE_ANON_KEY: { required: false, desc: 'Supabase anon auth' },
  },
  db: {
    MYSQL_HOST: { required: true, desc: 'OCI MySQL HeatWave host' },
    MYSQL_PORT: { required: false, desc: 'MySQL port', default: '3306' },
    MYSQL_USER: { required: false, desc: 'MySQL user', default: 'admin' },
    MYSQL_PASS: { required: true, desc: 'MySQL password' },
    MYSQL_DB: { required: false, desc: 'MySQL DB name', default: 'esggo_omni' },
    ADB_PASS: { required: true, desc: 'Oracle ADB admin password' },
    ADB_SERVICE: { required: true, desc: 'Oracle ADB TNS service name' },
    WALLET_DIR: { required: false, desc: 'ADB wallet dir', default: '$HOME/oci-wallet' },
  },
  cloud: {
    ADB_OCID: { required: false, desc: 'Oracle ADB OCID (OCI fn deploy)' },
    WALLET_PASSWORD: { required: false, desc: 'Wallet export password' },
    FN_APP: { required: false, desc: 'OCI Functions app name' },
    DB_USER: { required: false, desc: 'ADB schema user' },
    DB_PASSWORD: { required: false, desc: 'ADB schema password' },
  },
};

// ──────────────────────────────────────────────────────────────
// 2. AUTH — resolvers returning the right credential per domain
// ──────────────────────────────────────────────────────────────
function gatewayKey() {
  return process.env.OMNI_KEY || process.env.GATEWAY_API_KEY || process.env.GATEWAY_KEY || '';
}
function agentToken() {
  return process.env.OMNI_KEY || process.env.GATEWAY_TOKEN || process.env.GATEWAY_API_KEY || '';
}
function mysqlDsn() {
  const host = process.env.MYSQL_HOST || '';
  const port = process.env.MYSQL_PORT || '3306';
  const user = process.env.MYSQL_USER || 'admin';
  const db = process.env.MYSQL_DB || 'esggo_omni';
  return host ? `mysql://${user}:***@${host}:${port}/${db}` : '';
}
function adbConnectString() {
  const svc = process.env.ADB_SERVICE || '';
  const user = process.env.ADB_USER || 'ADMIN';
  return svc ? `${user}/***@${svc}` : '';
}

// ──────────────────────────────────────────────────────────────
// 3. LOGIC — managed cooperation / execution flows
// ──────────────────────────────────────────────────────────────
const LOGIC = {
  gateway_cooperation: {
    desc: 'Agent registers → heartbeat (health) → pull queued commands → execute → report result',
    endpoints: ['/agent/register', '/agent/heartbeat', '/agent/command', '/agent/result', '/agents', '/status'],
  },
  command_execution: {
    desc: 'Local shell execution of gateway-queued commands via child_process.execSync',
    sandboxed: false,
    note: 'VPS-native relay — only authorized agents (valid OmniKey) may queue commands',
  },
  schema_deploy: {
    desc: 'deploy-omnidb.sh applies MySQL + Oracle ADB OmniDB schemas from vps/{mysql,omni}-schema',
    requires: ['MYSQL_HOST', 'MYSQL_PASS', 'ADB_PASS', 'ADB_SERVICE'],
  },
  release: {
    desc: 'deploy-after-merge.sh: git reset --hard origin/main → install → schema → PM2 reload',
    requires: ['OMNI_MASTER_KEY', 'OMNI_KEY'],
  },
};

// ──────────────────────────────────────────────────────────────
// Management helpers
// ──────────────────────────────────────────────────────────────
function audit() {
  const missing = [];
  for (const [cat, entries] of Object.entries(VAULT)) {
    for (const [name, meta] of Object.entries(entries)) {
      const present = !!process.env[name];
      if (meta.required && !present) missing.push(`${cat}.${name}`);
      if (present && meta.default && !process.env[name]) {
        process.env[name] = meta.default; // materialize defaults
      }
    }
  }
  if (!SUPREME_KEY) missing.push('auth.OMNI_KEY');
  if (!VAULT_KEY) missing.push('auth.OMNI_MASTER_KEY');
  return {
    ok: missing.length === 0,
    missing,
    supremeKeySet: !!SUPREME_KEY,
    vaultKeySet: !!VAULT_KEY,
  };
}

function summary() {
  const counts = {};
  let required = 0;
  let set = 0;
  for (const [cat, entries] of Object.entries(VAULT)) {
    counts[cat] = { total: 0, set: 0 };
    for (const [name, meta] of Object.entries(entries)) {
      counts[cat].total++;
      if (meta.required) required++;
      if (process.env[name]) {
        counts[cat].set++;
        if (meta.required) set++;
      }
    }
  }
  return {
    supremeKeySet: !!SUPREME_KEY,
    vaultKeySet: !!VAULT_KEY,
    requiredSecrets: required,
    requiredSecretsSet: set,
    byCategory: counts,
    logicFlows: Object.keys(LOGIC),
  };
}

const OmniMasterKey = {
  SUPREME_KEY,
  VAULT_KEY,
  VAULT,
  LOGIC,
  gatewayKey,
  agentToken,
  mysqlDsn,
  adbConnectString,
  audit,
  summary,
};

export {
  OmniMasterKey,
  VAULT,
  LOGIC,
  gatewayKey,
  agentToken,
  mysqlDsn,
  adbConnectString,
  audit,
  summary,
};
export default OmniMasterKey;
