import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default [
  {
    ignores: [
      ".kilo/worktrees/**",
      ".next/**",
      "node_modules/**",
      "dist/**",
      "src/dataconnect-generated/**",
      "src/dataconnect-admin-generated/**",
      "pdfjs-6.0.227-legacy-dist/**",
      "lib/web/**",
      "components/UserList.js",
      "lib/page.js",
      "User.js",
      "vscode-acp/**",
    ],
  },
  {
    rules: {
        "@typescript-eslint/no-unused-vars": "off",
        "@typescript-eslint/no-explicit-any": "off",
        "react-hooks/exhaustive-deps": "off",
        "react/no-unescaped-entities": "off",
        "@next/next/no-img-element": "off",
        "no-unused-vars": "off",
    },
  }
];