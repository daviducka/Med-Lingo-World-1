import React, { useEffect } from "react";
import { useLocation } from "wouter";
import { markAsPaid } from "@/components/PaywallGate";

export default function PaymentSuccess() {
  const [, navigate] = useLocation();

  useEffect(() => {
    markAsPaid();
    const timer = setTimeout(() => navigate("/"), 4000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-[100dvh] flex flex-col items-center justify-center px-4"
      style={{ background: "linear-gradient(135deg, #0a0a1a 0%, #0d1a3a 100%)" }}>
      <div className="text-center">
        <div className="text-8xl mb-6" style={{ animation: "bounceIn 0.6s ease" }}>✅</div>
        <h1 className="text-4xl font-black text-white mb-3"
          style={{ fontFamily: "Fredoka One, sans-serif" }}>
          Payment Confirmed!
        </h1>
        <p className="text-blue-300 font-semibold text-lg mb-2">
          Welcome to Med Lingo Portal 🎓
        </p>
        <p className="text-white/50 text-sm mb-8">
          Your yearly access is now active. Opening portal...
        </p>
        <div className="w-48 h-1.5 rounded-full mx-auto overflow-hidden" style={{ background: "rgba(255,255,255,0.1)" }}>
          <div className="h-full rounded-full" style={{ background: "linear-gradient(90deg, #7c3aed, #2563eb)", animation: "growBar 4s linear forwards" }} />
        </div>
      </div>
      <style>{`
        @keyframes bounceIn { 0%{transform:scale(0.3);opacity:0} 60%{transform:scale(1.1)} 100%{transform:scale(1);opacity:1} }
        @keyframes growBar { from{width:0%} to{width:100%} }
      `}</style>
    </div>
  );
}
