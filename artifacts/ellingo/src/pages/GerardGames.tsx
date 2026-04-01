import React, { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { useGetUserProfile } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import MatchTheTerm from "./games/MatchTheTerm";
import DailyChallenge from "./games/DailyChallenge";
import GuessTheOrgan from "./games/GuessTheOrgan";
import FlashcardsGame from "./games/FlashcardsGame";
import MultipleChoiceQuiz from "./games/MultipleChoiceQuiz";
import Crossword from "./games/Crossword";

type GameId = "match-term" | "daily-challenge" | "guess-organ" | "flashcards" | "quiz" | "crossword" | null;

const CATEGORY_SQ: Record<string, string> = {
  anatomy: "Anatomi",
  pharmacology: "Farmakologji",
  physiology: "Fiziologji",
  pathology: "Patologji",
  microbiology: "Mikrobiologji",
  biochemistry: "Biokimi",
  neuroanatomy: "Neuroanatomi",
  immunology: "Imunologji",
  biology: "Biologji",
  ecology: "Ekologji",
  botany: "Botanikë",
  genetics: "Gjenetikë",
};

const GAMES = [
  { id: "match-term" as GameId, emoji: "🔗", title: "Lidh Termat", desc: "Lidh termat me përkufizimet", bg: "from-blue-400 to-blue-600", needsCourse: true },
  { id: "daily-challenge" as GameId, emoji: "📅", title: "Sfida Ditore", desc: "Sfida e përditshme — nuk kërkon kurs", bg: "from-purple-400 to-purple-600", needsCourse: false },
  { id: "guess-organ" as GameId, emoji: "🫀", title: "Gjej Organin", desc: "Identifiko organet e trupit", bg: "from-pink-400 to-rose-600", needsCourse: true },
  { id: "flashcards" as GameId, emoji: "🎴", title: "Loja e Kartelave", desc: "Mëso me kartela interaktive", bg: "from-orange-400 to-orange-600", needsCourse: true },
  { id: "quiz" as GameId, emoji: "❓", title: "Quiz me Alternativa", desc: "Pyetje me zgjedhje të shumëfishta", bg: "from-cyan-400 to-blue-600", needsCourse: true },
  { id: "crossword" as GameId, emoji: "🔤", title: "Fjalëkryq Mjekësor", desc: "Fjalëkryqe mjekësore shqip", bg: "from-green-400 to-green-600", needsCourse: true },
];

interface Course {
  id: number;
  title: string;
  iconEmoji: string;
  category: string;
  color: string;
  totalLessons: number;
}

export default function GerardGames() {
  const [activeGame, setActiveGame] = useState<GameId>(null);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [step, setStep] = useState<"courses" | "games" | "playing">("courses");
  const { data: profile } = useGetUserProfile();
  const language = profile?.selectedLanguage || "sq";

  useEffect(() => {
    fetch(`/api/courses?language=${language}`)
      .then(r => r.json())
      .then(data => setCourses(data || []))
      .catch(() => setCourses([]));
  }, [language]);

  const handleSelectCourse = (course: Course) => {
    setSelectedCourse(course);
    setStep("games");
  };

  const handleSelectGame = (gameId: GameId) => {
    if (gameId === "daily-challenge") {
      setActiveGame(gameId);
      setStep("playing");
      return;
    }
    if (!selectedCourse) return;
    setActiveGame(gameId);
    setStep("playing");
  };

  const handleBack = () => {
    if (step === "playing") {
      setActiveGame(null);
      setStep("games");
    } else if (step === "games") {
      setSelectedCourse(null);
      setStep("courses");
    }
  };

  // ─── Render active game ──────────────────────────────────────────────────
  if (step === "playing" && selectedCourse) {
    if (activeGame === "match-term") return <MatchTheTerm courseId={selectedCourse.id} onBack={handleBack} />;
    if (activeGame === "guess-organ") return <GuessTheOrgan courseId={selectedCourse.id} onBack={handleBack} />;
    if (activeGame === "flashcards") return <FlashcardsGame courseId={selectedCourse.id} onBack={handleBack} />;
    if (activeGame === "quiz") return <MultipleChoiceQuiz courseId={selectedCourse.id} onBack={handleBack} />;
    if (activeGame === "crossword") return <Crossword courseId={selectedCourse.id} onBack={handleBack} />;
  }
  if (step === "playing" && activeGame === "daily-challenge") {
    return <DailyChallenge onBack={handleBack} />;
  }

  // ─── Step 1: Course Selection ────────────────────────────────────────────
  if (step === "courses") {
    return (
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-5xl font-bold mb-2 shimmer-text" style={{ fontFamily: "Fredoka One, sans-serif" }}>
            Gerard Games 🎮
          </h1>
          <p className="text-muted-foreground font-semibold text-lg">
            Zgjedh një kurs për të filluar lojën
          </p>
          <p className="text-xs text-muted-foreground italic mt-1">by Elson</p>
        </div>

        {/* Daily Challenge - no course needed */}
        <div
          onClick={() => { setActiveGame("daily-challenge"); setStep("playing"); }}
          className="mb-6 cursor-pointer rounded-3xl p-5 bg-gradient-to-r from-purple-500 to-violet-600 text-white shadow-xl hover:-translate-y-1 transition-all duration-200 flex items-center gap-4"
        >
          <div className="text-5xl">📅</div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold" style={{ fontFamily: "Fredoka One, sans-serif" }}>Sfida Ditore</h2>
            <p className="text-white/85 text-sm font-semibold">Sfida e përditshme — nuk kërkon kurs</p>
          </div>
          <div className="bg-white/25 px-4 py-2 rounded-full font-bold text-sm">Luaj →</div>
        </div>

        {/* Course Grid */}
        <h2 className="font-bold text-xl mb-4">Zgjedh Kursin 📚</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {courses.map(course => (
            <button
              key={course.id}
              onClick={() => handleSelectCourse(course)}
              className="p-4 rounded-2xl border-2 text-left transition-all duration-200 hover:-translate-y-1 hover:shadow-lg group"
              style={{ borderColor: `${course.color}40`, backgroundColor: `${course.color}10` }}
            >
              <div className="text-4xl mb-3">{course.iconEmoji}</div>
              <p className="font-bold text-sm leading-tight">{course.title}</p>
              <p className="text-xs text-muted-foreground mt-1">{CATEGORY_SQ[course.category] || course.category}</p>
              <div
                className="mt-3 text-xs font-bold px-3 py-1 rounded-full inline-block"
                style={{ backgroundColor: `${course.color}25`, color: course.color }}
              >
                {course.totalLessons} mësime →
              </div>
            </button>
          ))}
        </div>

        <div className="mt-8 text-center text-sm text-muted-foreground font-medium">
          🎮 Gerard Games · <span className="text-primary font-bold">Created by Elson</span>
        </div>
      </div>
    );
  }

  // ─── Step 2: Games Selection ─────────────────────────────────────────────
  return (
    <div className="max-w-5xl mx-auto">
      {/* Header with back + selected course */}
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" onClick={handleBack} className="font-bold gap-2 rounded-xl">
          <ArrowLeft className="w-4 h-4" /> Ndrysho Kursin
        </Button>
        <div
          className="flex items-center gap-3 px-4 py-2 rounded-2xl border-2"
          style={{ borderColor: `${selectedCourse?.color}50`, backgroundColor: `${selectedCourse?.color}15` }}
        >
          <span className="text-2xl">{selectedCourse?.iconEmoji}</span>
          <div>
            <p className="font-bold text-sm">{selectedCourse?.title}</p>
            <p className="text-xs text-muted-foreground">{CATEGORY_SQ[selectedCourse?.category || ""] || selectedCourse?.category}</p>
          </div>
        </div>
      </div>

      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold" style={{ fontFamily: "Fredoka One, sans-serif" }}>Zgjedh Lojën 🕹️</h2>
        <p className="text-muted-foreground font-semibold mt-1">6 lojëra interaktive për të mësuar</p>
      </div>

      {/* Games Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {GAMES.map(game => (
          <button
            key={game.id}
            onClick={() => handleSelectGame(game.id)}
            className={`group relative overflow-hidden rounded-3xl p-6 text-left text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 hover:scale-[1.02] active:scale-[0.98] bg-gradient-to-br ${game.bg}`}
          >
            <div className="absolute -right-4 -bottom-4 text-9xl opacity-15 select-none pointer-events-none">
              {game.emoji}
            </div>
            <div className="relative z-10">
              <div className="text-5xl mb-3 drop-shadow">{game.emoji}</div>
              <h2 className="text-xl font-bold mb-1 drop-shadow" style={{ fontFamily: "Fredoka One, sans-serif" }}>
                {game.title}
              </h2>
              <p className="text-white/85 font-semibold text-sm">{game.desc}</p>
              <div className="mt-4 inline-flex items-center gap-1 bg-white/25 backdrop-blur rounded-full px-4 py-1.5 text-sm font-bold shadow">
                Luaj Tani →
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="mt-8 text-center text-sm text-muted-foreground font-medium">
        🎮 Gerard Games · <span className="text-primary font-bold">Created by Elson</span>
      </div>
    </div>
  );
}
