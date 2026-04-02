import React, { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DailyQuestion {
  id: number;
  text: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  difficulty: string;
  category: string;
  date: string;
}

export default function DailyChallenge({ onBack }: { onBack: () => void }) {
  const [question, setQuestion] = useState<DailyQuestion | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/games/daily-challenge")
      .then(r => r.json())
      .then(data => { setQuestion(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center py-8 text-muted-foreground">Loading...</div>;
  if (!question) return <div className="text-center py-8 text-muted-foreground">No question for today</div>;

  const isCorrect = selected === question.correctAnswer;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="sm" onClick={onBack} className="font-bold gap-1">
          <ArrowLeft className="w-4 h-4" /> Back
        </Button>
        <span className="text-sm font-bold text-muted-foreground">📅 Daily Challenge • {new Date(question.date).toLocaleDateString("en-US")}</span>
      </div>

      {/* Difficulty Badge */}
      <div className="mb-6">
        <span className={`inline-block px-4 py-1.5 rounded-full font-bold text-sm ${
          question.difficulty === "easy" ? "bg-green-100 text-green-700"
          : question.difficulty === "intermediate" ? "bg-yellow-100 text-yellow-700"
          : "bg-red-100 text-red-700"
        }`}>
          {question.difficulty === "easy" ? "🟢 Easy"
          : question.difficulty === "intermediate" ? "🟡 Medium"
          : "🔴 Hard"}
        </span>
      </div>

      {/* Question */}
      <div className="bg-card border-2 border-border rounded-2xl p-6 mb-6">
        <p className="text-lg font-bold text-foreground">{question.text}</p>
        <p className="text-xs text-muted-foreground mt-3 font-semibold">Category: {question.category}</p>
      </div>

      {/* Options */}
      <div className="space-y-3 mb-6">
        {question.options.map((option, i) => (
          <button
            key={i}
            onClick={() => { if (!answered) setSelected(option); }}
            disabled={answered}
            className={`w-full p-4 rounded-2xl text-left font-bold transition-all border-2 ${
              answered && option === question.correctAnswer
                ? "bg-green-100 border-green-400 text-green-700"
                : answered && option === selected && !isCorrect
                ? "bg-red-100 border-red-400 text-red-700"
                : selected === option && !answered
                ? "bg-blue-100 border-blue-500 text-blue-700"
                : "bg-card border-border hover:border-primary"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full border-2 border-current flex items-center justify-center text-sm">
                {String.fromCharCode(65 + i)}
              </div>
              {option}
            </div>
          </button>
        ))}
      </div>

      {!answered && (
        <Button onClick={() => setAnswered(true)} disabled={!selected} size="lg" className="w-full font-bold rounded-2xl">
          Confirm Answer
        </Button>
      )}

      {answered && (
        <div className={`rounded-2xl p-6 ${isCorrect ? "bg-green-50 border-2 border-green-200" : "bg-red-50 border-2 border-red-200"}`}>
          <div className="flex items-start gap-4">
            <div className="text-4xl">{isCorrect ? "✅" : "❌"}</div>
            <div className="flex-1">
              <h3 className={`font-bold text-lg mb-2 ${isCorrect ? "text-green-700" : "text-red-700"}`}>
                {isCorrect ? "Correct Answer!" : "Wrong Answer"}
              </h3>
              <p className={`font-semibold mb-3 ${isCorrect ? "text-green-600" : "text-red-600"}`}>
                Correct answer: <span className="font-bold">{question.correctAnswer}</span>
              </p>
              <p className={`${isCorrect ? "text-green-600" : "text-red-600"}`}>
                {question.explanation}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
