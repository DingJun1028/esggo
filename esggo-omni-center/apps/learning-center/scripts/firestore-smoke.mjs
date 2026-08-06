#!/usr/bin/env node
/**
 * scripts/firestore-smoke.mjs — Firestore smoke test
 *
 * 寫入一個測試文件到：
 *   platforms/esggo/submissions/{autoId}
 *
 * 依賴：
 *   - .env 已填入 VITE_FB_* 系列變數
 *   - Firestore Security Rules 允許 write（開發階段可用 test mode）
 *
 * 執行：
 *   node scripts/firestore-smoke.mjs
 *
 * 輸出成功時會印出 document ID。
 */

import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { readFileSync } from 'fs';
import { resolve } from 'path';

function loadEnv() {
  const envPath = resolve(process.cwd(), '.env');
  const out = {};
  try {
    const text = readFileSync(envPath, 'utf8');
    for (const line of text.split(/\r?\n/)) {
      const m = line.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
      if (m) out[m[1]] = m[2].replace(/^["']|["']$/g, '');
    }
  } catch {
    // ignore
  }
  return out;
}

const env = loadEnv();
const firebaseConfig = {
  apiKey: env.VITE_FB_API_KEY,
  authDomain: env.VITE_FB_AUTH_DOMAIN,
  projectId: env.VITE_FB_PROJECT_ID,
  storageBucket: env.VITE_FB_STORAGE_BUCKET,
  messagingSenderId: env.VITE_FB_MESSAGING_SENDER_ID,
  appId: env.VITE_FB_APP_ID,
};

if (!firebaseConfig.apiKey || !firebaseConfig.projectId || !firebaseConfig.appId) {
  console.error('❌ .env 缺少 VITE_FB_API_KEY / VITE_FB_PROJECT_ID / VITE_FB_APP_ID');
  process.exit(1);
}

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function main() {
  try {
    const ref = await addDoc(
      collection(db, 'platforms/esggo/submissions'),
      {
        type: 'smoke-test',
        userId: 'dev',
        payload: { ok: true },
        createdAt: serverTimestamp(),
      }
    );
    console.log('✅ Firestore smoke test OK — document ID:', ref.id);
    process.exit(0);
  } catch (err) {
    console.error('❌ Firestore smoke test failed:', err);
    process.exit(1);
  }
}

main();
