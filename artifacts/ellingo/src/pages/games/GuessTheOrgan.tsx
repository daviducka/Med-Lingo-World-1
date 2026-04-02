import React, { useState, useEffect } from "react";
import { ArrowLeft, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Organ {
  id: string;
  name: string;
  emoji: string;
  description: string;
}

export default function GuessTheOrgan({ courseId, onBack }: { courseId: number; onBack: () => void }) {
  const [organs, setOrgans] = useState<Organ[]>([]);
  const [targetEmoji, setTargetEmoji] = useState("");
  const [targetName, setTargetName] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadGame();
  }, [courseId]);

  const loadGame = async () => {
    try {
      const res = await fetch(`/api/games/guess-organ/${courseId}`);
      const data = await res.json();
      setOrgans(data.systems);
      setTargetEmoji(data.targetEmoji);
      setTargetName(data.targetName);
      setSelected(null);
      setAnswered(false);
      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
  };

  const isCorrect = selected === targetName;

  const nextRound = () => {
    setRound(r => r + 1);
    loadGame();
  };

  if (loading) return <div className="text-center py-8 text-muted-foreground">Loading...</div>;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={onBack} className="font-bold gap-1">
          <ArrowLeft className="w-4 h-4" /> Back
        </Button>
        <span className="font-bold text-muted-foreground">Round {round}</span>
        <div className="flex items-center gap-2 bg-purple-100 px-4 py-2 rounded-full">
          <Trophy className="w-4 h-4 text-purple-600" />
          <span className="font-bold text-purple-700">{score}</span>
        </div>
      </div>

      {/* Target Icon */}
      <div className="flex justify-center">
        <div className="text-9xl drop-shadow-lg animate-bounce">{targetEmoji}</div>
      </div>

      <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-6 text-center border-2 border-purple-200">
        <p className="font-bold text-purple-700 text-lg">Which organ/system is this?</p>
        <p className="text-sm text-purple-600 mt-2">Choose the correct answer</p>
      </div>

      {/* Options */}
      <div className="grid grid-cols-2 gap-3">
        {organs.map(organ => (
          <button
            key={organ.id}
            onClick={() => { if (!answered) setSelected(organ.name); }}
            disabled={answered}
            className={`p-4 rounded-2xl font-bold transition-all border-2 flex flex-col items-center gap-2 ${
              answered && organ.name === targetName
                ? "bg-green-100 border-green-400 text-green-700"
                : answered && organ.name === selected && !isCorrect
                ? "bg-red-100 border-red-400 text-red-700"
                : selected === organ.name && !answered
                ? "bg-purple-100 border-purple-500 text-purple-700"
                : "bg-card border-border hover:border-purple-400"
            }`}
          >
            <span className="text-3xl">{organ.emoji}</span>
            <span className="text-sm">{organ.name}</span>
          </button>
        ))}
      </div>

      {!answered && (
        <Button onClick={() => setAnswered(true)} disabled={!selected} size="lg" className="w-full font-bold rounded-2xl">
          Confirm
        </Button>
      )}

      {answered && (
        <div className={`rounded-2xl p-6 text-center ${isCorrect ? "bg-green-50 border-2 border-green-200" : "bg-red-50 border-2 border-red-200"}`}>
          <div className="text-5xl mb-3">{isCorrect ? "🎉" : "😢"}</div>
          <h3 className={`font-bold text-lg mb-2 ${isCorrect ? "text-green-700" : "text-red-700"}`}>
            {isCorrect ? "Correct Answer!" : "Wrong Answer"}
          </h3>
          <p className={`font-bold mb-4 ${isCorrect ? "text-green-600" : "text-red-600"}`}>
            Correct answer: {targetName} {targetEmoji}
          </p>
          {isCorrect && <p className="text-green-600 font-semibold mb-4">+10 points!</p>}
          <Button onClick={nextRound} size="lg" className="w-full font-bold rounded-2xl">
            Next Round
          </Button>
        </div>
      )}
    </div>
  );
}
