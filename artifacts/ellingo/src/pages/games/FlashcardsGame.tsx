import React, { useState, useEffect } from "react";
import { ArrowLeft, Trophy, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Card {
  id: number;
  question: string;
  answer: string;
  difficulty: string;
}

export default function FlashcardsGame({ courseId, onBack }: { courseId: number; onBack: () => void }) {
  const [cards, setCards] = useState<Card[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [learned, setLearned] = useState<Set<number>>(new Set());
  const [correct, setCorrect] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/games/flashcards-game/${courseId}`)
      .then(r => r.json())
      .then(data => { setCards(data.cards || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [courseId]);

  if (loading) return <div className="text-center py-8 text-muted-foreground">Loading...</div>;
  if (!cards.length) return <div className="text-center py-8 text-muted-foreground">No flashcards available</div>;

  const current = cards[currentIndex];
  const progress = learned.size;
  const isLearned = learned.has(current.id);

  const markAsLearned = () => {
    const newLearned = new Set(learned);
    newLearned.add(current.id);
    setLearned(newLearned);
    setCorrect(c => c + 1);
    setTimeout(() => nextCard(), 500);
  };

  const nextCard = () => {
    setFlipped(false);
    let next = currentIndex + 1;
    while (next < cards.length && learned.has(cards[next].id)) {
      next++;
    }
    if (next >= cards.length) {
      setCurrentIndex(cards.findIndex(c => !learned.has(c.id)));
    } else {
      setCurrentIndex(next);
    }
  };

  const reset = () => {
    setCurrentIndex(0);
    setFlipped(false);
    setLearned(new Set());
    setCorrect(0);
  };

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={onBack} className="font-bold gap-1">
          <ArrowLeft className="w-4 h-4" /> Back
        </Button>
        <div className="flex items-center gap-2 bg-orange-100 px-4 py-2 rounded-full">
          <Trophy className="w-4 h-4 text-orange-600" />
          <span className="font-bold text-orange-700">{progress}/{cards.length}</span>
        </div>
        <Button variant="outline" size="sm" onClick={reset} className="rounded-xl font-bold gap-1">
          <RotateCw className="w-4 h-4" /> Restart
        </Button>
      </div>

      {/* Card */}
      <div
        onClick={() => setFlipped(!flipped)}
        className="h-64 rounded-3xl bg-gradient-to-br from-orange-100 to-yellow-100 border-4 border-orange-300 flex items-center justify-center cursor-pointer shadow-lg transition-all duration-300 hover:shadow-xl"
        style={{
          perspective: "1000px",
          transformStyle: "preserve-3d",
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        <div className="text-center px-8">
          <p className="text-sm font-bold text-orange-600 uppercase tracking-wide mb-3">
            {flipped ? "📝 Answer" : "❓ Question"}
          </p>
          <p className="text-2xl font-bold text-orange-900 leading-relaxed">
            {flipped ? current.answer : current.question}
          </p>
          <p className="text-xs text-orange-600 mt-4 opacity-60">Click to flip</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-orange-400 to-yellow-400 transition-all duration-300"
          style={{ width: `${(progress / cards.length) * 100}%` }}
        />
      </div>

      {/* Buttons */}
      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={nextCard}
          size="lg"
          className="flex-1 rounded-2xl font-bold"
        >
          Don't know ➡️
        </Button>
        <Button
          onClick={markAsLearned}
          disabled={isLearned}
          size="lg"
          className="flex-1 rounded-2xl font-bold bg-green-500 hover:bg-green-600"
        >
          {isLearned ? "✅ Learned" : "I know it ✓"}
        </Button>
      </div>

      {progress === cards.length && (
        <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-6 text-center">
          <div className="text-5xl mb-3">🏆</div>
          <h3 className="text-2xl font-bold text-green-700 mb-2">Complete!</h3>
          <p className="text-green-600 font-bold">You learned {correct} flashcards!</p>
        </div>
      )}
    </div>
  );
}
