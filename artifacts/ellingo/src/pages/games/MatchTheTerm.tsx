import React, { useState, useEffect } from "react";
import { ArrowLeft, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TermPair {
  id: number;
  term: string;
  definition: string;
}

export default function MatchTheTerm({ courseId, onBack }: { courseId: number; onBack: () => void }) {
  const [pairs, setPairs] = useState<TermPair[]>([]);
  const [selected, setSelected] = useState<{ term?: number; def?: number }>({});
  const [matches, setMatches] = useState<Set<number>>(new Set());
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [won, setWon] = useState(false);

  useEffect(() => {
    fetch(`/api/games/match-the-term/${courseId}`)
      .then(r => r.json())
      .then(data => { setPairs(data.pairs); setLoading(false); })
      .catch(() => setLoading(false));
  }, [courseId]);

  const handleSelectTerm = (id: number) => {
    if (matches.has(id)) return;
    setSelected(s => ({ ...s, term: s.term === id ? undefined : id }));
  };

  const handleSelectDef = (id: number) => {
    if (matches.has(id)) return;
    if (!selected.term) return;
    if (selected.term === id) {
      const newMatches = new Set(matches);
      newMatches.add(id);
      setMatches(newMatches);
      setScore(s => s + 1);
      setSelected({});
      if (newMatches.size === pairs.length) setWon(true);
    } else {
      setSelected({});
    }
  };

  const reset = () => {
    setMatches(new Set());
    setScore(0);
    setSelected({});
    setWon(false);
  };

  if (loading) return <div className="text-center py-8 text-muted-foreground">Loading...</div>;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={onBack} className="font-bold gap-1">
          <ArrowLeft className="w-4 h-4" /> Back
        </Button>
        <div className="flex items-center gap-2 bg-blue-100 px-4 py-2 rounded-full">
          <Trophy className="w-4 h-4 text-blue-600" />
          <span className="font-bold text-blue-700">{score}/{pairs.length}</span>
        </div>
        <Button variant="outline" size="sm" onClick={reset} className="rounded-xl font-bold">Restart</Button>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Terms */}
        <div className="space-y-2">
          <h3 className="font-bold text-sm uppercase tracking-wide text-muted-foreground">Terms</h3>
          <div className="space-y-2">
            {pairs.map(pair => (
              <button
                key={pair.id}
                onClick={() => handleSelectTerm(pair.id)}
                disabled={matches.has(pair.id)}
                className={`w-full p-3 rounded-xl text-left font-bold transition-all ${
                  matches.has(pair.id)
                    ? "bg-green-100 border-2 border-green-400 text-green-700 opacity-50"
                    : selected.term === pair.id
                    ? "bg-blue-100 border-2 border-blue-500 text-blue-700"
                    : "bg-card border-2 border-border hover:border-blue-400"
                }`}
              >
                {pair.term}
              </button>
            ))}
          </div>
        </div>

        {/* Definitions */}
        <div className="space-y-2">
          <h3 className="font-bold text-sm uppercase tracking-wide text-muted-foreground">Definitions</h3>
          <div className="space-y-2">
            {[...pairs].sort(() => Math.random() - 0.5).map(pair => (
              <button
                key={pair.id}
                onClick={() => handleSelectDef(pair.id)}
                disabled={matches.has(pair.id)}
                className={`w-full p-3 rounded-xl text-left font-bold transition-all text-sm ${
                  matches.has(pair.id)
                    ? "bg-green-100 border-2 border-green-400 text-green-700 opacity-50"
                    : selected.def === pair.id
                    ? "bg-blue-100 border-2 border-blue-500 text-blue-700"
                    : "bg-card border-2 border-border hover:border-blue-400"
                }`}
              >
                {pair.definition}
              </button>
            ))}
          </div>
        </div>
      </div>

      {won && (
        <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-6 text-center">
          <div className="text-5xl mb-3">🎉</div>
          <h2 className="text-2xl font-bold text-green-700 mb-2">Complete!</h2>
          <p className="text-green-600 font-bold">Matched all pairs {score}/{pairs.length}</p>
        </div>
      )}
    </div>
  );
}
