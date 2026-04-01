import { Router, type IRouter } from "express";
import { eq, sql } from "drizzle-orm";
import { db, coursesTable, lessonsTable, userProgressTable } from "@workspace/db";
import {
  ListCoursesQueryParams,
  ListCoursesResponse,
  GetCourseParams,
  GetCourseResponse,
  ListLessonsParams,
  ListLessonsResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();
const DEFAULT_USER_ID = 1;

router.get("/courses", async (req, res): Promise<void> => {
  const params = ListCoursesQueryParams.safeParse(req.query);
  const language = params.success ? params.data.language : undefined;

  let query = db.select().from(coursesTable);
  const courses = await query.orderBy(coursesTable.orderIndex);

  const coursesWithCounts = await Promise.all(courses.map(async (course) => {
    const lessons = await db.select({ count: sql<number>`count(*)` }).from(lessonsTable).where(eq(lessonsTable.courseId, course.id));
    return {
      ...course,
      totalLessons: Number(lessons[0]?.count ?? 0),
    };
  }));

  res.json(ListCoursesResponse.parse(coursesWithCounts));
});

router.get("/courses/:courseId", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.courseId) ? req.params.courseId[0] : req.params.courseId;
  const courseId = parseInt(raw, 10);
  if (isNaN(courseId)) {
    res.status(400).json({ error: "Invalid course ID" });
    return;
  }

  const [course] = await db.select().from(coursesTable).where(eq(coursesTable.id, courseId));
  if (!course) {
    res.status(404).json({ error: "Course not found" });
    return;
  }

  const lessons = await db.select().from(lessonsTable).where(eq(lessonsTable.courseId, courseId)).orderBy(lessonsTable.orderIndex);

  const completedLessonIds = new Set(
    (await db.select({ lessonId: userProgressTable.lessonId }).from(userProgressTable).where(eq(userProgressTable.userId, DEFAULT_USER_ID))).map(p => p.lessonId)
  );

  const lessonsWithStatus = await Promise.all(lessons.map(async (lesson, idx) => {
    const qCount = await db.select({ count: sql<number>`count(*)` }).from(
      (await import("@workspace/db")).questionsTable
    ).where(eq((await import("@workspace/db")).questionsTable.lessonId, lesson.id));

    return {
      ...lesson,
      isCompleted: completedLessonIds.has(lesson.id),
      isLocked: idx > 0 && !completedLessonIds.has(lessons[idx - 1].id),
      questionCount: Number(qCount[0]?.count ?? 0),
    };
  }));

  res.json(GetCourseResponse.parse({
    ...course,
    lessons: lessonsWithStatus,
  }));
});

export default router;
