import axios from "axios";
import { db } from "./db/db.js";
import { jobs, subscribers, pipelines } from "./db/schema.js";
import { eq } from "drizzle-orm";

export async function processJobs() {
  const allJobs = await db.select().from(jobs);

  if (allJobs.length === 0) {
    console.log("📭 Database Check: No jobs found in table.");
    return;
  }

  const pendingJobs = allJobs.filter(
    (j) =>
      j.status?.toLowerCase() === "pending" ||
      j.status === null ||
      j.status === "",
  );
  console.log(
    `📊 Stats: Total Jobs: ${allJobs.length} | Pending Jobs Found: ${pendingJobs.length}`,
  );

  for (const job of pendingJobs) {
    try {
      console.log(`⚙️ Starting to Process Job: ${job.id}`);

      const pipelineResult = await db
        .select()
        .from(pipelines)
        .where(eq(pipelines.id, job.pipelineId));

      const pipeline = pipelineResult[0];

      if (!pipeline) {
        console.error(`❌ Pipeline NOT FOUND for ID: ${job.pipelineId}`);
        continue;
      }

      console.log(
        `🔍 Found Pipeline: [${pipeline.actionType}] for Job: ${job.id}`,
      );

      let processedData = job.data;
      const action = pipeline.actionType.toUpperCase();

      if (action === "UPPERCASE") {
        processedData = JSON.parse(JSON.stringify(job.data).toUpperCase());
      } else if (action === "ADD_TIMESTAMP" || action === "TRANSFORM") {
        processedData = { ...(job.data as object), processed_at: new Date() };
      } else if (action === "CLEANSE") {
        processedData = Object.fromEntries(
          Object.entries(job.data as object).filter(([_, v]) => v != null),
        );
      } else if (action === "OBFUSCATE") {
        const temp = { ...(job.data as any) };
        if (temp.email) temp.email = "******@hidden.com";
        processedData = temp;
      } else if (action === "COUNT_KEYS") {
        const keyCount = Object.keys(job.data as object).length;
        processedData = {
          ...(job.data as object),
          _metadata: { total_fields: keyCount },
        };
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
        console.log(`✅ Sent Successfully to: ${sub.url}`);
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
      console.error(`❌ Error in job ${job.id}:`, error.message);
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
