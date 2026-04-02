import React, { useState, useEffect } from "react";
import { ArrowLeft, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Clue {
  number: number;
  clue: string;
  answer: string;
  direction: "across" | "down";
}

export default function Crossword({ courseId, onBack }: { courseId: number; onBack: () => void }) {
  const [clues, setClues] = useState<Clue[]>([]);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/games/crossword/${courseId}`)
      .then(r => r.json())
      .then(data => { setClues(data.clues || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [courseId]);

  const handleAnswer = (number: number, value: string) => {
    setAnswers(prev => ({ ...prev, [number]: value.toUpperCase() }));
  };

  const checkAnswers = () => {
    let correct = 0;
    clues.forEach(clue => {
      if (answers[clue.number] === clue.answer) correct++;
    });
    setScore(correct);
  };

  const reset = () => {
    setAnswers({});
    setScore(0);
  };

  if (loading) return <div className="text-center py-8 text-muted-foreground">Loading...</div>;
  if (!clues.length) return <div className="text-center py-8 text-muted-foreground">No crossword available</div>;

  const acrossClues = clues.filter(c => c.direction === "across");
  const downClues = clues.filter(c => c.direction === "down");

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" size="sm" onClick={onBack} className="font-bold gap-1">
          <ArrowLeft className="w-4 h-4" /> Back
        </Button>
        <h1 className="font-bold text-2xl" style={{ fontFamily: 'Fredoka One, sans-serif' }}>Medical Crossword</h1>
        <div className="flex items-center gap-2 bg-red-100 px-4 py-2 rounded-full">
          <Trophy className="w-4 h-4 text-red-600" />
          <span className="font-bold text-red-700">{score}/{clues.length}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Input Grid */}
        <div className="md:col-span-2">
          <div className="grid gap-3 mb-6">
            {clues.map(clue => (
              <div key={clue.number} className="bg-card border-2 border-border rounded-xl p-4">
                <p className="text-sm font-bold text-muted-foreground mb-2">
                  #{clue.number} {clue.direction === "across" ? "→ Across" : "↓ Down"}
                </p>
                <p className="font-bold mb-3">{clue.clue}</p>
                <input
                  type="text"
                  maxLength={clue.answer.length}
                  value={answers[clue.number] || ""}
                  onChange={e => handleAnswer(clue.number, e.target.value)}
                  placeholder={`${clue.answer.length} letters`}
                  className="w-full px-4 py-2 border-2 border-border rounded-lg font-bold uppercase tracking-widest focus:border-primary outline-none"
                />
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <Button onClick={checkAnswers} size="lg" className="flex-1 font-bold rounded-2xl">
              Check Answers
            </Button>
            <Button onClick={reset} variant="outline" size="lg" className="flex-1 font-bold rounded-2xl">
              Restart
            </Button>
          </div>
        </div>

        {/* Clues Sidebar */}
        <div className="space-y-6">
          {acrossClues.length > 0 && (
            <div>
              <h3 className="font-bold text-lg mb-3">→ ACROSS</h3>
              <div className="space-y-2">
                {acrossClues.map(clue => (
                  <div key={clue.number} className="text-sm">
                    <span className="font-bold bg-primary/20 rounded px-2 py-1">{clue.number}</span>
                    <span className="ml-2 text-muted-foreground">{clue.clue}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {downClues.length > 0 && (
            <div>
              <h3 className="font-bold text-lg mb-3">↓ DOWN</h3>
              <div className="space-y-2">
                {downClues.map(clue => (
                  <div key={clue.number} className="text-sm">
                    <span className="font-bold bg-primary/20 rounded px-2 py-1">{clue.number}</span>
                    <span className="ml-2 text-muted-foreground">{clue.clue}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {score > 0 && (
        <div className="mt-6 bg-green-50 border-2 border-green-200 rounded-2xl p-6 text-center">
          <div className="text-4xl mb-2">✅</div>
          <p className="font-bold text-green-700">Correct answers: {score}/{clues.length}</p>
        </div>
      )}
    </div>
  );
}
