import React from "react";
import { Link, useLocation } from "wouter";
import { Home, BookOpen, Trophy, BarChart3, User, Shield, Brain, FileText, GraduationCap, Bot, NotebookPen, Gamepad2, Award, CreditCard } from "lucide-react";
import { useGetUserStats } from "@workspace/api-client-react";

const NAV_ITEMS = [
  { href: "/", label: "Ana Faqe", icon: Home },
  { href: "/learn", label: "Mëso", icon: BookOpen },
  { href: "/flashcards", label: "Kartela", icon: Brain },
  { href: "/study-notes", label: "Shënime", icon: FileText },
  { href: "/exam-prep", label: "Provimi", icon: GraduationCap },
  { href: "/ai-doctor", label: "Dr. Denisa AI", icon: Bot, accent: "text-pink-500" },
  { href: "/notes", label: "EL Notes", icon: NotebookPen, accent: "text-rose-400" },
  { href: "/games", label: "Gerard Games", icon: Gamepad2, accent: "text-orange-500" },
  { href: "/certificates", label: "Sertifikatat", icon: Award, accent: "text-yellow-500" },
  { href: "/leaderboard", label: "Renditja", icon: Trophy },
  { href: "/progress", label: "Progresi", icon: BarChart3 },
  { href: "/profile", label: "Profili", icon: User },
];

const MOBILE_NAV = [
  { href: "/", label: "Home", icon: Home },
  { href: "/learn", label: "Mëso", icon: BookOpen },
  { href: "/ai-doctor", label: "Denisa", icon: Bot },
  { href: "/games", label: "Lojëra", icon: Gamepad2 },
  { href: "/notes", label: "Notes", icon: NotebookPen },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { data: stats } = useGetUserStats();

  return (
    <div className="min-h-[100dvh] flex flex-col md:flex-row bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 flex-col fixed top-0 left-0 h-screen border-r bg-card z-50">
        <div className="p-6 pb-4">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-sm" style={{ fontFamily: 'Fredoka One, sans-serif' }}>EL</span>
            </div>
            <div>
              <span className="text-2xl font-bold shimmer-text" style={{ fontFamily: 'Fredoka One, sans-serif' }}>
                El_lingo
              </span>
              <p className="text-[9px] text-muted-foreground font-bold -mt-1 tracking-wider">by Elson</p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-0.5 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.href || (item.href !== "/" && location.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-xl font-bold transition-all duration-200 text-sm ${
                  isActive
                    ? 'bg-primary/10 text-primary shadow-sm'
                    : `text-muted-foreground hover:bg-black/5 hover:text-foreground ${item.accent ? `hover:${item.accent}` : ''}`
                }`}
              >
                <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-primary' : item.accent && !isActive ? item.accent : ''}`} />
                <span>{item.label}</span>
                {isActive && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />}
              </Link>
            );
          })}

          <div className="pt-2 space-y-1.5">
            <Link
              href="/pricing"
              className={`flex items-center gap-3 px-3 py-2 rounded-xl font-bold transition-all duration-200 text-sm ${
                location === '/pricing'
                  ? 'bg-purple-500/20 text-purple-700 border border-purple-500/30'
                  : 'text-purple-600 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20'
              }`}
            >
              <CreditCard className="w-4 h-4 flex-shrink-0" />
              Premium 👑
            </Link>
            <Link
              href="/hard-round"
              className={`flex items-center gap-3 px-3 py-2 rounded-xl font-bold transition-all duration-200 text-sm ${
                location === '/hard-round'
                  ? 'bg-destructive/20 text-destructive'
                  : 'text-destructive bg-destructive/10 hover:bg-destructive/20'
              } border border-destructive/20`}
            >
              <Shield className="w-4 h-4 flex-shrink-0" />
              Hard Round 🔥
            </Link>
          </div>
        </nav>

        {stats && (
          <div className="p-4 border-t">
            <div className="flex items-center justify-around text-sm font-bold bg-muted rounded-2xl p-3">
              <div className="flex items-center gap-1.5 text-amber-500">
                <span className="text-lg">⭐</span>
                <span>{stats.streak}</span>
              </div>
              <div className="w-px h-6 bg-border" />
              <div className="flex items-center gap-1.5 text-violet-600">
                <span className="text-lg">💎</span>
                <span>{stats.xp} XP</span>
              </div>
              <div className="w-px h-6 bg-border" />
              <div className="flex items-center gap-1.5 text-rose-500">
                <span className="text-lg">❤️</span>
                <span>{stats.hearts}</span>
              </div>
            </div>
            <p className="text-center text-[9px] text-muted-foreground font-bold mt-2 tracking-widest uppercase">
              El_lingo • Website by Elson
            </p>
          </div>
        )}
      </aside>

      {/* Mobile Top Stats Bar */}
      <header className="md:hidden sticky top-0 z-40 bg-card/95 backdrop-blur border-b px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-1.5">
          <span className="font-bold text-xl shimmer-text" style={{ fontFamily: 'Fredoka One, sans-serif' }}>El_lingo</span>
          <span className="text-[8px] text-muted-foreground font-bold">by Elson</span>
        </Link>
        {stats && (
          <div className="flex items-center gap-3 text-sm font-bold">
            <div className="flex items-center gap-1 text-amber-500">⭐ {stats.streak}</div>
            <div className="flex items-center gap-1 text-violet-600">💎 {stats.xp}</div>
            <div className="flex items-center gap-1 text-rose-500">❤️ {stats.hearts}</div>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-1 md:ml-64 pb-20 md:pb-0 min-h-[100dvh] flex flex-col relative">
        <div className="flex-1 w-full max-w-4xl mx-auto p-4 md:p-8">
          {children}
        </div>

        {/* Banner Ad Placeholder */}
        <div className="w-full bg-muted border-t p-3 flex justify-center mt-auto" id="ad-container">
          <div className="w-[728px] max-w-full h-[60px] bg-black/5 border border-dashed rounded-xl flex items-center justify-center text-muted-foreground text-xs font-semibold">
            Advertisement · Google AdSense (728×90) · El_lingo by Elson
          </div>
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-card/95 backdrop-blur border-t flex items-center justify-around p-2 z-50 pb-safe">
        {MOBILE_NAV.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.href || (item.href !== "/" && location.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`p-2 rounded-xl flex flex-col items-center gap-0.5 min-w-[52px] ${isActive ? 'text-primary' : 'text-muted-foreground'}`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'scale-110' : ''} transition-transform`} />
              <span className={`text-[10px] font-bold ${isActive ? 'text-primary' : ''}`}>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
