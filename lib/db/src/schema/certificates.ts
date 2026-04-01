import { pgTable, text, serial, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { usersTable } from "./users";

export const certificatesTable = pgTable("certificates", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => usersTable.id),
  type: text("type").notNull(), // "completion", "excellence", "mastery", "daily_challenge", "weekly_challenge"
  title: text("title").notNull(), // e.g., "Anatomy Beginner Certificate"
  description: text("description").notNull(),
  category: text("category").notNull(), // e.g., "anatomy", "pharmacology"
  level: text("level").notNull().default("beginner"), // "beginner", "intermediate", "advanced"
  awardedDate: timestamp("awarded_date", { withTimezone: true }).notNull().defaultNow(),
  achievements: integer("achievements").notNull().default(0), // e.g., 90% score, all categories completed
  badgeEmoji: text("badge_emoji").notNull().default("🏆"),
  courseId: integer("course_id"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertCertificateSchema = createInsertSchema(certificatesTable).omit({ id: true, createdAt: true });
export type InsertCertificate = z.infer<typeof insertCertificateSchema>;
export type Certificate = typeof certificatesTable.$inferSelect;
