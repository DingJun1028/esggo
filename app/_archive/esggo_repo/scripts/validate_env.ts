import { existsSync, readFileSync } from "fs";
import { resolve } from "path";

interface EnvVar {
  key: string;
  description: string;
  required: boolean;
}

const REQUIRED_ENVS: EnvVar[] = [
  {
    key: "NEXT_PUBLIC_SUPABASE_URL",
    description: "Supabase 項目 URL",
    required: true,
  },
  {
    key: "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    description: "Supabase 匿名金鑰",
    required: true,
  },
  {
    key: "SUPABASE_SERVICE_ROLE_KEY",
    description: "Supabase 服務角色金鑰",
    required: true,
  },
  {
    key: "NEXT_PUBLIC_FIREBASE_API_KEY",
    description: "Firebase API 金鑰",
    required: true,
  },
  {
    key: "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
    description: "Firebase 認證域",
    required: true,
  },
  {
    key: "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
    description: "Firebase 項目 ID",
    required: true,
  },
];

function loadEnvFile(): void {
  const envPath = resolve(process.cwd(), ".env");
  if (!existsSync(envPath)) {
    console.warn("警告：未找到 .env 檔案，將從系統環境變數中讀取。");
    return;
  }
  const envContent = readFileSync(envPath, "utf-8");
  const envVars = envContent.split("\n");
  for (const line of envVars) {
    const [key, value] = line.split("=");
    if (key && value && !key.startsWith("#")) {
      process.env[key.trim()] = value.trim().replace(/["']/g, "");
    }
  }
}

function validateEnv(): void {
  loadEnvFile();

  let hasErrors = false;
  console.log("正在驗證環境變數...\n");

  for (const env of REQUIRED_ENVS) {
    const value = process.env[env.key];
    if (env.required && !value) {
      console.error(`缺失或空值: ${env.key}`);
      console.error(`   說明: ${env.description}\n`);
      hasErrors = true;
    } else {
      console.log(`有效: ${env.key}`);
    }
  }

  if (hasErrors) {
    console.error("\n環境變數校驗失敗，請修正後再啟動服務。");
    process.exit(1);
  }

  console.log("\n所有必需的環境變數皆已設定，即可啟動服務。");
}

validateEnv();
