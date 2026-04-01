import { Router, type IRouter } from "express";
import { eq, sql, inArray } from "drizzle-orm";
import { db, questionsTable, usersTable } from "@workspace/db";
import {
  GetExamPrepQuestionsResponse,
  SubmitExamPrepBody,
  SubmitExamPrepResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();
const DEFAULT_USER_ID = 1;

router.get("/exam-prep/questions", async (req, res): Promise<void> => {
  const count = req.query.count ? parseInt(req.query.count as string, 10) : 30;
  const subject = req.query.subject as string | undefined;

  let query = db.select().from(questionsTable);

  const allQuestions = await query;
  let filtered = allQuestions;

  if (subject) {
    filtered = allQuestions.filter(q => q.category.toLowerCase().includes(subject.toLowerCase()));
  }

  const shuffled = [...filtered].sort(() => Math.random() - 0.5).slice(0, count);
  const formatted = shuffled.map(q => ({
    ...q,
    options: JSON.parse(q.optionsJson) as string[],
  }));

  res.json(GetExamPrepQuestionsResponse.parse(formatted));
});

router.post("/exam-prep/submit", async (req, res): Promise<void> => {
  const parsed = SubmitExamPrepBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { answers } = parsed.data;
  const questionIds = answers.map(a => a.questionId);
  const questions = await db.select().from(questionsTable).where(inArray(questionsTable.id, questionIds));

  const questionMap = new Map(questions.map(q => [q.id, q]));
  const results = answers.map(ans => {
    const q = questionMap.get(ans.questionId);
    const isCorrect = q?.correctAnswer === ans.selectedAnswer;
    return {
      questionId: ans.questionId,
      isCorrect,
      correctAnswer: q?.correctAnswer ?? "",
      selectedAnswer: ans.selectedAnswer,
      explanation: q?.explanation ?? "",
    };
  });

  const correctCount = results.filter(r => r.isCorrect).length;
  const score = Math.round((correctCount / answers.length) * 100);
  const xpEarned = correctCount * 4;

  await db.update(usersTable)
    .set({
      xp: sql`${usersTable.xp} + ${xpEarned}`,
      weeklyXp: sql`${usersTable.weeklyXp} + ${xpEarned}`,
    })
    .where(eq(usersTable.id, DEFAULT_USER_ID));

  res.json(SubmitExamPrepResponse.parse({
    score,
    totalQuestions: answers.length,
    correctCount,
    xpEarned,
    results,
  }));
});

export default router;
