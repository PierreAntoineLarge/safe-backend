import { defineConfig } from "eslint-define-config";

export default defineConfig({
  rules: {
    semi: ["error", "always"],
    "no-unused-vars": "warn",
  },
});
