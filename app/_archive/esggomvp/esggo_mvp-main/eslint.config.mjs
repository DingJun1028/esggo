import js from "@eslint/js";
import nextPlugin from "@next/eslint-plugin-next";
import tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";

export default [
  js.configs.recommended,
  {
    files: ["**/*.ts", "**/*.tsx"],
    plugins: {
      "@next/next": nextPlugin,
      "@typescript-eslint": tsPlugin,
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        // Define common globals to resolve no-undef errors
        process: "readonly",
        console: "readonly",
        fetch: "readonly",
        setTimeout: "readonly",
        clearTimeout: "readonly",
        setInterval: "readonly",
        clearInterval: "readonly",
        Buffer: "readonly",
        crypto: "readonly",
        TextEncoder: "readonly",
        TextDecoder: "readonly",
        window: "readonly",
        document: "readonly",
        localStorage: "readonly",
        Blob: "readonly",
        URL: "readonly",
        location: "readonly",
        navigator: "readonly",
        AbortController: "readonly",
        FormData: "readonly",
        Headers: "readonly",
        Request: "readonly",
        Response: "readonly",
        RequestInit: "readonly",
        ResponseInit: "readonly",
        File: "readonly",
        ReadableStream: "readonly",
        HTMLDivElement: "readonly",
        HTMLTextAreaElement: "readonly",
        HTMLInputElement: "readonly",
        HTMLButtonElement: "readonly",
        SVGSVGElement: "readonly",
        KeyboardEvent: "readonly",
        CustomEvent: "readonly",
        FileReader: "readonly",
        DOMException: "readonly",
        alert: "readonly",
        confirm: "readonly",
        RequestInfo: "readonly",
        React: "readonly",
      }
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs["core-web-vitals"].rules,
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "no-undef": "warn",
      "no-useless-escape": "off",
      "no-case-declarations": "off",
      "no-shadow-restricted-names": "off",
      "no-empty": "warn",
      "no-redeclare": "warn",
    },
  },
  {
    ignores: [".next/**", "out/**", "build/**", "next-env.d.ts"],
  },
];
