import React, { useState, useEffect } from "react";
import { Shield, Stethoscope, Brain, BookOpen, Award, Zap, Check, Sparkles } from "lucide-react";

const PAYPAL_URL =
  "https://www.paypal.com/cgi-bin/webscr" +
  "?cmd=_xclick" +
  "&business=gjergjielson9%40gmail.com" +
  "&amount=15.00" +
  "&currency_code=USD" +
  "&item_name=Med+Lingo+Portal+-+Yearly+Access" +
  "&no_shipping=1";

const PAID_KEY = "medlingo_paid_v1";

export function markAsPaid() {
  localStorage.setItem(PAID_KEY, "true");
}

export function isPaid(): boolean {
  return localStorage.getItem(PAID_KEY) === "true";
}

const features = [
  { icon: BookOpen, label: "24+ Medical Courses" },
  { icon: Brain,    label: "Dr. Denisa AI Assistant" },
  { icon: Zap,      label: "Interactive Games & Quizzes" },
  { icon: Award,    label: "Official Certificates" },
];

export default function PaywallGate({ children }: { children: React.ReactNode }) {
  const [paid, setPaid] = useState<boolean | null>(null);

  useEffect(() => {
    setPaid(isPaid());
  }, []);

  if (paid === null) return null;
  if (paid) return <>{children}</>;

  return (
    <div className="min-h-[100dvh] flex flex-col items-center justify-center px-4 py-10"
      style={{ background: "linear-gradient(135deg, #0a0a1a 0%, #0d1a3a 50%, #0a0a1a 100%)" }}>

      {/* Glow blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div style={{ position:"absolute", top:"15%", left:"10%", width:400, height:400, borderRadius:"50%", background:"radial-gradient(circle, rgba(124,58,237,0.18) 0%, transparent 70%)", filter:"blur(40px)" }} />
        <div style={{ position:"absolute", bottom:"15%", right:"10%", width:350, height:350, borderRadius:"50%", background:"radial-gradient(circle, rgba(0,112,186,0.18) 0%, transparent 70%)", filter:"blur(40px)" }} />
      </div>

      <div className="relative z-10 w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl mb-4 shadow-2xl"
            style={{ background: "linear-gradient(135deg, #7c3aed, #2563eb)" }}>
            <Stethoscope className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-black text-white mb-1"
            style={{ fontFamily: "Fredoka One, sans-serif", letterSpacing: "-0.5px" }}>
            Med Lingo Portal
          </h1>
          <p className="text-blue-300 text-sm font-semibold tracking-wide">
            Medical Learning Platform
          </p>
        </div>

        {/* Card */}
        <div className="rounded-3xl overflow-hidden shadow-2xl"
          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", backdropFilter: "blur(20px)" }}>

          {/* Top bar */}
          <div className="h-1" style={{ background: "linear-gradient(90deg, #7c3aed, #2563eb, #06b6d4)" }} />

          <div className="p-7">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white font-black text-2xl" style={{ fontFamily: "Fredoka One, sans-serif" }}>
                Full Access
              </span>
              <div className="px-3 py-1 rounded-full text-xs font-black text-white"
                style={{ background: "linear-gradient(135deg, #7c3aed, #2563eb)" }}>
                <Sparkles className="w-3 h-3 inline mr-1" />LAUNCH PRICE
              </div>
            </div>

            {/* Price */}
            <div className="flex items-end gap-1 mb-1">
              <span className="text-blue-300 text-xl font-bold mb-1">$</span>
              <span className="text-6xl font-black text-white leading-none"
                style={{ fontFamily: "Fredoka One, sans-serif" }}>15</span>
              <span className="text-blue-300 font-semibold mb-1">/year</span>
            </div>
            <p className="text-green-400 text-xs font-bold mb-6">✅ Only $1.25/month · Unlimited access</p>

            {/* Features */}
            <div className="space-y-3 mb-7">
              {features.map(({ icon: Icon, label }, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: "rgba(124,58,237,0.25)" }}>
                    <Icon className="w-3.5 h-3.5 text-purple-300" />
                  </div>
                  <span className="text-white/90 text-sm font-semibold">{label}</span>
                  <Check className="w-3.5 h-3.5 text-green-400 ml-auto shrink-0" strokeWidth={3} />
                </div>
              ))}
            </div>

            {/* PayPal Button */}
            <a
              href={PAYPAL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 w-full py-4 rounded-2xl font-black text-white text-lg no-underline transition-all duration-200 hover:-translate-y-0.5 hover:shadow-2xl active:translate-y-0"
              style={{
                background: "linear-gradient(135deg, #003087 0%, #009cde 100%)",
                boxShadow: "0 8px 32px rgba(0,48,135,0.5)",
              }}
            >
              <img
                src="https://www.paypalobjects.com/webstatic/icon/pp258.png"
                alt="PayPal"
                className="w-7 h-7 rounded-md"
              />
              Pay $15/year with PayPal
            </a>

            <p className="text-center text-white/40 text-xs mt-3 flex items-center justify-center gap-1">
              <Shield className="w-3 h-3" />
              Secure payment · After paying, come back and click below
            </p>

            {/* Already paid button */}
            <button
              onClick={() => { markAsPaid(); setPaid(true); }}
              className="w-full mt-4 py-3 rounded-2xl text-sm font-bold transition-all hover:bg-white/10"
              style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,255,255,0.1)" }}
            >
              ✅ I already paid — Open Portal
            </button>
          </div>
        </div>

        <p className="text-center text-white/25 text-xs mt-6">
          Med Lingo Portal · Medical Education Platform · $15/year
        </p>
      </div>
    </div>
  );
}
