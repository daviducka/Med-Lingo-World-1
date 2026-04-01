import { Router, type IRouter } from "express";
import { eq, sql } from "drizzle-orm";
import { db, lessonsTable, questionsTable, userProgressTable, usersTable } from "@workspace/db";
import {
  GetLessonParams,
  GetLessonResponse,
  ListLessonsParams,
  ListLessonsResponse,
  CompleteLessonParams,
  CompleteLessonBody,
  CompleteLessonResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();
const DEFAULT_USER_ID = 1;

router.get("/courses/:courseId/lessons", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.courseId) ? req.params.courseId[0] : req.params.courseId;
  const courseId = parseInt(raw, 10);
  if (isNaN(courseId)) {
    res.status(400).json({ error: "Invalid course ID" });
    return;
  }

  const lessons = await db.select().from(lessonsTable).where(eq(lessonsTable.courseId, courseId)).orderBy(lessonsTable.orderIndex);

  const completedLessonIds = new Set(
    (await db.select({ lessonId: userProgressTable.lessonId }).from(userProgressTable).where(eq(userProgressTable.userId, DEFAULT_USER_ID))).map(p => p.lessonId)
  );

  const lessonsWithStatus = await Promise.all(lessons.map(async (lesson, idx) => {
    const qCount = await db.select({ count: sql<number>`count(*)` }).from(questionsTable).where(eq(questionsTable.lessonId, lesson.id));
    return {
      ...lesson,
      isCompleted: completedLessonIds.has(lesson.id),
      isLocked: idx > 0 && !completedLessonIds.has(lessons[idx - 1].id),
      questionCount: Number(qCount[0]?.count ?? 0),
    };
  }));

  res.json(ListLessonsResponse.parse(lessonsWithStatus));
});

router.get("/lessons/:lessonId", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.lessonId) ? req.params.lessonId[0] : req.params.lessonId;
  const lessonId = parseInt(raw, 10);
  if (isNaN(lessonId)) {
    res.status(400).json({ error: "Invalid lesson ID" });
    return;
  }

  const [lesson] = await db.select().from(lessonsTable).where(eq(lessonsTable.id, lessonId));
  if (!lesson) {
    res.status(404).json({ error: "Lesson not found" });
    return;
  }

  const questions = await db.select().from(questionsTable).where(eq(questionsTable.lessonId, lessonId));

  const questionsFormatted = questions.map(q => ({
    ...q,
    options: JSON.parse(q.optionsJson) as string[],
  }));

  res.json(GetLessonResponse.parse({
    ...lesson,
    questions: questionsFormatted,
  }));
});

router.post("/lessons/:lessonId/complete", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.lessonId) ? req.params.lessonId[0] : req.params.lessonId;
  const lessonId = parseInt(raw, 10);
  if (isNaN(lessonId)) {
    res.status(400).json({ error: "Invalid lesson ID" });
    return;
  }

  const parsed = CompleteLessonBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [lesson] = await db.select().from(lessonsTable).where(eq(lessonsTable.id, lessonId));
  if (!lesson) {
    res.status(404).json({ error: "Lesson not found" });
    return;
  }

  const { score, correctAnswers, totalQuestions } = parsed.data;
  const xpEarned = Math.round(lesson.xpReward * (correctAnswers / totalQuestions));

  await db.insert(userProgressTable).values({
    userId: DEFAULT_USER_ID,
    lessonId,
    isCompleted: true,
    score,
    correctAnswers,
    totalQuestions,
    completedAt: new Date(),
  }).onConflictDoNothing();

  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, DEFAULT_USER_ID));
  const today = new Date().toISOString().split("T")[0];
  const isNewDay = user?.lastActiveDate !== today;
  const newStreak = isNewDay ? (user?.streak ?? 0) + 1 : (user?.streak ?? 0);

  await db.update(usersTable)
    .set({
      xp: sql`${usersTable.xp} + ${xpEarned}`,
      weeklyXp: sql`${usersTable.weeklyXp} + ${xpEarned}`,
      streak: newStreak,
      lastActiveDate: today,
    })
    .where(eq(usersTable.id, DEFAULT_USER_ID));

  const [updatedUser] = await db.select().from(usersTable).where(eq(usersTable.id, DEFAULT_USER_ID));

  res.json(CompleteLessonResponse.parse({
    xpEarned,
    newXpTotal: updatedUser?.xp ?? 0,
    streakUpdated: isNewDay,
    newStreak,
    heartsRemaining: updatedUser?.hearts ?? 5,
    lessonCompleted: true,
  }));
});

export default router;
