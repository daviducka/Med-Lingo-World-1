import React from "react";
import { Link, useLocation } from "wouter";
import {
  Home, BookOpen, Trophy, BarChart3, User, Brain,
  FileText, GraduationCap, Bot, NotebookPen, Gamepad2, Award,
  Flame,
} from "lucide-react";
import { useGetUserStats } from "@workspace/api-client-react";

const NAV_SECTIONS = [
  {
    label: "Kryesore",
    items: [
      { href: "/", label: "Ana Faqe", icon: Home },
      { href: "/learn", label: "Mëso", icon: BookOpen },
      { href: "/progress", label: "Progresi", icon: BarChart3 },
    ],
  },
  {
    label: "Studimi",
    items: [
      { href: "/flashcards", label: "Kartela", icon: Brain },
      { href: "/study-notes", label: "Shënime", icon: FileText },
      { href: "/exam-prep", label: "Provimi", icon: GraduationCap },
      { href: "/notes", label: "EL Notes", icon: NotebookPen },
    ],
  },
  {
    label: "Argëtim",
    items: [
      { href: "/ai-doctor", label: "Dr. Denisa AI", icon: Bot, accent: "#ec4899" },
      { href: "/games", label: "Gerard Games", icon: Gamepad2, accent: "#f97316" },
      { href: "/certificates", label: "Sertifikatat", icon: Award, accent: "#eab308" },
      { href: "/leaderboard", label: "Renditja", icon: Trophy },
    ],
  },
  {
    label: "Llogaria",
    items: [
      { href: "/profile", label: "Profili", icon: User },
    ],
  },
];

const MOBILE_NAV = [
  { href: "/", label: "Ballina", icon: Home },
  { href: "/learn", label: "Mëso", icon: BookOpen },
  { href: "/ai-doctor", label: "Denisa", icon: Bot },
  { href: "/games", label: "Lojëra", icon: Gamepad2 },
  { href: "/profile", label: "Profili", icon: User },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { data: stats } = useGetUserStats();

  return (
    <div className="min-h-[100dvh] flex flex-col md:flex-row bg-background">

      {/* ── Desktop Sidebar ── */}
      <aside className="hidden md:flex w-64 flex-col fixed top-0 left-0 h-screen z-50" style={{ background: "linear-gradient(180deg, #ffffff 0%, #fafafa 100%)", borderRight: "1px solid #eff0f6" }}>

        {/* Logo */}
        <div className="px-5 py-5 border-b border-gray-100">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg shrink-0 transition-transform group-hover:scale-105" style={{ background: "linear-gradient(135deg, #7c3aed, #2563eb)" }}>
              <span className="text-white font-black text-base" style={{ fontFamily: "Fredoka One, sans-serif" }}>EL</span>
            </div>
            <div>
              <div className="text-xl font-black leading-tight shimmer-text" style={{ fontFamily: "Fredoka One, sans-serif" }}>Med Lingo Portal</div>
              <div className="text-[9px] text-gray-400 font-semibold tracking-widest uppercase">Medical Learning</div>
            </div>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
          {NAV_SECTIONS.map((section) => (
            <div key={section.label}>
              <p className="px-2 mb-1.5 text-[10px] font-black text-gray-400 tracking-widest uppercase">{section.label}</p>
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = location === item.href || (item.href !== "/" && location.startsWith(item.href));
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 group"
                      style={{
                        background: isActive ? "linear-gradient(135deg, rgba(124,58,237,0.1), rgba(37,99,235,0.08))" : "transparent",
                        color: isActive ? "#7c3aed" : "#6b7280",
                        fontWeight: isActive ? 700 : 600,
                      }}
                    >
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-all"
                        style={{
                          background: isActive ? "linear-gradient(135deg, #7c3aed, #2563eb)" : "transparent",
                        }}
                      >
                        <Icon
                          className="w-3.5 h-3.5 transition-colors"
                          style={{ color: isActive ? "#fff" : item.accent || "#9ca3af" }}
                        />
                      </div>
                      <span>{item.label}</span>
                      {isActive && (
                        <div className="ml-auto w-1.5 h-1.5 rounded-full" style={{ background: "#7c3aed" }} />
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Special buttons */}
          <div className="space-y-2 pt-2">
            <Link
              href="/hard-round"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all duration-200"
              style={{
                background: location === "/hard-round"
                  ? "linear-gradient(135deg, #ef4444, #f97316)"
                  : "rgba(239,68,68,0.08)",
                color: location === "/hard-round" ? "#fff" : "#ef4444",
                border: "1px solid rgba(239,68,68,0.2)",
              }}
            >
              <Flame className="w-4 h-4 shrink-0" />
              <span>Hard Round 🔥</span>
            </Link>
          </div>
        </nav>

        {/* Stats Footer */}
        {stats && (
          <div className="p-4 border-t border-gray-100">
            <div className="rounded-2xl p-3 flex items-center justify-around text-sm font-bold" style={{ background: "linear-gradient(135deg, #f5f3ff, #eff6ff)" }}>
              <div className="flex flex-col items-center gap-0.5">
                <span className="text-lg leading-none">⭐</span>
                <span className="text-amber-600 text-xs font-black">{stats.streak}</span>
                <span className="text-[9px] text-gray-400 font-semibold">Streak</span>
              </div>
              <div className="w-px h-8 bg-gray-200" />
              <div className="flex flex-col items-center gap-0.5">
                <span className="text-lg leading-none">💎</span>
                <span className="text-violet-600 text-xs font-black">{stats.xp}</span>
                <span className="text-[9px] text-gray-400 font-semibold">XP</span>
              </div>
              <div className="w-px h-8 bg-gray-200" />
              <div className="flex flex-col items-center gap-0.5">
                <span className="text-lg leading-none">❤️</span>
                <span className="text-rose-500 text-xs font-black">{stats.hearts}</span>
                <span className="text-[9px] text-gray-400 font-semibold">Jeta</span>
              </div>
            </div>
            <p className="text-center text-[9px] text-gray-300 font-semibold mt-2 tracking-widest uppercase">Med Lingo Portal</p>
          </div>
        )}
      </aside>

      {/* ── Mobile Header ── */}
      <header className="md:hidden sticky top-0 z-40 px-4 py-3 flex items-center justify-between" style={{ background: "rgba(255,255,255,0.95)", backdropFilter: "blur(12px)", borderBottom: "1px solid #eff0f6" }}>
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center shadow-md" style={{ background: "linear-gradient(135deg, #7c3aed, #2563eb)" }}>
            <span className="text-white font-black text-xs" style={{ fontFamily: "Fredoka One, sans-serif" }}>EL</span>
          </div>
          <span className="font-black text-lg shimmer-text" style={{ fontFamily: "Fredoka One, sans-serif" }}>Med Lingo Portal</span>
        </Link>
        {stats && (
          <div className="flex items-center gap-3 text-sm font-bold">
            <span className="flex items-center gap-1 text-amber-500">⭐{stats.streak}</span>
            <span className="flex items-center gap-1 text-violet-600">💎{stats.xp}</span>
            <span className="flex items-center gap-1 text-rose-500">❤️{stats.hearts}</span>
          </div>
        )}
      </header>

      {/* ── Main Content ── */}
      <main className="flex-1 md:ml-64 pb-20 md:pb-0 min-h-[100dvh] flex flex-col">
        <div className="flex-1 w-full max-w-4xl mx-auto p-4 md:p-8">
          {children}
        </div>

        {/* Ad Banner */}
        <div className="w-full p-3 flex justify-center mt-auto border-t border-gray-100">
          <div className="w-[728px] max-w-full h-[60px] rounded-2xl flex items-center justify-center text-[11px] font-semibold text-gray-300 border border-dashed border-gray-200">
            Advertisement · Google AdSense (728×90)
          </div>
        </div>
      </main>

      {/* ── Mobile Bottom Nav ── */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full flex items-center justify-around p-2 z-50 pb-safe" style={{ background: "rgba(255,255,255,0.96)", backdropFilter: "blur(16px)", borderTop: "1px solid #eff0f6" }}>
        {MOBILE_NAV.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.href || (item.href !== "/" && location.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center gap-0.5 min-w-[52px] py-1 rounded-xl transition-all"
            >
              <div className="w-8 h-8 rounded-xl flex items-center justify-center transition-all" style={{ background: isActive ? "linear-gradient(135deg, #7c3aed, #2563eb)" : "transparent" }}>
                <Icon className="w-4 h-4 transition-colors" style={{ color: isActive ? "#fff" : "#9ca3af" }} />
              </div>
              <span className="text-[10px] font-bold transition-colors" style={{ color: isActive ? "#7c3aed" : "#9ca3af" }}>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
