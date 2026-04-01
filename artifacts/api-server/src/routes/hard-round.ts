import { Router, type IRouter } from "express";
import { eq, sql, and } from "drizzle-orm";
import { db, questionsTable, hardRoundResultsTable, usersTable } from "@workspace/db";
import {
  GetHardRoundQuestionsQueryParams,
  GetHardRoundQuestionsResponse,
  SubmitHardRoundBody,
  SubmitHardRoundResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();
const DEFAULT_USER_ID = 1;

router.get("/hard-round/questions", async (req, res): Promise<void> => {
  const params = GetHardRoundQuestionsQueryParams.safeParse(req.query);
  const category = params.success ? params.data.category : undefined;
  const count = (params.success ? params.data.count : undefined) ?? 10;

  let query = db.select().from(questionsTable).where(
    category
      ? and(
          eq(questionsTable.difficulty, "board_level"),
          eq(questionsTable.category, category)
        )
      : eq(questionsTable.difficulty, "board_level")
  );

  const questions = await query.limit(count);

  const formatted = questions.map(q => ({
    ...q,
    options: JSON.parse(q.optionsJson) as string[],
  }));

  res.json(GetHardRoundQuestionsResponse.parse(formatted));
});

router.post("/hard-round/submit", async (req, res): Promise<void> => {
  const parsed = SubmitHardRoundBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { answers, timeTakenSeconds } = parsed.data;

  const questionIds = answers.map(a => a.questionId);
  const questions = await db.select().from(questionsTable).where(
    sql`${questionsTable.id} = ANY(${questionIds})`
  );

  const questionMap = new Map(questions.map(q => [q.id, q]));

  const results = answers.map(answer => {
    const q = questionMap.get(answer.questionId);
    const isCorrect = q ? q.correctAnswer === answer.selectedAnswer : false;
    return {
      questionId: answer.questionId,
      isCorrect,
      correctAnswer: q?.correctAnswer ?? "",
      selectedAnswer: answer.selectedAnswer,
      explanation: q?.explanation ?? "",
    };
  });

  const correctCount = results.filter(r => r.isCorrect).length;
  const totalQuestions = answers.length;
  const score = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
  const xpEarned = correctCount * 15;

  await db.insert(hardRoundResultsTable).values({
    userId: DEFAULT_USER_ID,
    score,
    correctCount,
    totalQuestions,
    xpEarned,
    timeTakenSeconds: timeTakenSeconds ?? null,
  });

  await db.update(usersTable)
    .set({
      xp: sql`${usersTable.xp} + ${xpEarned}`,
      weeklyXp: sql`${usersTable.weeklyXp} + ${xpEarned}`,
    })
    .where(eq(usersTable.id, DEFAULT_USER_ID));

  res.json(SubmitHardRoundResponse.parse({
    score,
    totalQuestions,
    correctCount,
    xpEarned,
    results,
  }));
});

export default router;
