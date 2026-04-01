import { Router, type IRouter } from "express";
import { desc } from "drizzle-orm";
import { db, usersTable } from "@workspace/db";
import {
  GetLeaderboardQueryParams,
  GetLeaderboardResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/leaderboard", async (req, res): Promise<void> => {
  const params = GetLeaderboardQueryParams.safeParse(req.query);
  const limit = (params.success ? params.data.limit : undefined) ?? 20;

  const users = await db.select().from(usersTable).orderBy(desc(usersTable.weeklyXp)).limit(limit);

  const leaderboard = users.map((user, idx) => ({
    rank: idx + 1,
    userId: user.id,
    displayName: user.displayName,
    avatarUrl: user.avatarUrl ?? null,
    xp: user.xp,
    streak: user.streak,
    weeklyXp: user.weeklyXp,
  }));

  res.json(GetLeaderboardResponse.parse(leaderboard));
});

export default router;
