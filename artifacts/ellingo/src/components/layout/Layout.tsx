import React from "react";
import { Link, useLocation } from "wouter";
import { Home, BookOpen, Trophy, BarChart3, User, Shield } from "lucide-react";
import { useGetUserProfile, useGetUserStats } from "@workspace/api-client-react";

const NAV_ITEMS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/learn", label: "Learn", icon: BookOpen },
  { href: "/leaderboard", label: "Rank", icon: Trophy },
  { href: "/progress", label: "Progress", icon: BarChart3 },
  { href: "/profile", label: "Profile", icon: User },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { data: profile } = useGetUserProfile();
  const { data: stats } = useGetUserStats();

  return (
    <div className="min-h-[100dvh] flex flex-col md:flex-row bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 flex-col fixed top-0 left-0 h-screen border-r bg-card z-50">
        <div className="p-6 pb-2">
          <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-primary tracking-tight">
            <span className="bg-primary text-white p-1.5 rounded-xl">EL</span> El_lingo
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.href || (item.href !== "/" && location.startsWith(item.href));
            return (
              <Link key={item.href} href={item.href} className={`flex items-center gap-4 px-4 py-3 rounded-xl font-bold transition-all duration-200 ${isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-black/5 hover:text-foreground'}`}>
                <Icon className={`w-6 h-6 ${isActive ? 'animate-pulse' : ''}`} />
                {item.label}
              </Link>
            );
          })}

          <Link href="/hard-round" className="flex items-center gap-4 px-4 py-3 mt-4 rounded-xl font-bold transition-all duration-200 text-destructive bg-destructive/10 hover:bg-destructive/20 border border-destructive/20">
            <Shield className="w-6 h-6" />
            Hard Round
          </Link>
        </nav>

        {stats && (
          <div className="p-4 border-t flex items-center justify-around text-sm font-bold text-muted-foreground">
            <div className="flex items-center gap-1.5 text-amber-500">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 2L15 8L22 9L17 14L18 21L12 18L6 21L7 14L2 9L9 8L12 2Z"/></svg>
              {stats.streak}
            </div>
            <div className="flex items-center gap-1.5 text-primary">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
              {stats.xp} XP
            </div>
            <div className="flex items-center gap-1.5 text-destructive">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
              {stats.hearts}
            </div>
          </div>
        )}
      </aside>

      {/* Mobile Top Stats Bar */}
      <header className="md:hidden sticky top-0 z-40 bg-card border-b px-4 py-3 flex items-center justify-between">
        <Link href="/" className="font-bold text-xl text-primary tracking-tight">El_lingo</Link>
        {stats && (
          <div className="flex items-center gap-4 text-sm font-bold">
            <div className="flex items-center gap-1 text-amber-500"><svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 2L15 8L22 9L17 14L18 21L12 18L6 21L7 14L2 9L9 8L12 2Z"/></svg>{stats.streak}</div>
            <div className="flex items-center gap-1 text-primary"><svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>{stats.xp}</div>
            <div className="flex items-center gap-1 text-destructive"><svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>{stats.hearts}</div>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-1 md:ml-64 pb-20 md:pb-0 min-h-[100dvh] flex flex-col relative">
        <div className="flex-1 w-full max-w-4xl mx-auto p-4 md:p-8">
          {children}
        </div>
        
        {/* Banner Ad Placeholder */}
        <div className="w-full bg-muted border-t p-4 flex justify-center mt-auto" id="ad-container">
          <div className="w-[728px] max-w-full h-[90px] bg-black/5 border border-dashed rounded flex items-center justify-center text-muted-foreground text-sm">
            Advertisement - Google AdSense (728x90)
          </div>
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-card border-t flex items-center justify-around p-2 z-50 pb-safe">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.href || (item.href !== "/" && location.startsWith(item.href));
          return (
            <Link key={item.href} href={item.href} className={`p-3 rounded-xl flex flex-col items-center gap-1 ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
              <Icon className={`w-6 h-6 ${isActive ? 'animate-bounce' : ''}`} />
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
