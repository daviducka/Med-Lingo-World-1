import { pgTable, serial, integer, text, timestamp } from "drizzle-orm/pg-core";

export const studyNotesTable = pgTable("study_notes", {
  id: serial("id").primaryKey(),
  lessonId: integer("lesson_id").notNull().unique(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  keyPointsJson: text("key_points_json").notNull().default("[]"),
  mnemonicsJson: text("mnemonics_json").notNull().default("[]"),
  clinicalPearlsJson: text("clinical_pearls_json").notNull().default("[]"),
  createdAt: timestamp("created_at").defaultNow(),
});
