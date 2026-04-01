import { pgTable, serial, integer, text, varchar, timestamp } from "drizzle-orm/pg-core";

export const flashcardsTable = pgTable("flashcards", {
  id: serial("id").primaryKey(),
  lessonId: integer("lesson_id"),
  courseId: integer("course_id"),
  front: text("front").notNull(),
  back: text("back").notNull(),
  category: varchar("category", { length: 100 }).notNull().default("general"),
  difficulty: varchar("difficulty", { length: 50 }).notNull().default("medium"),
  timesFlipped: integer("times_flipped").notNull().default(0),
  timesKnown: integer("times_known").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow(),
});
