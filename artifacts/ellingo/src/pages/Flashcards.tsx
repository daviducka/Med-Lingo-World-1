import React, { useState } from "react";
import { useLocation } from "wouter";
import { useListFlashcards, useRecordFlashcardFlip, useListCourses, useGetUserProfile } from "@workspace/api-client-react";
import { ChevronLeft, ChevronRight, RotateCcw, ThumbsUp, ThumbsDown, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function Flashcards() {
  const [, setLocation] = useLocation();
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [sessionStats, setSessionStats] = useState({ known: 0, unknown: 0 });
  const [completed, setCompleted] = useState(false);

  const { data: profile } = useGetUserProfile();
  const lang = profile?.selectedLanguage ?? "en";
  const { data: courses } = useListCourses(
    { language: lang },
    { query: { queryKey: [`/api/courses?language=${lang}`] } }
  );
  const { data: flashcards, isLoading } = useListFlashcards(
    selectedCourseId ? { courseId: selectedCourseId } : {},
    { query: { queryKey: [`/api/flashcards?courseId=${selectedCourseId}`] } }
  );
  const flipMutation = useRecordFlashcardFlip();

  const cards = flashcards ?? [];
  const currentCard = cards[currentIndex];
  const progress = cards.length > 0 ? ((currentIndex) / cards.length) * 100 : 0;

  const handleFlip = () => setIsFlipped(!isFlipped);

  const handleKnown = async (known: boolean) => {
    if (!currentCard) return;
    flipMutation.mutate({ flashcardId: currentCard.id, data: { known } });
    setSessionStats(prev => ({
      known: known ? prev.known + 1 : prev.known,
      unknown: !known ? prev.unknown + 1 : prev.unknown,
    }));
    if (currentIndex < cards.length - 1) {
      setIsFlipped(false);
      setTimeout(() => setCurrentIndex(prev => prev + 1), 200);
    } else {
      setCompleted(true);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setSessionStats({ known: 0, unknown: 0 });
    setCompleted(false);
  };

  if (!selectedCourseId) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold shimmer-text mb-2" style={{ fontFamily: 'Fredoka One, Nunito, sans-serif' }}>
            Flashcards ✨
          </h1>
          <p className="text-muted-foreground text-lg font-semibold">
            Choose a course to study with flashcards
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {courses?.map(course => (
            <button
              key={course.id}
              onClick={() => setSelectedCourseId(course.id)}
              className="group p-6 rounded-2xl border-2 border-transparent bg-card hover:border-primary hover:shadow-lg transition-all duration-300 text-left"
              style={{ background: `linear-gradient(135deg, ${course.color}15, ${course.color}05)`, borderColor: `${course.color}30` }}
            >
              <div className="flex items-center gap-4">
                <span className="text-4xl">{course.iconEmoji}</span>
                <div>
                  <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors" style={{ fontFamily: 'Fredoka One, sans-serif' }}>
                    {course.title}
                  </h3>
                  <p className="text-muted-foreground text-sm font-semibold">{course.category.toUpperCase()}</p>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                <Brain className="w-4 h-4" />
                <span className="font-semibold">Study flashcards</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4 animate-bounce">🃏</div>
          <p className="text-xl font-bold text-muted-foreground">Loading flashcards...</p>
        </div>
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <div className="max-w-lg mx-auto text-center py-20">
        <div className="text-6xl mb-4">📭</div>
        <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: 'Fredoka One, sans-serif' }}>No flashcards found</h2>
        <p className="text-muted-foreground mb-6 font-semibold">No flashcards have been added for this course yet.</p>
        <Button onClick={() => setSelectedCourseId(null)} variant="outline">← Back</Button>
      </div>
    );
  }

  if (completed) {
    const total = sessionStats.known + sessionStats.unknown;
    const pct = Math.round((sessionStats.known / total) * 100);
    return (
      <div className="max-w-lg mx-auto text-center py-16">
        <div className="text-7xl mb-6 animate-bounce">🎉</div>
        <h2 className="text-4xl font-bold mb-2 shimmer-text" style={{ fontFamily: 'Fredoka One, sans-serif' }}>
          Session Complete!
        </h2>
        <p className="text-muted-foreground text-lg font-semibold mb-8">
          You studied {total} flashcards
        </p>
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
            <div className="text-3xl font-bold text-green-600" style={{ fontFamily: 'Fredoka One, sans-serif' }}>{sessionStats.known}</div>
            <div className="text-green-700 font-bold mt-1">Known ✓</div>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
            <div className="text-3xl font-bold text-red-600" style={{ fontFamily: 'Fredoka One, sans-serif' }}>{sessionStats.unknown}</div>
            <div className="text-red-700 font-bold mt-1">To Review</div>
          </div>
        </div>
        <div className="mb-8 bg-primary/10 rounded-2xl p-4">
          <div className="text-4xl font-bold text-primary" style={{ fontFamily: 'Fredoka One, sans-serif' }}>{pct}%</div>
          <div className="text-primary font-bold">Session Score</div>
        </div>
        <div className="flex gap-3 justify-center">
          <Button onClick={handleRestart} className="gap-2 font-bold rounded-xl">
            <RotateCcw className="w-4 h-4" /> Restart
          </Button>
          <Button variant="outline" onClick={() => setSelectedCourseId(null)} className="font-bold rounded-xl">
            Another Course
          </Button>
        </div>
      </div>
    );
  }

  const selectedCourse = courses?.find(c => c.id === selectedCourseId);

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" size="sm" onClick={() => setSelectedCourseId(null)} className="gap-1 font-bold">
          <ChevronLeft className="w-4 h-4" /> {selectedCourse?.title}
        </Button>
        <Badge variant="secondary" className="font-bold text-sm px-3 py-1">
          {currentIndex + 1} / {cards.length}
        </Badge>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-muted rounded-full h-3 mb-8 overflow-hidden">
        <div
          className="h-3 rounded-full transition-all duration-500"
          style={{ width: `${progress}%`, background: 'linear-gradient(90deg, hsl(258 90% 60%), hsl(180 100% 42%))' }}
        />
      </div>

      {/* Session stats */}
      <div className="flex justify-end gap-3 mb-4 text-sm font-bold">
        <span className="text-green-600 bg-green-50 px-3 py-1 rounded-full">✓ {sessionStats.known}</span>
        <span className="text-red-500 bg-red-50 px-3 py-1 rounded-full">✗ {sessionStats.unknown}</span>
      </div>

      {/* Flashcard */}
      <div className="flip-card w-full h-72 mb-6 cursor-pointer" onClick={handleFlip}>
        <div className={`flip-card-inner w-full h-full ${isFlipped ? 'flipped' : ''}`}>
          {/* Front */}
          <div className="flip-card-front w-full h-full rounded-3xl shadow-xl border-2 border-primary/20 bg-gradient-to-br from-primary to-purple-700 flex flex-col items-center justify-center p-8 text-white">
            <div className="text-xs font-bold uppercase tracking-widest opacity-70 mb-4 bg-white/20 px-3 py-1 rounded-full">
              Click to flip
            </div>
            <p className="text-2xl font-bold text-center leading-relaxed" style={{ fontFamily: 'Fredoka One, sans-serif' }}>
              {currentCard?.front}
            </p>
            <div className="mt-4">
              <Badge variant="secondary" className="bg-white/20 text-white border-0 font-bold">
                {currentCard?.category}
              </Badge>
            </div>
          </div>

          {/* Back */}
          <div className="flip-card-back w-full h-full rounded-3xl shadow-xl border-2 border-green-200 bg-gradient-to-br from-emerald-500 to-teal-600 flex flex-col items-center justify-center p-8 text-white">
            <div className="text-xs font-bold uppercase tracking-widest opacity-70 mb-4 bg-white/20 px-3 py-1 rounded-full">
              Answer
            </div>
            <p className="text-xl font-bold text-center leading-relaxed" style={{ fontFamily: 'Nunito, sans-serif' }}>
              {currentCard?.back}
            </p>
          </div>
        </div>
      </div>

      {/* Flip hint */}
      {!isFlipped && (
        <p className="text-center text-muted-foreground text-sm font-semibold mb-6 animate-pulse">
          👆 Click the card to see the answer
        </p>
      )}

      {/* Action buttons (only shown after flip) */}
      {isFlipped && (
        <div className="flex gap-4 justify-center">
          <Button
            onClick={() => handleKnown(false)}
            variant="outline"
            className="flex-1 max-w-[180px] h-14 rounded-2xl border-2 border-red-300 text-red-500 hover:bg-red-50 font-bold text-base gap-2"
          >
            <ThumbsDown className="w-5 h-5" />
            Don't know
          </Button>
          <Button
            onClick={() => handleKnown(true)}
            className="flex-1 max-w-[180px] h-14 rounded-2xl font-bold text-base gap-2 bg-green-500 hover:bg-green-600"
          >
            <ThumbsUp className="w-5 h-5" />
            Know it! ✓
          </Button>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between items-center mt-6 pt-4 border-t">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => { setCurrentIndex(p => Math.max(0, p - 1)); setIsFlipped(false); }}
          disabled={currentIndex === 0}
          className="font-bold gap-1"
        >
          <ChevronLeft className="w-4 h-4" /> Previous
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            if (currentIndex < cards.length - 1) { setCurrentIndex(p => p + 1); setIsFlipped(false); }
            else setCompleted(true);
          }}
          className="font-bold gap-1"
        >
          Next <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
