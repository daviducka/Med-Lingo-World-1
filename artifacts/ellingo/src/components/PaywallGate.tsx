import React, { useState, useEffect } from "react";
import { Shield, Stethoscope, Brain, BookOpen, Award, Zap, Check, Sparkles, Loader2, Mail } from "lucide-react";

const CONTACT_EMAIL = "gjergjielson9@gmail.com";

const features = [
  { icon: BookOpen, label: "24+ Medical Courses" },
  { icon: Brain,    label: "Dr. Denisa AI Assistant" },
  { icon: Zap,      label: "Interactive Games & Quizzes" },
  { icon: Award,    label: "Official Certificates" },
];

export default function PaywallGate({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<"loading" | "paid" | "unpaid">("loading");

  const path = window.location.pathname;
  const isPaymentReturn = path.includes("payment-success") || path.includes("paypal-return");

  useEffect(() => {
    if (isPaymentReturn) { setStatus("paid"); return; }
    fetch("/api/payments/is-subscribed")
      .then(r => r.json())
      .then((data: { isSubscribed: boolean }) => {
        setStatus(data.isSubscribed ? "paid" : "unpaid");
      })
      .catch(() => setStatus("unpaid"));
  }, [isPaymentReturn]);

  if (status === "loading") {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center"
        style={{ background: "linear-gradient(135deg, #0a0a1a 0%, #0d1a3a 100%)" }}>
        <Loader2 className="w-10 h-10 text-purple-400 animate-spin" />
      </div>
    );
  }

  if (status === "paid") return <>{children}</>;

  return (
    <div
      className="min-h-[100dvh] w-full flex flex-col items-center justify-center px-4 py-10 relative"
      style={{ background: "linear-gradient(135deg, #0a0a1a 0%, #0d1a3a 50%, #0a0a1a 100%)", zIndex: 9999 }}
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div style={{ position:"absolute", top:"15%", left:"10%", width:400, height:400, borderRadius:"50%", background:"radial-gradient(circle, rgba(124,58,237,0.18) 0%, transparent 70%)", filter:"blur(40px)" }} />
        <div style={{ position:"absolute", bottom:"15%", right:"10%", width:350, height:350, borderRadius:"50%", background:"radial-gradient(circle, rgba(0,112,186,0.18) 0%, transparent 70%)", filter:"blur(40px)" }} />
      </div>

      <div className="relative z-10 w-full max-w-md">

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
            Medical Learning Platform · Access Required
          </p>
        </div>

        <div className="rounded-3xl overflow-hidden shadow-2xl"
          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)", backdropFilter: "blur(20px)" }}>
          <div className="h-1" style={{ background: "linear-gradient(90deg, #7c3aed, #2563eb, #06b6d4)" }} />

          <div className="p-7">
            <div className="flex items-center justify-between mb-3">
              <span className="text-white font-black text-2xl" style={{ fontFamily: "Fredoka One, sans-serif" }}>
                Full Access
              </span>
              <div className="px-3 py-1 rounded-full text-xs font-black text-white flex items-center gap-1"
                style={{ background: "linear-gradient(135deg, #7c3aed, #2563eb)" }}>
                <Sparkles className="w-3 h-3" />LAUNCH PRICE
              </div>
            </div>

            <div className="flex items-end gap-1 mb-1">
              <span className="text-blue-300 text-xl font-bold mb-1">$</span>
              <span className="text-7xl font-black text-white leading-none"
                style={{ fontFamily: "Fredoka One, sans-serif" }}>15</span>
              <span className="text-blue-300 font-semibold mb-2">/year</span>
            </div>
            <p className="text-green-400 text-xs font-bold mb-6">✅ Only $1.25/month · Unlimited access for 1 year</p>

            <div className="space-y-3.5 mb-8">
              {features.map(({ icon: Icon, label }, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: "rgba(124,58,237,0.25)" }}>
                    <Icon className="w-4 h-4 text-purple-300" />
                  </div>
                  <span className="text-white/90 text-sm font-semibold">{label}</span>
                  <Check className="w-4 h-4 text-green-400 ml-auto shrink-0" strokeWidth={3} />
                </div>
              ))}
            </div>

            <a
              href={`mailto:${CONTACT_EMAIL}?subject=Med%20Lingo%20Portal%20-%20Access%20Request&body=Hi%2C%20I%20would%20like%20to%20get%20access%20to%20Med%20Lingo%20Portal.`}
              className="flex items-center justify-center gap-3 w-full py-4 rounded-2xl font-black text-white text-lg no-underline transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
              style={{
                background: "linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)",
                boxShadow: "0 8px 32px rgba(124,58,237,0.4)",
              }}
            >
              <Mail className="w-6 h-6" />
              Contact to Get Access
            </a>

            <p className="text-center text-white/40 text-xs mt-4 flex items-center justify-center gap-1">
              <Shield className="w-3 h-3" />
              {CONTACT_EMAIL}
            </p>
          </div>
        </div>

        <p className="text-center text-white/20 text-xs mt-6">
          Med Lingo Portal · Medical Education Platform · $15/year
        </p>
      </div>
    </div>
  );
}
