import { pgTable, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { usersTable } from "./users";

export const hardRoundResultsTable = pgTable("hard_round_results", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => usersTable.id),
  score: integer("score").notNull().default(0),
  correctCount: integer("correct_count").notNull().default(0),
  totalQuestions: integer("total_questions").notNull().default(0),
  xpEarned: integer("xp_earned").notNull().default(0),
  timeTakenSeconds: integer("time_taken_seconds"),
  completedAt: timestamp("completed_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertHardRoundResultSchema = createInsertSchema(hardRoundResultsTable).omit({ id: true, completedAt: true });
export type InsertHardRoundResult = z.infer<typeof insertHardRoundResultSchema>;
export type HardRoundResult = typeof hardRoundResultsTable.$inferSelect;
