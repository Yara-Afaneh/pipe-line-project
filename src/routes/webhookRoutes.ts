import { Router } from "express";
import { db } from "../db/db.js";
import { webhooks, jobs } from "../db/schema.js";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const payload = req.body;

    const insertedWebhook = await db
      .insert(webhooks)
      .values({
        payload: payload,
      })
      .returning();

    console.log("✅ Webhook saved to DB:", insertedWebhook[0].id);

    if (payload && payload.type === "new_task") {
      await db.insert(jobs).values({
        externalId: payload.id?.toString(),
        status: "pending",
        data: payload,
      });
      console.log("🏃 Job created for background processing!");
    }

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
