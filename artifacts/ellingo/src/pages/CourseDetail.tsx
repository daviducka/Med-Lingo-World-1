import React from "react";
import { useRoute, Link } from "wouter";
import { useGetCourse } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Star, Lock, CheckCircle2 } from "lucide-react";

export default function CourseDetail() {
  const [, params] = useRoute("/learn/:courseId");
  const courseId = params?.courseId ? parseInt(params.courseId) : 0;
  
  const { data: course, isLoading } = useGetCourse(courseId, { query: { enabled: !!courseId, queryKey: [`/api/courses/${courseId}`] } });

  if (isLoading) {
    return (
      <div className="space-y-8 max-w-2xl mx-auto">
        <Skeleton className="w-full h-48 rounded-3xl" />
        <div className="space-y-4 flex flex-col items-center">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="w-24 h-24 rounded-full" />)}
        </div>
      </div>
    );
  }

  if (!course) return <div>Course not found</div>;

  return (
    <div className="max-w-2xl mx-auto pb-24 animate-in fade-in duration-300">
      <Link href="/learn" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground font-bold mb-6 transition-colors">
        <ArrowLeft className="w-5 h-5" /> Back to Courses
      </Link>

      <div 
        className="rounded-3xl p-8 text-white shadow-lg mb-12 relative overflow-hidden"
        style={{ backgroundColor: course.color }}
      >
        <div className="absolute -right-10 -top-10 text-[150px] opacity-10 leading-none">{course.iconEmoji}</div>
        <div className="relative z-10">
          <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-bold backdrop-blur-sm inline-block mb-4 uppercase tracking-wider">
            {course.category}
          </span>
          <h1 className="text-4xl font-black mb-2">{course.title}</h1>
          <p className="text-white/90 font-medium text-lg max-w-md">{course.description}</p>
        </div>
      </div>

      {/* Lesson Path (Duolingo Style Vertical Path) */}
      <div className="flex flex-col items-center relative py-8">
        {/* The connecting path line */}
        <div className="absolute top-0 bottom-0 w-4 bg-muted left-1/2 -translate-x-1/2 rounded-full -z-10" />
        
        {course.lessons?.map((lesson, index) => {
          const isLeft = index % 2 === 0;
          const status = lesson.isCompleted ? 'completed' : lesson.isLocked ? 'locked' : 'available';
          
          let btnColor = status === 'completed' ? '#fbbf24' : status === 'locked' ? 'hsl(var(--muted))' : course.color;
          let shadowColor = status === 'completed' ? '#d97706' : status === 'locked' ? 'hsl(var(--border))' : 'rgba(0,0,0,0.2)';
          let textColor = status === 'locked' ? 'hsl(var(--muted-foreground))' : '#fff';
          
          return (
            <div key={lesson.id} className={`w-full flex ${isLeft ? 'justify-start md:justify-center pr-12 md:pr-[20%]' : 'justify-end md:justify-center pl-12 md:pl-[20%]'} mb-12 relative`}>
              
              <Link href={lesson.isLocked ? "#" : `/lesson/${lesson.id}`} className={lesson.isLocked ? "pointer-events-none cursor-not-allowed" : ""}>
                <div className="relative group">
                  {/* Tooltip bubble - always visible on desktop hover, or always if it's the current available one */}
                  {status === 'available' && (
                    <div className="absolute -top-14 left-1/2 -translate-x-1/2 bg-white border-2 border-border px-4 py-2 rounded-xl font-bold shadow-md whitespace-nowrap z-20 animate-bounce">
                      Start Lesson {lesson.orderIndex}
                      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-b-2 border-r-2 border-border rotate-45" />
                    </div>
                  )}

                  {/* Lesson Node */}
                  <div 
                    className={`w-24 h-24 rounded-full flex items-center justify-center text-3xl transition-transform ${status !== 'locked' ? 'hover:-translate-y-2 active:translate-y-0' : ''}`}
                    style={{ 
                      backgroundColor: btnColor,
                      color: textColor,
                      boxShadow: `0 8px 0 0 ${shadowColor}`,
                      border: status === 'locked' ? '4px solid hsl(var(--border))' : '4px solid rgba(255,255,255,0.2)',
                      opacity: status === 'locked' ? 0.8 : 1
                    }}
                  >
                    {status === 'completed' ? <CheckCircle2 className="w-10 h-10" /> : 
                     status === 'locked' ? <Lock className="w-10 h-10" /> : 
                     <Star className="w-10 h-10 fill-current" />}
                  </div>

                  <div className="mt-4 text-center font-bold absolute left-1/2 -translate-x-1/2 w-32">
                    {lesson.title}
                  </div>
                </div>
              </Link>

            </div>
          );
        })}
      </div>
    </div>
  );
}
