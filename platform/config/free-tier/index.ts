/**
 * ESGGO 免費層整合索引
 *
 * 每個子模組僅宣告「需要的 env key / usage / 接線路徑」
 * 實際憑證請放在 .env / Vault，不要由這裡回傳真實值。
 */
export const FREE_TIER = {
  oracle: { envKeys: ["OCI_COMPARTMENT_ID","OCI_VAULT_SECRET_OCID"], path: "infra/vps/oracle-free-tier.md" },
  gcp: { envKeys: ["GOOGLE_APPLICATION_CREDENTIALS","FIREBASE_PROJECT_ID"], path: "docs/GCP-FREE-TIER-SAFETY-GUIDE.md" },
  firebase: { envKeys: ["FIREBASE_PROJECT_ID","FIREBASE_CLIENT_EMAIL","FIREBASE_PRIVATE_KEY"], path: "platform/config/free-tier/firebase.md" },
  cloudflare: { envKeys: ["CLOUDFLARE_ACCOUNT_ID","CLOUDFLARE_API_TOKEN"], path: "platform/config/free-tier/cloudflare.md" },
  notion: { envKeys: ["NOTION_TOKEN","NOTION_DATABASE_ID"], path: "platform/config/free-tier/notion.md" },
  telegram: { envKeys: ["TELEGRAM_BOT_TOKEN","TELEGRAM_CHAT_ID"], path: "infra/vps/comms/telegram-alert.sh" },
  upstash: { envKeys: ["UPSTASH_REDIS_REST_URL","UPSTASH_REDIS_REST_TOKEN"], path: "platform/config/free-tier/upstash.md" },
} as const;
export type FreeTierProvider = keyof typeof FREE_TIER;
