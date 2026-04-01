import { Router } from "express";
import { db } from "@workspace/db";
import { certificatesTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";

const router = Router();
const DEFAULT_USER_ID = 1;

// Get all user certificates
router.get("/", async (req, res): Promise<void> => {
  const certs = await db
    .select()
    .from(certificatesTable)
    .where(eq(certificatesTable.userId, DEFAULT_USER_ID))
    .orderBy(desc(certificatesTable.awardedDate));
  res.json(certs);
});

// Get certificate by ID
router.get("/:id", async (req, res): Promise<void> => {
  const id = parseInt(req.params.id);
  const [cert] = await db
    .select()
    .from(certificatesTable)
    .where(eq(certificatesTable.id, id));
  if (!cert) { res.status(404).json({ error: "Sertifikata nuk u gjet" }); return; }
  res.json(cert);
});

// Award certificate to user
router.post("/", async (req, res): Promise<void> => {
  const { type, title, description, category, level, achievements, badgeEmoji, courseId } = req.body;
  
  if (!type || !title || !description || !category) {
    res.status(400).json({ error: "Fushat e kërkuara mungojnë" });
    return;
  }

  const [cert] = await db
    .insert(certificatesTable)
    .values({
      userId: DEFAULT_USER_ID,
      type,
      title,
      description,
      category,
      level: level || "beginner",
      achievements: achievements || 0,
      badgeEmoji: badgeEmoji || "🏆",
      courseId,
    })
    .returning();

  res.status(201).json(cert);
});

// Award certificate for game completion
router.post("/award", async (req, res): Promise<void> => {
  const { gameType, score, maxScore, courseId } = req.body;

  let certType = "completion";
  let badgeEmoji = "🏅";
  let title = "";
  let description = "";

  const percentage = (score / maxScore) * 100;

  if (percentage >= 90) {
    certType = "excellence";
    badgeEmoji = "⭐";
    title = `Certificate of Excellence - ${gameType}`;
    description = `Arrite 90% ose më lart në ${gameType}`;
  } else if (percentage >= 70) {
    certType = "completion";
    badgeEmoji = "🏆";
    title = `Certificate of Completion - ${gameType}`;
    description = `Përfundoi me sukses ${gameType}`;
  }

  const [cert] = await db
    .insert(certificatesTable)
    .values({
      userId: DEFAULT_USER_ID,
      type: certType,
      title,
      description,
      category: gameType,
      level: "intermediate",
      achievements: Math.round(percentage),
      badgeEmoji,
      courseId,
    })
    .returning();

  res.status(201).json(cert);
});

// Get certificates by type
router.get("/type/:type", async (req, res): Promise<void> => {
  const type = req.params.type;
  const certs = await db
    .select()
    .from(certificatesTable)
    .where(eq(certificatesTable.type, type));
  res.json(certs);
});

// Count user certificates
router.get("/stats/count", async (req, res): Promise<void> => {
  const certs = await db
    .select()
    .from(certificatesTable)
    .where(eq(certificatesTable.userId, DEFAULT_USER_ID));

  const stats = {
    total: certs.length,
    completion: certs.filter(c => c.type === "completion").length,
    excellence: certs.filter(c => c.type === "excellence").length,
    mastery: certs.filter(c => c.type === "mastery").length,
    daily_challenge: certs.filter(c => c.type === "daily_challenge").length,
    weekly_challenge: certs.filter(c => c.type === "weekly_challenge").length,
  };

  res.json(stats);
});

export default router;
