import { Router } from "express";
import { db } from "@workspace/db";
import { subscriptionsTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();
const DEFAULT_USER_ID = 1;

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
  const isActive =
    subscription.status === "active" &&
    (!subscription.currentPeriodEnd ||
      new Date(subscription.currentPeriodEnd) > new Date());

  res.json({
    ...subscription,
    isSubscribed: isActive,
  });
});

// Activate subscription after PayPal payment
router.post("/activate", async (req, res): Promise<void> => {
  const now = new Date();
  const oneYearLater = new Date(now);
  oneYearLater.setFullYear(oneYearLater.getFullYear() + 1);

  const existing = await db
    .select()
    .from(subscriptionsTable)
    .where(eq(subscriptionsTable.userId, DEFAULT_USER_ID));

  if (existing.length > 0) {
    await db
      .update(subscriptionsTable)
      .set({
        status: "active",
        planType: "premium",
        price: 1500,
        currency: "USD",
        currentPeriodStart: now,
        currentPeriodEnd: oneYearLater,
        updatedAt: now,
      })
      .where(eq(subscriptionsTable.userId, DEFAULT_USER_ID));
  } else {
    await db.insert(subscriptionsTable).values({
      userId: DEFAULT_USER_ID,
      status: "active",
      planType: "premium",
      price: 1500,
      currency: "USD",
      currentPeriodStart: now,
      currentPeriodEnd: oneYearLater,
    });
  }

  res.json({ success: true, expiresAt: oneYearLater.toISOString() });
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
  const isActive =
    sub.status === "active" &&
    (!sub.currentPeriodEnd || new Date(sub.currentPeriodEnd) > new Date());

  res.json({ isSubscribed: isActive });
});

export default router;
