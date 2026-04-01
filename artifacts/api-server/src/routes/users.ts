import { Router, type IRouter } from "express";
import { eq, sql } from "drizzle-orm";
import { db, usersTable, userProgressTable, lessonsTable, hardRoundResultsTable } from "@workspace/db";
import {
  GetUserProfileResponse,
  UpdateUserProfileBody,
  UpdateUserProfileResponse,
  GetUserStatsResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

const DEFAULT_USER_ID = 1;

async function ensureDefaultUser() {
  const existing = await db.select().from(usersTable).where(eq(usersTable.id, DEFAULT_USER_ID));
  if (existing.length === 0) {
    await db.insert(usersTable).values({
      id: DEFAULT_USER_ID,
      username: "medstudent",
      displayName: "Med Student",
      selectedLanguage: "en",
      xp: 240,
      streak: 5,
      hearts: 5,
      weeklyXp: 120,
    });
  }
}

router.get("/users/profile", async (req, res): Promise<void> => {
  await ensureDefaultUser();
  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, DEFAULT_USER_ID));
  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }
  res.json(GetUserProfileResponse.parse({
    ...user,
    createdAt: user.createdAt.toISOString(),
  }));
});

router.patch("/users/profile", async (req, res): Promise<void> => {
  const parsed = UpdateUserProfileBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  await ensureDefaultUser();
  const [updated] = await db
    .update(usersTable)
    .set(parsed.data)
    .where(eq(usersTable.id, DEFAULT_USER_ID))
    .returning();
  if (!updated) {
    res.status(404).json({ error: "User not found" });
    return;
  }
  res.json(UpdateUserProfileResponse.parse({
    ...updated,
    createdAt: updated.createdAt.toISOString(),
  }));
});

router.get("/users/stats", async (req, res): Promise<void> => {
  await ensureDefaultUser();
  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, DEFAULT_USER_ID));
  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  const completedLessons = await db
    .select({ count: sql<number>`count(*)` })
    .from(userProgressTable)
    .where(eq(userProgressTable.userId, DEFAULT_USER_ID));

  const hardRounds = await db
    .select({ count: sql<number>`count(*)` })
    .from(hardRoundResultsTable)
    .where(eq(hardRoundResultsTable.userId, DEFAULT_USER_ID));

  const allUsers = await db.select({ id: usersTable.id, xp: usersTable.xp }).from(usersTable).orderBy(sql`${usersTable.xp} DESC`);
  const rank = allUsers.findIndex(u => u.id === DEFAULT_USER_ID) + 1;

  res.json(GetUserStatsResponse.parse({
    xp: user.xp,
    streak: user.streak,
    hearts: user.hearts,
    totalLessonsCompleted: Number(completedLessons[0]?.count ?? 0),
    hardRoundsCompleted: Number(hardRounds[0]?.count ?? 0),
    rank: rank || 1,
    weeklyXp: user.weeklyXp,
  }));
});

export default router;
