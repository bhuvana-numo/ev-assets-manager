import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";

/** @type {import('eslint').Linter.Config[]} */
export default [
  { files: ["**/*.{js,mjs,cjs,ts}"] },
  { 
    languageOptions: { 
      globals: globals.node // ✅ Recognize Node.js globals like `require`, `module`, `process`
    } 
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      "@typescript-eslint/no-require-imports": "off", // ✅ Allow `require()`
      "no-undef": "off" // ✅ Fix `process`, `module` not defined errors
    }
  }
];
