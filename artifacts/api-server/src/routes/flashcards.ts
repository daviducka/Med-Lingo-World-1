import { Router, type IRouter } from "express";
import { eq, sql } from "drizzle-orm";
import { db, flashcardsTable } from "@workspace/db";
import {
  ListFlashcardsResponse,
  RecordFlashcardFlipParams,
  RecordFlashcardFlipBody,
  RecordFlashcardFlipResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/flashcards", async (req, res): Promise<void> => {
  const lessonId = req.query.lessonId ? parseInt(req.query.lessonId as string, 10) : null;
  const courseId = req.query.courseId ? parseInt(req.query.courseId as string, 10) : null;

  let cards;
  if (lessonId && !isNaN(lessonId)) {
    cards = await db.select().from(flashcardsTable).where(eq(flashcardsTable.lessonId, lessonId));
  } else if (courseId && !isNaN(courseId)) {
    cards = await db.select().from(flashcardsTable).where(eq(flashcardsTable.courseId, courseId));
  } else {
    cards = await db.select().from(flashcardsTable);
  }

  res.json(ListFlashcardsResponse.parse(cards));
});

router.post("/flashcards/:flashcardId/flip", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.flashcardId) ? req.params.flashcardId[0] : req.params.flashcardId;
  const flashcardId = parseInt(raw, 10);
  if (isNaN(flashcardId)) {
    res.status(400).json({ error: "Invalid flashcard ID" });
    return;
  }

  const parsed = RecordFlashcardFlipBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { known } = parsed.data;

  await db.update(flashcardsTable)
    .set({
      timesFlipped: sql`${flashcardsTable.timesFlipped} + 1`,
      timesKnown: known ? sql`${flashcardsTable.timesKnown} + 1` : flashcardsTable.timesKnown,
    })
    .where(eq(flashcardsTable.id, flashcardId));

  const [updated] = await db.select().from(flashcardsTable).where(eq(flashcardsTable.id, flashcardId));

  res.json(RecordFlashcardFlipResponse.parse({
    success: true,
    timesFlipped: updated?.timesFlipped ?? 0,
    timesKnown: updated?.timesKnown ?? 0,
  }));
});

export default router;
