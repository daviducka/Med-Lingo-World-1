import { Router } from "express";
import { db } from "@workspace/db";
import { elNotesTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";

const router = Router();
const DEFAULT_USER_ID = 1;

router.get("/", async (req, res): Promise<void> => {
  const notes = await db
    .select()
    .from(elNotesTable)
    .where(eq(elNotesTable.userId, DEFAULT_USER_ID))
    .orderBy(elNotesTable.updatedAt);
  res.json(notes);
});

router.post("/", async (req, res): Promise<void> => {
  const { title, topic, keywords, diagramUrl, notes, pinHash, isLocked, color } = req.body;
  const [note] = await db
    .insert(elNotesTable)
    .values({
      userId: DEFAULT_USER_ID,
      title: title || "Shënim i Ri",
      topic: topic || "",
      keywords: keywords || "",
      diagramUrl: diagramUrl || "",
      notes: notes || "",
      pinHash: pinHash || "",
      isLocked: isLocked || false,
      color: color || "#fce4ec",
    })
    .returning();
  res.status(201).json(note);
});

router.get("/:id", async (req, res): Promise<void> => {
  const id = parseInt(req.params.id);
  const [note] = await db
    .select()
    .from(elNotesTable)
    .where(and(eq(elNotesTable.id, id), eq(elNotesTable.userId, DEFAULT_USER_ID)));
  if (!note) { res.status(404).json({ error: "Shënimi nuk u gjet" }); return; }
  res.json(note);
});

router.put("/:id", async (req, res): Promise<void> => {
  const id = parseInt(req.params.id);
  const { title, topic, keywords, diagramUrl, notes, pinHash, isLocked, color } = req.body;
  const [updated] = await db
    .update(elNotesTable)
    .set({
      ...(title !== undefined && { title }),
      ...(topic !== undefined && { topic }),
      ...(keywords !== undefined && { keywords }),
      ...(diagramUrl !== undefined && { diagramUrl }),
      ...(notes !== undefined && { notes }),
      ...(pinHash !== undefined && { pinHash }),
      ...(isLocked !== undefined && { isLocked }),
      ...(color !== undefined && { color }),
      updatedAt: new Date(),
    })
    .where(and(eq(elNotesTable.id, id), eq(elNotesTable.userId, DEFAULT_USER_ID)))
    .returning();
  if (!updated) { res.status(404).json({ error: "Nuk u gjet" }); return; }
  res.json(updated);
});

router.delete("/:id", async (req, res): Promise<void> => {
  const id = parseInt(req.params.id);
  await db
    .delete(elNotesTable)
    .where(and(eq(elNotesTable.id, id), eq(elNotesTable.userId, DEFAULT_USER_ID)));
  res.status(204).end();
});

router.post("/:id/verify-pin", async (req, res): Promise<void> => {
  const id = parseInt(req.params.id);
  const { pin } = req.body;
  const [note] = await db
    .select()
    .from(elNotesTable)
    .where(and(eq(elNotesTable.id, id), eq(elNotesTable.userId, DEFAULT_USER_ID)));
  if (!note) { res.status(404).json({ error: "Nuk u gjet" }); return; }
  const valid = note.pinHash === String(pin);
  res.json({ valid });
});

export default router;
