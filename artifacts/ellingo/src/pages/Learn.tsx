import React, { useState } from "react";
import { Link } from "wouter";
import { useListCourses, useListLanguages, useGetUserProfile } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Target, Lock, Play } from "lucide-react";

export default function Learn() {
  const { data: profile } = useGetUserProfile();
  const [selectedLanguage, setSelectedLanguage] = useState(profile?.selectedLanguage || "en");
  
  const { data: courses, isLoading: coursesLoading } = useListCourses({ language: selectedLanguage });
  const { data: languages } = useListLanguages();

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Courses</h1>
          <p className="text-muted-foreground font-medium">Master the human body, one system at a time.</p>
        </div>

        <div className="w-full md:w-48">
          <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
            <SelectTrigger className="w-full font-bold h-12 rounded-xl border-2">
              <SelectValue placeholder="Language" />
            </SelectTrigger>
            <SelectContent>
              {languages?.map(lang => (
                <SelectItem key={lang.code} value={lang.code} className="font-bold">
                  {lang.flagEmoji} {lang.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {coursesLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => <Skeleton key={i} className="h-48 rounded-3xl" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {courses?.map((course) => (
            <Link key={course.id} href={`/learn/${course.id}`} className="block group outline-none">
              <div 
                className="relative bg-card border-2 border-b-[6px] rounded-3xl p-6 transition-all active:translate-y-1 active:border-b-2 hover:-translate-y-1 flex flex-col h-full overflow-hidden"
                style={{ borderColor: course.color }}
              >
                <div className="absolute top-0 right-0 w-32 h-32 opacity-5 rounded-bl-full pointer-events-none" style={{ backgroundColor: course.color }} />
                
                <div className="flex items-start justify-between mb-4 relative z-10">
                  <div 
                    className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-sm"
                    style={{ backgroundColor: `${course.color}20`, color: course.color }}
                  >
                    {course.iconEmoji}
                  </div>
                  <div className="bg-muted px-3 py-1 rounded-full text-xs font-bold text-muted-foreground flex items-center gap-1">
                    <Target className="w-3 h-3" /> {course.difficulty}
                  </div>
                </div>

                <div className="relative z-10 flex-1">
                  <h2 className="text-2xl font-black mb-1">{course.title}</h2>
                  <p className="text-muted-foreground font-medium text-sm line-clamp-2">{course.description}</p>
                </div>

                <div className="mt-6 pt-4 border-t flex items-center justify-between relative z-10">
                  <span className="text-sm font-bold text-muted-foreground uppercase tracking-wider">{course.category}</span>
                  <span className="font-black flex items-center gap-1" style={{ color: course.color }}>
                    {course.totalLessons} Lessons <Play className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
