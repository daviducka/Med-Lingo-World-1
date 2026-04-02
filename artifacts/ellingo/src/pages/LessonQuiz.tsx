import React, { useState, useEffect, useRef, useMemo } from "react";
import { useRoute, useLocation } from "wouter";
import { useGetLesson, useCompleteLesson } from "@workspace/api-client-react";
import { X, Heart, Check, Play } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function LessonQuiz() {
  const [, params] = useRoute("/lesson/:lessonId");
  const [, setLocation] = useLocation();
  const lessonId = params?.lessonId ? parseInt(params.lessonId) : 0;

  const { data: lesson, isLoading } = useGetLesson(lessonId, { query: { enabled: !!lessonId, queryKey: [`/api/lessons/${lessonId}`] } });
  const completeLessonMutation = useCompleteLesson();

  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [answerState, setAnswerState] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [hearts, setHearts] = useState(5);
  const [correctCount, setCorrectCount] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [xpEarned, setXpEarned] = useState(0);

  const startTimeRef = useRef(Date.now());

  const questions = lesson?.questions || [];
  const currentQ = questions[currentQIndex];

  // Shuffle options once per question change
  const shuffledOptions = useMemo(() => {
    if (!currentQ?.options) return [];
    return shuffleArray(currentQ.options);
  }, [currentQIndex, lesson?.id]);

  if (isLoading || !lesson) return <div className="min-h-screen bg-background flex items-center justify-center font-bold text-xl animate-pulse">Duke ngarkuar...</div>;
  const progress = ((currentQIndex) / questions.length) * 100;

  const handleCheck = () => {
    if (!selectedOption || !currentQ) return;

    if (selectedOption === currentQ.correctAnswer) {
      setAnswerState('correct');
      setCorrectCount(prev => prev + 1);
    } else {
      setAnswerState('wrong');
      setHearts(prev => Math.max(0, prev - 1));
    }
  };

  const handleNext = () => {
    setAnswerState('idle');
    setSelectedOption(null);

    if (currentQIndex < questions.length - 1) {
      if (hearts === 0) {
        // Handle failure
        setLocation('/learn');
        return;
      }
      setCurrentQIndex(prev => prev + 1);
    } else {
      // Finish lesson
      const timeTaken = Math.floor((Date.now() - startTimeRef.current) / 1000);
      completeLessonMutation.mutate({
        lessonId,
        data: {
          score: Math.round((correctCount / questions.length) * 100),
          correctAnswers: correctCount,
          totalQuestions: questions.length,
          timeTakenSeconds: timeTaken
        }
      }, {
        onSuccess: (res) => {
          setXpEarned(res.xpEarned);
          setShowCelebration(true);
        },
        onError: () => {
          // Fallback if mutation fails so user isn't stuck
          setXpEarned(lesson.xpReward);
          setShowCelebration(true);
        }
      });
    }
  };

  if (showCelebration) {
    return (
      <div className="fixed inset-0 bg-background z-[100] flex flex-col items-center justify-center p-6 text-center animate-in zoom-in duration-500">
        <div className="w-full max-w-md space-y-8">
          <h1 className="text-4xl font-black text-amber-500 drop-shadow-sm">Mësimi Përfundoi! 🎉</h1>
          
          <div className="bg-card border-2 p-8 rounded-3xl shadow-xl space-y-6">
            <div className="flex justify-center mb-4">
              <div className="w-32 h-32 bg-amber-100 rounded-full flex items-center justify-center border-4 border-amber-400 text-6xl shadow-inner">
                🏆
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-amber-50 border-2 border-amber-200 p-4 rounded-2xl">
                <div className="text-amber-600 font-bold uppercase text-xs mb-1">XP Fituar</div>
                <div className="text-3xl font-black text-amber-500">+{xpEarned}</div>
              </div>
              <div className="bg-green-50 border-2 border-green-200 p-4 rounded-2xl">
                <div className="text-green-600 font-bold uppercase text-xs mb-1">Saktësia</div>
                <div className="text-3xl font-black text-green-500">{Math.round((correctCount/questions.length)*100)}%</div>
              </div>
            </div>
          </div>
          
          <Button size="lg" className="w-full h-14 text-lg font-bold rounded-2xl border-b-[6px] active:border-b-0 active:translate-y-[6px] transition-all" onClick={() => setLocation(`/learn/${lesson.courseId}`)}>
            Vazhdo
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-background z-[100] flex flex-col font-sans">
      {/* Top Bar */}
      <div className="px-4 md:px-8 py-6 flex items-center gap-4 md:gap-8 max-w-5xl mx-auto w-full">
        <button onClick={() => setLocation(`/learn/${lesson.courseId}`)} className="text-muted-foreground hover:text-foreground">
          <X className="w-8 h-8" />
        </button>
        <div className="flex-1 bg-muted h-4 rounded-full overflow-hidden">
          <div className="bg-primary h-full transition-all duration-500 rounded-full" style={{ width: `${progress}%` }} />
        </div>
        <div className="flex items-center gap-2 text-destructive font-bold text-xl">
          <Heart className="w-6 h-6 fill-current" /> {hearts}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto px-4 flex flex-col w-full max-w-3xl mx-auto pb-40">
        <div className="flex-1 flex flex-col justify-center animate-in slide-in-from-right duration-300" key={currentQIndex}>
          <h2 className="text-3xl md:text-4xl font-black mb-10 text-foreground leading-tight">
            {currentQ?.questionText}
          </h2>

          <div className="space-y-4">
            {shuffledOptions.map((option, idx) => {
              const isSelected = selectedOption === option;
              
              // Only show colors if not in 'idle' state, AND this option is either selected or is the correct answer (if wrong was selected)
              let itemClass = "bg-card border-2 hover:bg-muted text-foreground";
              
              if (answerState === 'correct' && isSelected) {
                itemClass = "bg-success/10 border-success text-success";
              } else if (answerState === 'wrong' && isSelected) {
                itemClass = "bg-destructive/10 border-destructive text-destructive";
              } else if (answerState === 'wrong' && option === currentQ.correctAnswer) {
                itemClass = "bg-success/10 border-success text-success";
              } else if (isSelected && answerState === 'idle') {
                itemClass = "bg-primary/10 border-primary text-primary border-b-4 translate-y-[-2px]";
              }

              return (
                <button
                  key={idx}
                  disabled={answerState !== 'idle'}
                  onClick={() => setSelectedOption(option)}
                  className={`w-full text-left p-4 md:p-6 rounded-2xl text-lg md:text-xl font-bold transition-all border-b-[4px] active:border-b-[2px] active:translate-y-[2px] ${itemClass}`}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className={`fixed bottom-0 left-0 w-full border-t-2 transition-colors duration-300 ${answerState === 'correct' ? 'bg-success/10 border-success/20' : answerState === 'wrong' ? 'bg-destructive/10 border-destructive/20' : 'bg-card border-border'}`}>
        <div className="max-w-5xl mx-auto p-4 md:p-8 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Feedback area */}
          <div className="flex-1">
            {answerState === 'correct' && (
              <div className="animate-in slide-in-from-bottom flex items-start gap-4">
                <div className="bg-success text-white p-2 rounded-full hidden md:block">
                  <Check className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-success">Shkëlqyeshëm!</h3>
                  <p className="text-success/80 font-bold mt-1 max-w-xl">{currentQ?.explanation}</p>
                </div>
              </div>
            )}
            {answerState === 'wrong' && (
              <div className="animate-in slide-in-from-bottom flex items-start gap-4">
                <div className="bg-destructive text-white p-2 rounded-full hidden md:block">
                  <X className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-destructive">Përgjigja e saktë:</h3>
                  <p className="font-bold text-destructive mt-1 text-lg">{currentQ?.correctAnswer}</p>
                  <p className="text-destructive/80 font-bold mt-2 max-w-xl text-sm">{currentQ?.explanation}</p>
                </div>
              </div>
            )}
          </div>

          <Button 
            size="lg" 
            className={`w-full md:w-auto min-w-[200px] h-14 text-lg font-black rounded-2xl border-b-[6px] active:border-b-0 active:translate-y-[6px] transition-all uppercase tracking-wide
              ${answerState === 'idle' ? 'bg-primary hover:bg-primary/90' : 
                answerState === 'correct' ? 'bg-success hover:bg-success/90 border-success-foreground/20' : 
                'bg-destructive hover:bg-destructive/90 border-destructive-foreground/20'}`}
            disabled={!selectedOption && answerState === 'idle'}
            onClick={answerState === 'idle' ? handleCheck : handleNext}
          >
            {answerState === 'idle' ? 'Kontrollo' : 'Vazhdo'}
          </Button>

        </div>
      </div>
    </div>
  );
}
