import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "wouter";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";

export default function PaymentSuccess() {
  const [location] = useLocation();
  const [, navigate] = useNavigate();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get("session_id");

    if (!sessionId) {
      setStatus("error");
      return;
    }

    // Verify payment
    fetch("/api/payments/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId }),
    })
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          setStatus("success");
          // Redirect after 3 seconds
          setTimeout(() => navigate("/"), 3000);
        } else {
          setStatus("error");
        }
      })
      .catch(() => setStatus("error"));
  }, [navigate]);

  return (
    <div className="max-w-2xl mx-auto text-center py-20">
      {status === "loading" && (
        <>
          <Loader className="w-16 h-16 animate-spin mx-auto mb-6 text-primary" />
          <h1 className="text-3xl font-bold mb-3" style={{ fontFamily: 'Fredoka One, sans-serif' }}>
            Duke konfirmuar pagesen...
          </h1>
          <p className="text-muted-foreground font-semibold">Ju lutemi prisni</p>
        </>
      )}

      {status === "success" && (
        <>
          <div className="text-8xl mb-6">✅</div>
          <h1 className="text-4xl font-bold mb-3 text-green-600" style={{ fontFamily: 'Fredoka One, sans-serif' }}>
            Pagesa u Pranua!
          </h1>
          <p className="text-lg text-muted-foreground font-semibold mb-2">
            Mirë se vjen në El_lingo Premium! 🎓
          </p>
          <p className="text-muted-foreground font-medium mb-8">
            Abonimenti juaj është aktivizuar dhe keni qasje të plotë
          </p>
          <p className="text-sm text-gray-500 mb-6">Duke u drejtuar në shtëpi...</p>
          <Button href="/" className="rounded-2xl font-bold px-8 py-3 text-lg">
            Shko në Shtëpi
          </Button>
        </>
      )}

      {status === "error" && (
        <>
          <div className="text-8xl mb-6">❌</div>
          <h1 className="text-4xl font-bold mb-3 text-red-600" style={{ fontFamily: 'Fredoka One, sans-serif' }}>
            Gabim në Pagese
          </h1>
          <p className="text-lg text-muted-foreground font-semibold mb-6">
            Diçka shkoi keq. Ju lutemi provoni përsëri.
          </p>
          <div className="flex gap-3 justify-center">
            <Button variant="outline" onClick={() => navigate("/")} className="rounded-2xl font-bold">
              Kthehu
            </Button>
            <Button onClick={() => navigate("/pricing")} className="rounded-2xl font-bold">
              Provo Përsëri
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
