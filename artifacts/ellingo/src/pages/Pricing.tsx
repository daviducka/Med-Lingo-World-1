import React from "react";
import { Check, BookOpen, Zap, Brain, Award, Flame, Star } from "lucide-react";

const PAYPAL_EMAIL = "gjergjielson9@gmail.com";
export const PAYPAL_URL =
  "https://www.paypal.com/cgi-bin/webscr" +
  `?cmd=_xclick&business=${encodeURIComponent(PAYPAL_EMAIL)}` +
  "&amount=15.00" +
  "&currency_code=USD" +
  "&item_name=Med+Lingo+Portal+-+Yearly+Subscription" +
  "&no_shipping=1" +
  "&return=https%3A%2F%2Fellingo.replit.app%2Fpayment-success" +
  "&cancel_return=https%3A%2F%2Fellingo.replit.app%2Fpricing";

const features = [
  { icon: BookOpen, text: "24+ medical courses", sub: "Anatomy, Pharmacology, Physiology & more" },
  { icon: Zap,      text: "6 interactive games", sub: "Learn while playing" },
  { icon: Brain,    text: "Dr. Denisa AI 24/7",  sub: "Your personal medical AI assistant" },
  { icon: Award,    text: "Official certificates", sub: "Proof of your knowledge" },
  { icon: Flame,    text: "Hard Round exam",     sub: "USMLE-style questions, double XP" },
  { icon: BookOpen, text: "Flashcards & Notes",  sub: "Personalized study tools" },
];

export default function Pricing() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8" style={{ animation: "fadeInUp 0.5s ease both" }}>
      <div className="text-center mb-10">
        <span className="inline-block px-4 py-1.5 rounded-full text-xs font-black tracking-widest uppercase bg-purple-100 text-purple-700 mb-4">
          Med Lingo Portal Premium
        </span>
        <h1 className="text-5xl font-black mb-3" style={{ fontFamily: "Fredoka One, sans-serif", background: "linear-gradient(135deg, #7c3aed, #2563eb)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          Learn Without Limits
        </h1>
        <p className="text-lg text-muted-foreground max-w-md mx-auto">
          Full access to all medical materials — courses, AI, games and certificates.
        </p>
      </div>

      <div className="rounded-3xl overflow-hidden shadow-2xl mb-6" style={{ border: "1px solid rgba(124,58,237,0.15)" }}>
        <div className="h-1.5" style={{ background: "linear-gradient(90deg, #7c3aed, #2563eb, #7c3aed)", backgroundSize: "200%", animation: "shimmerBar 3s linear infinite" }} />

        <div className="bg-white p-8">
          <div className="flex items-end gap-1 mb-1">
            <span className="text-2xl font-bold text-gray-400 mb-1">$</span>
            <span className="text-7xl font-black leading-none" style={{ fontFamily: "Fredoka One, sans-serif", color: "#7c3aed" }}>15</span>
            <span className="text-gray-500 font-medium mb-2">/year</span>
          </div>
          <p className="text-sm text-gray-400 mb-1">No contract · Cancel anytime · Launch price</p>
          <p className="text-xs text-green-600 font-bold mb-6">✅ That's only $1.25/month!</p>

          <div className="border-t border-gray-100 mb-6" />

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

          <a
            href={PAYPAL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 w-full py-4 rounded-2xl font-bold text-white text-lg no-underline transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0"
            style={{ background: "linear-gradient(135deg, #003087 0%, #009cde 100%)", boxShadow: "0 6px 24px rgba(0,48,135,0.35)" }}
          >
            <img src="https://www.paypalobjects.com/webstatic/icon/pp258.png" alt="PayPal" className="w-6 h-6 rounded" />
            Pay with PayPal — $15/year
          </a>

          <div className="flex items-center justify-center gap-2 mt-4">
            <span className="text-xs text-gray-400">🔒 Secure payment via PayPal</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-8">
        {[
          { stars: 5, text: "Best medical platform!", name: "Arta M." },
          { stars: 5, text: "Dr. Denisa AI is amazing", name: "Erion K." },
          { stars: 5, text: "Passed my exam thanks to Med Lingo!", name: "Blerina H." },
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

      <div className="text-center py-4 border-t border-gray-100">
        <p className="text-sm text-muted-foreground">
          Questions?{" "}
          <a href="mailto:gjergjielson9@gmail.com" className="font-bold text-purple-600 hover:underline">
            gjergjielson9@gmail.com
          </a>
          {" "}— Reply within 24 hours
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
