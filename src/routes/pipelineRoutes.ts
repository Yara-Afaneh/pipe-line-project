import { Router } from "express";
import { db } from "../db/db.js";
import { pipelines, subscribers } from "../db/schema.js";

const router = Router();

router.post("/", async (req, res) => {
  const { name, actionType, subscriberUrls } = req.body;

  try {
    console.log("📥 Received pipeline data:", {
      name,
      actionType,
      subscriberUrls,
    });
const newPipeline = await db
      .insert(pipelines)
      .values({ 
        name: name, 
        actionType: actionType 
      })
      .returning();
    const pipelineId = newPipeline[0].id;

    if (subscriberUrls && subscriberUrls.length > 0) {
      const subValues = subscriberUrls.map((url: string) => ({
        pipelineId,
        url,
      }));
      await db.insert(subscribers).values(subValues);
    }

    res.status(201).json({ message: "Pipeline created!", pipelineId });
  } catch (error) {
    res.status(500).json({ error: "Failed to create pipeline" });
  }
});

export default router;