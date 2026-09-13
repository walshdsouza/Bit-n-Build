import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    "logs/**",
    "vendor/**",
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "extension/dist/**",
    "extension/web-ext-artifacts/**",
    "tests/.build/**",
    "next-env.d.ts",
  ]),
  {
    // The Node test runner and dataset utilities deliberately use CommonJS.
    files: ["tests/*.test.js", "scripts/fetch.js", "scripts/generate_lexicon.js"],
    languageOptions: { sourceType: "commonjs" },
    rules: { "@typescript-eslint/no-require-imports": "off" },
  },
]);

export default eslintConfig;
