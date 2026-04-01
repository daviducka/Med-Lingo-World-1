import React, { useState, useEffect } from "react";
import { Link } from "wouter";
import { useListCourses, useListLanguages, useGetUserProfile, useUpdateUserProfile } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Target, Play, BookOpen } from "lucide-react";

export default function Learn() {
  const { data: profile } = useGetUserProfile();
  const [selectedLanguage, setSelectedLanguage] = useState<string>("");
  const updateProfile = useUpdateUserProfile();

  useEffect(() => {
    if (profile?.selectedLanguage && !selectedLanguage) {
      setSelectedLanguage(profile.selectedLanguage);
    }
  }, [profile?.selectedLanguage]);

  const lang = selectedLanguage || profile?.selectedLanguage || "sq";

  const { data: courses, isLoading: coursesLoading } = useListCourses(
    { language: lang },
    { query: { queryKey: [`/api/courses?language=${lang}`] } }
  );
  const { data: languages } = useListLanguages();

  const handleLanguageChange = (newLang: string) => {
    setSelectedLanguage(newLang);
    updateProfile.mutate({ data: { selectedLanguage: newLang } });
  };

  const currentLang = languages?.find(l => l.code === lang);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold shimmer-text mb-1" style={{ fontFamily: 'Fredoka One, sans-serif' }}>
            Lëndët 📚
          </h1>
          <p className="text-muted-foreground font-semibold text-lg">
            {currentLang?.flagEmoji} Mëso mjekësinë, sistem pas sistemi
          </p>
        </div>

        <div className="w-full md:w-52">
          <Select value={lang} onValueChange={handleLanguageChange}>
            <SelectTrigger className="w-full font-bold h-12 rounded-2xl border-2">
              <SelectValue placeholder="Gjuha" />
            </SelectTrigger>
            <SelectContent>
              {languages?.map(l => (
                <SelectItem key={l.code} value={l.code} className="font-bold">
                  {l.flagEmoji} {l.nativeName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {coursesLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => <Skeleton key={i} className="h-48 rounded-3xl" />)}
        </div>
      ) : !courses?.length ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">📭</div>
          <p className="text-xl font-bold text-muted-foreground">
            Nuk ka lëndë për gjuhën {currentLang?.name ?? lang}
          </p>
          <p className="text-muted-foreground mt-2 font-semibold">Zgjidh anglishten ose shqipen.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {courses.map((course) => (
            <Link key={course.id} href={`/learn/${course.id}`} className="block group outline-none">
              <div
                className="relative bg-card border-2 border-b-[6px] rounded-3xl p-6 transition-all duration-300 active:translate-y-1 active:border-b-2 hover:-translate-y-1 hover:shadow-xl flex flex-col h-full overflow-hidden"
                style={{ borderColor: course.color }}
              >
                <div className="absolute top-0 right-0 w-36 h-36 opacity-5 rounded-bl-full pointer-events-none" style={{ backgroundColor: course.color }} />

                <div className="flex items-start justify-between mb-4 relative z-10">
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-sm"
                    style={{ backgroundColor: `${course.color}20` }}
                  >
                    {course.iconEmoji}
                  </div>
                  <div className="bg-muted px-3 py-1.5 rounded-full text-xs font-bold text-muted-foreground flex items-center gap-1 capitalize">
                    <Target className="w-3 h-3" /> {course.difficulty}
                  </div>
                </div>

                <div className="relative z-10 flex-1">
                  <h2 className="text-xl font-bold mb-1" style={{ fontFamily: 'Fredoka One, sans-serif', color: course.color }}>
                    {course.title}
                  </h2>
                  <p className="text-muted-foreground font-medium text-sm line-clamp-2">{course.description}</p>
                </div>

                <div className="mt-5 pt-4 border-t flex items-center justify-between relative z-10">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                    <BookOpen className="w-3 h-3" /> {course.category}
                  </span>
                  <span className="font-bold text-sm flex items-center gap-1" style={{ color: course.color }}>
                    {course.totalLessons} Mësime <Play className="w-3.5 h-3.5" />
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
