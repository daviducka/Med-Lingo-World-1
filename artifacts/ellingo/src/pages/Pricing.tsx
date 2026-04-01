import React, { useState, useEffect } from "react";
import { Check, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Pricing() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Check subscription status
    fetch("/api/payments/is-subscribed")
      .then(r => r.json())
      .then(data => setIsSubscribed(data.isSubscribed))
      .catch(() => setIsSubscribed(false));
  }, []);

  const handleCheckout = async () => {
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/payments/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) throw new Error("Gabim në checkout");

      const { url } = await res.json();
      if (url) {
        window.location.href = url;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gabim i panjohur");
      setIsLoading(false);
    }
  };

  if (isSubscribed) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20">
        <div className="text-7xl mb-4">✅</div>
        <h1 className="text-4xl font-bold mb-2" style={{ fontFamily: 'Fredoka One, sans-serif' }}>
          Mirë se vjen!
        </h1>
        <p className="text-lg text-muted-foreground mb-6 font-semibold">
          Abonimenti juaj Premium është aktiv
        </p>
        <p className="text-muted-foreground font-medium mb-8">
          Keni qasje të plotë në të gjithë kurset, lojërat, sertifikatat dhe shënimet!
        </p>
        <Button href="/" className="rounded-2xl font-bold px-8 py-3 text-lg">
          Kthehu në Shtëpi
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold mb-3 shimmer-text" style={{ fontFamily: 'Fredoka One, sans-serif' }}>
          El_lingo Premium 🎓
        </h1>
        <p className="text-xl text-muted-foreground font-semibold">
          Zgjero njohuritë mjekësore me akses të plotë
        </p>
      </div>

      {/* Pricing Card */}
      <div className="max-w-md mx-auto mb-10">
        <div className="bg-gradient-to-br from-purple-50 to-blue-50 border-3 border-purple-300 rounded-3xl p-8 shadow-xl">
          {/* Price */}
          <div className="text-center mb-8">
            <div className="text-5xl font-bold text-purple-700 mb-2">€15</div>
            <p className="text-gray-600 font-semibold">çdo muaj</p>
            <p className="text-sm text-gray-500 mt-2">Nuk ka kontratë - Anuloj kur të dëlish</p>
          </div>

          {/* Features */}
          <div className="space-y-4 mb-8">
            {[
              "✅ Qasje në 24+ kurse mjekësore",
              "✅ 6 lojëra interaktive arsimore",
              "✅ Dr. Denisa AI chatbot 24/7",
              "✅ EL Notes me mbrojtje PIN",
              "✅ Sertifikatat e plotë (4 lloje)",
              "✅ Flashkarta të personalizuara",
              "✅ Hard Round exam simulator",
              "✅ Statistika progrese të detajuara",
            ].map((feature, i) => (
              <div key={i} className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="font-medium text-gray-700">{feature}</span>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <Button
            onClick={handleCheckout}
            disabled={isLoading}
            className="w-full py-6 text-lg font-bold rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg"
          >
            {isLoading ? (
              <>
                <Loader className="w-5 h-5 mr-2 animate-spin" />
                Duke përpunuar...
              </>
            ) : (
              "Fillo Premium Tani"
            )}
          </Button>

          {error && (
            <p className="text-red-600 font-bold text-sm mt-4 text-center">{error}</p>
          )}

          {/* Secure payment badge */}
          <div className="text-center mt-6">
            <p className="text-xs text-gray-500 font-semibold">🔒 Pagesa e sigurt përmes Stripe</p>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="mt-16 bg-card border-2 border-border rounded-3xl p-8">
        <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: 'Fredoka One, sans-serif' }}>
          Pyetje të Shpeshta
        </h2>
        <div className="space-y-6">
          <div>
            <h3 className="font-bold text-lg mb-2">📅 A mund ta anuloj në çdo kohë?</h3>
            <p className="text-muted-foreground font-medium">Po! Mund ta anulosh abonimin tuaj në çdo moment pa diçka shtesë. Përdoruesit marrin qasje deri në fund të periudhës aktuale të faturimit.</p>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-2">🔒 A është sigura pagesa ime?</h3>
            <p className="text-muted-foreground font-medium">Absolutisht! Përdorim Stripe, një platforme pagese e kërkuar globalisht. Të dhënat tuaja të kartës nuk ruhen në serverët tanë.</p>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-2">📧 Si do të ndodh pagesa?</h3>
            <p className="text-muted-foreground font-medium">Stripe do të dërgojë reçeta në email. Pagesa pritet çdo muaj në të njëjtën ditë si kur u regjistruarit.</p>
          </div>
        </div>
      </div>

      {/* Contact */}
      <div className="mt-8 text-center">
        <p className="text-muted-foreground font-medium">
          Pyetje? Kontaktohuni në{" "}
          <a
            href="mailto:edg.businessofficial@gmail.com"
            className="text-primary font-bold hover:underline"
          >
            edg.businessofficial@gmail.com
          </a>
        </p>
      </div>
    </div>
  );
}
