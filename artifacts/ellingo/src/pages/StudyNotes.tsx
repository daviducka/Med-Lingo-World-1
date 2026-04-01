import React, { useState } from "react";
import { useListCourses, useListLessons, useGetStudyNotes, useGetUserProfile } from "@workspace/api-client-react";
import { BookOpen, Lightbulb, Star, Stethoscope, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

function StudyNoteContent({ lessonId }: { lessonId: number }) {
  const { data: notes, isLoading, isError } = useGetStudyNotes(lessonId, {
    query: { queryKey: [`/api/study-notes/${lessonId}`] }
  });

  if (isLoading) return (
    <div className="flex items-center justify-center py-16">
      <div className="text-center">
        <div className="text-4xl mb-3 animate-bounce">📚</div>
        <p className="font-bold text-muted-foreground">Duke ngarkuar shënimet...</p>
      </div>
    </div>
  );
  if (isError || !notes) return (
    <div className="text-center py-16">
      <div className="text-4xl mb-3">📭</div>
      <p className="font-bold text-muted-foreground">Nuk ka shënime për këtë mësim.</p>
    </div>
  );

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gradient" style={{ fontFamily: 'Fredoka One, sans-serif' }}>
        {notes.title}
      </h2>

      {/* Main Content */}
      <div className="bg-card border rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="w-5 h-5 text-primary" />
          <h3 className="font-bold text-lg text-primary" style={{ fontFamily: 'Fredoka One, sans-serif' }}>Hyrja</h3>
        </div>
        <p className="text-foreground leading-relaxed font-medium text-base">{notes.content}</p>
      </div>

      {/* Key Points */}
      {notes.keyPoints.length > 0 && (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Star className="w-5 h-5 text-blue-600 fill-blue-600" />
            <h3 className="font-bold text-lg text-blue-700" style={{ fontFamily: 'Fredoka One, sans-serif' }}>Pikat Kryesore</h3>
          </div>
          <ul className="space-y-3">
            {notes.keyPoints.map((point, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="mt-0.5 flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">{i + 1}</span>
                <span className="text-blue-900 font-semibold leading-relaxed">{point}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Mnemonics */}
      {notes.mnemonics.length > 0 && (
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="w-5 h-5 text-amber-600 fill-amber-200" />
            <h3 className="font-bold text-lg text-amber-700" style={{ fontFamily: 'Fredoka One, sans-serif' }}>Mnemonikë & Shkurtesa</h3>
          </div>
          <ul className="space-y-3">
            {notes.mnemonics.map((m, i) => (
              <li key={i} className="bg-white/70 rounded-xl px-4 py-3 font-bold text-amber-800 border border-amber-200">
                💡 {m}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Clinical Pearls */}
      {notes.clinicalPearls.length > 0 && (
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Stethoscope className="w-5 h-5 text-green-600" />
            <h3 className="font-bold text-lg text-green-700" style={{ fontFamily: 'Fredoka One, sans-serif' }}>Perla Klinike 💎</h3>
          </div>
          <ul className="space-y-3">
            {notes.clinicalPearls.map((pearl, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="text-green-600 font-bold text-lg mt-0.5">◆</span>
                <span className="text-green-900 font-semibold leading-relaxed">{pearl}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function LessonsForCourse({ courseId }: { courseId: number }) {
  const [selectedLessonId, setSelectedLessonId] = useState<number | null>(null);
  const { data: lessons, isLoading } = useListLessons(courseId, {
    query: { queryKey: [`/api/courses/${courseId}/lessons`] }
  });

  if (isLoading) return <div className="py-8 text-center font-bold text-muted-foreground animate-pulse">Duke ngarkuar mësimet...</div>;
  if (!lessons?.length) return <div className="py-8 text-center font-bold text-muted-foreground">Nuk ka mësime.</div>;

  if (selectedLessonId) {
    return (
      <div>
        <Button variant="ghost" size="sm" onClick={() => setSelectedLessonId(null)} className="mb-4 font-bold gap-1">
          ← Kthehu te lista
        </Button>
        <StudyNoteContent lessonId={selectedLessonId} />
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {lessons.map((lesson) => (
        <button
          key={lesson.id}
          onClick={() => setSelectedLessonId(lesson.id)}
          className="w-full flex items-center justify-between p-4 rounded-xl border bg-card hover:bg-primary/5 hover:border-primary/30 transition-all duration-200 text-left group"
        >
          <div>
            <p className="font-bold text-base text-foreground group-hover:text-primary transition-colors">{lesson.title}</p>
            <p className="text-sm text-muted-foreground font-semibold">{lesson.description}</p>
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
        </button>
      ))}
    </div>
  );
}

export default function StudyNotes() {
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
  const { data: profile } = useGetUserProfile();
  const lang = profile?.selectedLanguage ?? "sq";
  const { data: courses } = useListCourses(
    { language: lang },
    { query: { queryKey: [`/api/courses?language=${lang}`] } }
  );

  const selectedCourse = courses?.find(c => c.id === selectedCourseId);

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold shimmer-text mb-2" style={{ fontFamily: 'Fredoka One, sans-serif' }}>
          Shënime Studimi 📖
        </h1>
        <p className="text-muted-foreground text-lg font-semibold">
          Material studimi me pika kryesore, mnemonikë dhe perla klinike
        </p>
      </div>

      {!selectedCourseId ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {courses?.map(course => (
            <button
              key={course.id}
              onClick={() => setSelectedCourseId(course.id)}
              className="group p-6 rounded-2xl border-2 bg-card hover:shadow-lg transition-all duration-300 text-left"
              style={{ borderColor: `${course.color}40` }}
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">{course.iconEmoji}</span>
                <div>
                  <h3 className="font-bold text-base text-foreground group-hover:text-primary transition-colors" style={{ fontFamily: 'Fredoka One, sans-serif' }}>
                    {course.title}
                  </h3>
                  <Badge variant="outline" className="text-xs font-bold mt-1" style={{ borderColor: course.color, color: course.color }}>
                    {course.category}
                  </Badge>
                </div>
              </div>
              <p className="text-sm text-muted-foreground font-medium line-clamp-2">{course.description}</p>
            </button>
          ))}
        </div>
      ) : (
        <div>
          <div className="flex items-center gap-3 mb-6">
            <Button variant="ghost" size="sm" onClick={() => setSelectedCourseId(null)} className="font-bold gap-1">
              ← Të gjitha lëndët
            </Button>
            <span className="text-2xl">{selectedCourse?.iconEmoji}</span>
            <h2 className="text-2xl font-bold" style={{ fontFamily: 'Fredoka One, sans-serif' }}>{selectedCourse?.title}</h2>
          </div>
          <LessonsForCourse courseId={selectedCourseId} />
        </div>
      )}
    </div>
  );
}
