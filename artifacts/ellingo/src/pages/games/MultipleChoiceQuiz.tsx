import React, { useState, useEffect } from "react";
import { ArrowLeft, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Question {
  id: number;
  text: string;
  options: string[];
  difficulty: string;
  category: string;
  correctAnswer: string;
  explanation: string;
}

export default function MultipleChoiceQuiz({ courseId, onBack }: { courseId: number; onBack: () => void }) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/games/quiz/${courseId}/10`)
      .then(r => r.json())
      .then(data => { setQuestions(data.questions || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [courseId]);

  if (loading) return <div className="text-center py-8 text-muted-foreground">Duke ngarkuar...</div>;
  if (!questions.length) return <div className="text-center py-8 text-muted-foreground">Nuk ka pyetje të disponueshme</div>;

  const current = questions[currentIndex];
  const isCorrect = selected === current.correctAnswer;
  const isLastQuestion = currentIndex === questions.length - 1;

  const handleAnswer = () => {
    setAnswered(true);
    if (isCorrect) setScore(s => s + 1);
  };

  const nextQuestion = () => {
    if (isLastQuestion) return;
    setSelected(null);
    setAnswered(false);
    setCurrentIndex(i => i + 1);
  };

  const reset = () => {
    setCurrentIndex(0);
    setSelected(null);
    setAnswered(false);
    setScore(0);
  };

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={onBack} className="font-bold gap-1">
          <ArrowLeft className="w-4 h-4" /> Mbrapa
        </Button>
        <span className="text-sm font-bold text-muted-foreground">
          Pyetja {currentIndex + 1}/{questions.length}
        </span>
        <div className="flex items-center gap-2 bg-cyan-100 px-4 py-2 rounded-full">
          <Trophy className="w-4 h-4 text-cyan-600" />
          <span className="font-bold text-cyan-700">{score}</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
        />
      </div>

      {/* Difficulty */}
      <div>
        <span className={`inline-block px-3 py-1 rounded-full font-bold text-xs ${
          current.difficulty === "easy" ? "bg-green-100 text-green-700"
          : current.difficulty === "intermediate" ? "bg-yellow-100 text-yellow-700"
          : "bg-red-100 text-red-700"
        }`}>
          {current.difficulty === "easy" ? "🟢 E Lehtë"
          : current.difficulty === "intermediate" ? "🟡 Mesatare"
          : "🔴 E Vështirë"}
        </span>
      </div>

      {/* Question */}
      <div className="bg-card border-2 border-border rounded-2xl p-6">
        <p className="text-lg font-bold">{current.text}</p>
        <p className="text-xs text-muted-foreground mt-3">Kategori: {current.category}</p>
      </div>

      {/* Options */}
      <div className="space-y-3">
        {current.options.map((option, i) => (
          <button
            key={i}
            onClick={() => { if (!answered) setSelected(option); }}
            disabled={answered}
            className={`w-full p-4 rounded-2xl text-left font-bold transition-all border-2 flex items-center gap-3 ${
              answered && option === current.correctAnswer
                ? "bg-green-100 border-green-400 text-green-700"
                : answered && option === selected && !isCorrect
                ? "bg-red-100 border-red-400 text-red-700"
                : selected === option && !answered
                ? "bg-cyan-100 border-cyan-500 text-cyan-700"
                : "bg-card border-border hover:border-cyan-400"
            }`}
          >
            <div className="w-8 h-8 rounded-full border-2 border-current flex items-center justify-center flex-shrink-0 text-sm font-bold">
              {String.fromCharCode(65 + i)}
            </div>
            <span>{option}</span>
          </button>
        ))}
      </div>

      {!answered && (
        <Button onClick={handleAnswer} disabled={!selected} size="lg" className="w-full font-bold rounded-2xl">
          Konfirmo Përgjigjen
        </Button>
      )}

      {answered && (
        <div className={`rounded-2xl p-6 ${isCorrect ? "bg-green-50 border-2 border-green-200" : "bg-red-50 border-2 border-red-200"}`}>
          <div className="flex items-start gap-4 mb-4">
            <div className="text-4xl">{isCorrect ? "✅" : "❌"}</div>
            <div className="flex-1">
              <h3 className={`font-bold text-lg ${isCorrect ? "text-green-700" : "text-red-700"}`}>
                {isCorrect ? "Përgjigje e Saktë!" : "Përgjigje e Gabuar"}
              </h3>
            </div>
          </div>
          <p className="font-semibold mb-3">
            📖 <span className="font-bold">{current.explanation}</span>
          </p>
          {isLastQuestion ? (
            <div className="grid grid-cols-2 gap-3">
              <Button onClick={reset} variant="outline" className="rounded-2xl font-bold">Rifillo</Button>
              <Button onClick={onBack} className="rounded-2xl font-bold">Përfundo</Button>
            </div>
          ) : (
            <Button onClick={nextQuestion} size="lg" className="w-full font-bold rounded-2xl">
              Pyetja Tjetër ➡️
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
