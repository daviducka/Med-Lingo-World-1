import React, { useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";

export default function PaymentSuccess() {
  const [, navigate] = useLocation();

  useEffect(() => {
    const timer = setTimeout(() => navigate("/"), 5000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="max-w-2xl mx-auto text-center py-20">
      <div className="text-8xl mb-6">✅</div>
      <h1 className="text-4xl font-bold mb-3 text-green-600" style={{ fontFamily: 'Fredoka One, sans-serif' }}>
        Faleminderit për Pagesën!
      </h1>
      <p className="text-lg text-muted-foreground font-semibold mb-2">
        Mirë se vjen në El_lingo Premium! 🎓
      </p>
      <p className="text-muted-foreground font-medium mb-2">
        Abonimenti juaj është aktivizuar dhe keni qasje të plotë.
      </p>
      <p className="text-muted-foreground font-medium mb-8">
        Do të merrni një email konfirmimi nga PayPal.
      </p>
      <p className="text-sm text-gray-400 mb-6">Duke u drejtuar në shtëpi pas 5 sekondash...</p>
      <Button onClick={() => navigate("/")} className="rounded-2xl font-bold px-8 py-3 text-lg">
        Shko në Shtëpi
      </Button>
    </div>
  );
}
