import { Router, type IRouter } from "express";
import { eq, sql } from "drizzle-orm";
import { db, userProgressTable, coursesTable, lessonsTable, hardRoundResultsTable, usersTable } from "@workspace/db";
import {
  GetUserProgressResponse,
  GetProgressSummaryResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();
const DEFAULT_USER_ID = 1;

router.get("/progress", async (req, res): Promise<void> => {
  const courses = await db.select().from(coursesTable).orderBy(coursesTable.orderIndex);

  const progressData = await Promise.all(courses.map(async (course) => {
    const lessons = await db.select().from(lessonsTable).where(eq(lessonsTable.courseId, course.id));
    const totalLessons = lessons.length;
    const lessonIds = lessons.map(l => l.id);

    if (lessonIds.length === 0) {
      return {
        courseId: course.id,
        courseName: course.title,
        completedLessons: 0,
        totalLessons: 0,
        percentComplete: 0,
        xpEarned: 0,
      };
    }

    const completedRows = await db.select({
      count: sql<number>`count(*)`,
      xpSum: sql<number>`coalesce(sum(${userProgressTable.score}), 0)`,
    }).from(userProgressTable)
      .where(
        eq(userProgressTable.userId, DEFAULT_USER_ID)
      );

    const completedLessons = Math.min(Number(completedRows[0]?.count ?? 0), totalLessons);
    const percentComplete = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

    return {
      courseId: course.id,
      courseName: course.title,
      completedLessons,
      totalLessons,
      percentComplete,
      xpEarned: Number(completedRows[0]?.xpSum ?? 0),
    };
  }));

  res.json(GetUserProgressResponse.parse(progressData));
});

router.get("/progress/summary", async (req, res): Promise<void> => {
  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, DEFAULT_USER_ID));

  const lessonsCompleted = await db.select({ count: sql<number>`count(*)` })
    .from(userProgressTable)
    .where(eq(userProgressTable.userId, DEFAULT_USER_ID));

  const hardRoundsCompleted = await db.select({ count: sql<number>`count(*)` })
    .from(hardRoundResultsTable)
    .where(eq(hardRoundResultsTable.userId, DEFAULT_USER_ID));

  const avgScore = await db.select({ avg: sql<number>`coalesce(avg(${hardRoundResultsTable.score}), 0)` })
    .from(hardRoundResultsTable)
    .where(eq(hardRoundResultsTable.userId, DEFAULT_USER_ID));

  const courses = await db.select().from(coursesTable);
  const coursesCompleted = 0;

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthlyResults = await db.select({ xpSum: sql<number>`coalesce(sum(${hardRoundResultsTable.xpEarned}), 0)` })
    .from(hardRoundResultsTable)
    .where(
      eq(hardRoundResultsTable.userId, DEFAULT_USER_ID)
    );

  res.json(GetProgressSummaryResponse.parse({
    totalXp: user?.xp ?? 0,
    currentStreak: user?.streak ?? 0,
    coursesCompleted,
    lessonsCompleted: Number(lessonsCompleted[0]?.count ?? 0),
    hardRoundsCompleted: Number(hardRoundsCompleted[0]?.count ?? 0),
    averageScore: Math.round(Number(avgScore[0]?.avg ?? 0)),
    weeklyXp: user?.weeklyXp ?? 0,
    monthlyXp: Number(monthlyResults[0]?.xpSum ?? 0),
  }));
});

export default router;
