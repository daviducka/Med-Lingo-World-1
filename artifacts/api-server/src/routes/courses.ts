import { Router, type IRouter } from "express";
import { eq, sql, and } from "drizzle-orm";
import { db, coursesTable, lessonsTable, questionsTable, userProgressTable, usersTable } from "@workspace/db";
import {
  ListCoursesResponse,
  GetCourseResponse,
  ListLessonsResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();
const DEFAULT_USER_ID = 1;

async function getUserLanguage(): Promise<string> {
  const [user] = await db.select({ selectedLanguage: usersTable.selectedLanguage }).from(usersTable).where(eq(usersTable.id, DEFAULT_USER_ID));
  return user?.selectedLanguage ?? "en";
}

router.get("/courses", async (req, res): Promise<void> => {
  const lang = (req.query.language as string) || await getUserLanguage();
  const category = req.query.category as string | undefined;

  const conditions = [eq(coursesTable.language, lang)];
  if (category) conditions.push(eq(coursesTable.category, category));

  const courses = await db.select().from(coursesTable)
    .where(and(...conditions))
    .orderBy(coursesTable.orderIndex);

  const coursesWithCounts = await Promise.all(courses.map(async (course) => {
    const [row] = await db.select({ count: sql<number>`count(*)` }).from(lessonsTable).where(eq(lessonsTable.courseId, course.id));
    return { ...course, totalLessons: Number(row?.count ?? 0) };
  }));

  res.json(ListCoursesResponse.parse(coursesWithCounts));
});

router.get("/courses/:courseId", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.courseId) ? req.params.courseId[0] : req.params.courseId;
  const courseId = parseInt(raw, 10);
  if (isNaN(courseId)) { res.status(400).json({ error: "Invalid course ID" }); return; }

  const [course] = await db.select().from(coursesTable).where(eq(coursesTable.id, courseId));
  if (!course) { res.status(404).json({ error: "Course not found" }); return; }

  const lessons = await db.select().from(lessonsTable)
    .where(eq(lessonsTable.courseId, courseId))
    .orderBy(lessonsTable.orderIndex);

  const completedLessonIds = new Set(
    (await db.select({ lessonId: userProgressTable.lessonId }).from(userProgressTable).where(eq(userProgressTable.userId, DEFAULT_USER_ID))).map(p => p.lessonId)
  );

  const lessonsWithStatus = await Promise.all(lessons.map(async (lesson, idx) => {
    const [qCount] = await db.select({ count: sql<number>`count(*)` }).from(questionsTable).where(eq(questionsTable.lessonId, lesson.id));
    return {
      ...lesson,
      isCompleted: completedLessonIds.has(lesson.id),
      isLocked: idx > 0 && !completedLessonIds.has(lessons[idx - 1].id),
      questionCount: Number(qCount?.count ?? 0),
    };
  }));

  res.json(GetCourseResponse.parse({ ...course, lessons: lessonsWithStatus }));
});

export default router;
