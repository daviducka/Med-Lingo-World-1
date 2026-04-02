import React, { useEffect, useState } from "react";
import { Shield } from "lucide-react";

const PAYPAL_URL =
  "https://www.paypal.com/donate" +
  "?business=gjergjielson9%40gmail.com" +
  "&amount=15.00" +
  "&currency_code=USD" +
  "&item_name=El_lingo+Premium+-+Yearly+Subscription";

export default function Pay() {
  const [dots, setDots] = useState(".");

  useEffect(() => {
    window.location.href = PAYPAL_URL;
    const interval = setInterval(() => setDots(d => d.length >= 3 ? "." : d + "."), 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4" style={{ background: "linear-gradient(135deg, #f5f3ff 0%, #eff6ff 100%)" }}>
      {/* Animated logo */}
      <div className="w-20 h-20 rounded-3xl flex items-center justify-center mb-8 shadow-xl" style={{ background: "linear-gradient(135deg, #7c3aed, #2563eb)", animation: "pulse 2s ease infinite" }}>
        <span className="text-3xl">🎓</span>
      </div>

      <h1 className="text-3xl font-black mb-2 text-gray-800" style={{ fontFamily: "Fredoka One, sans-serif" }}>
        Duke ju dërguar tek PayPal{dots}
      </h1>
      <p className="text-gray-500 mb-8 max-w-xs">
        Do të ridrejtoheni automatikisht në faqen e pagesës së sigurt.
      </p>

      {/* Loading bar */}
      <div className="w-64 h-1.5 bg-gray-200 rounded-full overflow-hidden mb-8">
        <div className="h-full rounded-full" style={{ background: "linear-gradient(90deg, #7c3aed, #2563eb)", animation: "loadBar 1.8s ease infinite" }} />
      </div>

      <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
        <Shield className="w-4 h-4" />
        <span>Pagesa e sigurt dhe e enkriptuar</span>
      </div>

      <a
        href={PAYPAL_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm font-semibold text-purple-600 hover:underline"
      >
        Nëse nuk ridrejtoheni → Klikoni këtu
      </a>

      <style>{`
        @keyframes loadBar {
          0%   { width: 0%; margin-left: 0; }
          50%  { width: 70%; margin-left: 15%; }
          100% { width: 0%; margin-left: 100%; }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); box-shadow: 0 10px 30px rgba(124,58,237,0.3); }
          50%       { transform: scale(1.05); box-shadow: 0 15px 40px rgba(124,58,237,0.5); }
        }
      `}</style>
    </div>
  );
}
