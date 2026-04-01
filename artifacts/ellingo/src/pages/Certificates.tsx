import React, { useState, useEffect } from "react";
import { Trophy, Award, Star, Zap, Target } from "lucide-react";

interface Certificate {
  id: number;
  type: string;
  title: string;
  description: string;
  category: string;
  level: string;
  achievements: number;
  badgeEmoji: string;
  awardedDate: string;
  courseId: number | null;
}

interface CertStats {
  total: number;
  completion: number;
  excellence: number;
  mastery: number;
  daily_challenge: number;
  weekly_challenge: number;
}

export default function Certificates() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [stats, setStats] = useState<CertStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "completion" | "excellence" | "mastery">("all");

  useEffect(() => {
    Promise.all([
      fetch("/api/certificates").then(r => r.json()),
      fetch("/api/certificates/stats/count").then(r => r.json()),
    ])
      .then(([certs, certStats]) => {
        setCertificates(certs);
        setStats(certStats);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = certificates.filter(
    cert => filter === "all" || cert.type === filter
  );

  const getCertIcon = (type: string): React.ReactNode => {
    switch (type) {
      case "completion":
        return "🏅";
      case "excellence":
        return "⭐";
      case "mastery":
        return "👑";
      case "daily_challenge":
        return "📅";
      case "weekly_challenge":
        return "📆";
      default:
        return "🏆";
    }
  };

  const getCertColor = (type: string) => {
    switch (type) {
      case "completion":
        return "border-blue-300 bg-blue-50";
      case "excellence":
        return "border-yellow-300 bg-yellow-50";
      case "mastery":
        return "border-purple-300 bg-purple-50";
      case "daily_challenge":
        return "border-green-300 bg-green-50";
      case "weekly_challenge":
        return "border-pink-300 bg-pink-50";
      default:
        return "border-gray-300 bg-gray-50";
    }
  };

  if (loading)
    return (
      <div className="text-center py-20 text-muted-foreground">
        Duke ngarkuar sertifikatat...
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <h1
          className="text-5xl font-bold mb-2 shimmer-text"
          style={{ fontFamily: "Fredoka One, sans-serif" }}
        >
          Certifikatat Tuaja 🏆
        </h1>
        <p className="text-muted-foreground font-semibold">
          Shfaq arritjet dhe shpërblimet tuaja
        </p>
      </div>

      {/* Stats Grid */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
          <div className="bg-gradient-to-br from-blue-100 to-blue-50 border-2 border-blue-300 rounded-2xl p-6 text-center">
            <div className="text-4xl mb-2">🏆</div>
            <p className="text-3xl font-bold text-blue-700">{stats.total}</p>
            <p className="text-xs font-bold text-blue-600 uppercase tracking-wide mt-1">
              Total
            </p>
          </div>
          <div className="bg-gradient-to-br from-green-100 to-green-50 border-2 border-green-300 rounded-2xl p-6 text-center">
            <div className="text-4xl mb-2">🏅</div>
            <p className="text-3xl font-bold text-green-700">
              {stats.completion}
            </p>
            <p className="text-xs font-bold text-green-600 uppercase tracking-wide mt-1">
              Completion
            </p>
          </div>
          <div className="bg-gradient-to-br from-yellow-100 to-yellow-50 border-2 border-yellow-300 rounded-2xl p-6 text-center">
            <div className="text-4xl mb-2">⭐</div>
            <p className="text-3xl font-bold text-yellow-700">
              {stats.excellence}
            </p>
            <p className="text-xs font-bold text-yellow-600 uppercase tracking-wide mt-1">
              Excellence
            </p>
          </div>
          <div className="bg-gradient-to-br from-purple-100 to-purple-50 border-2 border-purple-300 rounded-2xl p-6 text-center">
            <div className="text-4xl mb-2">👑</div>
            <p className="text-3xl font-bold text-purple-700">{stats.mastery}</p>
            <p className="text-xs font-bold text-purple-600 uppercase tracking-wide mt-1">
              Mastery
            </p>
          </div>
          <div className="bg-gradient-to-br from-green-100 to-green-50 border-2 border-green-300 rounded-2xl p-6 text-center">
            <div className="text-4xl mb-2">📅</div>
            <p className="text-3xl font-bold text-green-700">
              {stats.daily_challenge}
            </p>
            <p className="text-xs font-bold text-green-600 uppercase tracking-wide mt-1">
              Daily
            </p>
          </div>
          <div className="bg-gradient-to-br from-pink-100 to-pink-50 border-2 border-pink-300 rounded-2xl p-6 text-center">
            <div className="text-4xl mb-2">📆</div>
            <p className="text-3xl font-bold text-pink-700">
              {stats.weekly_challenge}
            </p>
            <p className="text-xs font-bold text-pink-600 uppercase tracking-wide mt-1">
              Weekly
            </p>
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded-full font-bold whitespace-nowrap transition-all ${
            filter === "all"
              ? "bg-primary text-white"
              : "bg-muted text-muted-foreground hover:bg-primary/10"
          }`}
        >
          Të Gjitha ({certificates.length})
        </button>
        <button
          onClick={() => setFilter("completion")}
          className={`px-4 py-2 rounded-full font-bold whitespace-nowrap transition-all ${
            filter === "completion"
              ? "bg-blue-500 text-white"
              : "bg-blue-100 text-blue-700 hover:bg-blue-200"
          }`}
        >
          🏅 Completion
        </button>
        <button
          onClick={() => setFilter("excellence")}
          className={`px-4 py-2 rounded-full font-bold whitespace-nowrap transition-all ${
            filter === "excellence"
              ? "bg-yellow-500 text-white"
              : "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
          }`}
        >
          ⭐ Excellence
        </button>
        <button
          onClick={() => setFilter("mastery")}
          className={`px-4 py-2 rounded-full font-bold whitespace-nowrap transition-all ${
            filter === "mastery"
              ? "bg-purple-500 text-white"
              : "bg-purple-100 text-purple-700 hover:bg-purple-200"
          }`}
        >
          👑 Mastery
        </button>
      </div>

      {/* Certificates Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <div className="text-6xl mb-4 opacity-20">📜</div>
          <h2 className="text-2xl font-bold mb-2">Nuk ka sertifikata ende</h2>
          <p className="font-medium">Përfundo lojërat dhe quizet për të fituar sertifikata!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(cert => (
            <div
              key={cert.id}
              className={`rounded-2xl border-2 p-6 transition-all hover:shadow-lg hover:-translate-y-1 ${getCertColor(
                cert.type
              )}`}
            >
              {/* Badge */}
              <div className="flex items-start justify-between mb-4">
                <div className="text-5xl">{cert.badgeEmoji}</div>
                <span className="text-xs font-bold bg-black/10 rounded-full px-3 py-1 uppercase tracking-wide">
                  {cert.level}
                </span>
              </div>

              {/* Title */}
              <h3 className="font-bold text-lg mb-1">{cert.title}</h3>
              <p className="text-sm text-gray-600 mb-4">{cert.description}</p>

              {/* Achievement */}
              <div className="flex items-center gap-2 mb-3 text-sm font-bold">
                <span>📊</span>
                <span>{cert.achievements}%</span>
              </div>

              {/* Date */}
              <p className="text-xs text-gray-500 font-semibold">
                📅 {new Date(cert.awardedDate).toLocaleDateString("sq-AL")}
              </p>

              {/* Confetti effect on hover */}
              <div className="mt-4 flex gap-1">
                {["🎉", "✨", "🌟"].map((emoji, i) => (
                  <span
                    key={i}
                    className="text-xl opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    {emoji}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Share Section */}
      {certificates.length > 0 && (
        <div className="mt-12 bg-gradient-to-r from-primary/10 to-primary/5 border-2 border-primary/30 rounded-3xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-3" style={{ fontFamily: "Fredoka One, sans-serif" }}>
            Shfaq Arritjet Tuaja! 🎉
          </h2>
          <p className="text-muted-foreground font-semibold mb-6">
            Ndaje sertifikatat tuaja në social media dhe ndjaje kredinë!
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-2xl px-6 py-2 transition-all">
              📱 Ndaje në Facebook
            </button>
            <button className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold rounded-2xl px-6 py-2 transition-all">
              𝕏 Ndaje në Twitter
            </button>
            <button className="bg-pink-500 hover:bg-pink-600 text-white font-bold rounded-2xl px-6 py-2 transition-all">
              📸 Ndaje në Instagram
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
