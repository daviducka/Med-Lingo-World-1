import React, { useState, useEffect } from "react";
import { BookOpen, Trophy } from "lucide-react";
import { useGetCourse } from "@workspace/api-client-react";
import { useGetUserProfile } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import MatchTheTerm from "./games/MatchTheTerm";
import DailyChallenge from "./games/DailyChallenge";
import GuessTheOrgan from "./games/GuessTheOrgan";
import FlashcardsGame from "./games/FlashcardsGame";
import MultipleChoiceQuiz from "./games/MultipleChoiceQuiz";
import Crossword from "./games/Crossword";

type GameId = "match-term" | "daily-challenge" | "guess-organ" | "flashcards" | "quiz" | "crossword" | null;

const GAMES = [
  {
    id: "match-term" as GameId,
    emoji: "🔗",
    title: "Match the Term",
    desc: "Lidh termat me përkufizimet e tyre",
    bg: "from-blue-400 to-blue-600",
  },
  {
    id: "daily-challenge" as GameId,
    emoji: "📅",
    title: "Daily Challenge",
    desc: "Loja e re çdo ditë — sfida e përditshme",
    bg: "from-purple-400 to-purple-600",
  },
  {
    id: "guess-organ" as GameId,
    emoji: "🫀",
    title: "Guess the Organ",
    desc: "Identifiko organet dhe sistemet e trupit",
    bg: "from-pink-400 to-rose-600",
  },
  {
    id: "flashcards" as GameId,
    emoji: "🎴",
    title: "Flashcards Game",
    desc: "Mëso me kartela — shpejtësi dhe memorie",
    bg: "from-orange-400 to-orange-600",
  },
  {
    id: "quiz" as GameId,
    emoji: "❓",
    title: "Multiple Choice Quiz",
    desc: "Pyetje me alternativa — testo njohuritë",
    bg: "from-cyan-400 to-blue-600",
  },
  {
    id: "crossword" as GameId,
    emoji: "🔤",
    title: "Medical Crossword",
    desc: "Fjalëkryqe mjekësore — plotëso rutën",
    bg: "from-green-400 to-green-600",
  },
];

function GameHub({
  onSelectGame,
  selectedCourse,
}: {
  onSelectGame: (gameId: GameId, courseId?: number) => void;
  selectedCourse: number | null;
}) {
  const { data: profile } = useGetUserProfile();
  const [courses, setCourses] = useState<any[]>([]);
  const language = profile?.selectedLanguage || "sq";

  useEffect(() => {
    // Fetch courses based on user's language
    fetch(`/api/courses?language=${language}`)
      .then(r => r.json())
      .then(data => setCourses(data || []))
      .catch(() => setCourses([]));
  }, [language]);

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center mb-10">
        <h1
          className="text-6xl font-bold mb-3 shimmer-text"
          style={{ fontFamily: "Fredoka One, sans-serif" }}
        >
          Gerard Games 🎮
        </h1>
        <p className="text-muted-foreground font-semibold text-xl mb-2">
          6 Lojëra Interaktive për të Mësuar Mjekësinë
        </p>
        <p className="text-xs text-muted-foreground italic font-medium">
          by Elson
        </p>
      </div>

      {/* Course Selector */}
      {selectedCourse === null && (
        <div className="mb-10 bg-card border-2 border-border rounded-2xl p-6">
          <h2 className="font-bold text-lg mb-4">Zgjedh një Kurs</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {courses?.map(course => (
              <button
                key={course.id}
                onClick={() => {
                  /* Store selected course for games */
                }}
                className="p-3 rounded-xl border-2 border-border hover:border-primary text-left transition-all hover:bg-primary/5"
              >
                <div className="text-2xl mb-2">{course.iconEmoji}</div>
                <p className="font-bold text-sm">{course.title}</p>
                <p className="text-xs text-muted-foreground">{course.category}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Games Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {GAMES.map(game => (
          <button
            key={game.id}
            onClick={() => onSelectGame(game.id, selectedCourse || undefined)}
            className={`group relative overflow-hidden rounded-3xl p-6 text-left text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 hover:scale-[1.02] active:scale-[0.98] bg-gradient-to-br ${game.bg}`}
          >
            <div className="absolute -right-4 -bottom-4 text-9xl opacity-15 select-none pointer-events-none">
              {game.emoji}
            </div>
            <div className="relative z-10">
              <div className="text-5xl mb-3 drop-shadow">{game.emoji}</div>
              <h2
                className="text-2xl font-bold mb-1 drop-shadow"
                style={{ fontFamily: "Fredoka One, sans-serif" }}
              >
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

      {/* Footer */}
      <div className="text-center text-sm text-muted-foreground font-medium">
        🎮 Gerard Games · Lojëra mini në El_lingo ·{" "}
        <span className="text-primary font-bold">Created by Elson</span>
      </div>
    </div>
  );
}

export default function GerardGames() {
  const [activeGame, setActiveGame] = useState<GameId>(null);
  const [selectedCourse, setSelectedCourse] = useState<number | null>(null);

  const handleSelectGame = (gameId: GameId, courseId?: number) => {
    if (gameId === "daily-challenge") {
      setActiveGame(gameId);
    } else if (courseId) {
      setSelectedCourse(courseId);
      setActiveGame(gameId);
    }
  };

  const handleBack = () => {
    setActiveGame(null);
    setSelectedCourse(null);
  };

  // Render selected game
  if (activeGame === "match-term" && selectedCourse)
    return <MatchTheTerm courseId={selectedCourse} onBack={handleBack} />;
  if (activeGame === "daily-challenge")
    return <DailyChallenge onBack={handleBack} />;
  if (activeGame === "guess-organ" && selectedCourse)
    return <GuessTheOrgan courseId={selectedCourse} onBack={handleBack} />;
  if (activeGame === "flashcards" && selectedCourse)
    return <FlashcardsGame courseId={selectedCourse} onBack={handleBack} />;
  if (activeGame === "quiz" && selectedCourse)
    return <MultipleChoiceQuiz courseId={selectedCourse} onBack={handleBack} />;
  if (activeGame === "crossword" && selectedCourse)
    return <Crossword courseId={selectedCourse} onBack={handleBack} />;

  // Default: show games hub
  return (
    <GameHub
      onSelectGame={handleSelectGame}
      selectedCourse={selectedCourse}
    />
  );
}
