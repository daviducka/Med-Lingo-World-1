import React, { useEffect, useState } from "react";
import { Check, Shield, RefreshCw, Mail, Zap, BookOpen, Brain, Award, Flame, CreditCard } from "lucide-react";

const PAYPAL_EMAIL = "njdj0665@gmail.com";
const PAYPAL_URL =
  "https://www.paypal.com/donate" +
  `?business=${encodeURIComponent(PAYPAL_EMAIL)}` +
  "&amount=15.00" +
  "&currency_code=EUR" +
  "&item_name=El_lingo+Premium+-+Abonim+Vjetor";

const features = [
  { icon: BookOpen, text: "24+ kurse mjekësore", sub: "Anatomi, Farmakologji, Fiziologji e më shumë" },
  { icon: Zap,      text: "6 lojëra interaktive", sub: "Mëso duke luajtur" },
  { icon: Brain,    text: "Dr. Denisa AI 24/7",   sub: "Asistenti juaj mjekësor AI" },
  { icon: Award,    text: "Sertifikata zyrtare",  sub: "Dëshmi e njohurive tuaja" },
  { icon: Flame,    text: "Hard Round exam",      sub: "Pyetje USMLE-style, XP dyfishi" },
  { icon: BookOpen, text: "Flashkarta & Shënime", sub: "Studimi i personalizuar" },
];

const trustBadges = [
  { icon: RefreshCw, title: "Anulo Kur të Dëlish", desc: "Pa kontratë afatgjatë" },
  { icon: Shield,    title: "Pagesa 100% Sigure",  desc: "Mbrojtur nga PayPal" },
  { icon: Mail,      title: "Faturë me Email",     desc: "Çdo vit automatikisht" },
];

export default function Pricing() {
  const [isSubscribed, setIsSubscribed]   = useState(false);
  const [isLoading, setIsLoading]         = useState(false);
  const [isHovered, setIsHovered]         = useState(false);
  const [visible, setVisible]             = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 50);
    fetch("/api/payments/is-subscribed")
      .then((r) => r.json())
      .then((data) => setIsSubscribed(data.isSubscribed))
      .catch(() => {});
    return () => clearTimeout(t);
  }, []);

  const handlePayPal = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 2000);
  };

  if (isSubscribed) {
    return (
      <div
        className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4"
        style={{ animation: "fadeInUp 0.5s ease both" }}
      >
        <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mb-6 mx-auto" style={{ animation: "scaleIn 0.4s ease both" }}>
          <Check className="w-12 h-12 text-green-600" strokeWidth={3} />
        </div>
        <h1 className="text-4xl font-bold mb-3" style={{ fontFamily: "Fredoka One, sans-serif" }}>
          Premium Aktiv! 🎓
        </h1>
        <p className="text-lg text-muted-foreground mb-8 max-w-md">
          Keni qasje të plotë — kurse, lojëra, sertifikata, AI dhe shumë më tepër.
        </p>
        <a href="/" className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-base hover:opacity-90 transition-opacity shadow-md">
          Shko në Dashboard →
        </a>
      </div>
    );
  }

  return (
    <div
      className="max-w-5xl mx-auto px-4 py-8"
      style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(20px)", transition: "opacity 0.5s ease, transform 0.5s ease" }}
    >
      {/* ── Header ── */}
      <div className="text-center mb-12">
        <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase bg-purple-100 text-purple-700 mb-4">
          El_lingo Premium
        </span>
        <h1 className="text-5xl md:text-6xl font-black mb-4 tracking-tight" style={{ fontFamily: "Fredoka One, sans-serif", background: "linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          Mëso pa Limite
        </h1>
        <p className="text-xl text-muted-foreground max-w-xl mx-auto leading-relaxed">
          Platforma mjekësore #1 për studentë. Kurse, AI, lojëra dhe sertifikata — gjithçka në një vend.
        </p>
      </div>

      {/* ── Card ── */}
      <div className="max-w-md mx-auto mb-14">
        <div
          className="relative rounded-3xl overflow-hidden shadow-2xl"
          style={{ background: "linear-gradient(145deg, #ffffff 0%, #f8f7ff 100%)", border: "1px solid rgba(124,58,237,0.15)" }}
        >
          {/* Purple top accent */}
          <div className="h-1.5 w-full" style={{ background: "linear-gradient(90deg, #7c3aed, #2563eb, #7c3aed)", backgroundSize: "200% 100%", animation: "shimmerBar 3s linear infinite" }} />

          {/* Badge */}
          <div className="absolute top-6 right-6">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-600 text-white shadow-md">
              Më i Popullarizuari
            </span>
          </div>

          <div className="p-8 pt-7">
            {/* Price */}
            <div className="mb-8">
              <div className="flex items-end gap-1 mb-1">
                <span className="text-2xl font-bold text-gray-400 mb-1">€</span>
                <span className="text-7xl font-black leading-none" style={{ fontFamily: "Fredoka One, sans-serif", color: "#7c3aed" }}>15</span>
                <span className="text-gray-500 font-medium mb-2">/vit</span>
              </div>
              <p className="text-sm text-gray-400">Pa kontratë • Anulohet kur të dëshironi</p>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-100 mb-6" />

            {/* Features */}
            <div className="space-y-4 mb-8">
              {features.map(({ icon: Icon, text, sub }, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3"
                  style={{ animation: `fadeInLeft 0.4s ease ${i * 0.07}s both` }}
                >
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "linear-gradient(135deg, #ede9fe, #dbeafe)" }}>
                    <Icon className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm leading-tight">{text}</p>
                    <p className="text-xs text-gray-400">{sub}</p>
                  </div>
                  <Check className="w-4 h-4 text-green-500 ml-auto flex-shrink-0" strokeWidth={3} />
                </div>
              ))}
            </div>

            {/* PayPal Button */}
            <a
              href={PAYPAL_URL}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className="relative flex items-center justify-center gap-3 w-full py-4 rounded-2xl font-bold text-white text-lg no-underline transition-all duration-300"
              style={{
                background: "linear-gradient(135deg, #003087 0%, #009cde 100%)",
                transform: isHovered ? "translateY(-2px)" : "translateY(0)",
                boxShadow: isHovered ? "0 12px 32px rgba(0,48,135,0.4)" : "0 4px 16px rgba(0,48,135,0.25)",
              }}
            >
              <CreditCard className="w-5 h-5" />
              Paguaj me PayPal — €15/vit
            </a>

            {/* Security note */}
            <div className="flex items-center justify-center gap-2 mt-4">
              <Shield className="w-3.5 h-3.5 text-gray-400" />
              <p className="text-xs text-gray-400">Pagesa e enkriptuar dhe e sigurt nga PayPal</p>
            </div>
          </div>
        </div>

        {/* Money-back note */}
        <p className="text-center text-xs text-muted-foreground mt-4">
          ✨ Nëse nuk jeni të kënaqur, kontaktoni brenda 7 ditëve
        </p>
      </div>

      {/* ── Trust Badges ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
        {trustBadges.map(({ icon: Icon, title, desc }, i) => (
          <div
            key={i}
            className="flex flex-col items-center text-center p-6 rounded-2xl transition-all duration-300 hover:shadow-md hover:-translate-y-1 cursor-default"
            style={{ background: "#fafafa", border: "1px solid #f0f0f0", animation: `fadeInUp 0.5s ease ${0.1 + i * 0.1}s both` }}
          >
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3" style={{ background: "linear-gradient(135deg, #ede9fe, #dbeafe)" }}>
              <Icon className="w-5 h-5 text-purple-600" />
            </div>
            <h3 className="font-bold text-gray-800 mb-1">{title}</h3>
            <p className="text-xs text-gray-500">{desc}</p>
          </div>
        ))}
      </div>

      {/* ── Footer Contact ── */}
      <div className="text-center py-6 border-t border-gray-100">
        <p className="text-sm text-muted-foreground">
          Keni pyetje?{" "}
          <a href="mailto:njdj0665@gmail.com" className="font-semibold text-purple-600 hover:underline">
            njdj0665@gmail.com
          </a>
          {" "}— Ju përgjigjemi brenda 24 orëve
        </p>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInLeft {
          from { opacity: 0; transform: translateX(-12px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.5); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes shimmerBar {
          0%   { background-position: 0% 0%; }
          100% { background-position: 200% 0%; }
        }
      `}</style>
    </div>
  );
}
