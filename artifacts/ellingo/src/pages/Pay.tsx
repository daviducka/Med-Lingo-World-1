import React, { useEffect } from "react";
import { Loader } from "lucide-react";

const PAYPAL_URL =
  "https://www.paypal.com/donate" +
  "?business=njdj0665%40gmail.com" +
  "&amount=15.00" +
  "&currency_code=EUR" +
  "&item_name=El_lingo+Premium+-+Abonim+Mujor";

export default function Pay() {
  useEffect(() => {
    window.location.href = PAYPAL_URL;
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <Loader className="w-12 h-12 animate-spin text-primary mb-6" />
      <h1
        className="text-3xl font-bold mb-3"
        style={{ fontFamily: "Fredoka One, sans-serif" }}
      >
        Duke ju ridrejtuar tek PayPal...
      </h1>
      <p className="text-muted-foreground font-medium mb-2">
        Ju lutemi prisni disa sekonda.
      </p>
      <p className="text-sm text-gray-400 mt-4">
        Nëse nuk ridrejtoheni automatikisht,{" "}
        <a href={PAYPAL_URL} className="text-primary font-bold underline">
          klikoni këtu
        </a>
        .
      </p>
    </div>
  );
}
