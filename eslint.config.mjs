import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

import { dirname } from "path";
import { fileURLToPath } from "url";

import pluginReactHooks from "eslint-plugin-react-hooks";
import pluginReact from "eslint-plugin-react";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const eslintConfig = [
  ...nextCoreWebVitals,
  ...nextTypescript,
  {
    plugins: {
      "react-hooks": pluginReactHooks,
      "react": pluginReact,
    },
    rules: {
      "react/react-in-jsx-scope": "off",
      "@next/next/no-assign-module-variable": "error",
      "react/no-unescaped-entities": "warn"
    },
  },
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      ".firebase/**",
      ".vercel/**",
      ".kilo/worktrees/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
      "src/dataconnect-generated/**",
      "src/dataconnect-admin-generated/**",
      "public/**",
      "public/lib/build/**",
      "public/pdfjs_extracted/**",
      "dist/**",
      "*.config.js",
      "*.config.mjs",
      "*.config.ts",
      "scripts/**",
      "lib/web/wasm/**",
      "lib/web/viewer.mjs",
      "lib/web/debugger.mjs",
      "lib/pdfjs-6.0.227-legacy-dist/**",
      "remove-ts-ext.js",
      "rename_universal_to_omni.js"
    ]
  },
  {
    rules: {
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "react-hooks/exhaustive-deps": "off",
      "react-hooks/immutability": "off",
      "react-hooks/rules-of-hooks": "off",
      "react-hooks/set-state-in-effect": "off",
      "react/jsx-uses-react": "off",
      "react/prop-types": "off",
      "@next/next/no-img-element": "off",
      "@next/next/no-html-link-for-pages": "off",
      "import/no-anonymous-default-export": "off",
      "no-unused-vars": "off",
      "no-empty-pattern": "off",
      "no-undef": "off",
    }
  }
];

export default eslintConfig;
