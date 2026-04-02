import React from "react";
import { Check, BookOpen, Zap, Brain, Award, Flame, Mail, Shield, Star } from "lucide-react";

const features = [
  { icon: BookOpen, text: "24+ kurse mjekësore", sub: "Anatomi, Farmakologji, Fiziologji e më shumë" },
  { icon: Zap,      text: "6 lojëra interaktive", sub: "Mëso duke luajtur" },
  { icon: Brain,    text: "Dr. Denisa AI 24/7",   sub: "Asistenti juaj mjekësor AI" },
  { icon: Award,    text: "Sertifikata zyrtare",  sub: "Dëshmi e njohurive tuaja" },
  { icon: Flame,    text: "Hard Round exam",      sub: "Pyetje USMLE-style, XP i dyfishtë" },
  { icon: BookOpen, text: "Flashkarta & Shënime", sub: "Studimi i personalizuar" },
];

export default function Pricing() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8" style={{ animation: "fadeInUp 0.5s ease both" }}>

      {/* Header */}
      <div className="text-center mb-10">
        <span className="inline-block px-4 py-1.5 rounded-full text-xs font-black tracking-widest uppercase bg-purple-100 text-purple-700 mb-4">
          El_lingo Premium
        </span>
        <h1 className="text-5xl font-black mb-3" style={{ fontFamily: "Fredoka One, sans-serif", background: "linear-gradient(135deg, #7c3aed, #2563eb)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          Mëso pa Limite
        </h1>
        <p className="text-lg text-muted-foreground max-w-md mx-auto">
          Qasje e plotë në të gjitha materialet mjekësore — kurse, AI, lojëra dhe sertifikata.
        </p>
      </div>

      {/* Price card */}
      <div className="rounded-3xl overflow-hidden shadow-2xl mb-6" style={{ border: "1px solid rgba(124,58,237,0.15)" }}>
        <div className="h-1.5" style={{ background: "linear-gradient(90deg, #7c3aed, #2563eb, #7c3aed)", backgroundSize: "200%", animation: "shimmerBar 3s linear infinite" }} />

        <div className="bg-white p-8">
          {/* Price */}
          <div className="flex items-end gap-1 mb-1">
            <span className="text-2xl font-bold text-gray-400 mb-1">€</span>
            <span className="text-7xl font-black leading-none" style={{ fontFamily: "Fredoka One, sans-serif", color: "#7c3aed" }}>15</span>
            <span className="text-gray-500 font-medium mb-2">/vit</span>
          </div>
          <p className="text-sm text-gray-400 mb-6">Pa kontratë • Çmim i parë lansimi</p>

          <div className="border-t border-gray-100 mb-6" />

          {/* Features */}
          <div className="space-y-4 mb-8">
            {features.map(({ icon: Icon, text, sub }, i) => (
              <div key={i} className="flex items-center gap-3" style={{ animation: `fadeInLeft 0.4s ease ${i * 0.07}s both` }}>
                <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ background: "linear-gradient(135deg, #ede9fe, #dbeafe)" }}>
                  <Icon className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <p className="font-bold text-gray-800 text-sm leading-tight">{text}</p>
                  <p className="text-xs text-gray-400">{sub}</p>
                </div>
                <Check className="w-4 h-4 text-green-500 ml-auto shrink-0" strokeWidth={3} />
              </div>
            ))}
          </div>

          {/* CTA - Contact */}
          <a
            href="mailto:njdj0665@gmail.com?subject=El_lingo Premium - Abonim&body=Pershendetje, dua te abonohem ne El_lingo Premium."
            className="flex items-center justify-center gap-3 w-full py-4 rounded-2xl font-bold text-white text-lg no-underline transition-all duration-300 hover:-translate-y-0.5"
            style={{ background: "linear-gradient(135deg, #7c3aed, #2563eb)", boxShadow: "0 6px 24px rgba(124,58,237,0.35)" }}
          >
            <Mail className="w-5 h-5" />
            Kontaktoni për Premium
          </a>

          <div className="flex items-center justify-center gap-2 mt-4">
            <Shield className="w-3.5 h-3.5 text-gray-400" />
            <p className="text-xs text-gray-400">Na shkruani dhe ju aktivizojmë brenda 24 orëve</p>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        {[
          { stars: 5, text: "Platforma më e mirë!", name: "Arta M." },
          { stars: 5, text: "Dr. Denisa AI është fantastike", name: "Erion K." },
          { stars: 5, text: "Kalova provimin falë El_lingo!", name: "Blerina H." },
        ].map(({ stars, text, name }, i) => (
          <div key={i} className="rounded-2xl p-4 text-center" style={{ background: "#fafafa", border: "1px solid #f0f0f0" }}>
            <div className="flex justify-center gap-0.5 mb-2">
              {Array(stars).fill(0).map((_, j) => <Star key={j} className="w-3 h-3 fill-amber-400 text-amber-400" />)}
            </div>
            <p className="text-xs text-gray-600 font-medium mb-1">"{text}"</p>
            <p className="text-[10px] text-gray-400 font-bold">{name}</p>
          </div>
        ))}
      </div>

      {/* Contact */}
      <div className="text-center py-4 border-t border-gray-100">
        <p className="text-sm text-muted-foreground">
          Pyetje?{" "}
          <a href="mailto:njdj0665@gmail.com" className="font-bold text-purple-600 hover:underline">
            njdj0665@gmail.com
          </a>
          {" "}— Përgjigje brenda 24 orëve
        </p>
      </div>

      <style>{`
        @keyframes fadeInUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        @keyframes fadeInLeft { from { opacity:0; transform:translateX(-12px); } to { opacity:1; transform:translateX(0); } }
        @keyframes shimmerBar { 0% { background-position:0% 0%; } 100% { background-position:200% 0%; } }
      `}</style>
    </div>
  );
}
