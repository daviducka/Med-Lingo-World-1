import { Router } from "express";
import { db } from "@workspace/db";
import { subscriptionsTable, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import Stripe from "stripe";

const router = Router();
const DEFAULT_USER_ID = 1;

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-12-18.acacia",
});

// Get user subscription status
router.get("/subscription", async (req, res): Promise<void> => {
  const sub = await db
    .select()
    .from(subscriptionsTable)
    .where(eq(subscriptionsTable.userId, DEFAULT_USER_ID));

  if (!sub.length) {
    res.json({ status: "inactive", isSubscribed: false });
    return;
  }

  const subscription = sub[0];
  const isActive = subscription.status === "active" && 
    (!subscription.currentPeriodEnd || new Date(subscription.currentPeriodEnd) > new Date());

  res.json({
    ...subscription,
    isSubscribed: isActive,
  });
});

// Create checkout session
router.post("/checkout", async (req, res): Promise<void> => {
  const user = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.id, DEFAULT_USER_ID));

  if (!user.length) {
    res.status(404).json({ error: "Përdoruesi nuk u gjet" });
    return;
  }

  const userData = user[0];

  try {
    // Create or get Stripe customer
    let customerId = "";
    
    const existing = await db
      .select()
      .from(subscriptionsTable)
      .where(eq(subscriptionsTable.userId, DEFAULT_USER_ID));

    if (existing.length && existing[0].stripeCustomerId) {
      customerId = existing[0].stripeCustomerId;
    } else {
      const customer = await stripe.customers.create({
        email: "edg.businessofficial@gmail.com",
        name: userData.name || "El_lingo Student",
      });
      customerId = customer.id;
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: "El_lingo Premium - Mbajta e Plotë",
              description: "Qasje e plotë në të gjithë kurset, lojërat dhe sertifikatat",
              images: ["https://emoji.aranja.com/static/emoji-data/img-google-64/1f3af.png"],
            },
            unit_amount: 1500, // 15 EUR in cents
          },
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${process.env.REPLIT_DEV_DOMAIN || "http://localhost:5173"}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.REPLIT_DEV_DOMAIN || "http://localhost:5173"}/`,
      metadata: {
        userId: DEFAULT_USER_ID,
        email: userData.email,
      },
    });

    res.json({ sessionId: session.id, url: session.url });
  } catch (err) {
    console.error("Checkout error:", err);
    res.status(500).json({ error: "Gabim në checkout" });
  }
});

// Verify payment and create/update subscription
router.post("/verify", async (req, res): Promise<void> => {
  const { sessionId } = req.body;

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      res.status(400).json({ error: "Pagesa nuk është konfirmuar" });
      return;
    }

    const customerId = session.customer as string;
    const subscriptionId = session.subscription as string;

    // Get subscription details
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);

    // Create or update subscription in DB
    const existingSub = await db
      .select()
      .from(subscriptionsTable)
      .where(eq(subscriptionsTable.userId, DEFAULT_USER_ID));

    if (existingSub.length) {
      await db
        .update(subscriptionsTable)
        .set({
          stripeSubscriptionId: subscriptionId,
          stripeCustomerId: customerId,
          status: "active",
          planType: "premium",
          price: 1500,
          currency: "eur",
          currentPeriodStart: new Date(subscription.current_period_start * 1000),
          currentPeriodEnd: new Date(subscription.current_period_end * 1000),
          updatedAt: new Date(),
        })
        .where(eq(subscriptionsTable.userId, DEFAULT_USER_ID));
    } else {
      await db.insert(subscriptionsTable).values({
        userId: DEFAULT_USER_ID,
        stripeSubscriptionId: subscriptionId,
        stripeCustomerId: customerId,
        status: "active",
        planType: "premium",
        price: 1500,
        currency: "eur",
        currentPeriodStart: new Date(subscription.current_period_start * 1000),
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      });
    }

    res.json({ success: true, message: "Abonimenti është aktivizuar!" });
  } catch (err) {
    console.error("Verification error:", err);
    res.status(500).json({ error: "Gabim në verifikim" });
  }
});

// Webhook for subscription updates
router.post("/webhook", async (req, res): Promise<void> => {
  const sig = req.headers["stripe-signature"] as string;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";

  let event;

  try {
    const body = (req as any).rawBody || JSON.stringify(req.body);
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      webhookSecret
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    res.status(400).send("Webhook Error");
    return;
  }

  // Handle subscription events
  if (event.type === "customer.subscription.updated" || event.type === "customer.subscription.created") {
    const subscription = event.data.object as Stripe.Subscription;
    const customerId = subscription.customer as string;

    const subs = await db
      .select()
      .from(subscriptionsTable)
      .where(eq(subscriptionsTable.stripeCustomerId, customerId));

    if (subs.length) {
      await db
        .update(subscriptionsTable)
        .set({
          status: subscription.status === "active" ? "active" : "inactive",
          currentPeriodEnd: new Date(subscription.current_period_end * 1000),
          updatedAt: new Date(),
        })
        .where(eq(subscriptionsTable.stripeCustomerId, customerId));
    }
  }

  if (event.type === "customer.subscription.deleted") {
    const subscription = event.data.object as Stripe.Subscription;
    const customerId = subscription.customer as string;

    await db
      .update(subscriptionsTable)
      .set({
        status: "canceled",
        canceledAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(subscriptionsTable.stripeCustomerId, customerId));
  }

  res.json({ received: true });
});

// Check if user is subscribed
router.get("/is-subscribed", async (req, res): Promise<void> => {
  const subs = await db
    .select()
    .from(subscriptionsTable)
    .where(eq(subscriptionsTable.userId, DEFAULT_USER_ID));

  if (!subs.length) {
    res.json({ isSubscribed: false });
    return;
  }

  const sub = subs[0];
  const isActive = sub.status === "active" && 
    (!sub.currentPeriodEnd || new Date(sub.currentPeriodEnd) > new Date());

  res.json({ isSubscribed: isActive });
});

export default router;
