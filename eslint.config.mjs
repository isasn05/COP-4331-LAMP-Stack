import js from "@eslint/js";
import globals from "globals";

export default [
  { ignores: ["public/js/md5.js"] },
  js.configs.recommended,
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "script",
      globals: {
        ...globals.browser,
        md5: "readonly"
      }
    },
    rules: {
      "no-unused-vars": "warn"
    }
  }
];