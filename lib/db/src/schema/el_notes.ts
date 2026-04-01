import { pgTable, serial, integer, text, varchar, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { usersTable } from "./users";

export const elNotesTable = pgTable("el_notes", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => usersTable.id),
  title: varchar("title", { length: 200 }).notNull().default("Shënim i Ri"),
  topic: varchar("topic", { length: 200 }).default(""),
  keywords: text("keywords").default(""),
  diagramUrl: text("diagram_url").default(""),
  notes: text("notes").default(""),
  pinHash: varchar("pin_hash", { length: 10 }).default(""),
  isLocked: boolean("is_locked").notNull().default(false),
  color: varchar("color", { length: 20 }).default("#fce4ec"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertElNoteSchema = createInsertSchema(elNotesTable).omit({ id: true, createdAt: true, updatedAt: true });
export const updateElNoteSchema = insertElNoteSchema.partial();
export type InsertElNote = z.infer<typeof insertElNoteSchema>;
export type ElNote = typeof elNotesTable.$inferSelect;
