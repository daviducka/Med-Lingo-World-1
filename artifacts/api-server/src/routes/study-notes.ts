import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, studyNotesTable } from "@workspace/db";
import { GetStudyNotesResponse } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/study-notes/:lessonId", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.lessonId) ? req.params.lessonId[0] : req.params.lessonId;
  const lessonId = parseInt(raw, 10);
  if (isNaN(lessonId)) {
    res.status(400).json({ error: "Invalid lesson ID" });
    return;
  }

  const [note] = await db.select().from(studyNotesTable).where(eq(studyNotesTable.lessonId, lessonId));
  if (!note) {
    res.status(404).json({ error: "Study notes not found for this lesson" });
    return;
  }

  res.json(GetStudyNotesResponse.parse({
    lessonId: note.lessonId,
    title: note.title,
    content: note.content,
    keyPoints: JSON.parse(note.keyPointsJson) as string[],
    mnemonics: JSON.parse(note.mnemonicsJson) as string[],
    clinicalPearls: JSON.parse(note.clinicalPearlsJson) as string[],
  }));
});

export default router;
