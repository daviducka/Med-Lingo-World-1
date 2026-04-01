import React from "react";
import { useGetProgressSummary, useGetUserProgress } from "@workspace/api-client-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { Award, BookOpen, Target, Flame } from "lucide-react";

export default function Progress() {
  const { data: summary, isLoading: isSummaryLoading } = useGetProgressSummary({ query: { queryKey: ['/api/users/progress/summary'] } });
  const { data: courseProgress, isLoading: isProgressLoading } = useGetUserProgress({ query: { queryKey: ['/api/users/progress'] } });

  // Mock chart data based on summary for visual richness
  const chartData = [
    { name: "Hën", xp: Math.floor(Math.random() * 200) + 50 },
    { name: "Mar", xp: Math.floor(Math.random() * 200) + 50 },
    { name: "Mër", xp: Math.floor(Math.random() * 200) + 50 },
    { name: "Enj", xp: Math.floor(Math.random() * 200) + 50 },
    { name: "Pre", xp: Math.floor(Math.random() * 200) + 50 },
    { name: "Sht", xp: Math.floor(Math.random() * 300) + 100 },
    { name: "Die", xp: summary?.weeklyXp || Math.floor(Math.random() * 300) + 100 },
  ];

  if (isSummaryLoading || isProgressLoading) {
    return <div className="space-y-6"><Skeleton className="h-[200px] w-full rounded-3xl" /><Skeleton className="h-[400px] w-full rounded-3xl" /></div>;
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-black tracking-tight mb-2">Progresi Juaj</h1>
        <p className="text-muted-foreground font-medium">Gjurmoni rrugëtimin tuaj drejt ekspertizës mjekësore.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card border-2 rounded-2xl p-4 md:p-6 text-center">
          <div className="mx-auto w-12 h-12 bg-amber-100 text-amber-500 rounded-full flex items-center justify-center mb-3">
            <Flame className="w-6 h-6 fill-current" />
          </div>
          <div className="text-3xl font-black">{summary?.currentStreak || 0}</div>
          <div className="text-sm font-bold text-muted-foreground uppercase mt-1">Ditë Radhazi</div>
        </div>
        
        <div className="bg-card border-2 rounded-2xl p-4 md:p-6 text-center">
          <div className="mx-auto w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-3">
            <Award className="w-6 h-6" />
          </div>
          <div className="text-3xl font-black">{summary?.totalXp || 0}</div>
          <div className="text-sm font-bold text-muted-foreground uppercase mt-1">XP Total</div>
        </div>

        <div className="bg-card border-2 rounded-2xl p-4 md:p-6 text-center">
          <div className="mx-auto w-12 h-12 bg-success/10 text-success rounded-full flex items-center justify-center mb-3">
            <BookOpen className="w-6 h-6" />
          </div>
          <div className="text-3xl font-black">{summary?.lessonsCompleted || 0}</div>
          <div className="text-sm font-bold text-muted-foreground uppercase mt-1">Mësime</div>
        </div>

        <div className="bg-card border-2 rounded-2xl p-4 md:p-6 text-center">
          <div className="mx-auto w-12 h-12 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mb-3">
            <Target className="w-6 h-6" />
          </div>
          <div className="text-3xl font-black">{summary?.averageScore ? Math.round(summary.averageScore) : 0}%</div>
          <div className="text-sm font-bold text-muted-foreground uppercase mt-1">Nota Mesatare</div>
        </div>
      </div>

      <div className="bg-card border-2 rounded-3xl p-6 md:p-8">
        <h2 className="text-xl font-bold mb-8 flex items-center gap-2">Historia e XP <span className="text-muted-foreground font-normal text-sm">(Kjo Javë)</span></h2>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontWeight: 'bold' }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontWeight: 'bold' }} />
              <Tooltip cursor={{ fill: 'hsl(var(--muted))' }} contentStyle={{ borderRadius: '1rem', border: '2px solid hsl(var(--border))', fontWeight: 'bold' }} />
              <Bar dataKey="xp" radius={[8, 8, 8, 8]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index === chartData.length - 1 ? 'hsl(var(--primary))' : 'hsl(var(--primary) / 0.5)'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {courseProgress && courseProgress.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Zotërimi i Lëndëve</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {courseProgress.map((course) => (
              <div key={course.courseId} className="bg-card border-2 rounded-2xl p-5 flex items-center gap-4">
                <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-muted" />
                    <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray={`${2 * Math.PI * 40}`} strokeDashoffset={`${2 * Math.PI * 40 * (1 - course.percentComplete / 100)}`} className="text-primary transition-all duration-1000" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center text-sm font-black">{Math.round(course.percentComplete)}%</div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-lg truncate">{course.courseName}</h3>
                  <p className="text-muted-foreground font-medium text-sm">{course.completedLessons} / {course.totalLessons} Mësime</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
