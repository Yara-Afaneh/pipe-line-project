import { Router } from "express";
import { db } from "../db/db.js";
import { webhooks, jobs } from "../db/schema.js";

const router = Router();

router.post("/:pipelineId", async (req, res) => {
  const { pipelineId } = req.params;
  const payload = req.body;
  const apiKey = req.headers["x-api-key"];

  if (!apiKey || apiKey !== process.env.WEBHOOK_SECRET) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    await db.insert(webhooks).values({
      pipelineId,
      payload,
    });

    await db.insert(jobs).values({
      pipelineId,
      data: payload,
      status: "pending",
    });

    console.log(`✅ Webhook received for Pipeline: ${pipelineId}`);
    res.status(202).json({ message: "Accepted and Queued" });
  } catch (error) {
    res.status(500).json({ error: "Ingestion Failed" });
  }
});

export default router;
