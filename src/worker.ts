import axios from "axios";
import { db } from "./db/db.js";
import { jobs, subscribers, pipelines } from "./db/schema.js";
import { eq } from "drizzle-orm";

export async function processJobs() {
  const pendingJobs = await db
    .select()
    .from(jobs)
    .where(eq(jobs.status, "pending"));

  for (const job of pendingJobs) {
    try {
      console.log(`⚙️ Processing Job: ${job.id}`);

      const [pipeline] = await db
        .select()
        .from(pipelines)
        .where(eq(pipelines.id, job.pipelineId));

      let processedData = job.data;

      if (pipeline) {
        if (pipeline.actionType === "UPPERCASE") {
          processedData = JSON.parse(JSON.stringify(job.data).toUpperCase());
        } else if (pipeline.actionType === "TRANSFORM") {
          processedData = { ...(job.data as object), processed_at: new Date() };
        } else if (pipeline.actionType === "CLEANSE") {
          processedData = Object.fromEntries(
            Object.entries(job.data as object).filter(([_, v]) => v != null),
          );
        } else if (pipeline.actionType === "OBFUSCATE") {
          processedData = { ...(job.data as object) };
          if ((processedData as any).email) {
            (processedData as any).email = "******@hidden.com";
          }
        } else if (pipeline.actionType === "COUNT_KEYS") {
          const keyCount = Object.keys(job.data as object).length;
          processedData = {
            ...(job.data as object),
            _metadata: { total_fields: keyCount },
          };
        }
      }

      const pipelineSubscribers = await db
        .select()
        .from(subscribers)
        .where(eq(subscribers.pipelineId, job.pipelineId));

      for (const sub of pipelineSubscribers) {
        await axios.post(sub.url, {
          original: job.data,
          processed: processedData,
        });
        console.log(`✅ Sent to: ${sub.url}`);
      }

      await db
        .update(jobs)
        .set({
          status: "completed",
          result: processedData,
          updatedAt: new Date(),
        })
        .where(eq(jobs.id, job.id));
    } catch (error: any) {
      console.error(`❌ Error processing job ${job.id}:`, error.message);
      await db
        .update(jobs)
        .set({
          status: "failed",
          error: error.message,
          updatedAt: new Date(),
        })
        .where(eq(jobs.id, job.id));
    }
  }
}

export function startWorker() {
  console.log("⚙️ Worker Interval Started (Every 10s)");
  setInterval(async () => {
    try {
      await processJobs();
    } catch (err) {
      console.error("Worker Interval Error:", err);
    }
  }, 10000);
}
