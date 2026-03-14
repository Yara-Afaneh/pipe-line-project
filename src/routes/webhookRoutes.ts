import { Router } from "express";
import { db } from "../db/db.js";
import { webhooks, jobs } from "../db/schema.js";

const router = Router();

router.post("/", async (req, res) => {
  const apiKey = req.headers["x-api-key"];

  if (!apiKey || apiKey !== process.env.WEBHOOK_SECRET) {
    console.error("🚫 Security: Unauthorized access attempt detected!");
    return res.status(401).json({
      error: "Unauthorized",
      message: "You must provide a valid API Key to access this endpoint.",
    });
  }

  try {
    const payload = req.body;

    // 1. حفظ الـ Webhook كأرشيف (دائماً)
    const insertedWebhook = await db
      .insert(webhooks)
      .values({ payload: payload })
      .returning();

    console.log("✅ Webhook saved to DB:", insertedWebhook[0].id);

    await db.insert(jobs).values({
      data: payload,
      status: "pending",
      externalId: payload.id ? payload.id.toString() : null,
    });

    console.log(`🏃 Job created for background processing!`);

    res.status(200).json({
      message: "Data Received and Processed!",
      webhookId: insertedWebhook[0].id,
    });
  } catch (error) {
    console.error("❌ Error in Webhook Lifecycle:", error);
    if (!res.headersSent) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
});

export default router;
