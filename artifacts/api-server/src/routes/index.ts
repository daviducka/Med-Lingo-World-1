import { Router, type IRouter } from "express";
import healthRouter from "./health";
import usersRouter from "./users";
import coursesRouter from "./courses";
import lessonsRouter from "./lessons";
import hardRoundRouter from "./hard-round";
import progressRouter from "./progress";
import leaderboardRouter from "./leaderboard";
import languagesRouter from "./languages";

const router: IRouter = Router();

router.use(healthRouter);
router.use(usersRouter);
router.use(coursesRouter);
router.use(lessonsRouter);
router.use(hardRoundRouter);
router.use(progressRouter);
router.use(leaderboardRouter);
router.use(languagesRouter);

export default router;
