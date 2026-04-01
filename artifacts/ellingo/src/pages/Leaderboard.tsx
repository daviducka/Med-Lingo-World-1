import React from "react";
import { useGetLeaderboard } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Trophy, Flame } from "lucide-react";

export default function Leaderboard() {
  const { data: leaderboard, isLoading } = useGetLeaderboard({ limit: 50 }, { query: { queryKey: ['/api/leaderboard'] } });

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="text-center space-y-4 py-8 border-b">
        <div className="mx-auto w-24 h-24 bg-amber-100 rounded-full flex items-center justify-center shadow-inner mb-4 border-4 border-amber-300">
          <Trophy className="w-12 h-12 text-amber-500" />
        </div>
        <h1 className="text-4xl font-black tracking-tight">Liga Javore</h1>
        <p className="text-muted-foreground font-medium text-lg max-w-md mx-auto">Garoni me studentë të tjerë mjekësie. Top 10 avancojnë në ligën tjetër.</p>
      </div>

      <div className="bg-card rounded-3xl border-2 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-4 space-y-4">
            {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="w-full h-16 rounded-2xl" />)}
          </div>
        ) : (
          <div className="divide-y">
            {leaderboard?.map((entry, idx) => {
              const isTop3 = idx < 3;
              let rankColor = "text-muted-foreground";
              if (idx === 0) rankColor = "text-amber-500";
              if (idx === 1) rankColor = "text-slate-400";
              if (idx === 2) rankColor = "text-amber-700";

              return (
                <div key={entry.userId} className={`flex items-center gap-4 p-4 md:px-6 hover:bg-muted/50 transition-colors ${idx === 0 ? 'bg-amber-50/50' : ''}`}>
                  <div className={`w-8 font-black text-xl text-center ${rankColor}`}>
                    {entry.rank}
                  </div>
                  
                  {entry.avatarUrl ? (
                    <img src={entry.avatarUrl} alt="" className="w-12 h-12 rounded-full border-2 border-background shadow-sm" />
                  ) : (
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg border-2 border-background shadow-sm ${isTop3 ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'}`}>
                      {entry.displayName.charAt(0)}
                    </div>
                  )}

                  <div className="flex-1 font-bold text-lg">
                    {entry.displayName}
                  </div>

                  <div className="text-right flex items-center gap-4">
                    <div className="hidden md:flex items-center gap-1 text-amber-500 font-bold">
                      <Flame className="w-4 h-4 fill-current" /> {entry.streak}
                    </div>
                    <div className="font-black text-primary min-w-[80px]">
                      {entry.weeklyXp} XP
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
