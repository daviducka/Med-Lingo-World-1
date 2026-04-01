import React from "react";
import { Link } from "wouter";
import { useGetUserProfile, useGetUserStats, useListCourses } from "@workspace/api-client-react";
import { Play, Flame, Heart, Target, ChevronRight, Shield } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  const { data: profile, isLoading: profileLoading } = useGetUserProfile();
  const { data: stats, isLoading: statsLoading } = useGetUserStats();
  const { data: courses, isLoading: coursesLoading } = useListCourses();

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
      <header className="flex items-center gap-4">
        {profile?.avatarUrl ? (
          <img src={profile.avatarUrl} alt="Avatar" className="w-16 h-16 rounded-full border-4 border-primary/20 bg-primary/10" />
        ) : (
          <div className="w-16 h-16 rounded-full bg-primary/20 text-primary flex items-center justify-center text-2xl font-bold border-4 border-primary/20">
            {profile?.displayName?.charAt(0) || "U"}
          </div>
        )}
        <div>
          <h1 className="text-3xl font-black tracking-tight">Ready for rounds, {profile?.displayName}?</h1>
          <p className="text-muted-foreground font-medium">Your daily medical challenge awaits.</p>
        </div>
      </header>

      {/* Daily Challenge Card */}
      <section className="bg-primary text-primary-foreground rounded-3xl p-6 shadow-xl relative overflow-hidden group">
        <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
        <div className="absolute -left-8 -bottom-8 w-40 h-40 bg-black/10 rounded-full blur-3xl" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 bg-white/20 px-3 py-1 rounded-full text-sm font-bold backdrop-blur-sm">
              <Target className="w-4 h-4" /> Daily Goal
            </div>
            <h2 className="text-2xl md:text-3xl font-black">Complete 3 Lessons</h2>
            <p className="text-primary-foreground/80 font-medium">Earn +50 XP bonus when completed.</p>
          </div>
          
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="flex-1 md:w-32 bg-black/20 h-4 rounded-full overflow-hidden">
              <div className="bg-white h-full rounded-full w-1/3" />
            </div>
            <span className="font-bold whitespace-nowrap">1 / 3</span>
            <Link href="/learn" className="bg-white text-primary px-6 py-3 rounded-2xl font-bold hover:bg-white/90 transition-colors shadow-lg active:scale-95 ml-2">
              Start
            </Link>
          </div>
        </div>
      </section>

      {/* Jump Back In */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Jump back in</h2>
          <Link href="/learn" className="text-primary font-bold hover:underline flex items-center">
            View all <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {featuredCourses.map((course) => (
            <Link key={course.id} href={`/learn/${course.id}`} className="block group">
              <div className="bg-card border-2 hover:border-primary border-b-4 hover:border-b-primary rounded-2xl p-5 transition-all active:translate-y-1 active:border-b-2 h-full flex flex-col">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-sm" style={{ backgroundColor: `${course.color}20`, color: course.color }}>
                    {course.iconEmoji}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg leading-tight">{course.title}</h3>
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{course.category}</span>
                  </div>
                </div>
                
                <div className="mt-auto pt-4 space-y-2">
                  <div className="flex justify-between text-sm font-bold text-muted-foreground">
                    <span>Progress</span>
                    <span>12%</span>
                  </div>
                  <div className="w-full bg-muted h-3 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-1000" style={{ width: '12%', backgroundColor: course.color }} />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Hard Round CTA */}
      <section>
        <Link href="/hard-round" className="block relative overflow-hidden rounded-3xl group">
          <div className="absolute inset-0 bg-gradient-to-r from-destructive to-orange-500 opacity-90 transition-opacity group-hover:opacity-100" />
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
          <div className="relative p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 text-white">
            <div className="space-y-2">
              <h2 className="text-2xl md:text-3xl font-black flex items-center gap-2">
                <Shield className="w-8 h-8" /> Hard Round
              </h2>
              <p className="font-medium text-white/90 max-w-md">Test your knowledge with USMLE board-level questions. Double XP, no mercy.</p>
            </div>
            <button className="bg-white text-destructive px-8 py-4 rounded-2xl font-black text-lg shadow-[0_4px_0_0_rgba(0,0,0,0.2)] active:shadow-[0_0px_0_0_rgba(0,0,0,0.2)] active:translate-y-1 transition-all">
              Enter the Arena
            </button>
          </div>
        </Link>
      </section>
    </div>
  );
}
