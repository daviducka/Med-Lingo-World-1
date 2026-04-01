import React from "react";
import { Link } from "wouter";
import { useGetUserProfile, useGetUserStats, useListCourses } from "@workspace/api-client-react";
import { Flame, Target, ChevronRight, Shield, BookOpen, Layers } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  const { data: profile, isLoading: profileLoading } = useGetUserProfile();
  const { data: stats, isLoading: statsLoading } = useGetUserStats();
  const lang = profile?.selectedLanguage ?? "sq";

  const { data: courses, isLoading: coursesLoading } = useListCourses(
    { language: lang },
    { query: { queryKey: [`/api/courses?language=${lang}`] } }
  );

  if (profileLoading || statsLoading || coursesLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="w-full h-32 rounded-2xl" />
        <Skeleton className="w-full h-64 rounded-2xl" />
        <Skeleton className="w-full h-40 rounded-2xl" />
      </div>
    );
  }

  const featuredCourses = courses?.slice(0, 3) || [];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* Header */}
      <header className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-primary/20 text-primary flex items-center justify-center text-2xl font-bold border-4 border-primary/10">
          {profile?.displayName?.charAt(0)?.toUpperCase() || "M"}
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight" style={{ fontFamily: 'Fredoka One, sans-serif' }}>
            Mirë se vjen, {profile?.displayName}! 👋
          </h1>
          <p className="text-muted-foreground font-semibold">Sfida jote e sotme mjekësore pret.</p>
        </div>
      </header>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-card border-2 border-b-4 rounded-2xl p-4 text-center">
          <Flame className="w-6 h-6 text-orange-500 mx-auto mb-1" />
          <p className="text-2xl font-bold">{stats?.streak ?? 0}</p>
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Ditë radhazi</p>
        </div>
        <div className="bg-card border-2 border-b-4 rounded-2xl p-4 text-center border-primary/40">
          <Target className="w-6 h-6 text-primary mx-auto mb-1" />
          <p className="text-2xl font-bold text-primary">{stats?.totalXp ?? 0}</p>
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide">XP Total</p>
        </div>
        <div className="bg-card border-2 border-b-4 rounded-2xl p-4 text-center">
          <BookOpen className="w-6 h-6 text-green-500 mx-auto mb-1" />
          <p className="text-2xl font-bold">{stats?.lessonsCompleted ?? 0}</p>
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Mësime</p>
        </div>
      </div>

      {/* Daily Challenge Card */}
      <section className="bg-primary text-primary-foreground rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
        <div className="absolute -left-8 -bottom-8 w-40 h-40 bg-black/10 rounded-full blur-3xl" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 bg-white/20 px-3 py-1 rounded-full text-sm font-bold backdrop-blur-sm">
              <Target className="w-4 h-4" /> Qëllimi i Ditës
            </div>
            <h2 className="text-2xl md:text-3xl font-black" style={{ fontFamily: 'Fredoka One, sans-serif' }}>
              Mëso 3 Mësime Sot
            </h2>
            <p className="text-primary-foreground/80 font-medium">Fiton +50 XP bonus kur i kryen të 3.</p>
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="flex-1 md:w-36 bg-black/20 h-3 rounded-full overflow-hidden">
              <div className="bg-white h-full rounded-full" style={{ width: `${Math.min(100, (stats?.lessonsCompleted ?? 0) * 33)}%` }} />
            </div>
            <Link href="/learn" className="bg-white text-primary px-6 py-3 rounded-2xl font-bold hover:bg-white/90 transition-colors shadow-lg active:scale-95 whitespace-nowrap">
              Fillo ▶
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      {featuredCourses.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold" style={{ fontFamily: 'Fredoka One, sans-serif' }}>
              Vazhdo Mësimin 📖
            </h2>
            <Link href="/learn" className="text-primary font-bold hover:underline flex items-center text-sm">
              Të gjitha <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {featuredCourses.map((course) => (
              <Link key={course.id} href={`/learn/${course.id}`} className="block group">
                <div
                  className="bg-card border-2 border-b-4 rounded-2xl p-5 transition-all hover:-translate-y-1 hover:shadow-lg active:translate-y-0 h-full flex flex-col"
                  style={{ borderColor: course.color }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{ backgroundColor: `${course.color}20` }}>
                      {course.iconEmoji}
                    </div>
                    <div>
                      <h3 className="font-bold leading-tight" style={{ fontFamily: 'Fredoka One, sans-serif', color: course.color }}>
                        {course.title}
                      </h3>
                      <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{course.category}</span>
                    </div>
                  </div>

                  <div className="mt-auto pt-3 border-t space-y-1.5">
                    <div className="flex justify-between text-xs font-bold text-muted-foreground">
                      <span>Progresi</span>
                      <span>{course.totalLessons} mësime</span>
                    </div>
                    <div className="w-full bg-muted h-2.5 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: '0%', backgroundColor: course.color }} />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Quick Links */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link href="/flashcards" className="block group">
          <div className="bg-card border-2 border-b-4 border-blue-400 rounded-2xl p-5 flex items-center gap-4 hover:shadow-lg hover:-translate-y-1 transition-all">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-2xl">🃏</div>
            <div>
              <h3 className="font-bold text-lg" style={{ fontFamily: 'Fredoka One, sans-serif' }}>Kartela Flash</h3>
              <p className="text-sm text-muted-foreground font-medium">Rishiko me kartelat Gizmo-style</p>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground ml-auto" />
          </div>
        </Link>

        <Link href="/study-notes" className="block group">
          <div className="bg-card border-2 border-b-4 border-green-400 rounded-2xl p-5 flex items-center gap-4 hover:shadow-lg hover:-translate-y-1 transition-all">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-2xl">📝</div>
            <div>
              <h3 className="font-bold text-lg" style={{ fontFamily: 'Fredoka One, sans-serif' }}>Shënime Studimi</h3>
              <p className="text-sm text-muted-foreground font-medium">Pikat kryesore & mnemonikët</p>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground ml-auto" />
          </div>
        </Link>
      </section>

      {/* Hard Round CTA */}
      <section>
        <Link href="/hard-round" className="block relative overflow-hidden rounded-3xl group">
          <div className="absolute inset-0 bg-gradient-to-r from-destructive to-orange-500" />
          <div className="relative p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 text-white">
            <div className="space-y-2">
              <h2 className="text-2xl md:text-3xl font-black flex items-center gap-2" style={{ fontFamily: 'Fredoka One, sans-serif' }}>
                <Shield className="w-8 h-8" /> Hard Round 🔥
              </h2>
              <p className="font-medium text-white/90 max-w-md">
                Testo njohuritë me pyetje të nivelit USMLE. XP i dyfishtë, pa mëshirë.
              </p>
            </div>
            <button className="bg-white text-destructive px-8 py-4 rounded-2xl font-black text-lg shadow-[0_4px_0_0_rgba(0,0,0,0.3)] active:shadow-none active:translate-y-1 transition-all">
              Hyr në Arenë ⚔️
            </button>
          </div>
        </Link>
      </section>

      {/* Exam Prep CTA */}
      <section>
        <Link href="/exam-prep" className="block relative overflow-hidden rounded-3xl group">
          <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-purple-700" />
          <div className="relative p-6 flex flex-col md:flex-row items-center justify-between gap-4 text-white">
            <div className="space-y-1">
              <h2 className="text-xl font-black flex items-center gap-2" style={{ fontFamily: 'Fredoka One, sans-serif' }}>
                <Layers className="w-6 h-6" /> Përgatitja për Provim 🎓
              </h2>
              <p className="font-medium text-white/80 text-sm">30 pyetje USMLE-style, simulim i plotë.</p>
            </div>
            <button className="bg-white/20 backdrop-blur border-2 border-white/30 text-white px-6 py-3 rounded-2xl font-bold hover:bg-white/30 transition-colors whitespace-nowrap">
              Fillo Provimin →
            </button>
          </div>
        </Link>
      </section>

    </div>
  );
}
