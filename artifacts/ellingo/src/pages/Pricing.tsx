import React, { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const PAYPAL_EMAIL = "njdj0665@gmail.com";
const PRICE = "15.00";
const CURRENCY = "EUR";
const RETURN_PATH = "/payment-success";
const CANCEL_PATH = "/pricing";

export default function Pricing() {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    setOrigin(window.location.origin);
    fetch("/api/payments/is-subscribed")
      .then(r => r.json())
      .then(data => setIsSubscribed(data.isSubscribed))
      .catch(() => setIsSubscribed(false));
  }, []);

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
          <div className="space-y-3 mb-8">
            {[
              "24+ kurse mjekësore",
              "6 lojëra interaktive",
              "Dr. Denisa AI 24/7",
              "Sertifikatat",
              "Hard Round exam",
              "Flashkarta & Shënime",
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                <span className="text-sm font-medium text-gray-700">{feature}</span>
              </div>
            ))}
          </div>

          {/* PayPal Direct Form */}
          <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">
            <input type="hidden" name="cmd" value="_xclick-subscriptions" />
            <input type="hidden" name="business" value={PAYPAL_EMAIL} />
            <input type="hidden" name="item_name" value="El_lingo Premium - Abonim Mujor" />
            <input type="hidden" name="a3" value={PRICE} />
            <input type="hidden" name="p3" value="1" />
            <input type="hidden" name="t3" value="M" />
            <input type="hidden" name="src" value="1" />
            <input type="hidden" name="currency_code" value={CURRENCY} />
            <input type="hidden" name="return" value={origin + RETURN_PATH} />
            <input type="hidden" name="cancel_return" value={origin + CANCEL_PATH} />
            <input type="hidden" name="no_note" value="1" />
            <input type="hidden" name="no_shipping" value="1" />
            <button
              type="submit"
              className="w-full py-4 text-lg font-bold rounded-2xl bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 shadow-lg text-white transition-all"
            >
              🅿️ Paguaj me PayPal
            </button>
          </form>

          {/* Secure payment badge */}
          <div className="text-center mt-6">
            <p className="text-xs text-gray-500 font-semibold">🔒 Pagesa e sigurt përmes PayPal</p>
          </div>
        </div>
      </div>

      {/* Quick Info */}
      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="text-center p-4 bg-muted rounded-2xl">
          <p className="text-2xl mb-2">📅</p>
          <h3 className="font-bold mb-1">Anulo Kur të Dëlish</h3>
          <p className="text-xs text-muted-foreground">Nuk ka kontratë përjetese</p>
        </div>
        <div className="text-center p-4 bg-muted rounded-2xl">
          <p className="text-2xl mb-2">🔒</p>
          <h3 className="font-bold mb-1">Pagesa Sigure</h3>
          <p className="text-xs text-muted-foreground">Përmes PayPal të besueshëm</p>
        </div>
        <div className="text-center p-4 bg-muted rounded-2xl">
          <p className="text-2xl mb-2">📧</p>
          <h3 className="font-bold mb-1">Email Reçeta</h3>
          <p className="text-xs text-muted-foreground">Çdo muaj i rregullt</p>
        </div>
      </div>

      {/* Contact */}
      <div className="mt-8 text-center">
        <p className="text-muted-foreground font-medium">
          Pyetje? Kontaktohuni në{" "}
          <a
            href="mailto:njdj0665@gmail.com"
            className="text-primary font-bold hover:underline"
          >
            njdj0665@gmail.com
          </a>
        </p>
      </div>
    </div>
  );
}
