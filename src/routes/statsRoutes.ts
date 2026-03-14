import { sql } from 'drizzle-orm';
import { jobs } from '../db/schema.js';
import express from "express";
import { db } from '../db/db.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const stats = await db.select({
      status: jobs.status,
      count: sql<number>`count(*)`
    })
    .from(jobs)
    .groupBy(jobs.status);

    res.json({
      message: "📊 Yara's System Health Overview",
      stats: stats,
      timestamp: new Date()
    });
  } catch (error) {
    console.error("Error in stats:", error);
    res.status(500).json({ error: "Could not fetch stats" });
  }
});

export default router;