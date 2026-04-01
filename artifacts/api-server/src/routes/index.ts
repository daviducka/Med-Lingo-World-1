import { Router, type IRouter } from "express";
import healthRouter from "./health";
import usersRouter from "./users";
import coursesRouter from "./courses";
import lessonsRouter from "./lessons";
import hardRoundRouter from "./hard-round";
import progressRouter from "./progress";
import leaderboardRouter from "./leaderboard";
import languagesRouter from "./languages";
import flashcardsRouter from "./flashcards";
import studyNotesRouter from "./study-notes";
import examPrepRouter from "./exam-prep";
import aiDoctorRouter from "./ai-doctor";
import elNotesRouter from "./el-notes";
import gamesRouter from "./games";
import certificatesRouter from "./certificates";

const router: IRouter = Router();

router.use(healthRouter);
router.use(usersRouter);
router.use(coursesRouter);
router.use(lessonsRouter);
router.use(hardRoundRouter);
router.use(progressRouter);
router.use(leaderboardRouter);
router.use(languagesRouter);
router.use(flashcardsRouter);
router.use(studyNotesRouter);
router.use(examPrepRouter);
router.use("/ai-doctor", aiDoctorRouter);
router.use("/notes", elNotesRouter);
router.use("/games", gamesRouter);
router.use("/certificates", certificatesRouter);

export default router;
