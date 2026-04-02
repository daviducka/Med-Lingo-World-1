import React, { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";

export default function PayPalReturn() {
  const [, navigate] = useLocation();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const subscriptionId = params.get("subscription_id");

    if (!subscriptionId) {
      // No subscription_id — still activate via the direct activate endpoint
      fetch("/api/payments/activate", { method: "POST" })
        .then(r => r.json())
        .then(data => {
          if (data.success) {
            setStatus("success");
            setTimeout(() => navigate("/"), 3000);
          } else {
            setStatus("error");
          }
        })
        .catch(() => setStatus("error"));
      return;
    }

    fetch("/api/paypal/verify-subscription", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subscriptionId }),
    })
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          setStatus("success");
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
            Confirming PayPal payment...
          </h1>
          <p className="text-muted-foreground font-semibold">Please wait</p>
        </>
      )}

      {status === "success" && (
        <>
          <div className="text-8xl mb-6">✅</div>
          <h1 className="text-4xl font-bold mb-3 text-green-600" style={{ fontFamily: 'Fredoka One, sans-serif' }}>
            Payment Accepted!
          </h1>
          <p className="text-lg text-muted-foreground font-semibold mb-2">
            Welcome to Med Lingo Portal Premium! 🎓
          </p>
          <p className="text-muted-foreground font-medium mb-8">
            Your access has been activated
          </p>
          <p className="text-sm text-gray-500 mb-6">Redirecting to home...</p>
        </>
      )}

      {status === "error" && (
        <>
          <div className="text-8xl mb-6">❌</div>
          <h1 className="text-4xl font-bold mb-3 text-red-600" style={{ fontFamily: 'Fredoka One, sans-serif' }}>
            Payment Error
          </h1>
          <p className="text-lg text-muted-foreground font-semibold mb-6">
            Something went wrong. Please try again.
          </p>
          <div className="flex gap-3 justify-center">
            <Button variant="outline" onClick={() => navigate("/")} className="rounded-2xl font-bold">
              Go Back
            </Button>
            <Button onClick={() => navigate("/pricing")} className="rounded-2xl font-bold">
              Try Again
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
