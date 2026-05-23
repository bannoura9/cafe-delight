import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { neon } from "@neondatabase/serverless";
import { config as loadEnv } from "dotenv";

loadEnv({ path: ".env.local" });

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL not set. Run: vercel env pull .env.local");
  process.exit(1);
}

const __dirname = dirname(fileURLToPath(import.meta.url));
const schemaPath = join(__dirname, "..", "src", "lib", "schema.sql");
const schema = readFileSync(schemaPath, "utf8");

const sql = neon(process.env.DATABASE_URL);

// Split on semicolons that end a statement.
const statements = schema
  .split(/;\s*\n/)
  .map((s) => s.trim())
  .filter((s) => s.length > 0);

console.log(`Running ${statements.length} statements against database…`);

for (const stmt of statements) {
  const preview = stmt.slice(0, 60).replace(/\s+/g, " ");
  process.stdout.write(`  ${preview}… `);
  await sql.query(stmt);
  console.log("ok");
}

console.log("Schema applied.");
