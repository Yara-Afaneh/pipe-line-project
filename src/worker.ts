import axios from "axios";
import { db } from "./db/db.js";
import { jobs, subscribers } from "./db/schema.js";
import { eq } from "drizzle-orm";

export async function processJobs() {
  const pendingJobs = await db
    .select()
    .from(jobs)
    .where(eq(jobs.status, "pending"));

  for (const job of pendingJobs) {
    try {
      const pipelineSubscribers = await db
        .select()
        .from(subscribers)
        .where(eq(subscribers.pipelineId, job.pipelineId));

      for (const sub of pipelineSubscribers) {
        await axios.post(sub.url, job.data);
        console.log(`✅    sending successfully : ${sub.url}`);
      }

      await db
        .update(jobs)
        .set({ status: "completed" })
        .where(eq(jobs.id, job.id));
    } catch (error) {
      console.error(`❌  error   ${job.id}:`, error.message);
      await db
        .update(jobs)
        .set({ status: "failed" })
        .where(eq(jobs.id, job.id));
    }
  }
}
