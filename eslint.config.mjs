
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const eslintConfig = [
  ...nextCoreWebVitals,
  ...nextTypescript,
  {
    rules: {
      "react/react-in-jsx-scope": "off",
      "@typescript-eslint/no-unused-vars": "error", // Override to error
      "@typescript-eslint/no-explicit-any": "error", // Add
      "react-hooks/exhaustive-deps": "warn", // Add
      "@next/next/no-assign-module-variable": "error", // Add
      "react/no-unescaped-entities": "warn" // Add
    },
  },
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      ".firebase/**",
      ".vercel/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
      "src/dataconnect-generated/**",
      "src/dataconnect-admin-generated/**",
      "public/**",
      "dist/**",
      "*.config.js",
      "*.config.mjs",
      "*.config.ts",
      "scripts/**",
      "lib/web/wasm/**",
      "lib/web/viewer.mjs",
      "lib/web/debugger.mjs",
      "lib/pdfjs-6.0.227-legacy-dist/**"
    ]
  }
];

export default eslintConfig;
