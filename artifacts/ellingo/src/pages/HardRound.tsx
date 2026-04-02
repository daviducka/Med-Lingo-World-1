import React, { useState, useMemo } from "react";
import { Link, useLocation } from "wouter";
import { useGetHardRoundQuestions, useSubmitHardRound } from "@workspace/api-client-react";

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
import { Shield, Timer, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HardRound() {
  const [, setLocation] = useLocation();
  const [started, setStarted] = useState(false);
  
  const { data: questions, isLoading } = useGetHardRoundQuestions({ count: 10 }, { query: { enabled: started, queryKey: ['/api/hard-round', 10] } });
  const submitHardRound = useSubmitHardRound();

  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<{questionId: number, selectedAnswer: string}[]>([]);
  const [timeLeft, setTimeLeft] = useState(120);
  const [finished, setFinished] = useState(false);
  const [result, setResult] = useState<any>(null);

  const shuffledOptions = useMemo(() => {
    if (!questions?.[currentIdx]?.options) return [];
    return shuffleArray(questions[currentIdx].options);
  }, [currentIdx, questions]);

  React.useEffect(() => {
    if (started && !finished && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(t => t - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !finished && started) {
      handleFinish();
    }
  }, [started, finished, timeLeft]);

  const handleFinish = () => {
    setFinished(true);
    submitHardRound.mutate({
      data: {
        answers: answers,
        timeTakenSeconds: 120 - timeLeft
      }
    }, {
      onSuccess: (res) => setResult(res)
    });
  };

  const handleSelect = (option: string) => {
    if (!questions) return;
    
    const newAnswers = [...answers];
    const qId = questions[currentIdx].id;
    const existingIdx = newAnswers.findIndex(a => a.questionId === qId);
    
    if (existingIdx >= 0) newAnswers[existingIdx].selectedAnswer = option;
    else newAnswers.push({ questionId: qId, selectedAnswer: option });
    
    setAnswers(newAnswers);

    if (currentIdx < questions.length - 1) {
      setCurrentIdx(i => i + 1);
    } else {
      handleFinish();
    }
  };

  if (!started) {
    return (
      <div className="fixed inset-0 bg-slate-950 text-slate-50 z-[100] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-full max-w-md space-y-8 animate-in zoom-in duration-500">
          <div className="w-32 h-32 bg-red-500/20 text-red-500 rounded-full flex items-center justify-center mx-auto border-2 border-red-500/50 shadow-[0_0_50px_rgba(239,68,68,0.3)]">
            <Shield className="w-16 h-16" />
          </div>
          
          <div>
            <h1 className="text-4xl font-black text-red-500 tracking-tight uppercase mb-2">Hard Round</h1>
            <p className="text-slate-400 font-bold text-lg">USMLE Questions — Board Level</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-left space-y-4">
            <div className="flex items-center gap-3 font-bold text-slate-300">
              <Timer className="text-red-400" /> 2:00 Total Time
            </div>
            <div className="flex items-center gap-3 font-bold text-slate-300">
              <Shield className="text-red-400" /> 10 Very Hard Questions
            </div>
            <div className="flex items-center gap-3 font-bold text-slate-300">
              <span className="text-red-400">2x</span> Double XP Reward
            </div>
          </div>

          <Button 
            size="lg" 
            className="w-full h-16 text-xl font-black bg-red-600 hover:bg-red-700 text-white rounded-2xl border-b-[6px] border-red-800 active:border-b-0 active:translate-y-[6px] transition-all uppercase tracking-wider"
            onClick={() => setStarted(true)}
          >
            START THE CHALLENGE
          </Button>

          <Button variant="ghost" className="text-slate-500 hover:text-slate-300 font-bold" onClick={() => setLocation('/')}>
            Cancel
          </Button>
        </div>
      </div>
    );
  }

  if (finished) {
    return (
      <div className="fixed inset-0 bg-slate-950 text-slate-50 z-[100] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-full max-w-lg space-y-8 animate-in fade-in duration-500">
          <h1 className="text-4xl font-black text-red-500 uppercase">Round Complete!</h1>
          
          {result ? (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-6">
              <div className="text-7xl font-black text-white">{result.score}%</div>
              <p className="text-slate-400 font-bold text-lg">{result.correctCount} out of {result.totalQuestions} correct</p>
              
              <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4">
                <div className="text-red-500 font-bold uppercase text-xs mb-1">XP Earned</div>
                <div className="text-3xl font-black text-red-400">+{result.xpEarned}</div>
              </div>
            </div>
          ) : (
            <div className="animate-pulse font-bold text-slate-500">Calculating result...</div>
          )}

          <Button 
            size="lg" 
            className="w-full h-14 text-lg font-bold bg-slate-800 hover:bg-slate-700 text-white rounded-2xl"
            onClick={() => setLocation('/')}
          >
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  if (isLoading || !questions) {
    return <div className="fixed inset-0 bg-slate-950 flex items-center justify-center text-red-500 font-black text-2xl uppercase tracking-widest animate-pulse z-[100]">Loading...</div>;
  }

  const currentQ = questions[currentIdx];
  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;

  return (
    <div className="fixed inset-0 bg-slate-950 text-slate-50 z-[100] flex flex-col font-sans">
      <div className="px-6 py-6 flex items-center justify-between border-b border-slate-800">
        <div className="font-bold text-slate-400">Question {currentIdx + 1}/10</div>
        <div className={`font-black text-2xl flex items-center gap-2 ${timeLeft < 30 ? 'text-red-500 animate-pulse' : 'text-white'}`}>
          <Timer /> {mins}:{secs.toString().padStart(2, '0')}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 flex flex-col w-full max-w-3xl mx-auto pb-32">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 mb-8 shadow-2xl relative">
          <div className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-bl-xl rounded-tr-3xl uppercase tracking-widest">
            {currentQ.category}
          </div>
          <h2 className="text-2xl md:text-3xl font-bold leading-relaxed text-slate-200">
            {currentQ.questionText}
          </h2>
        </div>

        <div className="space-y-4">
          {shuffledOptions.map((option, idx) => (
            <button
              key={idx}
              onClick={() => handleSelect(option)}
              className="w-full text-left p-6 rounded-2xl text-lg font-bold bg-slate-800 border-2 border-slate-700 hover:bg-slate-700 hover:border-slate-500 transition-all text-slate-200 active:scale-[0.98]"
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
