import { Router } from "express";
import { db } from "@workspace/db";
import { questionsTable, flashcardsTable, lessonsTable, coursesTable } from "@workspace/db";
import { eq, ne } from "drizzle-orm";

const router = Router();
const DEFAULT_USER_ID = 1;

// ─── Match the Term: Extract terms/definitions from lessons ─────────────────
router.get("/match-the-term/:courseId", async (req, res): Promise<void> => {
  const courseId = parseInt(req.params.courseId);
  const lessons = await db
    .select()
    .from(lessonsTable)
    .where(eq(lessonsTable.courseId, courseId));

  const pairs = lessons.map(lesson => ({
    id: lesson.id,
    term: lesson.title,
    definition: lesson.description || "",
  }));

  res.json({ pairs: pairs.slice(0, 8) }); // Limit to 8 pairs for gameplay
});

// ─── Guess the Organ/System: Map lessons to body parts with emoji ──────────
router.get("/guess-organ/:courseId", async (req, res): Promise<void> => {
  const courseId = parseInt(req.params.courseId);
  const course = await db
    .select()
    .from(coursesTable)
    .where(eq(coursesTable.id, courseId));

  if (!course.length) {
    res.status(404).json({ error: "Kurs nuk u gjet" });
    return;
  }

  const iconEmoji = course[0].iconEmoji || "🫀";
  const title = course[0].title || "";

  // Create 4-option multiple choice for organ identification
  const organs = [
    { name: "Zemra", emoji: "❤️", desc: "Pompa e gjakut" },
    { name: "Trupi i Keq", emoji: "🫁", desc: "Organi i frymëmarrjes" },
    { name: "Truri", emoji: "🧠", desc: "Qendra e kontrollit" },
    { name: "Veshka", emoji: "💊", desc: "Filtrimi i ujit" },
    { name: "Stomaku", emoji: "🔬", desc: "Tretja e ushqimit" },
    { name: "Mëlçia", emoji: "🦴", desc: "Ruajtja e energjisë" },
  ];

  res.json({
    systems: organs.map(o => ({
      id: o.name,
      name: o.name,
      emoji: o.emoji,
      description: o.desc,
    })),
    targetEmoji: iconEmoji,
    targetName: title,
  });
});

// ─── Daily Challenge: Pick one random question per day ───────────────────
router.get("/daily-challenge", async (req, res): Promise<void> => {
  const today = new Date().toDateString();
  const seed = today.split("").reduce((a, c) => a + c.charCodeAt(0), 0);

  const questions = await db
    .select()
    .from(questionsTable)
    .limit(50);

  if (!questions.length) {
    res.json({ question: null, message: "Nuk ka pyetje të disponueshme" });
    return;
  }

  const dailyIndex = seed % questions.length;
  const dailyQuestion = questions[dailyIndex];

  const options = dailyQuestion.optionsJson
    ? JSON.parse(dailyQuestion.optionsJson)
    : [dailyQuestion.correctAnswer];

  res.json({
    id: dailyQuestion.id,
    text: dailyQuestion.questionText,
    options,
    correctAnswer: dailyQuestion.correctAnswer,
    explanation: dailyQuestion.explanation,
    difficulty: dailyQuestion.difficulty,
    category: dailyQuestion.category,
    date: today,
  });
});

// ─── Flashcards Game: Get user's flashcards for game mode ──────────────────
router.get("/flashcards-game", async (req, res): Promise<void> => {
  const cards = await db
    .select()
    .from(flashcardsTable);

  const gameCards = cards.map(c => ({
    id: c.id,
    question: c.front,
    answer: c.back,
    difficulty: c.difficulty || "easy",
  }));

  res.json({ cards: gameCards });
});

router.get("/flashcards-game/:courseId", async (req, res): Promise<void> => {
  const courseId = parseInt(req.params.courseId);

  const cards = await db
    .select()
    .from(flashcardsTable)
    .where(eq(flashcardsTable.courseId, courseId));

  const gameCards = cards.map(c => ({
    id: c.id,
    question: c.front,
    answer: c.back,
    difficulty: c.difficulty || "easy",
  }));

  res.json({ cards: gameCards });
});

// ─── Multiple Choice Quiz: Random questions from a course ─────────────────
router.get("/quiz/:courseId", async (req, res): Promise<void> => {
  const courseId = parseInt(req.params.courseId);
  const count = 10;

  const lessons = await db
    .select({ id: lessonsTable.id })
    .from(lessonsTable)
    .where(eq(lessonsTable.courseId, courseId));

  const lessonIds = lessons.map(l => l.id);

  if (!lessonIds.length) {
    res.json({ questions: [] });
    return;
  }

  const allQuestions = await db
    .select()
    .from(questionsTable)
    .where(eq(questionsTable.lessonId, lessonIds[0]));

  // Shuffle and pick random questions
  const shuffled = allQuestions.sort(() => Math.random() - 0.5).slice(0, count);

  const quizQuestions = shuffled.map(q => ({
    id: q.id,
    text: q.questionText,
    options: JSON.parse(q.optionsJson || "[]"),
    difficulty: q.difficulty,
    category: q.category,
    correctAnswer: q.correctAnswer,
    explanation: q.explanation,
  }));

  res.json({ questions: quizQuestions });
});

// ─── Crossword Data: Generate crossword clues from questions ──────────────
router.get("/crossword/:courseId", async (req, res): Promise<void> => {
  const courseId = parseInt(req.params.courseId);

  const lessons = await db
    .select({ id: lessonsTable.id })
    .from(lessonsTable)
    .where(eq(lessonsTable.courseId, courseId));

  const lessonIds = lessons.map(l => l.id);

  if (!lessonIds.length) {
    res.json({ clues: [] });
    return;
  }

  const questions = await db
    .select()
    .from(questionsTable)
    .where(eq(questionsTable.lessonId, lessonIds[0]))
    .limit(10);

  // Extract terms from correct answers (assuming they're short medical terms)
  const clues = questions.map((q, i) => ({
    number: i + 1,
    clue: q.questionText,
    answer: q.correctAnswer.toUpperCase().split(" ")[0].substring(0, 8), // First word, max 8 chars
    direction: i % 2 === 0 ? "across" : "down",
  }));

  res.json({ clues });
});

export default router;
