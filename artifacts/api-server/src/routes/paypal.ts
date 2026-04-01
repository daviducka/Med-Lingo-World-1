import { Router } from "express";
import { db } from "@workspace/db";
import { subscriptionsTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();
const DEFAULT_USER_ID = 1;

// PayPal Client Setup
const paypalClient = () => {
  const clientId = process.env.PAYPAL_CLIENT_ID || "";
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET || "";
  
  if (!clientId || !clientSecret) {
    throw new Error("PayPal credentials missing");
  }

  return { clientId, clientSecret };
};

// Get PayPal access token
async function getPayPalAccessToken(): Promise<string> {
  const { clientId, clientSecret } = paypalClient();
  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  try {
    const response = await fetch("https://api-m.paypal.com/v1/oauth2/token", {
      method: "POST",
      headers: {
        "Authorization": `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
    });

    if (!response.ok) throw new Error("Failed to get PayPal token");

    const data = (await response.json()) as { access_token: string };
    return data.access_token;
  } catch (err) {
    console.error("PayPal token error:", err);
    throw err;
  }
}

// Create PayPal subscription
router.post("/create-subscription", async (req, res): Promise<void> => {
  try {
    const accessToken = await getPayPalAccessToken();
    const planId = process.env.PAYPAL_PLAN_ID || "P-6XM5N8K9Q4R5S6T7";

    const response = await fetch("https://api-m.paypal.com/v1/billing/subscriptions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        "PayPal-Request-Id": `${DEFAULT_USER_ID}-${Date.now()}`,
      },
      body: JSON.stringify({
        plan_id: planId,
        subscriber: {
          name: {
            given_name: "El_lingo",
            surname: "Student",
          },
          email_address: "edg.businessofficial@gmail.com",
        },
        application_context: {
          brand_name: "El_lingo",
          locale: "sq_AL",
          user_action: "SUBSCRIBE_NOW",
          return_url: `${process.env.REPLIT_DEV_DOMAIN || "http://localhost:5173"}/paypal-return`,
          cancel_url: `${process.env.REPLIT_DEV_DOMAIN || "http://localhost:5173"}/pricing`,
        },
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw error;
    }

    const data = (await response.json()) as { id: string; links: Array<{ rel: string; href: string }> };

    // Find approve link
    const approveLink = data.links.find(link => link.rel === "approve");

    res.json({
      subscriptionId: data.id,
      approvalUrl: approveLink?.href,
    });
  } catch (err) {
    console.error("PayPal create subscription error:", err);
    res.status(500).json({ error: "Gabim në krijimin e abonimit" });
  }
});

// Verify PayPal subscription
router.post("/verify-subscription", async (req, res): Promise<void> => {
  const { subscriptionId } = req.body;

  try {
    const accessToken = await getPayPalAccessToken();

    const response = await fetch(
      `https://api-m.paypal.com/v1/billing/subscriptions/${subscriptionId}`,
      {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      res.status(400).json({ error: "Abonimi nuk u gjet" });
      return;
    }

    const subscription = (await response.json()) as {
      id: string;
      status: string;
      billing_cycles: Array<{ tenure_type: string; sequence: number; total_cycles: number; pricing_scheme: { fixed_price: { value: string } } }>;
      start_time: string;
    };

    // Only accept ACTIVE subscriptions
    if (subscription.status !== "ACTIVE") {
      res.status(400).json({ error: "Abonimi nuk është aktiv" });
      return;
    }

    // Save to database
    const existingSub = await db
      .select()
      .from(subscriptionsTable)
      .where(eq(subscriptionsTable.userId, DEFAULT_USER_ID));

    if (existingSub.length) {
      await db
        .update(subscriptionsTable)
        .set({
          stripeSubscriptionId: subscriptionId, // Reuse for PayPal too
          status: "active",
          planType: "premium",
          price: 1500,
          currency: "eur",
          currentPeriodStart: new Date(subscription.start_time),
          currentPeriodEnd: new Date(new Date(subscription.start_time).getTime() + 30 * 24 * 60 * 60 * 1000),
          updatedAt: new Date(),
        })
        .where(eq(subscriptionsTable.userId, DEFAULT_USER_ID));
    } else {
      await db.insert(subscriptionsTable).values({
        userId: DEFAULT_USER_ID,
        stripeSubscriptionId: subscriptionId,
        status: "active",
        planType: "premium",
        price: 1500,
        currency: "eur",
        currentPeriodStart: new Date(subscription.start_time),
        currentPeriodEnd: new Date(new Date(subscription.start_time).getTime() + 30 * 24 * 60 * 60 * 1000),
      });
    }

    res.json({ success: true, message: "Abonimi PayPal u aktivizua!" });
  } catch (err) {
    console.error("PayPal verify error:", err);
    res.status(500).json({ error: "Gabim në verifikim" });
  }
});

export default router;
