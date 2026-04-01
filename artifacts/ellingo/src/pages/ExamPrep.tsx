import React, { useState } from "react";
import { useGetExamPrepQuestions, useSubmitExamPrep } from "@workspace/api-client-react";
import { GraduationCap, Clock, Trophy, CheckCircle, XCircle, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const SUBJECTS = [
  { key: "anatomy", label: "Anatomi", emoji: "🦴", color: "#ef4444" },
  { key: "pharmacology", label: "Farmakologji", emoji: "💊", color: "#3b82f6" },
  { key: "physiology", label: "Fiziologji", emoji: "❤️", color: "#22c55e" },
  { key: "pathology", label: "Patologji", emoji: "🔬", color: "#a855f7" },
  { key: "microbiology", label: "Mikrobiologji", emoji: "🦠", color: "#f97316" },
  { key: "biochemistry", label: "Biokimi", emoji: "⚗️", color: "#eab308" },
  { key: "biology", label: "Biologji", emoji: "🌿", color: "#10b981" },
  { key: "ecology", label: "Ekologji", emoji: "🌍", color: "#06b6d4" },
  { key: "", label: "Të gjitha lëndët", emoji: "🎓", color: "#6366f1" },
];

type Phase = "select" | "quiz" | "result";

export default function ExamPrep() {
  const [phase, setPhase] = useState<Phase>("select");
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [answerState, setAnswerState] = useState<"idle" | "correct" | "wrong">("idle");
  const [answers, setAnswers] = useState<Array<{ questionId: number; selectedAnswer: string }>>([]);
  const [startTime] = useState(Date.now());

  const { data: questions, isLoading, refetch } = useGetExamPrepQuestions(
    { subject: selectedSubject || undefined, count: 30 },
    { query: { queryKey: [`/api/exam-prep/questions?subject=${selectedSubject}`], enabled: phase === "quiz" } }
  );
  const submitMutation = useSubmitExamPrep();

  const currentQ = questions?.[currentQIndex];
  const progress = questions?.length ? ((currentQIndex) / questions.length) * 100 : 0;

  const handleStartExam = async (subject: string) => {
    setSelectedSubject(subject);
    setPhase("quiz");
    setCurrentQIndex(0);
    setAnswers([]);
  };

  const handleSelect = (option: string) => {
    if (answerState !== "idle") return;
    setSelectedOption(option);
  };

  const handleCheck = () => {
    if (!selectedOption || !currentQ) return;
    const isCorrect = selectedOption === currentQ.correctAnswer;
    setAnswerState(isCorrect ? "correct" : "wrong");
  };

  const handleNext = async () => {
    if (!currentQ || !selectedOption) return;
    const newAnswers = [...answers, { questionId: currentQ.id, selectedAnswer: selectedOption }];
    setAnswers(newAnswers);
    setAnswerState("idle");
    setSelectedOption(null);

    if (currentQIndex < (questions?.length ?? 0) - 1) {
      setCurrentQIndex(p => p + 1);
    } else {
      const timeTaken = Math.round((Date.now() - startTime) / 1000);
      submitMutation.mutate(
        { data: { answers: newAnswers, timeTakenSeconds: timeTaken } },
        { onSuccess: () => setPhase("result") }
      );
    }
  };

  if (phase === "select") {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center">
              <GraduationCap className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-4xl font-bold shimmer-text" style={{ fontFamily: 'Fredoka One, sans-serif' }}>
              Përgatitja për Provim
            </h1>
          </div>
          <p className="text-muted-foreground text-lg font-semibold ml-1">
            30 pyetje • Stil USMLE • Shpjegim për çdo përgjigje
          </p>
        </div>

        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200 rounded-2xl p-5 mb-8">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-indigo-700" style={{ fontFamily: 'Fredoka One, sans-serif' }}>30</div>
              <div className="text-xs font-bold text-indigo-600 uppercase tracking-wide">Pyetje</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-indigo-700" style={{ fontFamily: 'Fredoka One, sans-serif' }}>+4 XP</div>
              <div className="text-xs font-bold text-indigo-600 uppercase tracking-wide">Për çdo të saktë</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-indigo-700" style={{ fontFamily: 'Fredoka One, sans-serif' }}>∞</div>
              <div className="text-xs font-bold text-indigo-600 uppercase tracking-wide">Tentativa</div>
            </div>
          </div>
        </div>

        <h2 className="font-bold text-xl mb-4" style={{ fontFamily: 'Fredoka One, sans-serif' }}>Zgjidhni Lëndën:</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {SUBJECTS.map(subject => (
            <button
              key={subject.key}
              onClick={() => handleStartExam(subject.key)}
              className="group p-5 rounded-2xl border-2 bg-card hover:shadow-lg transition-all duration-300 text-left flex items-center gap-4"
              style={{ borderColor: `${subject.color}30` }}
            >
              <span className="text-3xl">{subject.emoji}</span>
              <div className="flex-1">
                <p className="font-bold text-base group-hover:text-primary transition-colors" style={{ fontFamily: 'Fredoka One, sans-serif' }}>
                  {subject.label}
                </p>
                <p className="text-xs text-muted-foreground font-semibold">30 pyetje stili provimi</p>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (phase === "quiz") {
    if (isLoading || !questions) {
      return (
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <div className="text-5xl mb-4 animate-spin">⚙️</div>
            <p className="text-xl font-bold text-muted-foreground">Duke gjeneruar provimin...</p>
          </div>
        </div>
      );
    }

    return (
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-primary" />
            <span className="font-bold text-primary" style={{ fontFamily: 'Fredoka One, sans-serif' }}>Provimi Mjekësor</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground font-bold">
            <Clock className="w-4 h-4" />
            <span>{currentQIndex + 1} / {questions.length}</span>
          </div>
        </div>

        <Progress value={progress} className="h-3 mb-6 rounded-full" />

        <div className="bg-card border rounded-2xl p-6 mb-4 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Badge variant="outline" className="text-xs font-bold capitalize">{currentQ?.category}</Badge>
            <Badge
              variant="outline"
              className="text-xs font-bold"
              style={{
                borderColor: currentQ?.difficulty === "easy" ? "#22c55e" : currentQ?.difficulty === "hard" || currentQ?.difficulty === "board_level" ? "#ef4444" : "#f97316",
                color: currentQ?.difficulty === "easy" ? "#22c55e" : currentQ?.difficulty === "hard" || currentQ?.difficulty === "board_level" ? "#ef4444" : "#f97316",
              }}
            >
              {currentQ?.difficulty === "board_level" ? "Board Level" : currentQ?.difficulty}
            </Badge>
          </div>
          <p className="text-lg font-bold text-foreground leading-relaxed" style={{ fontFamily: 'Nunito, sans-serif' }}>
            {currentQ?.questionText}
          </p>
        </div>

        <div className="space-y-3 mb-6">
          {currentQ?.options.map((opt, idx) => {
            const letter = ["A", "B", "C", "D"][idx];
            let className = "w-full p-4 rounded-2xl border-2 text-left flex items-center gap-4 font-bold transition-all duration-200 ";
            if (answerState === "idle") {
              className += selectedOption === opt
                ? "border-primary bg-primary/10 text-primary"
                : "border-border bg-card hover:border-primary/40 hover:bg-primary/5";
            } else if (opt === currentQ.correctAnswer) {
              className += "border-green-500 bg-green-50 text-green-700";
            } else if (selectedOption === opt && opt !== currentQ.correctAnswer) {
              className += "border-red-400 bg-red-50 text-red-600";
            } else {
              className += "border-border bg-card opacity-50";
            }

            return (
              <button key={idx} className={className} onClick={() => handleSelect(opt)} disabled={answerState !== "idle"}>
                <span className="w-8 h-8 flex-shrink-0 rounded-xl border-2 border-current flex items-center justify-center text-sm">{letter}</span>
                <span className="flex-1 text-left">{opt}</span>
                {answerState !== "idle" && opt === currentQ.correctAnswer && <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />}
                {answerState !== "idle" && selectedOption === opt && opt !== currentQ.correctAnswer && <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />}
              </button>
            );
          })}
        </div>

        {/* Explanation */}
        {answerState !== "idle" && (
          <div className={`rounded-2xl p-4 mb-4 border-2 font-semibold text-sm ${answerState === "correct" ? "bg-green-50 border-green-200 text-green-800" : "bg-red-50 border-red-200 text-red-800"}`}>
            <p className="font-bold mb-1">{answerState === "correct" ? "✅ Saktë!" : "❌ Jo saktë"}</p>
            <p>{currentQ?.explanation}</p>
          </div>
        )}

        <div className="flex justify-end">
          {answerState === "idle" ? (
            <Button onClick={handleCheck} disabled={!selectedOption} className="px-8 rounded-2xl font-bold text-base h-12">
              Kontrollo →
            </Button>
          ) : (
            <Button onClick={handleNext} className="px-8 rounded-2xl font-bold text-base h-12 gap-2">
              {currentQIndex < questions.length - 1 ? "Pyetja tjetër" : "Përfundo provimin"} →
            </Button>
          )}
        </div>
      </div>
    );
  }

  // Result phase
  const result = submitMutation.data;
  if (!result) return <div className="text-center py-20 font-bold">Duke ngarkuar rezultatin...</div>;

  const percentage = result.score;
  const grade = percentage >= 80 ? "Shkëlqyer" : percentage >= 60 ? "Mirë" : "Duhet Përsëritje";
  const gradeEmoji = percentage >= 80 ? "🏆" : percentage >= 60 ? "⭐" : "📚";

  return (
    <div className="max-w-lg mx-auto text-center py-12">
      <div className="text-7xl mb-4 animate-bounce">{gradeEmoji}</div>
      <h2 className="text-4xl font-bold mb-1 shimmer-text" style={{ fontFamily: 'Fredoka One, sans-serif' }}>
        {grade}!
      </h2>
      <p className="text-muted-foreground font-semibold mb-8">Provimi i Mjekësisë u kompletua</p>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-card border rounded-2xl p-5">
          <div className="text-3xl font-bold text-primary" style={{ fontFamily: 'Fredoka One, sans-serif' }}>{percentage}%</div>
          <div className="text-xs font-bold text-muted-foreground uppercase tracking-wide mt-1">Rezultati</div>
        </div>
        <div className="bg-card border rounded-2xl p-5">
          <div className="text-3xl font-bold text-green-600" style={{ fontFamily: 'Fredoka One, sans-serif' }}>{result.correctCount}</div>
          <div className="text-xs font-bold text-muted-foreground uppercase tracking-wide mt-1">Saktë</div>
        </div>
        <div className="bg-card border rounded-2xl p-5">
          <div className="text-3xl font-bold text-amber-500" style={{ fontFamily: 'Fredoka One, sans-serif' }}>+{result.xpEarned}</div>
          <div className="text-xs font-bold text-muted-foreground uppercase tracking-wide mt-1">XP fituar</div>
        </div>
      </div>

      <div className="flex gap-3 justify-center">
        <Button onClick={() => { setPhase("select"); setAnswers([]); }} className="gap-2 rounded-xl font-bold">
          <GraduationCap className="w-4 h-4" /> Provim i ri
        </Button>
      </div>
    </div>
  );
}
