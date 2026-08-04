import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      // Underscore-prefixed args are intentionally-unused stub params.
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },
  // src/domain is pure business logic: no framework, no DB, no vendor SDKs.
  // This is what keeps the scheduling engine unit-testable in milliseconds.
  {
    files: ["src/domain/**/*.ts"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            { group: ["next", "next/*"], message: "src/domain must not import Next.js" },
            { group: ["drizzle-orm", "drizzle-orm/*"], message: "src/domain must not touch the DB" },
            { group: ["twilio*", "stripe*", "@supabase/*", "resend*", "@deepgram/*", "inngest*"], message: "src/domain must not import vendor SDKs" },
            { group: ["@/db/*", "@/services/*", "@/data/*", "@/jobs/*"], message: "src/domain is pure — no I/O layers" },
          ],
        },
      ],
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
