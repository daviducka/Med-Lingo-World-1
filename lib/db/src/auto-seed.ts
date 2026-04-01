import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import { sql } from "drizzle-orm";
import { coursesTable } from "./schema";
import { seedDatabase } from "./seed.js";
import { fillQuestions } from "./fill-questions.js";

const { Pool } = pg;

export async function runAutoSeedIfEmpty(): Promise<void> {
  if (!process.env.DATABASE_URL) {
    console.warn("⚠️  DATABASE_URL not set — skipping auto-seed");
    return;
  }

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const db = drizzle(pool);

  try {
    const [{ count }] = await db
      .select({ count: sql<number>`count(*)` })
      .from(coursesTable);

    await pool.end();

    if (Number(count) > 0) {
      console.log(`ℹ️  Database already has ${count} courses — skipping auto-seed`);
      return;
    }

    console.log("🌱 Empty database detected — running auto-seed (this may take ~30s)...");

    await seedDatabase();
    await fillQuestions();

    console.log("✅ Auto-seed complete — database is ready!");
  } catch (err) {
    console.error("❌ Auto-seed failed:", err);
    try { await pool.end(); } catch {}
  }
}
